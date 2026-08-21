import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import f1_score, roc_auc_score, brier_score_loss
from xgboost import XGBClassifier
import shap
import joblib
import os
import sys
import mlflow
from mlflow.models import infer_signature
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Add src to path so we can import features
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from features import build_features

def train_models():
    # Set MLflow tracking URI to a local sqlite database
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    mlflow.set_experiment("aerodrift_predictive_maintenance")
    
    # Load data
    train_df = pd.read_csv("data/train_data.csv")
    test_df = pd.read_csv("data/test_data.csv")
    
    # Feature engineering
    print("Building features...")
    train_feat = build_features(train_df)
    test_feat = build_features(test_df)
    
    # Features and target
    drop_cols = ['machine_id', 'cycle', 'RUL', 'label_fail_in_30']
    features = [c for c in train_feat.columns if c not in drop_cols]
    
    X_train = train_feat[features]
    y_train = train_feat['label_fail_in_30']
    X_test = test_feat[features]
    y_test = test_feat['label_fail_in_30']
    
    # 1. Baseline Logistic Regression (no MLflow tracking needed for baseline, but we can if we want)
    print("Training Logistic Regression baseline...")
    lr_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('lr', LogisticRegression(max_iter=1000, random_state=42))
    ])
    calibrated_lr = CalibratedClassifierCV(lr_pipeline, method='isotonic', cv=3)
    calibrated_lr.fit(X_train, y_train)
    
    # 2. XGBoost with MLflow tracking
    with mlflow.start_run(run_name="xgboost_candidate") as run:
        # Log feature/version metadata
        mlflow.log_param("num_features", len(features))
        mlflow.log_param("train_samples", len(X_train))
        mlflow.log_param("data_version", "synthetic_cmapss_v1")
        
        # XGBoost hyperparams
        xgb_params = {
            "n_estimators": 100,
            "max_depth": 5,
            "learning_rate": 0.1,
            "random_state": 42,
            "eval_metric": "logloss"
        }
        mlflow.log_params(xgb_params)
        
        print("Training XGBoost...")
        xgb = XGBClassifier(**xgb_params)
        calibrated_xgb = CalibratedClassifierCV(xgb, method='isotonic', cv=3)
        calibrated_xgb.fit(X_train, y_train)
        
        # Evaluation
        xgb_preds = calibrated_xgb.predict(X_test)
        xgb_probs = calibrated_xgb.predict_proba(X_test)[:, 1]
        
        metrics = {
            "f1_score": f1_score(y_test, xgb_preds),
            "roc_auc": roc_auc_score(y_test, xgb_probs),
            "brier_score": brier_score_loss(y_test, xgb_probs)
        }
        
        mlflow.log_metrics(metrics)
        print("XGBoost Metrics:", metrics)
        
        # Save model and features locally for backup
        os.makedirs("models", exist_ok=True)
        joblib.dump(features, "models/features.pkl")
        joblib.dump(calibrated_xgb, "models/xgboost_prod.pkl")
        
        # Log feature list as an MLflow artifact
        mlflow.log_artifact("models/features.pkl")
        
        # Verify SHAP on XGBoost
        print("\nExtracting SHAP values...")
        base_estimator = calibrated_xgb.calibrated_classifiers_[0].estimator
        explainer = shap.TreeExplainer(base_estimator)
        high_risk_idx = np.where(xgb_probs > 0.8)[0]
        if len(high_risk_idx) > 0:
            sample_idx = high_risk_idx[:5]
            sample_x = X_test.iloc[sample_idx]
            shap_values = explainer.shap_values(sample_x)
            print(f"Successfully computed SHAP values for {len(sample_idx)} high-risk samples.")
        
        # Log model to MLflow Model Registry
        signature = infer_signature(X_train, xgb_preds)
        model_info = mlflow.sklearn.log_model(
            sk_model=calibrated_xgb,
            artifact_path="model",
            signature=signature,
            registered_model_name="AeroDrift_XGBoost",
            serialization_format=mlflow.sklearn.SERIALIZATION_FORMAT_PICKLE
        )
        print(f"Model logged with URI: {model_info.model_uri}")
        
        # Set tags for candidate vs production
        client = mlflow.MlflowClient()
        version = model_info.registered_model_version
        
        # Tag as 'Candidate'
        client.set_model_version_tag(
            name="AeroDrift_XGBoost",
            version=version,
            key="stage",
            value="Candidate"
        )
        
        # Save run info for tests
        run_info = {
            "run_id": run.info.run_id,
            "model_version": version,
            "model_uri": model_info.model_uri
        }
        joblib.dump(run_info, "models/latest_run_info.pkl")
        
    return run_info

if __name__ == "__main__":
    train_models()

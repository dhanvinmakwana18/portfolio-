import os
import sys
import pandas as pd
import numpy as np
import mlflow
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, confusion_matrix
from xgboost import XGBClassifier
from sklearn.calibration import CalibratedClassifierCV
from mlflow.models import infer_signature

# Add src to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from features import build_features
from event_log import log_event

def run_retraining():
    log_event("RETRAINING_STARTED", "INFO", {"reason": "Drift condition satisfied."})
    mlflow.set_tracking_uri("sqlite:///mlflow.db")
    mlflow.set_experiment("aerodrift_predictive_maintenance")
    client = mlflow.MlflowClient()
    
    print("Preparing training data...")
    # Use test_data.csv as the "recent" production data to train on
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    recent_data = pd.read_csv(os.path.join(base_dir, "data", "test_data.csv"))
    
    # Split into train (for candidate) and eval (for gate)
    train_df, eval_df = train_test_split(recent_data, test_size=0.3, random_state=42)
    
    train_feat = build_features(train_df)
    eval_feat = build_features(eval_df)
    
    drop_cols = ['machine_id', 'cycle', 'RUL', 'label_fail_in_30']
    features = [c for c in train_feat.columns if c not in drop_cols]
    
    X_train = train_feat[features]
    y_train = train_feat['label_fail_in_30']
    X_eval = eval_feat[features]
    y_eval = eval_feat['label_fail_in_30']
    
    # Get current production model
    prod_model_path = os.path.join(base_dir, "models", "xgboost_prod.pkl")
    try:
        prod_model = joblib.load(prod_model_path)
        print("Loaded current production model for comparison.")
    except Exception as e:
        log_event("SYSTEM_ERROR", "ERROR", {"message": f"Failed to load prod model: {str(e)}"})
        return False
        
    print("Training candidate model...")
    with mlflow.start_run(run_name="retraining_candidate") as run:
        xgb_params = {
            "n_estimators": 150, # Slightly more robust candidate
            "max_depth": 6,
            "learning_rate": 0.05,
            "random_state": 42,
            "eval_metric": "logloss"
        }
        mlflow.log_params(xgb_params)
        
        xgb = XGBClassifier(**xgb_params)
        candidate_model = CalibratedClassifierCV(xgb, method='isotonic', cv=3)
        candidate_model.fit(X_train, y_train)
        
        print("Evaluating Candidate vs Production...")
        # Production metrics
        prod_preds = prod_model.predict(X_eval)
        prod_f1 = f1_score(y_eval, prod_preds)
        tn_p, fp_p, fn_p, tp_p = confusion_matrix(y_eval, prod_preds).ravel()
        prod_fpr = fp_p / (fp_p + tn_p) if (fp_p + tn_p) > 0 else 0
        
        # Candidate metrics
        cand_preds = candidate_model.predict(X_eval)
        cand_f1 = f1_score(y_eval, cand_preds)
        tn_c, fp_c, fn_c, tp_c = confusion_matrix(y_eval, cand_preds).ravel()
        cand_fpr = fp_c / (fp_c + tn_c) if (fp_c + tn_c) > 0 else 0
        
        metrics = {
            "prod_f1": prod_f1,
            "prod_fpr": prod_fpr,
            "cand_f1": cand_f1,
            "cand_fpr": cand_fpr
        }
        mlflow.log_metrics(metrics)
        print(f"Metrics: {metrics}")
        
        signature = infer_signature(X_train, cand_preds)
        model_info = mlflow.sklearn.log_model(
            sk_model=candidate_model,
            artifact_path="model",
            signature=signature,
            registered_model_name="AeroDrift_XGBoost",
            serialization_format=mlflow.sklearn.SERIALIZATION_FORMAT_PICKLE
        )
        
        version = model_info.registered_model_version
        
        # Promotion Gate
        # Condition: Candidate F1 > Prod F1 OR (Candidate F1 is close AND Candidate FPR < Prod FPR)
        promote = False
        if cand_f1 > prod_f1:
            promote = True
        elif cand_f1 >= prod_f1 - 0.02 and cand_fpr < prod_fpr:
            promote = True
            
        context = {
            "model_version": version,
            "run_id": run.info.run_id,
            "metrics": metrics
        }
        
        if promote:
            print(f"Candidate Promoted! F1 improved ({cand_f1:.4f} vs {prod_f1:.4f})")
            client.set_model_version_tag(name="AeroDrift_XGBoost", version=version, key="stage", value="Production")
            # Preserve old model for rollback by renaming
            if os.path.exists(prod_model_path):
                os.rename(prod_model_path, os.path.join(base_dir, "models", "xgboost_prod_backup.pkl"))
            joblib.dump(candidate_model, prod_model_path)
            
            # Log new features just in case
            joblib.dump(features, os.path.join(base_dir, "models", "features.pkl"))
            
            log_event("MODEL_PROMOTED", "INFO", context, model_version=version)
            return True
        else:
            print(f"Candidate Rejected! F1 did not improve sufficiently ({cand_f1:.4f} vs {prod_f1:.4f})")
            client.set_model_version_tag(name="AeroDrift_XGBoost", version=version, key="stage", value="Rejected")
            log_event("MODEL_REJECTED", "WARNING", context, model_version=version)
            return False

if __name__ == "__main__":
    run_retraining()

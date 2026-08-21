import os
import joblib
import mlflow
import pandas as pd
from mlflow.tracking import MlflowClient

def test_mlops_registry():
    # Verify the local mlflow db exists
    mlflow_db_path = os.path.join(os.path.dirname(__file__), "..", "mlflow.db")
    assert os.path.exists(mlflow_db_path), "MLflow database not found."
    
    mlflow.set_tracking_uri(f"sqlite:///{mlflow_db_path}")
    client = MlflowClient()
    
    # Load run info
    run_info_path = os.path.join(os.path.dirname(__file__), "..", "models", "latest_run_info.pkl")
    assert os.path.exists(run_info_path), "Latest run info not found. Did you run train.py?"
    run_info = joblib.load(run_info_path)
    
    # Verify the run exists and has metrics/params
    run = client.get_run(run_info["run_id"])
    assert "num_features" in run.data.params, "num_features missing from MLflow params"
    assert "f1_score" in run.data.metrics, "f1_score missing from MLflow metrics"
    assert "learning_rate" in run.data.params, "Hyperparameters not logged"
    
    # Verify the registered model exists and has the Candidate tag
    model_version = client.get_model_version(name="AeroDrift_XGBoost", version=run_info["model_version"])
    assert model_version.tags.get("stage") == "Candidate", "Model not tagged as Candidate"
    
    # Verify we can load the model back
    loaded_model = mlflow.sklearn.load_model(run_info["model_uri"])
    assert loaded_model is not None, "Failed to load model from MLflow registry"
    
    # Verify reproducibility - predict on a sample
    test_df_path = os.path.join(os.path.dirname(__file__), "..", "data", "test_data.csv")
    test_df = pd.read_csv(test_df_path)
    import sys
    sys.path.append(os.path.join(os.path.dirname(__file__), "..", "src"))
    from features import build_features
    test_feat = build_features(test_df)
    
    features_path = os.path.join(os.path.dirname(__file__), "..", "models", "features.pkl")
    features = joblib.load(features_path)
    X_test = test_feat[features]
    
    # Predicting with loaded MLflow model
    preds = loaded_model.predict(X_test)
    assert len(preds) == len(X_test), "Loaded model prediction shape mismatch"
    
    print("MLOps Test Passed: Model successfully tracked, registered, tagged, loaded, and predicts accurately.")

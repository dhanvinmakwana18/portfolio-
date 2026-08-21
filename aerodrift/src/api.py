from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import mlflow
import sqlite3
from typing import List, Dict, Any
from evidently.legacy.report import Report
from evidently.legacy.metric_preset import DataDriftPreset

app = FastAPI(title="AeroDrift API")

# Global state for streaming feature engineering
MACHINE_STATE = {}
REFERENCE_DATA = None
PRODUCTION_MODEL = None
FEATURES_LIST = None

DB_PATH = "inference.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS predictions
                 (timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, 
                  machine_id INTEGER, 
                  cycle INTEGER, 
                  prediction REAL, 
                  probability REAL,
                  drift_detected INTEGER DEFAULT 0)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS inference_data
                 (timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                  machine_id INTEGER,
                  cycle INTEGER,
                  feature_json TEXT)''')
    conn.commit()
    conn.close()

@app.on_event("startup")
def load_artifacts():
    global PRODUCTION_MODEL, FEATURES_LIST, REFERENCE_DATA
    init_db()
    
    # Resolve absolute paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    mlflow_db_path = os.path.join(base_dir, "mlflow.db")
    mlflow.set_tracking_uri(f"sqlite:///{mlflow_db_path}")
    
    try:
        run_info = joblib.load(os.path.join(base_dir, "models", "latest_run_info.pkl"))
        PRODUCTION_MODEL = mlflow.sklearn.load_model(run_info["model_uri"])
        FEATURES_LIST = joblib.load(os.path.join(base_dir, "models", "features.pkl"))
        print("Successfully loaded model from MLflow registry")
    except Exception as e:
        print(f"Warning: Could not load model from MLflow. {e}")
    
    # Load reference data (from train set) for drift detection
    try:
        import sys
        sys.path.append(os.path.join(base_dir, "src"))
        from features import build_features
        train_df = pd.read_csv(os.path.join(base_dir, "data", "train_data.csv"))
        train_feat = build_features(train_df)
        REFERENCE_DATA = train_feat[FEATURES_LIST].copy()
        print("Successfully loaded reference data for drift detection")
    except Exception as e:
        print(f"Warning: Could not load reference data. {e}")

class TelemetryData(BaseModel):
    machine_id: int
    cycle: int
    setting_1: float
    setting_2: float
    sensor_1: float
    sensor_2: float
    sensor_3: float
    sensor_4: float
    sensor_5: float

def compute_streaming_features(machine_id, new_data_dict):
    """
    Stateful feature computation for a single machine.
    """
    if machine_id not in MACHINE_STATE:
        MACHINE_STATE[machine_id] = []
        
    state = MACHINE_STATE[machine_id]
    state.append(new_data_dict)
    
    # Keep only last 5 to compute rolling features
    if len(state) > 5:
        state.pop(0)
        
    df = pd.DataFrame(state)
    sensor_cols = [c for c in df.columns if c.startswith('sensor_')]
    
    rolling_window = 5
    current = df.iloc[-1:].copy()
    
    # Temporal Volatility (Rolling std)
    for c in sensor_cols:
        current[f"{c}_rolling_std_{rolling_window}"] = df[c].std() if len(df) > 1 else 0.0
        
    # Lag indicators (EWMA)
    for c in sensor_cols:
        current[f"{c}_ewma_{rolling_window}"] = df[c].ewm(span=rolling_window, min_periods=1).mean().iloc[-1]
        
    # Contextual normalization
    for c in sensor_cols:
        initial = df[c].iloc[0] # Approximated by the window start
        current[f"{c}_norm_initial"] = current[c] / initial if initial != 0 else 1.0
        
    return current

@app.post("/predict")
def predict(data: TelemetryData):
    if PRODUCTION_MODEL is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
        
    data_dict = data.dict()
    machine_id = data_dict['machine_id']
    
    # Compute features
    feat_df = compute_streaming_features(machine_id, data_dict)
    
    # Ensure columns match FEATURES_LIST exactly
    X = feat_df[FEATURES_LIST].fillna(0)
    
    # Predict
    prob = float(PRODUCTION_MODEL.predict_proba(X)[0, 1])
    pred = int(PRODUCTION_MODEL.predict(X)[0])
    
    # Save inference to DB
    import json
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO predictions (machine_id, cycle, prediction, probability) VALUES (?, ?, ?, ?)",
              (machine_id, data_dict['cycle'], pred, prob))
    c.execute("INSERT INTO inference_data (machine_id, cycle, feature_json) VALUES (?, ?, ?)",
              (machine_id, data_dict['cycle'], json.dumps(X.iloc[0].to_dict())))
    conn.commit()
    conn.close()
    
    return {
        "machine_id": machine_id,
        "cycle": data_dict['cycle'],
        "risk_probability": prob,
        "will_fail": bool(pred)
    }

@app.post("/ingest_telemetry")
def ingest_telemetry(data: TelemetryData):
    # In a full deployment, this would be decoupled from /predict
    # For now, it simply acknowledges the payload.
    return {"status": "Telemetry ingested successfully", "machine_id": data.machine_id, "cycle": data.cycle}

@app.post("/ingest_labels")
def ingest_labels(machine_id: int, cycle: int, actual_failure: bool):
    # Used for delayed actuals reporting to compute true model performance in production
    return {"status": "Label ingested", "machine_id": machine_id, "actual_failure": actual_failure}

@app.get("/mlops/drift_status")
def check_drift():
    if REFERENCE_DATA is None:
        return {"error": "Reference data not available"}
        
    # Get last inferences
    conn = sqlite3.connect(DB_PATH)
    df_live = pd.read_sql_query("SELECT feature_json FROM inference_data ORDER BY timestamp DESC LIMIT 1000", conn)
    conn.close()
    
    if len(df_live) < 10:
        return {"status": "Not enough data for drift detection (min 10)"}
        
    import json
    live_features = pd.DataFrame([json.loads(x) for x in df_live['feature_json']])
    
    # Reorder to match REFERENCE_DATA
    live_features = live_features[FEATURES_LIST]
    
    # Run Evidently Drift Report
    report = Report(metrics=[DataDriftPreset()])
    report.run(reference_data=REFERENCE_DATA.sample(min(1000, len(REFERENCE_DATA)), random_state=42), 
               current_data=live_features)
    
    result = report.as_dict()
    drift_detected = result['metrics'][0]['result']['dataset_drift']
    
    return {
        "drift_detected": drift_detected,
        "num_inferences_analyzed": len(live_features),
        "share_of_drifted_columns": result['metrics'][0]['result']['share_of_drifted_columns']
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

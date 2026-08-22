from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import mlflow
import sqlite3
import subprocess
from typing import List, Dict, Any
from evidently.legacy.report import Report
from evidently.legacy.metric_preset import DataDriftPreset
import sys

app = FastAPI(title="AeroDrift API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state for streaming feature engineering
MACHINE_STATE = {}
REFERENCE_DATA = None
PRODUCTION_MODEL = None
FEATURES_LIST = None

DB_PATH = "inference.db"

# Add src to path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(base_dir, "src"))
from retrain import run_retraining
from event_log import log_event, get_recent_events

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

def reload_model_and_features():
    global PRODUCTION_MODEL, FEATURES_LIST, REFERENCE_DATA
    mlflow_db_path = os.path.join(base_dir, "mlflow.db")
    mlflow.set_tracking_uri(f"sqlite:///{mlflow_db_path}")
    
    try:
        # Load from models backup instead of mlflow for speed
        prod_path = os.path.join(base_dir, "models", "xgboost_prod.pkl")
        if os.path.exists(prod_path):
            PRODUCTION_MODEL = joblib.load(prod_path)
            FEATURES_LIST = joblib.load(os.path.join(base_dir, "models", "features.pkl"))
            print("Successfully loaded model from models directory")
    except Exception as e:
        print(f"Warning: Could not load model. {e}")

@app.on_event("startup")
def load_artifacts():
    global REFERENCE_DATA
    init_db()
    
    reload_model_and_features()
    
    # Load reference data (from train set) for drift detection
    try:
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
    if machine_id not in MACHINE_STATE:
        MACHINE_STATE[machine_id] = []
        
    state = MACHINE_STATE[machine_id]
    state.append(new_data_dict)
    
    if len(state) > 5:
        state.pop(0)
        
    df = pd.DataFrame(state)
    sensor_cols = [c for c in df.columns if c.startswith('sensor_')]
    
    rolling_window = 5
    current = df.iloc[-1:].copy()
    
    for c in sensor_cols:
        current[f"{c}_rolling_std_{rolling_window}"] = df[c].std() if len(df) > 1 else 0.0
        
    for c in sensor_cols:
        current[f"{c}_ewma_{rolling_window}"] = df[c].ewm(span=rolling_window, min_periods=1).mean().iloc[-1]
        
    for c in sensor_cols:
        initial = df[c].iloc[0]
        current[f"{c}_norm_initial"] = current[c] / initial if initial != 0 else 1.0
        
    return current

@app.post("/predict")
def predict(data: TelemetryData):
    if PRODUCTION_MODEL is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
        
    data_dict = data.dict()
    machine_id = data_dict['machine_id']
    
    feat_df = compute_streaming_features(machine_id, data_dict)
    X = feat_df[FEATURES_LIST].fillna(0)
    
    prob = float(PRODUCTION_MODEL.predict_proba(X)[0, 1])
    pred = int(PRODUCTION_MODEL.predict(X)[0])
    
    import json
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO predictions (machine_id, cycle, prediction, probability) VALUES (?, ?, ?, ?)",
              (machine_id, data_dict['cycle'], pred, prob))
    c.execute("INSERT INTO inference_data (machine_id, cycle, feature_json) VALUES (?, ?, ?)",
              (machine_id, data_dict['cycle'], json.dumps(X.iloc[0].to_dict())))
    conn.commit()
    conn.close()
    
    # Randomly log an event sometimes? No, event logs are for MLOps actions.
    
    return {
        "machine_id": machine_id,
        "cycle": data_dict['cycle'],
        "risk_probability": prob,
        "will_fail": bool(pred)
    }

@app.post("/ingest_telemetry")
def ingest_telemetry(data: TelemetryData):
    log_event("DATA_INGESTED", "INFO", {"machine_id": data.machine_id, "cycle": data.cycle})
    return {"status": "Telemetry ingested successfully", "machine_id": data.machine_id, "cycle": data.cycle}

@app.post("/ingest_labels")
def ingest_labels(machine_id: int, cycle: int, actual_failure: bool):
    return {"status": "Label ingested", "machine_id": machine_id, "actual_failure": actual_failure}

@app.get("/mlops/drift_status")
def check_drift(background_tasks: BackgroundTasks):
    if REFERENCE_DATA is None:
        return {"error": "Reference data not available"}
        
    conn = sqlite3.connect(DB_PATH)
    df_live = pd.read_sql_query("SELECT feature_json FROM inference_data ORDER BY timestamp DESC LIMIT 1000", conn)
    conn.close()
    
    if len(df_live) < 10:
        return {"status": "Not enough data for drift detection (min 10)"}
        
    import json
    live_features = pd.DataFrame([json.loads(x) for x in df_live['feature_json']])
    live_features = live_features[FEATURES_LIST]
    
    report = Report(metrics=[DataDriftPreset()])
    report.run(reference_data=REFERENCE_DATA.sample(min(1000, len(REFERENCE_DATA)), random_state=42), 
               current_data=live_features)
    
    result = report.as_dict()
    drift_detected = result['metrics'][0]['result']['dataset_drift']
    share_of_drifted_columns = result['metrics'][0]['result']['share_of_drifted_columns']
    
    if drift_detected:
        log_event("DRIFT_DETECTED", "WARNING", {"share_drifted": share_of_drifted_columns})
        # Trigger retraining asynchronously
        background_tasks.add_task(trigger_retraining)
    
    return {
        "drift_detected": drift_detected,
        "num_inferences_analyzed": len(live_features),
        "share_of_drifted_columns": share_of_drifted_columns
    }

def trigger_retraining():
    success = run_retraining()
    if success:
        log_event("RETRAINING_COMPLETED", "INFO", {"result": "Candidate promoted. Reloading API model."})
        reload_model_and_features()
    else:
        log_event("RETRAINING_COMPLETED", "INFO", {"result": "Candidate rejected. Keeping existing model."})

@app.post("/mlops/retrain")
def manual_retrain(background_tasks: BackgroundTasks):
    background_tasks.add_task(trigger_retraining)
    return {"status": "Retraining task queued."}

@app.post("/mlops/rollback")
def rollback_model():
    backup_path = os.path.join(base_dir, "models", "xgboost_prod_backup.pkl")
    prod_path = os.path.join(base_dir, "models", "xgboost_prod.pkl")
    if os.path.exists(backup_path):
        import shutil
        shutil.copy(backup_path, prod_path)
        reload_model_and_features()
        log_event("MODEL_ROLLBACK", "WARNING", {"action": "Reverted to backup production model."})
        return {"status": "Rollback successful."}
    else:
        return {"error": "No backup model available."}

@app.get("/mlops/events")
def get_events(limit: int = 50):
    return get_recent_events(limit)

@app.get("/machines")
def get_machines():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    # Get latest prediction for each machine
    c.execute('''
        SELECT machine_id, cycle, prediction, probability, timestamp
        FROM predictions
        WHERE (machine_id, cycle) IN (
            SELECT machine_id, MAX(cycle) FROM predictions GROUP BY machine_id
        )
    ''')
    rows = c.fetchall()
    conn.close()
    
    machines = []
    for r in rows:
        machines.append({
            "machine_id": r["machine_id"],
            "cycle": r["cycle"],
            "will_fail": bool(r["prediction"]),
            "risk_probability": r["probability"],
            "timestamp": r["timestamp"],
            "status": "Critical" if r["probability"] > 0.8 else ("Warning" if r["probability"] > 0.4 else "Healthy")
        })
    return machines

@app.get("/machines/{machine_id}")
def get_machine_detail(machine_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('''
        SELECT p.cycle, p.prediction, p.probability, p.timestamp, i.feature_json
        FROM predictions p
        JOIN inference_data i ON p.machine_id = i.machine_id AND p.cycle = i.cycle
        WHERE p.machine_id = ?
        ORDER BY p.cycle ASC
    ''', (machine_id,))
    rows = c.fetchall()
    conn.close()
    
    history = []
    import json
    for r in rows:
        history.append({
            "cycle": r["cycle"],
            "prediction": bool(r["prediction"]),
            "risk_probability": r["probability"],
            "timestamp": r["timestamp"],
            "features": json.loads(r["feature_json"])
        })
    return history

@app.get("/machines/{machine_id}/shap")
def get_machine_shap(machine_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('''
        SELECT feature_json FROM inference_data
        WHERE machine_id = ?
        ORDER BY cycle DESC LIMIT 1
    ''', (machine_id,))
    row = c.fetchone()
    conn.close()
    
    if not row or not PRODUCTION_MODEL:
        return {"error": "Data or model unavailable"}
        
    import json
    import shap
    features = json.loads(row["feature_json"])
    
    try:
        # SHAP calculation for XGBoost (calibrated)
        base_estimator = PRODUCTION_MODEL.calibrated_classifiers_[0].estimator
        explainer = shap.TreeExplainer(base_estimator)
        X = pd.DataFrame([features])[FEATURES_LIST].fillna(0)
        shap_values = explainer.shap_values(X)[0]
        
        # Sort by absolute impact
        shap_dict = [{"feature": f, "value": features[f], "impact": float(s)} for f, s in zip(FEATURES_LIST, shap_values)]
        shap_dict.sort(key=lambda x: abs(x["impact"]), reverse=True)
        return shap_dict[:10] # Top 10
    except Exception as e:
        return {"error": str(e)}

@app.get("/predictions")
def get_predictions(limit: int = 20):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM predictions ORDER BY timestamp DESC LIMIT ?', (limit,))
    rows = c.fetchall()
    conn.close()
    
    return [dict(r) for r in rows]

STREAMER_PROC = None

@app.post("/streamer/start")
def start_streamer(mode: str = "NORMAL"):
    global STREAMER_PROC
    if STREAMER_PROC and STREAMER_PROC.poll() is None:
        return {"status": "Streamer is already running"}
    
    STREAMER_PROC = subprocess.Popen(
        [sys.executable, "-u", "src/streamer.py", "--mode", mode, "--max_requests", "200"],
        cwd=base_dir
    )
    log_event("SYSTEM_INFO", "INFO", {"message": f"Streamer started in {mode} mode"})
    return {"status": "Streamer started", "mode": mode}

@app.post("/streamer/stop")
def stop_streamer():
    global STREAMER_PROC
    if STREAMER_PROC and STREAMER_PROC.poll() is None:
        STREAMER_PROC.kill()
        STREAMER_PROC = None
        log_event("SYSTEM_INFO", "INFO", {"message": "Streamer stopped"})
        return {"status": "Streamer stopped"}
    return {"status": "Streamer not running"}

@app.get("/mlops/models")
def get_mlops_models():
    client = mlflow.MlflowClient()
    try:
        # Just getting the registered model versions
        versions = client.search_model_versions("name='AeroDrift_XGBoost'")
        result = []
        for v in versions:
            run = client.get_run(v.run_id)
            metrics = run.data.metrics
            result.append({
                "version": v.version,
                "stage": v.aliases[0] if v.aliases else next((t.value for t in v.tags.values() if t.key == 'stage'), 'None'), # Wait, tags is a dict. Let's handle safely.
                "run_id": v.run_id,
                "metrics": metrics,
                "timestamp": v.creation_timestamp
            })
        
        # Safe extraction
        final_result = []
        for v in versions:
            run = client.get_run(v.run_id)
            metrics = run.data.metrics
            stage = v.tags.get('stage', 'None')
            final_result.append({
                "version": v.version,
                "stage": stage,
                "run_id": v.run_id,
                "metrics": metrics,
                "timestamp": v.creation_timestamp
            })
            
        return final_result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

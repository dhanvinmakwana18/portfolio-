import requests
import time
import subprocess
import os
import json
import sqlite3
import pandas as pd

API_URL = "http://localhost:8000"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "inference.db")
MLFLOW_DB_PATH = os.path.join(BASE_DIR, "mlflow.db")

def clear_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print("Cleared inference.db")

def start_api():
    print("Starting API Server for Audit...")
    proc = subprocess.Popen(["python", "-m", "uvicorn", "src.api:app", "--port", "8000"])
    
    # wait for startup
    for _ in range(15):
        try:
            requests.get(f"{API_URL}/machines")
            print("API Server is UP.")
            return proc
        except:
            time.sleep(1)
    
    raise Exception("API Server failed to start.")

def run_streamer(mode, max_req=50):
    print(f"Running Streamer in {mode} mode for {max_req} requests...")
    proc = subprocess.Popen(["python", "src/streamer.py", "--mode", mode, "--max_requests", str(max_req)])
    proc.communicate()
    print("Streamer finished.")

def get_drift_status():
    res = requests.get(f"{API_URL}/mlops/drift_status")
    return res.json()

def run_audit():
    results = {}
    
    # 1. Clean environment start
    clear_db()
    api_proc = start_api()
    
    try:
        # 2. Performance Check & Failure Testing
        print("Testing Failure Conditions...")
        # Invalid telemetry
        res = requests.post(f"{API_URL}/predict", json={"machine_id": "abc"})
        results["failure_invalid_payload"] = (res.status_code == 422)
        
        print("Testing NORMAL telemetry...")
        start_t = time.time()
        run_streamer("NORMAL", 50)
        end_t = time.time()
        results["normal_throughput_req_per_sec"] = 50 / (end_t - start_t)
        
        drift_normal = get_drift_status()
        results["normal_drift_detected"] = drift_normal.get("drift_detected", False)
        results["normal_drift_share"] = drift_normal.get("share_of_drifted_columns", 0)
        
        # 3. Model Validation
        res = requests.get(f"{API_URL}/machines")
        machines = res.json()
        if machines:
            mid = machines[0]["machine_id"]
            shap_res = requests.get(f"{API_URL}/machines/{mid}/shap")
            results["shap_works"] = (shap_res.status_code == 200 and len(shap_res.json()) > 0)
        else:
            results["shap_works"] = False
            
        print("Testing DRIFT telemetry...")
        run_streamer("DRIFT", 100)
        drift_drift = get_drift_status()
        results["drift_drift_detected"] = drift_drift.get("drift_detected", False)
        results["drift_drift_share"] = drift_drift.get("share_of_drifted_columns", 0)
        
        # 4. Autonomous Lifecycle Validation
        print("Waiting for retraining worker to complete (if triggered)...")
        time.sleep(15) # Wait for background retraining to finish
        
        models_res = requests.get(f"{API_URL}/mlops/models").json()
        results["model_versions_count"] = len(models_res)
        
        events_res = requests.get(f"{API_URL}/mlops/events").json()
        retrain_events = [e for e in events_res if e["event_type"] == "RETRAINING_COMPLETED"]
        results["retraining_triggered"] = len(retrain_events) > 0
        if retrain_events:
            results["retraining_result"] = retrain_events[0]["context"].get("result", "")
        
        # 5. Rollback Validation
        print("Testing Rollback...")
        rollback_res = requests.post(f"{API_URL}/mlops/rollback")
        results["rollback_successful"] = (rollback_res.status_code == 200)
        
        events_res = requests.get(f"{API_URL}/mlops/events").json()
        rollback_events = [e for e in events_res if e["event_type"] == "MODEL_ROLLBACK"]
        results["rollback_logged"] = len(rollback_events) > 0
        
        # 6. API Latency Measurement
        latencies = []
        for _ in range(10):
            t0 = time.time()
            requests.get(f"{API_URL}/machines")
            latencies.append(time.time() - t0)
        results["avg_api_latency_ms"] = (sum(latencies) / len(latencies)) * 1000
        
    finally:
        api_proc.terminate()
        api_proc.wait()
        
    print(json.dumps(results, indent=2))
    
    with open("audit_results.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run_audit()

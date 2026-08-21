import pandas as pd
import requests
import time
import os

API_URL = "http://localhost:8000/predict"

def stream_data(csv_path="../data/test_data.csv", delay_seconds=0.1, max_requests=100):
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    # Sort by cycle across all machines to simulate time progression
    df = df.sort_values(by=['cycle', 'machine_id'])
    
    count = 0
    print(f"Starting telemetry stream to {API_URL}...")
    for idx, row in df.iterrows():
        if count >= max_requests:
            break
            
        payload = {
            "machine_id": int(row['machine_id']),
            "cycle": int(row['cycle']),
            "setting_1": float(row['setting_1']),
            "setting_2": float(row['setting_2']),
            "sensor_1": float(row['sensor_1']),
            "sensor_2": float(row['sensor_2']),
            "sensor_3": float(row['sensor_3']),
            "sensor_4": float(row['sensor_4']),
            "sensor_5": float(row['sensor_5'])
        }
        
        try:
            response = requests.post(API_URL, json=payload)
            if response.status_code == 200:
                res = response.json()
                print(f"[Cycle {res['cycle']} | Machine {res['machine_id']}] -> Prob: {res['risk_probability']:.4f} | Will Fail: {res['will_fail']}")
            else:
                print(f"Error {response.status_code}: {response.text}")
        except requests.exceptions.ConnectionError:
            print("Connection failed. Is the API running?")
            break
            
        time.sleep(delay_seconds)
        count += 1
        
    print(f"\nStreamed {count} records.")
    
    # Check drift status
    try:
        print("\nChecking drift status...")
        drift_res = requests.get("http://localhost:8000/mlops/drift_status")
        print(drift_res.json())
    except:
        print("Failed to check drift status.")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    test_path = os.path.join(base_dir, "data", "test_data.csv")
    stream_data(csv_path=test_path, delay_seconds=0.01, max_requests=50)

import requests
import time
import subprocess
import sys
import os

API_URL = "http://localhost:8000"

def wait_for_api():
    print("Waiting for API to start...")
    for _ in range(30):
        try:
            res = requests.get(f"{API_URL}/mlops/events")
            if res.status_code == 200:
                print("API is up!")
                return True
        except:
            pass
        time.sleep(1)
    return False

def test_phase4():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 1. Start API
    api_proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "src.api:app", "--port", "8000"], cwd=base_dir)
    if not wait_for_api():
        print("API failed to start.")
        api_proc.kill()
        return
        
    try:
        # 2. NORMAL Telemetry
        print("\n--- Running NORMAL telemetry ---")
        subprocess.run([sys.executable, "-u", "src/streamer.py", "--mode", "NORMAL", "--max_requests", "20"], cwd=base_dir)
        
        # 3. DRIFT Injection
        print("\n--- Running DRIFT telemetry ---")
        subprocess.run([sys.executable, "-u", "src/streamer.py", "--mode", "DRIFT", "--max_requests", "150"], cwd=base_dir)
        
        # 4. Wait for Retraining to complete (it runs as background task when drift is checked at end of streamer)
        print("\n--- Waiting for Autonomous Retraining ---")
        retraining_done = False
        for _ in range(60): # Wait up to 60s
            events = requests.get(f"{API_URL}/mlops/events").json()
            for e in events:
                if e["event_type"] in ["MODEL_PROMOTED", "MODEL_REJECTED"]:
                    print(f"Retraining completed! Decision: {e['event_type']}")
                    print(f"Metrics: {e['context'].get('metrics')}")
                    retraining_done = True
                    break
            if retraining_done:
                break
            time.sleep(2)
            
        if not retraining_done:
            print("Retraining did not complete or was not triggered.")
            
        # 5. Rollback
        print("\n--- Triggering ROLLBACK ---")
        rb = requests.post(f"{API_URL}/mlops/rollback").json()
        print("Rollback response:", rb)
        
        # 6. Show Final Event Log
        print("\n--- FINAL EVENT LOG ---")
        events = requests.get(f"{API_URL}/mlops/events").json()
        for e in events[:10]: # Print last 10
            print(f"[{e['timestamp']}] {e['event_type']} - {e['context']}")
            
    finally:
        print("\nCleaning up API server...")
        api_proc.kill()

if __name__ == "__main__":
    test_phase4()

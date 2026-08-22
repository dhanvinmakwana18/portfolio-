import requests
import time

API_URL = "http://localhost:8000"

def test_phase5_api_endpoints():
    print("Testing Phase 5 API Extensions...")
    
    # Wait for API
    for _ in range(10):
        try:
            requests.get(f"{API_URL}/mlops/events")
            break
        except:
            time.sleep(1)
            
    endpoints = [
        "/machines",
        "/predictions",
        "/mlops/models",
        "/mlops/events"
    ]
    
    for ep in endpoints:
        res = requests.get(f"{API_URL}{ep}")
        if res.status_code == 200:
            print(f"[OK] {ep} returned {len(res.json())} items.")
        else:
            print(f"[FAIL] {ep} returned {res.status_code}: {res.text}")
            
    # Test specific machine detail
    machines = requests.get(f"{API_URL}/machines").json()
    if machines:
        mid = machines[0]["machine_id"]
        res = requests.get(f"{API_URL}/machines/{mid}")
        print(f"[OK] /machines/{mid} returned {len(res.json())} history records.")
        
        shap_res = requests.get(f"{API_URL}/machines/{mid}/shap")
        if shap_res.status_code == 200:
            print(f"[OK] /machines/{mid}/shap returned SHAP values.")
        else:
            print(f"[FAIL] /machines/{mid}/shap returned {shap_res.status_code}: {shap_res.text}")
            
    print("API Extension Tests Completed.")

if __name__ == "__main__":
    test_phase5_api_endpoints()

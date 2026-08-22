# AeroDrift: Autonomous ML Engineering & Predictive Maintenance

AeroDrift is a functional end-to-end predictive maintenance system demonstrating an autonomous MLOps lifecycle. It simulates an industrial environment where machine telemetry is continuously monitored by a machine learning model to predict impending failures. More importantly, it features an autonomous drift-detection and retraining pipeline that safely self-heals when data distributions shift.

## Architecture & Tech Stack

- **Machine Learning**: XGBoost, Scikit-Learn
- **MLOps & Tracking**: MLflow (Model Registry, Metrics, Artifacts)
- **Data Drift Detection**: Evidently AI
- **Explainability**: SHAP (SHapley Additive exPlanations)
- **Backend & API**: FastAPI, SQLite (Event Audit Log & Telemetry)
- **Frontend / Control Room**: React (Vite, Tailwind v4, Framer Motion, Recharts)

## Core MLOps Lifecycle

1. **Live Telemetry & Inference**: Real-time sensor data is streamed to the FastAPI backend, where the active Production model issues failure probabilities.
2. **Distribution Drift Detection**: Evidently AI analyzes the recent stream against the model's original training reference data. If a significant statistical shift is detected (e.g. `share_of_drifted_columns > 0.5`), an alert is fired.
3. **Autonomous Retraining**: The backend automatically triggers a background worker to train a Candidate Model on the latest historical data.
4. **Deterministic Promotion Gate**: The Candidate is evaluated against the Production model on a holdout set. If it demonstrates superior F1 score and acceptable FPR, it is promoted to 'Production'. Otherwise, it is 'Rejected'.
5. **Rollback**: Operators can manually rollback to the previous best model if needed via the Control Room.
6. **Event Logging**: Every stage (Drift, Retraining, Promotion, Rejection, Rollback) is immutably recorded in the Event Audit Log.

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the MLflow tracking server (optional but recommended for UI)
mlflow server --backend-store-uri sqlite:///mlflow.db --default-artifact-root ./mlruns --host 0.0.0.0 --port 5000 &

# Train the initial baseline model and initialize the database
python src/train.py

# Start the FastAPI backend
python -m uvicorn src.api:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to view the AeroDrift Control Room.

## Testing & Validation
This is a portfolio-grade ML engineering system. An end-to-end automated test suite validates the entire lifecycle:
```bash
python audit.py
```

## Future Real-Data Integration
Currently, the system uses a high-fidelity synthetic data generator to simulate aircraft engine degradation (inspired by the NASA CMAPSS dataset). To integrate a real dataset (like CMAPSS), the feature engineering pipeline (`src/features.py`) must be adapted to calculate rolling sensor statistics based on the specific schema of the public dataset, and the target definition must be aligned (e.g., predicting RUL < 30 cycles).

## Limitations
- The system currently operates on local SQLite databases.
- Retraining is triggered on a simple threshold and blocks the event loop in a naive subprocess; a real system would use a distributed task queue (e.g., Celery, Airflow).

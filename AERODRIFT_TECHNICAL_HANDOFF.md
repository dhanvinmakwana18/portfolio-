# AeroDrift Technical Handoff Report

## 1. What AeroDrift is
AeroDrift is a functional, end-to-end predictive maintenance system demonstrating an autonomous MLOps lifecycle. It simulates an industrial environment where machine telemetry is continuously monitored by a machine learning model to predict impending failures.

## 2. Purpose and Goals
The primary goal of AeroDrift is to provide a portfolio-grade demonstration of a robust, autonomous ML engineering lifecycle. Instead of just making static predictions, the system is designed to safely "self-heal" by detecting statistical data drift, automatically triggering a retraining pipeline, evaluating candidate models deterministically against a production gate, and rolling back if necessary. It leverages the genuine NASA C-MAPSS dataset (FD001-FD004) to validate its generalization across complex aerospace operating conditions.

## 3. Current Features
- **Real-Time Telemetry Ingestion:** Accepts streaming sensor data via an API.
- **Live Inference:** Uses an active Production model to score real-time data and predict impending failure (`RUL <= 30` cycles).
- **Data Drift Detection:** Automatically compares recent incoming streaming distributions against original training baselines.
- **Autonomous Retraining:** Upon detecting drift, a background worker automatically triggers a retraining loop on recent historical data.
- **Deterministic Promotion Gate:** Automatically scores Candidate Models against the Production Model on a holdout set, promoting them only if they exhibit a superior F1 Score and acceptable False Positive Rate.
- **Rollback Mechanism:** Allows operators to revert to a previous model state.
- **Event Audit Logging:** Immutably records every lifecycle phase (Drift, Retrain, Promotion, Rejection, Rollback) in an SQLite audit log.
- **Control Room Dashboard:** A premium React frontend visualizing real-time metrics, fleet health, and ML event logs.

## 4. Current Architecture
AeroDrift uses a multi-tier, decoupled architecture:
1. **Data Layer:** SQLite handles two primary stores—one for telemetry/event logs and another serving as the MLflow backend store.
2. **MLOps Layer:** MLflow is utilized as the Model Registry, managing model versions, tracking hyperparameters, and storing model artifacts. Evidently AI manages the statistical drift computation.
3. **Application Server:** A FastAPI application handles telemetry streaming, serves API endpoints for the frontend, coordinates inference, and spawns subprocesses for retraining.
4. **Client Layer:** A React Single Page Application (SPA) acts as the Control Room.

## 5. Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS v4, utilizing a glassmorphic aesthetic (`clsx`, `tailwind-merge`).
- **Animations & Visualizations:** `framer-motion` for UI transitions, `recharts` for telemetry/drift visualizations.
- **Icons:** `lucide-react`
- **Routing:** `react-router-dom`

## 6. Backend
- **Framework:** FastAPI (Python 3.10+) running via Uvicorn.
- **Core Scripts:** 
  - `api.py` (FastAPI routes)
  - `streamer.py` (Mock streaming/telemetry generation logic)
  - `event_log.py` (Audit logging interface)

## 7. Database
- **`inference.db`**: SQLite database storing raw telemetry streams and immutable event audit logs.
- **`mlflow.db`**: SQLite database powering the MLflow tracking server and model registry.

## 8. APIs
The FastAPI backend exposes endpoints for:
- Telemetry ingestion (streaming data points)
- Dashboard metrics retrieval
- Manual trigger endpoints (e.g., forcing a model rollback or initiating retraining)
- Event log fetching

## 9. AI/ML Components
- **Model Registry & Tracking:** MLflow
- **Drift Detection:** Evidently AI (evaluates `share_of_drifted_columns`)
- **Explainability:** SHAP (SHapley Additive exPlanations) implemented for feature importance.
- **Feature Engineering Pipeline:** Custom pipeline applying 5-cycle rolling standard deviations (volatility tracking), Exponential Weighted Moving Averages (EWMA) for lag smoothing, and contextual normalization against initial cycle states.

## 10. Algorithms Currently Used
- **Primary Model:** XGBoost (Gradient Boosting Decision Trees) used for binary classification.
- **Baseline Model:** Logistic Regression (used for comparative baselining and feature mapping).

## 11. External Libraries/Dependencies
- **Python:** `fastapi`, `uvicorn`, `xgboost`, `scikit-learn`, `mlflow`, `evidently`, `pandas`, `numpy`, `pytest`.
- **Node.js:** `react`, `react-dom`, `react-router-dom`, `tailwindcss`, `framer-motion`, `recharts`, `axios`, `vite`, `vitest`.

## 12. File/Folder Structure
- `/aerodrift/frontend/`: Contains the entire React frontend application (`src/components/`, `src/pages/`, etc.).
- `/aerodrift/src/`: Contains core backend and ML code (`api.py`, `train.py`, `retrain.py`, `features.py`, `streamer.py`, `event_log.py`).
- `/aerodrift/tests/`: Comprehensive `pytest` suite testing leakage, phases, and real-data implementation.
- `/aerodrift/models/`: Local directory for serialized baseline model artifacts (`.pkl` files).
- `/aerodrift/mlruns/`: MLflow artifact storage for registered models.
- `/aerodrift/plots/`: EDA and visualization outputs.

## 13. Current User Flows
1. **Monitoring:** Operator opens the React Control Room and observes real-time engine telemetry and model predictions.
2. **Drift Detection:** System visually indicates statistical drift via dashboard gauges.
3. **Audit Tracking:** If drift breaches the threshold, operator watches the "Event Log" auto-populate with "Retraining Started", followed by "Candidate Promoted" or "Candidate Rejected" based on automated holdout evaluation.
4. **Manual Intervention:** Operator clicks "Rollback" in the Model Center to revert the active Production model if desired.

## 14. What is Actually Implemented vs Planned
**Implemented:**
- The complete end-to-end MLOps pipeline (drift detection, MLflow tracking, dynamic retraining, promotion gating, rollback).
- Premium React frontend integration.
- Full adaptation and validation against the real NASA C-MAPSS dataset (FD001, FD002, FD003, FD004) including multi-condition generalization benchmarks.
- Comprehensive unit and integration test suite.

**Planned / Future Enhancements:**
- Distributed task queuing.
- Migration to a robust production database (e.g., PostgreSQL).
- Docker containerization.

## 15. Current Bugs/Problems
- No explicit system-breaking bugs are currently reported in the repository.
- A structural limitation exists regarding how background tasks are handled (see Known Limitations).

## 16. Known Limitations
- **Database Scalability:** The system uses local SQLite databases, which will bottleneck under high concurrent telemetry writes or large-scale distributed setups.
- **Retraining Execution:** Retraining is currently triggered via a naive Python subprocess. This can block the event loop or fail silently if the server crashes during training. A dedicated task queue (e.g., Celery, Redis, or Airflow) is required for true production scaling.

## 17. Current Git Status
- **Commit Hash:** `dbc79fd1942cc6b29bc91fec86bcb647395bf8c6`
- **Working Tree:** Clean, synchronized with `origin/main`.

## 18. How to Run the Project
1. **Initialize Backend / MLflow:**
   ```bash
   mlflow server --backend-store-uri sqlite:///mlflow.db --default-artifact-root ./mlruns --host 0.0.0.0 --port 5000 &
   python src/train.py
   python -m uvicorn src.api:app --reload
   ```
2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Navigate to `http://localhost:5173`.

## 19. What Has Already Been Completed
- Core architecture (FastAPI backend, MLflow registry, React frontend).
- Synthesized and real-world data pipelines (NASA C-MAPSS integration).
- Phase 1-5 core ML milestones + Phase 6 (Final Validation Audit) + Phase 7 (Advanced Generalization Benchmarks).
- The project is functionally complete and has passed all local tests.

## 20. Recommended Next Steps
1. **Task Orchestration:** Replace the subprocess retraining logic with a Celery worker or Apache Airflow DAG to handle heavy model training jobs safely.
2. **Database Migration:** Upgrade the storage backend from SQLite to PostgreSQL for both the `inference.db` and the MLflow backend store.
3. **Containerization:** Create a `docker-compose.yml` to package the React frontend, FastAPI backend, MLflow server, and necessary databases into a single, easily deployable network.
4. **CI/CD Integration:** Integrate GitHub Actions to automatically run the `pytest` suite (`audit.py`) on PRs.

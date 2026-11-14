# Dhanvin Makwana — AI Engineer & Data Scientist

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![WebGL](https://img.shields.io/badge/WebGL-Shader_Engine-990000?style=flat-square&logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

An elite, high-performance interactive portfolio engineered for **Dhanvin Makwana** — AI Engineer and Data Scientist. Architected to showcase production-grade implementations spanning **Autonomous Multi-Agent Systems**, **Predictive ML & Telemetry Engines**, **Multimodal Agentic RAG**, and **Edge-Optimized Computer Vision**.

---

## 🏛️ Flagship AI & Data Science Architectures

### 1. TOTO: F1 Driver Consistency & Strategy Prediction Engine
> *Pinnacle F1 telemetry intelligence platform & sub-35ms strategic inference engine.*

* **Scale:** 8 Seasons (2018–2025) • 150+ Grands Prix • 500,000+ Telemetry Laps
* **Key Metrics:**
  * **Holdout AUC-ROC:** `> 0.82` (unseen 2024–2025 seasons)
  * **Strategy Precision:** `~88%` undercut/overcut prediction accuracy
  * **Inference Latency:** `< 35ms` via FastAPI REST runtime
  * **Simulated Windows:** `50+` dynamic pit windows per Grand Prix
* **Core Stack:** `FastF1`, `DuckDB`, `PyTorch (TotoDeepNet)`, `CUDA-Accelerated XGBoost`, `LightGBM`, `FastAPI`, `Streamlit`
* **Architecture Pipeline:**
  ```text
  FastF1 & Micro-Climate Ingestion
         ↓
  DuckDB Analytical OLAP (Zero Disk Fragmentation)
         ↓
  42-Signal Vector Engine (Tire Thermal Slopes, Clean-Air Pace Deltas, Restart Z-Scores)
         ↓
  Multi-Model Ensemble (CUDA XGBoost + LightGBM + PyTorch Residual DeepNet)
         ↓
  Quantitative Pit Strategy Simulator (Undercut/Overcut Windows & Stint Loss Curves)
         ↓
  Sub-35ms FastAPI REST Server → Interactive Pit-Wall Console
  ```

---

### 2. STAR WARS: NASA C-MAPSS Turbofan RUL & Fleet Intelligence Engine
> *Multi-regime aerospace propulsion prognostics & uncertainty-calibrated fleet maintenance optimizer across all 4 NASA C-MAPSS benchmarks.*

* **Scale:** 4 Benchmark Subsets (`FD001`–`FD004`) • 709 Training / 707 Test Engines • 6 Flight Regimes • 2 Fault Modes
* **Key Metrics:**
  * **Unified BiLSTM RMSE:** `13.90 / 14.37 / 13.44 / 14.69` across `FD001`–`FD004` (outperforming Zheng et al. 2017 on all 4 subsets & Li et al. 2018 by `35.7%–37.0%` RMSE on `FD002`/`FD004`)
  * **Regime Conditioning Gain:** `-46.2%` `FD002` XGBoost NASA Score (`2,198.5 → 1,182.1`) and `-28.9%` `FD004` Deep 1D-CNN Score via `KMeans (k=6)`
  * **Fleet Maintenance Impact:** `-45.5%` annual fleet cost (`$110.82M/yr` savings vs. Fixed-150; `$86.36M/yr` vs. Best-Fixed 140) with `0` unplanned failures (`0 vs. 6`)
  * **Uncertainty & QA:** `90%` Split-Conformal Prediction Intervals • MC Dropout • `26/26` `pytest` checks passing
* **Core Stack:** `PyTorch (Deep 1D-CNN, Attention BiLSTM, Unified BiLSTM)`, `XGBoost`, `scikit-learn`, `Conformal Prediction`, `SHAP`, `Streamlit`
* **Architecture Pipeline:**
  ```text
  NASA C-MAPSS 21 Sensors (FD001–FD004)
         ↓
  Empirical Variance Pruning (21 → 14 Informative Sensors)
         ↓
  Operating-Regime K-Means (k=6) Normalization (Eliminating Altitude/Mach/TRA Masking)
         ↓
  Multi-Scale Feature & Sequence Windowing + Asymmetric NASA Scoring
         ↓
  Benchmark Suite (RF, XGBoost, Deep 1D-CNN, Attention BiLSTM, Unified BiLSTM)
         ↓
  MC Dropout & Split-Conformal 90% CI → Fleet Cost Optimizer → 4-Tab Streamlit Console
  ```

---

### 3. DataMate: Autonomous Multi-Agent Data Science Platform
> *Sovereign 41-agent castle architecture delivering automated AutoML alchemy & executive boardroom intelligence.*

* **Key Metrics:**
  * **Agent Network:** `41 Specialized Agents` across `7 Fortified Functional Rooms`
  * **Pipeline Speed:** `< 60s` from raw heterogeneous ingestion to executive PDF
  * **Memory Layer:** `Milvus Episodic Vector Memory` for cross-run historical recall
  * **Output Generation:** `ReportLab` publication-grade executive audit dossiers
* **Core Stack:** `Multi-Agent Cognitive Swarm`, `NVIDIA Nemotron`, `Milvus`, `scikit-learn`, `Streamlit`, `ReportLab`
* **Architecture Pipeline:**
  ```text
  Multi-Source Data Ingestion
         ↓
  Room 1: Quality Certification & Sanitation
         ↓
  Room 2: Statistical Profiling & Correlation Heatmaps
         ↓
  Room 3: Autonomous Feature Discovery & Transformation
         ↓
  Room 4: Competitive AutoML Model Tournament (Ensembling & Calibration)
         ↓
  Room 5: Milvus Episodic Vector Storage (De-duplicating compute across queries)
         ↓
  Executive PDF Dossier Generator & Streamlit Command UI
  ```

---

### 4. Syntera: Multimodal Agentic RAG & Grounding Engine
> *Distributed multimodal reasoning framework with dynamic routing and self-reflective verification loops.*

* **Key Metrics:**
  * **Retrieval Latency:** `< 110ms` hybrid search
  * **Hallucination Reduction:** `42%` drop vs. vanilla RAG baselines
  * **Context Capacity:** `128k Tokens` with `96.4%` precision score
* **Core Stack:** `Qdrant (Hybrid RRF)`, `Transformers`, `Cross-Encoder Rerankers`, `FastAPI`, `vLLM`, `LangChain`
* **Features:**
  * Dynamic Query Router classifying requests for direct generation vs. domain-specific vector stores.
  * Self-Correction & Citation Grounding loops validating inferences against retrieved source chunks.
  * Multimodal parser analyzing complex tabular datasets, financial balance sheets, and PDF schematics.

---

## 💻 Frontend & Creative Graphics Engineering

Beyond machine learning, this portfolio is built with modern web technologies:

* **Signature WebGL Flow Shader:** Custom interactive fluid fragment shader computing real-time mouse dissipation, fluid dynamics, and dual dark/light color palettes with zero CPU bottleneck.
* **Physics Tech Stack Sandbox:** Interactive 2D rigid-body simulation powered by **Matter.js**, enabling skill chips to experience gravity, collision restitution, velocity dampening, and mouse drag forces.
* **Lenis Smooth Scroll:** Inertia-driven kinetic scrolling engine orchestrating page transitions.
* **Executive Case Study Modals:** Frosted glassmorphic modal dialogues with structured metrics grids, architecture flows, and formatted executive overviews.
* **3D Magnetic Portrait:** Dynamic hover-tilt lighting card reflecting real-time system status.

---

## 🛠️ Complete Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Machine Learning & Deep Learning** | PyTorch, TensorFlow, Scikit-Learn, XGBoost, LightGBM, CUDA |
| **LLMs & Agentic AI** | LangChain, LangGraph, LlamaIndex, vLLM, Ollama, NVIDIA Nemotron, Prompt Engineering |
| **Vector DBs & Search** | Qdrant, Milvus, BM25, Reciprocal Rank Fusion (RRF), Cross-Encoders |
| **Data Engineering & OLAP** | DuckDB, Parquet, Pandas, NumPy, Polars, FastF1 |
| **Computer Vision** | YOLO (v8/v11), OpenCV, TensorRT, MediaPipe |
| **Backend & Cloud Deployment** | FastAPI, Python, Docker, Kubernetes, REST APIs, Streamlit |
| **Frontend & Graphics** | React 19, TypeScript, Tailwind CSS v4, WebGL GLSL Shaders, Motion, Matter.js, Vite |

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18.0.0 or higher)
* **npm** or **pnpm**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dhanvinmakwana18/portfolio-.git
   cd portfolio-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

To generate an optimized production bundle:
```bash
npm run build
npm run preview
```

---

## 📬 Contact & Connect

* **Author:** Dhanvin Makwana
* **Role:** AI Engineer & Data Scientist
* **Email:** [dhanvinmakwana18@gmail.com](mailto:dhanvinmakwana18@gmail.com)
* **GitHub:** [@dhanvinmakwana18](https://github.com/dhanvinmakwana18)
* **LinkedIn:** [Dhanvin Makwana](https://www.linkedin.com/in/dhanvin-makwana/)
* **Location:** Ahmedabad, Gujarat, India

---

<p align="center">
  <sub>Engineered with precision by Dhanvin Makwana. Built with React 19, TypeScript, Tailwind CSS v4, and WebGL.</sub>
</p>

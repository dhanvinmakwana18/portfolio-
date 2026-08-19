# NexusLLM

Autonomous Agentic RAG & Multi-Modal AI Engine

## 1. Overview
NexusLLM is an autonomous AI engine that combines agentic routing, retrieval-augmented generation (RAG), vector search, document intelligence, and multi-modal reasoning into a unified execution pipeline. It is built as a robust, local-first backend paired with a futuristic observability frontend.

## 2. Why NexusLLM
Unlike standard wrappers around commercial APIs, NexusLLM is designed to demonstrate real AI engineering principles:
- **Local-first**: Operates on local models via Ollama and SentenceTransformers.
- **Agentic Routing**: Deterministically classifies intents and executes the appropriate sub-system.
- **Traceability**: Exposes operational execution events (latency, tool calls, retrieval counts) safely to the user.

## 3. Architecture

```text
USER
 ↓
FastAPI / Python API
 ↓
Agentic Router (Query Classification)
 ├── DIRECT (LLM)
 ├── RAG (Vector Search)
 ├── MULTI_MODAL (Vision)
 └── AGENTIC (Complex Reasoning)
 ↓
Context Assembly (Grounding & Citations)
 ↓
Final Answer + Sources + Safe Trace
```

## 4. Core Features
- **Document Intelligence**: Ingests PDFs, Markdown, and TXT with PyMuPDF, extracting metadata and creating semantic chunks.
- **Vector Search**: Local Qdrant persistent storage combined with SentenceTransformers for semantic retrieval.
- **Agentic Workflow**: A routing system that chooses between tools (RAG, Direct LLM, Vision).
- **Execution Trace**: Every query generates an observability trace outlining exact backend operations.

## 5. Tech Stack
- **Backend**: Python, FastAPI, Pydantic, Qdrant, SentenceTransformers, PyMuPDF.
- **Frontend**: React 19, Vite, Tailwind CSS (v4), Framer Motion, Lucide Icons.

## 6. Installation & Running Locally

1. **Install Backend Dependencies**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Or .\venv\Scripts\Activate.ps1 on Windows
   pip install -r requirements.txt
   ```

2. **Start Backend Server**:
   ```bash
   python run_server.py
   ```
   *(Ensure Ollama is running locally with the `llama3` model)*

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Start Frontend Server**:
   ```bash
   npm run dev
   ```

## 7. Limitations & Future Improvements
- **Implemented**: RAG, Direct Generation, Document Ingestion, Qdrant Vector Store, Agentic Routing logic, Observability Traces.
- **Planned**: Evaluation Dashboard, Cross-encoder Reranking, Advanced Multi-Modal execution (Llava integration).

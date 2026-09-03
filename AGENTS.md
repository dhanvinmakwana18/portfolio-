# SYNTERA — AGENT OPERATING MANUAL

This document serves as the permanent operating rules and system prompt for Antigravity (and any other AI agents) working on the Syntera repository. Read this before modifying the architecture.

## 1. WHAT IS SYNTERA?
Syntera is an enterprise-grade, high-precision Document Intelligence and RAG (Retrieval-Augmented Generation) system. It is designed to move beyond naive vector search, utilizing a state-space orchestration paradigm. Its intelligence stems from combining structural PDF extraction, hybrid retrieval, cross-encoder reranking, and dynamic abstention, rather than relying solely on slow LLM reasoning.

## 2. RESEARCH-FIRST PHILOSOPHY
Syntera is engineered via the scientific method. Do not implement heuristics, thresholds, or routing architectures merely because they "sound mathematically intelligent."
Every major architectural change must follow this loop:
Hypothesis -> Baseline -> Minimum Viable Experiment (MVE) -> Metric -> Result -> Decision
If experimental evidence is insufficient, mark the proposal as **RESEARCH REQUIRED** and do not deploy it to production.

## 3. ARCHITECTURE RULES
- **Ingestion:** Always preserve structural metadata (section_path, page, chunk_index). Use structural extraction (e.g., PyMuPDF) rather than naive text splitters.
- **Retrieval:** Rely on Hybrid Search (Dense semantic + Sparse lexical/BM25) fused via Reciprocal Rank Fusion (RRF).
- **Reranking:** Always rerank retrieved candidates using a dedicated Cross-Encoder.
- **Context Assembly:** Deduplicate context. Maintain strict boundaries (e.g., Parent-Child chunk retrieval) to preserve unbroken pronoun references and semantic meaning.
- **Evaluation/Grounding:** Prefer deterministic classifiers (like NLI models, e.g., DeBERTa) over LLM-as-a-judge whenever possible to prevent confirmation bias and hallucinations.

## 4. CODING STANDARDS
- **Traceability:** Every major action must be appended to the execution trace (dd_trace). Latency must be tracked at every stage.
- **Resilience:** The LLM generator must always have a graceful fallback (e.g., catching connection errors and loading an in-memory local Transformers pipeline) if the primary API (Ollama/OpenAI) times out.
- **Testing:** Run the regression suite (pytest tests/) before and after any implementation. A failing test means a hard STOP. Do not commit failing code.

## 5. WHAT YOU MUST NEVER DO (The Adversarial Constraints)
- **NEVER** treat raw cross-encoder or cosine similarity scores as calibrated probabilities without explicit normalization (e.g., Z-scores) or isotonic regression.
- **NEVER** introduce hardcoded logic thresholds (e.g., "abstain if score < 0.35") without a data-backed ablation study.
- **NEVER** claim a metric (like Recall@5) improves without executing a comparative baseline experiment on an unseen corpus.
- **NEVER** fabricate datasets, mock experimental results, or artificially fake algorithmic novelty.
- **NEVER** assume an LLM is a perfect evaluator of its own output (beware of LLM confirmation bias).
- **NEVER** optimize latency by breaking the fundamental retrieval pipeline.

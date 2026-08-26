# NexusLLM RAG Retrieval Ablation Analysis

## 1. Baseline
The real-LLM baseline evaluation demonstrates that **Dense retrieval currently outperforms Hybrid (RRF) retrieval**:
- **Dense:** Recall@3 = 0.4375, Recall@5 = 0.5000, MRR = 0.3146
- **Hybrid (RRF):** Recall@3 = 0.3750, Recall@5 = 0.3750, MRR = 0.2708
- **Hybrid + Reranking:** Recall@3 = 0.3750, Recall@5 = 0.5000, MRR = 0.3438 (Best overall ranking quality)

## 2. Dense vs Sparse
A query-level inspection reveals that BM25/Sparse retrieval generally ranks expected chunks lower than Dense embeddings.
- Example: "Is there a LangChain package for JavaScript?" -> Dense rank: 2, Sparse rank: 5.
- Example: "What is a Document in LangChain?" -> Dense rank: 3, Sparse rank: 7.

## 3. Dense/Sparse Overlap
- **Average overlap (Top 5):** 2.625 out of 5 candidates.
- **Minimum overlap:** 0 (for conceptual queries like "What is LCEL?").
- **Maximum overlap:** 5 (for exact-match queries like "Tell me about the secret code 4291").
BM25 brings in distinct candidates, but frequently they are keyword-matching distractors rather than semantic matches.

## 4. Hybrid Failure Analysis
Hybrid underperforms Dense because BM25 introduces high-scoring noisy candidates (exact keyword matches lacking context). 
Because RRF applies equal weighting, these noisy chunks get pushed up in the fused list. 
The critical failure point occurs in ag.py: the candidates = candidates[:limit] operation truncates the fused list to 5 items **before** passing it to the context assembler. If the true answer was pushed to rank 6 by BM25 noise, it is permanently discarded.

## 5. Complementarity
Despite the noise, Sparse retrieval adds genuine complementary value. 
- Example: "What are the main components of the LangChain ecosystem?" 
- Dense rank: 4
- Sparse rank: 1
- Hybrid rank: 2
In cases involving specific vocabulary where semantic vectors might be too broad, BM25 successfully anchors the search.

## 6. RRF Diagnosis
- **Constant:** k = 60 (Standard).
- **Depth:** Fuses the Top 20 from both Dense and Sparse.
- **Identity mapping:** Successfully uses Qdrant UUIDs to map the exact same chunk across both indexes.
- **Flaw:** Dense and Sparse rankings receive equal weight. Because Dense is inherently more accurate on this dataset, an equal 1:1 weighting allows BM25 noise to degrade the overall ranking.

## 7. Reranker Diagnosis
Why does Reranking fix the Hybrid pipeline? 
The Reranker takes the **full Top 20** fused candidates and scores them semantically using a Cross-Encoder. This acts as a highly effective noise filter. It identifies the true answers that were pushed down to ranks 6-20 by BM25, and pulls them back into the Top 5. This restores Recall@5 to 0.5000 and achieves the highest MRR (0.3438) and nDCG (0.3827).

## 8. Latency Diagnosis
Retrieval is absolutely not the bottleneck.
- **Retrieval Pipeline (Qdrant + BM25 + RRF):** ~15 ms
- **Cross-Encoder Reranking:** ~114 ms
- **LLM Generation (CPU):** ~13,000–16,000 ms
Generation accounts for >88% of total latency. The ~100ms added by the reranker is a trivial cost for the highest-quality ranking.

## 9. Optimization Hypotheses (Next Phase)
1. **Experiment 1 (Truncation Depth):** Pass the full 20 fused candidates to ssemble_context() and apply a elevance_threshold dynamically, rather than hard-truncating to limit=5 blindly.
2. **Experiment 2 (Weighted RRF):** Introduce an alpha parameter to weight Dense higher than Sparse (e.g., score = 0.7*dense_rrf + 0.3*sparse_rrf) to suppress BM25 noise.
3. **Experiment 3 (Reranker Depth):** Increase the reranker depth from 20 to 40. Given the low latency (~100ms), checking a wider net might push Recall@5 beyond 0.500.

## Experiment 1 — Candidate Depth

### Hypothesis
Early truncation at 5 candidates causes relevant semantic candidates pushed below rank 5 by sparse BM25 noise to be permanently discarded before they can be rescued or filtered by the context assembler. By increasing the depth of candidates passed to the assembler, we can retain these candidates and improve Recall.

### Configurations
* **Baseline configuration:** RRF candidate depth = 5 (pre-truncation before deduplication).
* **Experimental configuration:** RRF candidate depth = 20 (passed entirely to ssemble_context(), maintaining a max context chunk limit of 5 after deduplication).

### Methodology
Modified ag.py to skip slicing candidates[:5] for Hybrid mode.
Updated ssemble_context() to accept max_chunks=5 so it can iterate over the 20 candidates, deduplicate, and stop cleanly once the budget of 5 unique chunks is filled.
Executed the full 20-query evaluation suite via the API on the experimental configuration.

### Aggregate Results
* **Recall@3:** 0.3750 (Baseline: 0.3750) -> **No Change**
* **Recall@5:** 0.3750 (Baseline: 0.3750) -> **No Change**
* **MRR:** 0.2708 (Baseline: 0.2708) -> **No Change**
* **nDCG:** 0.2976 (Baseline: 0.2976) -> **No Change**

### Query-Level Findings
A focused query-by-query analysis running both Depth 5 and Depth 20 logic demonstrated exactly **0 differences** in the retrieved chunks and their ranks.
The expected relevant chunks were NOT sitting just below rank 5 waiting to be rescued by deduplication. 
The BM25 distractors that pushed the true answers down are distinctly different textual chunks (not duplicates), meaning they consume the 5 available context slots regardless of how many candidates are passed into the assembler.

### Latency Impact
* **Retrieval latency:** ~15.5 ms (Baseline: ~15.7 ms)
* **Context assembly:** Negligible impact.
* **Total latency:** Remained heavily dominated by LLM generation (~14s). Passing 20 chunks to the assembler added sub-millisecond overhead.

### Conclusion
**The hypothesis is not supported.** Increasing the pre-context candidate depth from 5 to 20 produces absolutely no improvement in retrieval quality without an intelligent relevance filter. Because ssemble_context() relies strictly on exact-text deduplication, it simply takes the first 5 unique chunks, which are the exact same 5 chunks obtained by truncating the list early. 

### Recommendation
**Do not adopt Depth 20.** I have reverted the candidate depth back to the baseline of 5.
For the next experiment, we should introduce an alpha weighting parameter to RRF (Experiment 2: Weighted RRF) to mathematically penalize BM25 noise *before* the chunks are sorted, ensuring the true semantic matches never drop below rank 5.

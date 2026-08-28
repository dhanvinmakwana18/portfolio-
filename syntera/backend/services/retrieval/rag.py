from vectorstore.qdrant_client import vector_store
from vectorstore.bm25_store import bm25_store
from services.rag import (
    transform_query,
    reciprocal_rank_fusion,
    reranker_service,
    assemble_context
)

def retrieve_documents(query: str, limit: int = 5, retrieval_mode: str = "rerank", dense_weight: float = 1.0, sparse_weight: float = 1.0, candidate_depth: int = 20):
    """
    Retrieves documents. Modes: dense, sparse, hybrid, rerank.
    """
    optimized_query = transform_query(query)
    if not optimized_query:
        return "", []
        
    if not bm25_store._is_synced:
        bm25_store.sync_from_qdrant(vector_store)

    dense_cands = vector_store.search(optimized_query, limit=candidate_depth) if retrieval_mode in ["dense", "hybrid", "rerank"] else []
    sparse_cands = bm25_store.search(optimized_query, limit=candidate_depth) if retrieval_mode in ["sparse", "hybrid", "rerank"] else []
    
    if retrieval_mode == "dense":
        candidates = dense_cands
        for c in candidates: c["rerank_score"] = c["score"]
    elif retrieval_mode == "sparse":
        candidates = sparse_cands
        for c in candidates: c["rerank_score"] = c["score"]
    else:
        # Hybrid or Rerank
        fused = reciprocal_rank_fusion(dense_cands, sparse_cands, limit=candidate_depth, dense_weight=dense_weight, sparse_weight=sparse_weight)
        if retrieval_mode == "hybrid":
            candidates = fused
            for c in candidates: c["rerank_score"] = c.get("rrf_score", 0)
        else:
            candidates = reranker_service.rerank(optimized_query, fused, limit=limit)
    
    candidates = candidates[:limit]
    context, sources = assemble_context(candidates, relevance_threshold=None)
    return context, sources


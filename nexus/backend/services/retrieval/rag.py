from vectorstore.qdrant_client import vector_store
from vectorstore.bm25_store import bm25_store
from services.rag import (
    transform_query,
    reciprocal_rank_fusion,
    reranker_service,
    assemble_context
)

def retrieve_documents(query: str, limit: int = 5):
    """
    Retrieves documents using True Hybrid Search (Dense + Sparse),
    fuses candidates, reranks, and assembles the context.
    Returns: (context_string, sources_list)
    """
    # 1. Query Analysis / Transformation
    optimized_query = transform_query(query)
    
    if not optimized_query:
        return "", []
        
    # Sync BM25 on first run if needed
    if not bm25_store._is_synced:
        bm25_store.sync_from_qdrant(vector_store)

    # 2. Dense & Sparse Retrieval
    dense_candidates = vector_store.search(optimized_query, limit=20)
    sparse_candidates = bm25_store.search(optimized_query, limit=20)
    
    if not dense_candidates and not sparse_candidates:
        return "", []
        
    # 3. Candidate Fusion (RRF)
    fused_candidates = reciprocal_rank_fusion(dense_candidates, sparse_candidates, limit=20)
    
    # 4. Reranking
    reranked_candidates = reranker_service.rerank(optimized_query, fused_candidates, limit=limit)
    
    # 5. Context Assembly
    # We apply a low relevance threshold to filter out complete garbage.
    # If the reranker is down, it uses base RRF scores which are >0.
    context, sources = assemble_context(reranked_candidates, relevance_threshold=-10.0)
    
    return context, sources

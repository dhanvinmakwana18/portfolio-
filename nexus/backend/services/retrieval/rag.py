from vectorstore.qdrant_client import vector_store
from sentence_transformers import CrossEncoder

try:
    reranker_model = CrossEncoder("cross-encoder/ms-marco-TinyBERT-L-2-v2")
except Exception as e:
    reranker_model = None
    print(f"Failed to load reranker: {e}")

def retrieve_documents(query: str, limit: int = 5):
    # 1. Query Analysis / Transformation (Basic)
    optimized_query = query.strip()
    
    # 2. Dense Retrieval (Top K candidates)
    dense_candidates = vector_store.search(optimized_query, limit=20)
    if not dense_candidates:
        return []
        
    # 3. Candidate Merge & Reranking
    if reranker_model:
        # Prepare pairs for cross-encoder
        pairs = [[optimized_query, doc['payload']['text']] for doc in dense_candidates]
        scores = reranker_model.predict(pairs)
        
        # Merge scores back and sort
        for idx, score in enumerate(scores):
            dense_candidates[idx]['rerank_score'] = float(score)
            
        dense_candidates.sort(key=lambda x: x['rerank_score'], reverse=True)
    
    # 4. Return Top N
    return dense_candidates[:limit]

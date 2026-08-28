def assemble_context(candidates, relevance_threshold=None):
    """
    Assembles the retrieved context ensuring:
    - deduplication of identical texts
    - source preservation
    - relevance thresholding
    """
    context = ""
    sources = []
    seen_texts = set()
    
    for c in candidates:
        score = c.get("rerank_score", c.get("score", 0.0))
        
        # Apply relevance threshold if provided
        if relevance_threshold is not None and score < relevance_threshold:
            continue
            
        payload = c.get("payload", {})
        text = payload.get("text", "")
        
        if not text or text in seen_texts:
            continue
            
        seen_texts.add(text)
        
        source_idx = len(sources) + 1
        filename = payload.get("source", "Unknown")
        page = payload.get("page", "?")
        
        sources.append({
            "id": source_idx,
            "filename": filename,
            "page": page,
            "text": text,
            "score": score
        })
        
        context += f"[Source {source_idx}] (File: {filename}, Page: {page}):\n{text}\n\n"
        
    return context.strip(), sources

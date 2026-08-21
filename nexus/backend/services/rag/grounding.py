import re

def validate_citations(response: str, allowed_sources: list) -> str:
    """
    Validates that any [Source X] cited in the response actually exists
    in the allowed_sources list. If a hallucinated source is found,
    it can either be stripped, or the entire response can be flagged.
    For this implementation, we will append a system warning if hallucinated
    sources are used.
    
    allowed_sources: List of source dicts returned by assemble_context.
    """
    valid_ids = {str(s["id"]) for s in allowed_sources}
    
    # Find all [Source X] in the response
    cited_ids = set(re.findall(r'\[Source (\d+)\]', response))
    
    invalid_ids = cited_ids - valid_ids
    
    if invalid_ids:
        warning = f"\n\n[SYSTEM WARNING: The model cited sources that do not exist: {', '.join(invalid_ids)}]"
        return response + warning
        
    return response

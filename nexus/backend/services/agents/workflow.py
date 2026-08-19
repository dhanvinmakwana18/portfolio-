import json
from typing import List, Dict, Any

class AgentState:
    def __init__(self, query: str):
        self.query = query
        self.plan: str = ""
        self.tools_selected: List[str] = []
        self.observations: List[Dict[str, Any]] = []
        self.response: str = ""
        self.status: str = "ANALYZING" # ANALYZING, PLANNING, EXECUTING, VERIFYING, RESPONDING, ERROR
        self.iteration: int = 0
        self.max_iterations: int = 3
        self.trace: List[Dict[str, str]] = []

    def add_trace(self, step: str, action: str):
        self.trace.append({"step": step, "action": action})
        
def execute_agent(query: str) -> AgentState:
    from providers.llm import llm_provider
    from services.retrieval.rag import retrieve_documents
    
    state = AgentState(query)
    state.add_trace("Init", f"Starting agent workflow for query: '{query}'")
    
    # 1. ANALYZE
    state.status = "ANALYZING"
    analysis_prompt = f"Analyze this query and decide if we need RAG (retrieval), VISION (image), or DIRECT answer. Query: {query}\nRespond with just RAG, VISION, or DIRECT."
    intent = llm_provider.generate(prompt=analysis_prompt, system_prompt="You are a query analyzer.").strip().upper()
    state.add_trace("Analyze", f"Intent classified as {intent}")
    
    # 2. PLAN & SELECT TOOLS
    if "RAG" in intent:
        state.tools_selected.append("retrieve_documents")
    elif "VISION" in intent:
        state.tools_selected.append("analyze_image")
        
    state.plan = f"Will execute tools: {', '.join(state.tools_selected)}"
    state.add_trace("Plan", state.plan)
    
    # 3. EXECUTE
    state.status = "EXECUTING"
    context = ""
    sources = []
    
    if "retrieve_documents" in state.tools_selected:
        try:
            docs = retrieve_documents(query, limit=5)
            sources = docs
            context = "\n".join([f"[Source {i+1}] (File: {d['payload']['source']}, Page: {d['payload']['page']}):\n{d['payload']['text']}" for i, d in enumerate(docs)])
            state.add_trace("Execute", f"Retrieved {len(docs)} documents")
            state.observations.append({"tool": "retrieve_documents", "result": f"Found {len(docs)} documents"})
        except Exception as e:
            state.add_trace("Error", f"Retrieval failed: {str(e)}")
            
    # 4. RESPOND
    state.status = "RESPONDING"
    
    if "RAG" in intent and not context:
        state.response = "I cannot find sufficient evidence in the retrieved documents to answer your question."
        state.add_trace("Respond", "Insufficient evidence")
    else:
        system_prompt = (
            "You are NexusLLM. Use the provided context to answer the user query.\n"
            "If the context does not contain the answer, say 'I cannot find the answer in the provided documents.'\n"
            "Always cite your sources using [Source X] notation. NEVER fabricate a source."
        )
        prompt = f"Context:\n{context}\n\nQuery: {query}" if context else f"Query: {query}"
        state.response = llm_provider.generate(prompt=prompt, system_prompt=system_prompt)
        state.add_trace("Respond", "Generated response via LLM")
        
    # Return structure
    return state, sources

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any

api_router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    mode: str = "auto" # auto, direct, rag, multimodal, agentic

class QueryResponse(BaseModel):
    answer: str
    sources: List[dict] = []
    trace: List[dict] = []
    run_id: str

from services.agents.workflow import execute_agent
from providers.llm import llm_provider
import time
import uuid

@api_router.post("/chat", response_model=QueryResponse)
async def chat_endpoint(request: QueryRequest):
    start_time = time.time()
    run_id = str(uuid.uuid4())
    
    # Execute through workflow
    state, source_docs = execute_agent(request.query)
    
    sources = []
    for res in source_docs:
        sources.append({
            "id": res.get("id"),
            "filename": res.get("filename", "Unknown"),
            "page": res.get("page", "?"),
            "text": res.get("text", "")[:200] + "...",
            "score": res.get("score", 0)
        })
        
    latency = round(time.time() - start_time, 2)
    state.add_trace("Complete", f"Response generated in {latency}s")
    
    return QueryResponse(
        answer=state.response,
        sources=sources,
        trace=state.trace,
        run_id=run_id
    )

@api_router.get("/status")
def system_status():
    return {"status": "operational", "indexed_documents": 0}

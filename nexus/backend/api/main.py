from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Autonomous Agentic RAG & Multi-Modal AI Engine API",
    version="1.0.0",
)

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "message": str(exc)},
    )

from api.router import api_router
from api.kb_router import kb_router
from api.multimodal_router import mm_router

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(kb_router, prefix=f"{settings.API_V1_STR}/kb")
app.include_router(mm_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}

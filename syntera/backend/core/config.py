import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Syntera"
    API_V1_STR: str = "/api/v1"
    
    TESTING: bool = os.getenv("TESTING", "False").lower() in ("true", "1", "yes", "t")
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "test_data" if TESTING else "data")
    QDRANT_STORAGE_PATH: str = ":memory:" if TESTING else os.path.join(DATA_DIR, "qdrant")
    SQLITE_DB_PATH: str = os.path.join(DATA_DIR, "sqlite", "nexus.db")
    DOCUMENTS_DIR: str = os.path.join(DATA_DIR, "documents")
    
    # Models
    LLM_MODEL: str = "llama3" # Default local model for ollama
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # Configuration
    QDRANT_COLLECTION_NAME: str = "nexus_knowledge"
    MAX_UPLOAD_SIZE_MB: int = 50
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    class Config:
        env_file = ".env"

settings = Settings()

# Ensure directories exist
if settings.QDRANT_STORAGE_PATH != ":memory:":
    os.makedirs(settings.QDRANT_STORAGE_PATH, exist_ok=True)
os.makedirs(os.path.dirname(settings.SQLITE_DB_PATH), exist_ok=True)
os.makedirs(settings.DOCUMENTS_DIR, exist_ok=True)

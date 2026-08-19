from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from core.config import settings
from providers.embeddings import embedding_provider
import uuid
import os

class VectorStore:
    def __init__(self):
        # Use local persistent storage
        self.client = QdrantClient(path=settings.QDRANT_STORAGE_PATH)
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        
        # Ensure collection exists
        if not self.client.collection_exists(collection_name=self.collection_name):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=embedding_provider.vector_size, distance=Distance.COSINE),
            )

    def add_texts(self, texts: list[str], metadatas: list[dict]):
        embeddings = embedding_provider.embed_texts(texts)
        points = [
            PointStruct(
                id=str(uuid.uuid4()),
                vector=emb,
                payload={"text": text, **meta}
            )
            for text, emb, meta in zip(texts, embeddings, metadatas)
        ]
        self.client.upsert(collection_name=self.collection_name, points=points)

    def search(self, query: str, limit: int = 5, filters: dict = None):
        query_vector = embedding_provider.embed_text(query)
        # Note: Filtering is omitted for simplicity in MVP, but can be added via Filter
        search_result = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit,
            with_payload=True
        )
        return [{"score": hit.score, "payload": hit.payload} for hit in search_result]

vector_store = VectorStore()

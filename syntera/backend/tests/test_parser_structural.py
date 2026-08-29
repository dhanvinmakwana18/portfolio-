import pytest
from services.ingestion.parser import parse_text, chunk_text, update_heading_stack

def test_text_block_extraction():
    # We test the pure text fallback
    pages = parse_text("dummy_test.txt")
    assert len(pages) == 1
    assert pages[0]["blocks"][0]["type"] == "text"
    assert pages[0]["blocks"][0]["bbox"] is None

def test_heading_propagation():
    stack = []
    stack = update_heading_stack(stack, "# Main Title\nSome text")
    assert stack[-1]["title"] == "Main Title"
    
    stack = update_heading_stack(stack, "## Subtitle\nMore text")
    assert stack[-1]["title"] == "Subtitle"
    assert stack[0]["title"] == "Main Title"

def test_section_path_propagation():
    from services.ingestion.parser import format_section_path
    stack = [{'level': 1, 'title': 'Main Title'}, {'level': 2, 'title': 'Subtitle'}]
    assert format_section_path(stack) == "Main Title > Subtitle"

def test_chunking_preserves_structure():
    # If a table is passed as text, chunking might split it if it's over 1000 chars. 
    # But ingest_document doesn't pass tables to chunk_text, it just appends them directly!
    # So chunk_text will just chunk normal text.
    long_text = "a" * 1500
    chunks = chunk_text(long_text, chunk_size=1000, overlap=0)
    assert len(chunks) == 2
    assert len(chunks[0]) == 1000
    assert len(chunks[1]) == 500

def test_table_preservation_in_ingest_document(monkeypatch):
    # Mock parse_pdf to return a mock table and text
    def mock_parse_pdf(file_path):
        return [
            {
                "page": 1, 
                "blocks": [
                    {"type": "text", "bbox": [0,0,10,10], "text": "# My Heading\nIntro text."},
                    {"type": "table", "bbox": [0,20,100,50], "text": "| Col A | Col B |\n|---|---|\n| 1 | 2 |"},
                    {"type": "text", "bbox": [0,60,10,70], "text": "Outro text."}
                ]
            }
        ]
        
    monkeypatch.setattr("services.ingestion.parser.parse_pdf", mock_parse_pdf)
    
    # Mock vector store
    class MockVectorStore:
        def add_texts(self, texts, metadatas, ids=None):
            self.texts = texts
            self.metadatas = metadatas
            
    class MockBM25Store:
        _is_synced = True
        def add_texts(self, texts, metadatas, ids):
            pass
            
    mock_vs = MockVectorStore()
    monkeypatch.setattr("vectorstore.qdrant_client.vector_store", mock_vs)
    monkeypatch.setattr("vectorstore.bm25_store.bm25_store", MockBM25Store())
    
    from services.ingestion.parser import ingest_document
    count = ingest_document("fake.pdf", "fake")
    assert count == 3
    
    # Verify metadata
    assert mock_vs.metadatas[0]["block_type"] == "text"
    assert mock_vs.metadatas[0]["section"] == "My Heading"
    
    assert mock_vs.metadatas[1]["block_type"] == "table"
    assert mock_vs.metadatas[1]["section"] == "My Heading"
    assert mock_vs.metadatas[1]["bbox"] == [0,20,100,50]
    
    assert mock_vs.metadatas[2]["block_type"] == "text"
    assert mock_vs.metadatas[2]["section"] == "My Heading"


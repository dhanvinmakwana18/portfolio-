import fitz  # PyMuPDF
import os

def parse_pdf(file_path: str):
    """Extracts text and page metadata from a PDF file."""
    doc = fitz.open(file_path)
    pages = []
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        if text.strip():
            pages.append({"page": page_num + 1, "text": text})
    return pages

def parse_text(file_path: str):
    with open(file_path, "r", encoding="utf-8") as f:
        return [{"page": 1, "text": f.read()}]

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200):
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        if end == len(text):
            break
        start += chunk_size - overlap
    return chunks

def ingest_document(file_path: str, filename: str):
    from vectorstore.qdrant_client import vector_store
    
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        pages = parse_pdf(file_path)
    else:
        pages = parse_text(file_path)
        
    all_chunks = []
    all_metadatas = []
    
    for page_data in pages:
        chunks = chunk_text(page_data["text"])
        for chunk in chunks:
            all_chunks.append(chunk)
            all_metadatas.append({
                "source": filename,
                "page": page_data["page"],
                "type": "document"
            })
            
    if all_chunks:
        vector_store.add_texts(all_chunks, all_metadatas)
        
    return len(all_chunks)

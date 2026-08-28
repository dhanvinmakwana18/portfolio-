import fitz  # PyMuPDF
import os
import re

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
    separators = [
        "\n# ", "\n## ", "\n### ", "\n#### ",
        "\n\n", "\n", ". ", " ", ""
    ]
    
    def split_with_separator(text_to_split, sep):
        if sep == "": return list(text_to_split)
        parts = text_to_split.split(sep)
        result = []
        for i, part in enumerate(parts):
            if i > 0 and sep.startswith("\n"): 
                result.append(sep + part)
            elif i < len(parts) - 1 and not sep.startswith("\n"):
                result.append(part + sep)
            else:
                result.append(part)
        return [r for r in result if r]

    def recursive_split(text_to_split, current_sep_index):
        if len(text_to_split) <= chunk_size:
            return [text_to_split]
        if current_sep_index >= len(separators):
            return [text_to_split[i:i+chunk_size] for i in range(0, len(text_to_split), chunk_size - overlap)]
            
        sep = separators[current_sep_index]
        splits = split_with_separator(text_to_split, sep)
        
        if len(splits) == 1:
            return recursive_split(text_to_split, current_sep_index + 1)
            
        merged = []
        current_chunk = ""
        for s in splits:
            if len(current_chunk) + len(s) <= chunk_size:
                current_chunk += s
            else:
                if current_chunk: merged.append(current_chunk)
                if len(s) > chunk_size:
                    merged.extend(recursive_split(s, current_sep_index + 1))
                    current_chunk = ""
                else:
                    current_chunk = s
        if current_chunk:
            merged.append(current_chunk)
        return merged

    chunks = recursive_split(text, 0)
    
    if overlap > 0:
        overlapped_chunks = []
        for i, c in enumerate(chunks):
            if i > 0 and len(chunks[i-1]) > overlap:
                prefix = chunks[i-1][-overlap:]
                space_idx = prefix.find(" ")
                if space_idx != -1 and space_idx < len(prefix) // 2:
                    prefix = prefix[space_idx:]
                c = prefix + c
            if len(c) > chunk_size + overlap:
                c = c[:chunk_size + overlap]
            overlapped_chunks.append(c)
        return overlapped_chunks
    return chunks

def update_heading_stack(current_stack, chunk_text):
    matches = re.finditer(r'(?:^|\n)(#{1,6})\s+(.*)', chunk_text)
    new_stack = list(current_stack)
    for match in matches:
        level = len(match.group(1))
        title = match.group(2).strip()
        new_stack = [h for h in new_stack if h['level'] < level]
        new_stack.append({'level': level, 'title': title})
    return new_stack

def format_section_path(stack):
    if not stack:
        return "Root"
    return " > ".join([h['title'] for h in stack])

def ingest_document(file_path: str, filename: str):
    from vectorstore.qdrant_client import vector_store
    
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        pages = parse_pdf(file_path)
    else:
        pages = parse_text(file_path)
        
    all_chunks = []
    all_metadatas = []
    
    global_chunk_index = 0
    current_heading_stack = []
    
    for page_data in pages:
        chunks = chunk_text(page_data["text"])
        for chunk in chunks:
            current_heading_stack = update_heading_stack(current_heading_stack, chunk)
            section_path = format_section_path(current_heading_stack)
            section = current_heading_stack[-1]['title'] if current_heading_stack else "Root"
            
            chunk_id = f"{filename}_chunk_{global_chunk_index}"
            
            all_chunks.append(chunk)
            all_metadatas.append({
                "source": filename,
                "page": page_data["page"],
                "section": section,
                "section_path": section_path,
                "chunk_id": chunk_id,
                "chunk_index": global_chunk_index,
                "type": "document"
            })
            global_chunk_index += 1
            
    if all_chunks:
        # Use chunk_id directly as point id? Qdrant allows string UUIDs, but random strings are not valid UUIDs.
        # We can just generate a valid UUIDv5 from the chunk_id string so it's deterministic.
        import uuid
        doc_ids = [str(uuid.uuid5(uuid.NAMESPACE_URL, meta["chunk_id"])) for meta in all_metadatas]
        
        vector_store.add_texts(all_chunks, all_metadatas, ids=doc_ids)
        from vectorstore.bm25_store import bm25_store
        if not bm25_store._is_synced:
            bm25_store.sync_from_qdrant(vector_store)
        else:
            bm25_store.add_texts(all_chunks, all_metadatas, doc_ids)
        
    return len(all_chunks)

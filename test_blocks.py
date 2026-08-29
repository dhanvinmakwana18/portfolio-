import pymupdf
doc = pymupdf.open('C:/Users/TONY/.gemini/antigravity/brain/b2930b84-7f61-46fc-b8bd-f67cf2c9c624/.user_uploaded/media_1787165794785.pdf')

page = doc.load_page(0)
tables = page.find_tables()
table_bboxes = []
table_blocks = []
if tables and tables.tables:
    for i, tab in enumerate(tables.tables):
        bbox = tab.bbox
        table_bboxes.append(bbox)
        table_blocks.append({
            "type": "table",
            "bbox": bbox,
            "text": tab.to_markdown()
        })

blocks = page.get_text("blocks")
text_blocks = []
for b in blocks:
    if b[6] == 0:
        bbox = (b[0], b[1], b[2], b[3])
        text = b[4].strip()
        if not text: continue
        
        is_in_table = False
        for t_bbox in table_bboxes:
            # Check intersection using pymupdf Rect
            if pymupdf.Rect(bbox).intersects(pymupdf.Rect(t_bbox)):
                # Wait, what if the block is just a title above the table? 
                # Intersection might be too aggressive if bounding boxes overlap slightly.
                # Let's check overlap area.
                intersect_rect = pymupdf.Rect(bbox).intersect(pymupdf.Rect(t_bbox))
                if intersect_rect.get_area() > pymupdf.Rect(bbox).get_area() * 0.5:
                    is_in_table = True
                    break
        
        if not is_in_table:
            text_blocks.append({
                "type": "text",
                "bbox": bbox,
                "text": text
            })

all_blocks = table_blocks + text_blocks
all_blocks.sort(key=lambda x: (x["bbox"][1], x["bbox"][0]))

for i, b in enumerate(all_blocks):
    print(f"--- Block {i} ({b['type']}) ---")
    print(b["text"][:100].replace('\n', ' '))

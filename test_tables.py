import pymupdf
doc = pymupdf.open('C:/Users/TONY/.gemini/antigravity/brain/b2930b84-7f61-46fc-b8bd-f67cf2c9c624/.user_uploaded/media_1787165794785.pdf')
for page in doc:
    tables = page.find_tables()
    print(f"Page {page.number}: found {len(tables.tables)} tables")
    if len(tables.tables) > 0:
        for i, t in enumerate(tables.tables):
            print(f"Table {i}:")
            print(t.to_markdown())

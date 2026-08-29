import pymupdf
doc = pymupdf.open('C:/Users/TONY/.gemini/antigravity/brain/b2930b84-7f61-46fc-b8bd-f67cf2c9c624/.user_uploaded/media_1787165794785.pdf')
print(doc[0].get_text('text'))

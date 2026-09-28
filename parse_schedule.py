import pdfplumber

with pdfplumber.open("c-1.pdf") as pdf:

    page = pdf.pages[0]

    raw_text = page.extract_text()

    print(raw_text)
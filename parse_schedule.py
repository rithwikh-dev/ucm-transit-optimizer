import pdfplumber

with pdfplumber.open("c-1.pdf") as pdf:

    page = pdf.pages[0]

    raw_text = page.extract_text()

    all_lines = raw_text.split("\n")

    print("--- FILTERED SCHEDULE ROWS ---")

for line in all_lines:
    line = line.strip()

    if (":") in line:
        print(line)
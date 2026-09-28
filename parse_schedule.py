import pdfplumber

with pdfplumber.open("c-1.pdf") as pdf:

    page = pdf.pages[0]

    raw_text = page.extract_text()

    all_lines = raw_text.split("\n")

    print("--- FILTERED SCHEDULE ROWS ---")

for line in all_lines:
    line = line.strip()

    if (":") in line:
        tokens = line.split()

        beginningOfTimes = -1

        for index, value in enumerate(tokens):
            if (":") in value:
                beginningOfTimes = index
                break

        
        stopTimes = " ".join(tokens[beginningOfTimes:])
        stopName = " ".join(tokens[:beginningOfTimes])

        print(f"{stopName}: {stopTimes}")

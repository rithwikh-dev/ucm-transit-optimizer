import pdfplumber

inputBusLine = input("Which busline would you like to parse, Cattracks (enter 'c'), or Merced City bus (enter 'm').\n").lower()
userLine = ""

if inputBusLine == 'c':
    userLine = "cattracks"
elif inputBusLine == 'm':
    userLine = "mercedcitybus"
else:
    print("Sorry, you entered an invalid response.\n")

inputBusLine = input("Enter the pdf busline name, exactly how it is on the file:\n").lower()


with pdfplumber.open(f"transit_pdfs/{userLine}/{inputBusLine}.pdf") as pdf:

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

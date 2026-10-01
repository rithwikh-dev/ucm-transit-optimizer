import pdfplumber

with pdfplumber.open("./transit_pdfs/mercedcitybus/m-1.pdf") as pdf:
    page = pdf.pages[0]

    all_tables = page.extract_tables()

    print(f"total separate tables on page 1: {len(all_tables)}.")

   # if all_tables:
   #     print("--COLUMNS FOUND---")
   #     for index, column in enumerate(all_tables):
   #         print(f"Column Index: {column}, {index}")
#
   #     print("\n--- First Row of values ---")
   #     print(all_tables[1])
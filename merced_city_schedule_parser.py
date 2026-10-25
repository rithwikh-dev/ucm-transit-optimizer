import pdfplumber



with pdfplumber.open("transit_pdfs/mercedcitybus/m-3.pdf") as file:
    page = file.pages[0]
    text = page.extract_table()

    # Save length of header into variable for range function
    header_length = len(text[0])
    # Instead of creating a new list, we'll modify in place for better memory efficiency
    for i in range(header_length):
        text[0][i] = (text[0][i].replace('\n', ' ').strip())


    for row in text[1:]:
        if row[1] is None:
            row[0]=row[0].replace(' PM', 'PM')
            row = row[0].split()
        
        print(row)
    
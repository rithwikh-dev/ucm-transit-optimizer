import pdfplumber



with pdfplumber.open("transit_pdfs/mercedcitybus/m-3.pdf") as file:
    page = file.pages[0]
    text = page.extract_tables()

    # tables variable contains all of the different "tables" correct or not, that pdfplumber detected
    tables = []

    # actual schedule tables contain more than 3 rows, allowing us to easily identify the real schedules
    for index, table in enumerate(text):
        if len(table) >3:
            tables.append(table)


    for current_header in tables:

        # Save length of header into variable for range function
        header_length = len(current_header[0])
        # Instead of creating a new list, we'll modify in place for better memory efficiency
        for i in range(header_length):
            current_header[0][i] = (current_header[0][i].replace('\n', ' ').strip())

        print(current_header[0])


        route_data = {
            "stops": []
        }

        for row in current_header[1:]:
            if row[1] is None:
                row[0]=row[0].replace(' PM', 'PM').replace(' AM', 'AM')
                row = row[0].split()

            print(row)
        print("\n")

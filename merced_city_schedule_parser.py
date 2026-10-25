import pdfplumber



with pdfplumber.open("transit_pdfs/mercedcitybus/m-3.pdf") as file:
    page = file.pages[0]
    text = page.extract_tables()

    # tables variable contains all of the different "tables" correct or not, that pdfplumber detected
    tables = []
    titles = []

    # actual schedule tables contain more than 3 rows, allowing us to easily identify the real schedules
    for index, table in enumerate(text):
        if len(table) >3:
            tables.append(table)
        else:
            if len(table[0][0]) < 30:
                titles.append(table)
        

    table_destinations = []


    for line in titles:
        if "monday"  in line[0]:
            table_destinations.append(("weekday-transit-lines", line[0][0]))
        else:
             table_destinations.append(("weekday-transit-lines", line[0][0]))

    print(table_destinations)

"""
    master_json = {
        "weekday-transit-lines": {},
        "weekend-transit-lines": {}
    }

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
"""
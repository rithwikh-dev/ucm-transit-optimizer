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
            # the titles that distinguish weekend vs weekday lines are always less than 30 characters which we can isolate
            if len(table[0][0]) < 30:
                titles.append(table)
        
    # table destinations will contain information about the time of the week and line name
    table_destinations = []


    transit_line = "weekday-transit-lines"
    for line in titles:

        title_text = line[0][0].lower()

        if "weekend" in title_text:
             transit_line = "weekend-transit-lines"
             table_destinations.append((transit_line, line[0][0]))
        else:
            table_destinations.append((transit_line, line[0][0]))

   
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
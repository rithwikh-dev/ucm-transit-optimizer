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


    # since pdfplumber reads tables left to right, top to bottom, default state assumes weekday
    transit_line = "weekday-transit-lines"
    for line in titles:

        # extract title text (e.g. 'Monday-Friday | North Loop')
        title_text = line[0][0].lower()

        # change state only if we encounter weekend
        if "weekend" in title_text:
             transit_line = "weekend-transit-lines"
        
        table_destinations.append((transit_line, line[0][0]))

   

    master_json = {
        "weekday-transit-lines": {},
        "weekend-transit-lines": {}
    }



    for index, table in enumerate(tables):

        transit_category = table_destinations[index][0]
        transit_loop = table_destinations[index][1]

        # Save length of header into variable for range function
        header_length = len(table[0])

        # Instead of creating a new list, we'll modify in place for better memory efficiency
        for i in range(header_length):
            table[0][i] = table[0][i].replace('\n', ' ').strip()

        route_data = {
            "stops": {}
        }

        for header in table[0]:
            route_data["stops"][header] = []
        

        for row in table[1:]:
            if row[1] is None:
                row[0]=row[0].replace(' PM', 'PM').replace(' AM', 'AM')
                row = row[0].split()

            for col_index, time_string in enumerate(row):
                current_header = table[0][col_index]

                if ':' in time_string:
                    is_PM = "PM" in time_string
                    clean_time = time_string.replace("AM", "").replace("PM","").strip()
                    parts = clean_time.split(":")
                    hour = int(parts[0])
                    minutes = int(parts[1])

                    if is_PM and hour != 12:
                        hour += 12
                    elif not is_PM and hour == 12:
                        hour = 0

                    raw_minutes = (hour * 60) + minutes
                    route_data["stops"][current_header].append(raw_minutes)

            master_json[transit_category][transit_loop] = route_data

            print(master_json)



        
        

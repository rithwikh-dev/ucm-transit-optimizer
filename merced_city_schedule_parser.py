import pdfplumber
import json
import os
import re

filename = "merced_city_transit_schedule.json"
# 1. Set the default blank architecture first
master_json = {
    "weekday-transit-lines": {},
    "weekend-transit-lines": {}
}

# 2. Check if the file exists
if os.path.exists(filename):
    try:
        # Try to read it and overwrite the blank architecture
        with open(filename, "r") as json_file:
            master_json = json.load(json_file)
    except json.JSONDecodeError:
        # If the file is completely empty or corrupted, ignore the error 
        # and just keep using the blank architecture we set in step 1
        pass

file_to_parse = int(input("Enter 1-7 for bus lines m-1 through m-7 (e.g. 4 corresponds to m-4, 7 corresponds to m-7) or 8 for route-uc:\n"))
if file_to_parse > 0 and file_to_parse < 8:
    file_to_parse = "m-" + str(file_to_parse)
elif file_to_parse == 8:
    file_to_parse = "route-uc"
else:
    print("Invalid Input.")

with pdfplumber.open(f"transit_pdfs/mercedcitybus/{file_to_parse}.pdf") as file:
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

        if "northloop" in title_text:
            title_text = file_to_parse.upper()+ ": North Loop"
        elif "southloop" in title_text:
            title_text = file_to_parse.upper() + ": South Loop"

        table_destinations.append((transit_line, title_text))


    for index, table in enumerate(tables):

        transit_category = table_destinations[index][0]
        transit_loop = table_destinations[index][1]

        # Save length of header into variable for range function
        header_length = len(table[0])

        # Instead of creating a new list, we'll modify in place for better memory efficiency
        for i in range(header_length):
            header_text = table[0][i]

            # 1. UNIVERSAL FALLBACK: Catch empty cells OR floating bus bay numbers (e.g., "1", "②")
            if header_text is None or len(header_text.strip()) <= 2:
                fallback = table[1][i]
                # Ensure the fallback is text and not a bus time
                if fallback is not None and ":" not in fallback:
                    header_text = fallback

            # 2. GENERALIZED CLEANING
            if header_text is None:
                header_text = ""
            else:
                header_text = header_text.replace('\n', ' ').strip()

                # AUTOMATIC UN-SQUISHER: Adds space between lowercase and uppercase (ChavezPk -> Chavez Pk)
                header_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', header_text)
                
                # Fix missing spaces around common symbols
                header_text = header_text.replace("&", " & ")
                
                # Global dictionary for common preposition typos (safe for all 8 PDFs)
                header_text = header_text.replace("Streetat", "Street at").replace("Acrossfrom", "Across from")
                
                # Clean up any accidental double-spaces we just created
                header_text = " ".join(header_text.split())

            table[0][i] = header_text

        route_data = {
            "stops": {}
        }

        # 3. Only create keys for valid headers (ignores empty ghost columns entirely)
        for header in table[0]:
            if header != "":
                route_data["stops"][header] = []
        

        for row in table[1:]:
            if row[1] is None:
                row[0]=row[0].replace(' PM', 'PM').replace(' AM', 'AM')
                row = row[0].split()

            for col_index, time_string in enumerate(row):
                current_header = table[0][col_index]

                # Instantly skip empty times OR ghost columns
                if time_string is None or current_header == "":
                    continue

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


    with open(filename, "w") as json_file:

        json.dump(master_json, json_file, indent=4)

    print("Data successfully saved to " + filename)



        
        

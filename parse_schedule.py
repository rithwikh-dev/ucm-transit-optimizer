import pdfplumber

inputBusLine = input("Which busline would you like to parse, Cattracks (enter 'c'), or Merced City bus (enter 'm').\n").lower()
userLine = ""

if inputBusLine == 'c':
    userLine = "cattracks"
elif inputBusLine == 'm':
    userLine = "mercedcitybus"
else:
    print("Sorry, you entered an invalid response.\n")

inputBusLine = input("Enter the pdf busline name, exactly how it is on the file: (e.g., 'e-1')\n").lower()

with pdfplumber.open(f"transit_pdfs/{userLine}/{inputBusLine}.pdf") as pdf:
    page = pdf.pages[0]
    raw_text = page.extract_text()
    all_lines = raw_text.split("\n")

    print("--- FILTERED SCHEDULE ROWS ---")

    for line in all_lines:
        line = line.strip()

        if ":" in line:
            tokens = line.split()
            beginningOfTimes = -1

            # Find where the timestamps start
            for index, value in enumerate(tokens):
                if ":" in value:
                    beginningOfTimes = index
                    break

            # 🌟 STATE TRACKER: Reset tracking for each new bus trip row
            pm_mode = False
            last_hour = 0

            # Loop through the times using the absolute index of the tokens array
            for index in range(beginningOfTimes, len(tokens)):
                value = tokens[index]
                
                # Clean up any residual characters just in case
                clean_value = value.replace("AM", "").replace("PM", "")

                if clean_value != "REQ" and ":" in clean_value:
                    # Clean split! "1:30" becomes ["1", "30"]
                    time_parts = clean_value.split(":")
                    hour = int(time_parts[0])
                    minutes = int(time_parts[1])

                    
                   
                    if hour == 12 and last_hour == 11:
                        pm_mode = True
                   
                    elif hour < last_hour and last_hour == 12:
                        pm_mode = True
                    
                    elif hour < last_hour and hour != 12:
                        pm_mode = True

                    
                    last_hour = hour

                    
                    if pm_mode and hour != 12:
                        hour += 12

                    elif not pm_mode and hour == 12:
                        hour = 0  # Handle 12 am exception

                    
                    total_minutes = (hour * 60) + minutes
                    
                    # overwrite token with new numeric integer string
                    tokens[index] = str(total_minutes)
            
            stopTimes = " ".join(tokens[beginningOfTimes:])
            stopName = " ".join(tokens[:beginningOfTimes])

            print(f"Stop: {stopName:.<35} Minutes: {stopTimes}")

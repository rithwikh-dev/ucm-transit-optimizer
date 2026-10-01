import json

with open("./data/transit_schedules.json", "r") as file:
    data = json.load(file)

    print(f"Data type: {type(data)}")

    # 1. If it's a Dictionary (Keys and Sub-objects)
    if isinstance(data, dict):
        keys = list(data.keys())
        print(f"Top-level keys in your JSON: {keys}")
        
        # Safe peek: If keys exist, let's look at the first key's contents
        if len(keys) > 0:
            first_key = keys[0]
            print(f"\nExample content under key '{first_key}':")
            print(data[first_key])

    # 2. If it's a List (Sequential array arrays)
    elif isinstance(data, list):
        print(f"Your JSON is a list. Total items: {len(data)}")
        
        # Safe peek: grab index 0 safely inside the list block
        if len(data) > 0:
            print(f"\nExample of the first item in the list:")
            print(f"{data[0]}\n")

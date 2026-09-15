import datetime

def test_temporal_tracking():
    current = datetime.datetime.now()

    day = current.weekday()

    if day > 5:
        schedule_key = "weekend-transit-lines"
    else:
        schedule_key = "weekday-transit-lines"

    current_minutes = (current.hour * 60) + current.minute

    print(f"\nCurrent Date:            {current.strftime('%A, %Y-%m-%d')}")
    print(f"Current Clock Time:      {current.strftime('%I:%M %p')}")
    print(f"Minutes Past 00:00 =  {current_minutes}")
    print(f"Target Database Sector: {schedule_key}\n")

if __name__ == "__main__":
    test_temporal_tracking()
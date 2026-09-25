//path: js/timeUtils.js

/** For the purposes of the UCM Transit Scheduler,
 * time will be measured in minutes after 00:00.
 */
 
export function getCurrentMinutes() {
    const now  = new Date();
    return (now.getHours() * 60) + now.getMinutes();
}


/**
 * Weekday vs Weekend determines which transit lines are available,
 * so it's essential to gather the current day.
 */
export function formatTime(minutes) {
    let meridian = "";
    if (minutes >= 720) {
        meridian = "pm";
    } else {
        meridian = "am";
    }

    // Convert total minutes into standard 12-hour format hours and minutes
    let rawHours = Math.floor(minutes / 60);
    let hours = rawHours % 12;
    if (hours === 0) hours = 12; // Handle 12:00 AM / 12:00 PM edge cases

    let min = minutes % 60;
    
    // Pad minutes with a leading zero if they are single digits (e.g. 8:05 instead of 8:5)
    let paddedMinutes = min < 10 ? "0" + min : min;

    return `${hours}:${paddedMinutes}${meridian}`;
}

export function getScheduleKey() {
    const now = new Date();
    const day = now.getDay();


    if (day == 0 /**sunday*/|| day == 6 /*saturday */){
        return "weekend-transit-lines";
    }
    else return "weekday-transit-lines";
}

export function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], {hour : "2-digit", minute : "2-digit"});
}
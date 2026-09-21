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
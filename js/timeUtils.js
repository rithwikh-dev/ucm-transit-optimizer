//path: js/timeUtils.js

/** For the purposes of the UCM Transit Scheduler,
 * time will be measured in minutes after 00:00.
 */
 
export function getCurrentMinutes() {
    const now  = new Date();
    return (now.getHours() * 60) + now.getMinutes();
}
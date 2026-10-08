// js/transitLogic.js

import { formatTime } from "./timeUtils.js";

/*
 * @param {Object} data - Full transit Schedule json database.
 * @param {String} scheduleType - "weekday-transit-lines" or "weekend-transit-lines"
 * @param {String} currentStop - The starting point (Origin)
 * @param {String} destinationStop - The target destination (A-to-B)
 * @param {Number} currentMinutes - time in minutes past midnight
 * @returns {Array} - List of valid upcoming bus lines traveling in the correct direction
 */
export function findBestStop(data, scheduleType, currentStop, destinationStop, currentMinutes) {
    const lines = data[scheduleType];
    let viableStops = [];

    // Loop through every available bus line route in our database
    for (const [lineName, lineData] of Object.entries(lines)) {
        const allStops = lineData.stops;

        // Ensure BOTH the starting point and destination exist on this bus line
        if (currentStop in allStops && destinationStop in allStops) {
            const originTimes = allStops[currentStop];
            const destTimes = allStops[destinationStop];

            // Find the index of the first trip where the bus hits the origin stop AFTER right now
            const tripIndex = originTimes.findIndex(time => time !== "REQ" && time >= currentMinutes);

            // If an upcoming trip exists
            if (tripIndex !== -1) {
                const originArrival = originTimes[tripIndex];
                const destArrival = destTimes[tripIndex];

                // Ensure the destination isn't "Request Only" (REQ) 
                // AND ensure the destination time happens AFTER the origin time (this ensures the correct direction!)
                if (destArrival !== "REQ" && destArrival > originArrival) {
                    viableStops.push({
                        line: lineName,
                        time: formatTime(originArrival),
                        rawMinutes: originArrival
                    });
                }
            }
        }
    }
    return viableStops;
}

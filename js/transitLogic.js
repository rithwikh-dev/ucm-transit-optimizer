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

    for (const [lineName, lineData] of Object.entries(lines)) {
        const allStops = lineData.stops;

        // Ensure BOTH the starting point and destination exist on this bus line
        if (currentStop in allStops && destinationStop in allStops) {
            const originTimes = allStops[currentStop];
            const destTimes = allStops[destinationStop];

            for(let i = 0; i < originTimes.length; i++){
                const originArrival = originTimes[i];

                if(originArrival === "REQ" || originArrival < currentMinutes){
                    continue;
                }

                // Search the destination array for the first valid arrival AFTER the originArrival
                let foundValidDest = false;
                for(let j = 0; j < destTimes.length; j++) {
                    const destArrival = destTimes[j];
                    
                    if(destArrival !== undefined && destArrival !== "REQ" && destArrival > originArrival) {
                        foundValidDest = true;
                        break;
                    }
                }

                // If a valid destination time exists, this is a viable bus to board
                if(foundValidDest){
                    viableStops.push({
                        line: lineName,
                        time: formatTime(originArrival),
                        rawMinutes: originArrival
                    });

                    // Break out of the origin loop so we only recommend the next immediate bus
                    break; 
                }
            }
        }
    }
    return viableStops;
}
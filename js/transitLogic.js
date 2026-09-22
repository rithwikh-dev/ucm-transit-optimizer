// js/transitLogic.js

/*
 * @param {Object} data - Full transit Schedule json database.
 * @param {String} scheduleType - "weekday-transit-lines" or "weekend-transit-lines"
 * @param {String} lineName - e.g., "G-Line"
 * @param {String} stopName - e.g., "R St. Village Apartments"
 * @param {Number} currentMinutes - time in minutes past midnight
 * @returns {Object} - Details about the next bus or an error message
 */

export function findBestStop(data, scheduleType, currentStop, currentMinutes) {
    const lines = data[scheduleType];

    for(const[lineName, lineData] of Object.entries(lines)) {

        const allStopsinLine = lineData.stops;

        if (currentStop in allStopsinLine) {
            const stopTimes = allStopsinLine[currentStop];
        }
        
    }
}
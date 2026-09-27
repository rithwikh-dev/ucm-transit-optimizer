// js/app.js

import { findBestStop } from "./transitLogic.js";
import { getScheduleKey } from "./timeUtils.js";
import { getCurrentMinutes } from "./timeUtils.js";

async function loadTransitData(currentStop){
    try{
        const response = await fetch("../data/transit_schedules.json");
        const data = await response.json();
        
        const testResults = findBestStop(data, getScheduleKey(data), currentStop, getCurrentMinutes());
        let viableStops = document.getElementById("bus-list");
        if (testResults.length > 0){
            viableStops.innerHTML = "";
            
            testResults.forEach(route =>{

                viableStops.innerHTML += `<li><span>${route.line}: </span><span>${route.time}</span></li>`;

            });
        }
        else {
            viableStops.innerHTML = "<p>No Bus Lines running today.</p>"
        }
        

    }

    catch(error) {
        console.error("Couldn't load schedule data: ", error);
    }

}


/**
 * Loading University Transit Center Initially since that's the central hub for students!
 */
loadTransitData("University Transit Center");
/**
 * Event Listener for User selection of their current stop.
 */

const selectMenu = document.getElementById("stop-selector");

selectMenu.addEventListener("change", function(event) {
    let selectedStop = event.target.value;

    console.log("The user just selected a new stop: ", selectedStop);

    loadTransitData(selectedStop);
});
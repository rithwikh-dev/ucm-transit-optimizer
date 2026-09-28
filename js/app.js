// js/app.js

import { findBestStop } from "./transitLogic.js";
import { formatTime, getScheduleKey } from "./timeUtils.js";
import { getCurrentMinutes } from "./timeUtils.js";

let appData = null;

async function initApp(){
    try {
        const response = await fetch("../data/transit_schedules.json");
        appData = await response.json();

/**
 * Loading University Transit Center Initially since that's the central hub for student transit!
 */
        

        updateDropdown();

        loadTransitData("University Transit Center");

        startLiveClock();


    }
    catch(error){
        console.error("Failed to load transit schedule data: ", error);
    }
}


async function loadTransitData(currentStop){

    try{
        const testResults = findBestStop(appData, getScheduleKey(appData), currentStop, getCurrentMinutes());
        let viableStops = document.getElementById("bus-list");

        function calculateArrival(){
            const liveMinutes = getCurrentMinutes();

        }

        if (testResults.length > 0){

            viableStops.innerHTML = "";
            testResults.forEach(route =>{
                viableStops.innerHTML += `
                <li>
                <span class ="route-name">${route.line}: </span>
                <span class = "route-arrival"> Arriving in minutes. </span>
                <span class = "route-time">${route.time}</span>
                </li>
                `;
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

function startLiveClock(){
    const clockElement = document.getElementById("live-clock");
    const selectMenu = document.getElementById("stop-selector");

    function tick(){
        const liveMinutes = getCurrentMinutes();

        clockElement.textContent = formatTime(liveMinutes);

        if (selectMenu && selectMenu.value){
            loadTransitData(selectMenu.value);
        }
    }

    tick();
    setInterval(tick, 10000);
}

async function updateDropdown(){
    try{
        const weekLines = getScheduleKey();

        const activeLines = appData[weekLines];

        let uniqueStops = new Set();
        for(const[lineName, lineData] of Object.entries(activeLines)){
            
            Object.keys(lineData.stops).forEach(stopName =>{
                uniqueStops.add(stopName);
            })
        }

        const dropDown = document.getElementById("stop-selector");
        dropDown.innerHTML = "";

        uniqueStops.forEach(stop =>{
            dropDown.innerHTML += `<option value ="${stop}">${stop}</option>`;
        });
        

        
    }
    catch(error){
        console.error("Couldn't load schedule data.", error);
    }
}

initApp();

/**
 * Event Listener for User selection of their current stop.
 */

const selectMenu = document.getElementById("stop-selector");

selectMenu.addEventListener("change", function(event) {
    let selectedStop = event.target.value;

    console.log("The user just selected a new stop: ", selectedStop);

    loadTransitData(selectedStop);
});
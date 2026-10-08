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

        loadTransitData("University Transit Center", "Amtrak Station");

        startLiveClock();


    }
    catch(error){
        console.error("Failed to load transit schedule data: ", error);
    }
}


async function loadTransitData(currentStop, destinationStop){

    try{
        const testResults = findBestStop(appData, getScheduleKey(appData), currentStop, destinationStop, getCurrentMinutes());
        let viableStops = document.getElementById("bus-list");

        function calculateArrival(){
            const liveMinutes = getCurrentMinutes();

        }

        if (testResults.length > 0){

            viableStops.innerHTML = "";
            testResults.forEach(route =>{
                viableStops.innerHTML += `
                <li class = "clickable-route-item" data-line = "${route.line}" style = "cursor: pointer;">
                <span class ="route-name">${route.line}: </span>
                <span class = "route-arrival"> Arriving in minutes. </span>
                <span class = "route-time">${route.time}</span>
                </li>
                `;
            });

            viableStops.onitemclick = null;
            viableStops.onclick = (event) => {
                const clickedItem = event.target.closest('.clickable-route-item');
                if (clickedItem){
                    const lineName = clickedItem.getAttribute('data-line');
                    handleRouteClick(lineName, currentStop, destinationStop);
                }
            }

        }
        else {
            viableStops.innerHTML = "<p>No Bus Lines running today.</p>"
        }
    }
    catch(error) {
        console.error("Couldn't load schedule data: ", error);
    }
}

function handleRouteClick(lineName, origin, destination){
    console.log(`User clicked on route: ${lineName}. Routing from ${origin} to ${destination}.`);

    alert(`You selected ${lineName}.\n Destination: ${destination}`);
}

function startLiveClock(){
    const clockElement = document.getElementById("live-clock");
    const selectMenu = document.getElementById("stop-selector");
    const destinationMenu = document.getElementById("destination-selector");

    function tick(){
        const liveMinutes = getCurrentMinutes();

        clockElement.textContent = formatTime(liveMinutes);

        if (selectMenu && selectMenu.value && destinationMenu && destinationMenu.value){
            loadTransitData(selectMenu.value, destinationMenu.value);
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
        const destinationDropDown = document.getElementById("destination-selector");

        dropDown.innerHTML = "";
        destinationDropDown.innerHTML = "";

        uniqueStops.forEach(stop =>{
            dropDown.innerHTML += `<option value ="${stop}">${stop}</option>`;
            destinationDropDown.innerHTML += `<option value = "${stop}">${stop}</option>`;
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

const originMenu = document.getElementById("stop-selector");
const destinationMenu = document.getElementById("destination-selector")

function handleRouteSelection(){

    const origin = originMenu.value;
    const destination = destinationMenu.value;

    console.log(`Routing requested: From [${origin}] to [${destination}].`)
    loadTransitData(origin, destination);
}

originMenu.addEventListener("change", handleRouteSelection);
destinationMenu.addEventListener("change", handleRouteSelection);
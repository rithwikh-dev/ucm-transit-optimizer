// js/app.js

import { findBestStop } from "./transitLogic.js";
import { formatTime, getScheduleKey } from "./timeUtils.js";
import { getCurrentMinutes } from "./timeUtils.js";

let appData = null;

async function initApp(){
    try {
        const response = await fetch("../data/transit_schedules.json");
        appData = await response.json();

        
        updateDropdown();

        const originMenu = document.getElementById("stop-selector");
        const destinationMenu = document.getElementById("destination-selector");

        if (originMenu && destinationMenu) {
            
            if (destinationMenu.options.length > 1) {
                destinationMenu.selectedIndex = 1;
            }

            
            const handleRouteSelection = () => {
                console.log(`Routing requested: From [${originMenu.value}] to [${destinationMenu.value}].`);
                loadTransitData(originMenu.value, destinationMenu.value);
            };

            originMenu.addEventListener("change", handleRouteSelection);
            destinationMenu.addEventListener("change", handleRouteSelection);

            
            loadTransitData(originMenu.value, destinationMenu.value);
        }

        startLiveClock();
    }
    catch(error){
        console.error("Failed to load transit schedule data: ", error);
    }
}


async function loadTransitData(currentStop, destinationStop){
    try{
        const currentMinutes = getCurrentMinutes();
        const testResults = findBestStop(appData, getScheduleKey(), currentStop, destinationStop, currentMinutes);
        let viableStops = document.getElementById("bus-list");

        if (testResults.length > 0){
            viableStops.innerHTML = "";
            testResults.forEach(route =>{
                const minutesLeft = route.rawMinutes - currentMinutes;

                let arrivalText = "";
                if (minutesLeft === 0){
                    arrivalText = "The bus has arrived!";
                }
                else if (minutesLeft === 1){
                    arrivalText = "Arriving in 1 minute!"
                }
                else {
                    arrivalText = `Arriving in ${minutesLeft} minutes.`
                }

                let statusClass = "";
                if (minutesLeft <= 5){
                    statusClass = "status-red";
                }
                else if (minutesLeft <= 10 && minutesLeft > 5){
                    statusClass = "status-yellow";
                }
                else {
                    statusClass = "status-green";
                }

                viableStops.innerHTML += `
                <li class="clickable-route-item" data-line="${route.line}" style="cursor: pointer;">
                    <span class="route-name">${route.line}: </span>
                    <span class="route-arrival"> ${arrivalText} </span>
                    <span class="route-time ${statusClass}">${route.time}</span>
                </li>
                `;
            });

            viableStops.onclick = (event) => {
                const clickedItem = event.target.closest('.clickable-route-item');
                if (clickedItem){
                    const lineName = clickedItem.getAttribute('data-line');
                    handleRouteClick(lineName, currentStop, destinationStop);
                }
            };
        }
        else {
            viableStops.innerHTML = "<p>No Bus Lines running today.</p>";
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
            });
        }

        const dropDown = document.getElementById("stop-selector");
        const destinationDropDown = document.getElementById("destination-selector");

        dropDown.innerHTML = "";
        destinationDropDown.innerHTML = "";

        uniqueStops.forEach(stop =>{
            dropDown.innerHTML += `<option value="${stop}">${stop}</option>`;
            destinationDropDown.innerHTML += `<option value="${stop}">${stop}</option>`;
        });
    }
    catch(error){
        console.error("Couldn't load schedule data.", error);
    }
}

// Start the application
initApp();

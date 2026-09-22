// js/app.js

import { findBestStop } from "./transitLogic";

async function loadTransitData(){
    try{
        const response = await fetch("../data/transit_schedules.json");
        const data = await response.json();
        console.log("Schedules loaded successfully!");

    }

    catch {
        console.log("Couldn't load schedule data: ", error);
    }

}

loadTransitData();
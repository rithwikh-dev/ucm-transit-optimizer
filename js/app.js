// js/app.js

import { findBestStop } from "./transitLogic.js";
import { getScheduleKey } from "./timeUtils.js";
import { getCurrentMinutes } from "./timeUtils.js";

async function loadTransitData(){
    try{
        const response = await fetch("../data/transit_schedules.json");
        const data = await response.json();
        
        const testResults = findBestStop(data, getScheduleKey(data), "University Transit Center", getCurrentMinutes());
        if (testResults.length > 0){
            console.log("Viable bus routes found: ", testResults);
        }
        else {
            console.log("No bus routes found.");
        }
        

    }

    catch(error) {
        console.error("Couldn't load schedule data: ", error);
    }

}

loadTransitData();
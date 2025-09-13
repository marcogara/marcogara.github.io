// stationToGo.js - Display both station options for user decision

// Function to get the next departure time based on timetable
function getNextDeparture(timetable, currentTime, walkingTime = 0) {
    const arrivalTime = new Date(currentTime + walkingTime);
    const arrivalHour = arrivalTime.getHours();
    const arrivalMinute = arrivalTime.getMinutes();
    
    // Check departures in the arrival hour
    for (const minute of timetable) {
        const departure = new Date(arrivalTime);
        departure.setHours(arrivalHour, minute, 0, 0);
        
        if (departure.getTime() >= arrivalTime.getTime()) {
            return departure.getTime();
        }
    }
    
    // No departures left in arrival hour, get first departure of next hour
    const nextHour = new Date(arrivalTime);
    nextHour.setHours(arrivalHour + 1, timetable[0], 0, 0);
    return nextHour.getTime();
}

// Function to calculate station details
function calculateStationDetails(station, currentTime) {
    const nextDeparture = getNextDeparture(station.timetable, currentTime, station.walkingTime);
    const arrivalTime = currentTime + station.walkingTime;
    const waitingTime = Math.max(0, nextDeparture - arrivalTime);
    const totalTime = station.walkingTime + waitingTime;
    
    return {
        ...station,
        nextDeparture,
        arrivalTime,
        waitingTime,
        totalTime,
        canCatch: arrivalTime <= nextDeparture
    };
}

// Main function to display both station options
function updateStationDisplay() {
    const stationsToChoose = Object.values(STATION_CONFIG);

    const stationToGoElement = document.getElementById('stationToGo');
    
    const updateDisplay = () => {
        const currentTime = Date.now();
        const now = new Date(currentTime);
        
        // Calculate details for both stations
        const stationDetails = stationsToChoose.map(station => 
            calculateStationDetails(station, currentTime)
        );
        
        // Find the optimal station (for highlighting)
        const optimalStation = stationDetails.reduce((best, current) => 
            current.totalTime < best.totalTime ? current : best
        );
        
        // Create the display HTML
        const currentTimeStr = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        let displayHTML = `
            <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                <strong>Current Time: ${currentTimeStr}</strong>
            </div>
        `;
        
        stationDetails.forEach(station => {
            const walkMinutes = Math.round(station.walkingTime / (60 * 1000));
            const waitMinutes = Math.round(station.waitingTime / (60 * 1000));
            const totalMinutes = Math.round(station.totalTime / (60 * 1000));
            
            const arrivalTimeStr = new Date(station.arrivalTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            const departureTimeStr = new Date(station.nextDeparture).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            const isOptimal = station.name === optimalStation.name;
            const backgroundColor = isOptimal ? '#e8f5e8' : '#f8f8f8';
            const borderColor = isOptimal ? '#4caf50' : '#ddd';
            const recommendationText = isOptimal ? ' ⭐ RECOMMENDED' : '';
            
            displayHTML += `
                <div style="
                    background: ${backgroundColor}; 
                    border: 2px solid ${borderColor}; 
                    padding: 15px; 
                    margin-bottom: 10px; 
                    border-radius: 8px;
                    font-family: monospace;
                ">
                    <h3 style="margin: 0 0 10px 0; color: #333;">
                        🚉 ${station.name}${recommendationText}
                    </h3>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px 15px; font-size: 14px;">
                        <span>🚶 Walking time:</span><span><strong>${walkMinutes} minutes</strong></span>
                        <span>📍 You arrive at:</span><span><strong>${arrivalTimeStr}</strong></span>
                        <span>🚋 Next departure:</span><span><strong>${departureTimeStr}</strong></span>
                        <span>⏰ Waiting time:</span><span><strong>${waitMinutes} minutes</strong></span>
                        <span>⏱️ Total time:</span><span><strong>${totalMinutes} minutes</strong></span>
                    </div>
                </div>
            `;
        });
        
        // Update the display
        if (stationToGoElement) {
            stationToGoElement.innerHTML = displayHTML;
        }
        
        setTimeout(updateDisplay, SIMULATION_CONFIG.displayUpdateInterval);
    };
    
    updateDisplay();
}

// Start the display when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateStationDisplay();
});

// Export for use by other scripts
window.calculateStationDetails = calculateStationDetails;
 
class MetroSimulation {
    constructor() {
        this.stations_a = METRO_STATIONS_A;
        this.stations_b = METRO_STATIONS_B;
        this.trams = [];
        this.metroLine = document.getElementById('metroLine');
        this.timerElement = document.getElementById('timer');
        this.stationToGoElement = document.getElementById('stationToGo');
        
        this.departureInterval = SIMULATION_CONFIG.departureInterval;
        this.journeyDuration = SIMULATION_CONFIG.journeyDuration;
        
        this.renderer = new MetroRenderer(this.metroLine, this.stations_a, this.calculateTramPosition.bind(this));
        
        this.calculateNextDepartureTime();
        
        this.init();
    }

    calculateNextDepartureTime() {
        const now = new Date();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();
        
        // Get the Am Steinberg timetable
        const amSteinbergTimetable = STATION_CONFIG["Am Steinberg"].timetable; // [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58]
        
        // Find the next departure time based on the timetable
        let nextDeparture = null;
        
        // Check if there's a departure in the current hour
        for (const minute of amSteinbergTimetable) {
            const departureTime = new Date(now);
            departureTime.setMinutes(minute, 0, 0);
            
            if (departureTime.getTime() > now.getTime()) {
                nextDeparture = departureTime;
                break;
            }
        }
        
        // If no departure found in current hour, get first departure of next hour
        if (!nextDeparture) {
            nextDeparture = new Date(now);
            nextDeparture.setHours(now.getHours() + 1, amSteinbergTimetable[0], 0, 0);
        }
        
        this.nextDepartureTime = nextDeparture.getTime();
        console.log(`Next departure scheduled for: ${nextDeparture.toLocaleTimeString()}`);
    }

    // Calculate where a tram should be based on its departure time and current time
    calculateTramPosition(departureTime, currentTime) {
        const elapsedMinutes = (currentTime - departureTime) / (60 * 1000);
        
        // Convert STATION_INTERVALS to array format for easier processing
        const stationIntervals = Object.entries(STATION_INTERVALS)
            .map(([name, time]) => ({ name, time }))
            .sort((a, b) => a.time - b.time);
        
        // If tram hasn't departed yet, it should be at Am Steinberg
        if (elapsedMinutes < 0) {
            return { currentStation: 'Am Steinberg', stationProgress: 0 };
        }
        
        // If tram has completed its journey, it should be at the end
        const totalJourneyTime = stationIntervals[stationIntervals.length - 1].time;
        if (elapsedMinutes >= totalJourneyTime) {
            return { currentStation: stationIntervals[stationIntervals.length - 1].name, stationProgress: 0 };
        }
        
        // Find which station the tram should be at
        let currentStation = 'Am Steinberg';
        let stationProgress = 0;
        
        for (let i = 0; i < stationIntervals.length - 1; i++) {
            const currentStationTime = stationIntervals[i].time;
            const nextStationTime = stationIntervals[i + 1].time;
            
            if (elapsedMinutes >= currentStationTime && elapsedMinutes < nextStationTime) {
                currentStation = stationIntervals[i].name;
                stationProgress = (elapsedMinutes - currentStationTime) / (nextStationTime - currentStationTime);
                break;
            } else if (elapsedMinutes >= nextStationTime) {
                currentStation = stationIntervals[i + 1].name;
                stationProgress = 0;
            }
        }
        
        return { currentStation, stationProgress };
    }

    

    init() {
        this.renderer.createStations();
        this.startSimulation();
        this.updateTimer();
    }

    createTram(departureTime) {
        const tramData = this.renderer.createTram(departureTime);
        this.trams.push(tramData);
        this.renderer.animateTram(tramData, this.trams);
    }

    updateTimer() {
        const updateDisplay = () => {
            const currentTime = Date.now();
            const timeUntilNext = this.nextDepartureTime - currentTime;
            
            if (timeUntilNext <= 0) {
                // Time for departure
                this.createTram(this.nextDepartureTime);
                this.calculateNextDepartureTime(); // Calculate next departure
            }
            
            const timeUntilNextAdjusted = this.nextDepartureTime - Date.now();
            const minutes = Math.floor(timeUntilNextAdjusted / 60000);
            const seconds = Math.floor((timeUntilNextAdjusted % 60000) / 1000);
            
            this.timerElement.textContent = `Next departure in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            setTimeout(updateDisplay, SIMULATION_CONFIG.updateInterval);
        };
        
        updateDisplay();
    }

    startSimulation() {
        const currentTime = Date.now();
        const now = new Date();
        
        console.log(`Current time: ${now.toLocaleTimeString()}`);
        
        // Get the Am Steinberg timetable
        const amSteinbergTimetable = STATION_CONFIG["Am Steinberg"].timetable; // [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58]
        
        // Find all recent departures that should still be visible
        const recentDepartures = [];
        
        // Check current hour and previous hour for departures
        for (let hourOffset = 0; hourOffset <= 1; hourOffset++) {
            const checkHour = now.getHours() - hourOffset;
            const checkDate = new Date(now);
            checkDate.setHours(checkHour, 0, 0, 0);
            
            for (const minute of amSteinbergTimetable) {
                const departureTime = new Date(checkDate);
                departureTime.setMinutes(minute, 0, 0);
                
                const elapsedMinutes = (currentTime - departureTime.getTime()) / (60 * 1000);
                
                // If the tram departed within the last 14 minutes but more than 30 seconds ago, add it to the list
                if (elapsedMinutes >= 0.5 && elapsedMinutes <= 14) {
                    recentDepartures.push({
                        time: departureTime.getTime(),
                        elapsed: elapsedMinutes
                    });
                }
            }
        }
        
        // Sort by departure time (most recent first)
        recentDepartures.sort((a, b) => b.time - a.time);
        
        console.log(`Found ${recentDepartures.length} recent departures`);
        
        // Create trams for recent departures (limit to 4 to avoid too many)
        for (let i = 0; i < Math.min(recentDepartures.length, 4); i++) {
            const departure = recentDepartures[i];
            console.log(`Creating tram that departed ${departure.elapsed.toFixed(2)} minutes ago at ${new Date(departure.time).toLocaleTimeString()}`);
            this.createTram(departure.time);
        }
        
        // If no trams are visible, create one that departed a few minutes ago (for testing)
        if (this.trams.length === 0) {
            console.log('No trams visible, creating one that departed 2 minutes ago');
            // Create a tram that departed 2 minutes ago to ensure it's not stuck at Am Steinberg
            const testDeparture = new Date(now);
            testDeparture.setMinutes(now.getMinutes() - 2, 0, 0);
            this.createTram(testDeparture.getTime());
        }
        
        console.log(`Total trams created: ${this.trams.length}`);
        
        // Set up regular departures for future trams
        setInterval(() => {
            const currentTime = Date.now();
            const timeUntilNext = this.nextDepartureTime - currentTime;
            
            // Create tram 5 seconds before departure time so it can be positioned correctly
            if (timeUntilNext <= 5000 && timeUntilNext > 0) {
                // Check if we haven't already created this tram
                const tramExists = this.trams.some(tram => 
                    Math.abs(tram.departureTime - this.nextDepartureTime) < 1000
                );
                
                if (!tramExists) {
                    console.log('Creating tram 5 seconds before departure.');
                    this.createTram(this.nextDepartureTime);
                }
            }
            
            // Calculate next departure time
            this.calculateNextDepartureTime();
        }, 1000); // Check every second for new departures
    }
}

// Start the simulation when page loads
window.addEventListener('load', () => {
    new MetroSimulation();
});

// Handle window resize
window.addEventListener('resize', () => {
    location.reload(); // Simple solution for demo
});


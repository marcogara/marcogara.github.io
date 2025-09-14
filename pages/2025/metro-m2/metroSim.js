 
class MetroSimulation {
    constructor() {
        this.stations_a = METRO_STATIONS_A;
        this.stations_b = METRO_STATIONS_B;
        this.tramsA = [];
        this.tramsB = [];
        this.metroLineA = document.getElementById('metroLineA');
        this.metroLineB = document.getElementById('metroLineB');
        this.timerElement = document.getElementById('timer');
        this.stationToGoElement = document.getElementById('stationToGo');
        
        this.departureInterval = SIMULATION_CONFIG.departureInterval;
        this.journeyDuration = SIMULATION_CONFIG.journeyDuration;
        
        this.rendererA = new MetroRenderer(this.metroLineA, this.stations_a, this.calculateTramPositionA.bind(this));
        this.rendererB = new MetroRendererB(this.metroLineB, this.stations_b, this.calculateTramPositionB.bind(this));
        
        this.calculateNextDepartureTimeA();
        this.calculateNextDepartureTimeB();
        
        this.init();
    }

    calculateNextDepartureTimeA() {
        const now = new Date();
        const amSteinbergTimetable = STATION_CONFIG["Am Steinberg"].timetable;
        
        let nextDeparture = null;
        
        for (const minute of amSteinbergTimetable) {
            const departureTime = new Date(now);
            departureTime.setMinutes(minute, 0, 0);
            
            if (departureTime.getTime() > now.getTime()) {
                nextDeparture = departureTime;
                break;
            }
        }
        
        if (!nextDeparture) {
            nextDeparture = new Date(now);
            nextDeparture.setHours(now.getHours() + 1, amSteinbergTimetable[0], 0, 0);
        }
        
        this.nextDepartureTimeA = nextDeparture.getTime();
    }

    calculateNextDepartureTimeB() {
        const now = new Date();
        const heinersdorfTimetable = STATION_CONFIG["Heinersdorf"].timetable;
        
        let nextDeparture = null;
        
        for (const minute of heinersdorfTimetable) {
            const departureTime = new Date(now);
            departureTime.setMinutes(minute, 0, 0);
            
            if (departureTime.getTime() > now.getTime()) {
                nextDeparture = departureTime;
                break;
            }
        }
        
        if (!nextDeparture) {
            nextDeparture = new Date(now);
            nextDeparture.setHours(now.getHours() + 1, heinersdorfTimetable[0], 0, 0);
        }
        
        this.nextDepartureTimeB = nextDeparture.getTime();
    }

    calculateTramPositionA(departureTime, currentTime) {
        const elapsedMinutes = (currentTime - departureTime) / (60 * 1000);
        const stationIntervals = Object.entries(STATION_INTERVALS_A)
            .map(([name, time]) => ({ name, time }))
            .sort((a, b) => a.time - b.time);

        if (elapsedMinutes < 0) {
            return { currentStation: 'Am Steinberg', stationProgress: 0 };
        }

        const totalJourneyTime = stationIntervals[stationIntervals.length - 1].time;
        if (elapsedMinutes >= totalJourneyTime) {
            return { currentStation: stationIntervals[stationIntervals.length - 1].name, stationProgress: 0 };
        }

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

    calculateTramPositionB(departureTime, currentTime) {
        const elapsedMinutes = (currentTime - departureTime) / (60 * 1000);
        const stationIntervals = Object.entries(STATION_INTERVALS_B)
            .map(([name, time]) => ({ name, time }))
            .sort((a, b) => a.time - b.time);

        if (elapsedMinutes < 0) {
            return { currentStation: 'Heinersdorf', stationProgress: 0 };
        }

        const totalJourneyTime = stationIntervals[stationIntervals.length - 1].time;
        if (elapsedMinutes >= totalJourneyTime) {
            return { currentStation: stationIntervals[stationIntervals.length - 1].name, stationProgress: 0 };
        }

        let currentStation = 'Heinersdorf';
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

    getTramVisualPositionA(departureTime, currentTime) {
        const { currentStation, stationProgress } = this.calculateTramPositionA(departureTime, currentTime);
        
        const lineHeight = this.metroLineA.offsetHeight;
        
        const stationPositions = {};
        this.stations_a.forEach((station, index) => {
            stationPositions[station] = index;
        });
        
        const currentStationIndex = stationPositions[currentStation];
        
        if (currentStationIndex === undefined) {
            return lineHeight - 40;
        }
        
        const currentStationPos = (currentStationIndex / (this.stations_a.length - 1)) * (lineHeight - 40);
        const nextStationIndex = Math.min(currentStationIndex + 1, this.stations_a.length - 1);
        const nextStationPos = (nextStationIndex / (this.stations_a.length - 1)) * (lineHeight - 40);
        
        const finalPosition = currentStationPos + (stationProgress * (nextStationPos - currentStationPos));
        
        return finalPosition;
    }

    getTramVisualPositionB(departureTime, currentTime) {
        const { currentStation, stationProgress } = this.calculateTramPositionB(departureTime, currentTime);
        
        const lineHeight = this.metroLineB.offsetHeight;
        
        const stationPositions = {};
        this.stations_b.forEach((station, index) => {
            stationPositions[station] = index;
        });
        
        const currentStationIndex = stationPositions[currentStation];
        
        if (currentStationIndex === undefined) {
            return lineHeight - 40;
        }
        
        const currentStationPos = (currentStationIndex / (this.stations_b.length - 1)) * (lineHeight - 40);
        const nextStationIndex = Math.min(currentStationIndex + 1, this.stations_b.length - 1);
        const nextStationPos = (nextStationIndex / (this.stations_b.length - 1)) * (lineHeight - 40);
        
        const finalPosition = currentStationPos + (stationProgress * (nextStationPos - currentStationPos));
        
        return finalPosition;
    }

    init() {
        this.rendererA.createStations();
        this.rendererB.createStations();
        this.startSimulation();
        this.updateTimer();
    }

    createTramA(departureTime) {
        const tramData = this.rendererA.createTram(departureTime);
        this.tramsA.push(tramData);
        this.rendererA.animateTram(tramData, this.tramsA, this.getTramVisualPositionA.bind(this));
    }

    createTramB(departureTime) {
        const tramData = this.rendererB.createTram(departureTime);
        this.tramsB.push(tramData);
        this.rendererB.animateTram(tramData, this.tramsB, this.getTramVisualPositionB.bind(this));
    }

    updateTimer() {
        const updateDisplay = () => {
            const currentTime = Date.now();
            const timeUntilNextA = this.nextDepartureTimeA - currentTime;
            const timeUntilNextB = this.nextDepartureTimeB - currentTime;

            if (timeUntilNextA <= 0) {
                this.createTramA(this.nextDepartureTimeA);
                this.calculateNextDepartureTimeA();
            }

            if (timeUntilNextB <= 0) {
                this.createTramB(this.nextDepartureTimeB);
                this.calculateNextDepartureTimeB();
            }

            const nextDeparture = Math.min(this.nextDepartureTimeA, this.nextDepartureTimeB);
            const timeUntilNextAdjusted = nextDeparture - Date.now();
            const minutes = Math.floor(timeUntilNextAdjusted / 60000);
            const seconds = Math.floor((timeUntilNextAdjusted % 60000) / 1000);

            this.timerElement.textContent = `Next departure in: ${minutes}:${seconds.toString().padStart(2, '0')}`;

            setTimeout(updateDisplay, 1000);
        };

        updateDisplay();
    }

    startSimulation() {
        const currentTime = Date.now();
        const now = new Date();

        // Line A
        const amSteinbergTimetable = STATION_CONFIG["Am Steinberg"].timetable;
        const recentDeparturesA = [];

        for (let hourOffset = 0; hourOffset <= 1; hourOffset++) {
            const checkHour = now.getHours() - hourOffset;
            const checkDate = new Date(now);
            checkDate.setHours(checkHour, 0, 0, 0);

            for (const minute of amSteinbergTimetable) {
                const departureTime = new Date(checkDate);
                departureTime.setMinutes(minute, 0, 0);

                const elapsedMinutes = (currentTime - departureTime.getTime()) / (60 * 1000);

                if (elapsedMinutes >= 0.5 && elapsedMinutes <= 14) {
                    recentDeparturesA.push({
                        time: departureTime.getTime(),
                        elapsed: elapsedMinutes
                    });
                }
            }
        }

        recentDeparturesA.sort((a, b) => b.time - a.time);

        for (let i = 0; i < Math.min(recentDeparturesA.length, 4); i++) {
            const departure = recentDeparturesA[i];
            this.createTramA(departure.time);
        }

        // Line B
        const heinersdorfTimetable = STATION_CONFIG["Heinersdorf"].timetable;
        const recentDeparturesB = [];

        for (let hourOffset = 0; hourOffset <= 1; hourOffset++) {
            const checkHour = now.getHours() - hourOffset;
            const checkDate = new Date(now);
            checkDate.setHours(checkHour, 0, 0, 0);

            for (const minute of heinersdorfTimetable) {
                const departureTime = new Date(checkDate);
                departureTime.setMinutes(minute, 0, 0);

                const elapsedMinutes = (currentTime - departureTime.getTime()) / (60 * 1000);

                if (elapsedMinutes >= 0.5 && elapsedMinutes <= 5) { // 5 minutes journey for line B
                    recentDeparturesB.push({
                        time: departureTime.getTime(),
                        elapsed: elapsedMinutes
                    });
                }
            }
        }

        recentDeparturesB.sort((a, b) => b.time - a.time);

        for (let i = 0; i < Math.min(recentDeparturesB.length, 4); i++) {
            const departure = recentDeparturesB[i];
            this.createTramB(departure.time);
        }
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

 
class MetroSimulation {
    constructor() {
        this.stations = [
            'Alexanderplatz', 'Alex/Mem', 'Mollstr.', 'PAllee/Metzer Str.', 'Knaackstr.',
            'Marienburger Str.', 'PAllee/Danziger', 'FroebelStr.', 'S P Allee', 'Enrich-Weinert.Str.', 'Prenzlauer Allee/Ostseestr.', 'Prenzlauer Prom./Am Steinberg', 'Am Steinberg'
        ];
        this.trams = [];
        this.metroLine = document.getElementById('metroLine');
        this.timerElement = document.getElementById('timer');
        this.stationToGoElement = document.getElementById('stationToGo');
        
        this.departureInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
        this.journeyDuration = 10 * 60 * 1000; // 30 minutes in milliseconds
        this.nextDepartureTime = Date.now() + this.departureInterval;
        
        this.init();
    }

    init() {
        this.createStations();
        this.startSimulation();
        this.updateTimer();
    }

    createStations() {
        const lineWidth = this.metroLine.offsetWidth;
        
        this.stations.forEach((stationName, index) => {
            const station = document.createElement('div');
            station.className = 'station';
            station.style.left = `${(index / (this.stations.length - 1)) * (lineWidth - 20)}px`;
            
            const label = document.createElement('div');
            label.className = 'station-label';
            label.textContent = stationName;
            station.appendChild(label);
            
            this.metroLine.appendChild(station);
        });
    }

    createTram() {
        const tram = document.createElement('div');
        tram.className = 'tram';
        tram.style.left = '0px';
        this.metroLine.appendChild(tram);
        
        const tramData = {
            element: tram,
            startTime: Date.now(),
            endTime: Date.now() + this.journeyDuration
        };
        
        this.trams.push(tramData);
        this.animateTram(tramData);
    }

    animateTram(tramData) {
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - tramData.startTime;
            const progress = Math.min(elapsed / this.journeyDuration, 1);
            
            const lineWidth = this.metroLine.offsetWidth;
            const startPosition = lineWidth - 40; // Start from right
            const endPosition = 0; // End at left
            const tramPosition = startPosition - (progress * (lineWidth - 40)); // Move left
            
            tramData.element.style.left = `${tramPosition}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Remove tram when journey is complete
                tramData.element.remove();
                const index = this.trams.indexOf(tramData);
                if (index > -1) {
                    this.trams.splice(index, 1);
                }
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateTimer() {
        const updateDisplay = () => {
            const currentTime = Date.now();
            const timeUntilNext = this.nextDepartureTime - currentTime;
            
            if (timeUntilNext <= 0) {
                // Time for departure
                this.createTram();
                this.nextDepartureTime = currentTime + this.departureInterval;
            }
            
            const timeUntilNextAdjusted = this.nextDepartureTime - Date.now();
            const minutes = Math.floor(timeUntilNextAdjusted / 60000);
            const seconds = Math.floor((timeUntilNextAdjusted % 60000) / 1000);
            
            this.timerElement.textContent = `Next departure in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            setTimeout(updateDisplay, 100);
        };
        
        updateDisplay();
    }

    startSimulation() {
        // Create initial tram
        this.createTram();
        
        // Set up regular departures
        setInterval(() => {
            this.createTram();
        }, this.departureInterval);
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


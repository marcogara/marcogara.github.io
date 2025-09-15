
class MetroRenderer {
    constructor(metroLine, stations_a, calculateTramPosition) {
        this.metroLine = metroLine;
        this.stations_a = stations_a;
        this.calculateTramPosition = calculateTramPosition;
        this.journeyDuration = SIMULATION_CONFIG.journeyDuration;
    }

    createStations() {
        const lineHeight = this.metroLine.offsetHeight;

        this.stations_a.forEach((stationName, index) => {
            const station = document.createElement('div');
            station.className = 'station';
            station.style.top = `${(index / (this.stations_a.length - 1)) * (lineHeight - 20)}px`;
            
            const label = document.createElement('div');
            label.className = 'station-label';
            label.textContent = stationName;
            station.appendChild(label);
            
            this.metroLine.appendChild(station);
        });
    }

    createTram(departureTime) {
        const tram = document.createElement('div');
        tram.className = 'tram';
        this.metroLine.appendChild(tram);
        
        return {
            element: tram,
            departureTime: departureTime
        };
    }

    animateTram(tramData, trams) {
        const animate = () => {
            const currentTime = Date.now();
            const elapsedMinutes = (currentTime - tramData.departureTime) / (60 * 1000);
            
            if (elapsedMinutes > this.journeyDuration) {
                tramData.element.remove();
                const index = trams.indexOf(tramData);
                if (index > -1) {
                    trams.splice(index, 1);
                }
                return;
            }
            
            if (elapsedMinutes < 0) {
                tramData.element.style.display = 'none';
            } else {
                tramData.element.style.display = 'block';
                const tramPosition = this.getTramVisualPosition(tramData.departureTime, currentTime);
                tramData.element.style.top = `${tramPosition}px`;
                
                if (trams.indexOf(tramData) === 0) {
                    // console.log(`Tram elapsed: ${elapsedMinutes.toFixed(2)}min, position: ${tramPosition}px`);
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }

    getTramVisualPosition(departureTime, currentTime) {
        const { currentStation, stationProgress } = this.calculateTramPosition(departureTime, currentTime);
        
        const lineHeight = this.metroLine.offsetHeight;
        
        const stationPositions = {
            'Am Steinberg': 0, // First station (top)
            'Prenzlauer Prom./Am Steinberg': 1,
            'Prenzlauer Allee/Ostseestr.': 2,
            'Enrich-Weinert.Str.': 3,
            'S P Allee': 4,
            'FroebelStr.': 5,
            'PAllee/Danziger': 6,
            'Marienburger Str.': 7,
            'Knaackstr.': 8,
            'PAllee/Metzer Str.': 9,
            'Mollstr.': 10,
            'Alex/Mem': 11,
            'Alexanderplatz': 12 // Last station (bottom)
        };
        
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
}

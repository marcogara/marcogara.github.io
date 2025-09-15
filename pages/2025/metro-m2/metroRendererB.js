
class MetroRendererB {
    constructor(metroLine, stations, calculateTramPosition) {
        this.metroLine = metroLine;
        this.stations = stations;
        this.calculateTramPosition = calculateTramPosition;
    }

    createStations() {
        const lineHeight = this.metroLine.offsetHeight;

        this.stations.forEach((stationName, index) => {
            const station = document.createElement('div');
            station.className = 'station';
            station.style.top = `${(index / (this.stations.length - 1)) * (lineHeight - 20)}px`;
            
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

    animateTram(tramData, trams, getTramVisualPosition) {
        const animate = () => {
            const currentTime = Date.now();
            const elapsedMinutes = (currentTime - tramData.departureTime) / (60 * 1000);
            
            if (elapsedMinutes > 7) {
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
                const tramPosition = getTramVisualPosition(tramData.departureTime, currentTime);
                tramData.element.style.top = `${tramPosition}px`;
                
                if (trams.indexOf(tramData) === 0) {
                    console.log(`Tram elapsed: ${elapsedMinutes.toFixed(2)}min, position: ${tramPosition}px`);
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

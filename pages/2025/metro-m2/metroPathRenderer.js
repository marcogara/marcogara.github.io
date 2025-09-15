class MetroPathRenderer {
    constructor(stations) {
        this.metroPath = document.getElementById('metro-path');
        this.stations = stations;
    }

    createStations() {
        const path = this.metroPath.querySelector('path');
        const pathLength = path.getTotalLength();
        const legLength = this.calculateLegLength(path, 0, 1); // First leg

        this.stations.forEach((stationName, index) => {
            const station = document.createElement('div');
            station.className = 'station-b';
            
            const distance = (index / (this.stations.length - 1)) * legLength;
            const point = path.getPointAtLength(distance);
            
            station.style.left = `${point.x}px`;
            station.style.top = `${point.y}px`;
            
            const label = document.createElement('div');
            label.className = 'station-b-label';
            label.textContent = stationName;
            label.style.left = `${point.x + 15}px`;
            label.style.top = `${point.y}px`;
            
            this.metroPath.appendChild(station);
            this.metroPath.appendChild(label);
        });
    }

    calculateLegLength(path, start, end) {
        const pathData = path.getAttribute('d').split(' ');
        const x1 = parseFloat(pathData[start + 1]);
        const y1 = parseFloat(pathData[start + 2]);
        const x2 = parseFloat(pathData[end + 1]);
        const y2 = parseFloat(pathData[end + 2]);
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}

// Initialize and use the new renderer
document.addEventListener('DOMContentLoaded', () => {
    const metroLineBStations = metroStations.lineB;
    const metroPathRenderer = new MetroPathRenderer(metroLineBStations);
    metroPathRenderer.createStations();
});

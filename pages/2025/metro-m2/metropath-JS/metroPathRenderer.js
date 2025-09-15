document.addEventListener('DOMContentLoaded', () => {
    const metroPathDiv = document.getElementById('metro-path');
    if (!metroPathDiv) {
        console.error('Error: #metro-path div not found.');
        return;
    }

    const svgElement = metroPathDiv.querySelector('svg');
    if (!svgElement) {
        console.error('Error: SVG element not found inside #metro-path.');
        return;
    }

    const svgPath = svgElement.querySelector('path');
    if (!svgPath) {
        console.error('Error: SVG path element not found inside SVG.');
        return;
    }

    // Define the start and end points of the first leg from the SVG path data
    // M 550 50 L 300 200
    const firstLegStart = { x: 550, y: 50 };
    const firstLegEnd = { x: 300, y: 200 };

    // Calculate the length of the first leg using Euclidean distance
    const firstLegLength = Math.sqrt(
        Math.pow(firstLegEnd.x - firstLegStart.x, 2) +
        Math.pow(firstLegEnd.y - firstLegStart.y, 2)
    );

    const stations = window.METRO_STATIONS_B;

    if (!stations || stations.length === 0) {
        console.error('Error: METRO_STATIONS_B not found or empty.');
        return;
    }

    // Get the actual rendered dimensions of the SVG
    const svgElementRect = svgElement.getBoundingClientRect();
    const metroPathDivRect = metroPathDiv.getBoundingClientRect();

    const numberOfStations = stations.length;
    const spacing = numberOfStations > 1 ? firstLegLength / (numberOfStations - 1) : 0;

    // Get the CTM for transforming SVG coordinates to screen coordinates
    const ctm = svgElement.getScreenCTM();

    stations.forEach((stationName, index) => {
        const station = document.createElement('div');
        station.className = 'station-on-path';
        station.title = stationName;

        const positionAlongFirstLeg = index * spacing;

        const point = svgPath.getPointAtLength(positionAlongFirstLeg);

        // Transform the SVG point to screen coordinates
        const svgPoint = svgElement.createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;
        const screenPoint = svgPoint.matrixTransform(ctm);

        // Calculate the position relative to metroPathDiv
        const finalX = screenPoint.x - metroPathDivRect.left;
        const finalY = screenPoint.y - metroPathDivRect.top;

        station.style.left = `${finalX}px`;
        station.style.top = `${finalY}px`;

        const label = document.createElement('span');
        label.className = 'station-label-on-path';
        label.textContent = stationName;
        station.appendChild(label);

        metroPathDiv.appendChild(station);
    });
});
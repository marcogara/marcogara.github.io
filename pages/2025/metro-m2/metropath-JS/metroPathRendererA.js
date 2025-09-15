document.addEventListener('DOMContentLoaded', () => {
    console.log('metroPathRendererA.js loaded.');

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

    const metroPathDivRect = metroPathDiv.getBoundingClientRect();
    const svgElementRect = svgElement.getBoundingClientRect();
    const ctm = svgElement.getScreenCTM();

    const allStationsA = window.METRO_STATIONS_A;

    // --- First Leg Stations (METRO_STATIONS_B) - Already handled by metroPathRenderer.js ---

    // --- Second Leg Stations (Subgroup of METRO_STATIONS_A) ---
    // Define the start and end points of the second leg from the SVG path data
    // L 300 200 L 300 510
    const secondLegStart = { x: 300, y: 200 };
    const secondLegEnd = { x: 300, y: 510 };

    // Calculate the length of the second leg using Euclidean distance
    const secondLegLength = Math.sqrt(
        Math.pow(secondLegEnd.x - secondLegStart.x, 2) +
        Math.pow(secondLegEnd.y - secondLegStart.y, 2)
    );

    // Filter for the specified subgroup of stations for the second leg
    const subgroupStationsA_secondLeg = [
        'Am Steinberg',
        'Prenzlauer Prom./Am Steinberg',
        'Prenzlauer Allee/Ostseestr.',
        'Enrich-Weinert.Str.',
        'S P Allee',
        'FroebelStr.'
    ];

    const stationsToRender_secondLeg = allStationsA.filter(station => subgroupStationsA_secondLeg.includes(station));

    if (stationsToRender_secondLeg.length > 0) {
        // Calculate the length of the first leg to get the offset for the second leg
        const firstLegLengthForOffset = Math.sqrt(
            Math.pow(550 - 300, 2) +
            Math.pow(50 - 200, 2)
        );

        const numberOfStations_secondLeg = stationsToRender_secondLeg.length;
        const spacing_secondLeg = numberOfStations_secondLeg > 1 ? secondLegLength / (numberOfStations_secondLeg - 1) : 0;

        stationsToRender_secondLeg.forEach((stationName, index) => {
            const station = document.createElement('div');
            station.className = 'station-on-path';
            station.title = stationName;

            const positionAlongOverallPath = firstLegLengthForOffset + (index * spacing_secondLeg);

            const point = svgPath.getPointAtLength(positionAlongOverallPath);

            const svgPoint = svgElement.createSVGPoint();
            svgPoint.x = point.x;
            svgPoint.y = point.y;
            const screenPoint = svgPoint.matrixTransform(ctm);

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
    }

    // --- Third Leg Stations (Subgroup of METRO_STATIONS_A) ---
    // Define the start and end points of the third leg from the SVG path data
    // L 300 510 L 20 900
    const thirdLegStart = { x: 300, y: 510 };
    const thirdLegEnd = { x: 20, y: 900 };

    // Calculate the length of the third leg using Euclidean distance
    const thirdLegLength = Math.sqrt(
        Math.pow(thirdLegEnd.x - thirdLegStart.x, 2) +
        Math.pow(thirdLegEnd.y - thirdLegStart.y, 2)
    );

    // Filter for the specified subgroup of stations for the third leg
    const subgroupStationsA_thirdLeg = [
        'PAllee/Danziger',
        'Marienburger Str.',
        'Knaackstr.',
        'PAllee/Metzer Str.',
        'Mollstr.',
        'Alex/Mem'
    ];

    const stationsToRender_thirdLeg = allStationsA.filter(station => subgroupStationsA_thirdLeg.includes(station));

    if (stationsToRender_thirdLeg.length > 0) {
        // Calculate the length of the first and second legs to get the offset for the third leg
        const firstLegLengthForOffset = Math.sqrt(
            Math.pow(550 - 300, 2) +
            Math.pow(50 - 200, 2)
        );
        const secondLegLengthForOffset = Math.sqrt(
            Math.pow(300 - 300, 2) +
            Math.pow(200 - 510, 2)
        );
        const offsetToThirdLeg = firstLegLengthForOffset + secondLegLengthForOffset;

        const numberOfStations_thirdLeg = stationsToRender_thirdLeg.length;
        const spacing_thirdLeg = numberOfStations_thirdLeg > 1 ? thirdLegLength / (numberOfStations_thirdLeg - 1) : 0;

        stationsToRender_thirdLeg.forEach((stationName, index) => {
            const station = document.createElement('div');
            station.className = 'station-on-path';
            station.title = stationName;

            const positionAlongOverallPath = offsetToThirdLeg + (index * spacing_thirdLeg);

            const point = svgPath.getPointAtLength(positionAlongOverallPath);

            const svgPoint = svgElement.createSVGPoint();
            svgPoint.x = point.x;
            svgPoint.y = point.y;
            const screenPoint = svgPoint.matrixTransform(ctm);

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
    }

    // --- Fourth Leg (Last Leg) Station: Alexanderplatz ---
    // Define the start and end points of the fourth leg from the SVG path data
    // L 20 900 L 130 1000
    const fourthLegStart = { x: 20, y: 900 };
    const fourthLegEnd = { x: 130, y: 1000 };

    // Calculate the length of the fourth leg using Euclidean distance
    const fourthLegLength = Math.sqrt(
        Math.pow(fourthLegEnd.x - fourthLegStart.x, 2) +
        Math.pow(fourthLegEnd.y - fourthLegStart.y, 2)
    );

    const alexanderplatzStationName = 'Alexanderplatz';
    if (allStationsA.includes(alexanderplatzStationName)) {
        // Calculate the offset to the start of the fourth leg
        const firstLegLengthForOffset = Math.sqrt(
            Math.pow(550 - 300, 2) +
            Math.pow(50 - 200, 2)
        );
        const secondLegLengthForOffset = Math.sqrt(
            Math.pow(300 - 300, 2) +
            Math.pow(200 - 510, 2)
        );
        const thirdLegLengthForOffset = Math.sqrt(
            Math.pow(300 - 20, 2) +
            Math.pow(510 - 900, 2)
        );
        const offsetToFourthLeg = firstLegLengthForOffset + secondLegLengthForOffset + thirdLegLengthForOffset;

        // Position Alexanderplatz at the very end of the fourth leg
        const positionAlongOverallPath = offsetToFourthLeg + fourthLegLength; // End of the fourth leg

        const point = svgPath.getPointAtLength(positionAlongOverallPath);

        const station = document.createElement('div');
        station.className = 'station-on-path';
        station.title = alexanderplatzStationName;

        const svgPoint = svgElement.createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;
        const screenPoint = svgPoint.matrixTransform(ctm);

        const finalX = screenPoint.x - metroPathDivRect.left;
        const finalY = screenPoint.y - metroPathDivRect.top;

        station.style.left = `${finalX}px`;
        station.style.top = `${finalY}px`;

        const label = document.createElement('span');
        label.className = 'station-label-on-path';
        label.textContent = alexanderplatzStationName;
        station.appendChild(label);

        metroPathDiv.appendChild(station);
    }
});
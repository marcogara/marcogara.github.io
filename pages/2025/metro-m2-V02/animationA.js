
// =======================================
// ANIMATION LOGIC A
// =======================================

let dotColorA = 'rgba(29, 176, 69, 0.8)';
let dotSizeA = 8;

function createPulsingDotA() {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', dotSizeA);
    dot.setAttribute('fill', dotColorA);
    dot.setAttribute('stroke', '#fff');
    dot.setAttribute('stroke-width', '2');
    dot.style.filter = 'url(#glow)';
    
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animate.setAttribute('attributeName', 'r');
    animate.setAttribute('values', `${dotSizeA}; ${dotSizeA * 1.5}; ${dotSizeA}`)
    animate.setAttribute('dur', '1s');
    animate.setAttribute('repeatCount', 'indefinite');
    
    dot.appendChild(animate);
    return dot;
}

function startMetroAnimationA() {
    const svg = document.getElementById('network-canvas');
    const mainGroup = document.getElementById('main-group');
    const dot = createPulsingDotA();
    mainGroup.appendChild(dot);

    let startTime = Date.now();
    const startStationIndex = stationPositions.findIndex(station => station.name === "Am Steinberg");

    function animate() {
        if (stationPositions.length < 2) return;

        const elapsedTime = Date.now() - startTime;

        let accumulatedTime = 0;
        let currentSegmentIndex = startStationIndex;
        let timeInSegment = 0;

        for (let i = startStationIndex; i < stationPositions.length; i++) {
            const segmentTime = animationConfigA.segmentTimes[i - startStationIndex] * 60000;
            if (elapsedTime < accumulatedTime + segmentTime) {
                currentSegmentIndex = i;
                timeInSegment = elapsedTime - accumulatedTime;
                break;
            }
            accumulatedTime += segmentTime;
        }

        const startStation = stationPositions[currentSegmentIndex];
        const endStation = stationPositions[currentSegmentIndex + 1];

        if (!startStation || !endStation) {
            dot.remove();
            return;
        }

        const segmentTime = animationConfigA.segmentTimes[currentSegmentIndex - startStationIndex] * 60000;
        const segmentProgress = timeInSegment / segmentTime;

        const dx = endStation.x - startStation.x;
        const dy = endStation.y - startStation.y;

        const currentX = startStation.x + dx * segmentProgress;
        const currentY = startStation.y + dy * segmentProgress;

        dot.setAttribute('cx', currentX);
        dot.setAttribute('cy', currentY);

        requestAnimationFrame(animate);
    }

    animate();
}

function calculateCirclePositionA() {
    const now = new Date();
    const currentMinute = now.getMinutes();
    const currentHour = now.getHours();

    let lastDepartureHour = -1;
    let lastDepartureMinute = -1;

    for (let i = animationConfigA.AmTimetable.timetable.length - 1; i >= 0; i--) {
        const departureMinute = animationConfigA.AmTimetable.timetable[i];
        if (currentMinute >= departureMinute) {
            lastDepartureHour = currentHour;
            lastDepartureMinute = departureMinute;
            break;
        }
    }

    if (lastDepartureMinute === -1) {
        lastDepartureHour = currentHour - 1;
        lastDepartureMinute = animationConfigA.AmTimetable.timetable[animationConfigA.AmTimetable.timetable.length - 1];
    }

    const lastDepartureTime = new Date();
    lastDepartureTime.setHours(lastDepartureHour);
    lastDepartureTime.setMinutes(lastDepartureMinute);
    lastDepartureTime.setSeconds(0);
    lastDepartureTime.setMilliseconds(0);

    const elapsedTime = now.getTime() - lastDepartureTime.getTime();
    const startStationIndex = stationPositions.findIndex(station => station.name === "Am Steinberg");

    let accumulatedTime = 0;
    let currentSegmentIndex = startStationIndex;
    let timeInSegment = 0;

    for (let i = startStationIndex; i < stationPositions.length; i++) {
        const segmentTime = animationConfigA.segmentTimes[i - startStationIndex] * 60000;
        if (elapsedTime < accumulatedTime + segmentTime) {
            currentSegmentIndex = i;
            timeInSegment = elapsedTime - accumulatedTime;
            break;
        }
        accumulatedTime += segmentTime;
    }

    const startStation = stationPositions[currentSegmentIndex];
    const endStation = stationPositions[currentSegmentIndex + 1];

    if (!startStation || !endStation) {
        return;
    }

    const segmentTime = animationConfigA.segmentTimes[currentSegmentIndex - startStationIndex] * 60000;
    const segmentProgress = timeInSegment / segmentTime;

    const dx = endStation.x - startStation.x;
    const dy = endStation.y - startStation.y;

    const currentX = startStation.x + dx * segmentProgress;
    const currentY = startStation.y + dy * segmentProgress;

    const dot = createPulsingDotA();
    const mainGroup = document.getElementById('main-group');
    mainGroup.appendChild(dot);
    dot.setAttribute('cx', currentX);
    dot.setAttribute('cy', currentY);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        calculateCirclePositionA();

        let lastStartedMinute = -1;

        function checkTimetableA() {
            const now = new Date();
            const currentMinute = now.getMinutes();

            if (animationConfigA.AmTimetable.timetable.includes(currentMinute)) {
                if (lastStartedMinute !== currentMinute) {
                    startMetroAnimationA();
                    lastStartedMinute = currentMinute;
                }
            }
        }

        setInterval(checkTimetableA, 1000);
    }, 1000);
});

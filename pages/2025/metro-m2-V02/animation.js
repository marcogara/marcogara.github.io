// =======================================
// ANIMATION LOGIC
// =======================================

let dotColor = 'rgba(255, 255, 255, 0.8)';
let dotSize = 8;

function createPulsingDot() {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', dotSize);
    dot.setAttribute('fill', dotColor);
    dot.setAttribute('stroke', '#fff');
    dot.setAttribute('stroke-width', '2');
    dot.style.filter = 'url(#glow)';
    
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animate.setAttribute('attributeName', 'r');
    animate.setAttribute('values', `${dotSize}; ${dotSize * 1.5}; ${dotSize}`)
    animate.setAttribute('dur', '1s');
    animate.setAttribute('repeatCount', 'indefinite');
    
    dot.appendChild(animate);
    return dot;
}

function startMetroAnimation() {
    const mainGroup = document.getElementById('main-group');
    const dotPool = [];
    const maxDots = 10; // Maximum number of dots to create

    // Pre-create a pool of dots
    for (let i = 0; i < maxDots; i++) {
        const dot = createPulsingDot();
        dot.style.display = 'none';
        mainGroup.appendChild(dot);
        dotPool.push(dot);
    }

    const totalLineDuration = animationConfig.segmentTimes.reduce((a, b) => a + b, 0) * 60000;

    function animate() {
        if (stationPositions.length < 2) {
            requestAnimationFrame(animate);
            return;
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        let activeDots = 0;

        const timetable = animationConfig.heinersdorfTimetable.timetable;

        // Iterate through all possible departure times for today
        for (const departureMinute of timetable) {
            const departureTime = new Date();
            departureTime.setHours(currentHour); // Assume current hour for comparison
            departureTime.setMinutes(departureMinute);
            departureTime.setSeconds(0);
            departureTime.setMilliseconds(0);

            // Adjust for departures that happen "tomorrow" relative to a late-night session
            if (currentHour < 3 && departureTime.getHours() > 20) {
                 // this is a departure from yesterday, so we can ignore it
            } else {
                // Find all departures in the current hour
                if (departureTime.getMinutes() <= currentMinute) {
                    const elapsedTime = now.getTime() - departureTime.getTime();

                    if (elapsedTime >= 0 && elapsedTime < totalLineDuration) {
                        if (activeDots < maxDots) {
                            const dot = dotPool[activeDots];
                            updateDotPosition(dot, elapsedTime);
                            activeDots++;
                        }
                    }
                }
            }
        }
        
        // Hide unused dots
        for (let i = activeDots; i < maxDots; i++) {
            dotPool[i].style.display = 'none';
        }

        requestAnimationFrame(animate);
    }

    function updateDotPosition(dot, elapsedTime) {
        const startStationIndex = stationPositions.findIndex(station => station.name === "Heinersdorf");
        let accumulatedTime = 0;
        let currentSegmentIndex = -1;
        let timeInSegment = 0;

        for (let i = 0; i < animationConfig.segmentTimes.length; i++) {
            const segmentTime = animationConfig.segmentTimes[i] * 60000;
            if (elapsedTime < accumulatedTime + segmentTime) {
                currentSegmentIndex = startStationIndex + i;
                timeInSegment = elapsedTime - accumulatedTime;
                break;
            }
            accumulatedTime += segmentTime;
        }

        if (currentSegmentIndex !== -1 && currentSegmentIndex < stationPositions.length - 1) {
            const startStation = stationPositions[currentSegmentIndex];
            const endStation = stationPositions[currentSegmentIndex + 1];

            if (startStation && endStation) {
                const segmentTime = animationConfig.segmentTimes[currentSegmentIndex - startStationIndex] * 60000;
                const segmentProgress = timeInSegment / segmentTime;

                const dx = endStation.x - startStation.x;
                const dy = endStation.y - startStation.y;

                const currentX = startStation.x + dx * segmentProgress;
                const currentY = startStation.y + dy * segmentProgress;

                dot.setAttribute('cx', currentX);
                dot.setAttribute('cy', currentY);
                dot.style.display = 'block';
            } else {
                dot.style.display = 'none';
            }
        } else {
            dot.style.display = 'none';
        }
    }

    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        startMetroAnimation();
    }, 1000);
});
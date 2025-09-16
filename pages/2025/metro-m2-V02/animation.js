
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
    const svg = document.getElementById('network-canvas');
    const mainGroup = document.getElementById('main-group');
    const dot = createPulsingDot();
    mainGroup.appendChild(dot);

    let startTime = Date.now();

    function animate() {
        if (stationPositions.length < 2) return;

        const elapsedTime = Date.now() - startTime;

        let accumulatedTime = 0;
        let currentSegmentIndex = 0;
        let timeInSegment = 0;

        for (let i = 0; i < animationConfig.segmentTimes.length; i++) {
            const segmentTime = animationConfig.segmentTimes[i] * 60000;
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
            // Loop back to the beginning
            dot.setAttribute('cx', stationPositions[0].x);
            dot.setAttribute('cy', stationPositions[0].y);
            startTime = Date.now();
            requestAnimationFrame(animate);
            return;
        }

        const segmentTime = animationConfig.segmentTimes[currentSegmentIndex] * 60000;
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

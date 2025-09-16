// ========================================
// CORE VISUALIZATION CODE
// ========================================

let segmentPoints = [];
let stationPositions = [];
let currentZoom = 1;
let currentTranslate = {x: 0, y: 0};
let isDragging = false;
let dragStart = {x: 0, y: 0};
let labelsVisible = true;
let segmentColorsVisible = false;

const svg = document.getElementById('network-canvas');
const mainGroup = document.getElementById('main-group');

// Segment colors for visualization
const segmentColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

function initializeNetwork() {
    calculateSegmentPoints();
    calculateStationPositions();
    drawTramLine();
    drawStations();
    drawLabels();
    setupEventListeners();
    updateLineInfo();
}

function calculateSegmentPoints() {
    segmentPoints = [];
    let currentX = lineConfig.startX;
    let currentY = lineConfig.startY;
    
    segmentPoints.push({ x: currentX, y: currentY });
    
    lineConfig.segments.forEach((segment, index) => {
        const radians = (segment.direction * Math.PI) / 180;
        const dirX = Math.cos(radians);
        const dirY = Math.sin(radians);
        
        currentX += dirX * segment.length;
        currentY += dirY * segment.length;
        
        segmentPoints.push({ 
            x: currentX, 
            y: currentY,
            segmentIndex: index
        });
    });
}

function calculateStationPositions() {
    stationPositions = [];
    
    lineConfig.segments.forEach((segment, segmentIndex) => {
        const startPoint = segmentPoints[segmentIndex];
        const endPoint = segmentPoints[segmentIndex + 1];
        
        const radians = (segment.direction * Math.PI) / 180;
        const dirX = Math.cos(radians);
        const dirY = Math.sin(radians);
        
        segment.stations.forEach(station => {
            const distance = segment.length * station.position;
            const x = startPoint.x + dirX * distance;
            const y = startPoint.y + dirY * distance;
            
            stationPositions.push({
                name: station.name,
                x: x,
                y: y,
                segmentIndex: segmentIndex,
                positionInSegment: station.position,
                segmentDirection: segment.direction
            });
        });
    });
}

function drawTramLine() {
    const lineGroup = document.getElementById('tram-line');
    lineGroup.innerHTML = ''; // Clear existing
    
    // Draw each segment
    for (let i = 0; i < segmentPoints.length - 1; i++) {
        const start = segmentPoints[i];
        const end = segmentPoints[i + 1];
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${start.x} ${start.y} L ${end.x} ${end.y}`);
        
        const color = segmentColorsVisible ? segmentColors[i % segmentColors.length] : lineConfig.color;
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '6');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('filter', 'url(#glow)');
        path.setAttribute('opacity', '0.8');
        path.classList.add('line-segment');
        path.setAttribute('data-segment', i);
        
        lineGroup.appendChild(path);
    }
}

function drawStations() {
    const stationsGroup = document.getElementById('stations');
    stationsGroup.innerHTML = ''; // Clear existing
    
    stationPositions.forEach((station, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', station.x);
        circle.setAttribute('cy', station.y);
        
        // Terminal stations (at position 0 or 1) are larger
        const isTerminal = station.positionInSegment === 0 || station.positionInSegment === 1;
        circle.setAttribute('r', isTerminal ? '10' : '7');
        circle.setAttribute('fill', isTerminal ? '#fff' : '#ffdddd');
        circle.setAttribute('stroke', lineConfig.color);
        circle.setAttribute('stroke-width', '3');
        circle.setAttribute('filter', 'url(#glow)');
        circle.classList.add('station');
        circle.setAttribute('data-station', station.name);
        circle.setAttribute('data-segment', station.segmentIndex);
        circle.setAttribute('data-position', station.positionInSegment);
        
        stationsGroup.appendChild(circle);
    });
}

function drawLabels() {
    const labelsGroup = document.getElementById('labels');
    labelsGroup.innerHTML = ''; // Clear existing
    
    stationPositions.forEach((station, index) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        
        // Offset labels perpendicular to segment direction
        const radians = (station.segmentDirection * Math.PI) / 180;
        const perpX = -Math.sin(radians) * 25;
        const perpY = Math.cos(radians) * 25;
        
        text.setAttribute('x', station.x + perpX);
        text.setAttribute('y', station.y + perpY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', '500');
        text.textContent = station.name;
        text.classList.add('station-label');
        
        labelsGroup.appendChild(text);
    });
}

function updateLineInfo() {
    document.getElementById('segment-count').textContent = lineConfig.segments.length;
    document.getElementById('station-count').textContent = stationPositions.length;
    
    const segmentList = document.getElementById('segment-list');
    segmentList.innerHTML = '';
    
    lineConfig.segments.forEach((segment, index) => {
        const div = document.createElement('div');
        div.className = 'segment-info';
        div.innerHTML = `
            Segment ${index + 1}: ${segment.direction}°, ${segment.length}px<br>
            Stations: ${segment.stations.length}
        `;
        segmentList.appendChild(div);
    });

}

function setupEventListeners() {
    // Mouse wheel zoom
    svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoom(delta, e.clientX, e.clientY);
    });

    // Mouse drag
    svg.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStart = {x: e.clientX, y: e.clientY};
        svg.style.cursor = 'grabbing';
    });

    svg.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            currentTranslate.x += dx;
            currentTranslate.y += dy;
            updateTransform();
            dragStart = {x: e.clientX, y: e.clientY};
        }
    });

    svg.addEventListener('mouseup', () => {
        isDragging = false;
        svg.style.cursor = 'grab';
    });

    // Station hover
    svg.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('station')) {
            const stationName = e.target.getAttribute('data-station');
            const segmentIndex = parseInt(e.target.getAttribute('data-segment'));
            const position = parseFloat(e.target.getAttribute('data-position'));
            showStationInfo(stationName, segmentIndex, position);
        }
    });

    svg.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('station')) {
            hideStationInfo();
        }
    });
}

function zoom(factor, centerX = null, centerY = null) {
    const newZoom = Math.max(0.1, Math.min(5, currentZoom * factor));
    
    if (centerX !== null && centerY !== null) {
        const rect = svg.getBoundingClientRect();
        const svgX = centerX - rect.left;
        const svgY = centerY - rect.top;
        
        currentTranslate.x = svgX - (svgX - currentTranslate.x) * (newZoom / currentZoom);
        currentTranslate.y = svgY - (svgY - currentTranslate.y) * (newZoom / currentZoom);
    }
    
    currentZoom = newZoom;
    updateTransform();
    updateUI();
}

function updateTransform() {
    mainGroup.setAttribute('transform', 
        `translate(${currentTranslate.x}, ${currentTranslate.y}) scale(${currentZoom})`);
}

function updateUI() {
    document.getElementById('zoom-level').textContent = Math.round(currentZoom * 100) + '%';
    
    // Adjust label visibility based on zoom
    const labels = document.querySelectorAll('.station-label');
    labels.forEach(label => {
        label.style.opacity = currentZoom > 0.5 ? '1' : '0.3';
    });
}

function showStationInfo(stationName, segmentIndex, position) {
    const info = document.getElementById('station-info');
    const segment = lineConfig.segments[segmentIndex];
    const stationsInSegment = segment.stations.length;
    const positionIndex = segment.stations.findIndex(s => s.name === stationName) + 1;
    
    info.innerHTML = `
        <strong>${stationName}</strong><br>
        <span>Segment: ${segmentIndex + 1}, Position: ${positionIndex}/${stationsInSegment}</span><br>
        <span>Direction: ${segment.direction}°</span><br>
        <span style="color: ${lineConfig.color};">${lineConfig.name}</span>
    `;
    info.style.display = 'block';
}

function hideStationInfo() {
    document.getElementById('station-info').style.display = 'none';
}

// Initialize the network when page loads
document.addEventListener('DOMContentLoaded', initializeNetwork);


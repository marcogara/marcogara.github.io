// ========================================
// CORE VISUALIZATION CODE
// ========================================

let segmentPoints = {};
let stationPositions = {};
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
    for (const lineKey in lineConfigs) {
        const lineConfig = lineConfigs[lineKey];
        createLine(lineConfig);
    }
    setupEventListeners();
    updateLineInfo();
}

function createLine(lineConfig) {
    calculateSegmentPoints(lineConfig);
    calculateStationPositions(lineConfig);
    drawTramLine(lineConfig);
    drawStations(lineConfig);
    drawLabels(lineConfig);
}

function calculateSegmentPoints(lineConfig) {
    segmentPoints[lineConfig.name] = [];
    let currentX = lineConfig.startX;
    let currentY = lineConfig.startY;
    
    segmentPoints[lineConfig.name].push({ x: currentX, y: currentY });
    
    lineConfig.segments.forEach((segment, index) => {
        const radians = (segment.direction * Math.PI) / 180;
        const dirX = Math.cos(radians);
        const dirY = Math.sin(radians);
        
        currentX += dirX * segment.length;
        currentY += dirY * segment.length;
        
        segmentPoints[lineConfig.name].push({ 
            x: currentX, 
            y: currentY,
            segmentIndex: index
        });
    });
}

function calculateStationPositions(lineConfig) {
    stationPositions[lineConfig.name] = [];
    
    lineConfig.segments.forEach((segment, segmentIndex) => {
        const startPoint = segmentPoints[lineConfig.name][segmentIndex];
        const endPoint = segmentPoints[lineConfig.name][segmentIndex + 1];
        
        const radians = (segment.direction * Math.PI) / 180;
        const dirX = Math.cos(radians);
        const dirY = Math.sin(radians);
        
        segment.stations.forEach(station => {
            const distance = segment.length * station.position;
            const x = startPoint.x + dirX * distance;
            const y = startPoint.y + dirY * distance;
            
            stationPositions[lineConfig.name].push({
                name: station.name,
                x: x,
                y: y,
                segmentIndex: segmentIndex,
                positionInSegment: station.position,
                segmentDirection: segment.direction,
                lineName: lineConfig.name
            });
        });
    });
}

function drawTramLine(lineConfig) {
    const lineGroup = document.getElementById('tram-line');
    
    for (let i = 0; i < segmentPoints[lineConfig.name].length - 1; i++) {
        const start = segmentPoints[lineConfig.name][i];
        const end = segmentPoints[lineConfig.name][i + 1];
        
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
        path.setAttribute('data-line', lineConfig.name);
        
        lineGroup.appendChild(path);
    }
}

function drawStations(lineConfig) {
    const stationsGroup = document.getElementById('stations');
    
    stationPositions[lineConfig.name].forEach((station, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', station.x);
        circle.setAttribute('cy', station.y);
        
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
        circle.setAttribute('data-line', lineConfig.name);
        
        stationsGroup.appendChild(circle);
    });
}

function drawLabels(lineConfig) {
    const labelsGroup = document.getElementById('labels');
    
    stationPositions[lineConfig.name].forEach((station, index) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        
        let offsetX = 0;
        let offsetY = 0;

        if (lineConfig.labelDirection === 'right') {
            offsetX = 15;
            text.setAttribute('text-anchor', 'start');
        } else if (lineConfig.labelDirection === 'top') {
            offsetY = -25;
            text.setAttribute('text-anchor', 'middle');
        }
        
        text.setAttribute('x', station.x + offsetX);
        text.setAttribute('y', station.y + offsetY);
        text.textContent = station.name;
        text.classList.add('station-label');
        text.setAttribute('data-station', station.name);
        text.setAttribute('data-line', lineConfig.name);
        
        labelsGroup.appendChild(text);
    });
}

function updateLineInfo() {
    const segmentList = document.getElementById('segment-list');
    segmentList.innerHTML = '';
    let totalSegments = 0;
    let totalStations = 0;

    for (const lineKey in lineConfigs) {
        const lineConfig = lineConfigs[lineKey];
        totalSegments += lineConfig.segments.length;
        if(stationPositions[lineConfig.name]) {
            totalStations += stationPositions[lineConfig.name].length;
        }

        const lineDiv = document.createElement('div');
        lineDiv.innerHTML = `<h3><input type="checkbox" checked data-line="${lineConfig.name}"> ${lineConfig.name}</h3>`;
        segmentList.appendChild(lineDiv);

        const segmentsDiv = document.createElement('div');
        segmentsDiv.id = `segments-${lineConfig.name}`;
        segmentList.appendChild(segmentsDiv);

        lineConfig.segments.forEach((segment, index) => {
            const div = document.createElement('div');
            div.className = 'segment-info';
            div.innerHTML = `
                Segment ${index + 1}: ${segment.direction}°, ${segment.length}px<br>
                Stations: ${segment.stations.length}
            `;
            segmentsDiv.appendChild(div);
        });
    }

    document.getElementById('segment-count').textContent = totalSegments;
    document.getElementById('station-count').textContent = totalStations;

    const checkboxes = document.querySelectorAll('#segment-list input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const lineName = e.target.getAttribute('data-line');
            const segmentsDiv = document.getElementById(`segments-${lineName}`);
            segmentsDiv.style.display = e.target.checked ? 'block' : 'none';
        });
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
            const lineName = e.target.getAttribute('data-line');
            showStationInfo(lineName, stationName, segmentIndex, position);
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

function showStationInfo(lineName, stationName, segmentIndex, position) {
    const info = document.getElementById('station-info');
    const lineConfig = lineConfigs[lineName];
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

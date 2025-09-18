function zoomIn() {
    zoom(1.2);
}

function zoomOut() {
    zoom(0.8);
}

function resetView() {
    currentZoom = 1;
    currentTranslate = { x: 0, y: 0 };
    updateTransform();
    updateUI();
}

let stationDotsVisible = true;

function toggleLabels() {
    labelsVisible = !labelsVisible;
    const labels = document.querySelectorAll('.station-label');
    labels.forEach(label => {
        label.style.display = labelsVisible ? 'block' : 'none';
    });
}

function showSegmentColors() {
    segmentColorsVisible = !segmentColorsVisible;
    drawTramLine();
}

function toggleStationDots() {
    stationDotsVisible = !stationDotsVisible;
    const stationsGroup = document.getElementById('stations');
    stationsGroup.style.display = stationDotsVisible ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const timeElement = document.getElementById('current-time');
    function updateTime() {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
    setInterval(updateTime, 1000);
    updateTime();
});
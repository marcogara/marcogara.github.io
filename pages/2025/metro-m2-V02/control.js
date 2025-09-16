        let animationInterval;

        // Control functions
        function zoomIn() {
            zoom(1.2);
        }

        function zoomOut() {
            zoom(0.8);
        }

        function resetView() {
            currentZoom = 1;
            currentTranslate = {x: 0, y: 0};
            updateTransform();
            updateUI();
        }

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

        function removeDot() {
            const dot = document.querySelector('#main-group > circle');
            if (dot) {
                dot.remove();
            }
        }

        function restartAnimation() {
            removeDot();
            startMetroAnimation();
        }

        function stopAnimation() {
            clearInterval(animationInterval);
            removeDot();
        }

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main visualization to draw
    setTimeout(() => {
        animationInterval = setInterval(startMetroAnimation, animationConfig.departureInterval * 60000);
        startMetroAnimation();
    }, 500);

    const timeElement = document.getElementById('current-time');
    function updateTime() {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
    setInterval(updateTime, 1000);
    updateTime();
});
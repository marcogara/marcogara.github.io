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
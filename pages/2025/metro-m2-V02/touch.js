function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function setupTouchEventListeners() {
    const svg = document.getElementById('network-canvas');
    let isDragging = false;
    let dragStart = {x: 0, y: 0};
    let lastTouchDistance = null;

    svg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            dragStart = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        } else if (e.touches.length === 2) {
            lastTouchDistance = getTouchDistance(e.touches);
        }
    });

    svg.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - dragStart.x;
            const dy = e.touches[0].clientY - dragStart.y;
            currentTranslate.x += dx;
            currentTranslate.y += dy;
            updateTransform();
            dragStart = {x: e.touches[0].clientX, y: e.touches[0].clientY};
        } else if (e.touches.length === 2) {
            const newTouchDistance = getTouchDistance(e.touches);
            const delta = newTouchDistance / lastTouchDistance;
            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            zoom(delta, centerX, centerY);
            lastTouchDistance = newTouchDistance;
        }
    });

    svg.addEventListener('touchend', (e) => {
        isDragging = false;
        lastTouchDistance = null;
    });
}
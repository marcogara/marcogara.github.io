import { state, dom, on } from './main.js';

// Silo level logic
const siloY = 80;
const siloHeight = 200;
function getFillColor(level) {
    if (level < 30) return "#ff7675";
    if (level < 60) return "#ffe066";
    return "#51cf66";
}
function updateSiloLevel() {
    let level = parseInt(dom.levelInput.value, 10);
    if (isNaN(level) || level < 0) level = 0;
    if (level > 100) level = 100;
    const fillHeight = siloHeight * (level / 100);
    const fillY = siloY + siloHeight - fillHeight;
    dom.siloLevelFill.setAttribute('y', fillY);
    dom.siloLevelFill.setAttribute('height', fillHeight);
    dom.siloLevelFill.setAttribute('fill', getFillColor(level));
    dom.siloLevelText.textContent = level + "%";
    dom.siloLevelText.setAttribute('y', fillY + fillHeight / 2);
}
dom.levelInput.addEventListener('input', updateSiloLevel);
updateSiloLevel();

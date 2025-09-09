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

// Tooltip logic for pipe and bag labels
function showTooltip(evt, desc) {
    dom.tooltip.textContent = desc;
    dom.tooltip.style.opacity = 1;
    dom.tooltip.style.left = (evt.clientX + 10) + 'px';
    dom.tooltip.style.top = (evt.clientY - 10) + 'px';
}
function hideTooltip() {
    dom.tooltip.style.opacity = 0;
}
document.querySelectorAll('.pipe-label, .bag-label').forEach(label => {
    label.addEventListener('mouseenter', function(evt) {
        showTooltip(evt, this.getAttribute('data-desc'));
    });
    label.addEventListener('mousemove', function(evt) {
        showTooltip(evt, this.getAttribute('data-desc'));
    });
    label.addEventListener('mouseleave', hideTooltip);
});

// Flow display logic
function setFlowValues(active) {
    if (active) {
        dom.flowValueTR_002.textContent = "2.5 t/h";
        dom.flowValueOUT_005.textContent = "2.2 t/h";
    } else {
        dom.flowValueTR_002.textContent = "Flow";
        dom.flowValueOUT_005.textContent = "Flow";
    }
}

// Listen for start/stop events from main.js
on('start', () => {
    setFlowValues(true);

});
on('stop', () => {
    setFlowValues(false);

});

setFlowValues(false);

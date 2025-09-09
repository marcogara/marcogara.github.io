import { state, dom, on } from './main.js';

// Tooltip logic for pipe
function showTooltip(evt, desc) {
    dom.tooltip.textContent = desc;
    dom.tooltip.style.opacity = 1;
    dom.tooltip.style.left = (evt.clientX + 10) + 'px';
    dom.tooltip.style.top = (evt.clientY - 10) + 'px';
}
function hideTooltip() {
    dom.tooltip.style.opacity = 0;
}
document.querySelectorAll('.pipe-label').forEach(label => {
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
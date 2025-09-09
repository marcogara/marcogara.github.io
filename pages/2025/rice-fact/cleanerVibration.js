import { dom, on } from './main.js';

let vibrationInterval = null;
let vibrationActive = false;
let vibrationStep = 0;

function startCleanerVibration() {
    const cleaner = dom.cleanerRect;
    if (vibrationActive || !cleaner) return;
    vibrationActive = true;
    vibrationStep = 0;
    vibrationInterval = setInterval(() => {
        // Alternate between -3, 0, +3 pixels on y
        const offset = (vibrationStep % 3 === 0) ? 0 : (vibrationStep % 2 === 0 ? -3 : 3);
        cleaner.setAttribute('y', 140 + offset);
        vibrationStep++;
    }, 60);
}

function stopCleanerVibration() {
    const cleaner = dom.cleanerRect;
    if (!vibrationActive || !cleaner) return;
    clearInterval(vibrationInterval);
    cleaner.setAttribute('y', 140); // Reset to original position
    vibrationActive = false;
}

// Listen for the start/stop button and control vibration accordingly
window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    if (!startBtn) return;
    startBtn.addEventListener('click', () => {
        // Button text is "Stop" when running, "Start" when stopped
        if (startBtn.classList.contains('running')) {
            startCleanerVibration();
        } else {
            stopCleanerVibration();
        }
    });
});

on('start', startCleanerVibration);
on('stop', stopCleanerVibration);

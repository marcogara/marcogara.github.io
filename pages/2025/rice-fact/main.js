// Global state
export const state = {
    running: false,
    bag1Level: 0,
    bag2Level: 0
};

// DOM elements
export const dom = {
    startBtn: document.getElementById('startBtn'),
    flowValueTR_002: document.getElementById('flowValueTR-002'),
    flowValueOUT_005: document.getElementById('flowValueOUT-005'),
    bag1Fill: document.getElementById('bag1Fill'),
    bag2Fill: document.getElementById('bag2Fill'),
    bag1LevelText: document.getElementById('bag1-level'),
    bag2LevelText: document.getElementById('bag2-level'),
    changeBag1Btn: document.getElementById('changeBag1Btn'),
    changeBag2Btn: document.getElementById('changeBag2Btn'),
    alarmBag1: document.getElementById('alarmBag1'),
    alarmBag2: document.getElementById('alarmBag2'),
    cleanerRect: document.getElementById('cleanerRect'),
    tooltip: document.getElementById('tooltip'),
    levelInput: document.getElementById('levelInput'),
    siloLevelFill: document.getElementById('siloLevelFill'),
    siloLevelText: document.getElementById('siloLevelText')
};

// Simple event system
const listeners = { start: [], stop: [] };
export function on(event, fn) {
    if (listeners[event]) listeners[event].push(fn);
}
function emit(event) {
    if (listeners[event]) listeners[event].forEach(fn => fn());
}

// Start/Stop button logic
dom.startBtn.addEventListener('click', () => {
    state.running = !state.running;
    if (state.running) {
        dom.startBtn.textContent = "Stop";
        dom.startBtn.classList.add("running");
        emit('start');
    } else {
        dom.startBtn.textContent = "Start";
        dom.startBtn.classList.remove("running");
        emit('stop');
    }
});
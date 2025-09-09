import { state, dom, on } from './main.js';

let bag1Interval = null;
let bag2Interval = null;

function updateBagDisplay() {
    // Bag 1
    dom.bag1Fill.setAttribute('y', 400 - state.bag1Level);
    dom.bag1Fill.setAttribute('height', state.bag1Level);
    let percent1 = Math.round((state.bag1Level / 60) * 100);
    dom.bag1LevelText.textContent = percent1 + "%";
    // Bag 2
    dom.bag2Fill.setAttribute('y', 440 - state.bag2Level);
    dom.bag2Fill.setAttribute('height', state.bag2Level);
    let percent2 = Math.round((state.bag2Level / 60) * 100);
    dom.bag2LevelText.textContent = percent2 + "%";

    // Alarm logic
    if (percent1 >= 100) {
        dom.alarmBag1.textContent = "BAG-003";
        dom.alarmBag1.classList.add("active");
        dom.alarmBag1.title = "OVER!";
    } else if (percent1 >= 80) {
        dom.alarmBag1.textContent = "BAG-003";
        dom.alarmBag1.classList.add("active");
        dom.alarmBag1.title = "almost full";
    } else {
        dom.alarmBag1.textContent = "BAG-003";
        dom.alarmBag1.classList.remove("active");
        dom.alarmBag1.title = "";
    }
    if (percent2 >= 100) {
        dom.alarmBag2.textContent = "BAG-004";
        dom.alarmBag2.classList.add("active");
        dom.alarmBag2.title = "OVER!";
    } else if (percent2 >= 80) {
        dom.alarmBag2.textContent = "BAG-004";
        dom.alarmBag2.classList.add("active");
        dom.alarmBag2.title = "almost full";
    } else {
        dom.alarmBag2.textContent = "BAG-004";
        dom.alarmBag2.classList.remove("active");
        dom.alarmBag2.title = "";
    }

    // Enable/disable change buttons
    dom.changeBag1Btn.disabled = percent1 < 90;
    dom.changeBag1Btn.style.background = percent1 < 90 ? "#eee" : "#51cf66";
    dom.changeBag2Btn.disabled = percent2 < 90;
    dom.changeBag2Btn.style.background = percent2 < 90 ? "#eee" : "#51cf66";
}

function animateBagFill() {
    clearInterval(bag1Interval);
    clearInterval(bag2Interval);
    bag1Interval = setInterval(() => {
        if (!state.running) return;
        if (state.bag1Level < 60) {
            state.bag1Level += 0.3;
            updateBagDisplay();
        }
    }, 100);
    bag2Interval = setInterval(() => {
        if (!state.running) return;
        if (state.bag2Level < 60) {
            state.bag2Level += 0.1;
            updateBagDisplay();
        }
    }, 100);
}

function stopBagFill() {
    clearInterval(bag1Interval);
    clearInterval(bag2Interval);
}

dom.changeBag1Btn.addEventListener('click', function() {
    if (!this.disabled) {
        state.bag1Level = 0;
        updateBagDisplay();
    }
});
dom.changeBag2Btn.addEventListener('click', function() {
    if (!this.disabled) {
        state.bag2Level = 0;
        updateBagDisplay();
    }
});

// Tooltip logic for alarm boxes (custom tooltip)
function showAlarmTooltip(evt, text) {
    if (!text) return;
    dom.tooltip.textContent = text;
    dom.tooltip.style.opacity = 1;
    dom.tooltip.style.left = (evt.clientX + 10) + 'px';
    dom.tooltip.style.top = (evt.clientY - 10) + 'px';
}
function hideAlarmTooltip() {
    dom.tooltip.style.opacity = 0;
}
[dom.alarmBag1, dom.alarmBag2].forEach(alarm => {
    alarm.addEventListener('mouseenter', function(evt) {
        if (this.title) showAlarmTooltip(evt, this.title);
    });
    alarm.addEventListener('mousemove', function(evt) {
        if (this.title) showAlarmTooltip(evt, this.title);
    });
    alarm.addEventListener('mouseleave', hideAlarmTooltip);
});

// Listen for start/stop events from main.js
on('start', animateBagFill);
on('stop', stopBagFill);

// Initial display
updateBagDisplay();
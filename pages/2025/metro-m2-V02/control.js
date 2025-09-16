                function removeDot() {
            const dot = document.querySelector('#main-group > circle');
            if (dot) {
                dot.remove();
            }
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
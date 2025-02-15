// Audio manager
const audioManager = {
    audioElements: {},
    currentAudio: null,
    loadAudio: function(id, src) {
        this.audioElements[id] = new Audio(src);
    },
    playAudio: function(id) {
        return new Promise((resolve) => {
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            }
            this.currentAudio = this.audioElements[id];
            this.currentAudio.currentTime = 0;
            this.currentAudio.onended = resolve;
            this.currentAudio.play().catch(e => console.error("Audio play failed:", e));
        });
    },
    stopAudio: function() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }
};

// Speech recognition manager
const speechRecognitionManager = {
    recognition: null,
    init: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = "en-US";
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
        } else {
            console.error("Speech recognition is not supported in this browser.");
        }
    },
    start: function() {
        return new Promise((resolve, reject) => {
            if (!this.recognition) {
                reject("Speech recognition not initialized");
                return;
            }
            this.recognition.start();
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                resolve(transcript);
            };
            this.recognition.onerror = (event) => {
                reject(event.error);
            };
        });
    },
    stop: function() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
};

// Game manager
const gameManager = {
    async startGame() {
        canvasManager.drawText("Playing intro");
        await audioManager.playAudio('intro');
        canvasManager.drawText("Say Yes or No");
        try {
            const answer = await speechRecognitionManager.start();
            this.processAnswer(answer);
        } catch (error) {
            console.error("Speech recognition error:", error);
            canvasManager.drawText("Speech recognition error");
        }
    },
    processAnswer(answer) {
        if (answer.includes("yes")) {
            canvasManager.drawText("User said YES.......");
        } else if (answer.includes("no")) {
            canvasManager.drawText("User said NO");
        } else {
            canvasManager.drawText("Didn't recognize Yes or No");
        }
    },
    stopGame() {
        audioManager.stopAudio();
        speechRecognitionManager.stop();
        canvasManager.drawText("Game stopped");
    }
};

// Canvas manager
const canvasManager = {
    canvas: null,
    ctx: null,
    init: function() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 400;
        this.canvas.height = 400;
    },
    drawText: function(text) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "24px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    }
};

// Initialize the game
function init() {
    canvasManager.init();
    speechRecognitionManager.init();
    
    // Load audio files
    audioManager.loadAudio('intro', "audiogameAudio/intro.mp3");
    
    document.getElementById("playButton").addEventListener("click", () => gameManager.startGame());
    document.getElementById("stopButton").addEventListener("click", () => gameManager.stopGame());
}

// Call init when the DOM is loaded
document.addEventListener("DOMContentLoaded", init);

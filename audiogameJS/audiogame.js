// Game state
const gameState = {
    currentQuestion: 0,
    score: 0,
    isRunning: false
};

// Question structure
const questions = [
    {
        introAudio: "audiogameAudio/intro.mp3",
        yesResponse: {
            audio: 
 
                "audiogameAudio/question2.mp3",

            nextQuestion: 0 // For now, we'll loop back to the start
        },
        noResponse: {
            audio: "audiogameAudio/intro.mp3",
            nextQuestion: 0
        }
    },
    // Add more questions here in the future
];

// Audio manager
const audioManager = {
    audioElements: {},
    loadAudio: function(src) {
        if (!this.audioElements[src]) {
            this.audioElements[src] = new Audio(src);
        }
    },
    playAudio: function(src) {
        return new Promise((resolve) => {
            const audio = this.audioElements[src];
            audio.onended = resolve;
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Audio play failed:", e));
        });
    },
    stopAll: function() {
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
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

// Game flow manager
const gameManager = {
    async startGame() {
        gameState.isRunning = true;
        gameState.currentQuestion = 0;
        gameState.score = 0;
        canvasManager.drawText("Audiogame is playing");
        await audioManager.playAudio(questions[0].introAudio);
        await this.askQuestion();
    },
    async askQuestion() {
        try {
            const answer = await speechRecognitionManager.start();
            await this.processAnswer(answer);
        } catch (error) {
            console.error("Error in speech recognition:", error);
            canvasManager.drawText("Speech recognition error. Please try again.");
        }
    },
    async processAnswer(answer) {
        const question = questions[gameState.currentQuestion];
        if (answer.includes("yes")) {
            canvasManager.drawText("User said YES!");
            await audioManager.playAudio(question.yesResponse.audio);
            gameState.currentQuestion = question.yesResponse.nextQuestion;
        } else if (answer.includes("no")) {
            canvasManager.drawText("User said NO! Playing intro again...");
            await audioManager.playAudio(question.noResponse.audio);
            gameState.currentQuestion = question.noResponse.nextQuestion;
        } else {
            canvasManager.drawText("Didn't detect YES or NO.");
        }
        
        if (gameState.isRunning) {
            await this.askQuestion();
        }
    },
    stopGame() {
        gameState.isRunning = false;
        speechRecognitionManager.stop();
        audioManager.stopAll();
        canvasManager.drawText("Game stopped");
    }
};

// Initialize the game
function init() {
    speechRecognitionManager.init();
    canvasManager.init();
    
    // Load audio files
    audioManager.loadAudio(questions[0].introAudio);
    audioManager.loadAudio(questions[0].yesResponse.audio);
    audioManager.loadAudio(questions[0].noResponse.audio);
    
    document.getElementById("playButton").addEventListener("click", () => gameManager.startGame());
    document.getElementById("stopButton").addEventListener("click", () => gameManager.stopGame());
}

// Call init when the DOM is loaded
document.addEventListener("DOMContentLoaded", init);

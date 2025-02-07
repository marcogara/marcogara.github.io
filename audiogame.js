let gameRunning = false;
let introAudio, questionAudio;

document.getElementById("playButton").addEventListener("click", startGame);
document.getElementById("stopButton").addEventListener("click", stopGame);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
} else {
    console.error("Speech recognition is not supported in this browser.");
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        document.getElementById("playButton").disabled = true;
        document.getElementById("stopButton").disabled = false;

        if (!recognition) {
            console.error("Speech recognition is not supported in this browser.");
            document.getElementById("result").innerText = "Speech recognition is not supported in this browser.";
            return;
        }

        introAudio = new Audio("audiogameAudio/intro.mp3");
        questionAudio = new Audio("audiogameAudio/question1.mp3");

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 400;
        canvas.height = 400;

        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Audiogame is playing", canvas.width / 2, canvas.height / 2);

        introAudio.currentTime = 0;
        introAudio.play().catch(e => console.error("Audio play failed:", e));

        introAudio.onended = () => {
            console.log("Intro finished, starting voice recognition...");
            setTimeout(() => {
                recognition.start();
                setTimeout(() => {
                    recognition.stop();
                    console.log("Timeout: No response detected.");
                    document.getElementById("result").innerText = "Didn't detect a response.";
                }, 5000);
            }, 500);
        };
    }
}

if (recognition) {
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Recognized:", transcript);

        recognition.stop();

        if (transcript.includes("yes")) {
            console.log("User said YES!");
            playAudio(questionAudio);
        } else if (transcript.includes("no")) {
            console.log("User said NO! Playing intro again...");
            playAudio(introAudio);
        } else {
            console.log("Didn't detect YES or NO.");
        }
    };

    recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
    };
}

function playAudio(audio) {
    recognition.stop();
    audio.currentTime = 0;
    audio.play().catch(e => console.error("Audio play failed:", e));
}

function stopGame() {
    if (gameRunning) {
        gameRunning = false;
        document.getElementById("playButton").disabled = false;
        document.getElementById("stopButton").disabled = true;

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (introAudio) {
            introAudio.pause();
            introAudio.currentTime = 0;
        }
        if (questionAudio) {
            questionAudio.pause();
            questionAudio.currentTime = 0;
        }

        if (recognition) {
            recognition.stop();
        }
    }
}

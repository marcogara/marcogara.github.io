let gameRunning = false;
let introAudio = new Audio("audiogameAudio/intro.mp3"); // Load the intro audio
let questionAudio = new Audio("audiogameAudio/question1.mp3"); // Load the question audio

document.getElementById("playButton").addEventListener("click", startGame);
document.getElementById("stopButton").addEventListener("click", stopGame);

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    console.error("Speech recognition is not supported in this browser.");
} else {
    const recognition = new SpeechRecognition();
}

recognition.lang = "en-US"; // Set language
recognition.continuous = false; // Stop after one result
recognition.interimResults = false; // Only final results

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        document.getElementById("playButton").disabled = true;
        document.getElementById("stopButton").disabled = false;

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 400;
        canvas.height = 400;

        // Draw text
        ctx.fillStyle = "white"; // Text color
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Audiogame is playing", canvas.width / 2, canvas.height / 2);

        // Play intro audio
        introAudio.currentTime = 0; // Reset audio to start
        introAudio.play();
    }
}

// When the intro audio finishes, start listening
introAudio.onended = () => {
    console.log("Intro finished, starting voice recognition...");

    // Start listening after 5 seconds timeout
    setTimeout(() => {
        recognition.start();

        // Stop recognition after 5 seconds if no response
        setTimeout(() => {
            recognition.stop();
            console.log("Timeout: No response detected.");
            document.getElementById("result").innerText = "Didn't detect a response.";
        }, 5000);
    }, 500);
};

// When speech is recognized
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("Recognized:", transcript);

    // Stop recognition immediately
    recognition.stop();

    if (transcript.includes("yes")) {
        document.getElementById("result").innerText = "User said YES!";
        playAudio(questionAudio);
    } else if (transcript.includes("no")) {
        document.getElementById("result").innerText = "User said NO! Playing intro again...";
        playAudio(introAudio);
    } else {
        document.getElementById("result").innerText = "Didn't detect YES or NO.";
    }
};

// Handle errors
recognition.onerror = (event) => {
    console.log("Error occurred:", event.error);
};

// Function to play an audio file and stop recognition
function playAudio(audio) {
    recognition.stop(); // Ensure recognition is stopped before playing audio
    audio.currentTime = 0; // Reset audio
    audio.play();
}

// Stop game function
function stopGame() {
    if (gameRunning) {
        gameRunning = false;
        document.getElementById("playButton").disabled = false;
        document.getElementById("stopButton").disabled = true;

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Stop audio
        introAudio.pause();
        questionAudio.pause();
        introAudio.currentTime = 0; 
        questionAudio.currentTime = 0;
    }
}

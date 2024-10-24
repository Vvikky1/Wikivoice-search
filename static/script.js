const recorder = document.getElementById('recorder');
let recording = false;
let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        recording = true;
        recorder.classList.add('recording');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Heard:', transcript);
        sendQueryToBackend(transcript);
    };

    recognition.onerror = function(event) {
        console.error('Recognition error:', event.error);
    };

    recognition.onend = function() {
        recording = false;
        recorder.classList.remove('recording');
    };

    recorder.addEventListener('mousedown', startRecognition);
    recorder.addEventListener('mouseup', stopRecognition);
    recorder.addEventListener('touchstart', startRecognition);
    recorder.addEventListener('touchend', stopRecognition);
} else {
    console.error('Speech recognition not supported in this browser.');
}

function startRecognition() {
    if (recording) return;
    recognition.start();
}

function stopRecognition() {
    if (!recording) return;
    recognition.stop();
}

function sendQueryToBackend(query) {
    fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Search result:', data);

            // Optionally use speech synthesis in the browser to read the result
            const utterance = new SpeechSynthesisUtterance(data.result);
            window.speechSynthesis.speak(utterance);
        })
        .catch(err => console.error(err));
}
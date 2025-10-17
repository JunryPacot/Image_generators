const API_KEY = ""; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`;

const promptInput = document.getElementById('prompt-input');
const generateButton = document.getElementById('generate-button');
const generatedImage = document.getElementById('generated-image');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const initialMessage = document.getElementById('initial-message');

function setUIState(loading = false, error = false) {
    generateButton.disabled = loading;
    loadingIndicator.classList.toggle('hidden', !loading);
    errorMessage.classList.toggle('hidden', !error);
    generateButton.textContent = loading ? 'Generating...' : 'Generate Image';
    initialMessage.classList.toggle('hidden', loading || generatedImage.src.includes('placehold'));
}

function displayImage(base64Data) {
    const imageUrl = `data:image/png;base64,${base64Data}`;
    generatedImage.src = imageUrl;
    initialMessage.classList.add('hidden');
}

async function handleGenerate() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        console.error('Please enter a prompt to generate an image.');
        return;
    }

    setUIState(true, false);
    
    const payload = { 
        instances: { prompt: prompt }, 
        parameters: { "sampleCount": 1 } 
    };

    let response;
    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Status ${response.status}`);
        }
        
        const result = await response.json();

        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
            displayImage(result.predictions[0].bytesBase64Encoded);
            setUIState(false, false);
        } else {
            throw new Error('Invalid response structure from API.');
        }

    } catch (error) {
        console.error('Image Generation Error:', error);
        setUIState(false, true);
    }
}

generateButton.addEventListener('click', handleGenerate);

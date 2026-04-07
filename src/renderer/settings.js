let mediaRecorder;
let audioStream;

// Setup Translateration combinations dynamically
const transliterationPairs = [
    "Hinglish → English", "Tanglish → English", "Spanglish → English",
    "Franglais → English", "Denglish → English", "Chinglish → English",
    "Konglish → English", "Janglish → English", "Portuñol → English",
    "Arabizi → English", "Taglish → English", "Russlish → English",
    "Itangliano → English", "Greeklish → English", "Benglish → English",
    "Telunglish → English"
];

// Execute API Fetch for Usage Data
async function refreshUsageData() {
    const deepgramUsed = document.getElementById('deepgram-used-label');
    const deepgramRem = document.getElementById('deepgram-remaining-label');
    const grokUsed = document.getElementById('grok-used-label');
    const grokRem = document.getElementById('grok-remaining-label');
    
    deepgramUsed.innerText = 'Loading...';
    deepgramRem.innerText = 'Loading...';
    grokUsed.innerText = 'Loading...';
    grokRem.innerText = 'Loading...';
    
    try {
        const balances = await window.vocalflow.getUsage();
        if (balances) {
            deepgramUsed.innerText = `$${Number(balances.deepgram.used).toFixed(4)}`;
            deepgramRem.innerText = `$${Number(balances.deepgram.remaining).toFixed(4)}`;
            
            grokUsed.innerText = `$${Number(balances.grok.used).toFixed(4)}`;
            grokRem.innerText = `$${Number(balances.grok.remaining).toFixed(4)}`;
        }
    } catch (e) {
        console.error("Failed to fetch usage:", e);
        deepgramUsed.innerText = 'Error';
        deepgramRem.innerText = 'Error';
        grokUsed.innerText = 'Error';
        grokRem.innerText = 'Error';
    }
}

// Deepgram model fetcher
async function fetchDeepgramModelsList() {
    const key = document.getElementById('deepgram-key').value;
    if (!key) return;
    const select = document.getElementById('deepgram-model');
    const prevVal = select.value;
    select.innerHTML = '<option value="">Fetching...</option>';
    
    try {
        const models = await window.vocalflow.fetchDeepgramModels(key);
        select.innerHTML = '';
        if (models && models.length > 0) {
            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.innerText = m;
                select.appendChild(opt);
            });
            select.value = prevVal || models[0];
        } else {
            select.innerHTML = `<option value="nova-3">nova-3</option>`;
        }
    } catch (e) {
        select.innerHTML = `<option value="${prevVal || 'nova-3'}">${prevVal || 'nova-3'}</option>`;
    }
}

// Grok model fetcher
async function fetchGrokModelsList() {
    const key = document.getElementById('grok-key').value;
    if (!key) return;
    const select = document.getElementById('grok-model');
    const prevVal = select.value;
    select.innerHTML = '<option value="">Fetching...</option>';
    
    try {
        const models = await window.vocalflow.fetchGrokModels(key);
        select.innerHTML = '';
        if (models && models.length > 0) {
            models.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.innerText = m;
                select.appendChild(opt);
            });
            select.value = prevVal || models[0];
        } else {
            select.innerHTML = `<option value="grok-2">grok-2</option>`;
        }
    } catch (e) {
        select.innerHTML = `<option value="${prevVal || 'grok-2'}">${prevVal || 'grok-2'}</option>`;
    }
}

// Master Settings Save Routine
async function saveAllSettings() {
    const settings = {
        DEEPGRAM_API_KEY: document.getElementById('deepgram-key').value,
        DEEPGRAM_MODEL: document.getElementById('deepgram-model').value,
        DEEPGRAM_LANGUAGE: document.getElementById('deepgram-language').value,
        
        GROK_ENABLE: document.getElementById('grok-enable').checked,
        GROK_API_KEY: document.getElementById('grok-key').value,
        GROK_MODEL: document.getElementById('grok-model').value,
        GROK_SPELLING_CORRECTION: document.getElementById('grok-spelling').checked,
        GROK_GRAMMAR_CORRECTION: document.getElementById('grok-grammar').checked,
        GROK_TRANSLITERATION: document.getElementById('grok-transliteration').checked,
        GROK_TRANSLATION: document.getElementById('grok-translation').checked,
        GROK_TRANSLITERATION_PAIR: document.getElementById('grok-transliteration-pair').value,
        GROK_TRANSLATION_TARGET: document.getElementById('grok-translation-target').value,
        
        HOTKEY: document.getElementById('hotkey').value,
    };
    
    const success = await window.vocalflow.saveSettings(settings);
    if (success) {
        const btn = document.getElementById('save-all-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Saved!';
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--accent)';
        }, 2000);
    }
}

function handleUIInteractivity() {
    // Conditionals for UI elements
    const updateVisibility = () => {
        document.getElementById('transliteration-box').style.display = document.getElementById('grok-transliteration').checked ? 'block' : 'none';
        document.getElementById('translation-box').style.display = document.getElementById('grok-translation').checked ? 'block' : 'none';
        
        const isGrokEnabled = document.getElementById('grok-enable').checked;
        document.getElementById('grok-settings-container').style.opacity = isGrokEnabled ? '1' : '0.4';
        document.getElementById('grok-settings-container').style.pointerEvents = isGrokEnabled ? 'auto' : 'none';
    };

    ['grok-transliteration', 'grok-translation', 'grok-enable'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateVisibility);
    });

    return updateVisibility;
}

// Initial Boot Sequence
window.addEventListener('DOMContentLoaded', async () => {
    // Scaffold UI dynamics
    const pairSelect = document.getElementById('grok-transliteration-pair');
    transliterationPairs.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p; opt.innerText = p;
        pairSelect.appendChild(opt);
    });

    const triggerUIVisibility = handleUIInteractivity();

    // Map Interactivity
    document.getElementById('deepgram-refresh').addEventListener('click', refreshUsageData);
    document.getElementById('grok-refresh').addEventListener('click', refreshUsageData);
    document.getElementById('deepgram-fetch-models').addEventListener('click', fetchDeepgramModelsList);
    document.getElementById('grok-fetch-models').addEventListener('click', fetchGrokModelsList);
    document.getElementById('save-all-btn').addEventListener('click', saveAllSettings);
    
    // Explicit Save links
    document.getElementById('deepgram-save-key').addEventListener('click', saveAllSettings);
    document.getElementById('grok-save-key').addEventListener('click', saveAllSettings);

    document.getElementById('quit-btn').addEventListener('click', () => {
        window.close(); // Triggers app closure naturally through renderer window control
    });

    // Populate Settings Payload directly from FileSystem via IPC
    const settings = await window.vocalflow.getSettings();
    if (settings) {
        document.getElementById('deepgram-key').value = settings.DEEPGRAM_API_KEY || '';
        document.getElementById('deepgram-model').innerHTML = `<option value="${settings.DEEPGRAM_MODEL || 'nova-3'}">${settings.DEEPGRAM_MODEL || 'nova-3'}</option>`;
        document.getElementById('deepgram-language').value = settings.DEEPGRAM_LANGUAGE || 'en';
        
        document.getElementById('grok-enable').checked = settings.GROK_ENABLE || false;
        document.getElementById('grok-key').value = settings.GROK_API_KEY || '';
        document.getElementById('grok-model').innerHTML = `<option value="${settings.GROK_MODEL || 'grok-2'}">${settings.GROK_MODEL || 'grok-2'}</option>`;
        
        document.getElementById('grok-spelling').checked = settings.GROK_SPELLING_CORRECTION || false;
        document.getElementById('grok-grammar').checked = settings.GROK_GRAMMAR_CORRECTION || false;
        document.getElementById('grok-transliteration').checked = settings.GROK_TRANSLITERATION || false;
        document.getElementById('grok-translation').checked = settings.GROK_TRANSLATION || false;
        
        if (settings.GROK_TRANSLITERATION_PAIR) pairSelect.value = settings.GROK_TRANSLITERATION_PAIR;
        document.getElementById('grok-translation-target').value = settings.GROK_TRANSLATION_TARGET || '';
        
        document.getElementById('hotkey').value = settings.HOTKEY || 'RIGHT ALT';
        triggerUIVisibility();
    }

    // Auto-fetch Usage Metrics
    refreshUsageData();
});

// IPC Driven Media Control Hooks (From the Main Desktop Context)
window.vocalflow.onStartRecording(async () => {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(audioStream);
        
        mediaRecorder.ondataavailable = async (event) => {
            if (event.data && event.data.size > 0) {
                // Convert payload Blob -> ArrayBuffer strictly
                const buffer = await event.data.arrayBuffer();
                window.vocalflow.sendAudioChunk(buffer);
            }
        };

        // Standard latency for realtime transcription
        mediaRecorder.start(250); 
    } catch (err) {
        console.error("Microphone Capture Denied/Failed:", err);
    }
});

window.vocalflow.onStopRecording(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    // Shut off Microphone Hardware Signal entirely
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
    }
});

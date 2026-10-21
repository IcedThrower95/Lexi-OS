function getTranslatorHTML() {
    return `
        <div class="translate-wrapper">
            <div class="translate-controls">
                <select class="translate-lang" id="sourceLang">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                </select>
                <div class="translate-arrow">➔</div>
                <select class="translate-lang" id="targetLang">
                    <option value="hi">Hindi</option>
                    <option value="te">Telugu</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                </select>
            </div>
            
            <textarea class="translate-box translate-input" placeholder="Type text here..."></textarea>
            <button class="translate-btn" onclick="runTranslation(this)">Translate</button>
            <textarea class="translate-box translate-output" placeholder="Translation will appear here..." readonly></textarea>
        </div>
    `;
}
async function runTranslation(btn) {
    const wrapper = btn.closest('.translate-wrapper');
    const input = wrapper.querySelector('.translate-input').value.trim();
    const source = wrapper.querySelector('#sourceLang').value;
    const target = wrapper.querySelector('#targetLang').value;
    const outputBox = wrapper.querySelector('.translate-output');

    if (!input) return;

    btn.innerText = "Translating...";
    outputBox.value = "Fetching translation...";

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${source}|${target}`);
        const data = await response.json();
        outputBox.value = data.responseData.translatedText;
    } catch (error) {
        outputBox.value = "Error: Could not reach translation server.";
    } finally {
        btn.innerText = "Translate";
    }
}
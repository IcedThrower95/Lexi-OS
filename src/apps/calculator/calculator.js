// src/apps/calculator.js

function getCalculatorHTML() {
    return `
        <div class="calc-wrapper">
            <!-- Changed ID to Class -->
            <input type="text" class="calc-display" value="" readonly>
            <div class="calc-grid">
                <!-- Added 'this' to every onclick -->
                <button class="calc-btn calc-action" onclick="calcClear(this)">C</button>
                <button class="calc-btn calc-action" onclick="calcDelete(this)">⌫</button>
                <button class="calc-btn calc-action" onclick="calcClick(this, '%')">%</button>
                <button class="calc-btn calc-action" onclick="calcClick(this, '/')">/</button>
                
                <button class="calc-btn" onclick="calcClick(this, '7')">7</button>
                <button class="calc-btn" onclick="calcClick(this, '8')">8</button>
                <button class="calc-btn" onclick="calcClick(this, '9')">9</button>
                <button class="calc-btn calc-action" onclick="calcClick(this, '*')">×</button>
                
                <button class="calc-btn" onclick="calcClick(this, '4')">4</button>
                <button class="calc-btn" onclick="calcClick(this, '5')">5</button>
                <button class="calc-btn" onclick="calcClick(this, '6')">6</button>
                <button class="calc-btn calc-action" onclick="calcClick(this, '-')">-</button>
                
                <button class="calc-btn" onclick="calcClick(this, '1')">1</button>
                <button class="calc-btn" onclick="calcClick(this, '2')">2</button>
                <button class="calc-btn" onclick="calcClick(this, '3')">3</button>
                <button class="calc-btn calc-action" onclick="calcClick(this, '+')">+</button>
                
                <button class="calc-btn" onclick="calcClick(this, '00')">00</button>
                <button class="calc-btn" onclick="calcClick(this, '0')">0</button>
                <button class="calc-btn" onclick="calcClick(this, '.')">.</button>
                <button class="calc-btn calc-equal" onclick="calcEqual(this)">=</button>
            </div>
        </div>
    `;
}

// Logic Functions now isolate the specific window using 'btn'
function getDisplay(btn) {
    return btn.closest('.calc-wrapper').querySelector('.calc-display');
}

function calcClick(btn, value) {
    const display = getDisplay(btn);
    if (display && display.value !== "Error") {
        display.value += value;
    } else if (display) {
        display.value = value;
    }
}

function calcClear(btn) {
    const display = getDisplay(btn);
    if (display) display.value = "";
}

function calcDelete(btn) {
    const display = getDisplay(btn);
    if (display && display.value !== "Error") {
        display.value = display.value.slice(0, -1);
    }
}

function calcEqual(btn) {
    const display = getDisplay(btn);
    if (display) {
        try {
            display.value = eval(display.value);
        } catch {
            display.value = "Error";
        }
    }
}
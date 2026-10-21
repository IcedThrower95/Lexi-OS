function getCurrencyHTML() {
    return `
        <div class="currency-wrapper">
            <div class="currency-header-text">Live Exchange</div>
            
            <div class="currency-container">
                <div class="currency-row">
                    <input type="number" class="currency-input" id="currAmount" value="1" oninput="runCurrency(this)">
                    <select class="currency-select" id="currFrom" onchange="runCurrency(this)">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR" selected>INR (₹)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CNY">CNY (¥)</option>
                        <option value="AUD">AUD ($)</option>
                    </select>
                </div>
                
                <div class="currency-divider">⬇</div>
                
                <div class="currency-row">
                    <div class="currency-output" id="currResult">--</div>
                    <select class="currency-select" id="currTo" onchange="runCurrency(this)">
                        <option value="USD" selected>USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CNY">CNY (¥)</option>
                        <option value="AUD">AUD ($)</option>
                    </select>
                </div>
            </div>
            
            <div class="currency-rate-text" id="currRateDisplay">Enter an amount to calculate</div>
        </div>
    `;
}

async function runCurrency(element) {
    const wrapper = element.closest('.currency-wrapper');
    const amount = parseFloat(wrapper.querySelector('#currAmount').value);
    const from = wrapper.querySelector('#currFrom').value;
    const to = wrapper.querySelector('#currTo').value;
    const output = wrapper.querySelector('#currResult');
    const rateDisplay = wrapper.querySelector('#currRateDisplay');

    if (isNaN(amount)) {
        output.innerText = "0.00";
        return;
    }
    if (!wrapper.currencyCache || wrapper.currencyCache.base !== from) {
        rateDisplay.innerText = "Fetching live rates...";
        try {
            const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
            const data = await res.json();
            wrapper.currencyCache = { base: from, rates: data.rates };
        } catch (e) {
            rateDisplay.innerText = "Network Error";
            return;
        }
    }

    const rate = wrapper.currencyCache.rates[to];
    const converted = amount * rate;
    
    output.innerText = converted.toFixed(2);
    rateDisplay.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
}
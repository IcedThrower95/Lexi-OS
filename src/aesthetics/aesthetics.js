let currentViewDate = new Date();
let currentViewMonth = currentViewDate.getMonth();
let currentViewYear = currentViewDate.getFullYear();
let lastScrollTime = 0;


window.changeMonth = function(offset) {
    currentViewMonth += offset;
    if (currentViewMonth < 0) {
        currentViewMonth = 11;
        currentViewYear--;
    } else if (currentViewMonth > 11) {
        currentViewMonth = 0;
        currentViewYear++;
    }
    renderCalendar();
};

window.handleCalendarScroll = function(e) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastScrollTime < 150) return;
    lastScrollTime = now;
    
    if (e.deltaY > 0) {
        window.changeMonth(1);
    } else {
        window.changeMonth(-1);
    }
};

function injectAesthetics() {
    const aestheticsHTML = `
    <div class="top-bar">
        <div class="top-bar-left">
            <span class="top-bar-logo">Lexi OS</span>
        </div>
        <div class="top-bar-right">
            <span class="top-bar-icon">🔋</span>
            <span class="top-bar-icon">📶</span>
            <span class="top-bar-icon">🔊</span>
            <span id="top-bar-date">--</span>
            <span id="top-bar-time" style="font-weight: bold;">--:--</span>
        </div>
    </div>
    <div class="desktop-widgets">
        <div class="os-widget">
            <div class="analog-clock">
                <div class="hand hour-hand" id="hour-hand"></div>
                <div class="hand minute-hand" id="min-hand"></div>
                <div class="hand second-hand" id="sec-hand"></div>
                <div class="clock-center"></div>
            </div>
            <div class="digital-clock" id="widget-digital-time"></div>
        </div>
        <div class="os-widget" id="calendar-widget-container" onwheel="handleCalendarScroll(event)">
            <div class="calendar-header">
                <span class="cal-nav" onclick="window.changeMonth(-1)">‹</span>
                <span id="calendar-month-year">--</span>
                <span class="cal-nav" onclick="window.changeMonth(1)">›</span>
            </div>
            <div class="calendar-days-header">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div class="calendar-grid" id="calendar-grid"></div>
        </div>
    </div>`;
    
    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.insertAdjacentHTML('afterbegin', aestheticsHTML);
        setInterval(updateSystemTime, 1000);
        updateSystemTime();
        renderCalendar();
    }
}

function updateSystemTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const pad = (num) => num < 10 ? '0' + num : num;
    
    const timeString = `${displayHours}:${pad(minutes)} ${ampm}`;
    const fullTimeString = `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    const topTime = document.getElementById('top-bar-time');
    const topDate = document.getElementById('top-bar-date');
    const dockTime = document.getElementById('dock-time');
    const widgetTime = document.getElementById('widget-digital-time');
    
    if(topTime) topTime.innerText = timeString;
    if(topDate) topDate.innerText = dateString;
    if(dockTime) dockTime.innerText = timeString;
    if(widgetTime) { widgetTime.innerHTML = 
        `<span class="digital-time-hour">${pad(displayHours)}</span>:<span class="digital-time-minute">${pad(minutes)}</span>:<span class="digital-time-sec">${pad(seconds)}</span>&nbsp;<span class="digital-ampm">${ampm}</span>`;
    }
    
    const hrHand = document.getElementById('hour-hand');
    const minHand = document.getElementById('min-hand');
    const secHand = document.getElementById('sec-hand');
    
    if (hrHand && minHand && secHand) {
        const hrAngle = (hours % 12) * 30 + (minutes * 0.5);
        const minAngle = minutes * 6;
        const secAngle = seconds * 6;
        
        hrHand.style.transform = `translateX(-50%) rotate(${hrAngle}deg)`;
        minHand.style.transform = `translateX(-50%) rotate(${minAngle}deg)`;
        secHand.style.transform = `translateX(-50%) rotate(${secAngle}deg)`;
    }
}
function renderCalendar() {
    const now = new Date();
    const actualToday = now.getDate();
    const actualMonth = now.getMonth();
    const actualYear = now.getFullYear();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const headerEl = document.getElementById('calendar-month-year');
    const gridEl = document.getElementById('calendar-grid');
    
    if (!headerEl || !gridEl) return;
    
    headerEl.innerText = `${monthNames[currentViewMonth]} ${currentViewYear}`;
    gridEl.innerHTML = '';
    
    const firstDay = new Date(currentViewYear, currentViewMonth, 1).getDay();
    const daysInMonth = new Date(currentViewYear, currentViewMonth + 1, 0).getDate();
    
    let fragments = '';
    for (let i = 0; i < firstDay; i++) {
        fragments += `<div class="cal-day empty"></div>`;
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const Today = (day === actualToday && currentViewMonth === actualMonth && currentViewYear === actualYear) ? 'active' : '';
        fragments += `<div class="cal-day ${Today}">${day}</div>`;
    }
    gridEl.innerHTML = fragments;
}
document.addEventListener('DOMContentLoaded', injectAesthetics);

document.addEventListener("DOMContentLoaded", () => {
    const pct = document.getElementById("loaderPercent");
    const line = document.querySelector(".loader-line-inner");
    const ltr = document.querySelectorAll(".loader-title span");
    const loader = document.querySelector(".loader");

    if (!pct || !line || !loader) return;

    const lTl = gsap.timeline();

    lTl.to(ltr, { 
        y: "0%", 
        duration: 3.0, 
        stagger: 0.05, 
        ease: "power4.out" 
    })
    .to({}, { 
        duration: 5.0, 
        onUpdate: function() {
            const prg = Math.round(this.progress() * 100);
            pct.textContent = String(prg).padStart(2, "0") + "%";
            line.style.width = prg + "%";
        }
    })
    .to(loader, { 
        clipPath: "inset(0 0 100% 0)", 
        duration: 1.0, 
        ease: "power4.inOut", 
        onComplete: () => loader.remove() 
    });
});

function updateClock() {
    const clock = document.getElementById('dock-time')
    if (!clock) return;
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = String(minutes).padStart(2, '0');
    clock.textContent = `${hours}:${minutes} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);
setInterval(updateClock, 1000);
updateClock();

let highestZIndex = 10; 
let windowCount = 0;    

function updateDockState() {
    const openWindows = Array.from(document.querySelectorAll('.window')).map(win => {
        return win.querySelector('.window-header span').innerText.trim();
    });
    
    document.querySelectorAll('.app-container').forEach(container => {
        const action = container.querySelector('.dock-app').getAttribute('data-action');
        const titleMap = {
            'browser': 'Browser',
            'calculator': 'Calculator',
            'settings': 'Settings',
            'aboutme': 'About Me',
            'music': 'Music',
            'notes': 'Notes',
            'wallpapers': 'Wallpapers',
            'currencyconverter': 'Currency Converter',
            'translator': 'Translator'
        };
        
        if (openWindows.includes(titleMap[action])) {
            container.classList.add('open');
        } else {
            container.classList.remove('open');
        }
    });
}

function spawnWindow(appName, appContent, customWidth = '550px') {
    const alreadyOpen = Array.from(document.querySelectorAll('.window-header span')).find(span => span.innerText === appName);
    
    if (alreadyOpen) {
        let win = alreadyOpen.closest('.window');
        
        if (win.classList.contains('minimized')) {
            win.classList.remove('minimized');
            highestZIndex++;
            win.style.zIndex = highestZIndex;
        } else {
            win.remove();
            updateDockState();
        }
        return; 
    }

    windowCount++;
    highestZIndex++;
    const winId = "win-" + windowCount;

    const win = document.createElement("div");
    win.className = "window";
    win.id = winId;
    win.style.zIndex = highestZIndex;
    win.style.width = customWidth;
    
    const offset = Math.floor(Math.random() * 40) - 20;
    win.style.top = `calc(20% + ${offset}px)`;
    win.style.left = `calc(25% + ${offset}px)`;

    win.onmousedown = () => {
        highestZIndex++;
        win.style.zIndex = highestZIndex;
    };

    const header = document.createElement("div");
    header.className = "window-header";
    header.id = winId + "-header";
    
    const titleSpan = document.createElement("span");
    titleSpan.innerText = appName;
    
    const controls = document.createElement("div");
    controls.className = "window-controls";
    

    const closeBtn = document.createElement("div");
    closeBtn.className = "control-dot dot-close";
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        win.remove();
        updateDockState(); 
    };


    const minBtn = document.createElement("div");
    minBtn.className = "control-dot dot-min";
    minBtn.onclick = (e) => {
        e.stopPropagation();
        win.classList.add('minimized'); 
    }; 
    

    const maxBtn = document.createElement("div");
    maxBtn.className = "control-dot dot-max";
    
    let isMaximized = false;
    let preMaxState = { top: '', left: '', width: '' };
    
    maxBtn.onclick = (e) => {
        e.stopPropagation();
        if (!isMaximized) {
            preMaxState = { top: win.style.top, left: win.style.left, width: win.style.width };
            win.classList.add('maximized');
            isMaximized = true;
        } else {
            // Restore original position
            win.classList.remove('maximized');
            win.style.top = preMaxState.top;
            win.style.left = preMaxState.left;
            win.style.width = preMaxState.width;
            isMaximized = false;
        }
    };
    

    controls.appendChild(closeBtn);
    controls.appendChild(minBtn);
    controls.appendChild(maxBtn);
    
    header.appendChild(controls);
    header.appendChild(titleSpan);

    const content = document.createElement("div");
    content.className = "window-content";
    content.innerHTML = appContent;

    win.appendChild(header);
    win.appendChild(content);
    document.getElementById("desktop").appendChild(win);

    makeDraggable(win);
    updateDockState(); 
}

function makeDraggable(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var header = document.getElementById(elmnt.id + "-header");
    
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        if (e.target.classList.contains("control-dot")) return; 
        if (elmnt.classList.contains("maximized")) return; 

        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

document.querySelectorAll('.dock-app').forEach(app => {
    app.addEventListener('click', () => {
        const action = app.getAttribute('data-action');
        
        if (action === 'browser') {
            spawnWindow('Browser', 'Opening browser instance...');
            if (action === 'browser') {
            window.open('https://www.google.com', '_blank');}
        } else if (action === 'calculator') {
            spawnWindow('Calculator', getCalculatorHTML(), '320px');
        } else if (action === 'settings') {
            spawnWindow('Settings', 'System Preferences loaded.');
        } else if (action === 'aboutme') {
            spawnWindow('About Me', getAboutMeHTML(), '600px');
        } else if (action === 'music') {
            spawnWindow('Music', getMusicHTML(), '400px');
        } else if (action === 'notes') {
            spawnWindow('Notes', getNotesHTML(), '800px');
        } else if (action === 'wallpapers') {
            spawnWindow('Wallpapers', getWallpapersHTML(), '900px');
        } else if (action === 'currencyconverter') {
            spawnWindow('Currency Converter', getCurrencyHTML(), '600px');
        } else if (action === 'translator') {
            spawnWindow('Translator', getTranslatorHTML(), '600px');
        }
    });
});
// 1. BOOT SCREEN LOGIC
window.addEventListener('load', () => {
    const bootScreen = document.getElementById('boot-screen');
    setTimeout(() => {
        bootScreen.style.opacity = '0';
        bootScreen.style.visibility = 'hidden';
    }, 2000); 
});

// 2. CLOCK LOGIC
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('dock-time').innerText = hours + ':' + minutes + ' ' + ampm;
}
setInterval(updateClock, 1000);
updateClock();

// 3. WINDOW SPAWNING & DRAGGING LOGIC
let highestZIndex = 10; 
let windowCount = 0;    

// Add customWidth as a parameter with a default fallback of 550px
function spawnWindow(appName, appContent, customWidth = '550px') {
    windowCount++;
    highestZIndex++;
    const winId = "win-" + windowCount;

    const win = document.createElement("div");
    win.className = "window";
    win.id = winId;
    win.style.zIndex = highestZIndex;
    
    // Apply the custom width here
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
    
    const minBtn = document.createElement("div");
    minBtn.className = "control-dot dot-min";
    
    const maxBtn = document.createElement("div");
    maxBtn.className = "control-dot dot-max";
    
    const closeBtn = document.createElement("div");
    closeBtn.className = "control-dot dot-close";
    closeBtn.onclick = () => win.remove();
    
    controls.appendChild(minBtn);
    controls.appendChild(maxBtn);
    controls.appendChild(closeBtn);
    
    header.appendChild(titleSpan);
    header.appendChild(controls);

    const content = document.createElement("div");
    content.className = "window-content";
    content.innerHTML = appContent;

    win.appendChild(header);
    win.appendChild(content);
    document.getElementById("desktop").appendChild(win);

    makeDraggable(win);
}

// 4. WALLPAPERS APP LOGIC
function setWallpaper(url) {
    // Targets the body background directly
    document.body.style.backgroundImage = `url('${url}')`;
}

function openWallpapers() {
    // Generates a grid of images using relative paths for your local setup
    const wallpapersHTML = `
        <div class="wallpaper-grid">
            <div class="wallpaper-thumb" style="background-image: url('./public/assets/wallpapers/wall1.jpg')" onclick="setWallpaper('./public/assets/wallpapers/wall1.jpg')"></div>
            <div class="wallpaper-thumb" style="background-image: url('./public/assets/wallpapers/wall2.jpg')" onclick="setWallpaper('./public/assets/wallpapers/wall2.jpg')"></div>
            <div class="wallpaper-thumb" style="background-image: url('./public/assets/wallpapers/wall3.avif')" onclick="setWallpaper('./public/assets/wallpapers/wall3.avif')"></div>
            <div class="wallpaper-thumb" style="background-image: url('./public/assets/wallpapers/wall4.jpg')" onclick="setWallpaper('./public/assets/wallpapers/wall4.jpg')"></div>
        </div>
    `;
    spawnWindow('Wallpapers', wallpapersHTML);
}

// 5. WINDOW DRAG FUNCTION
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
        // Don't trigger drag if clicking a window control dot
        if (e.target.classList.contains("control-dot")) return; 
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

// 6. DOCK EVENT LISTENERS
document.querySelectorAll('.dock-app').forEach(app => {
    app.addEventListener('click', () => {
        const action = app.getAttribute('data-action');
        
        if (action === 'browser') {
            spawnWindow('Browser', 'Opening browser instance...');
        } else if (action === 'wallpapers') {
            openWallpapers();
        } else if (action === 'calculator') {
            // Note: 320px width keeps the calculator grid tight and proportional
            spawnWindow('Calculator', getCalculatorHTML(), '320px');
        } else if (action === 'settings') {
            spawnWindow('Settings', 'System Preferences loaded.');
        } else if (action === 'aboutme') {
            spawnWindow('About Me', getAboutMeHTML(), '600px');
        } else if (action === 'music') {
            spawnWindow('Music', getMusicHTML(), '400px');
        }
    });
});
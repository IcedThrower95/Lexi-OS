const PRELOADED_WALLPAPERS = [
    "./public/assets/wallpapers/wall1.avif",
    "./public/assets/wallpapers/wall2.jpg",
    "./public/assets/wallpapers/wall3.avif",
    "./public/assets/wallpapers/wall4.jpg"
];

function getWallpapersHTML() {
    const gridHTML = PRELOADED_WALLPAPERS.map((url, index) => `
        <div class="wallpaper-thumb" style="background-image: url('${url}')" onclick="setWallpaper('${url}')">
            <div class="wallpaper-label">Style ${index + 1}</div>
        </div>
    `).join('');

    return `
        <div class="wallpapers-wrapper">
            <div class="wallpapers-header-text">System Wallpapers</div>
            <label class="wallpaper-upload-btn">
                <span>Upload Custom Background</span>
                <input type="file" accept="image/*" style="display:none;" onchange="loadLocalWallpaper(event)">
            </label>
            <div class="wallpaper-grid">
                ${gridHTML}
            </div>
        </div>
    `;
}

function setWallpaper(url) {
    document.body.style.backgroundImage = `url('${url}')`;
}

function loadLocalWallpaper(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileUrl = URL.createObjectURL(file);
    setWallpaper(fileUrl);
}
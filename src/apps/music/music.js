const PRELOADED_TRACKS = [
    { title: "Track 01", artist: "Lexi Audio", file: "./public/assets/music/song1.mp3" },
    { title: "Track 02", artist: "Lexi Audio", file: "./public/assets/music/song2.mp3" },
    { title: "Track 03", artist: "Lexi Audio", file: "./public/assets/music/song3.mp3" },
    { title: "Track 04", artist: "Lexi Audio", file: "./public/assets/music/song4.mp3" },
    { title: "Track 05", artist: "Lexi Audio", file: "./public/assets/music/song5.mp3" },
    { title: "Track 06", artist: "Lexi Audio", file: "./public/assets/music/song6.mp3" },
    { title: "Track 07", artist: "Lexi Audio", file: "./public/assets/music/song7.mp3" },
    { title: "Track 08", artist: "Lexi Audio", file: "./public/assets/music/song8.mp3" },
    { title: "Track 09", artist: "Lexi Audio", file: "./public/assets/music/song9.mp3" },
    { title: "Track 10", artist: "Lexi Audio", file: "./public/assets/music/song10.mp3" },
    { title: "Track 11", artist: "Lexi Audio", file: "./public/assets/music/song11.mp3" },
    { title: "Track 12", artist: "Lexi Audio", file: "./public/assets/music/song12.mp3" },
    { title: "Track 13", artist: "Lexi Audio", file: "./public/assets/music/song13.mp3" },
    { title: "Track 14", artist: "Lexi Audio", file: "./public/assets/music/song14.mp3" },
    { title: "Track 15", artist: "Lexi Audio", file: "./public/assets/music/song15.mp3" },
    { title: "Track 16", artist: "Lexi Audio", file: "./public/assets/music/song16.mp3" },
    { title: "Track 17", artist: "Lexi Audio", file: "./public/assets/music/song17.mp3" },
    { title: "Track 18", artist: "Lexi Audio", file: "./public/assets/music/song18.mp3" },
    { title: "Track 19", artist: "Lexi Audio", file: "./public/assets/music/song19.mp3" },
    { title: "Track 20", artist: "Lexi Audio", file: "./public/assets/music/song20.mp3" }
];

function getMusicHTML() {
    const libraryHTML = PRELOADED_TRACKS.map((track, index) => `
        <div class="music-card" onclick="queueTrack(this, '${track.file}', '${track.title}', '${track.artist}')">
            <div class="music-card-title">Slot ${index + 1}</div>
            <div class="music-card-content">${track.title}</div>
        </div>
    `).join('');

    return `
        <div class="music-wrapper">
            
            <!-- Now Playing Profile -->
            <div class="music-profile">
                <div class="music-art">🎵</div>
                <h2 class="music-title">No Track Loaded</h2>
                <div class="music-artist">Queue is empty</div>
            </div>

            <!-- Track Timeline -->
            <div class="music-timeline">
                <span class="music-time-current">0:00</span>
                <input type="range" class="music-progress-bar" value="0" step="0.1" oninput="seekTrack(this)">
                <span class="music-time-total">0:00</span>
            </div>
            
            <!-- Playback Controls -->
            <div class="music-controls">
                <button class="music-action-btn" title="Previous Track" onclick="skipTrack(this, -1)">⏮</button>
                <button class="music-action-btn" title="Rewind 10s" onclick="seekOffset(this.closest('.music-wrapper'), -10)">⏳</button>
                <button class="music-play-btn" onclick="togglePlay(this)">▶</button>
                <button class="music-action-btn" title="Forward 10s" onclick="seekOffset(this.closest('.music-wrapper'), 10)">⌛</button>
                <button class="music-action-btn" title="Next Track" onclick="skipTrack(this, 1)">⏭</button>
            </div>

            <!-- Dynamic Playlist & Library Area -->
            <div class="music-playlist-area">
                <div class="music-grid">
                    
                    <!-- 1. Local Upload Button -->
                    <label class="music-card local-upload" style="cursor: pointer;">
                        <div class="music-card-title">Local Audio</div>
                        <div class="music-card-content">📁 Add to Queue</div>
                        <input type="file" accept="audio/*" multiple style="display:none;" onchange="loadLocalFile(event, this)">
                    </label>

                    <!-- 2. The NEW Folder Button -->
                    <div class="music-card" style="border-color: #20a4f3; cursor: pointer;" onclick="toggleLibrary(this)">
                        <div class="music-card-title" style="color: #20a4f3;">Library</div>
                        <div class="music-card-content"> 🎵 View Pre-loaded</div>
                    </div>

                    <!-- 3. The dynamic queue injects here -->
                    <div class="dynamic-queue-container" style="display: contents;"></div>
                    
                    <!-- 4. Pre-loaded Library (Hidden by default) -->
                    <div class="preloaded-library-container" style="display: none;">
                        ${libraryHTML}
                    </div>
                </div>
            </div>

            <!-- Dual Audio Engines -->
            <audio class="engine-a" style="display:none;"></audio>
            <audio class="engine-b" style="display:none;"></audio>
        </div>
    `;
}

function toggleLibrary(btn) {
    const wrapper = btn.closest('.music-wrapper');
    const container = wrapper.querySelector('.preloaded-library-container');
    const textElement = btn.querySelector('.music-card-content');
    
    if (container.style.display === 'none') {
        container.style.display = 'contents'; 
        textElement.innerText = '📂 Hide Tracks';
    } else {
        container.style.display = 'none';
        textElement.innerText = '📂 View Pre-loaded';
    }
}


function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function getMusicState(wrapper) {
    if (!wrapper.musicState) {
        wrapper.musicState = {
            queue: [],
            activeEngine: 'a',
            isFading: false,
            fadeTimer: null
        };
        
        const engineA = wrapper.querySelector('.engine-a');
        const engineB = wrapper.querySelector('.engine-b');

        engineA.addEventListener('timeupdate', function() {
            updateTimeline(wrapper, this);
            checkCrossfade(wrapper, this, engineB);
        });
        
        engineB.addEventListener('timeupdate', function() {
            updateTimeline(wrapper, this);
            checkCrossfade(wrapper, this, engineA);
        });
        engineA.addEventListener('ended', () => handleTrackEnd(wrapper));
        engineB.addEventListener('ended', () => handleTrackEnd(wrapper));
    }
    return wrapper.musicState;
}

function handleTrackEnd(wrapper) {
    const state = getMusicState(wrapper);
    if (state.queue.length === 0) {
        wrapper.querySelector('.music-play-btn').innerText = '▶';
    }
}

function updateTimeline(wrapper, audio) {
    const progressBar = wrapper.querySelector('.music-progress-bar');
    const currentTimeEl = wrapper.querySelector('.music-time-current');
    const totalTimeEl = wrapper.querySelector('.music-time-total');

    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        totalTimeEl.innerText = formatTime(audio.duration);
    }
}

function seekTrack(inputSlider) {
    const wrapper = inputSlider.closest('.music-wrapper');
    const state = getMusicState(wrapper);
    const audio = wrapper.querySelector(state.activeEngine === 'a' ? '.engine-a' : '.engine-b');
    
    if (audio.duration) {
        audio.currentTime = (inputSlider.value / 100) * audio.duration;
    }
}


function renderQueue(wrapper) {
    const state = getMusicState(wrapper);
    const queueContainer = wrapper.querySelector('.dynamic-queue-container');
    
    queueContainer.innerHTML = state.queue.map((track, index) => `
        <div class="music-card" style="border-color: #00d5ff;">
            <div class="music-card-title" style="color: #00d5ff;">In Queue (${index + 1})</div>
            <div class="music-card-content">${track.title}</div>
        </div>
    `).join('');
}

function queueTrack(element, fileUrl, songName, artistName) {
    const wrapper = element.closest('.music-wrapper');
    const state = getMusicState(wrapper);
    
    state.queue.push({ url: fileUrl, title: songName, artist: artistName });
    renderQueue(wrapper);
    
    const engineA = wrapper.querySelector('.engine-a');
    const engineB = wrapper.querySelector('.engine-b');
    
    if (engineA.paused && engineB.paused && !state.isFading) {
        playNextInQueue(wrapper);
    }
}

function loadLocalFile(event, inputElement) {
    const files = event.target.files;
    if (!files.length) return;
    
    for(let i = 0; i < files.length; i++) {
        const fileUrl = URL.createObjectURL(files[i]);
        const songName = files[i].name.replace(/\.[^/.]+$/, ""); 
        queueTrack(inputElement, fileUrl, songName, "Local Device");
    }
}

function playNextInQueue(wrapper) {
    const state = getMusicState(wrapper);
    if (state.queue.length === 0) return; 
    
    clearInterval(state.fadeTimer);
    state.isFading = false;
    
    const nextTrack = state.queue.shift();
    renderQueue(wrapper); 
    
    const audio = wrapper.querySelector(state.activeEngine === 'a' ? '.engine-a' : '.engine-b');
    
    wrapper.querySelector('.music-title').innerText = nextTrack.title;
    wrapper.querySelector('.music-artist').innerText = nextTrack.artist;
    wrapper.querySelector('.music-play-btn').innerText = '⏸';
    
    audio.src = nextTrack.url;
    audio.volume = 1;
    audio.play();
}

function checkCrossfade(wrapper, currentAudio, nextAudio) {
    const state = getMusicState(wrapper);
    
    if (!state.isFading && currentAudio.duration > 0 && !currentAudio.paused) {
        const timeLeft = currentAudio.duration - currentAudio.currentTime;
        
        if (timeLeft <= 15 && timeLeft > 0 && state.queue.length > 0) {
            state.isFading = true;
            
            const nextTrack = state.queue.shift();
            renderQueue(wrapper); 
            
            nextAudio.src = nextTrack.url;
            nextAudio.volume = 0;
            nextAudio.play();
            
            wrapper.querySelector('.music-title').innerText = nextTrack.title;
            wrapper.querySelector('.music-artist').innerText = nextTrack.artist;
            state.fadeTimer = setInterval(() => {
                if (currentAudio.volume >= 0.05) currentAudio.volume -= 0.05;
                if (nextAudio.volume <= 0.95) nextAudio.volume += 0.05;
                
                if (currentAudio.volume < 0.05) {
                    clearInterval(state.fadeTimer);
                    currentAudio.pause();
                    currentAudio.volume = 1;
                    state.activeEngine = state.activeEngine === 'a' ? 'b' : 'a'; 
                    state.isFading = false;
                }
            }, 250); 
        }
    }
}

function togglePlay(btn) {
    const wrapper = btn.closest('.music-wrapper');
    const state = getMusicState(wrapper);
    const audio = wrapper.querySelector(state.activeEngine === 'a' ? '.engine-a' : '.engine-b');
    
    if (!audio.src || audio.src.endsWith(window.location.host + "/")) {
        wrapper.querySelector('.music-title').innerText = "Add tracks to queue";
        return;
    }
    if (audio.paused) {
        audio.play();
        btn.innerText = '⏸';
    } else {
        audio.pause();
        btn.innerText = '▶';
    }
}

function skipTrack(btn, direction) {
    const wrapper = btn.closest('.music-wrapper');
    const state = getMusicState(wrapper);
    const audio = wrapper.querySelector(state.activeEngine === 'a' ? '.engine-a' : '.engine-b');
    
    if (direction === -1) {
        audio.currentTime = 0;
    } else if (direction === 1) {
        clearInterval(state.fadeTimer);
        wrapper.querySelector('.engine-a').pause();
        wrapper.querySelector('.engine-b').pause();
        state.isFading = false; 
        
        
        if (state.queue.length > 0) {
            playNextInQueue(wrapper);
        } else {
            audio.currentTime = 0;
            wrapper.querySelector('.music-play-btn').innerText = '▶';
        }
    }
}

function seekOffset(wrapper, seconds) {
    
    
    if (!wrapper) return;
    const state = getMusicState(wrapper);
    const audio = wrapper.querySelector(state.activeEngine === 'a' ? '.engine-a' : '.engine-b');

    
    if (audio && audio.duration) {
        audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), audio.duration);
        updateTimeline(wrapper, audio);
    }
}
window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) 
        return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const musicWrappers = document.querySelectorAll('.music-wrapper');
        if (musicWrappers.length === 0) return;

        let targetWrapper = null;
        for (const wrap of musicWrappers) {
            const audioA = wrap.querySelector('.engine-a');
            const audioB = wrap.querySelector('.engine-b');
            if ((audioA && !audioA.paused) || (audioB && !audioB.paused)) {
                targetWrapper = wrap;
                break;
            }
        }
        if (targetWrapper) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') seekOffset(targetWrapper, -10);
            
            if (e.key === 'ArrowRight') seekOffset(targetWrapper, 10);
        }
    }
});
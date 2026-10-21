function getNotesHTML() {
    return `
        <div class="notes-wrapper">
            <div class="notes-toolbar">
                <button class="notes-add-btn" onclick="spawnVisualNote(this)">+ New Node</button>
                <span style="font-size: 11px; color: #fffafa; font border: 1px solid #000000;"> Drag nodes around the canvas. To LINK THE NODES, CLICK THE LINK ICON (🔗) AND THEN CLICK ON ANOTHER NODE.</span>
            </div>
            
            <div class="notes-canvas">
                <svg class="notes-line-layer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"></svg>
            </div>
        </div>
    `;
}

function spawnVisualNote(btn) {
    const wrapper = btn.closest('.notes-wrapper');
    const canvas = wrapper.querySelector('.notes-canvas');
    
    const note = document.createElement('div');
    note.id = 'node-' + Date.now();
    note.style.zIndex = 2;
    note.className = 'note-node';
    const x = Math.random() * 100 + 50;
    const y = Math.random() * 100 + 50;
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    
    note.innerHTML = `
        <div class="note-header" onmousedown="dragNote(event, this.parentElement)"></div>
        <textarea class="note-text" placeholder="Type an idea..."></textarea>
        <div class="note-actions">
            <span class="note-action-btn" onclick="startNodeLink(this.closest('.note-node'))">🔗</span>
            <span class="note-action-btn" style="color:#ff4757;" onclick="deleteNode(this.closest('.note-node'))">×</span>
        </div>
    `;
    canvas.appendChild(note);
}
function dragNote(e, noteEl) {
    e.preventDefault();
    let pos3 = e.clientX, pos4 = e.clientY;
    noteEl.style.zIndex = Date.now();
    document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
    };
    document.onmousemove = (e) => {
        e.preventDefault();
        let pos1 = pos3 - e.clientX;
        let pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        let newTop = noteEl.offsetTop - pos2;
        let newLeft = noteEl.offsetLeft - pos1;
        noteEl.style.top = (newTop > 0 ? newTop : 0) + "px";
        noteEl.style.left = (newLeft > 0 ? newLeft : 0) + "px";
        redrawLines(noteEl.closest('.notes-wrapper'));
    };
}
function startNodeLink(node) {
    const wrapper = node.closest('.notes-wrapper');
    if (!wrapper.noteState) wrapper.noteState = { activeLinkNode: null, connections: [] };
    const state = wrapper.noteState;

    if (!state.activeLinkNode) {
        state.activeLinkNode = node;
        node.style.borderColor = '#ff4757';
        } else {
        if (state.activeLinkNode.id !== node.id) {
            state.connections.push({ from: state.activeLinkNode.id, to: node.id });
            redrawLines(wrapper);
        }
        state.activeLinkNode.style.borderColor = 'rgba(0, 213, 255, 0.3)';
        state.activeLinkNode = null;
    }
}
function redrawLines(wrapper) {
    if (!wrapper.noteState) return;
    const svg = wrapper.querySelector('.notes-line-layer');
    svg.innerHTML = ''; // Clear old lines
    wrapper.noteState.connections = wrapper.noteState.connections.filter(conn => {
        const nodeA = document.getElementById(conn.from);
        const nodeB = document.getElementById(conn.to);
        
        if (nodeA && nodeB) {
            const aX = nodeA.offsetLeft + (nodeA.offsetWidth / 2);
            const aY = nodeA.offsetTop + (nodeA.offsetHeight / 2);
            const bX = nodeB.offsetLeft + (nodeB.offsetWidth / 2);
            const bY = nodeB.offsetTop + (nodeB.offsetHeight / 2);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', aX);
            line.setAttribute('y1', aY);
            line.setAttribute('x2', bX);
            line.setAttribute('y2', bY);
            line.setAttribute('stroke', 'rgba(0, 213, 255, 0.6)');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5'); 
            svg.appendChild(line);
            return true;
        }
        return false; 
    });
}
function deleteNode(node) {
    const wrapper = node.closest('.notes-wrapper');
    node.remove();
    redrawLines(wrapper);
}
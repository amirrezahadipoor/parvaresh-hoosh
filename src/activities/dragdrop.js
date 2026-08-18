// Drag & drop activity renderer (also used for classification)
const DragDropActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'activity-title';
        title.textContent = 'بچین سر جاش';
        container.appendChild(title);

        const instr = document.createElement('div');
        instr.className = 'activity-instr';
        instr.textContent = round.prompt || 'هر چیز را به جای درستش ببر';
        container.appendChild(instr);

        AudioEngine.speak(round.speech || round.prompt);

        const stage = document.createElement('div');
        stage.className = 'drag-stage';

        // Targets
        const targetsEl = document.createElement('div');
        targetsEl.className = 'drag-targets';
        const targetEls = {};
        round.targets.forEach(t => {
            const el = document.createElement('div');
            el.className = 'drag-target';
            el.dataset.id = t.id;
            if (t.img) el.innerHTML = t.img;
            const lbl = document.createElement('span');
            lbl.textContent = t.label;
            el.appendChild(lbl);
            targetsEl.appendChild(el);
            targetEls[t.id] = el;
        });
        stage.appendChild(targetsEl);

        // Items
        const itemsEl = document.createElement('div');
        itemsEl.className = 'drag-items';
        const itemEls = [];
        const remaining = round.items.slice();

        remaining.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'drag-item';
            el.dataset.id = item.id;
            el.dataset.target = item.target;
            el.innerHTML = item.img + (item.label && !item.img ? '' : '');
            const lbl = document.createElement('span');
            lbl.className = 'label';
            lbl.textContent = item.label || '';
            el.appendChild(lbl);
            itemsEl.appendChild(el);
            itemEls.push(el);

            // Pointer-based drag
            let dragging = false;
            let startX = 0, startY = 0;

            el.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                dragging = true;
                startX = e.clientX - el.offsetLeft;
                startY = e.clientY - el.offsetTop;
                el.classList.add('dragging');
                el.setPointerCapture(e.pointerId);
                AudioEngine.play('drag');
            });
            el.addEventListener('pointermove', (e) => {
                if (!dragging) return;
                const x = e.clientX - startX;
                const y = e.clientY - startY;
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                // hover detection
                let over = null;
                Object.keys(targetEls).forEach(id => {
                    const t = targetEls[id];
                    const r = t.getBoundingClientRect();
                    const eR = el.getBoundingClientRect();
                    if (eR.left < r.right && eR.right > r.left && eR.top < r.bottom && eR.bottom > r.top) {
                        over = id;
                    }
                });
                Object.values(targetEls).forEach(t => t.classList.remove('hover'));
                if (over) targetEls[over].classList.add('hover');
            });
            el.addEventListener('pointerup', (e) => {
                if (!dragging) return;
                dragging = false;
                el.classList.remove('dragging');
                Object.values(targetEls).forEach(t => t.classList.remove('hover'));
                el.style.left = '0px';
                el.style.top = '0px';
                // check drop target
                let droppedOn = null;
                Object.keys(targetEls).forEach(id => {
                    const t = targetEls[id];
                    const r = t.getBoundingClientRect();
                    const eR = el.getBoundingClientRect();
                    if (eR.left < r.right && eR.right > r.left && eR.top < r.bottom && eR.bottom > r.top) {
                        droppedOn = id;
                    }
                });
                if (droppedOn === el.dataset.target) {
                    // correct
                    AudioEngine.play('correct');
                    el.classList.add('placed');
                    targetEls[droppedOn].classList.add('filled', 'correct-anim');
                    Fx.pop(targetEls[droppedOn]);
                    const idx = remaining.indexOf(item);
                    if (idx >= 0) remaining.splice(idx, 1);
                    if (remaining.length === 0) {
                        setTimeout(() => cb.onCorrect(round), 600);
                    }
                } else if (droppedOn) {
                    AudioEngine.play('wrong');
                    Fx.shake(targetEls[droppedOn]);
                    setTimeout(() => cb.onWrong(round), 800);
                }
            });
        });
        stage.appendChild(itemsEl);
        container.appendChild(stage);
    }

    return { render };
})();

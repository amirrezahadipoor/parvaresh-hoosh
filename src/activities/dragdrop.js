// Drag, Drop & Categorization Engine for "پرورش هوش کودک"
window.DragDropActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'dragdrop-card';

        // Header
        const headerRow = document.createElement('div');
        headerRow.className = 'activity-header-row';

        const promptTitle = document.createElement('h2');
        promptTitle.className = 'quiz-prompt';
        promptTitle.textContent = round.prompt || 'هر شکل را در جای خودش بگذار';

        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'speaker-btn';
        speakerBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <span>بشنو</span>
        `;
        speakerBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            AudioEngine.speak(round.speech || round.prompt);
        });

        headerRow.appendChild(promptTitle);
        headerRow.appendChild(speakerBtn);
        card.appendChild(headerRow);

        setTimeout(() => {
            AudioEngine.speak(round.speech || round.prompt);
        }, 150);

        const stage = document.createElement('div');
        stage.className = 'drag-stage-container';

        // 1. Targets (Drop Zones)
        const targetsWrap = document.createElement('div');
        targetsWrap.className = 'drop-targets-row';
        const targetElements = {};

        (round.targets || []).forEach(t => {
            const targetEl = document.createElement('div');
            targetEl.className = 'drop-zone';
            targetEl.dataset.targetId = t.id;

            if (t.img) {
                const imgWrap = document.createElement('div');
                imgWrap.className = 'drop-zone-icon';
                imgWrap.innerHTML = t.img;
                targetEl.appendChild(imgWrap);
            }

            const label = document.createElement('span');
            label.className = 'drop-zone-label';
            label.textContent = t.label;
            targetEl.appendChild(label);

            const itemsHolder = document.createElement('div');
            itemsHolder.className = 'drop-zone-items';
            targetEl.appendChild(itemsHolder);

            targetsWrap.appendChild(targetEl);
            targetElements[t.id] = targetEl;
        });

        stage.appendChild(targetsWrap);

        // 2. Draggable Items Pool
        const itemsPool = document.createElement('div');
        itemsPool.className = 'draggable-items-pool';

        let placedCount = 0;
        const totalItems = (round.items || []).length;

        (round.items || []).forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'draggable-item';
            itemEl.dataset.itemId = item.id;
            itemEl.dataset.target = item.target;

            if (item.img) {
                const imgSpan = document.createElement('div');
                imgSpan.className = 'item-visual';
                imgSpan.innerHTML = item.img;
                itemEl.appendChild(imgSpan);
            }

            if (item.label) {
                const lbl = document.createElement('span');
                lbl.className = 'item-label';
                lbl.textContent = item.label;
                itemEl.appendChild(lbl);
            }

            // Touch / Mouse Drag System
            let isDragging = false;
            let startX, startY;

            function pointerDown(e) {
                if (itemEl.classList.contains('placed')) return;
                isDragging = true;
                itemEl.classList.add('is-dragging');
                AudioEngine.play('drag');

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                startX = clientX;
                startY = clientY;

                window.addEventListener('mousemove', pointerMove);
                window.addEventListener('mouseup', pointerUp);
                window.addEventListener('touchmove', pointerMove, { passive: false });
                window.addEventListener('touchend', pointerUp);
            }

            function pointerMove(e) {
                if (!isDragging) return;
                if (e.touches) e.preventDefault();

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const dx = clientX - startX;
                const dy = clientY - startY;

                itemEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.15)`;

                Object.values(targetElements).forEach(zone => {
                    const rect = zone.getBoundingClientRect();
                    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                        zone.classList.add('hover-over');
                    } else {
                        zone.classList.remove('hover-over');
                    }
                });
            }

            function pointerUp(e) {
                if (!isDragging) return;
                isDragging = false;
                itemEl.classList.remove('is-dragging');

                window.removeEventListener('mousemove', pointerMove);
                window.removeEventListener('mouseup', pointerUp);
                window.removeEventListener('touchmove', pointerMove);
                window.removeEventListener('touchend', pointerUp);

                const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

                let hitZone = null;
                Object.values(targetElements).forEach(zone => {
                    zone.classList.remove('hover-over');
                    const rect = zone.getBoundingClientRect();
                    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
                        hitZone = zone;
                    }
                });

                if (hitZone && hitZone.dataset.targetId === item.target) {
                    itemEl.classList.add('placed');
                    itemEl.style.transform = 'none';
                    hitZone.querySelector('.drop-zone-items').appendChild(itemEl);
                    AudioEngine.play('drop');
                    if (window.Fx) Fx.pop(hitZone);
                    placedCount++;

                    if (placedCount >= totalItems) {
                        setTimeout(() => {
                            AudioEngine.play('correct');
                            if (cb && cb.onCorrect) cb.onCorrect(round);
                        }, 500);
                    }
                } else {
                    AudioEngine.play('wrong');
                    if (window.Fx) Fx.shake(itemEl);
                    itemEl.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)';
                    itemEl.style.transform = 'translate(0, 0)';
                    setTimeout(() => {
                        itemEl.style.transition = '';
                    }, 350);
                }
            }

            itemEl.addEventListener('mousedown', pointerDown);
            itemEl.addEventListener('touchstart', pointerDown, { passive: false });

            itemsPool.appendChild(itemEl);
        });

        stage.appendChild(itemsPool);
        card.appendChild(stage);
        container.appendChild(card);
    }

    return { render };
})();

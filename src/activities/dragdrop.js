// Drag, Drop & Categorization Engine for "پرورش هوش کودک" (100% Fullscreen, Zero-Scroll)
window.DragDropActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const stage = document.createElement('div');
        stage.className = 'activity-fullscreen-stage';

        // 1. Top Prompt
        const promptBanner = document.createElement('div');
        promptBanner.className = 'activity-prompt-banner';

        const promptText = document.createElement('div');
        promptText.className = 'activity-prompt-text';
        promptText.textContent = round.prompt || 'هر شکل را در جای خودش بگذار!';

        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'activity-speaker-btn';
        speakerBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
        speakerBtn.onclick = () => {
            AudioEngine.play('click');
            AudioEngine.speak(round.speech || round.prompt);
        };

        promptBanner.appendChild(promptText);
        promptBanner.appendChild(speakerBtn);
        stage.appendChild(promptBanner);

        setTimeout(() => {
            AudioEngine.speak(round.speech || round.prompt);
        }, 150);

        // 2. Drop Target Zones (Top Half)
        const targetsRow = document.createElement('div');
        targetsRow.style.cssText = 'display:flex; gap:10px; width:100%; justify-content:center; flex:1; min-height:0; align-items:center;';
        const targetElements = {};

        (round.targets || []).forEach(t => {
            const targetEl = document.createElement('div');
            targetEl.dataset.targetId = t.id;
            targetEl.style.cssText = 'flex:1; max-width:180px; height:100%; max-height:120px; border-radius:16px; border:3px dashed #D6C7B8; background:#FCFAF7; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:6px;';

            const label = document.createElement('span');
            label.style.cssText = 'font-size:13px; font-weight:900; color:var(--ink); margin-bottom:4px;';
            label.textContent = t.label;
            targetEl.appendChild(label);

            const itemsHolder = document.createElement('div');
            itemsHolder.className = 'drop-holder-items';
            itemsHolder.style.cssText = 'display:flex; flex-wrap:wrap; gap:4px; justify-content:center;';
            targetEl.appendChild(itemsHolder);

            targetEl.addEventListener('click', () => {
                if (selectedItem && !selectedItem.classList.contains('placed')) {
                    tryPlace(selectedItem, targetEl);
                    selectedItem = null;
                }
            });
            targetsRow.appendChild(targetEl);
            targetElements[t.id] = targetEl;
        });

        stage.appendChild(targetsRow);

        // 3. Draggable Items Dock (Bottom Half)
        const itemsPool = document.createElement('div');
        itemsPool.style.cssText = 'display:flex; gap:10px; justify-content:center; flex-wrap:wrap; padding:8px; background:#F4EDE4; border-radius:16px; flex-shrink:0;';

        let placedCount = 0;
        let selectedItem = null;
        let completed = false;
        const totalItems = (round.items || []).length;

        function tryPlace(itemEl, hitZone) {
            if (!itemEl || itemEl.classList.contains('placed') || !hitZone) return;
            if (hitZone.dataset.targetId === itemEl.dataset.target) {
                itemEl.classList.add('placed');
                itemEl.classList.remove('selected');
                itemEl.style.transform = 'none';
                hitZone.querySelector('.drop-holder-items').appendChild(itemEl);
                AudioEngine.play('drop');
                if (window.Fx) Fx.pop(hitZone);
                placedCount++;
                if (placedCount >= totalItems && !completed) {
                    completed = true;
                    setTimeout(() => {
                        AudioEngine.play('correct');
                        if (cb && cb.onCorrect) cb.onCorrect(round);
                    }, 450);
                }
            } else {
                AudioEngine.play('wrong');
                if (window.Fx) Fx.shake(itemEl);
                itemEl.classList.add('selected');
                itemEl.style.transition = 'transform 0.25s ease';
                itemEl.style.transform = 'translate(0, 0)';
                setTimeout(() => { itemEl.style.transition = ''; }, 300);
            }
        }

        (round.items || []).forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.dataset.itemId = item.id;
            itemEl.dataset.target = item.target;
            itemEl.setAttribute('role', 'button');
            itemEl.setAttribute('tabindex', '0');
            itemEl.setAttribute('aria-label', item.label || 'کارت قابل جابه‌جایی');
            itemEl.style.cssText = 'background:#FFFFFF; border-radius:12px; padding:6px 10px; box-shadow:0 3px 0 #E2D3C4; display:flex; flex-direction:column; align-items:center; gap:2px; cursor:grab; touch-action:none; border:2px solid #EFE6DC;';

            if (item.img) {
                const imgSpan = document.createElement('div');
                imgSpan.style.maxHeight = '42px';
                imgSpan.innerHTML = item.img;
                itemEl.appendChild(imgSpan);
            }

            if (item.label) {
                const lbl = document.createElement('span');
                lbl.style.cssText = 'font-size:12px; font-weight:800; color:var(--ink);';
                lbl.textContent = item.label;
                itemEl.appendChild(lbl);
            }

            // Pointer drag system
            let isDragging = false;
            let wasDragged = false;
            let startX, startY;

            function onDown(e) {
                if (itemEl.classList.contains('placed')) return;
                isDragging = true;
                wasDragged = false;
                AudioEngine.play('drag');
                startX = e.clientX;
                startY = e.clientY;

                try {
                    if (itemEl.setPointerCapture) itemEl.setPointerCapture(e.pointerId);
                } catch (err) {}
                itemEl.style.zIndex = '1000';
                itemEl.style.transform = 'scale(1.15)';
            }

            function onMove(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (Math.abs(dx) > 6 || Math.abs(dy) > 6) wasDragged = true;
                itemEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.15)`;
            }

            function onUp(e) {
                if (!isDragging) return;
                isDragging = false;
                itemEl.style.zIndex = '';

                let hitZone = null;
                Object.values(targetElements).forEach(zone => {
                    const rect = zone.getBoundingClientRect();
                    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                        hitZone = zone;
                    }
                });

                tryPlace(itemEl, hitZone);
            }

            itemEl.addEventListener('click', () => {
                if (wasDragged || itemEl.classList.contains('placed')) {
                    wasDragged = false;
                    return;
                }
                if (selectedItem && selectedItem !== itemEl) selectedItem.classList.remove('selected');
                selectedItem = itemEl;
                itemEl.classList.add('selected');
                AudioEngine.play('click');
            });
            itemEl.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    itemEl.click();
                }
            });
            itemEl.addEventListener('pointerdown', onDown);
            itemEl.addEventListener('pointermove', onMove);
            itemEl.addEventListener('pointerup', onUp);
            itemEl.addEventListener('pointercancel', onUp);

            itemsPool.appendChild(itemEl);
        });

        stage.appendChild(itemsPool);
        container.appendChild(stage);
    }

    return { render };
})();

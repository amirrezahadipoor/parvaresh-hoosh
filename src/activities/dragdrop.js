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
        speakerBtn.type = 'button';
        speakerBtn.setAttribute('aria-label', 'شنیدن راهنمای دسته‌بندی');
        speakerBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
        speakerBtn.onclick = () => {
            AudioEngine.play('click');
            if (round.audioClip && AudioEngine.playClip && AudioEngine.playClip(round.audioClip)) return;
            AudioEngine.speak(round.speech || round.prompt);
        };

        promptBanner.appendChild(promptText);
        promptBanner.appendChild(speakerBtn);
        stage.appendChild(promptBanner);

        // 2. Drop Target Zones (Top Half)
        const targetsRow = document.createElement('div');
        // Previously flex:1 with a 120px max-height, which parked the whole puzzle in
        // the vertical centre with large dead zones above and below it.
        // Sit under the prompt at a sensible height; do NOT stretch to fill the whole
        // stage (that produced 1000px-tall dashed boxes holding one word each).
        targetsRow.style.cssText = 'display:flex; gap:10px; width:100%; justify-content:center; align-items:stretch; flex:0 0 auto; margin:14px 0 0;';
        const targetElements = {};

        (round.targets || []).forEach(t => {
            const targetEl = document.createElement('div');
            targetEl.dataset.targetId = t.id;
            targetEl.style.cssText = 'flex:1; max-width:180px; min-height:132px; border-radius:16px; border:3px dashed #D6C7B8; background:#FCFAF7; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:8px; padding:12px 6px;';

            const label = document.createElement('span');
            label.style.cssText = 'font-size:13px; font-weight:900; color:var(--ink); text-align:center; line-height:1.35;';
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
        itemsPool.style.cssText = 'display:flex; gap:10px; justify-content:center; align-items:center; flex-wrap:wrap; padding:12px 8px; background:#F4EDE4; border-radius:16px; flex:0 0 auto; min-height:74px;';

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
            // Draggable chips were ~35x34px, below the 44px touch minimum for a child.
            itemEl.style.cssText = 'min-width:64px; min-height:48px; background:#FFFFFF; border-radius:12px; padding:8px 14px; box-shadow:0 3px 0 #E2D3C4; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; cursor:grab; touch-action:none; border:2px solid #EFE6DC;';

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

        const spacer = document.createElement('div');
        spacer.style.cssText = 'flex:1 1 auto; min-height:0;';
        stage.appendChild(spacer);
        stage.appendChild(itemsPool);
        container.appendChild(stage);
    }

    return { render };
})();

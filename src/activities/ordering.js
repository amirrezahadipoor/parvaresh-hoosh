// Ordering & Sequence Puzzle Engine for "پرورش هوش کودک" (100% Fullscreen, Zero-Scroll)
window.OrderingActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const stage = document.createElement('div');
        stage.className = 'activity-fullscreen-stage';

        // 1. Top Prompt
        const promptBanner = document.createElement('div');
        promptBanner.className = 'activity-prompt-banner';

        const promptText = document.createElement('div');
        promptText.className = 'activity-prompt-text';
        promptText.textContent = round.prompt || 'مراحل را به ترتیب درست بچین!';

        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'activity-speaker-btn';
        speakerBtn.type = 'button';
        speakerBtn.setAttribute('aria-label', 'شنیدن راهنمای مرتب‌سازی');
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

        // The validation model stores step zero first. In the RTL interface that
        // means the first slot is the RIGHTMOST slot. Make this explicit; without
        // a direction cue children could reasonably build the same sequence from
        // the left and be marked wrong.
        const directionGuide = document.createElement('div');
        directionGuide.className = 'order-direction-guide';
        directionGuide.setAttribute('role', 'note');
        directionGuide.setAttribute('aria-label', 'از خانهٔ شمارهٔ یک در سمت راست شروع کن و به سمت چپ ادامه بده');
        directionGuide.innerHTML = `
            <span class="order-direction-start">شروع از راست</span>
            <span class="order-direction-arrows" aria-hidden="true">← ← ←</span>
            <span class="order-direction-end">پایان</span>
        `;
        stage.appendChild(directionGuide);

        // 2. Horizontal Ordering Row
        const row = document.createElement('div');
        row.className = 'ordering-horizontal-row';

        let currentOrder = (round.items || []).slice();
        let selectedIndex = null;
        let moves = 0;
        let completed = false;
        let hintUsed = false;
        const undoStack = [];

        const status = document.createElement('div');
        status.className = 'order-status';
        status.textContent = 'از جایگاه ۱ در سمت راست شروع کن؛ یک کارت و بعد کارت دوم را بزن.';

        const actions = document.createElement('div');
        actions.className = 'order-actions';
        const hintBtn = document.createElement('button');
        hintBtn.type = 'button';
        hintBtn.className = 'order-helper-btn';
        hintBtn.textContent = 'راهنما (۱)';
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'order-helper-btn';
        resetBtn.textContent = 'شروع دوباره';
        actions.appendChild(hintBtn);
        actions.appendChild(resetBtn);

        function isCorrectOrder() {
            if (round.answer === 'idx') return currentOrder.every((item, i) => item.idx === i);
            if (round.answer === 'size') {
                const sizes = currentOrder.map(item => item.size);
                const sorted = sizes.slice().sort((a, b) => a - b);
                return sizes.every((size, index) => size === sorted[index]);
            }
            return false;
        }

        hintBtn.addEventListener('click', () => {
            if (completed || hintUsed) return;
            hintUsed = true;
            hintBtn.disabled = true;
            const sortedSizes = round.answer === 'size'
                ? currentOrder.map(item => item.size).slice().sort((a, b) => a - b)
                : null;
            const correctIndex = currentOrder.findIndex((item, index) => round.answer === 'idx'
                ? item.idx !== index
                : round.answer === 'size' && item.size !== sortedSizes[index]);
            if (correctIndex >= 0) {
                selectedIndex = correctIndex;
                status.textContent = 'این کارت جای درستش را پیدا می‌کند؛ کارت مناسب را انتخاب کن.';
                renderRow();
            } else {
                status.textContent = 'ترتیب را از کوچک به بزرگ یا از اول به آخر بررسی کن.';
            }
            AudioEngine.play('bubble');
        });
        resetBtn.addEventListener('click', () => {
            if (completed) return;
            currentOrder = (round.items || []).slice();
            selectedIndex = null;
            moves = 0;
            undoStack.length = 0;
            status.textContent = 'دوباره از جایگاه ۱ در سمت راست شروع کن.';
            renderRow();
            AudioEngine.play('click');
        });

        function renderRow() {
            row.innerHTML = '';
            // Badges label the FIXED slots, not the shuffled cards. They explain
            // unambiguously that slot ۱ is on the right and do not reveal which
            // card belongs there. Numeric prefixes embedded in old labels are
            // stripped below so the answer itself is never printed on a card.
            const showPositionBadges = true;
            currentOrder.forEach((item, idx) => {
                const itemEl = document.createElement('div');
                itemEl.className = `order-step-card ${round.answer === 'size' ? 'size-order-card' : ''} ${selectedIndex === idx ? 'selected' : ''}`;
                itemEl.setAttribute('role', 'button');
                itemEl.setAttribute('tabindex', '0');
                itemEl.setAttribute('aria-label', `کارت جایگاه ${String(idx + 1).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])}`);
                // Expose the sort key so the ordering can be verified/automated.
                itemEl.dataset.slot = String(idx);
                if (item.idx !== undefined) itemEl.dataset.idx = String(item.idx);
                if (item.size !== undefined) {
                    itemEl.dataset.size = String(item.size);
                    itemEl.style.setProperty('--order-item-size', `${item.size}px`);
                }

                // Position badges are useful for "put the steps in order" cards, but on
                // word-ordering cards a printed ۱..۴ reads as the answer. Only show the
                // badge when the labels are not already numbered by the content.
                if (showPositionBadges) {
                    const badge = document.createElement('span');
                    badge.className = 'order-step-num';
                    const faDigits = ['۱', '۲', '۳', '۴', '۵'];
                    badge.textContent = faDigits[idx] || (idx + 1);
                    itemEl.appendChild(badge);
                }

                if (item.img) {
                    const imgWrap = document.createElement('div');
                    imgWrap.className = 'order-step-visual';
                    imgWrap.style.maxHeight = round.answer === 'size' ? '104px' : '82px';
                    imgWrap.innerHTML = item.img;
                    itemEl.appendChild(imgWrap);
                }

                // Word tiles already render the word inside the artwork. Printing the
                // label underneath produced cards reading «بازی بازی» / «کرد کرد».
                const labelInsideArt = !!(item.img && item.label && String(item.img).includes(item.label));
                if (item.label && !labelInsideArt) {
                    const label = document.createElement('span');
                    label.style.fontSize = '12px';
                    label.style.fontWeight = '800';
                    // Several authored sequence labels started with «۱.»…«۴.»;
                    // those prefixes disclosed the complete answer before play.
                    label.textContent = String(item.label).replace(/^[۰-۹0-9]+\s*[.)،-]\s*/, '');
                    itemEl.appendChild(label);
                }

                itemEl.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        itemEl.click();
                    }
                });

                itemEl.addEventListener('click', () => {
                    AudioEngine.play('click');
                    if (selectedIndex === null) {
                        selectedIndex = idx;
                        status.textContent = 'کارت انتخاب شد؛ حالا جایگاهی را که باید با آن عوض شود بزن.';
                        renderRow();
                    } else if (selectedIndex === idx) {
                        selectedIndex = null;
                        renderRow();
                    } else {
                        undoStack.push(currentOrder.slice());
                        const temp = currentOrder[selectedIndex];
                        currentOrder[selectedIndex] = currentOrder[idx];
                        currentOrder[idx] = temp;
                        selectedIndex = null;
                        moves++;
                        status.textContent = `حرکت ${String(moves).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])}; ادامه بده.`;
                        AudioEngine.play('bubble');
                        renderRow();

                        // Auto-check on swap
                        if (isCorrectOrder() && !completed) {
                            completed = true;
                            status.textContent = 'آفرین! ترتیب درست پیدا شد.';
                            setTimeout(() => {
                                AudioEngine.play('correct');
                                if (cb && cb.onCorrect) cb.onCorrect(round, { moves, hintUsed });
                            }, 400);
                        }
                    }
                });

                row.appendChild(itemEl);
            });
        }

        renderRow();
        stage.appendChild(status);
        stage.appendChild(row);
        stage.appendChild(actions);

        // 3. Submit Action Button
        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn-primary-action';
        submitBtn.textContent = 'بررسی ترتیب';
        submitBtn.onclick = () => {
            if (completed) return;
            AudioEngine.play('click');
            if (isCorrectOrder() && !completed) {
                completed = true;
                status.textContent = 'آفرین! ترتیب درست پیدا شد.';
                AudioEngine.play('correct');
                setTimeout(() => {
                    if (cb && cb.onCorrect) cb.onCorrect(round, { moves, hintUsed });
                }, 500);
            } else {
                status.textContent = 'هنوز درست نیست؛ جایگاه ۱ از سمت راست شروع می‌شود.';
                AudioEngine.play('wrong');
                if (window.Fx) Fx.shake(row);
            }
        };

        stage.appendChild(submitBtn);
        container.appendChild(stage);
    }

    return { render };
})();

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

        setTimeout(() => {
            AudioEngine.speak(round.speech || round.prompt);
        }, 150);

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
        status.textContent = 'یک کارت را انتخاب کن، بعد جای کارت دوم را بزن.';

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
            const correctIndex = currentOrder.findIndex((item, index) => round.answer === 'idx' ? item.idx !== index : false);
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
            status.textContent = 'دوباره با آرامش شروع کن.';
            renderRow();
            AudioEngine.play('click');
        });

        function renderRow() {
            row.innerHTML = '';
            // Steps whose text already starts with «۱.» must NOT also get a slot badge,
            // otherwise the card reads «۱ ۱. کاشت دانه». And on word-ordering cards a
            // slot badge reads as the answer. So: never show slot badges here.
            const showPositionBadges = false;
            currentOrder.forEach((item, idx) => {
                const itemEl = document.createElement('div');
                itemEl.className = `order-step-card ${selectedIndex === idx ? 'selected' : ''}`;
                // Expose the sort key so the ordering can be verified/automated.
                itemEl.dataset.slot = String(idx);
                if (item.idx !== undefined) itemEl.dataset.idx = String(item.idx);
                if (item.size !== undefined) itemEl.dataset.size = String(item.size);

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
                    imgWrap.style.maxHeight = '70px';
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
                    label.textContent = item.label;
                    itemEl.appendChild(label);
                }

                itemEl.addEventListener('click', () => {
                    AudioEngine.play('click');
                    if (selectedIndex === null) {
                        selectedIndex = idx;
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
                AudioEngine.play('wrong');
                if (window.Fx) Fx.shake(row);
            }
        };

        stage.appendChild(submitBtn);
        container.appendChild(stage);
    }

    return { render };
})();

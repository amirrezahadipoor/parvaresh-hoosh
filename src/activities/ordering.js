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

        function checkCorrect() {
            if (round.answer === 'idx') {
                return currentOrder.every((item, i) => item.idx === i);
            }
            if (round.answer === 'size') {
                const sizes = currentOrder.map(it => it.size);
                const sorted = sizes.slice().sort((a, b) => a - b);
                return sizes.every((s, i) => s === sorted[i]);
            }
            return true;
        }

        function renderRow() {
            row.innerHTML = '';
            currentOrder.forEach((item, idx) => {
                const itemEl = document.createElement('div');
                itemEl.className = `order-step-card ${selectedIndex === idx ? 'selected' : ''}`;

                const badge = document.createElement('span');
                badge.className = 'order-step-num';
                const faDigits = ['۱', '۲', '۳', '۴', '۵'];
                badge.textContent = faDigits[idx] || (idx + 1);
                itemEl.appendChild(badge);

                if (item.img) {
                    const imgWrap = document.createElement('div');
                    imgWrap.style.maxHeight = '70px';
                    imgWrap.innerHTML = item.img;
                    itemEl.appendChild(imgWrap);
                }

                if (item.label) {
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
                        const temp = currentOrder[selectedIndex];
                        currentOrder[selectedIndex] = currentOrder[idx];
                        currentOrder[idx] = temp;
                        selectedIndex = null;
                        AudioEngine.play('bubble');
                        renderRow();

                        // Auto-check on swap
                        if (checkCorrect()) {
                            setTimeout(() => {
                                AudioEngine.play('correct');
                                if (cb && cb.onCorrect) cb.onCorrect(round);
                            }, 400);
                        }
                    }
                });

                row.appendChild(itemEl);
            });
        }

        renderRow();
        stage.appendChild(row);

        // 3. Submit Action Button
        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn-primary-action';
        submitBtn.textContent = 'بررسی ترتیب';
        submitBtn.onclick = () => {
            AudioEngine.play('click');
            if (checkCorrect()) {
                AudioEngine.play('correct');
                setTimeout(() => {
                    if (cb && cb.onCorrect) cb.onCorrect(round);
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

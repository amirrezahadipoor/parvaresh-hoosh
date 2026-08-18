// Ordering & Sequence Puzzle Engine for "پرورش هوش کودک"
window.OrderingActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'ordering-activity-card';

        // Header
        const headerRow = document.createElement('div');
        headerRow.className = 'activity-header-row';

        const promptTitle = document.createElement('h2');
        promptTitle.className = 'quiz-prompt';
        promptTitle.textContent = round.prompt || 'مراحل را به ترتیب درست بچین';

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

        // Interactive Sequence List
        const list = document.createElement('div');
        list.className = 'order-items-list';

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

        function renderList() {
            list.innerHTML = '';
            currentOrder.forEach((item, idx) => {
                const itemEl = document.createElement('div');
                itemEl.className = `order-item-card ${selectedIndex === idx ? 'selected' : ''}`;

                // Step Number Badge (Persian Numerals)
                const badge = document.createElement('span');
                badge.className = 'step-badge';
                const faDigits = ['۱', '۲', '۳', '۴', '۵'];
                badge.textContent = faDigits[idx] || (idx + 1);
                itemEl.appendChild(badge);

                if (item.img) {
                    const imgWrap = document.createElement('div');
                    imgWrap.className = 'order-item-img';
                    imgWrap.innerHTML = item.img;
                    itemEl.appendChild(imgWrap);
                }

                if (item.label) {
                    const label = document.createElement('span');
                    label.className = 'order-item-label';
                    label.textContent = item.label;
                    itemEl.appendChild(label);
                }

                // Tap to Swap / Reorder
                itemEl.addEventListener('click', () => {
                    AudioEngine.play('click');
                    if (selectedIndex === null) {
                        selectedIndex = idx;
                        renderList();
                    } else if (selectedIndex === idx) {
                        selectedIndex = null;
                        renderList();
                    } else {
                        // Swap
                        const temp = currentOrder[selectedIndex];
                        currentOrder[selectedIndex] = currentOrder[idx];
                        currentOrder[idx] = temp;
                        selectedIndex = null;
                        AudioEngine.play('bubble');
                        renderList();
                    }
                });

                list.appendChild(itemEl);
            });
        }

        renderList();
        card.appendChild(list);

        // Verification Button
        const submitBtn = document.createElement('button');
        submitBtn.className = 'big-action-btn';
        submitBtn.innerHTML = `<span>بررسی ترتیب</span>`;
        submitBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            if (checkCorrect()) {
                AudioEngine.play('correct');
                list.querySelectorAll('.order-item-card').forEach(el => el.classList.add('correct-state'));
                setTimeout(() => {
                    if (cb && cb.onCorrect) cb.onCorrect(round);
                }, 800);
            } else {
                AudioEngine.play('wrong');
                if (window.Fx) Fx.shake(list);
            }
        });

        card.appendChild(submitBtn);
        container.appendChild(card);
    }

    return { render };
})();

// 3D Memory Match Card Game for "پرورش هوش کودک"
window.MemoryActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'memory-activity-card';

        // Header
        const headerRow = document.createElement('div');
        headerRow.className = 'activity-header-row';

        const promptTitle = document.createElement('h2');
        promptTitle.className = 'quiz-prompt';
        promptTitle.textContent = 'جفت‌های مثل هم را پیدا کن';

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
            AudioEngine.speak(round.speech || 'جفت‌های مثل هم را پیدا کن');
        });

        headerRow.appendChild(promptTitle);
        headerRow.appendChild(speakerBtn);
        card.appendChild(headerRow);

        setTimeout(() => {
            AudioEngine.speak(round.speech || 'جفت‌های مثل هم را پیدا کن');
        }, 150);

        // Cards Grid
        const cardsList = round.cards || [];
        const grid = document.createElement('div');
        const count = cardsList.length;
        grid.className = `memory-cards-grid ${count <= 6 ? 'cols3' : 'cols4'}`;

        let flipped = [];
        let lock = false;
        let matchedPairs = 0;
        const totalPairs = count / 2;

        cardsList.forEach((c) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'memory-card-3d';
            cardItem.dataset.pairId = c.pair;

            cardItem.innerHTML = `
                <div class="card-flipper">
                    <div class="card-front">
                        <div class="mystery-pattern">؟</div>
                    </div>
                    <div class="card-back">
                        <div class="card-visual">${c.img}</div>
                        ${c.label ? `<span class="card-text">${c.label}</span>` : ''}
                    </div>
                </div>
            `;

            cardItem.addEventListener('click', () => {
                if (lock || cardItem.classList.contains('flipped') || cardItem.classList.contains('matched')) return;

                AudioEngine.play('click');
                cardItem.classList.add('flipped');
                flipped.push(cardItem);

                if (flipped.length === 2) {
                    lock = true;
                    const [c1, c2] = flipped;

                    if (c1.dataset.pairId === c2.dataset.pairId) {
                        // Matched!
                        setTimeout(() => {
                            AudioEngine.play('bubble');
                            AudioEngine.play('star');
                            c1.classList.add('matched');
                            c2.classList.add('matched');
                            if (window.Fx) {
                                Fx.pop(c1);
                                Fx.pop(c2);
                            }
                            flipped = [];
                            lock = false;
                            matchedPairs++;

                            if (matchedPairs >= totalPairs) {
                                setTimeout(() => {
                                    AudioEngine.play('correct');
                                    if (cb && cb.onCorrect) cb.onCorrect(round);
                                }, 600);
                            }
                        }, 400);
                    } else {
                        // Mismatch
                        setTimeout(() => {
                            AudioEngine.play('wrong');
                            if (window.Fx) {
                                Fx.shake(c1);
                                Fx.shake(c2);
                            }
                            setTimeout(() => {
                                c1.classList.remove('flipped');
                                c2.classList.remove('flipped');
                                flipped = [];
                                lock = false;
                            }, 500);
                        }, 700);
                    }
                }
            });

            grid.appendChild(cardItem);
        });

        card.appendChild(grid);
        container.appendChild(card);
    }

    return { render };
})();

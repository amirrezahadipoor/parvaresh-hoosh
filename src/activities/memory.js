// 3D Memory Match Card Game for "پرورش هوش کودک" (100% Fullscreen, Zero-Scroll)
window.MemoryActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const stage = document.createElement('div');
        stage.className = 'activity-fullscreen-stage';

        // 1. Top Prompt & Speaker
        const promptBanner = document.createElement('div');
        promptBanner.className = 'activity-prompt-banner';

        const promptText = document.createElement('div');
        promptText.className = 'activity-prompt-text';
        promptText.textContent = 'کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن!';

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
            AudioEngine.speak('کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن گل من!');
        };

        promptBanner.appendChild(promptText);
        promptBanner.appendChild(speakerBtn);
        stage.appendChild(promptBanner);

        setTimeout(() => {
            AudioEngine.speak('کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن گل من!');
        }, 150);

        // 2. Fullscreen Cards Grid (2 rows)
        const cardsList = round.cards || [];
        const count = cardsList.length;
        const grid = document.createElement('div');
        grid.className = `memory-grid-fullscreen ${count <= 6 ? 'cols3' : 'cols4'}`;

        let flipped = [];
        let lock = false;
        let matchedPairs = 0;
        const totalPairs = count / 2;

        cardsList.forEach((c) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'memory-card-3d-box';
            cardItem.dataset.pairId = c.pair;

            cardItem.innerHTML = `
                <div class="card-flipper-face card-flipper-front">؟</div>
                <div class="card-flipper-face card-flipper-back">
                    <div style="max-height:60px; display:flex; align-items:center; justify-content:center;">${c.img}</div>
                    ${c.label ? `<span style="font-size:11px; font-weight:800; margin-top:2px;">${c.label}</span>` : ''}
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
                                }, 500);
                            }
                        }, 350);
                    } else {
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
                            }, 450);
                        }, 600);
                    }
                }
            });

            grid.appendChild(cardItem);
        });

        stage.appendChild(grid);
        container.appendChild(stage);
    }

    return { render };
})();

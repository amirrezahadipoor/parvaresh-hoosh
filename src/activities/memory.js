// Memory Match activity with moves, progress and a limited visual hint.
window.MemoryActivity = (function() {
    function render(container, round, cb) {
        container.innerHTML = '';
        const stage = document.createElement('div');
        stage.className = 'activity-fullscreen-stage memory-activity-stage';

        const promptBanner = document.createElement('div');
        promptBanner.className = 'activity-prompt-banner';
        const promptText = document.createElement('div');
        promptText.className = 'activity-prompt-text';
        promptText.textContent = 'کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن!';
        const speakerBtn = document.createElement('button');
        speakerBtn.type = 'button';
        speakerBtn.className = 'activity-speaker-btn';
        speakerBtn.setAttribute('aria-label', 'شنیدن راهنمای بازی حافظه');
        speakerBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        speakerBtn.onclick = () => {
            AudioEngine.play('click');
            AudioEngine.speak('کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن گل من!');
        };
        promptBanner.appendChild(promptText);
        promptBanner.appendChild(speakerBtn);
        stage.appendChild(promptBanner);

        const cardsList = Array.isArray(round.cards) ? round.cards : [];
        const count = cardsList.length;
        const totalPairs = Math.floor(count / 2);
        const hud = document.createElement('div');
        hud.className = 'memory-hud';
        hud.innerHTML = '<span class="memory-stat">حرکت: <b id="memory-moves">۰</b></span><span class="memory-stat">جفت: <b id="memory-pairs">۰</b> از ' + String(totalPairs).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]) + '</span>';
        const hintBtn = document.createElement('button');
        hintBtn.type = 'button';
        hintBtn.className = 'memory-hint-btn';
        hintBtn.textContent = 'راهنما (۲)';
        hintBtn.setAttribute('aria-label', 'نمایش یک جفت برای مدت کوتاه');
        hud.appendChild(hintBtn);
        stage.appendChild(hud);

        const status = document.createElement('div');
        status.className = 'memory-status';
        status.textContent = 'با آرامش نگاه کن و جفت‌ها را پیدا کن.';
        stage.appendChild(status);

        const grid = document.createElement('div');
        grid.className = `memory-grid-fullscreen ${count <= 6 ? 'cols3' : 'cols4'}`;
        let flipped = [];
        let lock = false;
        let matchedPairs = 0;
        let moves = 0;
        let hints = 2;
        let completed = false;
        let active = true;
        const cards = [];

        function updateHud() {
            const movesEl = hud.querySelector('#memory-moves');
            const pairsEl = hud.querySelector('#memory-pairs');
            if (movesEl) movesEl.textContent = String(moves).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
            if (pairsEl) pairsEl.textContent = String(matchedPairs).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
        }

        function showHint() {
            if (!active || lock || hints <= 0) return;
            const unmatched = cards.filter(card => !card.classList.contains('matched'));
            const first = unmatched[0];
            if (!first) return;
            const second = unmatched.find(card => card !== first && card.dataset.pairId === first.dataset.pairId);
            if (!second) return;
            hints--;
            hintBtn.textContent = `راهنما (${String(hints).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])})`;
            hintBtn.disabled = hints <= 0;
            first.classList.add('hinted', 'flipped');
            second.classList.add('hinted', 'flipped');
            AudioEngine.play('bubble');
            status.textContent = 'این دو کارت یک جفت هستند؛ حالا خودت پیدا کن!';
            setTimeout(() => {
                if (!active) return;
                [first, second].forEach(card => {
                    if (!card.classList.contains('matched')) card.classList.remove('hinted', 'flipped');
                });
                status.textContent = 'حالا نوبت توست.';
            }, 900);
        }
        hintBtn.addEventListener('click', showHint);

        function finish() {
            if (completed) return;
            completed = true;
            active = false;
            hintBtn.disabled = true;
            status.textContent = `آفرین! با ${String(moves).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])} حرکت همهٔ جفت‌ها پیدا شد.`;
            AudioEngine.play('correct');
            if (window.Fx) Fx.confetti(stage, 28);
            setTimeout(() => {
                if (cb && cb.onCorrect) cb.onCorrect(round, { moves, hintsUsed: 2 - hints });
            }, 700);
        }

        function activateCard(cardItem) {
            if (!active || lock || cardItem.classList.contains('flipped') || cardItem.classList.contains('matched') || cardItem.classList.contains('hinted')) return;
            AudioEngine.play('click');
            cardItem.classList.add('flipped');
            flipped.push(cardItem);
            if (flipped.length !== 2) return;

            moves++;
            updateHud();
            lock = true;
            const [first, second] = flipped;
            if (first.dataset.pairId === second.dataset.pairId) {
                setTimeout(() => {
                    if (!active && !completed) return;
                    first.classList.add('matched');
                    second.classList.add('matched');
                    flipped = [];
                    lock = false;
                    matchedPairs++;
                    updateHud();
                    status.textContent = 'یک جفت درست پیدا شد!';
                    AudioEngine.play('star');
                    if (window.Fx) { Fx.pop(first); Fx.pop(second); }
                    if (matchedPairs >= totalPairs) finish();
                }, 320);
            } else {
                setTimeout(() => {
                    AudioEngine.play('wrong');
                    if (window.Fx) { Fx.shake(first); Fx.shake(second); }
                    setTimeout(() => {
                        if (!active) return;
                        first.classList.remove('flipped');
                        second.classList.remove('flipped');
                        flipped = [];
                        lock = false;
                        status.textContent = 'اشکالی ندارد؛ جای کارت‌ها را به خاطر بسپار.';
                    }, 450);
                }, 500);
            }
        }

        cardsList.forEach(card => {
            const cardItem = document.createElement('div');
            cardItem.className = 'memory-card-3d-box';
            cardItem.dataset.pairId = card.pair;
            cardItem.setAttribute('role', 'button');
            cardItem.setAttribute('tabindex', '0');
            cardItem.setAttribute('aria-label', 'کارت پنهان حافظه');
            cardItem.innerHTML = `
                <div class="card-flipper-face card-flipper-front">؟</div>
                <div class="card-flipper-face card-flipper-back">
                    <div class="memory-card-image">${card.img}</div>
                    ${card.label ? `<span class="memory-card-label">${card.label}</span>` : ''}
                </div>
            `;
            cardItem.addEventListener('click', () => activateCard(cardItem));
            cardItem.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activateCard(cardItem);
                }
            });
            cards.push(cardItem);
            grid.appendChild(cardItem);
        });

        stage.appendChild(grid);
        container.appendChild(stage);
        setTimeout(() => AudioEngine.speak('کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن گل من!'), 150);
    }

    return { render };
})();

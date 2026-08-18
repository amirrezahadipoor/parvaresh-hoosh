// Fun Balloon Pop Interactive Mini-Game for "پرورش هوش کودک"
window.BalloonPopActivity = (function() {

    const BALLOON_COLORS = ['#FF4757', '#FFA502', '#2ED573', '#1E90FF', '#9B59B6', '#FF6B81', '#00D2D3'];

    function render(container, round, cb) {
        container.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'balloon-activity-card';

        // Header
        const headerRow = document.createElement('div');
        headerRow.className = 'activity-header-row';

        const promptTitle = document.createElement('h2');
        promptTitle.className = 'quiz-prompt';
        promptTitle.textContent = round.prompt || 'بادکنک‌ها را بترکان و صداهایشان را بشنو!';

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
            AudioEngine.speak(round.speech || 'بادکنک‌ها را لمس کن تا بترکند!');
        });

        headerRow.appendChild(promptTitle);
        headerRow.appendChild(speakerBtn);
        card.appendChild(headerRow);

        const targetText = round.targetText || null;
        const targetHint = document.createElement('div');
        targetHint.className = 'balloon-target-hint';
        targetHint.textContent = targetText ? `هدف: فقط «${targetText}»` : 'همهٔ بادکنک‌ها را لمس کن';
        card.appendChild(targetHint);

        setTimeout(() => {
            AudioEngine.speak(round.speech || 'بادکنک‌ها را لمس کن تا بترکند!');
        }, 150);

        // Stage where balloons float
        const stage = document.createElement('div');
        stage.className = 'balloon-stage';

        const items = round.items || [
            { text: 'الف', sound: 'صدای آ' },
            { text: 'ب', sound: 'صدای ب' },
            { text: 'پ', sound: 'صدای پ' },
            { text: 'ت', sound: 'صدای ت' },
            { text: 'ث', sound: 'صدای ث' }
        ];

        let poppedCount = 0;
        let correctPopped = 0;
        let completed = false;
        const totalBalloons = targetText ? items.filter(item => item.text === targetText).length : items.length;

        items.forEach((item, idx) => {
            const b = document.createElement('div');
            b.className = 'floating-balloon';
            const color = BALLOON_COLORS[idx % BALLOON_COLORS.length];
            b.style.setProperty('--bcolor', color);

            b.innerHTML = `
                <div class="balloon-body" style="background:${color};">
                    <span class="balloon-text">${item.text}</span>
                    <div class="balloon-knot" style="border-top-color:${color};"></div>
                    <div class="balloon-string"></div>
                </div>
            `;

            b.setAttribute('role', 'button');
            b.setAttribute('tabindex', '0');
            b.setAttribute('aria-label', `بادکنک ${item.text}`);
            const pop = () => {
                if (completed || b.classList.contains('popped')) return;
                if (targetText && item.text !== targetText) {
                    AudioEngine.play('wrong');
                    targetHint.textContent = `این یکی هدف نیست؛ «${targetText}» را پیدا کن.`;
                    if (window.Fx) Fx.shake(b);
                    return;
                }
                b.classList.add('popped');
                AudioEngine.play('pop');
                AudioEngine.speak(item.sound || item.text);

                if (window.Fx) {
                    Fx.pop(b);
                    Fx.stars(stage, 4);
                }

                poppedCount++;
                if (targetText) correctPopped++;
                if (poppedCount >= totalBalloons || (targetText && correctPopped >= totalBalloons)) {
                    completed = true;
                    targetHint.textContent = 'آفرین! هدف را درست پیدا کردی.';
                    setTimeout(() => {
                        AudioEngine.play('correct');
                        if (cb && cb.onCorrect) cb.onCorrect(round);
                    }, 800);
                }
            };
            b.addEventListener('click', pop);
            b.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    pop();
                }
            });

            stage.appendChild(b);
        });

        card.appendChild(stage);
        container.appendChild(card);
    }

    return { render };
})();

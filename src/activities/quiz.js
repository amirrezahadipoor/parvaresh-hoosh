// Interactive Multiple-Choice Quiz Engine for "پرورش هوش کودک"
window.QuizActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'quiz-card';

        // Header with Voice Narration Button
        const headerRow = document.createElement('div');
        headerRow.className = 'activity-header-row';

        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'speaker-btn';
        speakerBtn.setAttribute('aria-label', 'پخش مجدد صدا');
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

        const promptText = document.createElement('h2');
        promptText.className = 'quiz-prompt';
        promptText.textContent = round.prompt;

        headerRow.appendChild(promptText);
        headerRow.appendChild(speakerBtn);
        card.appendChild(headerRow);

        // Visual Illustration if present
        if (round.img) {
            const visualWrap = document.createElement('div');
            visualWrap.className = 'quiz-visual';
            visualWrap.innerHTML = round.img;
            card.appendChild(visualWrap);
        }

        // Auto-play voice narration
        setTimeout(() => {
            AudioEngine.speak(round.speech || round.prompt);
        }, 150);

        // Options Grid
        const grid = document.createElement('div');
        const count = (round.options || []).length;
        grid.className = `options-grid ${count <= 2 ? 'cols2' : count === 3 ? 'cols3' : 'cols2'}`;

        let answered = false;

        round.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';

            if (opt.img) {
                const imgSpan = document.createElement('span');
                imgSpan.className = 'opt-img';
                imgSpan.innerHTML = opt.img;
                btn.appendChild(imgSpan);
            }

            if (opt.label) {
                const labelSpan = document.createElement('span');
                labelSpan.className = `opt-label ${opt.big ? 'big-font' : ''}`;
                labelSpan.textContent = opt.label;
                btn.appendChild(labelSpan);
            }

            btn.addEventListener('click', () => {
                if (answered) return;
                AudioEngine.play('click');

                if (idx === round.answer) {
                    answered = true;
                    btn.classList.add('correct');
                    if (window.Fx) Fx.pop(btn);
                    if (cb && cb.onCorrect) cb.onCorrect(round, { selectedIdx: idx });
                } else {
                    btn.classList.add('wrong');
                    if (window.Fx) Fx.shake(btn);
                    if (cb && cb.onWrong) cb.onWrong(round, { selectedIdx: idx });
                    setTimeout(() => {
                        btn.classList.remove('wrong');
                    }, 800);
                }
            });

            grid.appendChild(btn);
        });

        card.appendChild(grid);
        container.appendChild(card);
    }

    return { render };
})();

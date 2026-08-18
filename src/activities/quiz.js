// Interactive Multiple-Choice Quiz Engine for "پرورش هوش کودک" (100% Fullscreen, Zero-Scroll)
window.QuizActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const stage = document.createElement('div');
        stage.className = 'activity-fullscreen-stage';

        // 1. Top Prompt & Speaker
        const promptBanner = document.createElement('div');
        promptBanner.className = 'activity-prompt-banner';

        const promptText = document.createElement('div');
        promptText.className = 'activity-prompt-text';
        promptText.textContent = round.prompt;

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

        // Auto-play voice narration
        setTimeout(() => {
            AudioEngine.speak(round.speech || round.prompt);
        }, 150);

        // 2. Center Visual Stage
        const visualStage = document.createElement('div');
        visualStage.className = 'activity-visual-stage';
        if (round.img) {
            visualStage.innerHTML = round.img;
        }
        stage.appendChild(visualStage);

        // 3. Bottom Options Stage
        const optionsStage = document.createElement('div');
        const count = (round.options || []).length;
        optionsStage.className = `activity-options-stage ${count <= 2 ? 'cols2' : count === 3 ? 'cols3' : 'cols2'}`;

        let answered = false;

        round.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = `game-tap-choice-btn ${opt.big ? 'big-font' : ''}`;

            if (opt.img) {
                const imgWrap = document.createElement('span');
                imgWrap.className = 'game-option-art';
                imgWrap.innerHTML = opt.img;
                btn.appendChild(imgWrap);
            }

            if (opt.label) {
                const label = document.createElement('span');
                label.textContent = opt.label;
                btn.appendChild(label);
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
                    }, 600);
                }
            });

            optionsStage.appendChild(btn);
        });

        stage.appendChild(optionsStage);
        container.appendChild(stage);
    }

    return { render };
})();

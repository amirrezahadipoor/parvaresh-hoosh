// Quiz activity renderer (multiple choice)
const QuizActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';
        
        // Title + instruction
        const title = document.createElement('div');
        title.className = 'activity-title';
        title.textContent = 'سوال';
        container.appendChild(title);

        // Prompt card
        const card = document.createElement('div');
        card.className = 'prompt-card';
        if (round.img) {
            const imgDiv = document.createElement('div');
            imgDiv.className = 'prompt-img';
            imgDiv.innerHTML = round.img;
            card.appendChild(imgDiv);
        }
        const p = document.createElement('div');
        p.className = 'prompt-big';
        p.textContent = round.prompt;
        card.appendChild(p);
        container.appendChild(card);

        // Speak instruction
        AudioEngine.speak(round.speech || round.prompt);

        // Options
        const grid = document.createElement('div');
        grid.className = 'options-grid cols' + (round.options.length <= 3 ? round.options.length : 2);
        
        let answered = false;
        round.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            if (opt.big) { btn.style.fontSize = '42px'; }
            if (opt.img) {
                const wrap = document.createElement('span');
                wrap.innerHTML = opt.img;
                btn.appendChild(wrap);
            }
            if (opt.label) {
                const span = document.createElement('span');
                span.textContent = opt.label;
                btn.appendChild(span);
            }
            btn.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                const correct = idx === round.answer;
                if (correct) {
                    btn.classList.add('correct');
                    AudioEngine.play('correct');
                    Fx.pop(btn);
                    setTimeout(() => cb.onCorrect(round), 700);
                } else {
                    btn.classList.add('wrong');
                    AudioEngine.play('wrong');
                    Fx.shake(btn);
                    // reveal correct
                    const correctBtn = grid.children[round.answer];
                    if (correctBtn) correctBtn.classList.add('correct');
                    setTimeout(() => cb.onWrong(round), 1200);
                }
            });
            grid.appendChild(btn);
        });
        container.appendChild(grid);
    }

    return { render };
})();

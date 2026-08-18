// Memory match activity renderer
const MemoryActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'activity-title';
        title.textContent = 'جفت‌های مثل هم';
        container.appendChild(title);

        const instr = document.createElement('div');
        instr.className = 'activity-instr';
        instr.textContent = 'کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن';
        container.appendChild(instr);

        AudioEngine.speak('جفت‌های مثل هم را پیدا کن');

        const cards = round.cards;
        const cols = cards.length <= 6 ? 3 : (cards.length <= 8 ? 4 : 4);
        const grid = document.createElement('div');
        grid.className = 'memory-grid c' + cols;

        const flipped = [];
        let lock = false;
        let matchedCount = 0;
        let attempts = 0;

        const faceEls = [];
        cards.forEach((c, i) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.pair = c.pair;
            card.innerHTML = '<span>؟</span>';
            const face = document.createElement('div');
            face.className = 'mem-icon';
            face.style.display = 'none';
            face.innerHTML = c.img;
            card.appendChild(face);
            grid.appendChild(card);

            card.addEventListener('click', () => {
                if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
                AudioEngine.play('pop');
                card.classList.add('flipped');
                card.innerHTML = '';
                card.appendChild(face);
                face.style.display = 'flex';
                flipped.push(card);
                if (flipped.length === 2) {
                    lock = true;
                    attempts++;
                    const [a, b] = flipped;
                    setTimeout(() => {
                        if (a.dataset.pair === b.dataset.pair) {
                            a.classList.add('matched');
                            b.classList.add('matched');
                            matchedCount++;
                            AudioEngine.play('correct');
                            if (matchedCount === cards.length / 2) {
                                setTimeout(() => cb.onCorrect(round, attempts), 600);
                            } else {
                                setTimeout(() => { lock = false; }, 400);
                            }
                        } else {
                            AudioEngine.play('wrong');
                            setTimeout(() => {
                                a.classList.remove('flipped');
                                b.classList.remove('flipped');
                                a.innerHTML = '<span>؟</span>';
                                b.innerHTML = '<span>؟</span>';
                                lock = false;
                            }, 700);
                        }
                        flipped.length = 0;
                    }, 450);
                }
            });
        });
        container.appendChild(grid);
    }

    return { render };
})();

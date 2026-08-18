// Ordering activity renderer (size order, story steps, word order)
const OrderingActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'activity-title';
        title.textContent = 'مرتب کن';
        container.appendChild(title);

        const instr = document.createElement('div');
        instr.className = 'activity-instr';
        instr.textContent = round.prompt || 'به ترتیب درست بچین';
        container.appendChild(instr);

        AudioEngine.speak(round.speech || 'به ترتیب درست بچین');

        const list = document.createElement('div');
        list.className = 'order-list';

        let currentOrder = round.items.slice();
        let lock = false;

        function isCorrect() {
            if (round.answer === 'idx') {
                return currentOrder.every((it, i) => it.idx === i);
            }
            // size ordering ascending
            const sizes = currentOrder.map(it => it.size);
            const sorted = sizes.slice().sort((a, b) => a - b);
            return sizes.every((s, i) => s === sorted[i]);
        }

        function draw() {
            list.innerHTML = '';
            currentOrder.forEach((item, idx) => {
                const el = document.createElement('div');
                el.className = 'order-item';
                el.dataset.pos = idx;
                if (item.img) {
                    // Inject size class for visibility differentiation
                    let img = item.img;
                    if (item.size) img = img.replace('<svg ', '<svg class="size-' + item.size + '" ');
                    el.innerHTML = img;
                }
                const label = document.createElement('span');
                label.style.flex = '1';
                label.textContent = item.label || '';
                el.appendChild(label);
                const num = document.createElement('span');
                num.className = 'order-num';
                num.textContent = String(idx + 1);
                el.appendChild(num);
                list.appendChild(el);
            });

            // Tap-tap swap
            let selected = null;
            list.querySelectorAll('.order-item').forEach(el => {
                el.addEventListener('click', () => {
                    if (lock) return;
                    if (!selected) {
                        selected = el;
                        el.style.borderColor = 'var(--btn)';
                        AudioEngine.play('click');
                        return;
                    }
                    if (selected === el) {
                        selected.style.borderColor = '';
                        selected = null;
                        return;
                    }
                    // swap
                    const a = parseInt(selected.dataset.pos, 10);
                    const b = parseInt(el.dataset.pos, 10);
                    [currentOrder[a], currentOrder[b]] = [currentOrder[b], currentOrder[a]];
                    selected.style.borderColor = '';
                    selected = null;
                    AudioEngine.play('drop');
                    draw();
                    if (isCorrect() && !lock) {
                        lock = true;
                        AudioEngine.play('correct');
                        list.querySelectorAll('.order-item').forEach((itemEl, i) => {
                            itemEl.classList.add('placed-correct');
                            itemEl.style.transitionDelay = (i * 0.12) + 's';
                        });
                        setTimeout(() => cb.onCorrect(round), 700);
                    }
                });
            });
        }

        draw();
        container.appendChild(list);
    }

    return { render };
})();

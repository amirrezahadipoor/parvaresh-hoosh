// Tracing activity renderer (finger writing on canvas)
const TracingActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'activity-title';
        title.textContent = round.kind === 'letter' ? 'نوشتن حرف' : 'نوشتن عدد';
        container.appendChild(title);

        const instr = document.createElement('div');
        instr.className = 'activity-instr';
        instr.textContent = 'با انگشتت روی خط‌ها بکش';
        container.appendChild(instr);

        AudioEngine.speak('با انگشتت ' + (round.kind === 'letter' ? 'حرف ' : 'عدد ') + round.char + ' را بنویس');

        const wrap = document.createElement('div');
        wrap.className = 'trace-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'trace-canvas';
        const size = Math.min(window.innerWidth - 60, 340);
        canvas.width = size;
        canvas.height = size * 0.8;
        const ctx = canvas.getContext('2d');

        // Draw ghost character
        function drawGhost() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '900 ' + (canvas.height * 0.62) + 'px Vazirmatn, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#E4E4E4';
            ctx.fillText(round.char, canvas.width / 2, canvas.height / 2 + canvas.height * 0.02);
            // dashed guide line
            ctx.strokeStyle = '#CCC';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            ctx.moveTo(20, canvas.height - 20);
            ctx.lineTo(canvas.width - 20, canvas.height - 20);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        drawGhost();

        // Pointer drawing
        let drawing = false;
        let lastX = 0, lastY = 0;

        function pos(e) {
            const r = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - r.left) * (canvas.width / r.width),
                y: (e.clientY - r.top) * (canvas.height / r.height)
            };
        }

        canvas.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            drawing = true;
            const p = pos(e);
            lastX = p.x; lastY = p.y;
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#6C5CE7';
        });
        canvas.addEventListener('pointermove', (e) => {
            if (!drawing) return;
            const p = pos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            lastX = p.x; lastY = p.y;
        });
        canvas.addEventListener('pointerup', () => { drawing = false; });
        canvas.addEventListener('pointerleave', () => { drawing = false; });

        // Controls
        const controls = document.createElement('div');
        controls.className = 'trace-controls';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'big-btn';
        clearBtn.style.background = '#95A5A6';
        clearBtn.style.flex = '1';
        clearBtn.textContent = 'پاک کن';
        clearBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            drawGhost();
        });

        const doneBtn = document.createElement('button');
        doneBtn.className = 'big-btn green';
        doneBtn.style.flex = '1';
        doneBtn.textContent = 'تمام شد';
        doneBtn.addEventListener('click', () => {
            // coverage check: colored pixels
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let colored = 0;
            for (let i = 0; i < data.length; i += 4) {
                // skip gray ghost pixels
                const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                if (a > 100 && !(r > 200 && g > 200 && b > 200) && !(r > 215 && g > 215 && b > 215)) colored++;
            }
            if (colored > 800) {
                AudioEngine.play('correct');
                AudioEngine.play('win');
                cb.onCorrect(round);
            } else {
                AudioEngine.play('wrong');
                AudioEngine.speak('کمی بیشتر تمرین کن');
                Fx.shake(wrap);
                cb.onWrong(round);
            }
        });

        controls.appendChild(clearBtn);
        controls.appendChild(doneBtn);

        wrap.appendChild(canvas);
        wrap.appendChild(controls);
        container.appendChild(wrap);
    }

    return { render };
})();

// Free drawing / coloring activity
const PaintingActivity = (function() {

    const COLORS = ['#FF6B6B', '#F9CA24', '#4ECDC4', '#A29BFE', '#00B894', '#2D3436', '#F368E0', '#FF8A5C', '#74B9FF', '#FFF'];

    function render(container, round, cb) {
        container.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'activity-title';
        title.textContent = 'نقاشي آزاد';
        container.appendChild(title);

        const instr = document.createElement('div');
        instr.className = 'activity-instr';
        instr.textContent = 'هر چه دوست داري بکش!';
        container.appendChild(instr);

        AudioEngine.speak('هر چه دوست داري بکش');

        // Toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'paint-toolbar';
        let activeColor = '#FF6B6B';
        COLORS.forEach(c => {
            const b = document.createElement('button');
            b.className = 'paint-color' + (c === activeColor ? ' active' : '');
            b.style.background = c;
            b.style.borderColor = c === '#FFF' ? '#CCC' : '#FFF';
            b.addEventListener('click', () => {
                activeColor = c;
                toolbar.querySelectorAll('.paint-color').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                AudioEngine.play('click');
            });
            toolbar.appendChild(b);
        });
        container.appendChild(toolbar);

        // Eraser / clear
        const clearBtn = document.createElement('button');
        clearBtn.className = 'big-btn';
        clearBtn.style.background = '#95A5A6';
        clearBtn.style.padding = '10px';
        clearBtn.textContent = 'پاک کن';
        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            AudioEngine.play('click');
        });
        toolbar.appendChild(clearBtn);

        // Canvas
        const wrap = document.createElement('div');
        wrap.className = 'paint-canvas-wrap';
        const canvas = document.createElement('canvas');
        canvas.className = 'paint-canvas';
        const size = Math.min(window.innerWidth - 80, 360);
        canvas.width = size;
        canvas.height = size * 0.85;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        wrap.appendChild(canvas);
        container.appendChild(wrap);

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
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = activeColor;
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

        // Done button
        const doneBtn = document.createElement('button');
        doneBtn.className = 'big-btn green';
        doneBtn.textContent = 'تمام شد';
        doneBtn.addEventListener('click', () => {
            // any drawn pixels?
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let drawn = 0;
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] < 250 || data[i+1] < 250 || data[i+2] < 250) drawn++;
            }
            if (drawn > 600) {
                AudioEngine.play('win');
                cb.onCorrect(round);
            } else {
                AudioEngine.play('wrong');
                AudioEngine.speak('يک کم بيشتر نقاشي کن');
            }
        });
        container.appendChild(doneBtn);
    }

    return { render };
})();

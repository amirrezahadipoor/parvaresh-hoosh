// Creative Canvas, Coloring & Stamp Workshop for "پرورش هوش کودک" - ZERO EMOJIS
window.PaintingActivity = (function() {

    const PALETTE = [
        '#FF4757', '#FFA502', '#2ED573', '#1E90FF', '#9B59B6',
        '#FF6B81', '#F1C40F', '#00D2D3', '#3742FA', '#2C3A47',
        '#795548', '#FFFFFF'
    ];

    function getTemplates() {
        const art = window.SvgArt || { animal: () => '', object: () => '' };
        return [
            { id: 'free', name: 'نقاشی آزاد' },
            { id: 'cat', name: 'رنگ‌آمیزی گربه', svg: art.animal('cat', 180) },
            { id: 'butterfly', name: 'رنگ‌آمیزی پروانه', svg: art.animal('butterfly', 180) },
            { id: 'fish', name: 'رنگ‌آمیزی ماهی', svg: art.animal('fish', 180) },
            { id: 'car', name: 'رنگ‌آمیزی ماشین', svg: art.object('car', 180) },
            { id: 'flower', name: 'رنگ‌آمیزی گل', svg: art.object('flower', 180) }
        ];
    }

    function render(container, round, cb) {
        container.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'painting-activity-card';

        // Header
        const headerRow = document.createElement('div');
        headerRow.className = 'activity-header-row';

        const promptTitle = document.createElement('h2');
        promptTitle.className = 'quiz-prompt';
        promptTitle.textContent = 'کارگاه نقاشی و رنگ‌آمیزی خلاق';

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
            AudioEngine.speak('هر چی دوست داری با رنگ‌های شاد نقاشی کن گل من!');
        });

        headerRow.appendChild(promptTitle);
        headerRow.appendChild(speakerBtn);
        card.appendChild(headerRow);

        setTimeout(() => {
            AudioEngine.speak('هر چی دوست داری با رنگ‌های شاد نقاشی کن گل من!');
        }, 150);

        // Color Palette Toolbar
        let currentColor = PALETTE[0];
        let currentBrushSize = 10;
        let isEraser = false;
        let isRainbow = false;
        let currentStamp = null;

        const paletteBar = document.createElement('div');
        paletteBar.className = 'paint-palette-bar';

        PALETTE.forEach(color => {
            const swatch = document.createElement('button');
            swatch.className = `palette-swatch ${color === currentColor ? 'active' : ''}`;
            swatch.style.backgroundColor = color;
            swatch.addEventListener('click', () => {
                AudioEngine.play('click');
                currentColor = color;
                isEraser = false;
                isRainbow = false;
                currentStamp = null;
                paletteBar.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
            });
            paletteBar.appendChild(swatch);
        });

        // Tools Bar with clean labels
        const toolsBar = document.createElement('div');
        toolsBar.className = 'paint-tools-bar';

        const rainbowBtn = document.createElement('button');
        rainbowBtn.className = 'tool-btn';
        rainbowBtn.innerHTML = 'قلم جادویی';
        rainbowBtn.addEventListener('click', () => {
            AudioEngine.play('bubble');
            isRainbow = true;
            isEraser = false;
            currentStamp = null;
            paletteBar.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
        });

        const stampStar = document.createElement('button');
        stampStar.className = 'tool-btn';
        stampStar.innerHTML = 'مهر ستاره';
        stampStar.addEventListener('click', () => {
            AudioEngine.play('pop');
            currentStamp = 'star';
            isEraser = false;
            isRainbow = false;
        });

        const stampHeart = document.createElement('button');
        stampHeart.className = 'tool-btn';
        stampHeart.innerHTML = 'مهر قلب';
        stampHeart.addEventListener('click', () => {
            AudioEngine.play('pop');
            currentStamp = 'heart';
            isEraser = false;
            isRainbow = false;
        });

        const clearBtn = document.createElement('button');
        clearBtn.className = 'tool-btn danger';
        clearBtn.innerHTML = 'پاک کردن';
        clearBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            initCanvas();
        });

        toolsBar.appendChild(rainbowBtn);
        toolsBar.appendChild(stampStar);
        toolsBar.appendChild(stampHeart);
        toolsBar.appendChild(clearBtn);

        card.appendChild(paletteBar);
        card.appendChild(toolsBar);

        // Canvas Area
        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'paint-canvas-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'paint-canvas';
        const width = Math.min(window.innerWidth - 48, 380);
        const height = Math.min(window.innerHeight * 0.44, 280);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        function initCanvas() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
        }

        initCanvas();

        let isDrawing = false;
        let strokeHue = 0;

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function startPaint(e) {
            e.preventDefault();
            const pos = getPos(e);

            if (currentStamp) {
                ctx.fillStyle = currentColor;
                if (currentStamp === 'star') {
                    // Draw Star
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        ctx.lineTo(Math.cos((18 + i * 72) * 0.01745) * 16 + pos.x, -Math.sin((18 + i * 72) * 0.01745) * 16 + pos.y);
                        ctx.lineTo(Math.cos((54 + i * 72) * 0.01745) * 8 + pos.x, -Math.sin((54 + i * 72) * 0.01745) * 8 + pos.y);
                    }
                    ctx.closePath();
                    ctx.fill();
                } else if (currentStamp === 'heart') {
                    ctx.beginPath();
                    ctx.arc(pos.x - 6, pos.y - 4, 8, 0, Math.PI * 2);
                    ctx.arc(pos.x + 6, pos.y - 4, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
                AudioEngine.play('pop');
                return;
            }

            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineWidth = isEraser ? 24 : currentBrushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = isEraser ? '#FFFFFF' : isRainbow ? `hsl(${strokeHue}, 90%, 60%)` : currentColor;
            AudioEngine.play('paint');
        }

        function paint(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);

            if (isRainbow) {
                strokeHue = (strokeHue + 7) % 360;
                ctx.strokeStyle = `hsl(${strokeHue}, 90%, 60%)`;
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            } else {
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }
        }

        function stopPaint() {
            isDrawing = false;
        }

        canvas.addEventListener('mousedown', startPaint);
        canvas.addEventListener('mousemove', paint);
        window.addEventListener('mouseup', stopPaint);

        canvas.addEventListener('touchstart', startPaint, { passive: false });
        canvas.addEventListener('touchmove', paint, { passive: false });
        window.addEventListener('touchend', stopPaint);

        canvasWrap.appendChild(canvas);
        card.appendChild(canvasWrap);

        // Completion / Next Button
        const finishBtn = document.createElement('button');
        finishBtn.className = 'big-action-btn primary';
        finishBtn.innerHTML = `<span>نقاشی من تمام شد!</span>`;
        finishBtn.addEventListener('click', () => {
            AudioEngine.play('win');
            if (window.Fx) Fx.confetti();
            setTimeout(() => {
                if (cb && cb.onCorrect) cb.onCorrect(round);
            }, 800);
        });

        card.appendChild(finishBtn);
        container.appendChild(card);
    }

    return { render, getTemplates };
})();

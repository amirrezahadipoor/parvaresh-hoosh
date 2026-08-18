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
        let currentTemplate = null;
        const undoStack = [];

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

        const eraserBtn = document.createElement('button');
        eraserBtn.className = 'tool-btn';
        eraserBtn.textContent = 'پاک‌کن';
        eraserBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            isEraser = true;
            isRainbow = false;
            currentStamp = null;
            paletteBar.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
        });

        const brushBtn = document.createElement('button');
        brushBtn.className = 'tool-btn';
        brushBtn.textContent = 'قلم متوسط';
        brushBtn.addEventListener('click', () => {
            currentBrushSize = currentBrushSize >= 18 ? 10 : 18;
            brushBtn.textContent = currentBrushSize >= 18 ? 'قلم ضخیم' : 'قلم متوسط';
            isEraser = false;
            AudioEngine.play('click');
        });

        const undoBtn = document.createElement('button');
        undoBtn.className = 'tool-btn';
        undoBtn.textContent = 'برگشت';
        undoBtn.addEventListener('click', () => {
            if (!ctx || !ctx.putImageData || !undoStack.length) return;
            AudioEngine.play('click');
            const snap = undoStack.pop();
            // putImageData ignores the current transform, so reset it, restore the
            // device-pixel snapshot, then re-apply the dpr scale for future strokes.
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.putImageData(snap.data || snap, 0, 0);
            ctx.setTransform(snap.dpr || 1, 0, 0, snap.dpr || 1, 0, 0);
        });

        const clearBtn = document.createElement('button');
        clearBtn.className = 'tool-btn danger';
        clearBtn.textContent = 'پاک کردن';
        clearBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            undoStack.length = 0;
            applyTemplate();
        });

        toolsBar.appendChild(rainbowBtn);
        toolsBar.appendChild(stampStar);
        toolsBar.appendChild(stampHeart);
        toolsBar.appendChild(eraserBtn);
        toolsBar.appendChild(brushBtn);
        toolsBar.appendChild(undoBtn);
        toolsBar.appendChild(clearBtn);

        const templateBar = document.createElement('div');
        templateBar.className = 'paint-template-bar';
        templateBar.setAttribute('aria-label', 'قالب نقاشی');
        getTemplates().forEach(template => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'paint-template-btn';
            button.title = template.name;
            button.innerHTML = template.svg || '<span>آزاد</span>';
            button.addEventListener('click', () => {
                currentTemplate = template;
                templateBar.querySelectorAll('.paint-template-btn').forEach(item => item.classList.remove('active'));
                button.classList.add('active');
                applyTemplate();
                AudioEngine.play('bubble');
            });
            templateBar.appendChild(button);
            if (template.id === 'free') button.classList.add('active');
        });

        card.appendChild(paletteBar);
        card.appendChild(toolsBar);
        card.appendChild(templateBar);

        // Canvas Area
        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'paint-canvas-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'paint-canvas';
        // Bigger sheet: the old canvas used only ~44% of the height and capped at
        // 280px, leaving the workshop feeling cramped on a phone.
        const width = Math.min(window.innerWidth - 24, 560);
        const height = Math.min(Math.max(window.innerHeight * 0.62, 320), 620);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        function initCanvas() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
        }

        function applyTemplate() {
            initCanvas();
            if (!currentTemplate || !currentTemplate.svg || !window.Image) return;
            const image = new Image();
            image.onload = () => {
                ctx.globalAlpha = 0.24;
                ctx.drawImage(image, width * 0.18, height * 0.08, width * 0.64, height * 0.78);
                ctx.globalAlpha = 1;
            };
            image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(currentTemplate.svg)}`;
        }

        function saveSnapshot() {
            if (!ctx.getImageData) return;
            try {
                undoStack.push({ data: ctx.getImageData(0, 0, canvas.width, canvas.height), dpr });
                if (undoStack.length > 12) undoStack.shift();
            } catch (e) {}
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
            saveSnapshot();

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

        // Save-to-gallery button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'action-pill-btn paint-save-btn';
        saveBtn.textContent = 'ذخیره در گالری';
        saveBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            try {
                const dataUrl = canvas.toDataURL('image/png');
                const saved = JSON.parse(localStorage.getItem('ph_gallery') || '[]');
                saved.unshift({ img: dataUrl, at: Date.now() });
                localStorage.setItem('ph_gallery', JSON.stringify(saved.slice(0, 12)));
                saveBtn.textContent = 'ذخیره شد ✓';
                if (window.Fx) Fx.stars(canvasWrap, 4);
                setTimeout(() => { saveBtn.textContent = 'ذخیره در گالری'; }, 1600);
            } catch (e) {
                saveBtn.textContent = 'ذخیره نشد';
            }
        });
        toolsBar.appendChild(saveBtn);

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

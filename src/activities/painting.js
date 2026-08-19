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
                if (typeof stampButtons !== 'undefined') stampButtons.forEach(x => x.classList.remove('active'));
                if (typeof stampButtons !== 'undefined') stampButtons.forEach(x => x.classList.remove('active'));
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
            if (typeof stampButtons !== 'undefined') stampButtons.forEach(x => x.classList.remove('active'));
            paletteBar.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
        });

        // Stamp buttons show the actual shape they stamp, and stay visibly selected.
        const STAMP_ICONS = {
            star: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="#2D3436" stroke-width="1.4" stroke-linejoin="round"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z"/></svg>',
            heart: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="#2D3436" stroke-width="1.4" stroke-linejoin="round"><path d="M12 20.5S3.6 15 3.6 9.2A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.4 2.6C20.4 15 12 20.5 12 20.5z"/></svg>',
            flower: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="#2D3436" stroke-width="1.3" stroke-linejoin="round"><circle cx="12" cy="6.4" r="3.5"/><circle cx="17" cy="9.7" r="3.5"/><circle cx="15.2" cy="15.6" r="3.5"/><circle cx="8.8" cy="15.6" r="3.5"/><circle cx="7" cy="9.7" r="3.5"/><circle cx="12" cy="11.8" r="2.6" fill="#FFD166"/></svg>'
        };
        const stampButtons = [];
        function makeStampBtn(kind, label) {
            const b = document.createElement('button');
            b.className = 'tool-btn stamp-tool-btn';
            b.type = 'button';
            b.setAttribute('aria-label', label);
            b.innerHTML = `<span class="stamp-ico">${STAMP_ICONS[kind]}</span><span>${label}</span>`;
            b.addEventListener('click', () => {
                AudioEngine.play('pop');
                currentStamp = kind;
                isEraser = false;
                isRainbow = false;
                // Without visible selection a child cannot tell a stamp is armed.
                stampButtons.forEach(x => x.classList.remove('active'));
                b.classList.add('active');
            });
            stampButtons.push(b);
            return b;
        }
        const stampStar = makeStampBtn('star', 'ستاره');
        const stampHeart = makeStampBtn('heart', 'قلب');
        const stampFlower = makeStampBtn('flower', 'گل');

        const eraserBtn = document.createElement('button');
        eraserBtn.className = 'tool-btn';
        eraserBtn.textContent = 'پاک‌کن';
        eraserBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            isEraser = true;
            isRainbow = false;
            currentStamp = null;
            if (typeof stampButtons !== 'undefined') stampButtons.forEach(x => x.classList.remove('active'));
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
        toolsBar.appendChild(stampFlower);
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
        // Size the sheet to the area it will really be displayed in. Previously the
        // height was computed from the viewport (0.62 * innerHeight) while CSS then
        // clamped it with max-height, changing the aspect ratio and letterboxing it.
        const width = Math.min(window.innerWidth - 24, 560);
        const height = Math.min(Math.max(window.innerHeight * 0.52, 300), 560);
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
            // The stylesheet applies `max-width:100%; max-height:100%` to .paint-canvas,
            // so the element is often displayed SMALLER than the `width`/`height` the
            // drawing code works in. Subtracting rect.left/top alone therefore produced
            // a growing offset: the brush painted far from the child's finger and could
            // not reach the right/bottom of the sheet at all. Convert from displayed
            // pixels into drawing-space pixels.
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const scaleX = rect.width ? (width / rect.width) : 1;
            const scaleY = rect.height ? (height / rect.height) : 1;
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        // ---- real stamp artwork -------------------------------------------
        const STAMP_SIZE = 46;

        function stampPath(c, kind, x, y, r) {
            c.beginPath();
            if (kind === 'star') {
                for (let i = 0; i < 5; i++) {
                    const oa = (-90 + i * 72) * Math.PI / 180;
                    const ia = (-90 + i * 72 + 36) * Math.PI / 180;
                    const ox = x + Math.cos(oa) * r, oy = y + Math.sin(oa) * r;
                    const ix = x + Math.cos(ia) * r * 0.42, iy = y + Math.sin(ia) * r * 0.42;
                    if (i === 0) c.moveTo(ox, oy); else c.lineTo(ox, oy);
                    c.lineTo(ix, iy);
                }
                c.closePath();
            } else if (kind === 'heart') {
                // A true heart: two lobes meeting at a point below.
                const w = r * 1.05, h = r * 1.05;
                c.moveTo(x, y + h * 0.72);
                c.bezierCurveTo(x - w * 1.3, y - h * 0.28, x - w * 0.42, y - h * 1.06, x, y - h * 0.34);
                c.bezierCurveTo(x + w * 0.42, y - h * 1.06, x + w * 1.3, y - h * 0.28, x, y + h * 0.72);
                c.closePath();
            } else if (kind === 'flower') {
                for (let i = 0; i < 6; i++) {
                    const a = (i * 60) * Math.PI / 180;
                    const px = x + Math.cos(a) * r * 0.55, py = y + Math.sin(a) * r * 0.55;
                    c.moveTo(px + r * 0.42, py);
                    c.arc(px, py, r * 0.42, 0, Math.PI * 2);
                }
            } else if (kind === 'circle') {
                c.arc(x, y, r, 0, Math.PI * 2);
            }
            return c;
        }

        function drawStamp(c, kind, x, y, size, color) {
            const r = size / 2;
            c.save();
            c.lineJoin = 'round';
            // Soft drop shadow so the stamp sits ON the page instead of staining it.
            c.shadowColor = 'rgba(20,26,38,0.22)';
            c.shadowBlur = 4;
            c.shadowOffsetY = 2;
            c.fillStyle = color;
            stampPath(c, kind, x, y, r);
            c.fill();
            c.shadowColor = 'transparent';
            c.shadowBlur = 0;
            c.shadowOffsetY = 0;
            // Dark outline keeps the shape readable on any background colour.
            c.strokeStyle = 'rgba(45,52,54,0.85)';
            c.lineWidth = 2.5;
            stampPath(c, kind, x, y, r);
            c.stroke();
            if (kind === 'flower') {
                c.fillStyle = '#FFD166';
                c.beginPath();
                c.arc(x, y, r * 0.32, 0, Math.PI * 2);
                c.fill();
                c.strokeStyle = 'rgba(45,52,54,0.85)';
                c.lineWidth = 2;
                c.stroke();
            }
            c.restore();
        }

        function startPaint(e) {
            e.preventDefault();
            const pos = getPos(e);
            saveSnapshot();

            if (currentStamp) {
                // The old "heart" was literally two circles -- no heart shape at all --
                // and both stamps were ~16px with no outline, so they read as smudges.
                // Draw real, properly outlined shapes at a size a child can see.
                drawStamp(ctx, currentStamp, pos.x, pos.y, STAMP_SIZE, currentColor);
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

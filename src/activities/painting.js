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
        // Stroke smoothing state. Drawing straight lineTo segments between raw
        // pointer samples is what made the pen feel stiff and angular: touch
        // events arrive far apart, so a curve came out as visible facets. We
        // keep the previous two points and join them with a quadratic curve
        // through their midpoint, which is the standard fix for that.
        let lastX = 0, lastY = 0, midX = 0, midY = 0;
        let lastWidth = 10;
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
        rainbowBtn.className = 'tool-btn icon-tool';
        rainbowBtn.title = 'قلم جادویی';
        rainbowBtn.setAttribute('aria-label', 'قلم جادویی');
        rainbowBtn.innerHTML = window.AppIcons ? window.AppIcons.get('rainbow', 24) : 'قلم جادویی';
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
            flower: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="#2D3436" stroke-width="1.3" stroke-linejoin="round"><circle cx="12" cy="6.4" r="3.5"/><circle cx="17" cy="9.7" r="3.5"/><circle cx="15.2" cy="15.6" r="3.5"/><circle cx="8.8" cy="15.6" r="3.5"/><circle cx="7" cy="9.7" r="3.5"/><circle cx="12" cy="11.8" r="2.6" fill="#FFD166"/></svg>',
            cat: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="#2D3436" stroke-width="1.3" stroke-linejoin="round"><path d="M5.6 9.4 4.6 3.8l4.8 2.9a8.6 8.6 0 0 1 5.2 0l4.8-2.9-1 5.6a7.4 7.4 0 1 1-12.8 0z"/><circle cx="9.4" cy="12.6" r="1.1" fill="#2D3436" stroke="none"/><circle cx="14.6" cy="12.6" r="1.1" fill="#2D3436" stroke="none"/><path d="M12 15.2l-1 1.4h2z" fill="#FF9F80"/></svg>',
            rabbit: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="#2D3436" stroke-width="1.3" stroke-linejoin="round"><ellipse cx="9" cy="6" rx="1.9" ry="4.4"/><ellipse cx="15" cy="6" rx="1.9" ry="4.4"/><circle cx="12" cy="15.6" r="6"/><circle cx="10" cy="14.8" r="1" fill="#2D3436" stroke="none"/><circle cx="14" cy="14.8" r="1" fill="#2D3436" stroke="none"/><path d="M12 17l-1 1.3h2z" fill="#FF7AA2"/></svg>',
            fish: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="#2D3436" stroke-width="1.3" stroke-linejoin="round"><path d="M21 12c-3 4-7.4 4.6-11 2.6C7.6 13.4 6.4 12 6.4 12s1.2-1.4 3.6-2.6C13.6 7.4 18 8 21 12z"/><path d="M6.4 12 2.6 8.4 3.8 12l-1.2 3.6z"/><circle cx="16.6" cy="11.2" r="1.05" fill="#2D3436" stroke="none"/></svg>'
        };
        const stampButtons = [];
        function makeStampBtn(kind, label) {
            const b = document.createElement('button');
            b.className = 'tool-btn stamp-tool-btn';
            b.type = 'button';
            b.setAttribute('aria-label', label);
            // Icon only: a 4-year-old cannot read «خرگوش», but recognises a rabbit.
            // The word stays as the accessible name for screen readers and for
            // parents using long-press tooltips.
            b.title = label;
            b.innerHTML = `<span class="stamp-ico">${STAMP_ICONS[kind]}</span>`;
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
        // Stamps deliberately exclude cat, fish and flower: those already exist
        // as full colouring templates in the strip below, and offering the same
        // animal twice with two different behaviours was confusing rather than
        // generous. Rabbit has no template, so it stays.
        const stampRabbit = makeStampBtn('rabbit', 'خرگوش');

        const eraserBtn = document.createElement('button');
        eraserBtn.className = 'tool-btn icon-tool';
        eraserBtn.title = 'پاک‌کن';
        eraserBtn.setAttribute('aria-label', 'پاک‌کن');
        eraserBtn.innerHTML = window.AppIcons ? window.AppIcons.get('eraser', 24) : 'پاک‌کن';
        eraserBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            isEraser = true;
            isRainbow = false;
            currentStamp = null;
            if (typeof stampButtons !== 'undefined') stampButtons.forEach(x => x.classList.remove('active'));
            paletteBar.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
        });

        const brushBtn = document.createElement('button');
        brushBtn.className = 'tool-btn icon-tool';
        function paintBrushIcon() {
            // The label used to be the only cue for brush size. Show the icon and
            // a dot whose size mirrors the actual stroke width, so the setting is
            // readable without words.
            const thick = currentBrushSize >= 18;
            brushBtn.title = thick ? 'قلم ضخیم' : 'قلم متوسط';
            brushBtn.setAttribute('aria-label', brushBtn.title);
            const ico = window.AppIcons ? window.AppIcons.get(thick ? 'brush-thick' : 'brush', 24) : '';
            brushBtn.innerHTML = `${ico}<i class="brush-size-dot" style="width:${thick ? 13 : 8}px;height:${thick ? 13 : 8}px"></i>`;
            // classList.toggle's second argument is not universally available on
            // stubbed elements; add/remove is the safer pair.
            if (thick) brushBtn.classList.add('thick');
            else brushBtn.classList.remove('thick');
        }
        paintBrushIcon();
        brushBtn.addEventListener('click', () => {
            currentBrushSize = currentBrushSize >= 18 ? 10 : 18;
            paintBrushIcon();
            isEraser = false;
            AudioEngine.play('click');
        });

        const undoBtn = document.createElement('button');
        undoBtn.className = 'tool-btn icon-tool';
        undoBtn.title = 'برگشت';
        undoBtn.setAttribute('aria-label', 'برگشت');
        undoBtn.innerHTML = window.AppIcons ? window.AppIcons.get('undo', 24) : 'برگشت';
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
        clearBtn.className = 'tool-btn icon-tool danger';
        clearBtn.title = 'پاک کردن';
        clearBtn.setAttribute('aria-label', 'پاک کردن');
        clearBtn.innerHTML = window.AppIcons ? window.AppIcons.get('trash', 24) : 'پاک کردن';
        clearBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            undoStack.length = 0;
            applyTemplate();
        });

        // Two labelled-by-position groups instead of one 12-item run of pills:
        // row 1 = what you draw with, row 2 = what you do to the drawing.
        const drawGroup = document.createElement('div');
        drawGroup.className = 'paint-tool-group';
        [brushBtn, rainbowBtn, stampStar, stampHeart, stampRabbit]
            .forEach(b => drawGroup.appendChild(b));

        const actionGroup = document.createElement('div');
        actionGroup.className = 'paint-tool-group';
        [eraserBtn, undoBtn, clearBtn].forEach(b => actionGroup.appendChild(b));

        toolsBar.appendChild(drawGroup);
        toolsBar.appendChild(actionGroup);

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
            } else if (kind === 'cat') {
                // Two ear triangles plus a head circle, as three independent
                // subpaths. Chaining arc() between lineTo() calls (the first
                // attempt) collapsed into a dot, because arc() joins to the
                // previous point and the winding cancelled the fill.
                c.moveTo(x - r * 0.74, y - r * 1.02);
                c.lineTo(x - r * 0.2, y - r * 0.72);
                c.lineTo(x - r * 0.66, y - r * 0.3);
                c.closePath();
                c.moveTo(x + r * 0.74, y - r * 1.02);
                c.lineTo(x + r * 0.2, y - r * 0.72);
                c.lineTo(x + r * 0.66, y - r * 0.3);
                c.closePath();
                c.moveTo(x + r * 0.78, y);
                c.arc(x, y, r * 0.78, 0, Math.PI * 2);
            } else if (kind === 'rabbit') {
                // Two long ears above a round head.
                c.ellipse(x - r * 0.34, y - r * 0.86, r * 0.2, r * 0.52, -0.18, 0, Math.PI * 2);
                c.closePath();
                c.moveTo(x + r * 0.54, y - r * 0.86);
                c.ellipse(x + r * 0.34, y - r * 0.86, r * 0.2, r * 0.52, 0.18, 0, Math.PI * 2);
                c.closePath();
                c.moveTo(x + r * 0.7, y + r * 0.16);
                c.arc(x, y + r * 0.16, r * 0.7, 0, Math.PI * 2);
            } else if (kind === 'fish') {
                // Teardrop body with a forked tail.
                c.moveTo(x + r * 0.86, y);
                c.quadraticCurveTo(x + r * 0.1, y - r * 0.72, x - r * 0.42, y);
                c.quadraticCurveTo(x + r * 0.1, y + r * 0.72, x + r * 0.86, y);
                c.closePath();
                c.moveTo(x - r * 0.42, y);
                c.lineTo(x - r * 0.96, y - r * 0.52);
                c.lineTo(x - r * 0.78, y);
                c.lineTo(x - r * 0.96, y + r * 0.52);
                c.closePath();
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
            // Animals need a face. Without eyes the shapes read as blobs, which
            // is the whole complaint: only the outline was identifiable.
            if (kind === 'cat' || kind === 'rabbit' || kind === 'fish') {
                const ink = '#2D3436';
                c.fillStyle = ink;
                const eye = Math.max(1.6, r * 0.09);
                if (kind === 'fish') {
                    c.beginPath();
                    c.arc(x + r * 0.42, y - r * 0.08, eye, 0, Math.PI * 2);
                    c.fill();
                    // gill line
                    c.strokeStyle = 'rgba(45,52,54,0.55)';
                    c.lineWidth = Math.max(1.2, r * 0.06);
                    c.beginPath();
                    c.moveTo(x + r * 0.12, y - r * 0.34);
                    c.quadraticCurveTo(x + r * 0.02, y, x + r * 0.12, y + r * 0.34);
                    c.stroke();
                } else {
                    const cy = kind === 'rabbit' ? y + r * 0.04 : y - r * 0.04;
                    c.beginPath();
                    c.arc(x - r * 0.24, cy, eye, 0, Math.PI * 2);
                    c.arc(x + r * 0.24, cy, eye, 0, Math.PI * 2);
                    c.fill();
                    // little triangular nose
                    c.beginPath();
                    c.moveTo(x, cy + r * 0.2);
                    c.lineTo(x - r * 0.1, cy + r * 0.34);
                    c.lineTo(x + r * 0.1, cy + r * 0.34);
                    c.closePath();
                    c.fillStyle = kind === 'rabbit' ? '#FF7AA2' : '#FF9F80';
                    c.fill();
                    c.strokeStyle = 'rgba(45,52,54,0.7)';
                    c.lineWidth = Math.max(1, r * 0.045);
                    c.stroke();
                    if (kind === 'cat') {
                        // whiskers
                        c.strokeStyle = 'rgba(45,52,54,0.6)';
                        c.lineWidth = Math.max(1, r * 0.05);
                        for (const dir of [-1, 1]) {
                            for (const off of [-0.1, 0.08]) {
                                c.beginPath();
                                c.moveTo(x + dir * r * 0.2, cy + r * 0.28 + r * off);
                                c.lineTo(x + dir * r * 0.78, cy + r * 0.2 + r * off * 2.2);
                                c.stroke();
                            }
                        }
                    }
                }
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
            lastX = midX = pos.x;
            lastY = midY = pos.y;
            lastWidth = isEraser ? 24 : currentBrushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = isEraser ? '#FFFFFF' : isRainbow ? `hsl(${strokeHue}, 90%, 60%)` : currentColor;
            // A tap with no movement should still leave a mark.
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, lastWidth / 2, 0, Math.PI * 2);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();
            AudioEngine.play('paint');
        }

        function paint(e) {
            if (!isDrawing) return;
            e.preventDefault();

            // Use the browser's coalesced samples when available. A finger moving
            // fast generates many more positions than there are frames, and the
            // discarded ones are exactly what made quick strokes look angular.
            const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
            for (const ev of evs) drawSegment(getPos(ev));
        }

        function drawSegment(pos) {
            // Ignore sub-pixel jitter so a resting finger does not pile up dots.
            const dist = Math.hypot(pos.x - lastX, pos.y - lastY);
            if (dist < 0.5) return;

            // Smooth the incoming point before drawing. Raw touch coordinates are
            // noisy, and that noise is visible as a wobbly edge on a thick stroke.
            const sx = lastX + (pos.x - lastX) * 0.5;
            const sy = lastY + (pos.y - lastY) * 0.5;

            // Width easing. The previous version changed lineWidth on every
            // segment while stroking each one separately, so the line showed
            // steps and a seam at each joint. Keep the change per segment tiny
            // and overlap the joints with round caps so they fuse.
            const base = isEraser ? 24 : currentBrushSize;
            const target = isEraser ? base : Math.max(base * 0.6, base - dist * 0.18);
            lastWidth += (target - lastWidth) * 0.15;

            if (isRainbow) {
                strokeHue = (strokeHue + 4) % 360;
                ctx.strokeStyle = `hsl(${strokeHue}, 90%, 60%)`;
            }

            const newMidX = (lastX + sx) / 2;
            const newMidY = (lastY + sy) / 2;
            ctx.lineWidth = lastWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(midX, midY);
            ctx.quadraticCurveTo(lastX, lastY, newMidX, newMidY);
            ctx.stroke();

            midX = newMidX; midY = newMidY;
            lastX = sx; lastY = sy;
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

// Interactive Persian Letter & Number Tracing Engine for "پرورش هوش کودک" (100% Fullscreen)
window.TracingActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const stage = document.createElement('div');
        stage.className = 'activity-fullscreen-stage';

        // 1. Top Prompt
        const promptBanner = document.createElement('div');
        promptBanner.className = 'activity-prompt-banner';

        const promptText = document.createElement('div');
        promptText.className = 'activity-prompt-text';
        const isLetter = round.kind === 'letter';
        promptText.textContent = `با انگشت روی «${round.char}» بکش!`;

        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'activity-speaker-btn';
        speakerBtn.type = 'button';
        speakerBtn.setAttribute('aria-label', 'شنیدن راهنمای ردگیری');
        speakerBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
        speakerBtn.onclick = () => {
            AudioEngine.play('click');
            if (!(round.audioClip && AudioEngine.playClip && AudioEngine.playClip(round.audioClip))) AudioEngine.speak(round.speech || `با انگشت روی ${isLetter ? 'حرف' : 'عدد'} ${round.char} بکش گل من!`);
        };

        promptBanner.appendChild(promptText);
        promptBanner.appendChild(speakerBtn);
        stage.appendChild(promptBanner);

        // 2. Fullscreen Canvas Stage
        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'fullscreen-canvas-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'fullscreen-canvas';

        // Responsive Dimensions.
        // The writing area used to be capped at 340x260, which on a phone left the
        // letter small and hard for a 4-year-old to trace. Use nearly the full
        // width and a much taller box so the glyph is genuinely big.
        const width = Math.min(window.innerWidth - 20, 460);
        const height = Math.min(window.innerHeight * 0.60, 420);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        const guideCanvas = document.createElement('canvas');
        guideCanvas.width = canvas.width;
        guideCanvas.height = canvas.height;
        const guideCtx = guideCanvas.getContext && guideCanvas.getContext('2d');
        let guideAvailable = Boolean(guideCtx && guideCtx.getImageData);
        if (guideAvailable) {
            guideCtx.scale(dpr, dpr);
            guideCtx.font = `900 ${Math.round(height * 0.70)}px Vazirmatn, Tahoma, sans-serif`;
            guideCtx.textAlign = 'center';
            guideCtx.textBaseline = 'middle';
            guideCtx.fillStyle = '#FFFFFF';
            guideCtx.fillText(round.char, width / 2, height / 2);
        }

        let isDrawing = false;
        let drawnPoints = 0;
        let checkAttempts = 0;
        let guidedPoints = 0;
        let completed = false;
        let progressFill = null;

        // ------------------------------------------------------------------
        // COVERAGE, not just accuracy.
        // The old check only asked "were your strokes near the line?", so one
        // short scribble in a corner passed the round. The child must now
        // actually FILL the letter: the glyph is sampled into a coarse grid of
        // cells, and a cell counts as painted once the finger passes over it.
        // Completion needs REQUIRED_COVERAGE of the glyph's own cells.
        // ------------------------------------------------------------------
        const REQUIRED_COVERAGE = 0.70;
        const CELL = 12;                       // css px per grid cell
        const cols = Math.max(1, Math.ceil(width / CELL));
        const rows = Math.max(1, Math.ceil(height / CELL));
        const glyphCells = new Uint8Array(cols * rows);   // 1 = part of the letter
        const paintedCells = new Uint8Array(cols * rows); // 1 = child covered it
        let glyphCellCount = 0;
        let paintedCount = 0;

        // Sample the offscreen guide once to learn which cells the glyph
        // occupies. Doing this up front means the hot drawing path never calls
        // getImageData again.
        let guideMask = null;
        if (guideAvailable) {
            try {
                const full = guideCtx.getImageData(0, 0, canvas.width, canvas.height).data;
                guideMask = full;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        let hit = false;
                        const x0 = Math.round(col * CELL * dpr);
                        const y0 = Math.round(row * CELL * dpr);
                        const x1 = Math.min(canvas.width, Math.round((col + 1) * CELL * dpr));
                        const y1 = Math.min(canvas.height, Math.round((row + 1) * CELL * dpr));
                        for (let y = y0; y < y1 && !hit; y += 2) {
                            for (let x = x0; x < x1; x += 2) {
                                if (full[(y * canvas.width + x) * 4 + 3] > 20) { hit = true; break; }
                            }
                        }
                        if (hit) { glyphCells[row * cols + col] = 1; glyphCellCount++; }
                    }
                }
            } catch (error) {
                guideAvailable = false;
                guideMask = null;
            }
        }
        // If the glyph could not be sampled there is nothing to measure against,
        // so fall back to the old "enough strokes" rule rather than blocking.
        const coverageAvailable = guideAvailable && glyphCellCount > 0;

        function coverage() {
            return glyphCellCount ? paintedCount / glyphCellCount : 0;
        }

        // Mark every glyph cell under the finger (with a small brush radius so a
        // 16px stroke credits the cells it visually covers).
        function paintAt(pos) {
            if (!coverageAvailable) return;
            const cCol = Math.floor(pos.x / CELL);
            const cRow = Math.floor(pos.y / CELL);
            for (let dRow = -1; dRow <= 1; dRow++) {
                for (let dCol = -1; dCol <= 1; dCol++) {
                    const row = cRow + dRow;
                    const col = cCol + dCol;
                    if (row < 0 || col < 0 || row >= rows || col >= cols) continue;
                    const idx = row * cols + col;
                    if (glyphCells[idx] && !paintedCells[idx]) {
                        paintedCells[idx] = 1;
                        paintedCount++;
                    }
                }
            }
        }

        function drawBackground() {
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = '#E0D6CC';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(12, 12, width - 24, height - 24);

            ctx.beginPath();
            ctx.moveTo(16, height * 0.72);
            ctx.lineTo(width - 16, height * 0.72);
            ctx.strokeStyle = '#FFB8B8';
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = `900 ${Math.round(height * 0.70)}px Vazirmatn, Tahoma, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#F4ECE6';
            ctx.fillText(round.char, width / 2, height / 2);

            ctx.strokeStyle = '#D6C8B8';
            ctx.lineWidth = 3;
            ctx.strokeText(round.char, width / 2, height / 2);

            ctx.beginPath();
            ctx.arc(width * 0.72, height * 0.36, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#00B894';
            ctx.fill();
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        drawBackground();

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        // Reads the mask sampled once at start-up. The old version called
        // getImageData on EVERY pointer move, which allocated a fresh pixel
        // buffer per event and made tracing stutter on a cheap phone.
        function isNearGuide(pos) {
            if (!guideMask) return true;
            const cx = Math.max(0, Math.min(canvas.width - 1, Math.round(pos.x * dpr)));
            const cy = Math.max(0, Math.min(canvas.height - 1, Math.round(pos.y * dpr)));
            const radius = Math.round(14 * dpr);
            const xStart = Math.max(0, cx - radius);
            const xEnd = Math.min(canvas.width - 1, cx + radius);
            const yStart = Math.max(0, cy - radius);
            const yEnd = Math.min(canvas.height - 1, cy + radius);
            const step = Math.max(2, Math.round(3 * dpr));
            for (let y = yStart; y <= yEnd; y += step) {
                const rowOffset = y * canvas.width;
                for (let x = xStart; x <= xEnd; x += step) {
                    if (guideMask[(rowOffset + x) * 4 + 3] > 20) return true;
                }
            }
            return false;
        }

        function startDraw(e) {
            if (completed) return;
            e.preventDefault();
            isDrawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.strokeStyle = '#6C5CE7';
            ctx.lineWidth = 16;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            AudioEngine.play('drag');
        }

        function draw(e) {
            if (!isDrawing || completed) return;
            e.preventDefault();
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            drawnPoints++;
            if (isNearGuide(pos)) guidedPoints++;
            paintAt(pos);

            if (drawnPoints % 25 === 0) {
                AudioEngine.play('bubble');
            }

            // Live encouragement so the child can see how much is left to fill.
            if (coverageAvailable && drawnPoints % 6 === 0 && !completed) {
                updateProgress();
            }

            // Auto-finish the moment the letter is genuinely filled.
            if (!completed && coverageAvailable && coverage() >= REQUIRED_COVERAGE) {
                checkCompletion(true);
            }
        }

        function stopDraw() {
            isDrawing = false;
        }

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });

        // The two window listeners below used to be added on every render and
        // never removed, so a child who traced 20 letters left 40 dead handlers
        // (each holding this canvas alive) attached to window. Detach them as
        // soon as the canvas leaves the DOM.
        window.addEventListener('mouseup', stopDraw);
        window.addEventListener('touchend', stopDraw);

        function detachGlobalListeners() {
            window.removeEventListener('mouseup', stopDraw);
            window.removeEventListener('touchend', stopDraw);
        }

        if (typeof MutationObserver === 'function') {
            const observer = new MutationObserver(() => {
                if (!document.body.contains(canvas)) {
                    detachGlobalListeners();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        canvasWrap.appendChild(canvas);
        stage.appendChild(canvasWrap);
        // Fill meter: a pre-reader cannot read a percentage, so the bar is the
        // real feedback and the text is for a parent looking over the shoulder.
        const progressTrack = document.createElement('div');
        progressTrack.className = 'trace-progress-track';
        progressFill = document.createElement('i');
        progressFill.className = 'trace-progress-fill';
        progressTrack.appendChild(progressFill);
        stage.appendChild(progressTrack);

        const traceStatus = document.createElement('div');
        traceStatus.className = 'trace-status';
        traceStatus.textContent = `مسیر حرف را پر کن تا ${toFaPercent(Math.round(REQUIRED_COVERAGE * 100))}٪ کامل شود.`;
        stage.appendChild(traceStatus);

        // 3. Action Controls
        const controls = document.createElement('div');
        controls.style.cssText = 'display:flex; gap:10px; justify-content:center; width:100%; flex-shrink:0;';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn-secondary-action';
        clearBtn.style.flex = '1';
        clearBtn.textContent = 'دوباره بنویس';
        clearBtn.onclick = () => {
            AudioEngine.play('click');
            drawnPoints = 0;
            guidedPoints = 0;
            completed = false;
            paintedCells.fill(0);
            paintedCount = 0;
            if (progressFill) { progressFill.style.width = '0%'; progressFill.classList.remove('is-ready'); }
            traceStatus.textContent = `مسیر حرف را پر کن تا ${toFaPercent(Math.round(REQUIRED_COVERAGE * 100))}٪ کامل شود.`;
            drawBackground();
        };

        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn-primary-action';
        checkBtn.style.flex = '1';
        checkBtn.style.marginTop = '0';
        checkBtn.textContent = 'نوشتم!';
        checkBtn.onclick = () => {
            AudioEngine.play('click');
            if (drawnPoints > 15) {
                checkCompletion();
            } else {
                checkAttempts++;
                AudioEngine.play('wrong');
                traceStatus.textContent = 'چند حرکت دیگر هم روی مسیر بکش.';
                if (window.Fx) Fx.shake(canvas);
            }
        };

        controls.appendChild(clearBtn);
        controls.appendChild(checkBtn);
        stage.appendChild(controls);

        function checkCompletion(silent) {
            if (completed) return;
            const accuracy = drawnPoints ? guidedPoints / drawnPoints : 0;
            const filled = coverage();

            // The child must genuinely fill the letter, not just scribble near it.
            if (coverageAvailable && filled < REQUIRED_COVERAGE) {
                // Auto-checks while drawing never nag and never spend an attempt.
                if (silent) return;
                checkAttempts++;
                // Motor control at 4 is not precise, so after several honest
                // attempts with most of the letter filled we accept the effort
                // rather than trapping the child on one round forever.
                const closeEnough = filled >= REQUIRED_COVERAGE * 0.8;
                if (checkAttempts < 3 || !closeEnough) {
                    if (checkAttempts >= 4 && drawnPoints > 40) {
                        // Hard escape hatch: never a dead end.
                        finish(accuracy, filled);
                        return;
                    }
                    AudioEngine.play('wrong');
                    traceStatus.textContent = `هنوز ${toFaPercent(Math.round(filled * 100))}٪ پر شده؛ باید ${toFaPercent(Math.round(REQUIRED_COVERAGE * 100))}٪ حرف را پر کنی.`;
                    if (window.Fx) Fx.shake(canvas);
                    return;
                }
            }
            finish(accuracy, filled);
        }

        function finish(accuracy, filled) {
            if (completed) return;
            completed = true;
            const pct = coverageAvailable ? Math.round(Math.min(1, filled) * 100) : Math.round(Math.min(1, accuracy) * 100);
            traceStatus.textContent = `آفرین! ${toFaPercent(pct)}٪ حرف را پر کردی.`;
            if (progressFill) progressFill.style.width = Math.min(100, pct) + '%';
            AudioEngine.play('correct');
            if (window.Fx) Fx.stars(canvasWrap, 5);

            setTimeout(() => {
                if (cb && cb.onCorrect) cb.onCorrect(round, { accuracy, coverage: filled });
            }, 800);
        }

        function updateProgress() {
            if (!progressFill) return;
            const pct = Math.min(100, Math.round((coverage() / REQUIRED_COVERAGE) * 100));
            progressFill.style.width = pct + '%';
            progressFill.classList.toggle('is-ready', coverage() >= REQUIRED_COVERAGE);
        }

        function toFaPercent(value) {
            return String(value).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
        }

        container.appendChild(stage);
    }

    return { render };
})();

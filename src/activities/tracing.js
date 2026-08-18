// Interactive Persian Letter & Number Tracing Engine for "پرورش هوش کودک"
window.TracingActivity = (function() {

    function render(container, round, cb) {
        container.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'tracing-card';

        // Header
        const headerRow = document.createElement('div');
        headerRow.className = 'activity-header-row';

        const promptTitle = document.createElement('h2');
        promptTitle.className = 'quiz-prompt';
        const isLetter = round.kind === 'letter';
        promptTitle.textContent = `با انگشت روی «${round.char}» بکش`;

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
            AudioEngine.speak(round.speech || `با انگشت روی ${isLetter ? 'حرف' : 'عدد'} ${round.char} بکش`);
        });

        headerRow.appendChild(promptTitle);
        headerRow.appendChild(speakerBtn);
        card.appendChild(headerRow);

        setTimeout(() => {
            AudioEngine.speak(round.speech || `با انگشت روی ${isLetter ? 'حرف' : 'عدد'} ${round.char} بکش`);
        }, 150);

        // Tracing Stage
        const stageWrap = document.createElement('div');
        stageWrap.className = 'tracing-stage-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'tracing-canvas';
        const width = Math.min(window.innerWidth - 48, 360);
        const height = Math.min(window.innerHeight * 0.42, 280);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        let isDrawing = false;
        let drawnPoints = 0;
        let completed = false;

        function drawBackground() {
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = '#E0D6CC';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(16, 16, width - 32, height - 32);

            ctx.beginPath();
            ctx.moveTo(20, height * 0.72);
            ctx.lineTo(width - 20, height * 0.72);
            ctx.strokeStyle = '#FFB8B8';
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = `900 ${Math.round(height * 0.62)}px Vazirmatn, Tahoma, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = '#F1ECE6';
            ctx.fillText(round.char, width / 2, height / 2);

            ctx.strokeStyle = '#DDD0C4';
            ctx.lineWidth = 3;
            ctx.strokeText(round.char, width / 2, height / 2);

            ctx.beginPath();
            ctx.arc(width * 0.72, height * 0.36, 9, 0, Math.PI * 2);
            ctx.fillStyle = '#00B894';
            ctx.fill();
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth = 2.5;
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

        function startDraw(e) {
            if (completed) return;
            e.preventDefault();
            isDrawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.strokeStyle = '#6C5CE7';
            ctx.lineWidth = 18;
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

            if (drawnPoints % 25 === 0) {
                AudioEngine.play('bubble');
            }

            if (drawnPoints > 55 && !completed) {
                checkCompletion();
            }
        }

        function stopDraw() {
            isDrawing = false;
        }

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDraw);

        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        window.addEventListener('touchend', stopDraw);

        stageWrap.appendChild(canvas);
        card.appendChild(stageWrap);

        // Control Buttons
        const controls = document.createElement('div');
        controls.className = 'tracing-controls';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'action-pill-btn';
        clearBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>دوباره</span>
        `;
        clearBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            drawnPoints = 0;
            completed = false;
            drawBackground();
        });

        const checkBtn = document.createElement('button');
        checkBtn.className = 'action-pill-btn primary';
        checkBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>نوشتم!</span>
        `;
        checkBtn.addEventListener('click', () => {
            AudioEngine.play('click');
            if (drawnPoints > 15) {
                checkCompletion();
            } else {
                AudioEngine.play('wrong');
                if (window.Fx) Fx.shake(canvas);
            }
        });

        controls.appendChild(clearBtn);
        controls.appendChild(checkBtn);
        card.appendChild(controls);

        function checkCompletion() {
            if (completed) return;
            completed = true;
            AudioEngine.play('correct');
            if (window.Fx) Fx.stars(stageWrap, 5);

            setTimeout(() => {
                if (cb && cb.onCorrect) cb.onCorrect(round);
            }, 900);
        }

        container.appendChild(card);
    }

    return { render };
})();

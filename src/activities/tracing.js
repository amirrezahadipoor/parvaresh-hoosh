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
        speakerBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
        speakerBtn.onclick = () => {
            AudioEngine.play('click');
            AudioEngine.speak(round.speech || `با انگشت روی ${isLetter ? 'حرف' : 'عدد'} ${round.char} بکش گل من!`);
        };

        promptBanner.appendChild(promptText);
        promptBanner.appendChild(speakerBtn);
        stage.appendChild(promptBanner);

        setTimeout(() => {
            AudioEngine.speak(round.speech || `با انگشت روی ${isLetter ? 'حرف' : 'عدد'} ${round.char} بکش گل من!`);
        }, 150);

        // 2. Fullscreen Canvas Stage
        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'fullscreen-canvas-wrap';

        const canvas = document.createElement('canvas');
        canvas.className = 'fullscreen-canvas';

        // Responsive Dimensions
        const width = Math.min(window.innerWidth - 32, 340);
        const height = Math.min(window.innerHeight * 0.46, 260);
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
            ctx.strokeRect(12, 12, width - 24, height - 24);

            ctx.beginPath();
            ctx.moveTo(16, height * 0.72);
            ctx.lineTo(width - 16, height * 0.72);
            ctx.strokeStyle = '#FFB8B8';
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = `900 ${Math.round(height * 0.62)}px Vazirmatn, Tahoma, sans-serif`;
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

            if (drawnPoints % 25 === 0) {
                AudioEngine.play('bubble');
            }

            if (drawnPoints > 50 && !completed) {
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

        canvasWrap.appendChild(canvas);
        stage.appendChild(canvasWrap);

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
            completed = false;
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
                AudioEngine.play('wrong');
                if (window.Fx) Fx.shake(canvas);
            }
        };

        controls.appendChild(clearBtn);
        controls.appendChild(checkBtn);
        stage.appendChild(controls);

        function checkCompletion() {
            if (completed) return;
            completed = true;
            AudioEngine.play('correct');
            if (window.Fx) Fx.stars(canvasWrap, 5);

            setTimeout(() => {
                if (cb && cb.onCorrect) cb.onCorrect(round);
            }, 800);
        }

        container.appendChild(stage);
    }

    return { render };
})();

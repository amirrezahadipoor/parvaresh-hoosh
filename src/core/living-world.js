// Living Animated World, Stardust Particles & Touch Hints for "پرورش هوش کودک"
// Optional visual enhancement: the app remains fully functional if Canvas is unavailable.
window.LivingWorld = (function() {
    let stardustCanvas = null;
    let stardustCtx = null;
    let particles = [];
    let animFrameId = null;
    let initialized = false;
    let trailBound = false;

    const STAR_COLORS = ['#FF4757', '#FFA502', '#2ED573', '#00D2D3', '#1E90FF', '#9B59B6', '#F1C40F', '#FF6B81'];

    function raf(callback) {
        const request = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        return request ? request.call(window, callback) : window.setTimeout(() => callback(Date.now()), 16);
    }

    function caf(id) {
        const cancel = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
        if (cancel) cancel.call(window, id);
        else window.clearTimeout(id);
    }

    function init() {
        if (initialized) return;
        initialized = true;
        createStardustCanvas();
        bindTouchTrail();
        startParticles();
    }

    function createStardustCanvas() {
        if (document.getElementById('stardust-canvas')) {
            stardustCanvas = document.getElementById('stardust-canvas');
            stardustCtx = stardustCanvas.getContext && stardustCanvas.getContext('2d');
            resizeCanvas();
            return;
        }

        stardustCanvas = document.createElement('canvas');
        stardustCanvas.id = 'stardust-canvas';
        stardustCanvas.setAttribute('aria-hidden', 'true');
        stardustCanvas.style.cssText = `
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 99999;
        `;
        document.body.appendChild(stardustCanvas);
        try {
            stardustCtx = stardustCanvas.getContext && stardustCanvas.getContext('2d');
        } catch (e) {
            stardustCtx = null;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
    }

    function resizeCanvas() {
        if (!stardustCanvas) return;
        const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
        const width = Math.max(1, window.innerWidth || stardustCanvas.clientWidth || 1);
        const height = Math.max(1, window.innerHeight || stardustCanvas.clientHeight || 1);
        stardustCanvas.width = Math.round(width * dpr);
        stardustCanvas.height = Math.round(height * dpr);
        if (!stardustCtx) return;
        if (typeof stardustCtx.setTransform === 'function') {
            stardustCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        } else if (typeof stardustCtx.scale === 'function') {
            stardustCtx.scale(dpr, dpr);
        }
    }

    function addParticle(x, y) {
        if (!stardustCtx) return;
        if (particles.length >= 60) particles.shift();
        const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 1.5,
            size: Math.random() * 8 + 6,
            color,
            alpha: 1,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
            life: 1
        });
    }

    function bindTouchTrail() {
        if (trailBound) return;
        trailBound = true;

        function onPointer(e) {
            if (!stardustCtx || document.hidden) return;
            const touch = e.touches && e.touches[0];
            const clientX = touch ? touch.clientX : e.clientX;
            const clientY = touch ? touch.clientY : e.clientY;
            if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
                for (let i = 0; i < 3; i++) {
                    addParticle(clientX + (Math.random() - 0.5) * 12, clientY + (Math.random() - 0.5) * 12);
                }
            }
        }

        window.addEventListener('mousemove', onPointer, { passive: true });
        window.addEventListener('touchmove', onPointer, { passive: true });
        window.addEventListener('touchstart', onPointer, { passive: true });
        window.addEventListener('mousedown', onPointer, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopParticles();
            else startParticles();
        });
    }

    function startParticles() {
        if (!stardustCtx || animFrameId !== null) return;
        animFrameId = raf(animateParticles);
    }

    function stopParticles() {
        if (animFrameId !== null) {
            caf(animFrameId);
            animFrameId = null;
        }
    }

    function animateParticles() {
        animFrameId = null;
        if (!stardustCtx || document.hidden) return;

        const width = window.innerWidth || 1;
        const height = window.innerHeight || 1;
        stardustCtx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.vRot;
            p.life -= 0.035;
            p.alpha = Math.max(0, p.life);

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            stardustCtx.save();
            stardustCtx.translate(p.x, p.y);
            stardustCtx.rotate(p.rotation);
            stardustCtx.globalAlpha = p.alpha;
            stardustCtx.fillStyle = p.color;
            stardustCtx.shadowColor = p.color;
            stardustCtx.shadowBlur = 8;

            const s = p.size * p.life;
            stardustCtx.beginPath();
            stardustCtx.moveTo(0, -s);
            stardustCtx.quadraticCurveTo(0, 0, s, 0);
            stardustCtx.quadraticCurveTo(0, 0, 0, s);
            stardustCtx.quadraticCurveTo(0, 0, -s, 0);
            stardustCtx.quadraticCurveTo(0, 0, 0, -s);
            stardustCtx.fill();
            stardustCtx.restore();
        }

        animFrameId = raf(animateParticles);
    }

    // Auto finger hint for children who have not interacted for a few seconds.
    let hintTimer = null;
    let hintFingerEl = null;

    function resetHintTimer(targetSelector, delayMs) {
        clearHint();
        const delay = Number.isFinite(Number(delayMs)) ? Math.max(1800, Number(delayMs)) : 4500;
        hintTimer = window.setTimeout(() => showFingerHint(targetSelector), delay);
    }

    function showFingerHint(targetSelector) {
        clearHint();
        // Point at the CORRECT choice, not simply the first one on screen. The old
        // behaviour grabbed whichever element matched first, so the guiding hand
        // frequently pointed a child at a wrong answer.
        const all = [...document.querySelectorAll(targetSelector || '.game-tap-choice-btn, .adv-play-btn')];
        if (!all.length) return;
        const target = all.find(el => el.dataset && el.dataset.correct === 'true') || all[0];
        if (!target || typeof target.getBoundingClientRect !== 'function') return;

        const rect = target.getBoundingClientRect();
        hintFingerEl = document.createElement('div');
        hintFingerEl.className = 'magic-finger-hint';
        hintFingerEl.setAttribute('aria-hidden', 'true');
        hintFingerEl.innerHTML = `
            <svg width="42" height="42" viewBox="0 0 24 24" fill="#F1C40F" stroke="#2D3436" stroke-width="1.8">
                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
            </svg>
        `;
        // Sit OUTSIDE every option. Placing the hand merely "beside the target"
        // was not enough: when the correct option sits against the screen edge the
        // hand flipped to its other side and landed on top of the NEIGHBOURING
        // (wrong) option, pointing the child straight at a wrong answer.
        // So: generate candidate spots and pick the first that overlaps no option.
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const size = 42;
        const gap = 8;
        const clampX = x => Math.max(4, Math.min(x, vw - size - 4));
        const clampY = y => Math.max(4, Math.min(y, vh - size - 4));
        const midY = clampY(rect.top + rect.height / 2 - size / 2);
        const midX = clampX(rect.left + rect.width / 2 - size / 2);

        // Above the option is the safest for a horizontal row of choices.
        const candidates = [
            { left: midX, top: clampY(rect.top - size - gap) },
            { left: clampX(rect.left - size - gap), top: midY },
            { left: clampX(rect.right + gap), top: midY },
            { left: midX, top: clampY(rect.bottom + gap) }
        ];

        const others = all.filter(el => el !== target).map(el => el.getBoundingClientRect());
        const hits = c => others.some(r =>
            !(c.left + size <= r.left || c.left >= r.right || c.top + size <= r.top || c.top >= r.bottom));
        const spot = candidates.find(c => !hits(c)) || candidates[0];
        const left = spot.left;
        const top = spot.top;

        hintFingerEl.style.cssText = `
            position: fixed;
            left: ${left}px;
            top: ${top}px;
            z-index: 10000;
            pointer-events: none;
            animation: nudgeFinger 1s ease-in-out infinite alternate;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
        `;
        document.body.appendChild(hintFingerEl);
    }

    function clearHint() {
        if (hintTimer) window.clearTimeout(hintTimer);
        hintTimer = null;
        if (hintFingerEl) {
            hintFingerEl.remove();
            hintFingerEl = null;
        }
    }

    window.addEventListener('pointerdown', clearHint, { passive: true });

    return {
        init,
        resetHintTimer,
        clearHint,
        stop: stopParticles
    };
})();

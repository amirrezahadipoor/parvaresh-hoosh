// Living Animated World, Magic Stardust Particle Engine & Touch Physics for "پرورش هوش کودک"
// 100% Fullscreen, ZERO Scrolling for child, Fluid GSAP & Canvas Animations
window.LivingWorld = (function() {
    let stardustCanvas = null;
    let stardustCtx = null;
    let particles = [];
    let isTouchActive = false;
    let animFrameId = null;

    // Stardust Palette
    const STAR_COLORS = ['#FF4757', '#FFA502', '#2ED573', '#00D2D3', '#1E90FF', '#9B59B6', '#F1C40F', '#FF6B81'];

    function init() {
        createStardustCanvas();
        bindTouchTrail();
        animateParticles();
    }

    function createStardustCanvas() {
        if (document.getElementById('stardust-canvas')) return;
        stardustCanvas = document.createElement('canvas');
        stardustCanvas.id = 'stardust-canvas';
        stardustCanvas.style.cssText = `
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 99999;
        `;
        document.body.appendChild(stardustCanvas);
        stardustCtx = stardustCanvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!stardustCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        stardustCanvas.width = window.innerWidth * dpr;
        stardustCanvas.height = window.innerHeight * dpr;
        stardustCtx.scale(dpr, dpr);
    }

    function addParticle(x, y) {
        if (particles.length > 60) particles.shift();
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
        function onPointer(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            if (clientX !== undefined && clientY !== undefined) {
                for (let i = 0; i < 3; i++) {
                    addParticle(clientX + (Math.random() - 0.5) * 12, clientY + (Math.random() - 0.5) * 12);
                }
            }
        }

        window.addEventListener('mousemove', onPointer, { passive: true });
        window.addEventListener('touchmove', onPointer, { passive: true });
        window.addEventListener('touchstart', onPointer, { passive: true });
        window.addEventListener('mousedown', onPointer, { passive: true });
    }

    function animateParticles() {
        if (stardustCtx) {
            stardustCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

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

                // Draw Twinkling 4-Point Stardust
                stardustCtx.save();
                stardustCtx.translate(p.x, p.y);
                stardustCtx.rotate(p.rotation);
                stardustCtx.globalAlpha = p.alpha;
                stardustCtx.fillStyle = p.color;
                stardustCtx.shadowColor = p.color;
                stardustCtx.shadowBlur = 10;

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
        }
        animFrameId = requestAnimationFrame(animateParticles);
    }

    // Auto Finger Hint System for Non-readers: if inactive for 4.5 seconds, finger points to target
    let hintTimer = null;
    let hintFingerEl = null;

    function resetHintTimer(targetSelector) {
        clearHint();
        hintTimer = setTimeout(() => {
            showFingerHint(targetSelector);
        }, 4500);
    }

    function showFingerHint(targetSelector) {
        clearHint();
        const target = document.querySelector(targetSelector || '.quiz-option-btn, .adv-play-btn, .stage-play-btn');
        if (!target) return;

        const rect = target.getBoundingClientRect();
        hintFingerEl = document.createElement('div');
        hintFingerEl.className = 'magic-finger-hint';
        hintFingerEl.innerHTML = '👆';
        hintFingerEl.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2 - 20}px;
            top: ${rect.bottom + 6}px;
            font-size: 38px;
            z-index: 10000;
            pointer-events: none;
            animation: bounceFinger 1s ease-in-out infinite alternate;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
        `;
        document.body.appendChild(hintFingerEl);
    }

    function clearHint() {
        if (hintTimer) clearTimeout(hintTimer);
        hintTimer = null;
        if (hintFingerEl) {
            hintFingerEl.remove();
            hintFingerEl = null;
        }
    }

    // Reset hint on any interaction
    window.addEventListener('pointerdown', clearHint);

    return {
        init,
        resetHintTimer,
        clearHint
    };
})();

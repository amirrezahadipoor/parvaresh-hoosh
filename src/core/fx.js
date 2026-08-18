// Reward effects: confetti, stars - lightweight DOM-based
const Fx = (function() {
    function confetti(container, count) {
        container = container || document.body;
        count = count || 40;
        const colors = ['#FF6B6B', '#4ECDC4', '#F9CA24', '#A29BFE', '#F368E0', '#00B894'];
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-piece';
            p.style.cssText = `
                position: fixed;
                width: ${6 + Math.random() * 8}px;
                height: ${8 + Math.random() * 10}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                border-radius: 3px;
                z-index: 9999;
                pointer-events: none;
                opacity: 0.9;
            `;
            frag.appendChild(p);
            const dur = 1800 + Math.random() * 1500;
            const delay = Math.random() * 600;
            p.animate([
                { transform: `translate(0, 0) rotate(0)`, opacity: 1 },
                { transform: `translate(${(Math.random() - 0.5) * 300}px, ${window.innerHeight * (0.7 + Math.random() * 0.4)}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0.8 },
                { transform: `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight * 1.1}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
            ], { duration: dur, delay, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)', fill: 'forwards' });
            setTimeout(() => p.remove(), dur + delay + 100);
        }
        container.appendChild(frag);
    }

    function stars(container, count) {
        container = container || document.body;
        count = count || 3;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const s = document.createElement('div');
            s.className = 'star-pop';
            s.style.cssText = `
                position: fixed;
                font-size: ${34 + Math.random() * 24}px;
                left: ${35 + Math.random() * 30}vw;
                top: 30vh;
                z-index: 9999;
                pointer-events: none;
                color: #F9CA24;
                text-shadow: 0 2px 6px rgba(0,0,0,0.2);
            `;
            s.textContent = '★';
            frag.appendChild(s);
            const dur = 900 + Math.random() * 500;
            const delay = i * 150;
            s.animate([
                { transform: 'scale(0.2) rotate(-30deg)', opacity: 0 },
                { transform: 'scale(1.3) rotate(10deg)', opacity: 1 },
                { transform: 'scale(0.9) rotate(0deg)', opacity: 1 },
                { transform: `translateY(-80px) scale(1.1)`, opacity: 0 }
            ], { duration: dur, delay, easing: 'ease-out', fill: 'forwards' });
            setTimeout(() => s.remove(), dur + delay + 100);
        }
        container.appendChild(frag);
    }

    function shake(element) {
        if (!element) return;
        element.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-8px)' },
            { transform: 'translateX(8px)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' }
        ], { duration: 400, easing: 'ease-in-out' });
    }

    function pop(element) {
        if (!element) return;
        element.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.15)' },
            { transform: 'scale(1)' }
        ], { duration: 350, easing: 'ease-out' });
    }

    return { confetti, stars, shake, pop };
})();

// Khanak the Fox - SVG mascot component
const Mascot = (function() {
    // Return SVG markup for the fox with an expression
    function svg(size, mood, id) {
        size = size || 120;
        const s = size;
        // mood: happy | thinking | surprised | proud | sad | idle
        const eye = (mood === 'sad') ? 'M7 4 L11 7 M11 4 L7 7' : 'M7 5 Q9 3 11 5';
        const mouth =
            mood === 'happy' ? 'M7 11 Q9 14 11 11' :
            mood === 'surprised' ? 'circle' :
            mood === 'thinking' ? 'M7 11 L11 11' :
            mood === 'sad' ? 'M7 11 Q9 9 11 11' : 'M7.5 11.5 Q9 13 10.5 11.5';
        const pupils = (mood === 'thinking') ? 'M8.5 6.5 a0.8 0.8 0 1 0 0.01 0' : '';
        return `
        <svg id="${id || 'mascot-svg'}" width="${s}" height="${s}" viewBox="0 0 32 32" aria-hidden="true">
            <!-- tail -->
            <path d="M25 24 Q31 26 29 21 Q28 18 25 20 Q23 22 25 24Z" fill="#FFF3E0" stroke="#E17055" stroke-width="1"/>
            <!-- ears -->
            <path d="M6 12 L4 4 L11 8 Z" fill="#E17055"/>
            <path d="M26 12 L28 4 L21 8 Z" fill="#E17055"/>
            <path d="M7 10 L6.5 6 L10 8.5 Z" fill="#FFE0C7"/>
            <path d="M25 10 L25.5 6 L22 8.5 Z" fill="#FFE0C7"/>
            <!-- head -->
            <ellipse cx="16" cy="17" rx="11" ry="9" fill="#E17055"/>
            <!-- face patches -->
            <ellipse cx="11" cy="19" rx="4" ry="3" fill="#FFF3E0"/>
            <ellipse cx="21" cy="19" rx="4" ry="3" fill="#FFF3E0"/>
            <path d="M13 20 Q16 24 19 20 Q16 26 13 20Z" fill="#FFF3E0"/>
            <!-- eyes -->
            <g stroke="#2D3436" stroke-width="1.2" fill="none">
                <path d="M8 6 Q9.5 4 11 6" transform="translate(1 2)"/>
                <path d="M19 6 Q20.5 4 22 6" transform="translate(1 2)"/>
            </g>
            <circle cx="10.2" cy="8.6" r="1" fill="#2D3436"/>
            <circle cx="20.8" cy="8.6" r="1" fill="#2D3436"/>
            ${mood === 'thinking' ? '<circle cx="10.2" cy="8.6" r="0.4" fill="#FFF"/><circle cx="20.8" cy="8.6" r="0.4" fill="#FFF"/>' : ''}
            <!-- nose -->
            <ellipse cx="16" cy="13.5" rx="1.2" ry="0.9" fill="#2D3436"/>
            <!-- mouth -->
            ${mouth === 'circle'
                ? '<circle cx="16" cy="16.5" r="1.6" fill="#2D3436"/>'
                : `<path d="${mouth}" stroke="#2D3436" stroke-width="1" fill="none"/>`}
            <!-- cheeks -->
            <circle cx="8.5" cy="12.5" r="1.2" fill="#FF9F8A" opacity="0.7"/>
            <circle cx="23.5" cy="12.5" r="1.2" fill="#FF9F8A" opacity="0.7"/>
            <!-- glasses -->
            <g stroke="#6C5CE7" stroke-width="1" fill="none">
                <circle cx="10.5" cy="8.6" r="3"/>
                <circle cx="21.5" cy="8.6" r="3"/>
                <line x1="13.5" y1="8.6" x2="18.5" y2="8.6"/>
            </g>
            <!-- body hint -->
            <path d="M10 24 Q16 27 22 24 L22 30 Q16 32 10 30Z" fill="#E17055" opacity="0.6"/>
        </svg>`;
    }

    // Speech bubble element
    function bubble(text) {
        const el = document.createElement('div');
        el.className = 'speech-bubble';
        el.textContent = text;
        return el;
    }

    // Animate: bounce
    function bounce(el) {
        if (!el) return;
        el.style.transition = 'transform 0.4s ease';
        el.style.transform = 'scale(1.12)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    }

    // Celebrate: wiggle + jump
    function celebrate(el) {
        if (!el) return;
        const steps = [
            'translateY(0) rotate(0)', 'translateY(-14px) rotate(-8deg)',
            'translateY(0) rotate(8deg)', 'translateY(-8px) rotate(-4deg)', 'translateY(0) rotate(0)'
        ];
        steps.forEach((tr, i) => {
            setTimeout(() => { el.style.transform = tr; }, i * 120);
        });
    }

    return { svg, bubble, bounce, celebrate };
})();

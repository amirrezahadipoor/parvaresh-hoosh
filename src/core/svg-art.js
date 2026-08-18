// High-Precision SVG Art & Asset Library for "پرورش هوش کودک"
// 100% Custom Vector Art, Zero Emojis, Zero Copyrighted External Images, Responsive
window.SvgArt = (function() {

    function wrap(content, size, vbW, vbH) {
        size = size || 80;
        const w = size;
        const h = vbH && vbW ? Math.round(size * (vbH / vbW)) : size;
        const vW = vbW || 100;
        const vH = vbH || 100;
        return `<svg width="${w}" height="${h}" viewBox="0 0 ${vW} ${vH}" style="overflow:visible;" aria-hidden="true">${content}</svg>`;
    }

    // ==========================================
    // 1. GEOMETRIC SHAPES
    // ==========================================
    function shape(kind, color, size) {
        const c = color || '#FF5252';
        switch (kind) {
            case 'circle':
                return wrap(`
                    <circle cx="50" cy="50" r="42" fill="${c}" stroke="#2D3436" stroke-width="3"/>
                    <circle cx="36" cy="36" r="8" fill="#FFF" opacity="0.45"/>
                    <circle cx="40" cy="50" r="3.5" fill="#2D3436"/>
                    <circle cx="60" cy="50" r="3.5" fill="#2D3436"/>
                    <path d="M44 60 Q50 66 56 60" stroke="#2D3436" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size);

            case 'square':
                return wrap(`
                    <rect x="12" y="12" width="76" height="76" rx="14" fill="${c}" stroke="#2D3436" stroke-width="3"/>
                    <rect x="20" y="20" width="20" height="20" rx="5" fill="#FFF" opacity="0.4"/>
                    <circle cx="40" cy="50" r="3.5" fill="#2D3436"/>
                    <circle cx="60" cy="50" r="3.5" fill="#2D3436"/>
                    <path d="M44 60 Q50 66 56 60" stroke="#2D3436" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size);

            case 'triangle':
                return wrap(`
                    <path d="M50 14 L88 84 A6 6 0 0 1 82 90 L18 90 A6 6 0 0 1 12 84 Z" fill="${c}" stroke="#2D3436" stroke-width="3" stroke-linejoin="round"/>
                    <circle cx="42" cy="62" r="3" fill="#2D3436"/>
                    <circle cx="58" cy="62" r="3" fill="#2D3436"/>
                    <path d="M46 70 Q50 74 54 70" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'diamond':
                return wrap(`
                    <path d="M50 10 L88 50 L50 90 L12 50 Z" fill="${c}" stroke="#2D3436" stroke-width="3" stroke-linejoin="round"/>
                    <circle cx="42" cy="50" r="3.5" fill="#2D3436"/>
                    <circle cx="58" cy="50" r="3.5" fill="#2D3436"/>
                    <path d="M46 58 Q50 63 54 58" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'star':
                return wrap(`
                    <path d="M50 10 L61 36 L90 38 L68 56 L75 86 L50 70 L25 86 L32 56 L10 38 L39 36 Z" fill="${c || '#F1C40F'}" stroke="#D35400" stroke-width="2.5" stroke-linejoin="round"/>
                    <circle cx="42" cy="48" r="3" fill="#2D3436"/>
                    <circle cx="58" cy="48" r="3" fill="#2D3436"/>
                    <path d="M46 56 Q50 61 54 56" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'heart':
                return wrap(`
                    <path d="M50 82 Q16 56 16 34 A18 18 0 0 1 50 30 A18 18 0 0 1 84 34 Q84 56 50 82 Z" fill="${c || '#FF5252'}" stroke="#C0392B" stroke-width="2.5"/>
                    <circle cx="42" cy="46" r="3" fill="#2D3436"/>
                    <circle cx="58" cy="46" r="3" fill="#2D3436"/>
                    <path d="M46 55 Q50 60 54 55" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            default:
                return wrap(`<circle cx="50" cy="50" r="40" fill="${c}"/>`, size);
        }
    }

    // ==========================================
    // 2. NUMBER CARDS WITH SENSORY COUNTERS
    // ==========================================
    function numberCard(n, color, size) {
        size = size || 80;
        const c = color || '#00D2D3';
        const numObj = (window.NUMBERS || []).find(x => x.n === n) || { n, fa: String(n), digit: String(n) };

        const dotsCoord = {
            0: [],
            1: [[50, 44]],
            2: [[32, 44], [68, 44]],
            3: [[30, 46], [50, 30], [70, 46]],
            4: [[32, 32], [68, 32], [32, 60], [68, 60]],
            5: [[30, 30], [70, 30], [50, 45], [30, 60], [70, 60]],
            6: [[30, 26], [70, 26], [30, 45], [70, 45], [30, 64], [70, 64]],
            7: [[30, 24], [70, 24], [50, 34], [30, 48], [70, 48], [30, 66], [70, 66]],
            8: [[28, 24], [50, 24], [72, 24], [28, 45], [72, 45], [28, 66], [50, 66], [72, 66]],
            9: [[30, 24], [50, 24], [70, 24], [30, 45], [50, 45], [70, 45], [30, 66], [50, 66], [70, 66]],
            10: [[26, 24], [50, 24], [74, 24], [26, 44], [50, 44], [74, 44], [26, 64], [50, 64], [74, 64], [50, 78]]
        };

        const dotsSvg = (dotsCoord[n] || []).map(([x, y]) => `
            <circle cx="${x}" cy="${y}" r="6" fill="${c}" stroke="#FFF" stroke-width="1.5"/>
            <circle cx="${x - 1.5}" cy="${y - 1.5}" r="2" fill="#FFF" opacity="0.7"/>
        `).join('');

        return wrap(`
            <rect x="6" y="6" width="88" height="88" rx="16" fill="#FFFFFF" stroke="${c}" stroke-width="3.5"/>
            <rect x="9" y="9" width="82" height="82" rx="13" fill="${c}" opacity="0.08"/>
            ${dotsSvg}
            <rect x="30" y="66" width="40" height="22" rx="8" fill="#FFF" stroke="${c}" stroke-width="1.8"/>
            <text x="50" y="82" text-anchor="middle" font-size="16" font-weight="900" fill="${c}">${numObj.digit}</text>
        `, size);
    }

    // ==========================================
    // 3. ANIMALS (PRECISE VECTOR CRAFT)
    // ==========================================
    function animal(kind, size) {
        size = size || 80;
        switch (kind) {
            case 'cat':
                return wrap(`
                    <path d="M26 36 L18 14 L42 26 Z" fill="#F8A5C2" stroke="#2D3436" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M74 36 L82 14 L58 26 Z" fill="#F8A5C2" stroke="#2D3436" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M28 32 L22 18 L38 26 Z" fill="#FFD1DC"/>
                    <path d="M72 32 L78 18 L62 26 Z" fill="#FFD1DC"/>
                    <ellipse cx="50" cy="56" rx="34" ry="28" fill="#F8A5C2" stroke="#2D3436" stroke-width="2.5"/>
                    <ellipse cx="36" cy="50" rx="5" ry="6" fill="#2D3436"/>
                    <circle cx="34.5" cy="48" r="2" fill="#FFF"/>
                    <ellipse cx="64" cy="50" rx="5" ry="6" fill="#2D3436"/>
                    <circle cx="62.5" cy="48" r="2" fill="#FFF"/>
                    <circle cx="25" cy="58" r="5" fill="#FF7675" opacity="0.5"/>
                    <circle cx="75" cy="58" r="5" fill="#FF7675" opacity="0.5"/>
                    <path d="M47 58 L53 58 L50 62 Z" fill="#E84393"/>
                    <path d="M44 64 Q50 69 56 64" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <line x1="14" y1="54" x2="28" y2="56" stroke="#2D3436" stroke-width="2" stroke-linecap="round"/>
                    <line x1="14" y1="62" x2="28" y2="60" stroke="#2D3436" stroke-width="2" stroke-linecap="round"/>
                    <line x1="86" y1="54" x2="72" y2="56" stroke="#2D3436" stroke-width="2" stroke-linecap="round"/>
                    <line x1="86" y1="62" x2="72" y2="60" stroke="#2D3436" stroke-width="2" stroke-linecap="round"/>
                `, size);

            case 'dog':
                return wrap(`
                    <ellipse cx="20" cy="48" rx="10" ry="22" fill="#A0522D" stroke="#2D3436" stroke-width="2.5" transform="rotate(-15 20 48)"/>
                    <ellipse cx="80" cy="48" rx="10" ry="22" fill="#A0522D" stroke="#2D3436" stroke-width="2.5" transform="rotate(15 80 48)"/>
                    <ellipse cx="50" cy="54" rx="32" ry="28" fill="#F5CD79" stroke="#2D3436" stroke-width="2.5"/>
                    <ellipse cx="36" cy="48" rx="10" ry="12" fill="#ECCC68"/>
                    <circle cx="36" cy="48" r="4.5" fill="#2D3436"/>
                    <circle cx="34.5" cy="46" r="1.6" fill="#FFF"/>
                    <circle cx="64" cy="48" r="4.5" fill="#2D3436"/>
                    <circle cx="62.5" cy="46" r="1.6" fill="#FFF"/>
                    <ellipse cx="50" cy="64" rx="14" ry="10" fill="#FFF3D1"/>
                    <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#2D3436"/>
                    <path d="M50 62 L50 67 M45 67 Q50 71 55 67" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <circle cx="28" cy="58" r="4" fill="#FF7675" opacity="0.4"/>
                    <circle cx="72" cy="58" r="4" fill="#FF7675" opacity="0.4"/>
                `, size);

            case 'rabbit':
                return wrap(`
                    <ellipse cx="36" cy="22" rx="9" ry="22" fill="#FFF" stroke="#2D3436" stroke-width="2.5"/>
                    <ellipse cx="36" cy="22" rx="5" ry="16" fill="#FFB8B8"/>
                    <ellipse cx="64" cy="22" rx="9" ry="22" fill="#FFF" stroke="#2D3436" stroke-width="2.5"/>
                    <ellipse cx="64" cy="22" rx="5" ry="16" fill="#FFB8B8"/>
                    <ellipse cx="50" cy="60" rx="32" ry="28" fill="#FFFFFF" stroke="#2D3436" stroke-width="2.5"/>
                    <circle cx="38" cy="56" r="4.5" fill="#2D3436"/><circle cx="36.5" cy="54" r="1.8" fill="#FFF"/>
                    <circle cx="62" cy="56" r="4.5" fill="#2D3436"/><circle cx="60.5" cy="54" r="1.8" fill="#FFF"/>
                    <circle cx="26" cy="62" r="5.5" fill="#FF7675" opacity="0.55"/>
                    <circle cx="74" cy="62" r="5.5" fill="#FF7675" opacity="0.55"/>
                    <ellipse cx="50" cy="62" rx="3" ry="2.2" fill="#FF7675"/>
                    <path d="M46 66 Q50 70 54 66" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <rect x="47.5" y="68" width="5" height="4" rx="1" fill="#FFF" stroke="#2D3436" stroke-width="1.5"/>
                `, size);

            case 'fish':
                return wrap(`
                    <path d="M20 50 Q45 20 80 50 Q45 80 20 50 Z" fill="#55EFC4" stroke="#2D3436" stroke-width="2.5"/>
                    <path d="M20 50 L4 32 L8 50 L4 68 Z" fill="#00B894" stroke="#2D3436" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M50 32 Q60 18 70 32" stroke="#00B894" stroke-width="4" stroke-linecap="round" fill="none"/>
                    <path d="M50 68 Q60 82 70 68" stroke="#00B894" stroke-width="4" stroke-linecap="round" fill="none"/>
                    <circle cx="68" cy="44" r="5" fill="#2D3436"/>
                    <circle cx="66.5" cy="42.5" r="2" fill="#FFF"/>
                    <path d="M80 50 Q75 54 80 56" stroke="#2D3436" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size);

            case 'butterfly':
                return wrap(`
                    <ellipse cx="32" cy="38" rx="20" ry="18" fill="#F368E0" stroke="#2D3436" stroke-width="2"/>
                    <circle cx="32" cy="38" r="8" fill="#FFEAA7"/>
                    <ellipse cx="68" cy="38" rx="20" ry="18" fill="#F368E0" stroke="#2D3436" stroke-width="2"/>
                    <circle cx="68" cy="38" r="8" fill="#FFEAA7"/>
                    <ellipse cx="34" cy="64" rx="14" ry="14" fill="#FF9FF3" stroke="#2C3A47" stroke-width="2"/>
                    <ellipse cx="66" cy="64" rx="14" ry="14" fill="#FF9FF3" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M48 28 Q42 12 36 14 M52 28 Q58 12 64 14" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                    <rect x="46" y="26" width="8" height="48" rx="4" fill="#6C5CE7" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            default:
                return wrap(window.Mascot ? window.Mascot.svg(size, 'happy') : '<circle cx="50" cy="50" r="30" fill="#FF7675"/>', size);
        }
    }

    // ==========================================
    // 4. OBJECTS, FRUITS & PROPS
    // ==========================================
    function object(kind, size) {
        size = size || 80;
        switch (kind) {
            case 'apple':
                return wrap(`
                    <path d="M50 28 Q48 12 56 10" stroke="#795548" stroke-width="3.5" stroke-linecap="round" fill="none"/>
                    <path d="M54 14 Q68 12 64 24 Q54 24 54 14 Z" fill="#2ED573" stroke="#2D3436" stroke-width="1.5"/>
                    <path d="M50 32 Q20 20 18 52 Q16 84 50 86 Q84 84 82 52 Q80 20 50 32 Z" fill="#FF4757" stroke="#2D3436" stroke-width="2.5"/>
                    <path d="M30 38 Q24 48 24 60" stroke="#FFF" stroke-width="4" stroke-linecap="round" opacity="0.45" fill="none"/>
                    <circle cx="42" cy="52" r="3" fill="#2D3436"/>
                    <circle cx="58" cy="52" r="3" fill="#2D3436"/>
                    <path d="M46 60 Q50 64 54 60" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'banana':
                return wrap(`
                    <path d="M22 28 Q10 68 46 84 Q72 94 84 76 Q88 64 78 54 Q68 44 54 50 Q40 56 36 46 Q30 36 24 24 Z" fill="#FFEAA7" stroke="#2D3436" stroke-width="2.5"/>
                    <path d="M22 28 Q14 20 18 16 Q24 16 26 22 Z" fill="#795548"/>
                    <circle cx="52" cy="60" r="3" fill="#2D3436"/>
                    <path d="M58 66 Q64 68 68 62" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'balloon':
                return wrap(`
                    <path d="M50 82 L46 88 L54 88 Z" fill="#FF4757" stroke="#2D3436" stroke-width="2"/>
                    <path d="M50 88 Q46 96 52 104" stroke="#A4B0BE" stroke-width="2" fill="none"/>
                    <ellipse cx="50" cy="46" rx="34" ry="38" fill="#FF4757" stroke="#2D3436" stroke-width="2.5"/>
                    <path d="M30 30 Q24 44 26 56" stroke="#FFF" stroke-width="4" stroke-linecap="round" opacity="0.5" fill="none"/>
                `, size, 100, 110);

            case 'ball':
                return wrap(`
                    <circle cx="50" cy="50" r="40" fill="#3867D6" stroke="#2D3436" stroke-width="2.5"/>
                    <path d="M50 10 A40 40 0 0 1 90 50" fill="#FF4757" stroke="#2D3436" stroke-width="2.5"/>
                    <path d="M50 90 A40 40 0 0 1 10 50" fill="#FFA502" stroke="#2D3436" stroke-width="2.5"/>
                    <path d="M50 10 L50 90 M10 50 L90 50" stroke="#FFF" stroke-width="3"/>
                `, size);

            case 'car':
                return wrap(`
                    <path d="M14 62 L24 42 Q28 32 40 32 L76 32 Q88 32 94 42 L106 62 Z" fill="#FF4757" stroke="#2D3436" stroke-width="2.5"/>
                    <rect x="10" y="58" width="104" height="16" rx="6" fill="#FF6B81" stroke="#2D3436" stroke-width="2.5"/>
                    <rect x="36" y="38" width="22" height="16" rx="3" fill="#E0F7FA" stroke="#2D3436" stroke-width="1.8"/>
                    <rect x="64" y="38" width="22" height="16" rx="3" fill="#E0F7FA" stroke="#2D3436" stroke-width="1.8"/>
                    <circle cx="34" cy="74" r="10" fill="#2D3436"/>
                    <circle cx="34" cy="74" r="4.5" fill="#FFF"/>
                    <circle cx="90" cy="74" r="10" fill="#2D3436"/>
                    <circle cx="90" cy="74" r="4.5" fill="#FFF"/>
                `, size, 120, 90);

            case 'gift':
                return wrap(`
                    <rect x="18" y="38" width="64" height="50" rx="6" fill="#FF4757" stroke="#2D3436" stroke-width="2.5"/>
                    <rect x="12" y="30" width="76" height="14" rx="4" fill="#FF6B81" stroke="#2D3436" stroke-width="2.5"/>
                    <rect x="44" y="30" width="12" height="58" fill="#F9CA24"/>
                `, size);

            case 'tooth':
                return wrap(`
                    <path d="M26 34 Q18 58 30 78 Q38 88 42 76 Q46 64 50 64 Q54 64 58 76 Q62 88 70 78 Q82 58 74 34 Q68 18 50 18 Q32 18 26 34 Z" fill="#FFFFFF" stroke="#2D3436" stroke-width="2.5"/>
                    <circle cx="40" cy="42" r="3" fill="#2D3436"/>
                    <circle cx="60" cy="42" r="3" fill="#2D3436"/>
                    <path d="M44 50 Q50 55 56 50" stroke="#2D3436" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            default:
                return wrap(`<rect x="10" y="10" width="80" height="80" rx="16" fill="#00D2D3"/>`, size);
        }
    }

    return { shape, numberCard, animal, object };
})();

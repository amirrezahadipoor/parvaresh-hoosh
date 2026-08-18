// Programmatic SVG Art Library - Kid-Friendly High-Fidelity Vector Graphics
// 100% Vector, Scalable, Programmatically Rendered, Zero Copyrighted External Images
window.SvgArt = (function() {

    // Helper for crisp SVG wrapper.
    // Every illustration gets a soft contact shadow and a very subtle top-light
    // sheen. Both are applied here rather than inside each of the 125 drawings so
    // the whole set gains depth consistently instead of looking like flat clip-art.
    // The drop-shadow gives every illustration a soft contact shadow so the set
    // reads as dimensional rather than flat clip-art. Applied here, at the single
    // wrapper, so all 125 drawings gain depth consistently.
    // NOTE: an earlier version also painted a full-viewBox radial "sheen" rect on
    // top. Because the CSS filter applies to the whole SVG, that translucent rect
    // cast its own shadow and showed up as a grey smudge above every icon. Per-shape
    // highlights (already present in each drawing) are the correct way to do this.
    function wrap(content, size, vbW, vbH) {
        size = size || 80;
        const w = size;
        const h = vbH && vbW ? Math.round(size * (vbH / vbW)) : size;
        const vW = vbW || 100;
        const vH = vbH || 100;
        const style = 'overflow:visible;filter:drop-shadow(0 2px 1.5px rgba(20,26,38,.18));';
        return `<svg width="${w}" height="${h}" viewBox="0 0 ${vW} ${vH}" style="${style}" aria-hidden="true">${content}</svg>`;
    }

    // ==========================================
    // 1. GEOMETRIC SHAPES (اشکال هندسی کارتونی)
    // ==========================================
    function shape(kind, color, size) {
        const c = color || '#FF6B6B';
        switch (kind) {
            case 'circle':
                return wrap(`
                    <circle cx="50" cy="50" r="44" fill="${c}" stroke="#2C3A47" stroke-width="3"/>
                    <circle cx="36" cy="36" r="8" fill="#FFF" opacity="0.45"/>
                    <circle cx="38" cy="50" r="3.5" fill="#2C3A47"/>
                    <circle cx="62" cy="50" r="3.5" fill="#2C3A47"/>
                    <path d="M43 62 Q50 69 57 62" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size);

            case 'square':
                return wrap(`
                    <rect x="10" y="10" width="80" height="80" rx="14" fill="${c}" stroke="#2C3A47" stroke-width="3"/>
                    <rect x="20" y="20" width="22" height="22" rx="6" fill="#FFF" opacity="0.4"/>
                    <circle cx="38" cy="50" r="3.5" fill="#2C3A47"/>
                    <circle cx="62" cy="50" r="3.5" fill="#2C3A47"/>
                    <path d="M43 62 Q50 69 57 62" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size);

            case 'triangle':
                return wrap(`
                    <path d="M50 10 L90 86 A8 8 0 0 1 82 92 L18 92 A8 8 0 0 1 10 86 Z" fill="${c}" stroke="#2C3A47" stroke-width="3" stroke-linejoin="round"/>
                    <path d="M50 25 L74 76 L26 76 Z" fill="#FFF" opacity="0.25"/>
                    <circle cx="42" cy="62" r="3" fill="#2C3A47"/>
                    <circle cx="58" cy="62" r="3" fill="#2C3A47"/>
                    <path d="M46 72 Q50 76 54 72" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'rectangle':
                return wrap(`
                    <rect x="8" y="20" width="124" height="64" rx="14" fill="${c}" stroke="#2C3A47" stroke-width="3"/>
                    <rect x="18" y="28" width="20" height="20" rx="5" fill="#FFF" opacity="0.4"/>
                    <circle cx="56" cy="52" r="3.5" fill="#2C3A47"/>
                    <circle cx="84" cy="52" r="3.5" fill="#2C3A47"/>
                    <path d="M64 62 Q70 68 76 62" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size, 140, 100);

            case 'oval':
                return wrap(`
                    <ellipse cx="65" cy="50" rx="56" ry="38" fill="${c}" stroke="#2C3A47" stroke-width="3"/>
                    <ellipse cx="48" cy="36" rx="14" ry="8" fill="#FFF" opacity="0.4"/>
                    <circle cx="52" cy="52" r="3.5" fill="#2C3A47"/>
                    <circle cx="78" cy="52" r="3.5" fill="#2C3A47"/>
                    <path d="M60 62 Q65 68 70 62" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size, 130, 100);

            case 'diamond':
                return wrap(`
                    <path d="M50 8 L90 50 L50 92 L10 50 Z" fill="${c}" stroke="#2C3A47" stroke-width="3" stroke-linejoin="round"/>
                    <path d="M50 24 L76 50 L50 76 L24 50 Z" fill="#FFF" opacity="0.3"/>
                    <circle cx="42" cy="50" r="3.5" fill="#2C3A47"/>
                    <circle cx="58" cy="50" r="3.5" fill="#2C3A47"/>
                    <path d="M46 60 Q50 65 54 60" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'star':
                return wrap(`
                    <path d="M50 8 L61 36 L92 38 L68 58 L76 90 L50 72 L24 90 L32 58 L8 38 L39 36 Z" fill="${c || '#F9CA24'}" stroke="#E67E22" stroke-width="3" stroke-linejoin="round"/>
                    <circle cx="42" cy="48" r="3" fill="#2C3A47"/>
                    <circle cx="58" cy="48" r="3" fill="#2C3A47"/>
                    <path d="M46 58 Q50 63 54 58" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'heart':
                return wrap(`
                    <path d="M50 82 Q12 56 12 32 A20 20 0 0 1 50 28 A20 20 0 0 1 88 32 Q88 56 50 82 Z" fill="${c || '#FF6B6B'}" stroke="#D63031" stroke-width="3"/>
                    <circle cx="36" cy="38" r="3" fill="#FFF" opacity="0.6"/>
                    <circle cx="42" cy="48" r="3" fill="#2C3A47"/>
                    <circle cx="58" cy="48" r="3" fill="#2C3A47"/>
                    <path d="M46 57 Q50 62 54 57" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            default:
                return wrap(`<circle cx="50" cy="50" r="40" fill="${c}"/>`, size);
        }
    }

    // ==========================================
    // 2. NUMBER CARDS (کارت‌های عددی با مهره‌های حسی)
    // ==========================================
    function numberCard(n, color, size) {
        size = size || 90;
        const c = color || '#FF6B6B';
        const numObj = (window.NUMBERS || []).find(x => x.n === n) || { n, fa: String(n), digit: String(n) };

        const dotCoordinates = {
            0: [],
            1: [[50, 48]],
            2: [[32, 48], [68, 48]],
            3: [[30, 48], [50, 32], [70, 48]],
            4: [[32, 32], [68, 32], [32, 64], [68, 64]],
            5: [[30, 30], [70, 30], [50, 48], [30, 66], [70, 66]],
            6: [[30, 28], [70, 28], [30, 48], [70, 48], [30, 68], [70, 68]],
            7: [[30, 26], [70, 26], [50, 38], [30, 50], [70, 50], [30, 72], [70, 72]],
            8: [[28, 26], [50, 26], [72, 26], [28, 48], [72, 48], [28, 70], [50, 70], [72, 70]],
            9: [[30, 26], [50, 26], [70, 26], [30, 48], [50, 48], [70, 48], [30, 70], [50, 70], [70, 70]],
            10: [[26, 24], [50, 24], [74, 24], [26, 44], [50, 44], [74, 44], [26, 64], [50, 64], [74, 64], [50, 80]]
        };

        const dots = (dotCoordinates[n] || []).map(([x, y]) => `
            <circle cx="${x}" cy="${y}" r="6.5" fill="${c}" stroke="#FFF" stroke-width="1.5"/>
            <circle cx="${x - 1.5}" cy="${y - 1.5}" r="2" fill="#FFF" opacity="0.7"/>
        `).join('');

        return wrap(`
            <rect x="5" y="5" width="90" height="90" rx="18" fill="#FFFFFF" stroke="${c}" stroke-width="4"/>
            <rect x="9" y="9" width="82" height="82" rx="14" fill="${c}" opacity="0.08"/>
            ${dots}
            <rect x="30" y="66" width="40" height="24" rx="8" fill="#FFF" stroke="${c}" stroke-width="2"/>
            <text x="50" y="83" text-anchor="middle" font-size="18" font-weight="900" fill="${c}">${numObj.digit}</text>
        `, size);
    }

    // ==========================================
    // 3. ANIMALS (حیوانات کارتونی دوست‌داشتنی)
    // ==========================================
    function animal(kind, size) {
        size = size || 90;
        switch (kind) {
            case 'cat':
                return wrap(`
                    <path d="M26 36 L18 14 L42 26 Z" fill="#F8A5C2" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M74 36 L82 14 L58 26 Z" fill="#F8A5C2" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M28 32 L22 18 L38 26 Z" fill="#FFD1DC"/>
                    <path d="M72 32 L78 18 L62 26 Z" fill="#FFD1DC"/>
                    <ellipse cx="50" cy="56" rx="34" ry="28" fill="#F8A5C2" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="36" cy="50" rx="5" ry="6" fill="#2C3A47"/>
                    <circle cx="34.5" cy="48" r="2" fill="#FFF"/>
                    <ellipse cx="64" cy="50" rx="5" ry="6" fill="#2C3A47"/>
                    <circle cx="62.5" cy="48" r="2" fill="#FFF"/>
                    <circle cx="25" cy="58" r="5" fill="#FF7675" opacity="0.5"/>
                    <circle cx="75" cy="58" r="5" fill="#FF7675" opacity="0.5"/>
                    <path d="M47 58 L53 58 L50 62 Z" fill="#E84393"/>
                    <path d="M44 64 Q50 69 56 64" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <line x1="14" y1="54" x2="28" y2="56" stroke="#2C3A47" stroke-width="2" stroke-linecap="round"/>
                    <line x1="14" y1="62" x2="28" y2="60" stroke="#2C3A47" stroke-width="2" stroke-linecap="round"/>
                    <line x1="86" y1="54" x2="72" y2="56" stroke="#2C3A47" stroke-width="2" stroke-linecap="round"/>
                    <line x1="86" y1="62" x2="72" y2="60" stroke="#2C3A47" stroke-width="2" stroke-linecap="round"/>
                `, size);

            case 'dog':
                return wrap(`
                    <ellipse cx="20" cy="48" rx="10" ry="22" fill="#A0522D" stroke="#2C3A47" stroke-width="2.5" transform="rotate(-15 20 48)"/>
                    <ellipse cx="80" cy="48" rx="10" ry="22" fill="#A0522D" stroke="#2C3A47" stroke-width="2.5" transform="rotate(15 80 48)"/>
                    <ellipse cx="50" cy="54" rx="32" ry="28" fill="#F5CD79" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="36" cy="48" rx="10" ry="12" fill="#ECCC68"/>
                    <circle cx="36" cy="48" r="4.5" fill="#2C3A47"/>
                    <circle cx="34.5" cy="46" r="1.6" fill="#FFF"/>
                    <circle cx="64" cy="48" r="4.5" fill="#2C3A47"/>
                    <circle cx="62.5" cy="46" r="1.6" fill="#FFF"/>
                    <ellipse cx="50" cy="64" rx="14" ry="10" fill="#FFF3D1"/>
                    <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#2C3A47"/>
                    <path d="M50 62 L50 67 M45 67 Q50 71 55 67" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <circle cx="28" cy="58" r="4" fill="#FF7675" opacity="0.4"/>
                    <circle cx="72" cy="58" r="4" fill="#FF7675" opacity="0.4"/>
                `, size);

            case 'rabbit':
                return wrap(`
                    <ellipse cx="36" cy="24" rx="9" ry="22" fill="#FFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="36" cy="24" rx="5" ry="16" fill="#FFB8B8"/>
                    <ellipse cx="64" cy="24" rx="9" ry="22" fill="#FFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="64" cy="24" rx="5" ry="16" fill="#FFB8B8"/>
                    <ellipse cx="50" cy="62" rx="30" ry="26" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="38" cy="58" r="4.5" fill="#2C3A47"/>
                    <circle cx="36.5" cy="56" r="1.8" fill="#FFF"/>
                    <circle cx="62" cy="58" r="4.5" fill="#2C3A47"/>
                    <circle cx="60.5" cy="56" r="1.8" fill="#FFF"/>
                    <circle cx="26" cy="64" r="5.5" fill="#FF7675" opacity="0.55"/>
                    <circle cx="74" cy="64" r="5.5" fill="#FF7675" opacity="0.55"/>
                    <ellipse cx="50" cy="64" rx="3" ry="2.2" fill="#FF7675"/>
                    <path d="M46 68 Q50 72 54 68" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <rect x="47.5" y="70" width="5" height="4" rx="1" fill="#FFF" stroke="#2C3A47" stroke-width="1.5"/>
                `, size);

            case 'lion':
                return wrap(`
                    <circle cx="50" cy="52" r="42" fill="#E67E22" stroke="#D35400" stroke-width="3"/>
                    <path d="M50 10 L56 20 L66 12 L70 24 L82 20 L82 32 L94 34 L88 46 L98 52 L88 58 L94 70 L82 72 L82 84 L70 80 L66 92 L56 84 L50 94 L44 84 L34 92 L30 80 L18 84 L18 72 L6 70 L12 58 L2 52 L12 46 L6 34 L18 32 L18 20 L30 24 L34 12 L44 20 Z" fill="#F39C12"/>
                    <circle cx="28" cy="30" r="8" fill="#F1C40F" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="72" cy="30" r="8" fill="#F1C40F" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="50" cy="54" r="28" fill="#F1C40F" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="50" cy="62" rx="12" ry="8" fill="#FEF5D3"/>
                    <circle cx="40" cy="48" r="4.5" fill="#2C3A47"/>
                    <circle cx="38.5" cy="46" r="1.6" fill="#FFF"/>
                    <circle cx="60" cy="48" r="4.5" fill="#2C3A47"/>
                    <circle cx="58.5" cy="46" r="1.6" fill="#FFF"/>
                    <path d="M46 58 L54 58 L50 63 Z" fill="#8E44AD"/>
                    <path d="M44 66 Q50 71 56 66" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <circle cx="30" cy="56" r="4" fill="#FF7675" opacity="0.5"/>
                    <circle cx="70" cy="56" r="4" fill="#FF7675" opacity="0.5"/>
                `, size);

            case 'elephant':
                return wrap(`
                    <ellipse cx="20" cy="50" rx="16" ry="22" fill="#74B9FF" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="20" cy="50" rx="10" ry="14" fill="#A4D4FF"/>
                    <ellipse cx="80" cy="50" rx="16" ry="22" fill="#74B9FF" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="80" cy="50" rx="10" ry="14" fill="#A4D4FF"/>
                    <circle cx="50" cy="52" r="28" fill="#74B9FF" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="38" cy="46" r="4" fill="#2C3A47"/>
                    <circle cx="36.8" cy="44.5" r="1.5" fill="#FFF"/>
                    <circle cx="62" cy="46" r="4" fill="#2C3A47"/>
                    <circle cx="60.8" cy="44.5" r="1.5" fill="#FFF"/>
                    <path d="M46 54 Q44 76 56 82 Q64 82 60 74 Q52 72 52 54 Z" fill="#74B9FF" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M46 64 Q50 67 52 64" stroke="#0984E3" stroke-width="2"/>
                    <path d="M47 70 Q51 73 54 70" stroke="#0984E3" stroke-width="2"/>
                    <circle cx="30" cy="56" r="4" fill="#FF7675" opacity="0.5"/>
                    <circle cx="70" cy="56" r="4" fill="#FF7675" opacity="0.5"/>
                `, size);

            case 'bear':
                return wrap(`
                    <circle cx="26" cy="28" r="11" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="26" cy="28" r="6" fill="#D2996E"/>
                    <circle cx="74" cy="28" r="11" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="74" cy="28" r="6" fill="#D2996E"/>
                    <circle cx="50" cy="54" r="30" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="50" cy="62" rx="14" ry="10" fill="#E8C39E"/>
                    <circle cx="38" cy="46" r="4" fill="#2C3A47"/>
                    <circle cx="36.8" cy="44.5" r="1.4" fill="#FFF"/>
                    <circle cx="62" cy="46" r="4" fill="#2C3A47"/>
                    <circle cx="60.8" cy="44.5" r="1.4" fill="#FFF"/>
                    <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#2C3A47"/>
                    <path d="M45 66 Q50 71 55 66" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <circle cx="28" cy="56" r="4" fill="#FF7675" opacity="0.4"/>
                    <circle cx="72" cy="56" r="4" fill="#FF7675" opacity="0.4"/>
                `, size);

            case 'monkey':
                return wrap(`
                    <circle cx="18" cy="50" r="12" fill="#B38054" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="18" cy="50" r="7" fill="#FFCE9E"/>
                    <circle cx="82" cy="50" r="12" fill="#B38054" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="82" cy="50" r="7" fill="#FFCE9E"/>
                    <circle cx="50" cy="50" r="30" fill="#B38054" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M30 46 Q38 34 50 44 Q62 34 70 46 Q74 68 50 72 Q26 68 30 46 Z" fill="#FFCE9E"/>
                    <circle cx="42" cy="46" r="4.5" fill="#2C3A47"/>
                    <circle cx="40.5" cy="44.5" r="1.6" fill="#FFF"/>
                    <circle cx="58" cy="46" r="4.5" fill="#2C3A47"/>
                    <circle cx="56.5" cy="44.5" r="1.6" fill="#FFF"/>
                    <circle cx="47" cy="56" r="1.5" fill="#2C3A47"/>
                    <circle cx="53" cy="56" r="1.5" fill="#2C3A47"/>
                    <path d="M42 62 Q50 70 58 62" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size);

            case 'fish':
                return wrap(`
                    <path d="M20 50 Q45 20 80 50 Q45 80 20 50 Z" fill="#55EFC4" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M20 50 L4 32 L8 50 L4 68 Z" fill="#00B894" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M50 32 Q60 18 70 32" stroke="#00B894" stroke-width="4" stroke-linecap="round" fill="none"/>
                    <path d="M50 68 Q60 82 70 68" stroke="#00B894" stroke-width="4" stroke-linecap="round" fill="none"/>
                    <circle cx="68" cy="44" r="5" fill="#2C3A47"/>
                    <circle cx="66.5" cy="42.5" r="2" fill="#FFF"/>
                    <path d="M80 50 Q75 54 80 56" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                    <path d="M48 42 Q54 48 48 54 M40 46 Q46 52 40 58" stroke="#00B894" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                    <circle cx="62" cy="52" r="3.5" fill="#FF7675" opacity="0.6"/>
                `, size);

            case 'turtle':
                return wrap(`
                    <circle cx="26" cy="38" r="7" fill="#00B894" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="74" cy="38" r="7" fill="#00B894" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="26" cy="66" r="7" fill="#00B894" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="74" cy="66" r="7" fill="#00B894" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="16" cy="52" r="4" fill="#00B894"/>
                    <circle cx="84" cy="52" r="10" fill="#00B894" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="87" cy="49" r="2.5" fill="#2C3A47"/>
                    <circle cx="86.2" cy="48.2" r="0.9" fill="#FFF"/>
                    <ellipse cx="50" cy="52" rx="30" ry="24" fill="#55EFC4" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M38 44 L62 44 L70 52 L62 60 L38 60 L30 52 Z" fill="#00B894" stroke="#2C3A47" stroke-width="1.8"/>
                `, size);

            case 'butterfly':
                return wrap(`
                    <ellipse cx="32" cy="38" rx="20" ry="18" fill="#F368E0" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="32" cy="38" r="8" fill="#FFEAA7"/>
                    <ellipse cx="68" cy="38" rx="20" ry="18" fill="#F368E0" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="68" cy="38" r="8" fill="#FFEAA7"/>
                    <ellipse cx="34" cy="64" rx="14" ry="14" fill="#FF9FF3" stroke="#2C3A47" stroke-width="2"/>
                    <ellipse cx="66" cy="64" rx="14" ry="14" fill="#FF9FF3" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M48 28 Q42 12 36 14 M52 28 Q58 12 64 14" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                    <rect x="46" y="26" width="8" height="48" rx="4" fill="#6C5CE7" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="50" cy="32" r="2" fill="#FFF"/>
                `, size);

            case 'fox':
                return wrap(`
                    <path d="M24 38 L16 14 L40 28 Z" fill="#FF763B" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M76 38 L84 14 L60 28 Z" fill="#FF763B" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M25 31 L21 20 L34 28 Z M75 31 L79 20 L66 28 Z" fill="#FFD6C4"/>
                    <ellipse cx="50" cy="55" rx="32" ry="28" fill="#FF763B" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M20 58 Q30 78 50 76 Q70 78 80 58 Q70 65 50 64 Q30 65 20 58 Z" fill="#FFF"/>
                    <circle cx="38" cy="48" r="5" fill="#2C3A47"/><circle cx="36.5" cy="46.5" r="1.8" fill="#FFF"/>
                    <circle cx="62" cy="48" r="5" fill="#2C3A47"/><circle cx="60.5" cy="46.5" r="1.8" fill="#FFF"/>
                    <path d="M46 55 Q50 51 54 55 Q50 60 46 55 Z" fill="#2C3A47"/>
                    <path d="M44 63 Q50 69 56 63" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                `, size);

            case 'bee':
                return wrap(`
                    <ellipse cx="40" cy="30" rx="10" ry="18" fill="#E0F7FA" stroke="#2C3A47" stroke-width="2" opacity="0.8" transform="rotate(-25 40 30)"/>
                    <ellipse cx="60" cy="30" rx="10" ry="18" fill="#E0F7FA" stroke="#2C3A47" stroke-width="2" opacity="0.8" transform="rotate(25 60 30)"/>
                    <ellipse cx="50" cy="56" rx="26" ry="22" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M44 35 L44 77 M56 35 L56 77" stroke="#2C3A47" stroke-width="6"/>
                    <circle cx="68" cy="50" r="3.5" fill="#2C3A47"/>
                    <circle cx="67" cy="48.5" r="1.2" fill="#FFF"/>
                    <circle cx="66" cy="58" r="3" fill="#FF7675" opacity="0.6"/>
                    <path d="M24 56 L16 56 L24 59 Z" fill="#2C3A47"/>
                `, size);

            case 'chick':
            case 'chicken':
            case 'rooster':
                return wrap(`
                    <circle cx="50" cy="54" r="30" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M28 54 Q34 66 42 56" stroke="#F6B93B" stroke-width="4" stroke-linecap="round" fill="none"/>
                    <path d="M68 50 L82 54 L68 58 Z" fill="#FF7675" stroke="#2C3A47" stroke-width="1.8"/>
                    <circle cx="58" cy="44" r="4.5" fill="#2C3A47"/>
                    <circle cx="56.5" cy="42.5" r="1.8" fill="#FFF"/>
                    <path d="M44 24 Q50 14 56 24" stroke="#FF7675" stroke-width="4" stroke-linecap="round"/>
                    <path d="M42 84 L42 94 M38 94 L46 94 M58 84 L58 94 M54 94 L62 94" stroke="#E67E22" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="52" cy="52" r="4" fill="#FF7675" opacity="0.5"/>
                `, size);

            case 'duck':
                return wrap(`
                    <ellipse cx="46" cy="62" rx="30" ry="22" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="66" cy="42" r="16" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M78 40 Q94 42 88 50 Q78 50 78 44 Z" fill="#FF7675" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="68" cy="38" r="3.5" fill="#2C3A47"/>
                    <circle cx="67" cy="37" r="1.2" fill="#FFF"/>
                    <path d="M32 58 Q48 50 56 64" stroke="#F6B93B" stroke-width="4" stroke-linecap="round" fill="none"/>
                `, size);

            case 'frog':
                return wrap(`
                    <ellipse cx="50" cy="56" rx="32" ry="26" fill="#2ED573" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="34" cy="34" r="11" fill="#2ED573" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="34" cy="34" r="7" fill="#FFFFFF"/>
                    <circle cx="34" cy="34" r="4" fill="#2C3A47"/>
                    <circle cx="32.5" cy="32.5" r="1.5" fill="#FFF"/>
                    <circle cx="66" cy="34" r="11" fill="#2ED573" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="66" cy="34" r="7" fill="#FFFFFF"/>
                    <circle cx="66" cy="34" r="4" fill="#2C3A47"/>
                    <circle cx="64.5" cy="32.5" r="1.5" fill="#FFF"/>
                    <path d="M30 56 Q50 70 70 56" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/>
                    <circle cx="26" cy="54" r="5" fill="#FF7675" opacity="0.6"/>
                    <circle cx="74" cy="54" r="5" fill="#FF7675" opacity="0.6"/>
                `, size);

            case 'sheep':
                return wrap(`
                    <circle cx="32" cy="46" r="16" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="68" cy="46" r="16" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="40" cy="32" r="16" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="60" cy="32" r="16" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="50" cy="62" r="18" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2"/>
                    <ellipse cx="50" cy="50" rx="16" ry="18" fill="#2C3A47"/>
                    <ellipse cx="32" cy="42" rx="7" ry="4" fill="#2C3A47" transform="rotate(-20 32 42)"/>
                    <ellipse cx="68" cy="42" rx="7" ry="4" fill="#2C3A47" transform="rotate(20 68 42)"/>
                    <circle cx="44" cy="46" r="2.5" fill="#FFF"/>
                    <circle cx="56" cy="46" r="2.5" fill="#FFF"/>
                    <rect x="36" y="74" width="6" height="16" rx="3" fill="#2C3A47"/>
                    <rect x="58" y="74" width="6" height="16" rx="3" fill="#2C3A47"/>
                `, size);

            case 'cow':
                return wrap(`
                    <path d="M26 24 Q22 14 16 18 M74 24 Q78 14 84 18" stroke="#FFA502" stroke-width="4" stroke-linecap="round"/>
                    <ellipse cx="20" cy="36" rx="8" ry="5" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2" transform="rotate(-20 20 36)"/>
                    <ellipse cx="80" cy="36" rx="8" ry="5" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2" transform="rotate(20 80 36)"/>
                    <ellipse cx="50" cy="46" rx="28" ry="22" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M30 32 Q42 30 38 44 Q26 46 30 32 Z" fill="#2C3A47"/>
                    <ellipse cx="50" cy="62" rx="18" ry="12" fill="#FFB8B8" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="43" cy="62" r="2.5" fill="#2C3A47"/>
                    <circle cx="57" cy="62" r="2.5" fill="#2C3A47"/>
                    <circle cx="38" cy="40" r="3.5" fill="#2C3A47"/>
                    <circle cx="37" cy="39" r="1.2" fill="#FFF"/>
                    <circle cx="62" cy="40" r="3.5" fill="#2C3A47"/>
                    <circle cx="61" cy="39" r="1.2" fill="#FFF"/>
                `, size);

            case 'horse':
                return wrap(`
                    <path d="M30 30 L26 14 L40 22 Z" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M70 30 L74 14 L60 22 Z" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M50 20 Q30 22 26 40 Q24 54 32 62 Q30 76 42 82 Q50 86 58 82 Q70 76 68 62 Q76 54 74 40 Q70 22 50 20 Z" fill="#E0A458" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M50 20 Q40 24 38 34 Q44 30 50 30 Q56 30 62 34 Q60 24 50 20 Z" fill="#8B5A2B"/>
                    <path d="M44 22 Q42 14 48 10 Q52 16 50 22 Z" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2" stroke-linejoin="round"/>
                    <ellipse cx="50" cy="72" rx="15" ry="11" fill="#F0C080" stroke="#2C3A47" stroke-width="2.4"/>
                    <ellipse cx="44" cy="71" rx="2.6" ry="3.4" fill="#2C3A47"/>
                    <ellipse cx="56" cy="71" rx="2.6" ry="3.4" fill="#2C3A47"/>
                    <path d="M44 78 Q50 82 56 78" stroke="#2C3A47" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                    <circle cx="39" cy="48" r="4.4" fill="#2C3A47"/>
                    <circle cx="61" cy="48" r="4.4" fill="#2C3A47"/>
                    <circle cx="37.6" cy="46.6" r="1.6" fill="#FFF"/>
                    <circle cx="59.6" cy="46.6" r="1.6" fill="#FFF"/>
                    <ellipse cx="31" cy="60" rx="4.4" ry="3.2" fill="#FFB8B8" opacity=".6"/>
                    <ellipse cx="69" cy="60" rx="4.4" ry="3.2" fill="#FFB8B8" opacity=".6"/>
                `, size);

            default:
                return wrap(window.Mascot ? window.Mascot.svg(size, 'happy') : '<circle cx="50" cy="50" r="30" fill="#FF7675"/>', size);
        }
    }

    // ==========================================
    // 4. OBJECTS, FRUITS, VEHICLES & NATURE
    // ==========================================
    function object(kind, size) {
        size = size || 80;
        switch (kind) {
            case 'apple':
                return wrap(`
                    <path d="M50 28 Q48 12 56 10" stroke="#795548" stroke-width="3.5" stroke-linecap="round" fill="none"/>
                    <path d="M54 14 Q68 12 64 24 Q54 24 54 14 Z" fill="#2ED573" stroke="#2C3A47" stroke-width="1.5"/>
                    <path d="M50 32 Q20 20 18 52 Q16 84 50 86 Q84 84 82 52 Q80 20 50 32 Z" fill="#FF4757" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M30 38 Q24 48 24 60" stroke="#FFF" stroke-width="4" stroke-linecap="round" opacity="0.45" fill="none"/>
                    <circle cx="42" cy="52" r="3" fill="#2C3A47"/>
                    <circle cx="58" cy="52" r="3" fill="#2C3A47"/>
                    <path d="M46 60 Q50 64 54 60" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <circle cx="34" cy="56" r="3.5" fill="#FFA502" opacity="0.4"/>
                    <circle cx="66" cy="56" r="3.5" fill="#FFA502" opacity="0.4"/>
                `, size);

            case 'banana':
                return wrap(`
                    <path d="M22 28 Q10 68 46 84 Q72 94 84 76 Q88 64 78 54 Q68 44 54 50 Q40 56 36 46 Q30 36 24 24 Z" fill="#FFEAA7" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M22 28 Q14 20 18 16 Q24 16 26 22 Z" fill="#795548"/>
                    <path d="M30 46 Q26 72 64 78" stroke="#FDCB6E" stroke-width="3" fill="none"/>
                    <circle cx="52" cy="60" r="3" fill="#2C3A47"/>
                    <path d="M58 66 Q64 68 68 62" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'orange':
                return wrap(`
                    <path d="M50 22 Q48 10 54 8" stroke="#795548" stroke-width="3" stroke-linecap="round" fill="none"/>
                    <path d="M52 12 Q64 8 62 18 Z" fill="#2ED573"/>
                    <circle cx="50" cy="56" r="36" fill="#FFA502" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="34" cy="40" r="8" fill="#FFF" opacity="0.35"/>
                    <circle cx="42" cy="54" r="3" fill="#2C3A47"/>
                    <circle cx="58" cy="54" r="3" fill="#2C3A47"/>
                    <path d="M46 62 Q50 67 54 62" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'watermelon':
                return wrap(`
                    <path d="M14 44 Q50 92 86 44 Z" fill="#FF4757" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M10 40 Q50 98 90 40 L86 44 Q50 92 14 44 Z" fill="#2ED573" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="36" cy="54" rx="2" ry="3.5" fill="#2C3A47" transform="rotate(15 36 54)"/>
                    <ellipse cx="50" cy="62" rx="2" ry="3.5" fill="#2C3A47"/>
                    <ellipse cx="64" cy="54" rx="2" ry="3.5" fill="#2C3A47" transform="rotate(-15 64 54)"/>
                `, size);

            case 'balloon':
                return wrap(`
                    <path d="M50 82 L46 88 L54 88 Z" fill="#FF4757" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 88 Q46 96 52 104" stroke="#A4B0BE" stroke-width="2" fill="none"/>
                    <ellipse cx="50" cy="46" rx="34" ry="38" fill="#FF4757" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M30 30 Q24 44 26 56" stroke="#FFF" stroke-width="4" stroke-linecap="round" opacity="0.5" fill="none"/>
                `, size, 100, 110);

            case 'ball':
                return wrap(`
                    <circle cx="50" cy="50" r="40" fill="#3867D6" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M50 10 A40 40 0 0 1 90 50" fill="#FF4757" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M50 90 A40 40 0 0 1 10 50" fill="#FFA502" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M50 10 L50 90 M10 50 L90 50" stroke="#FFF" stroke-width="3"/>
                    <circle cx="50" cy="50" r="10" fill="#FFF" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            case 'sun':
                return wrap(`
                    <g stroke="#FFA502" stroke-width="4" stroke-linecap="round">
                        <line x1="50" y1="8" x2="50" y2="18"/>
                        <line x1="50" y1="82" x2="50" y2="92"/>
                        <line x1="8" y1="50" x2="18" y2="50"/>
                        <line x1="82" y1="50" x2="92" y2="50"/>
                        <line x1="20" y1="20" x2="28" y2="28"/>
                        <line x1="72" y1="72" x2="80" y2="80"/>
                        <line x1="80" y1="20" x2="72" y2="28"/>
                        <line x1="20" y1="80" x2="28" y2="72"/>
                    </g>
                    <circle cx="50" cy="50" r="28" fill="#F9CA24" stroke="#FFA502" stroke-width="2.5"/>
                    <circle cx="40" cy="46" r="3.5" fill="#2C3A47"/>
                    <circle cx="60" cy="46" r="3.5" fill="#2C3A47"/>
                    <path d="M42 56 Q50 64 58 56" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                    <circle cx="32" cy="52" r="3.5" fill="#FF7675" opacity="0.6"/>
                    <circle cx="68" cy="52" r="3.5" fill="#FF7675" opacity="0.6"/>
                `, size);

            case 'moon':
                return wrap(`
                    <path d="M68 14 A38 38 0 1 0 86 66 A32 32 0 0 1 68 14 Z" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="54" cy="48" r="3" fill="#2C3A47"/>
                    <path d="M50 58 Q54 62 60 58" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <circle cx="48" cy="54" r="3" fill="#FF7675" opacity="0.5"/>
                `, size);

            case 'star':
                return shape('star', '#F9CA24', size);

            case 'flower':
                return wrap(`
                    <circle cx="50" cy="28" r="14" fill="#FF7675" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="70" cy="42" r="14" fill="#FF7675" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="64" cy="66" r="14" fill="#FF7675" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="36" cy="66" r="14" fill="#FF7675" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="30" cy="42" r="14" fill="#FF7675" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="50" cy="50" r="14" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M50 78 L50 96" stroke="#2ED573" stroke-width="5" stroke-linecap="round"/>
                    <path d="M50 86 Q62 82 66 74" stroke="#2ED573" stroke-width="4" stroke-linecap="round"/>
                `, size);

            case 'tree':
                return wrap(`
                    <rect x="42" y="60" width="16" height="34" rx="4" fill="#795548" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="34" cy="50" r="18" fill="#2ED573" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="66" cy="50" r="18" fill="#2ED573" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="50" cy="32" r="22" fill="#26DE81" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="40" cy="34" r="3.5" fill="#FF4757"/>
                    <circle cx="60" cy="40" r="3.5" fill="#FF4757"/>
                    <circle cx="48" cy="52" r="3.5" fill="#FF4757"/>
                `, size);

            case 'rain':
                return wrap(`
                    <path d="M26 50 Q16 50 16 40 Q16 28 30 28 Q34 16 48 16 Q62 16 68 28 Q80 28 80 40 Q80 50 70 50 Z" fill="#74B9FF" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M30 62 L26 74 M46 64 L42 78 M62 62 L58 74 M76 64 L72 78" stroke="#0984E3" stroke-width="3.5" stroke-linecap="round"/>
                `, size);

            case 'bone':
                return wrap(`
                    <path d="M24 34 Q18 26 24 20 Q30 14 38 20 L70 52 Q78 58 84 64 Q90 70 84 78 Q78 84 70 78 L38 46 Q30 40 24 34 Z" fill="#FFFDF5" stroke="#2C3A47" stroke-width="2.8" stroke-linejoin="round"/>
                    <circle cx="25" cy="25" r="8" fill="#FFFDF5" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="34" cy="34" r="7" fill="#FFFDF5" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="75" cy="73" r="8" fill="#FFFDF5" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="84" cy="64" r="7" fill="#FFFDF5" stroke="#2C3A47" stroke-width="2.5"/>
                `, size);

            case 'soap':
                return wrap(`
                    <rect x="22" y="30" width="56" height="52" rx="15" fill="#74B9FF" stroke="#2C3A47" stroke-width="2.8"/>
                    <path d="M32 28 Q34 16 46 18 Q52 10 62 16 Q72 16 72 28" fill="#E8F7FF" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="36" cy="22" r="5" fill="#FFF" opacity=".9"/>
                    <circle cx="64" cy="18" r="3.5" fill="#FFF" opacity=".9"/>
                    <path d="M34 48 Q50 40 66 48" fill="none" stroke="#FFF" stroke-width="4" stroke-linecap="round" opacity=".8"/>
                `, size);

            case 'train':
                return wrap(`
                    <path d="M20 26 H68 Q78 26 78 36 V64 H20 Z" fill="#6C5CE7" stroke="#2C3A47" stroke-width="2.8"/>
                    <rect x="28" y="34" width="14" height="12" rx="2" fill="#E0F7FA" stroke="#2C3A47" stroke-width="1.8"/>
                    <rect x="48" y="34" width="14" height="12" rx="2" fill="#E0F7FA" stroke="#2C3A47" stroke-width="1.8"/>
                    <rect x="12" y="52" width="70" height="8" rx="3" fill="#A29BFE" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="30" cy="68" r="8" fill="#2C3A47"/><circle cx="30" cy="68" r="3" fill="#FFF"/>
                    <circle cx="68" cy="68" r="8" fill="#2C3A47"/><circle cx="68" cy="68" r="3" fill="#FFF"/>
                    <path d="M78 42 H88 L94 50 H82" fill="#FF7675" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <circle cx="90" cy="66" r="7" fill="#2C3A47"/><circle cx="90" cy="66" r="2.5" fill="#FFF"/>
                `, size);

            case 'car':
                return wrap(`
                    <path d="M14 62 L24 42 Q28 32 40 32 L76 32 Q88 32 94 42 L106 62 Z" fill="#FF4757" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="10" y="58" width="104" height="16" rx="6" fill="#FF6B81" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="36" y="38" width="22" height="16" rx="3" fill="#E0F7FA" stroke="#2C3A47" stroke-width="1.8"/>
                    <rect x="64" y="38" width="22" height="16" rx="3" fill="#E0F7FA" stroke="#2C3A47" stroke-width="1.8"/>
                    <circle cx="34" cy="74" r="10" fill="#2C3A47"/>
                    <circle cx="34" cy="74" r="4.5" fill="#FFF"/>
                    <circle cx="90" cy="74" r="10" fill="#2C3A47"/>
                    <circle cx="90" cy="74" r="4.5" fill="#FFF"/>
                `, size, 120, 90);

            case 'book':
                return wrap(`
                    <path d="M16 24 Q50 32 50 80 Q50 32 84 24 L84 76 Q50 84 50 84 Q50 84 16 76 Z" fill="#4ECDC4" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M50 32 L50 84" stroke="#2C3A47" stroke-width="2"/>
                    <line x1="26" y1="42" x2="42" y2="44" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="26" y1="52" x2="42" y2="54" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="58" y1="44" x2="74" y2="42" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="58" y1="54" x2="74" y2="52" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
                `, size);

            case 'house':
            case 'home':
                return wrap(`
                    <path d="M50 14 L90 46 L10 46 Z" fill="#FF7675" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <rect x="20" y="46" width="60" height="42" rx="4" fill="#FFEAA7" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="38" y="60" width="24" height="28" rx="4" fill="#74B9FF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="56" cy="74" r="2" fill="#2C3A47"/>
                    <circle cx="50" cy="34" r="6" fill="#FFF" stroke="#2C3A47" stroke-width="1.8"/>
                `, size);

            case 'eye':
                return wrap(`
                    <path d="M10 50 Q50 16 90 50 Q50 84 10 50 Z" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="50" cy="50" r="18" fill="#74B9FF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="50" cy="50" r="9" fill="#2C3A47"/>
                    <circle cx="46" cy="46" r="3.5" fill="#FFFFFF"/>
                `, size);

            case 'ear':
                return wrap(`
                    <path d="M40 20 Q66 14 70 40 Q73 60 60 72 Q54 78 52 86 Q50 92 43 90 Q37 88 39 80 Q42 68 36 60 Q28 48 30 36 Q32 24 40 20 Z" fill="#FFD3C2" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M45 32 Q60 28 60 44 Q60 56 51 62" stroke="#E8A791" stroke-width="3" stroke-linecap="round" fill="none"/>
                    <path d="M48 42 Q56 40 55 50" stroke="#E8A791" stroke-width="2.4" stroke-linecap="round" fill="none"/>
                    <ellipse cx="42" cy="30" rx="5" ry="7" fill="#FFF" opacity=".35" transform="rotate(-20 42 30)"/>
                `, size);

            case 'nose':
                return wrap(`
                    <path d="M50 18 Q44 40 36 58 Q30 70 38 76 Q46 82 50 76 Q54 82 62 76 Q70 70 64 58 Q56 40 50 18 Z" fill="#FFD3C2" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <ellipse cx="42" cy="72" rx="4.5" ry="3.2" fill="#2C3A47"/>
                    <ellipse cx="58" cy="72" rx="4.5" ry="3.2" fill="#2C3A47"/>
                    <path d="M47 28 Q42 46 38 58" stroke="#FFF" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".5"/>
                    <ellipse cx="34" cy="66" rx="4" ry="3" fill="#FFB8B8" opacity=".5"/>
                    <ellipse cx="66" cy="66" rx="4" ry="3" fill="#FFB8B8" opacity=".5"/>
                `, size);

            case 'hand':
                return wrap(`
                    <path d="M32 46 L32 26 Q32 21 37 21 Q42 21 42 26 L42 44" fill="#FFD3C2" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M42 44 L42 20 Q42 15 47 15 Q52 15 52 20 L52 44" fill="#FFD3C2" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M52 44 L52 22 Q52 17 57 17 Q62 17 62 22 L62 46" fill="#FFD3C2" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M62 46 L62 30 Q62 25 67 25 Q72 25 72 30 L72 52" fill="#FFD3C2" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M32 50 Q22 44 18 52 Q16 58 24 62 L34 68" fill="#FFD3C2" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M30 44 Q28 66 40 78 Q52 88 64 80 Q74 72 73 52 Q66 48 58 49 Q46 46 30 44 Z" fill="#FFC9B4" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M38 60 Q48 66 60 62" stroke="#E8A791" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                    <path d="M36 70 Q46 74 58 71" stroke="#E8A791" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".8"/>
                    <ellipse cx="37" cy="24" rx="3" ry="2.2" fill="#FFF" opacity=".55"/>
                    <ellipse cx="47" cy="18" rx="3" ry="2.2" fill="#FFF" opacity=".55"/>
                    <ellipse cx="57" cy="20" rx="3" ry="2.2" fill="#FFF" opacity=".55"/>
                `, size);

            case 'tongue':
                return wrap(`
                    <path d="M50 86 Q28 74 28 52 Q28 34 50 34 Q72 34 72 52 Q72 74 50 86 Z" fill="#FF7675" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M50 42 L50 74" stroke="#D63031" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
                    <circle cx="40" cy="54" r="2" fill="#FFF" opacity="0.6"/><circle cx="60" cy="60" r="2" fill="#FFF" opacity="0.6"/>
                `, size);

            case 'foot':
                return wrap(`
                    <path d="M38 84 Q30 70 34 50 Q36 40 44 42 Q50 44 49 56 Q52 38 60 40 Q67 42 63 60 Q68 46 75 50 Q82 54 72 72 Q66 86 52 88 Z" fill="#FFD1DC" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <circle cx="43" cy="34" r="7" fill="#FFD1DC" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="57" cy="30" r="7" fill="#FFD1DC" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="70" cy="34" r="7" fill="#FFD1DC" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            case 'brain':
                return wrap(`
                    <path d="M42 78 Q30 78 30 66 Q22 62 28 52 Q24 40 36 38 Q36 24 48 28 Q56 18 64 28 Q78 24 76 40 Q88 44 78 54 Q84 66 70 70 Q66 82 56 76 Q48 84 42 78 Z" fill="#F368E0" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M42 36 Q48 42 44 50 Q52 54 48 64 M60 32 Q54 40 60 46 Q54 54 62 60 Q58 68 64 72" fill="none" stroke="#C0398E" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="42" cy="50" r="2.5" fill="#2C3A47"/><circle cx="60" cy="50" r="2.5" fill="#2C3A47"/>
                    <path d="M46 58 Q50 62 54 58" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'tooth':
                return wrap(`
                    <path d="M26 34 Q18 58 30 78 Q38 88 42 76 Q46 64 50 64 Q54 64 58 76 Q62 88 70 78 Q82 58 74 34 Q68 18 50 18 Q32 18 26 34 Z" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="40" cy="42" r="3" fill="#2C3A47"/>
                    <circle cx="60" cy="42" r="3" fill="#2C3A47"/>
                    <path d="M44 50 Q50 55 56 50" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                    <path d="M32 30 Q30 42 34 50" stroke="#74B9FF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
                `, size);

            case 'clock':
                return wrap(`
                    <circle cx="50" cy="50" r="40" fill="#FFFFFF" stroke="#6C5CE7" stroke-width="4"/>
                    <circle cx="50" cy="50" r="3" fill="#2C3A47"/>
                    <line x1="50" y1="50" x2="50" y2="24" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round"/>
                    <line x1="50" y1="50" x2="68" y2="50" stroke="#FF4757" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="50" cy="18" r="2" fill="#2C3A47"/>
                    <circle cx="82" cy="50" r="2" fill="#2C3A47"/>
                    <circle cx="50" cy="82" r="2" fill="#2C3A47"/>
                    <circle cx="18" cy="50" r="2" fill="#2C3A47"/>
                `, size);

            case 'gift':
                return wrap(`
                    <rect x="18" y="38" width="64" height="50" rx="6" fill="#FF4757" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="12" y="30" width="76" height="14" rx="4" fill="#FF6B81" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="44" y="30" width="12" height="58" fill="#F9CA24"/>
                    <ellipse cx="38" cy="22" rx="10" ry="6" fill="#F9CA24" stroke="#2C3A47" stroke-width="2" transform="rotate(-25 38 22)"/>
                    <ellipse cx="62" cy="22" rx="10" ry="6" fill="#F9CA24" stroke="#2C3A47" stroke-width="2" transform="rotate(25 62 22)"/>
                `, size);

            case 'cake':
                return wrap(`
                    <rect x="16" y="52" width="68" height="36" rx="6" fill="#FFEAA7" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M16 62 Q33 70 50 62 Q67 70 84 62 L84 52 L16 52 Z" fill="#F8A5C2"/>
                    <rect x="47" y="32" width="6" height="20" rx="2" fill="#74B9FF" stroke="#2C3A47" stroke-width="1.5"/>
                    <path d="M50 18 Q54 26 50 30 Q46 26 50 18 Z" fill="#FFA502"/>
                `, size);

            // ---- Added artwork: high-frequency vocabulary that previously fell
            // back to a text tile. Same flat, thick-outlined kid style as above.
            case 'grape':
                return wrap(`
                    <path d="M50 20 L50 30" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>
                    <path d="M50 24 Q60 16 68 20" stroke="#2ED573" stroke-width="4" fill="none" stroke-linecap="round"/>
                    <circle cx="38" cy="42" r="10" fill="#A29BFE" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="58" cy="42" r="10" fill="#A29BFE" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="48" cy="56" r="10" fill="#8E7BFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="30" cy="58" r="9" fill="#8E7BFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="66" cy="58" r="9" fill="#8E7BFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="48" cy="74" r="9" fill="#6C5CE7" stroke="#2C3A47" stroke-width="2.2"/>
                `, size);

            case 'pomegranate':
                return wrap(`
                    <circle cx="50" cy="56" r="32" fill="#E74C3C" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M50 24 L44 12 L56 14 Z" fill="#C0392B" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="42" cy="52" r="4" fill="#FFD1D1" opacity=".85"/>
                    <circle cx="58" cy="52" r="4" fill="#FFD1D1" opacity=".85"/>
                    <circle cx="50" cy="66" r="4" fill="#FFD1D1" opacity=".85"/>
                `, size);

            case 'icecream':
                return wrap(`
                    <path d="M36 52 L50 92 L64 52 Z" fill="#E1A95F" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <circle cx="42" cy="44" r="14" fill="#FF7BAC" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="58" cy="44" r="14" fill="#FFD86B" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="50" cy="32" r="13" fill="#7ED6C1" stroke="#2C3A47" stroke-width="2.2"/>
                `, size);

            case 'shirt':
                return wrap(`
                    <path d="M35 20 L28 24 L14 34 L24 48 L31 43 L31 84 Q50 88 69 84 L69 43 L76 48 L86 34 L72 24 L65 20 Z" fill="#3DA8F5" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M35 20 Q50 32 65 20 Q58 16 50 16 Q42 16 35 20 Z" fill="#2C89D6" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M31 47 L31 84 Q40 86 48 86 L48 47 Z" fill="#FFF" opacity=".12"/>
                    <circle cx="50" cy="40" r="2.2" fill="#F5F7FA" stroke="#2C3A47" stroke-width="1.1"/>
                    <circle cx="50" cy="54" r="2.2" fill="#F5F7FA" stroke="#2C3A47" stroke-width="1.1"/>
                    <path d="M31 80 Q50 84 69 80" stroke="#2C89D6" stroke-width="2.4" fill="none"/>
                    <path d="M20 36 L26 44" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" opacity=".4"/>
                `, size);

            case 'sock':
                return wrap(`
                    <path d="M34 16 L62 16 L62 30 L34 30 Z" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M36 30 L60 30 L60 58 Q60 68 50 74 L34 84 Q24 89 19 80 Q14 71 23 65 L34 58 Q36 52 36 44 Z" fill="#FF7F50" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M20 74 Q26 82 34 78" stroke="#E85F35" stroke-width="2.4" stroke-linecap="round" fill="none"/>
                    <path d="M38 34 L58 34" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" opacity=".45"/>
                    <path d="M38 42 L58 42" stroke="#FFF" stroke-width="2.2" stroke-linecap="round" opacity=".3"/>
                    <path d="M36 20 L60 20" stroke="#FFF" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>
                `, size);

            case 'box':
                return wrap(`
                    <path d="M50 20 L84 34 L50 48 L16 34 Z" fill="#E0A458" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M16 34 L16 68 L50 84 L50 48 Z" fill="#C4863C" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M84 34 L84 68 L50 84 L50 48 Z" fill="#A96A28" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M50 48 L50 84" stroke="#8A551E" stroke-width="1.8" opacity=".7"/>
                    <path d="M33 27 L67 41" stroke="#FFF" stroke-width="2.2" opacity=".35"/>
                    <path d="M24 44 L24 66" stroke="#FFF" stroke-width="2" opacity=".18"/>
                    <rect x="44" y="30" width="12" height="24" rx="2" fill="#FF6B6B" opacity=".85" transform="rotate(22 50 42)"/>
                `, size);

            case 'tea':
                return wrap(`
                    <path d="M24 40 L72 40 L68 76 Q66 84 56 84 L40 84 Q30 84 28 76 Z" fill="#FFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M30 46 L66 46 L63 72 Q62 78 55 78 L41 78 Q34 78 33 72 Z" fill="#C0703A"/>
                    <path d="M72 48 Q86 50 84 60 Q82 70 70 68" fill="none" stroke="#2C3A47" stroke-width="3" stroke-linecap="round"/>
                    <path d="M42 28 Q46 22 42 16" fill="none" stroke="#B2BEC3" stroke-width="3" stroke-linecap="round"/>
                    <path d="M54 28 Q58 22 54 16" fill="none" stroke="#B2BEC3" stroke-width="3" stroke-linecap="round"/>
                `, size);

            case 'candle':
                return wrap(`
                    <rect x="38" y="38" width="24" height="48" rx="5" fill="#FFE3B3" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="30" y="84" width="40" height="8" rx="4" fill="#B2BEC3" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 34 L50 26" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M50 8 Q60 20 50 26 Q40 20 50 8 Z" fill="#FFA502" stroke="#E67E22" stroke-width="2"/>
                `, size);

            case 'chair':
                return wrap(`
                    <rect x="30" y="16" width="40" height="38" rx="6" fill="#F8A5C2" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="24" y="52" width="52" height="10" rx="4" fill="#E8879F" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="28" y="62" width="7" height="26" rx="3" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2"/>
                    <rect x="65" y="62" width="7" height="26" rx="3" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            case 'glasses':
                return wrap(`
                    <circle cx="30" cy="52" r="17" fill="#DFF6FF" stroke="#2C3A47" stroke-width="3"/>
                    <circle cx="70" cy="52" r="17" fill="#DFF6FF" stroke="#2C3A47" stroke-width="3"/>
                    <path d="M47 52 Q50 46 53 52" fill="none" stroke="#2C3A47" stroke-width="3"/>
                    <path d="M13 48 L4 40" stroke="#2C3A47" stroke-width="3" stroke-linecap="round"/>
                    <path d="M87 48 L96 40" stroke="#2C3A47" stroke-width="3" stroke-linecap="round"/>
                `, size);

            case 'doll':
                return wrap(`
                    <circle cx="50" cy="32" r="18" fill="#FFE0BD" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M32 28 Q34 10 50 10 Q66 10 68 28 Q60 20 50 22 Q40 20 32 28 Z" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="43" cy="33" r="2.6" fill="#2C3A47"/><circle cx="57" cy="33" r="2.6" fill="#2C3A47"/>
                    <path d="M45 40 Q50 44 55 40" fill="none" stroke="#2C3A47" stroke-width="2" stroke-linecap="round"/>
                    <path d="M34 54 L66 54 L72 86 L28 86 Z" fill="#FF7BAC" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                `, size);

            case 'drum':
                return wrap(`
                    <rect x="22" y="42" width="56" height="34" rx="6" fill="#E74C3C" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="50" cy="42" rx="28" ry="9" fill="#FFF0D6" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M26 48 L74 68 M74 48 L26 68" stroke="#FFD86B" stroke-width="3"/>
                    <path d="M22 24 L36 40" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>
                    <path d="M78 24 L64 40" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>
                `, size);

            case 'lamp':
                return wrap(`
                    <path d="M50 12 A24 24 0 0 1 50 60 A24 24 0 0 1 50 12 Z" fill="#FFE066" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M40 58 Q50 66 60 58" fill="#FFE066" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="42" y="62" width="16" height="12" rx="2" fill="#B2BEC3" stroke="#2C3A47" stroke-width="2"/>
                    <rect x="44" y="74" width="12" height="10" rx="2" fill="#8D9AA5" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M18 26 L26 30 M82 26 L74 30 M22 56 L30 54 M78 56 L70 54" stroke="#FFA502" stroke-width="3" stroke-linecap="round"/>
                `, size);

            case 'boat':
                return wrap(`
                    <path d="M14 66 L86 66 L74 84 L26 84 Z" fill="#FF6B6B" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M50 14 L50 62" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>
                    <path d="M54 20 L78 44 L54 52 Z" fill="#FFD86B" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M46 24 L26 46 L46 52 Z" fill="#7ED6C1" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M8 90 Q20 84 32 90 T56 90 T80 90" fill="none" stroke="#48B0F7" stroke-width="3.5" stroke-linecap="round"/>
                `, size);

            case 'lock':
                return wrap(`
                    <path d="M34 44 L34 32 A16 16 0 0 1 66 32 L66 44" fill="none" stroke="#8D9AA5" stroke-width="7" stroke-linecap="round"/>
                    <rect x="24" y="44" width="52" height="42" rx="8" fill="#FFC048" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="50" cy="62" r="6" fill="#2C3A47"/>
                    <rect x="47" y="64" width="6" height="12" rx="3" fill="#2C3A47"/>
                `, size);

            case 'hat':
                return wrap(`
                    <ellipse cx="50" cy="70" rx="38" ry="11" fill="#3DA8F5" stroke="#2C3A47" stroke-width="2.6"/>
                    <ellipse cx="50" cy="67" rx="38" ry="10" fill="#5FBEFF"/>
                    <path d="M28 68 Q26 34 50 30 Q74 34 72 68 Q62 74 50 74 Q38 74 28 68 Z" fill="#3DA8F5" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M28 60 Q50 68 72 60 L72 66 Q50 74 28 66 Z" fill="#2C89D6" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M36 40 Q34 54 36 62" stroke="#FFF" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".45"/>
                    <circle cx="66" cy="62" r="4" fill="#F9CA24" stroke="#2C3A47" stroke-width="1.6"/>
                `, size);

            case 'shoe':
                return wrap(`
                    <path d="M18 66 Q18 46 30 44 Q40 43 46 50 Q54 58 68 60 Q82 62 84 70 L84 76 Q84 80 78 80 L24 80 Q18 80 18 74 Z" fill="#FF4757" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M18 72 L84 72 L84 76 Q84 80 78 80 L24 80 Q18 80 18 74 Z" fill="#F5F7FA" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M30 50 L44 56" stroke="#FFF" stroke-width="3" stroke-linecap="round" opacity=".85"/>
                    <path d="M28 57 L42 62" stroke="#FFF" stroke-width="3" stroke-linecap="round" opacity=".85"/>
                    <path d="M26 44 Q34 40 40 46" stroke="#2C3A47" stroke-width="2.2" fill="none"/>
                    <circle cx="70" cy="66" r="2.4" fill="#FFF" opacity=".6"/>
                `, size);

            case 'carrot':
                return wrap(`
                    <path d="M44 26 Q38 12 30 12 Q34 22 40 28 Z" fill="#2ED573" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M50 24 Q50 8 56 6 Q58 18 54 26 Z" fill="#26C065" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M58 27 Q68 14 76 16 Q68 24 62 30 Z" fill="#2ED573" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M36 30 Q50 24 66 30 L54 84 Q50 90 46 84 Z" fill="#FF9F43" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M41 42 L58 40 M43 54 L57 52 M45 66 L55 64" stroke="#E8853B" stroke-width="2.4" stroke-linecap="round"/>
                    <path d="M42 34 Q40 54 47 78" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".4"/>
                `, size);

            case 'plane':
                return wrap(`
                    <path d="M12 58 Q12 48 24 47 L64 44 Q78 43 86 48 Q92 51 86 55 Q78 60 64 60 L28 62 Q12 63 12 58 Z"
                        fill="#DFE9F3" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M40 47 L30 26 L40 26 L58 45 Z" fill="#B9CEE0" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M38 60 L30 76 L39 76 L54 60 Z" fill="#B9CEE0" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M14 47 L10 34 L18 34 L24 47 Z" fill="#9FB8CC" stroke="#2C3A47" stroke-width="2" stroke-linejoin="round"/>
                    <circle cx="70" cy="51" r="3.4" fill="#48B0F7" stroke="#2C3A47" stroke-width="1.5"/>
                    <circle cx="58" cy="51" r="3.4" fill="#48B0F7" stroke="#2C3A47" stroke-width="1.5"/>
                `, size);

            case 'umbrella':
                return wrap(`
                    <path d="M50 16 Q86 20 88 52 Q76 44 68 52 Q60 42 50 52 Q40 42 32 52 Q24 44 12 52 Q14 20 50 16 Z" fill="#FF4757" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M50 16 Q60 22 68 52 Q60 42 50 52 Z" fill="#FF6B81" opacity=".9"/>
                    <path d="M32 52 Q40 42 50 52 L50 16 Q40 22 32 52 Z" fill="#E8354A" opacity=".55"/>
                    <path d="M50 52 L50 76 Q50 86 40 86 Q32 86 32 78" stroke="#8B5A2B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
                    <circle cx="50" cy="16" r="3.4" fill="#F9CA24" stroke="#2C3A47" stroke-width="1.8"/>
                    <path d="M24 32 Q34 24 44 22" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".4"/>
                `, size);

            case 'toothbrush':
                return wrap(`
                    <rect x="12" y="56" width="54" height="12" rx="6" fill="#3DA8F5" stroke="#2C3A47" stroke-width="2.4"/>
                    <rect x="16" y="59" width="42" height="3.5" rx="1.8" fill="#FFF" opacity=".4"/>
                    <path d="M66 52 L84 52 Q90 52 90 58 L90 66 Q90 72 84 72 L66 72 Z" fill="#F5F7FA" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M68 52 L68 40 M74 52 L74 38 M80 52 L80 38 M86 52 L86 40" stroke="#2ED573" stroke-width="4" stroke-linecap="round"/>
                    <path d="M68 40 L68 34 M80 38 L80 32" stroke="#26C065" stroke-width="4" stroke-linecap="round" opacity=".8"/>
                `, size);

            case 'rainbow':
                return wrap(`
                    <path d="M10 74 A40 40 0 0 1 90 74" fill="none" stroke="#FF6B6B" stroke-width="9"/>
                    <path d="M19 74 A31 31 0 0 1 81 74" fill="none" stroke="#FFA502" stroke-width="9"/>
                    <path d="M28 74 A22 22 0 0 1 72 74" fill="none" stroke="#FFD86B" stroke-width="9"/>
                    <path d="M37 74 A13 13 0 0 1 63 74" fill="none" stroke="#2ED573" stroke-width="9"/>
                    <circle cx="18" cy="78" r="8" fill="#FFF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="82" cy="78" r="8" fill="#FFF" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            case 'mother':
                return wrap(`
                    <circle cx="50" cy="30" r="17" fill="#FFE0BD" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M31 28 Q30 8 50 8 Q70 8 69 28 Q66 34 62 30 Q56 18 38 24 Q34 26 31 28 Z" fill="#6B4423" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="43" cy="31" r="2.6" fill="#2C3A47"/><circle cx="57" cy="31" r="2.6" fill="#2C3A47"/>
                    <path d="M45 38 Q50 42 55 38" fill="none" stroke="#2C3A47" stroke-width="2" stroke-linecap="round"/>
                    <path d="M30 88 Q30 54 50 54 Q70 54 70 88 Z" fill="#E84393" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                `, size);

            case 'bread':
                return wrap(`
                    <path d="M18 54 Q18 30 50 30 Q82 30 82 54 L82 76 Q82 82 76 82 L24 82 Q18 82 18 76 Z" fill="#E0A458" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M22 54 Q22 36 50 36 Q78 36 78 54" fill="#F0C080" stroke="none"/>
                    <path d="M30 40 Q34 30 42 34" stroke="#C4863C" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                    <path d="M46 32 Q52 26 58 33" stroke="#C4863C" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                    <path d="M62 35 Q68 30 72 40" stroke="#C4863C" stroke-width="2.6" stroke-linecap="round" fill="none"/>
                    <path d="M18 66 L82 66" stroke="#C4863C" stroke-width="2" opacity=".55"/>
                    <ellipse cx="34" cy="46" rx="6" ry="4" fill="#FFF" opacity=".28"/>
                `, size);

            case 'window':
                return wrap(`
                    <rect x="16" y="14" width="68" height="72" rx="6" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2.8"/>
                    <rect x="23" y="21" width="54" height="58" rx="3" fill="#BFE6FF" stroke="#2C3A47" stroke-width="2.2"/>
                    <path d="M23 50 L77 50 M50 21 L50 79" stroke="#8B5A2B" stroke-width="4.5"/>
                    <path d="M23 50 L77 50 M50 21 L50 79" stroke="#2C3A47" stroke-width="1.6" opacity=".6"/>
                    <path d="M30 44 L42 26" stroke="#FFF" stroke-width="4" stroke-linecap="round" opacity=".75"/>
                    <path d="M58 74 L70 56" stroke="#FFF" stroke-width="3" stroke-linecap="round" opacity=".5"/>
                    <circle cx="66" cy="34" r="6" fill="#F9CA24" opacity=".7"/>
                `, size);

            case 'bicycle':
                return wrap(`
                    <circle cx="26" cy="66" r="18" fill="none" stroke="#2C3A47" stroke-width="4"/>
                    <circle cx="74" cy="66" r="18" fill="none" stroke="#2C3A47" stroke-width="4"/>
                    <path d="M26 66 L44 40 L62 40 L74 66 M44 40 L56 66 M56 66 L26 66" fill="none" stroke="#E74C3C" stroke-width="3.5" stroke-linejoin="round"/>
                    <path d="M40 36 L52 36" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round"/>
                    <path d="M62 40 L68 30" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round"/>
                `, size);

            case 'soap2':
                return wrap(`
                    <rect x="22" y="46" width="56" height="34" rx="9" fill="#7ED6C1" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M32 58 Q40 52 48 58" fill="none" stroke="#FFF" stroke-width="3.5" stroke-linecap="round"/>
                    <circle cx="64" cy="28" r="9" fill="#DFF6FF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="46" cy="22" r="6" fill="#DFF6FF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="76" cy="40" r="5" fill="#DFF6FF" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            case 'cherry':
                return wrap(`
                    <path d="M50 18 Q40 34 34 52 M50 18 Q62 34 68 52" fill="none" stroke="#2ED573" stroke-width="4" stroke-linecap="round"/>
                    <path d="M46 16 Q56 8 66 14" fill="none" stroke="#2ED573" stroke-width="4" stroke-linecap="round"/>
                    <circle cx="32" cy="66" r="16" fill="#E74C3C" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="70" cy="66" r="16" fill="#C0392B" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="27" cy="60" r="4" fill="#FFF" opacity=".6"/>
                `, size);

            case 'whale':
                return wrap(`
                    <path d="M14 58 Q22 36 50 36 Q76 36 84 54 Q76 74 50 74 Q24 74 14 58 Z" fill="#48B0F7" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M84 54 L94 42 L94 68 Z" fill="#3B92CF" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M40 34 Q40 20 52 16" fill="none" stroke="#9AD6FF" stroke-width="4" stroke-linecap="round"/>
                    <circle cx="34" cy="52" r="3.2" fill="#2C3A47"/>
                    <path d="M22 62 Q34 68 46 62" fill="none" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            case 'tiger':
                return wrap(`
                    <circle cx="50" cy="54" r="30" fill="#FFA502" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M26 30 L34 44 L20 44 Z" fill="#FFA502" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M74 30 L80 44 L66 44 Z" fill="#FFA502" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M38 32 L42 44 M62 32 L58 44 M24 58 L34 60 M76 58 L66 60" stroke="#2C3A47" stroke-width="3" stroke-linecap="round"/>
                    <circle cx="40" cy="50" r="3.4" fill="#2C3A47"/><circle cx="60" cy="50" r="3.4" fill="#2C3A47"/>
                    <path d="M50 60 L46 64 Q50 68 54 64 Z" fill="#2C3A47"/>
                    <path d="M40 70 Q50 76 60 70" fill="none" stroke="#2C3A47" stroke-width="2.2" stroke-linecap="round"/>
                `, size);

            case 'swing':
                return wrap(`
                    <path d="M16 88 L34 18 M84 88 L66 18" stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"/>
                    <path d="M28 18 L72 18" stroke="#8B5A2B" stroke-width="6" stroke-linecap="round"/>
                    <path d="M38 20 L38 58 M62 20 L62 58" stroke="#7A8794" stroke-width="3" stroke-linecap="round"/>
                    <rect x="30" y="58" width="40" height="10" rx="4" fill="#FF6B6B" stroke="#2C3A47" stroke-width="2.6"/>
                    <rect x="33" y="60" width="34" height="3.4" rx="1.7" fill="#FFF" opacity=".45"/>
                    <ellipse cx="50" cy="90" rx="30" ry="4" fill="#2C3A47" opacity=".1"/>
                    <circle cx="34" cy="18" r="3" fill="#2C3A47" opacity=".5"/>
                    <circle cx="66" cy="18" r="3" fill="#2C3A47" opacity=".5"/>
                `, size);

            case 'mountain':
                return wrap(`
                    <path d="M6 80 L34 32 L52 60 L64 44 L94 80 Z" fill="#7A8794" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M34 32 L52 60 L40 60 L24 50 Z" fill="#95A3B0" opacity=".9"/>
                    <path d="M34 32 L22 52 L46 52 Z" fill="#F5F7FA" stroke="#DCE5EC" stroke-width="1.4"/>
                    <path d="M64 44 L56 56 L74 56 Z" fill="#F5F7FA" stroke="#DCE5EC" stroke-width="1.4"/>
                    <circle cx="76" cy="24" r="8" fill="#F9CA24" opacity=".9"/>
                    <path d="M10 78 Q30 70 50 78 Q70 86 90 78" stroke="#2ED573" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
                `, size);

            case 'school':
                return wrap(`
                    <rect x="16" y="42" width="68" height="42" rx="4" fill="#FFE3B3" stroke="#2C3A47" stroke-width="2.5"/>
                    <path d="M12 42 L50 18 L88 42 Z" fill="#E74C3C" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <rect x="42" y="62" width="16" height="22" rx="2" fill="#8B5A2B" stroke="#2C3A47" stroke-width="2"/>
                    <rect x="24" y="52" width="12" height="12" rx="2" fill="#BFE7FF" stroke="#2C3A47" stroke-width="2"/>
                    <rect x="64" y="52" width="12" height="12" rx="2" fill="#BFE7FF" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 18 L50 8 L62 12" fill="#2ED573" stroke="#2C3A47" stroke-width="1.8" stroke-linejoin="round"/>
                `, size);

            case 'dumbbell':
                return wrap(`
                    <rect x="34" y="44" width="32" height="12" rx="3" fill="#8D9AA5" stroke="#2C3A47" stroke-width="2.5"/>
                    <rect x="16" y="32" width="16" height="36" rx="5" fill="#2C3A47"/>
                    <rect x="68" y="32" width="16" height="36" rx="5" fill="#2C3A47"/>
                    <rect x="8" y="40" width="10" height="20" rx="4" fill="#55606B"/>
                    <rect x="82" y="40" width="10" height="20" rx="4" fill="#55606B"/>
                `, size);

            case 'giraffe':
                return wrap(`
                    <path d="M44 84 L44 46 Q44 22 58 18 L66 16" fill="none" stroke="#F5B041" stroke-width="13" stroke-linecap="round"/>
                    <ellipse cx="42" cy="76" rx="20" ry="16" fill="#F5B041" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="46" cy="60" r="5" fill="#C9821B"/><circle cx="34" cy="74" r="5" fill="#C9821B"/><circle cx="50" cy="82" r="4" fill="#C9821B"/>
                    <ellipse cx="68" cy="18" rx="13" ry="10" fill="#F7C56E" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="64" cy="15" r="2.4" fill="#2C3A47"/>
                    <path d="M62 8 L60 2 M74 9 L77 3" stroke="#2C3A47" stroke-width="3" stroke-linecap="round"/>
                    <path d="M30 88 L30 94 M52 88 L52 94" stroke="#C9821B" stroke-width="5" stroke-linecap="round"/>
                `, size);

            case 'nut':
                return wrap(`
                    <ellipse cx="50" cy="56" rx="26" ry="31" fill="#C4863C" stroke="#2C3A47" stroke-width="2.6"/>
                    <path d="M50 25 Q34 42 50 87 Q66 42 50 25 Z" fill="#A96A28" opacity=".75"/>
                    <path d="M50 25 L50 87" stroke="#8A551E" stroke-width="2.2"/>
                    <path d="M38 40 Q32 56 38 72" stroke="#E0A458" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>
                    <path d="M50 25 Q48 16 54 12" stroke="#6B4423" stroke-width="3.4" stroke-linecap="round" fill="none"/>
                    <ellipse cx="40" cy="42" rx="5" ry="7" fill="#FFF" opacity=".25" transform="rotate(-18 40 42)"/>
                `, size);

            case 'comb':
                return wrap(`
                    <rect x="18" y="30" width="64" height="18" rx="8" fill="#8B7BE8" stroke="#2C3A47" stroke-width="2.6"/>
                    <rect x="22" y="34" width="56" height="5" rx="2.5" fill="#FFF" opacity=".35"/>
                    <path d="M25 48 L25 74" stroke="#2C3A47" stroke-width="3.4" stroke-linecap="round"/>
                    <path d="M33 48 L33 78" stroke="#2C3A47" stroke-width="3.4" stroke-linecap="round"/>
                    <path d="M41 48 L41 78" stroke="#2C3A47" stroke-width="3.4" stroke-linecap="round"/>
                    <path d="M49 48 L49 78" stroke="#2C3A47" stroke-width="3.4" stroke-linecap="round"/>
                    <path d="M57 48 L57 78" stroke="#2C3A47" stroke-width="3.4" stroke-linecap="round"/>
                    <path d="M65 48 L65 78" stroke="#2C3A47" stroke-width="3.4" stroke-linecap="round"/>
                    <path d="M73 48 L73 74" stroke="#2C3A47" stroke-width="3.4" stroke-linecap="round"/>
                `, size);

            case 'racket':
                return wrap(`
                    <ellipse cx="48" cy="38" rx="26" ry="30" fill="#E8F4FF" stroke="#2C3A47" stroke-width="3"/>
                    <ellipse cx="48" cy="38" rx="20" ry="24" fill="#F7FBFF" stroke="#B8D4E8" stroke-width="1.6"/>
                    <path d="M34 20 L34 56 M42 16 L42 60 M50 15 L50 61 M58 17 L58 59 M64 22 L64 54" stroke="#9FC4DC" stroke-width="1.8"/>
                    <path d="M30 26 L66 26 M28 34 L68 34 M28 42 L68 42 M30 50 L66 50" stroke="#9FC4DC" stroke-width="1.8"/>
                    <path d="M48 68 L52 88" stroke="#FF4757" stroke-width="8" stroke-linecap="round"/>
                    <path d="M48 68 L52 88" stroke="#E8354A" stroke-width="4" stroke-linecap="round" opacity=".6"/>
                    <path d="M34 22 Q30 32 32 44" stroke="#FFF" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/>
                `, size);

            case 'grain':
                return wrap(`
                    <path d="M50 88 L50 42" stroke="#8B5A2B" stroke-width="4" stroke-linecap="round"/>
                    <path d="M50 44 Q30 40 26 24 Q46 24 50 42 Z" fill="#F5C542" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 44 Q70 40 74 24 Q54 24 50 42 Z" fill="#F5C542" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 60 Q32 56 28 42 Q48 42 50 58 Z" fill="#E8B120" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 60 Q68 56 72 42 Q52 42 50 58 Z" fill="#E8B120" stroke="#2C3A47" stroke-width="2"/>
                `, size);

            case 'chocolate':
                return wrap(`
                    <path d="M20 30 L74 22 L82 32 L28 40 Z" fill="#E8354A" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <rect x="20" y="30" width="56" height="52" rx="4" fill="#6B4423" stroke="#2C3A47" stroke-width="2.6"/>
                    <path d="M20 46 L76 46 M20 62 L76 62 M38 30 L38 82 M58 30 L58 82" stroke="#4A2F17" stroke-width="2.4"/>
                    <rect x="23" y="33" width="12" height="10" rx="2" fill="#8B5A2B" opacity=".8"/>
                    <rect x="41" y="49" width="14" height="10" rx="2" fill="#8B5A2B" opacity=".55"/>
                    <path d="M24 34 L24 78" stroke="#FFF" stroke-width="2.4" stroke-linecap="round" opacity=".2"/>
                    <path d="M26 26 L70 20" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity=".4"/>
                `, size);

            case 'camel':
                return wrap(`
                    <path d="M18 78 L18 56 Q18 44 30 42 Q38 26 48 42 Q58 26 68 42 Q80 44 80 58 L80 78"
                        fill="#D9A066" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <path d="M80 58 Q86 40 82 26" fill="none" stroke="#D9A066" stroke-width="11" stroke-linecap="round"/>
                    <ellipse cx="84" cy="22" rx="10" ry="8" fill="#E3B478" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="80" cy="20" r="2.2" fill="#2C3A47"/>
                    <path d="M24 78 L24 90 M38 78 L38 90 M62 78 L62 90 M76 78 L76 90" stroke="#C08A4A" stroke-width="5" stroke-linecap="round"/>
                `, size);

            case 'jar':
                return wrap(`
                    <rect x="30" y="12" width="40" height="10" rx="4" fill="#C4863C" stroke="#2C3A47" stroke-width="2.4"/>
                    <path d="M34 22 L66 22 L70 34 Q74 40 74 50 L74 78 Q74 86 66 86 L34 86 Q26 86 26 78 L26 50 Q26 40 30 34 Z" fill="#BFE6FF" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M30 52 Q30 44 34 40 L66 40 Q70 44 70 52 L70 76 Q70 82 64 82 L36 82 Q30 82 30 76 Z" fill="#F9CA24" opacity=".9"/>
                    <circle cx="42" cy="58" r="3.4" fill="#E0A800" opacity=".8"/>
                    <circle cx="57" cy="66" r="3" fill="#E0A800" opacity=".8"/>
                    <circle cx="50" cy="52" r="2.4" fill="#E0A800" opacity=".7"/>
                    <path d="M34 46 L34 76" stroke="#FFF" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
                    <path d="M36 16 L64 16" stroke="#FFF" stroke-width="2.2" stroke-linecap="round" opacity=".35"/>
                `, size);

            case 'snow':
                return wrap(`
                    <circle cx="50" cy="52" r="34" fill="#E8F6FF" opacity=".5"/>
                    <path d="M50 16 L50 88 M20 34 L80 70 M80 34 L20 70" stroke="#3DA8F5" stroke-width="5" stroke-linecap="round"/>
                    <path d="M50 24 L42 32 M50 24 L58 32 M50 80 L42 72 M50 80 L58 72" stroke="#3DA8F5" stroke-width="4" stroke-linecap="round"/>
                    <path d="M27 38 L26 48 M27 38 L37 37 M73 66 L74 56 M73 66 L63 67" stroke="#3DA8F5" stroke-width="4" stroke-linecap="round"/>
                    <path d="M73 38 L74 48 M73 38 L63 37 M27 66 L26 56 M27 66 L37 67" stroke="#3DA8F5" stroke-width="4" stroke-linecap="round"/>
                    <circle cx="50" cy="52" r="7" fill="#5FBEFF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="47" cy="49" r="2.4" fill="#FFF" opacity=".9"/>
                `, size);

            case 'plate':
                return wrap(`
                    <ellipse cx="50" cy="56" rx="40" ry="30" fill="#E8EDF2" stroke="#2C3A47" stroke-width="2.8"/>
                    <ellipse cx="50" cy="53" rx="31" ry="22" fill="#F7FAFC" stroke="#C7D3DE" stroke-width="2"/>
                    <ellipse cx="50" cy="51" rx="20" ry="13" fill="#FFF" stroke="#DCE5EC" stroke-width="1.6"/>
                    <path d="M26 42 Q34 32 48 30" stroke="#FFF" stroke-width="4" stroke-linecap="round" fill="none" opacity=".9"/>
                    <ellipse cx="50" cy="80" rx="26" ry="5" fill="#2C3A47" opacity=".08"/>
                `, size);

            case 'rope':
                return wrap(`
                    <path d="M14 56 Q28 30 42 56 Q56 82 70 56 Q80 38 88 50" stroke="#C4863C" stroke-width="12" stroke-linecap="round" fill="none"/>
                    <path d="M14 56 Q28 30 42 56 Q56 82 70 56 Q80 38 88 50" stroke="#E0A458" stroke-width="8" stroke-linecap="round" fill="none"/>
                    <path d="M18 50 L23 60 M26 44 L31 54 M34 46 L39 56 M42 56 L47 66 M50 66 L55 74 M58 68 L63 60 M66 58 L71 50 M74 46 L79 44" stroke="#A96A28" stroke-width="2.6" stroke-linecap="round"/>
                    <path d="M14 52 Q28 28 42 52" stroke="#FFF" stroke-width="2" stroke-linecap="round" fill="none" opacity=".35"/>
                `, size);

            case 'radio':
                return wrap(`
                    <rect x="14" y="38" width="72" height="46" rx="7" fill="#D9A066" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="36" cy="60" r="14" fill="#2C3A47"/><circle cx="36" cy="60" r="7" fill="#8D9AA5"/>
                    <rect x="58" y="48" width="20" height="10" rx="3" fill="#BFE7FF" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="63" cy="72" r="4" fill="#E74C3C" stroke="#2C3A47" stroke-width="1.8"/>
                    <circle cx="75" cy="72" r="4" fill="#2ED573" stroke="#2C3A47" stroke-width="1.8"/>
                    <path d="M70 38 L86 16" stroke="#8D9AA5" stroke-width="3.5" stroke-linecap="round"/>
                `, size);

            case 'table':
                return wrap(`
                    <path d="M10 40 L90 40 L84 50 L16 50 Z" fill="#E0A458" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <rect x="10" y="34" width="80" height="8" rx="4" fill="#C4863C" stroke="#2C3A47" stroke-width="2.6"/>
                    <rect x="22" y="50" width="9" height="34" rx="3" fill="#A96A28" stroke="#2C3A47" stroke-width="2.4"/>
                    <rect x="69" y="50" width="9" height="34" rx="3" fill="#A96A28" stroke="#2C3A47" stroke-width="2.4"/>
                    <path d="M16 37 L84 37" stroke="#FFF" stroke-width="2.4" stroke-linecap="round" opacity=".4"/>
                    <ellipse cx="50" cy="86" rx="34" ry="4" fill="#2C3A47" opacity=".1"/>
                `, size);

            case 'river':
                return wrap(`
                    <path d="M6 82 Q6 40 28 24 L44 24 Q26 44 26 82 Z" fill="#2ED573" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M94 82 Q94 40 72 24 L56 24 Q74 44 74 82 Z" fill="#26C065" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M44 24 Q26 46 26 82 L74 82 Q74 46 56 24 Z" fill="#3DA8F5" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <path d="M36 44 Q44 40 50 44 Q56 48 64 44" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".7"/>
                    <path d="M32 58 Q42 54 50 58 Q58 62 68 58" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".55"/>
                    <path d="M30 72 Q42 68 50 72 Q58 76 70 72" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".4"/>
                    <circle cx="72" cy="18" r="7" fill="#F9CA24" opacity=".8"/>
                `, size);

            case 'egg':
                return wrap(`
                    <ellipse cx="50" cy="56" rx="27" ry="34" fill="#FFF8E7" stroke="#2C3A47" stroke-width="2.6"/>
                    <ellipse cx="41" cy="42" rx="9" ry="13" fill="#FFF" opacity=".75" transform="rotate(-18 41 42)"/>
                    <ellipse cx="58" cy="70" rx="12" ry="9" fill="#F0E2C0" opacity=".7"/>
                    <circle cx="44" cy="58" r="2.6" fill="#2C3A47"/>
                    <circle cx="58" cy="58" r="2.6" fill="#2C3A47"/>
                    <path d="M46 68 Q51 72 56 68" stroke="#2C3A47" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                    <circle cx="38" cy="66" r="3.4" fill="#FFB8B8" opacity=".55"/>
                    <circle cx="64" cy="66" r="3.4" fill="#FFB8B8" opacity=".55"/>
                `, size);

            case 'cheese':
                return wrap(`
                    <path d="M14 62 L60 30 Q86 34 86 56 L86 70 Q86 76 80 76 L20 76 Q14 76 14 70 Z" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M14 62 L60 30 Q70 32 76 38 L20 68 Z" fill="#FFDF6B" opacity=".8"/>
                    <circle cx="34" cy="66" r="6" fill="#E0A800" stroke="#C89600" stroke-width="1.4"/>
                    <circle cx="56" cy="60" r="5" fill="#E0A800" stroke="#C89600" stroke-width="1.4"/>
                    <circle cx="72" cy="68" r="4" fill="#E0A800" stroke="#C89600" stroke-width="1.4"/>
                    <circle cx="46" cy="50" r="3.4" fill="#E0A800" opacity=".7"/>
                    <path d="M18 64 L58 36" stroke="#FFF" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>
                `, size);

            case 'soup':
                return wrap(`
                    <path d="M40 20 Q36 14 42 10 M52 20 Q48 14 54 10 M64 20 Q60 14 66 10" stroke="#B8C6D4" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"/>
                    <path d="M16 44 L84 44 Q84 74 50 78 Q16 74 16 44 Z" fill="#E8EDF2" stroke="#2C3A47" stroke-width="2.8" stroke-linejoin="round"/>
                    <path d="M20 46 Q22 68 50 72 Q78 68 80 46 Z" fill="#FF9F43" opacity=".9"/>
                    <ellipse cx="42" cy="55" rx="6" ry="3.4" fill="#FF6B6B" opacity=".85"/>
                    <ellipse cx="60" cy="60" rx="5" ry="3" fill="#2ED573" opacity=".85"/>
                    <ellipse cx="52" cy="52" rx="4" ry="2.6" fill="#F9CA24" opacity=".9"/>
                    <rect x="10" y="40" width="80" height="7" rx="3.5" fill="#F5F7FA" stroke="#2C3A47" stroke-width="2.4"/>
                    <ellipse cx="50" cy="84" rx="26" ry="4" fill="#2C3A47" opacity=".1"/>
                `, size);

            case 'wood':
                return wrap(`
                    <rect x="12" y="34" width="76" height="20" rx="8" fill="#C4863C" stroke="#2C3A47" stroke-width="2.6"/>
                    <ellipse cx="88" cy="44" rx="7" ry="10" fill="#E0A458" stroke="#2C3A47" stroke-width="2.4"/>
                    <ellipse cx="88" cy="44" rx="4" ry="6" fill="#A96A28"/>
                    <ellipse cx="88" cy="44" rx="1.8" ry="2.6" fill="#8A551E"/>
                    <rect x="20" y="58" width="66" height="18" rx="8" fill="#A96A28" stroke="#2C3A47" stroke-width="2.6"/>
                    <ellipse cx="20" cy="67" rx="6" ry="9" fill="#C4863C" stroke="#2C3A47" stroke-width="2.4"/>
                    <ellipse cx="20" cy="67" rx="3.4" ry="5" fill="#8A551E"/>
                    <path d="M22 40 L76 40 M24 47 L74 47" stroke="#8A551E" stroke-width="1.8" opacity=".55"/>
                    <path d="M18 37 L70 37" stroke="#FFF" stroke-width="2" stroke-linecap="round" opacity=".3"/>
                `, size);

            case 'water':
                return wrap(`
                    <path d="M50 12 Q76 46 76 62 Q76 86 50 86 Q24 86 24 62 Q24 46 50 12 Z" fill="#3DA8F5" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M50 24 Q66 48 66 62 Q66 76 50 78" fill="#5FBEFF" opacity=".55"/>
                    <path d="M38 52 Q33 62 36 72" stroke="#FFF" stroke-width="4.5" stroke-linecap="round" fill="none" opacity=".7"/>
                    <ellipse cx="44" cy="40" rx="4" ry="6" fill="#FFF" opacity=".5" transform="rotate(-20 44 40)"/>
                    <circle cx="44" cy="62" r="2.6" fill="#2C3A47"/>
                    <circle cx="58" cy="62" r="2.6" fill="#2C3A47"/>
                    <path d="M46 70 Q51 74 56 70" stroke="#2C3A47" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'bubble':
                return wrap(`
                    <circle cx="44" cy="56" r="26" fill="#BFE7FF" stroke="#48B0F7" stroke-width="2.5" opacity=".85"/>
                    <circle cx="34" cy="46" r="7" fill="#FFF" opacity=".9"/>
                    <circle cx="74" cy="34" r="12" fill="#DFF6FF" stroke="#48B0F7" stroke-width="2.2" opacity=".85"/>
                    <circle cx="70" cy="30" r="3.4" fill="#FFF"/>
                    <circle cx="76" cy="70" r="8" fill="#DFF6FF" stroke="#48B0F7" stroke-width="2" opacity=".85"/>
                `, size);

            case 'photo':
                return wrap(`
                    <rect x="14" y="20" width="72" height="60" rx="5" fill="#FFF" stroke="#2C3A47" stroke-width="2.8"/>
                    <rect x="20" y="26" width="60" height="40" rx="3" fill="#BFE7FF"/>
                    <circle cx="34" cy="38" r="6" fill="#FFD86B"/>
                    <path d="M20 66 L40 46 L54 60 L64 52 L80 66 Z" fill="#2ED573"/>
                    <path d="M20 72 L80 72" stroke="#E1E8F0" stroke-width="3"/>
                `, size);

            case 'crown':
                return wrap(`
                    <path d="M16 72 L22 30 L38 50 L50 24 L62 50 L78 30 L84 72 Z"
                        fill="#FFC048" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <rect x="16" y="72" width="68" height="10" rx="4" fill="#E8A317" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="50" cy="62" r="5" fill="#E74C3C" stroke="#2C3A47" stroke-width="1.8"/>
                    <circle cx="30" cy="64" r="4" fill="#48B0F7" stroke="#2C3A47" stroke-width="1.6"/>
                    <circle cx="70" cy="64" r="4" fill="#2ED573" stroke="#2C3A47" stroke-width="1.6"/>
                `, size);

            case 'forest':
                return wrap(`
                    <ellipse cx="50" cy="86" rx="40" ry="6" fill="#2C3A47" opacity=".1"/>
                    <path d="M22 66 L14 66 L22 50 L17 50 L26 34 L35 50 L30 50 L38 66 L30 66 L30 78 L22 78 Z" fill="#1FA85A" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M74 68 L66 68 L73 54 L69 54 L77 40 L85 54 L81 54 L88 68 L80 68 L80 78 L74 78 Z" fill="#26C065" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M50 74 L40 74 L50 54 L44 54 L54 32 L64 54 L58 54 L68 74 L58 74 L58 82 L50 82 Z" fill="#2ED573" stroke="#2C3A47" stroke-width="2.4" stroke-linejoin="round"/>
                    <rect x="52" y="78" width="6" height="8" rx="2" fill="#8B5A2B" stroke="#2C3A47" stroke-width="1.8"/>
                    <circle cx="30" cy="24" r="7" fill="#F9CA24" opacity=".85"/>
                `, size);

            case 'pinwheel':
                return wrap(`
                    <path d="M50 50 L50 16 Q72 16 66 40 Z" fill="#FF6B6B" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M50 50 L84 50 Q84 72 60 66 Z" fill="#48B0F7" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M50 50 L50 84 Q28 84 34 60 Z" fill="#FFD86B" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M50 50 L16 50 Q16 28 40 34 Z" fill="#2ED573" stroke="#2C3A47" stroke-width="2.2" stroke-linejoin="round"/>
                    <circle cx="50" cy="50" r="6" fill="#FFF" stroke="#2C3A47" stroke-width="2.2"/>
                `, size);

            case 'door':
                return wrap(`
                    <rect x="24" y="12" width="52" height="76" rx="5" fill="#C4863C" stroke="#2C3A47" stroke-width="2.8"/>
                    <rect x="31" y="19" width="38" height="26" rx="3" fill="#A96A28" stroke="#8A551E" stroke-width="1.8"/>
                    <rect x="31" y="51" width="38" height="30" rx="3" fill="#A96A28" stroke="#8A551E" stroke-width="1.8"/>
                    <circle cx="64" cy="54" r="4" fill="#F9CA24" stroke="#2C3A47" stroke-width="2"/>
                    <circle cx="63" cy="53" r="1.4" fill="#FFF" opacity=".8"/>
                    <path d="M28 16 L28 84" stroke="#FFF" stroke-width="2.6" stroke-linecap="round" opacity=".28"/>
                    <ellipse cx="50" cy="90" rx="28" ry="4" fill="#2C3A47" opacity=".1"/>
                `, size);

            case 'jasmine':
                return wrap(`
                    <circle cx="50" cy="34" r="12" fill="#FFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="34" cy="46" r="12" fill="#FFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="66" cy="46" r="12" fill="#FFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="40" cy="62" r="11" fill="#FFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="60" cy="62" r="11" fill="#FFF" stroke="#2C3A47" stroke-width="2.2"/>
                    <circle cx="50" cy="49" r="8" fill="#FFD86B" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 72 L50 90" stroke="#2ED573" stroke-width="4" stroke-linecap="round"/>
                `, size);

            case 'cheetah':
                return wrap(`
                    <ellipse cx="46" cy="60" rx="32" ry="20" fill="#F5C542" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="76" cy="42" r="15" fill="#F7D169" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="71" cy="39" r="2.4" fill="#2C3A47"/><circle cx="82" cy="39" r="2.4" fill="#2C3A47"/>
                    <path d="M76 46 L73 49 Q76 52 79 49 Z" fill="#2C3A47"/>
                    <path d="M68 30 L64 22 L74 26 Z" fill="#F5C542" stroke="#2C3A47" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M84 30 L88 22 L78 26 Z" fill="#F5C542" stroke="#2C3A47" stroke-width="2" stroke-linejoin="round"/>
                    <circle cx="34" cy="54" r="3.4" fill="#8B5A2B"/><circle cx="50" cy="50" r="3.4" fill="#8B5A2B"/>
                    <circle cx="42" cy="66" r="3.4" fill="#8B5A2B"/><circle cx="58" cy="64" r="3.4" fill="#8B5A2B"/>
                    <path d="M14 60 Q4 48 12 40" fill="none" stroke="#F5C542" stroke-width="7" stroke-linecap="round"/>
                    <path d="M28 78 L28 88 M56 78 L56 88" stroke="#E0AE24" stroke-width="5" stroke-linecap="round"/>
                `, size);

            case 'nightingale':
                return wrap(`
                    <ellipse cx="46" cy="56" rx="24" ry="19" fill="#A0793D" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="70" cy="42" r="13" fill="#B98B48" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="74" cy="39" r="2.4" fill="#2C3A47"/>
                    <path d="M83 43 L94 46 L83 49 Z" fill="#FFA502" stroke="#2C3A47" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="M40 50 Q30 62 44 68 Q52 62 48 52 Z" fill="#8B6A34" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M22 58 L6 50 L20 68 Z" fill="#8B6A34" stroke="#2C3A47" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M40 74 L38 86 M56 74 L58 86" stroke="#FFA502" stroke-width="3.5" stroke-linecap="round"/>
                `, size);

            case 'violin':
                return wrap(`
                    <path d="M50 34 Q64 34 66 48 Q68 58 60 62 Q68 68 66 78 Q64 92 50 92 Q36 92 34 78 Q32 68 40 62 Q32 58 34 48 Q36 34 50 34 Z"
                        fill="#A0522D" stroke="#2C3A47" stroke-width="2.5" stroke-linejoin="round"/>
                    <rect x="46" y="8" width="8" height="28" rx="3" fill="#6B4423" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M50 38 L50 88" stroke="#FFE9C7" stroke-width="2"/>
                    <path d="M42 56 L42 70 M58 56 L58 70" stroke="#2C3A47" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="46" cy="8" r="3" fill="#2C3A47"/><circle cx="54" cy="8" r="3" fill="#2C3A47"/>
                `, size);

            case 'bell':
                return wrap(`
                    <path d="M50 14 Q54 14 54 19" stroke="#8A551E" stroke-width="3.4" stroke-linecap="round" fill="none"/>
                    <path d="M50 20 Q74 24 74 54 Q74 66 80 72 L20 72 Q26 66 26 54 Q26 24 50 20 Z" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M50 20 Q62 24 64 54 Q64 66 68 72 L80 72 Q74 66 74 54 Q74 24 50 20 Z" fill="#E0A800" opacity=".6"/>
                    <rect x="18" y="70" width="64" height="8" rx="4" fill="#E0A800" stroke="#2C3A47" stroke-width="2.4"/>
                    <circle cx="50" cy="84" r="6" fill="#C4863C" stroke="#2C3A47" stroke-width="2.4"/>
                    <path d="M36 32 Q32 44 33 58" stroke="#FFF" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".55"/>
                `, size);

            case 'earth':
                return wrap(`
                    <circle cx="50" cy="52" r="35" fill="#3DA8F5" stroke="#2C3A47" stroke-width="2.8"/>
                    <path d="M28 34 Q40 28 48 36 Q54 44 46 50 Q36 54 30 48 Q24 42 28 34 Z" fill="#2ED573" stroke="#1FA85A" stroke-width="1.4"/>
                    <path d="M58 30 Q72 32 74 44 Q70 50 62 46 Q56 40 58 30 Z" fill="#2ED573" stroke="#1FA85A" stroke-width="1.4"/>
                    <path d="M40 62 Q56 58 68 66 Q72 76 60 80 Q46 82 40 72 Z" fill="#2ED573" stroke="#1FA85A" stroke-width="1.4"/>
                    <ellipse cx="36" cy="34" rx="9" ry="6" fill="#FFF" opacity=".3" transform="rotate(-25 36 34)"/>
                    <path d="M15 52 Q50 44 85 52" stroke="#FFF" stroke-width="1.6" fill="none" opacity=".3"/>
                `, size);

            case 'lemon':
                return wrap(`
                    <ellipse cx="50" cy="54" rx="33" ry="26" fill="#F9CA24" stroke="#2C3A47" stroke-width="2.6" transform="rotate(-12 50 54)"/>
                    <path d="M17 50 Q10 46 12 40" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/>
                    <path d="M83 58 Q90 62 88 68" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/>
                    <ellipse cx="38" cy="44" rx="10" ry="6" fill="#FFF" opacity=".45" transform="rotate(-20 38 44)"/>
                    <path d="M24 62 Q40 72 62 70" stroke="#E0A800" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".7"/>
                    <circle cx="43" cy="54" r="2.6" fill="#2C3A47"/>
                    <circle cx="59" cy="52" r="2.6" fill="#2C3A47"/>
                    <path d="M45 62 Q51 66 57 61" stroke="#2C3A47" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                `, size);

            case 'cane':
                return wrap(`
                    <path d="M32 84 L32 42 Q32 20 52 20 Q72 20 72 40" stroke="#C4863C" stroke-width="13" stroke-linecap="round" fill="none"/>
                    <path d="M32 84 L32 42 Q32 20 52 20 Q72 20 72 40" stroke="#E0A458" stroke-width="8" stroke-linecap="round" fill="none"/>
                    <path d="M36 78 L28 70 M36 66 L28 58 M36 54 L28 46 M40 38 L34 30 M52 26 L48 18 M64 30 L68 24" stroke="#A96A28" stroke-width="3" stroke-linecap="round"/>
                    <path d="M29 80 L29 44 Q29 26 44 24" stroke="#FFF" stroke-width="2" stroke-linecap="round" fill="none" opacity=".35"/>
                `, size);

            case 'bird2':
                return wrap(`
                    <ellipse cx="46" cy="58" rx="24" ry="19" fill="#48B0F7" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="70" cy="42" r="14" fill="#6FC6FF" stroke="#2C3A47" stroke-width="2.5"/>
                    <circle cx="74" cy="39" r="2.6" fill="#2C3A47"/>
                    <path d="M84 43 L96 46 L84 50 Z" fill="#FFA502" stroke="#2C3A47" stroke-width="1.8" stroke-linejoin="round"/>
                    <path d="M40 52 Q28 62 42 70 Q52 64 48 54 Z" fill="#2E93D9" stroke="#2C3A47" stroke-width="2"/>
                    <path d="M22 60 L6 52 L20 70 Z" fill="#2E93D9" stroke="#2C3A47" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M40 76 L38 88 M56 76 L58 88" stroke="#FFA502" stroke-width="3.5" stroke-linecap="round"/>
                `, size);

            default:
                return wrap(`<rect x="10" y="10" width="80" height="80" rx="16" fill="#4ECDC4"/>`, size);
        }
    }

    // ==========================================
    // 7. TILE HELPERS (حروف، اعداد و کلمات داخل کاشی رنگی)
    // Kid-friendly tiles used as option icons & round visuals.
    // ==========================================
    function letterTile(letter, color, size) {
        const c = color || '#6C5CE7';
        size = size || 72;
        return wrap(`
            <rect x="6" y="6" width="88" height="88" rx="20" fill="${c}" stroke="#2C3A47" stroke-width="3"/>
            <rect x="14" y="14" width="26" height="26" rx="8" fill="#FFF" opacity="0.35"/>
            <text x="50" y="63" text-anchor="middle" font-size="52" font-weight="900" fill="#FFFFFF" font-family="Vazirmatn, Tahoma, sans-serif">${letter}</text>
        `, size);
    }

    function numberTile(n, color, size) {
        const c = color || '#00B894';
        size = size || 72;
        const faMap = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const fa = String(n).replace(/[0-9]/g, w => faMap[Number(w)]);
        return wrap(`
            <rect x="6" y="6" width="88" height="88" rx="20" fill="${c}" stroke="#2C3A47" stroke-width="3"/>
            <rect x="14" y="14" width="26" height="26" rx="8" fill="#FFF" opacity="0.35"/>
            <text x="50" y="63" text-anchor="middle" font-size="48" font-weight="900" fill="#FFFFFF" font-family="Vazirmatn, Tahoma, sans-serif">${fa}</text>
        `, size);
    }

    function wordTile(word, color, size) {
        const c = color || '#1E90FF';
        size = size || 72;
        const text = String(word || '؟');
        // Auto-shrink the font so long Persian words stay inside the tile.
        const fontSize = Math.max(13, Math.min(30, 31 - (text.length - 2) * 2.1));
        return wrap(`
            <rect x="6" y="6" width="88" height="88" rx="20" fill="${c}" stroke="#2C3A47" stroke-width="3"/>
            <rect x="14" y="14" width="26" height="26" rx="8" fill="#FFF" opacity="0.35"/>
            <text x="50" y="57" text-anchor="middle" font-size="${fontSize}" font-weight="900" fill="#FFFFFF" font-family="Vazirmatn, Tahoma, sans-serif">${text}</text>
        `, size);
    }

    function questionTile(color, size) {
        const c = color || '#A4B0BE';
        size = size || 72;
        return wrap(`
            <rect x="6" y="6" width="88" height="88" rx="20" fill="${c}" stroke="#2C3A47" stroke-width="3" stroke-dasharray="7 5"/>
            <text x="50" y="66" text-anchor="middle" font-size="56" font-weight="900" fill="#2C3A47" font-family="Vazirmatn, Tahoma, sans-serif">؟</text>
        `, size);
    }

    // Sound-wave banner used for listening questions (letter sounds, rhymes).
    function soundVisual(size) {
        size = size || 110;
        return wrap(`
            <circle cx="38" cy="50" r="26" fill="#6C5CE7"/>
            <path d="M30 40 L22 40 L22 60 L30 60 Z" fill="#FFFFFF"/>
            <path d="M36 36 Q44 50 36 64" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M46 30 Q58 50 46 70" stroke="#F9CA24" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M56 24 Q72 50 56 76" stroke="#FF8A5C" stroke-width="5" fill="none" stroke-linecap="round"/>
            <circle cx="78" cy="22" r="5" fill="#FF6B6B"/>
            <circle cx="86" cy="42" r="3.5" fill="#00B894"/>
            <circle cx="84" cy="70" r="4.5" fill="#A29BFE"/>
        `, size);
    }

    return { shape, numberCard, animal, object, letterTile, numberTile, wordTile, questionTile, soundVisual };
})();

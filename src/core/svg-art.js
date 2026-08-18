// SVG Art Library - all illustrations drawn programmatically
// Follows the visual style guide: rounded, soft colors, kid-friendly
const SvgArt = (function() {

    // ---- Shapes ----
    function shape(kind, color, size) {
        size = size || 80;
        const c = color || '#4ECDC4';
        const s = size;
        switch (kind) {
            case 'circle': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="${c}"/><circle cx="38" cy="40" r="6" fill="#fff" opacity="0.5"/></svg>`;
            case 'triangle': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M50 8 L92 88 L8 88 Z" fill="${c}" stroke-linejoin="round"/><circle cx="40" cy="62" r="5" fill="#fff" opacity="0.5"/></svg>`;
            case 'square': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><rect x="12" y="12" width="76" height="76" rx="10" fill="${c}"/><rect x="26" y="26" width="20" height="20" rx="5" fill="#fff" opacity="0.5"/></svg>`;
            case 'rectangle': return `<svg width="${s*1.4}" height="${s}" viewBox="0 0 140 100"><rect x="8" y="16" width="124" height="68" rx="10" fill="${c}"/><rect x="24" y="34" width="18" height="18" rx="4" fill="#fff" opacity="0.5"/></svg>`;
            case 'oval': return `<svg width="${s*1.3}" height="${s}" viewBox="0 0 130 100"><ellipse cx="65" cy="50" rx="55" ry="38" fill="${c}"/><ellipse cx="50" cy="38" rx="8" ry="5" fill="#fff" opacity="0.5"/></svg>`;
            case 'diamond': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M50 6 L94 50 L50 94 L6 50 Z" fill="${c}"/><path d="M50 22 L78 50 L50 78 L22 50 Z" fill="#fff" opacity="0.25"/></svg>`;
        }
        return '';
    }

    // ---- Number card with dots ----
    function numberCard(n, color, size) {
        size = size || 90;
        const dots = {
            1: ['50,45'], 2: ['30,32', '70,58'], 3: ['30,32', '50,45', '70,58'],
            4: ['28,28', '72,28', '28,62', '72,62'], 5: ['28,28', '72,28', '50,45', '28,62', '72,62'],
            6: ['28,25', '72,25', '28,45', '72,45', '28,65', '72,65'],
            7: ['28,22', '72,22', '50,33', '28,44', '72,44', '50,55', '28,66'],
            8: ['28,22', '72,22', '28,45', '72,45', '28,68', '72,68', '50,33', '50,56'],
            9: ['28,22', '72,22', '28,45', '72,45', '28,68', '72,68', '50,22', '50,68'],
            10: ['25,22', '55,22', '25,40', '55,40', '25,58', '55,58', '25,76', '55,76', '70,45', '78,45']
        };
        const dotSvg = (dots[n] || []).map(d => {
            const [x, y] = d.split(',');
            return `<circle cx="${x}" cy="${y}" r="7" fill="${color || '#FF6B6B'}"/>`;
        }).join('');
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
            <rect x="4" y="4" width="92" height="92" rx="16" fill="#FFF" stroke="${color || '#FF6B6B'}" stroke-width="4"/>
            ${dotSvg}
            <text x="50" y="66" text-anchor="middle" font-size="30" font-weight="bold" fill="${color || '#FF6B6B'}">${n}</text>
        </svg>`;
    }

    // ---- Simple animal / object icons (kid style) ----
    // Each is a small, friendly vector drawing
    function animal(kind, size) {
        size = size || 90;
        const s = size;
        switch (kind) {
            case 'cat': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="55" r="30" fill="#F8C291"/>
                <path d="M30 35 L22 15 L45 28 Z" fill="#F8C291"/><path d="M70 35 L78 15 L55 28 Z" fill="#F8C291"/>
                <path d="M30 35 L24 20 L40 30 Z" fill="#FFC9A3"/><path d="M70 35 L76 20 L60 30 Z" fill="#FFC9A3"/>
                <circle cx="38" cy="52" r="4" fill="#2D3436"/><circle cx="62" cy="52" r="4" fill="#2D3436"/>
                <circle cx="36.5" cy="50.5" r="1.5" fill="#fff"/><circle cx="60.5" cy="50.5" r="1.5" fill="#fff"/>
                <path d="M42 62 Q50 68 58 62" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M25 75 Q15 85 12 80" stroke="#F8C291" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M75 75 Q85 85 88 80" stroke="#F8C291" stroke-width="6" fill="none" stroke-linecap="round"/>
            </svg>`;
            case 'dog': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="62" rx="28" ry="26" fill="#D6A2E8"/>
                <circle cx="50" cy="42" r="22" fill="#D6A2E8"/>
                <path d="M30 34 L24 12 L44 26 Z" fill="#A974BC"/><path d="M70 34 L76 12 L56 26 Z" fill="#A974BC"/>
                <ellipse cx="38" cy="42" rx="7" ry="5" fill="#fff"/><ellipse cx="62" cy="42" rx="7" ry="5" fill="#fff"/>
                <circle cx="38" cy="42" r="3.5" fill="#2D3436"/><circle cx="62" cy="42" r="3.5" fill="#2D3436"/>
                <ellipse cx="50" cy="52" rx="4" ry="3" fill="#2D3436"/>
                <path d="M42 62 Q50 68 58 62" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>`;
            case 'bird': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="58" rx="26" ry="24" fill="#74B9FF"/>
                <circle cx="50" cy="40" r="16" fill="#74B9FF"/>
                <path d="M62 34 L84 24 L66 42 Z" fill="#74B9FF"/>
                <path d="M38 52 L14 44 L36 58 Z" fill="#74B9FF"/>
                <circle cx="45" cy="38" r="3" fill="#2D3436"/><circle cx="55" cy="38" r="3" fill="#2D3436"/>
                <path d="M44 46 L56 46 L50 52 Z" fill="#F9CA24"/>
                <path d="M38 68 Q44 76 52 68" stroke="#0984E3" stroke-width="3" fill="none"/>
            </svg>`;
            case 'fish': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M15 50 Q35 25 70 50 Q35 75 15 50 Z" fill="#55EFC4"/>
                <path d="M70 50 L92 34 L92 66 Z" fill="#55EFC4"/>
                <circle cx="38" cy="46" r="4" fill="#2D3436"/>
                <path d="M30 58 Q36 62 42 58" stroke="#00B894" stroke-width="2.5" fill="none"/>
                <path d="M60 40 Q65 30 72 36" stroke="#FFF" stroke-width="3" fill="none" opacity="0.6"/>
            </svg>`;
            case 'turtle': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="55" cy="55" rx="30" ry="26" fill="#00B894"/>
                <circle cx="42" cy="55" r="14" fill="#55EFC4"/>
                <path d="M30 55 Q22 48 16 52" stroke="#00B894" stroke-width="6" fill="none" stroke-linecap="round"/>
                <circle cx="20" cy="50" r="3" fill="#2D3436"/>
                <path d="M70 45 Q78 40 84 44" stroke="#00B894" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M48 78 L42 90 M62 78 L68 90" stroke="#00B894" stroke-width="6" stroke-linecap="round"/>
                <path d="M40 52 Q45 49 50 52" stroke="#2D3436" stroke-width="2" fill="none"/>
            </svg>`;
            case 'lion': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="55" r="30" fill="#F9CA24"/>
                <circle cx="50" cy="50" r="20" fill="#FDCB6E"/>
                <path d="M20 30 Q8 10 26 16 M32 20 Q24 2 42 12 M68 20 Q76 2 58 12 M80 30 Q92 10 74 16" stroke="#E17055" stroke-width="4" fill="none" stroke-linecap="round"/>
                <circle cx="42" cy="48" r="4" fill="#2D3436"/><circle cx="58" cy="48" r="4" fill="#2D3436"/>
                <circle cx="40.5" cy="46.5" r="1.5" fill="#fff"/><circle cx="56.5" cy="46.5" r="1.5" fill="#fff"/>
                <ellipse cx="50" cy="56" rx="4" ry="3" fill="#E17055"/>
                <path d="M42 64 Q50 70 58 64" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>`;
            case 'elephant': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="55" cy="65" rx="28" ry="24" fill="#74B9FF"/>
                <circle cx="40" cy="48" r="22" fill="#74B9FF"/>
                <path d="M22 46 L8 40 L20 52" fill="#74B9FF"/>
                <circle cx="32" cy="44" r="3.5" fill="#2D3436"/><circle cx="46" cy="44" r="3.5" fill="#2D3436"/>
                <path d="M36 50 Q48 52 42 62" stroke="#2D3436" stroke-width="2.5" fill="none"/>
                <path d="M60 72 Q72 78 78 84" stroke="#74B9FF" stroke-width="8" fill="none" stroke-linecap="round"/>
                <path d="M48 84 L40 92 M58 84 L50 92 M68 84 L60 92" stroke="#74B9FF" stroke-width="5" stroke-linecap="round"/>
            </svg>`;
            case 'monkey': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="48" r="26" fill="#A974BC"/>
                <circle cx="50" cy="30" r="18" fill="#A974BC"/>
                <path d="M38 30 Q26 34 30 20" stroke="#A974BC" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M62 30 Q74 34 70 20" stroke="#A974BC" stroke-width="6" fill="none" stroke-linecap="round"/>
                <circle cx="30" cy="34" r="5" fill="#FFC9A3"/><circle cx="70" cy="34" r="5" fill="#FFC9A3"/>
                <circle cx="44" cy="46" r="4" fill="#2D3436"/><circle cx="56" cy="46" r="4" fill="#2D3436"/>
                <circle cx="43" cy="45" r="1.5" fill="#fff"/><circle cx="55" cy="45" r="1.5" fill="#fff"/>
                <path d="M44 56 Q50 60 56 56" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M40 72 Q28 82 22 90" stroke="#A974BC" stroke-width="7" fill="none" stroke-linecap="round"/>
            </svg>`;
            case 'bear': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="60" r="26" fill="#B08968"/>
                <circle cx="50" cy="42" r="20" fill="#B08968"/>
                <circle cx="34" cy="26" r="10" fill="#B08968"/><circle cx="66" cy="26" r="10" fill="#B08968"/>
                <circle cx="34" cy="26" r="4" fill="#DDB892"/><circle cx="66" cy="26" r="4" fill="#DDB892"/>
                <ellipse cx="50" cy="46" rx="10" ry="7" fill="#DDB892"/>
                <circle cx="43" cy="40" r="3.5" fill="#2D3436"/><circle cx="57" cy="40" r="3.5" fill="#2D3436"/>
                <circle cx="41.5" cy="38.5" r="1.3" fill="#fff"/><circle cx="55.5" cy="38.5" r="1.3" fill="#fff"/>
                <path d="M44 50 Q50 54 56 50" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>`;
            case 'rabbit': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="62" rx="24" ry="26" fill="#FFE0EC"/>
                <path d="M36 40 Q30 10 44 28 M64 40 Q70 10 56 28" stroke="#FFE0EC" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="M38 36 Q34 14 44 28 M62 36 Q66 14 56 28" stroke="#FFC9D8" stroke-width="6" fill="none" stroke-linecap="round"/>
                <circle cx="42" cy="58" r="4" fill="#2D3436"/><circle cx="58" cy="58" r="4" fill="#2D3436"/>
                <circle cx="40.5" cy="56.5" r="1.5" fill="#fff"/><circle cx="56.5" cy="56.5" r="1.5" fill="#fff"/>
                <ellipse cx="50" cy="65" rx="3.5" ry="2.5" fill="#FF8FB0"/>
                <path d="M44 70 Q50 74 56 70" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>`;
            case 'fox': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="60" rx="28" ry="24" fill="#E17055"/>
                <path d="M24 40 L10 16 L40 30 Z" fill="#E17055"/><path d="M76 40 L90 16 L60 30 Z" fill="#E17055"/>
                <path d="M26 36 L16 20 L36 30 Z" fill="#FFF3E0"/><path d="M74 36 L84 20 L64 30 Z" fill="#FFF3E0"/>
                <path d="M36 66 Q50 76 64 66 Q58 58 42 58 Z" fill="#FFF3E0"/>
                <circle cx="40" cy="54" r="4" fill="#2D3436"/><circle cx="60" cy="54" r="4" fill="#2D3436"/>
                <circle cx="38.5" cy="52.5" r="1.5" fill="#fff"/><circle cx="58.5" cy="52.5" r="1.5" fill="#fff"/>
                <ellipse cx="50" cy="62" rx="3" ry="2" fill="#2D3436"/>
                <path d="M45 66 Q50 70 55 66" stroke="#2D3436" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M72 72 Q84 78 82 68" stroke="#E17055" stroke-width="7" fill="none" stroke-linecap="round"/>
            </svg>`;
            case 'chicken': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="62" rx="26" ry="24" fill="#FFF"/>
                <circle cx="62" cy="42" r="12" fill="#FFF"/>
                <path d="M70 36 L86 28 L70 44 Z" fill="#F9CA24"/>
                <path d="M38 40 L24 32 L38 46 Z" fill="#F9CA24"/>
                <path d="M60 42 L64 32 L68 42 Z" fill="#E17055"/>
                <circle cx="58" cy="40" r="2.5" fill="#2D3436"/>
                <path d="M36 66 L18 62 L36 72 Z" fill="#FF6B6B"/>
                <path d="M30 80 L24 88 M36 84 L32 92" stroke="#F9CA24" stroke-width="4" stroke-linecap="round"/>
                <path d="M60 78 Q70 84 76 90" stroke="#E17055" stroke-width="4" stroke-linecap="round"/>
            </svg>`;
            case 'bee': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="60" rx="22" ry="16" fill="#F9CA24"/>
                <path d="M28 60 Q12 40 24 30 M28 60 Q40 48 32 38" stroke="#F9CA24" stroke-width="4" fill="none"/>
                <path d="M34 66 Q14 74 24 82 M34 66 Q44 76 36 84" stroke="#F9CA24" stroke-width="4" fill="none"/>
                <path d="M30 52 L38 52 M30 62 L38 62 M30 72 L38 72" stroke="#2D3436" stroke-width="3"/>
                <circle cx="62" cy="48" r="12" fill="#F9CA24"/>
                <path d="M72 44 L86 38 L72 52 Z" fill="#4ECDC4" opacity="0.6"/>
                <circle cx="58" cy="46" r="2.5" fill="#2D3436"/>
                <path d="M46 66 Q50 70 54 66" stroke="#2D3436" stroke-width="2" fill="none"/>
            </svg>`;
            case 'butterfly': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="40" cy="42" rx="22" ry="16" fill="#F368E0"/>
                <ellipse cx="60" cy="42" rx="22" ry="16" fill="#FF9FF3"/>
                <ellipse cx="40" cy="62" rx="16" ry="12" fill="#F368E0"/>
                <ellipse cx="60" cy="62" rx="16" ry="12" fill="#FF9FF3"/>
                <circle cx="40" cy="42" r="6" fill="#FFF" opacity="0.4"/>
                <circle cx="60" cy="42" r="6" fill="#FFF" opacity="0.4"/>
                <ellipse cx="50" cy="52" rx="4" ry="16" fill="#6C5CE7"/>
                <path d="M50 38 L50 24 M50 60 L50 74" stroke="#6C5CE7" stroke-width="3" stroke-linecap="round"/>
                <circle cx="48" cy="34" r="2.5" fill="#2D3436"/><circle cx="52" cy="34" r="2.5" fill="#2D3436"/>
            </svg>`;
            case 'frog': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="62" rx="28" ry="22" fill="#00B894"/>
                <circle cx="34" cy="42" r="10" fill="#00B894"/><circle cx="66" cy="42" r="10" fill="#00B894"/>
                <circle cx="34" cy="40" r="6" fill="#FFF"/><circle cx="66" cy="40" r="6" fill="#FFF"/>
                <circle cx="34" cy="40" r="3" fill="#2D3436"/><circle cx="66" cy="40" r="3" fill="#2D3436"/>
                <ellipse cx="50" cy="60" rx="6" ry="4" fill="#FFF"/>
                <path d="M40 66 Q50 72 60 66" stroke="#2D3436" stroke-width="2.5" fill="none"/>
                <path d="M28 78 Q20 86 14 84 M72 78 Q80 86 86 84" stroke="#00B894" stroke-width="5" stroke-linecap="round"/>
            </svg>`;
            case 'duck': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="64" rx="26" ry="22" fill="#F9CA24"/>
                <circle cx="64" cy="44" r="14" fill="#F9CA24"/>
                <circle cx="61" cy="41" r="3" fill="#2D3436"/>
                <path d="M50 58 Q42 56 40 52 L28 52 Q24 52 26 56 L38 60 Z" fill="#FF8A5C"/>
                <path d="M42 62 Q50 70 58 62" stroke="#E17055" stroke-width="2.5" fill="none"/>
                <path d="M36 84 L28 92 M44 84 L36 92" stroke="#FF8A5C" stroke-width="5" stroke-linecap="round"/>
                <path d="M60 80 Q72 84 78 88" stroke="#F9CA24" stroke-width="4" stroke-linecap="round"/>
            </svg>`;
            case 'sheep': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="60" rx="28" ry="22" fill="#FFF"/>
                <circle cx="52" cy="30" r="16" fill="#FFF"/>
                <ellipse cx="44" cy="30" rx="6" ry="9" fill="#F5F6FA"/><ellipse cx="60" cy="30" rx="6" ry="9" fill="#F5F6FA"/>
                <ellipse cx="34" cy="58" rx="6" ry="9" fill="#F5F6FA"/><ellipse cx="66" cy="58" rx="6" ry="9" fill="#F5F6FA"/>
                <ellipse cx="50" cy="72" rx="7" ry="9" fill="#F5F6FA"/>
                <circle cx="46" cy="48" r="3" fill="#2D3436"/><circle cx="58" cy="48" r="3" fill="#2D3436"/>
                <path d="M44 55 Q52 60 60 55" stroke="#2D3436" stroke-width="2" fill="none"/>
                <path d="M40 80 L34 90 M52 80 L46 90 M62 80 L56 90" stroke="#636E72" stroke-width="4" stroke-linecap="round"/>
            </svg>`;
            case 'cow': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="66" rx="28" ry="22" fill="#F5F6FA"/>
                <ellipse cx="40" cy="60" rx="7" ry="9" fill="#2D3436" opacity="0.85"/>
                <ellipse cx="60" cy="60" rx="7" ry="9" fill="#2D3436" opacity="0.85"/>
                <ellipse cx="46" cy="42" rx="6" ry="8" fill="#FFD3E0"/>
                <circle cx="50" cy="36" r="12" fill="#F5F6FA"/>
                <path d="M44 26 L40 14 L50 22 M56 26 L60 14 L50 22" stroke="#F5F6FA" stroke-width="5" fill="none"/>
                <path d="M44 26 L40 14 M56 26 L60 14" stroke="#FFD3E0" stroke-width="2"/>
                <circle cx="46" cy="40" r="3" fill="#2D3436"/><circle cx="56" cy="40" r="3" fill="#2D3436"/>
                <path d="M46 48 Q52 52 58 48" stroke="#2D3436" stroke-width="2" fill="none"/>
                <path d="M38 84 L30 94 M46 84 L38 94 M58 84 L50 94 M66 84 L58 94" stroke="#636E72" stroke-width="4" stroke-linecap="round"/>
            </svg>`;
            default: return '';
        }
    }

    // ---- Food / objects ----
    function object(kind, size) {
        size = size || 80;
        const s = size;
        switch (kind) {
            case 'apple': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="58" r="26" fill="#FF6B6B"/>
                <path d="M50 34 Q42 20 50 14 Q58 20 50 34" fill="#2D3436"/>
                <path d="M42 62 L24 72 M58 62 L76 72" stroke="#00B894" stroke-width="5" fill="none"/>
                <circle cx="40" cy="52" r="4" fill="#FFF" opacity="0.5"/>
            </svg>`;
            case 'banana': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M30 30 Q18 60 40 76 Q58 88 70 74 Q78 64 70 56 Q62 48 54 52 Q46 56 42 50 Q36 42 30 30Z" fill="#F9CA24"/>
                <path d="M30 30 Q22 24 18 28" stroke="#2D3436" stroke-width="3" fill="none"/>
            </svg>`;
            case 'orange': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="55" r="27" fill="#FF8A5C"/>
                <circle cx="50" cy="30" r="6" fill="#00B894"/>
                <circle cx="42" cy="48" r="4" fill="#FFF" opacity="0.4"/>
            </svg>`;
            case 'watermelon': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M14 40 Q50 80 86 40 Q50 58 14 40Z" fill="#FF6B6B"/>
                <path d="M22 44 Q50 74 78 44" stroke="#00B894" stroke-width="4" fill="none"/>
                <circle cx="36" cy="50" r="3" fill="#2D3436"/><circle cx="50" cy="55" r="3" fill="#2D3436"/><circle cx="64" cy="50" r="3" fill="#2D3436"/>
            </svg>`;
            case 'milk': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <rect x="30" y="30" width="40" height="54" rx="8" fill="#FFF"/>
                <path d="M38 30 L42 14 L58 14 L62 30" fill="#FFF"/>
                <path d="M44 14 L56 14" stroke="#DFE6E9" stroke-width="3"/>
                <rect x="40" y="46" width="20" height="24" rx="4" fill="#74B9FF"/>
            </svg>`;
            case 'bread': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M22 38 Q50 14 78 38 L74 66 Q50 76 26 66 Z" fill="#E1B12C"/>
                <path d="M32 44 Q50 30 68 44" stroke="#F8C291" stroke-width="4" fill="none"/>
                <path d="M40 40 Q50 33 60 40" stroke="#FFF" stroke-width="3" fill="none" opacity="0.5"/>
            </svg>`;
            case 'ball': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="34" fill="#FF6B6B"/>
                <path d="M50 16 A34 34 0 0 1 84 50" stroke="#FFF" stroke-width="3" fill="none"/>
                <path d="M50 16 A34 34 0 0 0 16 50" stroke="#FFF" stroke-width="3" fill="none"/>
                <path d="M16 50 Q50 62 84 50" stroke="#FFF" stroke-width="3" fill="none"/>
                <path d="M50 16 L50 84" stroke="#FFF" stroke-width="3"/>
            </svg>`;
            case 'car': return `<svg width="${s*1.3}" height="${s}" viewBox="0 0 130 100">
                <path d="M18 66 L28 44 Q32 34 44 34 L86 34 Q98 34 102 44 L112 66 Z" fill="#FF6B6B"/>
                <path d="M44 34 Q50 18 70 18 L80 18 Q90 18 92 30 L86 34 Z" fill="#4ECDC4"/>
                <rect x="50" y="24" width="16" height="12" rx="3" fill="#74B9FF"/>
                <rect x="72" y="24" width="12" height="12" rx="3" fill="#74B9FF"/>
                <circle cx="38" cy="66" r="9" fill="#2D3436"/><circle cx="92" cy="66" r="9" fill="#2D3436"/>
                <circle cx="38" cy="66" r="4" fill="#FFF"/><circle cx="92" cy="66" r="4" fill="#FFF"/>
                <rect x="22" y="60" width="86" height="8" rx="4" fill="#2D3436"/>
            </svg>`;
            case 'tree': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <rect x="44" y="58" width="12" height="30" rx="4" fill="#A974BC"/>
                <circle cx="50" cy="44" r="26" fill="#00B894"/>
                <circle cx="34" cy="54" r="14" fill="#55EFC4"/>
                <circle cx="66" cy="54" r="14" fill="#55EFC4"/>
                <circle cx="50" cy="28" r="14" fill="#55EFC4"/>
                <circle cx="44" cy="38" r="4" fill="#FFF" opacity="0.4"/>
            </svg>`;
            case 'flower': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="56" r="10" fill="#F9CA24"/>
                <circle cx="50" cy="34" r="12" fill="#FF6B6B"/><circle cx="68" cy="46" r="12" fill="#FF8A5C"/>
                <circle cx="64" cy="68" r="12" fill="#F368E0"/><circle cx="36" cy="68" r="12" fill="#FF6B6B"/>
                <circle cx="32" cy="46" r="12" fill="#FF8A5C"/>
                <circle cx="50" cy="56" r="7" fill="#F9CA24"/>
                <rect x="47" y="66" width="6" height="26" rx="3" fill="#00B894"/>
                <path d="M47 76 Q30 74 26 64 M53 82 Q70 80 74 70" stroke="#00B894" stroke-width="4" fill="none"/>
            </svg>`;
            case 'sun': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="22" fill="#F9CA24"/>
                <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M24 24 L31 31 M69 69 L76 76 M76 24 L69 31 M31 69 L24 76" stroke="#F9CA24" stroke-width="5" stroke-linecap="round"/>
            </svg>`;
            case 'moon': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M62 12 A38 38 0 1 0 88 60 A30 30 0 0 1 62 12Z" fill="#F9CA24"/>
                <circle cx="70" cy="38" r="3" fill="#FFF" opacity="0.6"/>
            </svg>`;
            case 'star': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M50 8 L61 36 L92 38 L68 58 L76 90 L50 72 L24 90 L32 58 L8 38 L39 36 Z" fill="#F9CA24"/>
            </svg>`;
            case 'rain': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <ellipse cx="50" cy="44" rx="30" ry="20" fill="#74B9FF"/>
                <path d="M22 40 Q24 22 40 26 Q42 12 58 18 Q60 8 72 20 Q86 22 78 40" fill="#A29BFE"/>
                <path d="M28 58 L22 74 M46 60 L40 76 M64 58 L58 74 M80 60 L74 76" stroke="#74B9FF" stroke-width="4" stroke-linecap="round"/>
            </svg>`;
            case 'snow': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <circle cx="28" cy="34" r="6" fill="#74B9FF"/><circle cx="62" cy="24" r="7" fill="#74B9FF"/><circle cx="76" cy="52" r="5" fill="#74B9FF"/>
                <circle cx="42" cy="60" r="8" fill="#74B9FF"/><circle cx="20" cy="66" r="5" fill="#74B9FF"/>
                <path d="M50 34 L50 74 M50 34 L50 74" stroke="#FFF" stroke-width="2" opacity="0.4"/>
            </svg>`;
            case 'book': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M24 16 L76 16 L76 78 L24 78 Z" fill="#4ECDC4"/>
                <path d="M24 16 L50 22 L76 16 L76 78 L50 72 L24 78 Z" fill="#55EFC4"/>
                <line x1="50" y1="22" x2="50" y2="72" stroke="#2D3436" stroke-width="1.5" opacity="0.3"/>
                <rect x="60" y="28" width="8" height="8" rx="2" fill="#FFF" opacity="0.7"/>
            </svg>`;
            case 'home': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M50 14 L90 48 L80 48 L80 86 L20 86 L20 48 L10 48 Z" fill="#FF8A5C"/>
                <rect x="38" y="60" width="24" height="26" rx="4" fill="#FFF3E0"/>
                <path d="M50 14 L90 48 L80 48 L80 86 L20 86 L20 48 L10 48 Z" fill="none" stroke="#E17055" stroke-width="3" stroke-linejoin="round"/>
            </svg>`;
            case 'hat': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M20 70 Q20 40 50 40 Q80 40 80 70 Z" fill="#6C5CE7"/>
                <path d="M30 44 Q30 24 50 24 Q70 24 70 44 Q70 34 50 34 Q30 34 30 44" fill="#5D4EC7"/>
                <rect x="18" y="70" width="64" height="12" rx="6" fill="#5D4EC7"/>
            </svg>`;
            case 'tooth': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M28 40 Q22 62 34 76 Q40 84 42 74 Q44 66 50 66 Q56 66 58 74 Q60 84 66 76 Q78 62 72 40 Q68 24 50 24 Q32 24 28 40Z" fill="#FFF"/>
                <path d="M50 30 Q52 46 50 56" stroke="#F5F6FA" stroke-width="3" fill="none"/>
            </svg>`;
            case 'hand': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M44 34 L40 18 M52 32 L50 16 M60 34 L64 18 M68 40 L76 28 M40 34 L24 34 L28 50 L34 62 L40 74 Q48 84 58 78 Q66 72 64 60 L64 44" fill="#FFC9A3" stroke="#E8A87C" stroke-width="2"/>
            </svg>`;
            case 'nose': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M30 40 Q50 30 70 40 L66 64 Q50 76 34 64 Z" fill="#FFC9A3"/>
                <circle cx="44" cy="62" r="4" fill="#E8A87C"/><circle cx="56" cy="62" r="4" fill="#E8A87C"/>
            </svg>`;
            case 'ear': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M50 16 Q76 16 78 44 Q79 66 64 74 Q56 78 56 64 Q56 44 50 44 Q42 44 36 58 Q30 72 40 78 Q28 78 24 62 Q20 40 36 26 Z" fill="#FFC9A3" stroke="#E8A87C" stroke-width="2"/>
                <path d="M52 30 Q66 34 66 46" stroke="#E8A87C" stroke-width="2" fill="none"/>
            </svg>`;
            case 'eye': return `<svg width="${s}" height="${s}" viewBox="0 0 100 100">
                <path d="M14 50 Q50 20 86 50 Q50 80 14 50Z" fill="#FFF"/>
                <circle cx="50" cy="50" r="18" fill="#74B9FF"/>
                <circle cx="50" cy="50" r="9" fill="#2D3436"/>
                <circle cx="46" cy="46" r="3" fill="#FFF"/>
                <path d="M20 46 Q32 34 46 36 M80 54 Q68 66 54 64" stroke="#636E72" stroke-width="1.5" fill="none"/>
            </svg>`;
            default: return '';
        }
    }

    // Random choice helper
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    return { shape, numberCard, animal, object, pick };
})();

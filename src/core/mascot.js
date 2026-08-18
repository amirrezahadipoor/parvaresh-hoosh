// Multi-Character Mascot Engine with Living Rig Animations for "پرورش هوش کودک"
// Continuous Breathing, Blinking, Ear Wiggles, Paw Waving & Voice Sync
window.Mascot = (function() {

    const CHARACTERS = [
        { id: 'dana', name: 'دانا (روباه دانا)', title: 'راهنمای باهوش', color: '#FF763B' },
        { id: 'barfi', name: 'برفی (خرگوش شاد)', title: 'همبازی پرانرژی', color: '#FF8FB0' },
        { id: 'shiri', name: 'شیری (شیر شجاع)', title: 'قهرمان پرتوان', color: '#F1C40F' },
        { id: 'toto', name: 'توتو (طوطی خوش‌صدا)', title: 'آوازخوان خندان', color: '#00D2D3' },
        { id: 'fandogh', name: 'فندق (سنجاب زرنگ)', title: 'کاشف کنجکاو', color: '#D35400' }
    ];

    let currentMascotId = 'dana';

    function setCharacter(id) {
        if (CHARACTERS.some(c => c.id === id)) {
            currentMascotId = id;
            if (window.Storage) window.Storage.save('selected_mascot', id);
        }
    }

    function getCharacter() {
        return CHARACTERS.find(c => c.id === currentMascotId) || CHARACTERS[0];
    }

    function listCharacters() {
        return CHARACTERS;
    }

    // Dynamic Mascot SVG Builder with CSS living animations
    function svg(size, mood, characterId, id) {
        size = size || 100;
        mood = mood || 'happy';
        const charId = characterId || currentMascotId;
        const uid = id || ('mascot-' + Math.random().toString(36).substr(2, 6));

        switch (charId) {
            case 'barfi': return svgRabbit(size, mood, uid);
            case 'shiri': return svgLion(size, mood, uid);
            case 'toto': return svgParrot(size, mood, uid);
            case 'fandogh': return svgSquirrel(size, mood, uid);
            case 'dana':
            default: return svgFox(size, mood, uid);
        }
    }

    // 1. DANA THE FOX
    function svgFox(size, mood, uid) {
        let eyeL = `<circle cx="38" cy="46" r="6.5" fill="#2C3A47"/><circle cx="36" cy="43.5" r="2.4" fill="#FFF"/><circle cx="40.5" cy="48" r="1.1" fill="#FFF"/>`;
        let eyeR = `<circle cx="62" cy="46" r="6.5" fill="#2C3A47"/><circle cx="60" cy="43.5" r="2.4" fill="#FFF"/><circle cx="64.5" cy="48" r="1.1" fill="#FFF"/>`;
        let mouth = `<path d="M43 59 Q50 67 57 59" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M47 62 Q50 67 53 62" fill="#FF6B81"/>`;
        let brows = `<path d="M32 37 Q38 34 44 38" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M56 38 Q62 34 68 37" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;
        let extras = '';

        if (mood === 'celebrating' || mood === 'proud') {
            eyeL = `<path d="M32 48 Q38 40 44 48" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
            eyeR = `<path d="M56 48 Q62 40 68 48" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
            mouth = `<path d="M41 57 Q50 72 59 57 Z" fill="#E74C3C" stroke="#2C3A47" stroke-width="2.5"/><path d="M44 64 Q50 71 56 64" fill="#FF7675"/>`;
            extras = `<g class="mascot-starburst" transform="translate(0, -6)">
                        <path d="M12 28 L14 34 L20 34 L15 38 L17 44 L12 40 L7 44 L9 38 L4 34 L10 34 Z" fill="#F1C40F"/>
                        <path d="M88 28 L90 34 L96 34 L91 38 L93 44 L88 40 L83 44 L85 38 L80 34 L86 34 Z" fill="#F1C40F"/>
                      </g>`;
        } else if (mood === 'thinking') {
            mouth = `<path d="M45 61 Q50 58 55 60" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/>`;
            extras = `<g class="mascot-think-bubble" transform="translate(68, 6)"><circle cx="10" cy="11" r="5" fill="#A29BFE"/><circle cx="20" cy="3" r="7.5" fill="#6C5CE7"/><text x="20" y="7" font-size="10" font-weight="900" fill="#FFF" text-anchor="middle">؟</text></g>`;
        }

        return `
        <svg id="${uid}" class="mascot-living-svg mascot-${mood}" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible;">
            <defs>
                <linearGradient id="bodyGrad-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF9052"/><stop offset="50%" stop-color="#FF763B"/><stop offset="100%" stop-color="#E15822"/>
                </linearGradient>
            </defs>
            <g class="mascot-rig-body">
                <!-- Tail with Wag Animation -->
                <g class="mascot-tail">
                    <path d="M72 68 Q94 74 88 56 Q82 44 74 54 Q68 62 72 68 Z" fill="url(#bodyGrad-${uid})"/>
                    <path d="M88 56 Q84 48 76 52 Q82 54 84 58 Z" fill="#FFFFFF"/>
                </g>
                <!-- Ears with subtle twitch -->
                <g class="mascot-ear-left">
                    <path d="M22 36 L15 12 Q28 16 34 26 Z" fill="url(#bodyGrad-${uid})"/>
                    <path d="M23 32 L19 18 Q27 21 30 27 Z" fill="#FFD6C4"/>
                </g>
                <g class="mascot-ear-right">
                    <path d="M78 36 L85 12 Q72 16 66 26 Z" fill="url(#bodyGrad-${uid})"/>
                    <path d="M77 32 L81 18 Q73 21 70 27 Z" fill="#FFD6C4"/>
                </g>
                <!-- Body & Paws -->
                <path d="M34 70 Q50 67 66 70 L64 90 Q50 93 36 90 Z" fill="url(#bodyGrad-${uid})"/>
                <path d="M42 70 Q50 82 58 70 Q54 85 50 87 Q46 85 42 70 Z" fill="#FFFFFF"/>
                <g class="mascot-waving-paw">
                    <ellipse cx="36" cy="89" rx="6" ry="4.5" fill="#FFE0CE" stroke="#D35400" stroke-width="1"/>
                </g>
                <ellipse cx="64" cy="89" rx="6" ry="4.5" fill="#FFE0CE" stroke="#D35400" stroke-width="1"/>
                <!-- Head -->
                <g class="mascot-head">
                    <ellipse cx="50" cy="50" rx="36" ry="30" fill="url(#bodyGrad-${uid})"/>
                    <path d="M20 54 Q28 68 44 64 Q50 62 56 64 Q72 68 80 54 Q76 74 50 76 Q24 74 20 54 Z" fill="#FFFFFF"/>
                    ${brows}
                    <!-- Eyes with Blink Animation -->
                    <g class="mascot-blink-eyes">
                        ${eyeL}
                        ${eyeR}
                    </g>
                    <ellipse cx="26" cy="56" rx="5.5" ry="3.5" fill="#FF7675" opacity="0.65"/>
                    <ellipse cx="74" cy="56" rx="5.5" ry="3.5" fill="#FF7675" opacity="0.65"/>
                    <path d="M46 52 Q50 49 54 52 Q50 57 46 52 Z" fill="#2C3A47"/>
                    ${mouth}
                    <g stroke="#6C5CE7" stroke-width="2.2" fill="none" opacity="0.92">
                        <circle cx="38" cy="46" r="11" fill="rgba(255,255,255,0.15)"/>
                        <circle cx="62" cy="46" r="11" fill="rgba(255,255,255,0.15)"/>
                        <path d="M49 46 Q50 44 51 46"/>
                    </g>
                </g>
            </g>
            ${extras}
        </svg>`;
    }

    // 2. BARFI THE RABBIT
    function svgRabbit(size, mood, uid) {
        return `
        <svg id="${uid}" class="mascot-living-svg mascot-${mood}" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible;">
            <g class="mascot-rig-body">
                <g class="mascot-ear-left">
                    <ellipse cx="36" cy="22" rx="9" ry="22" fill="#FFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="36" cy="22" rx="5" ry="16" fill="#FFB8B8"/>
                </g>
                <g class="mascot-ear-right">
                    <ellipse cx="64" cy="22" rx="9" ry="22" fill="#FFF" stroke="#2C3A47" stroke-width="2.5"/>
                    <ellipse cx="64" cy="22" rx="5" ry="16" fill="#FFB8B8"/>
                </g>
                <path d="M34 70 Q50 67 66 70 L64 92 Q50 94 36 92 Z" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2"/>
                <ellipse cx="50" cy="58" rx="34" ry="28" fill="#FFFFFF" stroke="#2C3A47" stroke-width="2.5"/>
                <g class="mascot-blink-eyes">
                    <circle cx="38" cy="54" r="5" fill="#2C3A47"/><circle cx="36.5" cy="52" r="2" fill="#FFF"/>
                    <circle cx="62" cy="54" r="5" fill="#2C3A47"/><circle cx="60.5" cy="52" r="2" fill="#FFF"/>
                </g>
                <circle cx="26" cy="62" r="6" fill="#FF7675" opacity="0.6"/>
                <circle cx="74" cy="62" r="6" fill="#FF7675" opacity="0.6"/>
                <ellipse cx="50" cy="60" rx="3.5" ry="2.5" fill="#FF7675"/>
                <path d="M46 65 Q50 70 54 65" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <rect x="47.5" y="67" width="5" height="4" rx="1" fill="#FFF" stroke="#2C3A47" stroke-width="1.5"/>
            </g>
        </svg>`;
    }

    // 3. SHIRI THE LION CUB
    function svgLion(size, mood, uid) {
        return `
        <svg id="${uid}" class="mascot-living-svg mascot-${mood}" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible;">
            <g class="mascot-rig-body">
                <circle cx="50" cy="50" r="42" fill="#E67E22" stroke="#D35400" stroke-width="3"/>
                <circle cx="28" cy="28" r="9" fill="#F1C40F" stroke="#2C3A47" stroke-width="2"/>
                <circle cx="72" cy="28" r="9" fill="#F1C40F" stroke="#2C3A47" stroke-width="2"/>
                <circle cx="50" cy="52" r="30" fill="#F1C40F" stroke="#2C3A47" stroke-width="2.5"/>
                <ellipse cx="50" cy="62" rx="14" ry="9" fill="#FEF5D3"/>
                <g class="mascot-blink-eyes">
                    <circle cx="40" cy="46" r="5" fill="#2C3A47"/><circle cx="38.5" cy="44" r="1.8" fill="#FFF"/>
                    <circle cx="60" cy="46" r="5" fill="#2C3A47"/><circle cx="58.5" cy="44" r="1.8" fill="#FFF"/>
                </g>
                <path d="M46 56 L54 56 L50 62 Z" fill="#8E44AD"/>
                <path d="M44 65 Q50 71 56 65" stroke="#2C3A47" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                <circle cx="30" cy="56" r="4.5" fill="#FF7675" opacity="0.5"/>
                <circle cx="70" cy="56" r="4.5" fill="#FF7675" opacity="0.5"/>
            </g>
        </svg>`;
    }

    // 4. TOTO THE PARROT
    function svgParrot(size, mood, uid) {
        return `
        <svg id="${uid}" class="mascot-living-svg mascot-${mood}" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible;">
            <g class="mascot-rig-body">
                <ellipse cx="50" cy="56" rx="28" ry="32" fill="#00D2D3" stroke="#2C3A47" stroke-width="2.5"/>
                <g class="mascot-ear-left"><path d="M22 46 Q10 60 22 74" fill="#FF4757" stroke="#2C3A47" stroke-width="2"/></g>
                <g class="mascot-ear-right"><path d="M78 46 Q90 60 78 74" fill="#FF4757" stroke="#2C3A47" stroke-width="2"/></g>
                <g class="mascot-blink-eyes">
                    <circle cx="40" cy="44" r="5" fill="#2C3A47"/><circle cx="38.5" cy="42" r="1.8" fill="#FFF"/>
                    <circle cx="60" cy="44" r="5" fill="#2C3A47"/><circle cx="58.5" cy="42" r="1.8" fill="#FFF"/>
                </g>
                <path d="M44 50 Q50 44 56 50 Q50 68 44 50 Z" fill="#FFA502" stroke="#2C3A47" stroke-width="2"/>
                <path d="M46 22 Q50 10 54 22" stroke="#F1C40F" stroke-width="5" stroke-linecap="round"/>
            </g>
        </svg>`;
    }

    // 5. FANDOGH THE SQUIRREL
    function svgSquirrel(size, mood, uid) {
        return `
        <svg id="${uid}" class="mascot-living-svg mascot-${mood}" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible;">
            <g class="mascot-rig-body">
                <g class="mascot-tail"><path d="M70 66 Q98 68 92 40 Q84 20 68 34 Q58 46 70 66 Z" fill="#D35400" stroke="#2C3A47" stroke-width="2.5"/></g>
                <g class="mascot-ear-left"><path d="M26 32 L22 14 L38 24 Z" fill="#E67E22" stroke="#2C3A47" stroke-width="2"/></g>
                <g class="mascot-ear-right"><path d="M74 32 L78 14 L62 24 Z" fill="#E67E22" stroke="#2C3A47" stroke-width="2"/></g>
                <ellipse cx="50" cy="54" rx="30" ry="26" fill="#E67E22" stroke="#2C3A47" stroke-width="2.5"/>
                <ellipse cx="50" cy="62" rx="14" ry="10" fill="#FFEAA7"/>
                <g class="mascot-blink-eyes">
                    <circle cx="38" cy="48" r="5" fill="#2C3A47"/><circle cx="36.5" cy="46" r="1.8" fill="#FFF"/>
                    <circle cx="62" cy="48" r="5" fill="#2C3A47"/><circle cx="60.5" cy="46" r="1.8" fill="#FFF"/>
                </g>
                <circle cx="50" cy="58" r="3.5" fill="#2C3A47"/>
                <path d="M46 64 Q50 68 54 64" stroke="#2C3A47" stroke-width="2" stroke-linecap="round" fill="none"/>
                <rect x="47.5" y="66" width="5" height="4" rx="1" fill="#FFF" stroke="#2C3A47" stroke-width="1.5"/>
            </g>
        </svg>`;
    }

    function celebrate(el) {
        if (!el) return;
        if (window.gsap) {
            gsap.timeline()
                .to(el, { duration: 0.15, scale: 1.25, rotation: -12, ease: 'back.out(2)' })
                .to(el, { duration: 0.15, rotation: 12, ease: 'power1.inOut' })
                .to(el, { duration: 0.25, scale: 1, rotation: 0, ease: 'elastic.out(1, 0.4)' });
        }
    }

    function bounce(el) {
        if (!el) return;
        if (window.gsap) {
            gsap.timeline()
                .to(el, { duration: 0.14, scaleY: 0.85, scaleX: 1.15, ease: 'power1.out' })
                .to(el, { duration: 0.22, scaleY: 1.2, scaleX: 0.9, y: -18, ease: 'power1.out' })
                .to(el, { duration: 0.28, scaleY: 1, scaleX: 1, y: 0, ease: 'bounce.out' });
        }
    }

    return {
        svg,
        celebrate,
        bounce,
        setCharacter,
        getCharacter,
        listCharacters
    };
})();

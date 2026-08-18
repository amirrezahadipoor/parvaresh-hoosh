// Mascot "دانا" (Dana the Clever Mascot) - High-Fidelity Kid Mascot
window.Mascot = (function() {

    function svg(size, mood, id) {
        size = size || 100;
        mood = mood || 'happy';
        const uid = id || ('mascot-' + Math.random().toString(36).substr(2, 6));

        // Eye expressions
        let leftEye = `<circle cx="38" cy="46" r="6.5" fill="#2C3A47"/>
                       <circle cx="36" cy="43.5" r="2.4" fill="#FFFFFF"/>
                       <circle cx="40.5" cy="48" r="1.1" fill="#FFFFFF"/>`;
        let rightEye = `<circle cx="62" cy="46" r="6.5" fill="#2C3A47"/>
                        <circle cx="60" cy="43.5" r="2.4" fill="#FFFFFF"/>
                        <circle cx="64.5" cy="48" r="1.1" fill="#FFFFFF"/>`;

        // Mouth expressions
        let mouth = `<path d="M43 59 Q50 67 57 59" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/>
                     <path d="M47 62 Q50 67 53 62" fill="#FF6B81"/>`;

        // Eyebrows
        let brows = `<path d="M32 37 Q38 34 44 38" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                     <path d="M56 38 Q62 34 68 37" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;

        // Extra elements (stars, thinking bubbles, tears, etc.)
        let extras = '';

        if (mood === 'celebrating' || mood === 'proud') {
            leftEye = `<path d="M32 48 Q38 40 44 48" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
            rightEye = `<path d="M56 48 Q62 40 68 48" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
            mouth = `<path d="M41 57 Q50 72 59 57 Z" fill="#E74C3C" stroke="#2C3A47" stroke-width="2.5"/>
                     <path d="M44 64 Q50 71 56 64" fill="#FF7675"/>`;
            brows = `<path d="M31 34 Q38 29 45 35" stroke="#D35400" stroke-width="3" stroke-linecap="round" fill="none"/>
                     <path d="M55 35 Q62 29 69 34" stroke="#D35400" stroke-width="3" stroke-linecap="round" fill="none"/>`;
            extras = `<g transform="translate(0, -6)">
                        <path d="M12 28 L14 34 L20 34 L15 38 L17 44 L12 40 L7 44 L9 38 L4 34 L10 34 Z" fill="#F1C40F" opacity="0.9"/>
                        <path d="M88 28 L90 34 L96 34 L91 38 L93 44 L88 40 L83 44 L85 38 L80 34 L86 34 Z" fill="#F1C40F" opacity="0.9"/>
                      </g>`;
        } else if (mood === 'thinking') {
            leftEye = `<circle cx="40" cy="43" r="5.5" fill="#2C3A47"/>
                       <circle cx="38.5" cy="41" r="2" fill="#FFFFFF"/>`;
            rightEye = `<circle cx="64" cy="43" r="5.5" fill="#2C3A47"/>
                        <circle cx="62.5" cy="41" r="2" fill="#FFFFFF"/>`;
            mouth = `<path d="M45 61 Q50 58 55 60" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/>`;
            brows = `<path d="M32 35 Q38 38 44 34" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                     <path d="M56 33 Q62 31 68 36" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;
            extras = `<g transform="translate(68, 8)">
                        <circle cx="4" cy="18" r="3" fill="#A29BFE" opacity="0.7"/>
                        <circle cx="10" cy="11" r="5" fill="#A29BFE" opacity="0.85"/>
                        <circle cx="20" cy="3" r="7.5" fill="#6C5CE7"/>
                        <text x="20" y="7" font-size="10" font-weight="900" fill="#FFF" text-anchor="middle">؟</text>
                      </g>`;
        } else if (mood === 'surprised') {
            leftEye = `<circle cx="38" cy="45" r="7.5" fill="#2C3A47"/>
                       <circle cx="36" cy="42" r="3" fill="#FFFFFF"/>`;
            rightEye = `<circle cx="62" cy="45" r="7.5" fill="#2C3A47"/>
                        <circle cx="60" cy="42" r="3" fill="#FFFFFF"/>`;
            mouth = `<ellipse cx="50" cy="62" rx="5" ry="7" fill="#E74C3C" stroke="#2C3A47" stroke-width="2.5"/>`;
            brows = `<path d="M30 33 Q38 28 44 33" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                     <path d="M56 33 Q62 28 70 33" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;
        } else if (mood === 'sad') {
            leftEye = `<circle cx="38" cy="47" r="6" fill="#2C3A47"/>
                       <circle cx="37" cy="45" r="2" fill="#FFFFFF"/>`;
            rightEye = `<circle cx="62" cy="47" r="6" fill="#2C3A47"/>
                        <circle cx="61" cy="45" r="2" fill="#FFFFFF"/>`;
            mouth = `<path d="M43 65 Q50 58 57 65" stroke="#2C3A47" stroke-width="3" stroke-linecap="round" fill="none"/>`;
            brows = `<path d="M33 34 Q39 38 45 40" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                     <path d="M55 40 Q61 38 67 34" stroke="#D35400" stroke-width="2.5" stroke-linecap="round" fill="none"/>`;
            extras = `<ellipse cx="32" cy="54" rx="2.5" ry="4" fill="#74B9FF" opacity="0.8"/>`;
        } else if (mood === 'wink') {
            leftEye = `<path d="M32 47 Q38 41 44 47" stroke="#2C3A47" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
            rightEye = `<circle cx="62" cy="46" r="6.5" fill="#2C3A47"/>
                        <circle cx="60" cy="43.5" r="2.4" fill="#FFFFFF"/>
                        <circle cx="64.5" cy="48" r="1.1" fill="#FFFFFF"/>`;
        }

        return `
        <svg id="${uid}" class="mascot-vector mascot-${mood}" width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible;" aria-hidden="true">
            <defs>
                <linearGradient id="bodyGrad-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF9052"/>
                    <stop offset="50%" stop-color="#FF763B"/>
                    <stop offset="100%" stop-color="#E15822"/>
                </linearGradient>
                <linearGradient id="innerEarGrad-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFD6C4"/>
                    <stop offset="100%" stop-color="#FFB396"/>
                </linearGradient>
                <linearGradient id="snoutGrad-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF"/>
                    <stop offset="100%" stop-color="#FFF3E8"/>
                </linearGradient>
                <filter id="shadow-${uid}" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.12"/>
                </filter>
            </defs>

            <!-- Tail -->
            <path d="M72 68 Q94 74 88 56 Q82 44 74 54 Q68 62 72 68 Z" fill="url(#bodyGrad-${uid})" filter="url(#shadow-${uid})"/>
            <path d="M88 56 Q84 48 76 52 Q82 54 84 58 Z" fill="#FFFFFF"/>

            <!-- Left Ear -->
            <path d="M22 36 L15 12 Q28 16 34 26 Z" fill="url(#bodyGrad-${uid})" filter="url(#shadow-${uid})"/>
            <path d="M23 32 L19 18 Q27 21 30 27 Z" fill="url(#innerEarGrad-${uid})"/>

            <!-- Right Ear -->
            <path d="M78 36 L85 12 Q72 16 66 26 Z" fill="url(#bodyGrad-${uid})" filter="url(#shadow-${uid})"/>
            <path d="M77 32 L81 18 Q73 21 70 27 Z" fill="url(#innerEarGrad-${uid})"/>

            <!-- Small Cute Body & Paws -->
            <path d="M34 70 Q50 67 66 70 L64 90 Q50 93 36 90 Z" fill="url(#bodyGrad-${uid})" filter="url(#shadow-${uid})"/>
            <path d="M42 70 Q50 82 58 70 Q54 85 50 87 Q46 85 42 70 Z" fill="#FFFFFF"/>
            <ellipse cx="36" cy="89" rx="6" ry="4.5" fill="#FFE0CE" stroke="#D35400" stroke-width="1"/>
            <ellipse cx="64" cy="89" rx="6" ry="4.5" fill="#FFE0CE" stroke="#D35400" stroke-width="1"/>

            <!-- Head -->
            <ellipse cx="50" cy="50" rx="36" ry="30" fill="url(#bodyGrad-${uid})" filter="url(#shadow-${uid})"/>

            <!-- Cute White Cheek & Snout Patches -->
            <path d="M20 54 Q28 68 44 64 Q50 62 56 64 Q72 68 80 54 Q76 74 50 76 Q24 74 20 54 Z" fill="url(#snoutGrad-${uid})"/>

            <!-- Eyebrows -->
            ${brows}

            <!-- Eyes -->
            ${leftEye}
            ${rightEye}

            <!-- Rosy Cheeks -->
            <ellipse cx="26" cy="56" rx="5.5" ry="3.5" fill="#FF7675" opacity="0.65"/>
            <ellipse cx="74" cy="56" rx="5.5" ry="3.5" fill="#FF7675" opacity="0.65"/>

            <!-- Nose -->
            <path d="M46 52 Q50 49 54 52 Q50 57 46 52 Z" fill="#2C3A47"/>
            <circle cx="48.5" cy="51.5" r="0.9" fill="#FFFFFF"/>

            <!-- Mouth -->
            ${mouth}

            <!-- Glasses (Teacher Look) -->
            <g stroke="#6C5CE7" stroke-width="2.2" fill="none" opacity="0.92">
                <circle cx="38" cy="46" r="11" fill="rgba(255,255,255,0.15)"/>
                <circle cx="62" cy="46" r="11" fill="rgba(255,255,255,0.15)"/>
                <path d="M49 46 Q50 44 51 46"/>
            </g>

            <!-- Extras (stars, bubbles, etc.) -->
            ${extras}
        </svg>`;
    }

    function celebrate(el) {
        if (!el) return;
        if (window.gsap) {
            gsap.timeline()
                .to(el, { duration: 0.15, scale: 1.2, rotation: -8, ease: 'back.out(2)' })
                .to(el, { duration: 0.15, rotation: 8, ease: 'power1.inOut' })
                .to(el, { duration: 0.2, scale: 1, rotation: 0, ease: 'elastic.out(1, 0.4)' });
        }
    }

    function bounce(el) {
        if (!el) return;
        if (window.gsap) {
            gsap.timeline()
                .to(el, { duration: 0.12, scale: 1.15, y: -6, ease: 'power1.out' })
                .to(el, { duration: 0.18, scale: 1, y: 0, ease: 'bounce.out' });
        }
    }

    return { svg, celebrate, bounce };
})();

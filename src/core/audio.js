// Kid-Friendly Web Audio Engine & Persian Voice Narration for "پرورش هوش کودک"
// 100% Offline, Zero External Audio Files Needed
window.AudioEngine = (function() {
    let ctx = null;
    let muted = false;

    function ensureCtx() {
        if (!ctx) {
            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    ctx = new AudioContextClass();
                }
            } catch (e) {
                return null;
            }
        }
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        return ctx;
    }

    // Single tone with ADSR envelope
    function tone(freq, dur, type, vol, when, dest) {
        if (muted) return;
        const c = ensureCtx();
        if (!c) return;
        try {
            const t0 = c.currentTime + (when || 0);
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, t0);
            g.gain.setValueAtTime(0, t0);
            g.gain.linearRampToValueAtTime(vol || 0.22, t0 + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
            osc.connect(g).connect(dest || c.destination);
            osc.start(t0);
            osc.stop(t0 + dur + 0.05);
        } catch (e) {}
    }

    // Melodic chord arpeggio (C Major / G Major for happy kid melodies)
    function playMelody(notes, speed, type, vol) {
        if (muted) return;
        const sp = speed || 0.1;
        notes.forEach((f, i) => {
            tone(f, 0.25, type || 'triangle', vol || 0.2, i * sp);
        });
    }

    // White/Pink noise burst (for confetti, pops, brush)
    function noiseBurst(dur, vol, when) {
        if (muted) return;
        const c = ensureCtx();
        if (!c) return;
        try {
            const t0 = c.currentTime + (when || 0);
            const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-3 * (i / data.length));
            }
            const src = c.createBufferSource();
            src.buffer = buf;
            const g = c.createGain();
            g.gain.setValueAtTime(vol || 0.15, t0);
            g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
            src.connect(g).connect(c.destination);
            src.start(t0);
        } catch (e) {}
    }

    // Public Kid Sound FX
    const sfx = {
        click() {
            tone(520, 0.06, 'triangle', 0.18);
        },
        pop() {
            tone(820, 0.05, 'square', 0.14);
            noiseBurst(0.04, 0.08, 0);
        },
        bubble() {
            const c = ensureCtx();
            if (!c || muted) return;
            const t0 = c.currentTime;
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, t0);
            osc.frequency.exponentialRampToValueAtTime(1100, t0 + 0.1);
            g.gain.setValueAtTime(0.2, t0);
            g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.1);
            osc.connect(g).connect(c.destination);
            osc.start(t0);
            osc.stop(t0 + 0.12);
        },
        correct() {
            // Cheerful ascending arpeggio (C5 - E5 - G5 - C6)
            playMelody([523.25, 659.25, 783.99, 1046.50], 0.09, 'sine', 0.25);
        },
        wrong() {
            // Gentle descending encouraging tone (no jarring buzzer)
            tone(280, 0.25, 'sine', 0.15);
            tone(230, 0.35, 'sine', 0.12, 0.12);
        },
        star() {
            // Sparkle chime
            tone(1046.5, 0.15, 'triangle', 0.22);
            tone(1318.5, 0.25, 'triangle', 0.22, 0.08);
            tone(1567.98, 0.35, 'sine', 0.25, 0.16);
        },
        win() {
            // Victory Fanfare
            playMelody([523.25, 659.25, 783.99, 1046.50, 1318.5, 1567.98], 0.11, 'triangle', 0.26);
            noiseBurst(0.5, 0.08, 0.2);
        },
        drag() {
            tone(440, 0.04, 'sine', 0.1);
        },
        drop() {
            tone(380, 0.08, 'triangle', 0.15);
            tone(540, 0.1, 'triangle', 0.12, 0.04);
        },
        paint() {
            noiseBurst(0.03, 0.03, 0);
        }
    };

    // Voice Narration (Web Speech API with Persian voice fallback)
    function speak(text, rate) {
        if (muted || !text) return;
        try {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'fa-IR';
                u.rate = rate || 0.88;
                u.pitch = 1.15;
                const voices = window.speechSynthesis.getVoices();
                const faVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fa'));
                if (faVoice) u.voice = faVoice;
                window.speechSynthesis.speak(u);
            }
        } catch (e) {}
    }

    function stopSpeak() {
        try {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        } catch (e) {}
    }

    function play(name) {
        if (muted) return;
        ensureCtx();
        if (sfx[name]) sfx[name]();
    }

    function setMuted(m) {
        muted = !!m;
        if (muted) stopSpeak();
    }

    function isMuted() {
        return muted;
    }

    return { play, speak, stopSpeak, setMuted, isMuted, sfx, ensureCtx };
})();

// Khanak Academy - Audio Engine
// 100% offline: WebAudio synthesized SFX + system TTS for Persian narration
const AudioEngine = (function() {
    let ctx = null;
    let muted = false;

    function ensureCtx() {
        if (!ctx) {
            try {
                ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { return null; }
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // --- Synth helpers ---
    function tone(freq, dur, type, vol, when, dest) {
        const c = ensureCtx();
        if (!c) return;
        const t0 = c.currentTime + (when || 0);
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(vol || 0.2, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        osc.connect(g).connect(dest || c.destination);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
    }

    function noiseBurst(dur, vol, when) {
        const c = ensureCtx();
        if (!c) return;
        const t0 = c.currentTime + (when || 0);
        const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = c.createBufferSource();
        src.buffer = buf;
        const g = c.createGain();
        g.gain.setValueAtTime(vol || 0.15, t0);
        src.connect(g).connect(c.destination);
        src.start(t0);
    }

    // --- Public SFX ---
    const sfx = {
        click() { tone(600, 0.08, 'triangle', 0.15); },
        correct() {
            tone(523.25, 0.12, 'sine', 0.2);   // C5
            tone(659.25, 0.12, 'sine', 0.2, 0.10); // E5
            tone(783.99, 0.25, 'sine', 0.22, 0.20); // G5
        },
        wrong() { tone(220, 0.3, 'sawtooth', 0.08); tone(180, 0.35, 'sawtooth', 0.06, 0.05); },
        win() {
            [523.25, 587.33, 659.25, 783.99, 1046.5].forEach((f, i) =>
                tone(f, 0.18, 'triangle', 0.2, i * 0.12));
            noiseBurst(0.6, 0.06, 0.1);
        },
        star() { tone(987.77, 0.15, 'triangle', 0.18); tone(1318.5, 0.3, 'triangle', 0.18, 0.08); },
        pop() { tone(880, 0.05, 'square', 0.12); },
        drag() { tone(440, 0.05, 'triangle', 0.08); },
        drop() { tone(330, 0.08, 'triangle', 0.12); tone(495, 0.1, 'triangle', 0.1, 0.05); },
        tick() { tone(1000, 0.04, 'sine', 0.08); },
        sweep() { [500, 600, 700, 800].forEach((f, i) => tone(f, 0.08, 'sine', 0.1, i * 0.03)); }
    };

    // --- TTS (offline system voices) ---
    function speak(text, rate) {
        if (muted || !text) return;
        try {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'fa-IR';
            u.rate = rate || 0.9;
            u.pitch = 1.1;
            const voices = window.speechSynthesis.getVoices();
            const fa = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fa'));
            if (fa) u.voice = fa;
            window.speechSynthesis.speak(u);
        } catch (e) { /* silent */ }
    }

    function stopSpeak() {
        try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    function setMuted(m) { muted = m; if (m) stopSpeak(); }
    function isMuted() { return muted; }

    // Expose sfx names for buttons
    function play(name) {
        if (muted) return;
        if (sfx[name]) sfx[name]();
    }

    // Preload voices on some browsers
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {};
    }

    return { play, speak, stopSpeak, setMuted, isMuted, sfx };
})();

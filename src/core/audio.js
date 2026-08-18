// Kid-Friendly Web Audio Engine, Procedural Background Music & Persian Narration
// 100% Offline, Zero External Audio Files Needed
window.AudioEngine = (function() {
    let ctx = null;
    let sfxMuted = false;
    let musicMuted = false;
    let musicTimer = null;
    let musicPlaying = false;

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
        if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
            try {
                const result = ctx.resume();
                if (result && typeof result.catch === 'function') result.catch(() => {});
            } catch (e) {}
        }
        return ctx;
    }

    // --- Sound Synthesis Helpers ---
    function tone(freq, dur, type, vol, when, dest) {
        if (sfxMuted) return;
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

    function playMelody(notes, speed, type, vol) {
        if (sfxMuted) return;
        const sp = speed || 0.1;
        notes.forEach((f, i) => {
            tone(f, 0.25, type || 'triangle', vol || 0.2, i * sp);
        });
    }

    function noiseBurst(dur, vol, when) {
        if (sfxMuted) return;
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

    // --- Procedural Background Music (Happy Kid Lullaby / Marimba) ---
    const bgScale = [
        261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25, 587.33, 659.25
    ]; // C4 to E5 major pentatonic / diatonic notes
    const melodyPattern = [
        0, 2, 4, 2, 4, 6, 4, 2,
        0, 4, 6, 7, 6, 4, 2, 0,
        1, 3, 5, 3, 5, 7, 5, 3,
        4, 2, 0, 2, 4, 2, 0, -1
    ];
    let noteIdx = 0;

    function playMusicNote() {
        if (musicMuted || !musicPlaying) return;
        const c = ensureCtx();
        if (!c) return;

        const p = melodyPattern[noteIdx % melodyPattern.length];
        noteIdx++;

        if (p >= 0 && p < bgScale.length) {
            const freq = bgScale[p];
            const t0 = c.currentTime;
            const osc = c.createOscillator();
            const g = c.createGain();

            // Soft marimba / music box bell tone
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t0);
            g.gain.setValueAtTime(0, t0);
            g.gain.linearRampToValueAtTime(0.045, t0 + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);

            osc.connect(g).connect(c.destination);
            osc.start(t0);
            osc.stop(t0 + 0.5);

            // Subtle bass accompaniment on downbeats
            if (noteIdx % 4 === 1) {
                const bassOsc = c.createOscillator();
                const bassG = c.createGain();
                bassOsc.type = 'sine';
                bassOsc.frequency.setValueAtTime(freq / 2, t0);
                bassG.gain.setValueAtTime(0.03, t0);
                bassG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
                bassOsc.connect(bassG).connect(c.destination);
                bassOsc.start(t0);
                bassOsc.stop(t0 + 0.65);
            }
        }

        musicTimer = setTimeout(playMusicNote, 380);
    }

    function startMusic() {
        if (musicMuted || musicPlaying) return;
        musicPlaying = true;
        noteIdx = 0;
        playMusicNote();
    }

    function stopMusic() {
        musicPlaying = false;
        if (musicTimer) clearTimeout(musicTimer);
        musicTimer = null;
    }

    function setMusicMuted(muted) {
        musicMuted = Boolean(muted);
        if (musicMuted) stopMusic();
    }

    function toggleMusic() {
        setMusicMuted(!musicMuted);
        if (!musicMuted) startMusic();
        return !musicMuted;
    }

    function isMusicOn() {
        return !musicMuted && musicPlaying;
    }

    // --- Sound Effects Library ---
    const sfx = {
        click() {
            tone(540, 0.05, 'triangle', 0.16);
        },
        pop() {
            tone(860, 0.05, 'square', 0.15);
            noiseBurst(0.04, 0.08, 0);
        },
        bubble() {
            const c = ensureCtx();
            if (!c || sfxMuted) return;
            const t0 = c.currentTime;
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(380, t0);
            osc.frequency.exponentialRampToValueAtTime(1200, t0 + 0.1);
            g.gain.setValueAtTime(0.2, t0);
            g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.1);
            osc.connect(g).connect(c.destination);
            osc.start(t0);
            osc.stop(t0 + 0.12);
        },
        correct() {
            playMelody([523.25, 659.25, 783.99, 1046.50], 0.09, 'sine', 0.28);
        },
        wrong() {
            tone(260, 0.22, 'sine', 0.14);
            tone(220, 0.32, 'sine', 0.12, 0.1);
        },
        star() {
            tone(1046.5, 0.14, 'triangle', 0.22);
            tone(1318.5, 0.22, 'triangle', 0.22, 0.07);
            tone(1567.98, 0.32, 'sine', 0.25, 0.14);
        },
        win() {
            playMelody([523.25, 659.25, 783.99, 1046.50, 1318.5, 1567.98], 0.1, 'triangle', 0.28);
            noiseBurst(0.6, 0.09, 0.2);
        },
        applause() {
            // Simulated cheer / clapping burst
            for (let i = 0; i < 6; i++) {
                noiseBurst(0.08, 0.08, i * 0.06);
            }
            tone(659.25, 0.3, 'sine', 0.2, 0.1);
            tone(783.99, 0.4, 'sine', 0.22, 0.2);
            tone(1046.5, 0.5, 'triangle', 0.25, 0.35);
        },
        drag() {
            tone(440, 0.04, 'sine', 0.09);
        },
        drop() {
            tone(380, 0.08, 'triangle', 0.15);
            tone(540, 0.1, 'triangle', 0.12, 0.04);
        },
        bell(noteFreq) {
            // Musical bell / xylophone note
            tone(noteFreq || 523.25, 0.35, 'triangle', 0.28);
            tone((noteFreq || 523.25) * 2, 0.2, 'sine', 0.12);
        },
        chew() {
            // Cute animal munch sound
            tone(320, 0.08, 'sine', 0.15);
            tone(420, 0.08, 'sine', 0.15, 0.07);
            noiseBurst(0.06, 0.08, 0.05);
        },
        spin() {
            tone(700, 0.04, 'sine', 0.1);
        },
        paint() {
            noiseBurst(0.03, 0.03, 0);
        }
    };

    // ------------------------------------------------------------------
    // Bundled Persian narration.
    // Android WebView ships no Persian (fa-IR) speech voice, so the Web Speech
    // API was silent on every device. Real recorded clips are bundled in
    // assets/audio and played back directly; TTS stays only as a last resort
    // for locales that do happen to have a Persian voice installed.
    // ------------------------------------------------------------------
    let currentClip = null;
    let faVoiceSupported = null;

    function hasPersianVoice() {
        if (faVoiceSupported !== null) return faVoiceSupported;
        try {
            if (!('speechSynthesis' in window)) return (faVoiceSupported = false);
            const voices = window.speechSynthesis.getVoices() || [];
            if (!voices.length) return false; // not loaded yet; don't cache
            faVoiceSupported = voices.some(v => v.lang && v.lang.toLowerCase().startsWith('fa'));
            return faVoiceSupported;
        } catch (e) { return (faVoiceSupported = false); }
    }

    function stopClip() {
        if (currentClip) {
            try { currentClip.pause(); currentClip.currentTime = 0; } catch (e) {}
            currentClip = null;
        }
    }

    // Clips that actually ship in assets/audio. Asking for anything else used to
    // fire a 404 on every lesson without narration.
    const AVAILABLE_CLIPS = new Set([
        'lesson-R-L1-L01', 'lesson-R-L1-L02', 'lesson-R-L1-L03', 'lesson-R-L1-L04',
        'lesson-R-L1-L05', 'lesson-R-L1-L06', 'lesson-R-L1-L07', 'lesson-R-L1-L08',
        'letter-alef', 'letter-be', 'letter-pe', 'letter-te', 'letter-se', 'letter-jim',
        'letter-che', 'letter-he', 'letter-khe', 'letter-dal', 'letter-zal', 'letter-re',
        'letter-ze', 'letter-zhe', 'letter-sin', 'letter-shin', 'letter-sad', 'letter-zad',
        'letter-ta', 'letter-za', 'letter-eyn', 'letter-gheyn', 'letter-fe', 'letter-ghaf',
        'letter-kaf', 'letter-gaf', 'letter-lam', 'letter-mim', 'letter-nun', 'letter-vav',
        'letter-heh', 'letter-ye',
        'topic-counting', 'topic-addition', 'topic-subtraction', 'topic-shapes',
        'topic-animals', 'topic-seasons', 'topic-senses', 'topic-emotions'
    ]);

    function hasClip(name) {
        return !!name && AVAILABLE_CLIPS.has(String(name));
    }

    // Play a bundled narration clip by name (no extension), e.g. 'lesson-R-L1-L01'.
    function playClip(name, onEnd) {
        if (sfxMuted || !name || !hasClip(name)) return false;
        try {
            stopClip();
            const audio = new Audio(`assets/audio/${name}.mp3`);
            audio.preload = 'auto';
            currentClip = audio;
            audio.onended = () => { currentClip = null; if (onEnd) onEnd(); };
            audio.onerror = () => { currentClip = null; };
            const p = audio.play();
            if (p && p.catch) p.catch(() => { currentClip = null; });
            return true;
        } catch (e) { return false; }
    }

    // Voice Narration: bundled clip first, Web Speech API as fallback
    function speak(text, rate) {
        if (sfxMuted || !text) return;
        try {
            if ('speechSynthesis' in window && hasPersianVoice()) {
                window.speechSynthesis.cancel();
                const Utterance = window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);
                if (!Utterance) return;
                const u = new Utterance(text);
                u.lang = 'fa-IR';
                u.rate = rate || 0.88;
                u.pitch = 1.18;
                const voices = window.speechSynthesis.getVoices();
                const faVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fa'));
                if (faVoice) u.voice = faVoice;
                window.speechSynthesis.speak(u);
            }
        } catch (e) {}
    }

    function stopSpeak() {
        stopClip();
        try {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        } catch (e) {}
    }

    function play(name, arg) {
        if (sfxMuted) return;
        ensureCtx();
        if (sfx[name]) sfx[name](arg);
    }

    function setSfxMuted(m) {
        sfxMuted = !!m;
        if (sfxMuted) stopSpeak();
    }

    function isSfxMuted() {
        return sfxMuted;
    }

    return {
        play,
        speak,
        playClip,
        hasClip,
        hasPersianVoice,
        stopSpeak,
        startMusic,
        stopMusic,
        toggleMusic,
        isMusicOn,
        setSfxMuted,
        isSfxMuted,
        setMusicMuted,
        sfx,
        ensureCtx
    };
})();

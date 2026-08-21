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
    // ------------------------------------------------------------------
    // Background music: a small library of real children's melodies instead of
    // one hardcoded 32-note loop that repeated forever (the "یکنواخت" problem).
    // Each track has its own notes, tempo, timbre and rhythm. Tracks rotate
    // automatically when they finish, and can be switched by hand.
    // ------------------------------------------------------------------
    const N = {
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
        R: 0
    };

    // d = duration in beats. Tracks are written as [freq, beats] pairs.
    const MUSIC_TRACKS = [
        {
            id: 'twinkle', title: 'ستارهٔ کوچولو', tempo: 500, wave: 'triangle',
            notes: [[N.C4,1],[N.C4,1],[N.G4,1],[N.G4,1],[N.A4,1],[N.A4,1],[N.G4,2],
                    [N.F4,1],[N.F4,1],[N.E4,1],[N.E4,1],[N.D4,1],[N.D4,1],[N.C4,2],
                    [N.G4,1],[N.G4,1],[N.F4,1],[N.F4,1],[N.E4,1],[N.E4,1],[N.D4,2],
                    [N.G4,1],[N.G4,1],[N.F4,1],[N.F4,1],[N.E4,1],[N.E4,1],[N.D4,2],
                    [N.C4,1],[N.C4,1],[N.G4,1],[N.G4,1],[N.A4,1],[N.A4,1],[N.G4,2],
                    [N.F4,1],[N.F4,1],[N.E4,1],[N.E4,1],[N.D4,1],[N.D4,1],[N.C4,3],[N.R,1]]
        },
        {
            id: 'rainbow', title: 'رنگین‌کمان شاد', tempo: 380, wave: 'sine',
            notes: [[N.E4,1],[N.G4,1],[N.C5,2],[N.B4,1],[N.G4,1],[N.A4,2],
                    [N.F4,1],[N.A4,1],[N.D5,2],[N.C5,1],[N.A4,1],[N.G4,2],
                    [N.E4,1],[N.G4,1],[N.C5,1],[N.E5,1],[N.D5,2],[N.C5,2],
                    [N.G4,1],[N.A4,1],[N.G4,1],[N.E4,1],[N.C4,3],[N.R,1]]
        },
        {
            id: 'garden', title: 'باغ گل‌ها', tempo: 440, wave: 'triangle',
            notes: [[N.G4,1],[N.A4,1],[N.B4,1],[N.C5,1],[N.D5,2],[N.B4,2],
                    [N.C5,1],[N.B4,1],[N.A4,1],[N.G4,1],[N.A4,3],[N.R,1],
                    [N.E4,1],[N.G4,1],[N.A4,1],[N.B4,1],[N.C5,2],[N.A4,2],
                    [N.G4,1],[N.E4,1],[N.D4,1],[N.E4,1],[N.G4,3],[N.R,1]]
        },
        {
            id: 'march', title: 'رژهٔ شادی', tempo: 320, wave: 'square',
            notes: [[N.C4,1],[N.E4,1],[N.G4,1],[N.C5,1],[N.G4,1],[N.E4,1],[N.C4,2],
                    [N.D4,1],[N.F4,1],[N.A4,1],[N.D5,1],[N.A4,1],[N.F4,1],[N.D4,2],
                    [N.E4,1],[N.G4,1],[N.C5,1],[N.E5,1],[N.C5,1],[N.G4,1],[N.E4,2],
                    [N.G4,1],[N.F4,1],[N.E4,1],[N.D4,1],[N.C4,3],[N.R,1]]
        },
        {
            id: 'lullaby', title: 'لالایی آرام', tempo: 620, wave: 'sine',
            notes: [[N.C5,2],[N.A4,1],[N.G4,1],[N.E4,2],[N.G4,2],
                    [N.A4,2],[N.G4,1],[N.E4,1],[N.D4,3],[N.R,1],
                    [N.C5,2],[N.B4,1],[N.A4,1],[N.G4,2],[N.E4,2],
                    [N.D4,1],[N.E4,1],[N.G4,1],[N.E4,1],[N.C4,3],[N.R,1]]
        },
        {
            id: 'playtime', title: 'وقت بازی', tempo: 350, wave: 'triangle',
            notes: [[N.C5,1],[N.B4,1],[N.C5,1],[N.A4,1],[N.G4,2],[N.E4,1],[N.G4,1],
                    [N.A4,1],[N.G4,1],[N.A4,1],[N.C5,1],[N.B4,2],[N.G4,2],
                    [N.E5,1],[N.D5,1],[N.C5,1],[N.B4,1],[N.A4,2],[N.C5,2],
                    [N.G4,1],[N.E4,1],[N.G4,1],[N.C5,1],[N.C4,3],[N.R,1]]
        }
    ];

    let trackIdx = 0;
    let noteIdx = 0;

    function currentTrack() {
        return MUSIC_TRACKS[trackIdx % MUSIC_TRACKS.length];
    }

    function playMusicNote() {
        if (musicMuted || !musicPlaying) return;
        const c = ensureCtx();
        if (!c) return;

        const track = currentTrack();
        // Finished this track? move to the next one so the music never repeats
        // the same tune back to back.
        if (noteIdx >= track.notes.length) {
            trackIdx = (trackIdx + 1) % MUSIC_TRACKS.length;
            noteIdx = 0;
            musicTimer = setTimeout(playMusicNote, 900);   // short breath between songs
            return;
        }

        const [freq, beats] = track.notes[noteIdx];
        noteIdx++;
        const dur = (track.tempo * beats) / 1000;

        if (freq > 0) {
            const t0 = c.currentTime;
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = track.wave || 'triangle';
            osc.frequency.setValueAtTime(freq, t0);
            g.gain.setValueAtTime(0, t0);
            g.gain.linearRampToValueAtTime(0.05, t0 + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.95);
            osc.connect(g).connect(c.destination);
            osc.start(t0);
            osc.stop(t0 + dur);

            // Gentle bass root under the first beat of each bar.
            if (noteIdx % 4 === 1) {
                const b = c.createOscillator();
                const bg = c.createGain();
                b.type = 'sine';
                b.frequency.setValueAtTime(freq / 2, t0);
                bg.gain.setValueAtTime(0.028, t0);
                bg.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
                b.connect(bg).connect(c.destination);
                b.start(t0);
                b.stop(t0 + dur + 0.05);
            }
        }

        musicTimer = setTimeout(playMusicNote, track.tempo * beats);
    }

    function listTracks() {
        return MUSIC_TRACKS.map((t, i) => ({ id: t.id, title: t.title, index: i, active: i === trackIdx }));
    }

    function setTrack(index) {
        const n = Number(index);
        if (!Number.isFinite(n)) return currentTrack().title;
        trackIdx = ((n % MUSIC_TRACKS.length) + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
        noteIdx = 0;
        if (musicTimer) clearTimeout(musicTimer);
        if (musicPlaying && !musicMuted) playMusicNote();
        return currentTrack().title;
    }

    function nextTrack() {
        return setTrack(trackIdx + 1);
    }

    function currentTrackTitle() {
        return currentTrack().title;
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

    function stopClip() {
        if (currentClip) {
            try { currentClip.pause(); currentClip.currentTime = 0; } catch (e) {}
            currentClip = null;
        }
    }

    // Clips that actually ship in assets/audio/kid. Activities still ask for
    // legacy names such as 'letter-alef'; without this guard those turn into
    // a 404 on every round instead of just staying silent.
    const AVAILABLE_CLIPS = new Set([
        'auto-062d5dea8e93',
        'auto-08bc0ee5de8a',
        'auto-0c899b4086ca',
        'auto-146b31d0a8b7',
        'auto-14cbec062a10',
        'auto-2c9856c0e706',
        'auto-30d48f6e60b6',
        'auto-3ef4304b5adf',
        'auto-48aa4331f5a3',
        'auto-4f3909faac27',
        'auto-618162c2130a',
        'auto-6e4067ed4d69',
        'auto-70bc6a3264e1',
        'auto-7a3c6b4c352f',
        'auto-7d7d7502c143',
        'auto-92385c26b1e2',
        'auto-9a7de2d1a16e',
        'auto-c8486cc590b4',
        'auto-ca976e4a13db',
        'auto-d7f20808c0f3',
        'auto-dff497ae3233',
        'auto-e17c5c9d03e3',
        'auto-e4f04e5bd43b',
        'auto-e981c438f515',
        'auto-f0cc197ea7cb',
        'auto-f3a152182c34',
        'auto-f7125af3d856',
        'letter-alef',
        'letter-be',
        'letter-che',
        'letter-dal',
        'letter-eyn',
        'letter-fe',
        'letter-gaf',
        'letter-ghaf',
        'letter-gheyn',
        'letter-he',
        'letter-heh',
        'letter-jim',
        'letter-kaf',
        'letter-khe',
        'letter-lam',
        'letter-mim',
        'letter-nun',
        'letter-pe',
        'letter-re',
        'letter-sad',
        'letter-se',
        'letter-shin',
        'letter-sin',
        'letter-ta',
        'letter-te',
        'letter-vav',
        'letter-ye',
        'letter-za',
        'letter-zad',
        'letter-zal',
        'letter-ze',
        'letter-zhe'
    ]);

    function hasClip(text) {
        return !!clipFor(text);
    }

    // Does a recording with this FILE name exist and ship? (hasClip() above asks
    // the different question "is this spoken TEXT recorded?".) Used by the
    // generator to attach a lesson's own narration only when it was recorded.
    function hasClipFile(name) {
        return AVAILABLE_CLIPS.has(String(name));
    }

    // ------------------------------------------------------------------
    // RECORDED CHILD-VOICE NARRATION (no TTS).
    //
    // ***  DO NOT ADD TEXT-TO-SPEECH HERE, EVER.  ***
    // Not speechSynthesis, not a Capacitor TTS plugin, not "just as a fallback
    // when a clip is missing". The product owner has ruled this out repeatedly:
    // a synthesiser speaks with an adult voice, mispronounces Persian, and does
    // not work offline. scripts/audit_no_tts.js fails the build if any speech
    // API appears in src/, and `npm test` runs it.
    //
    // Every spoken line is a pre-generated AI voice clip in assets/audio/kid/.
    // The current rebuild uses the user-selected Persian educational voice and
    // a gentle +8% pitch lift with formants preserved. The restrained shift
    // keeps the timbre childlike without the severe consonant damage caused by
    // the former +28% transform.
    //
    // speak(text) looks the text up in window.NARRATION_MAP; if a recording
    // exists it plays, otherwise the call returns false and the line simply
    // stays unvoiced. To voice a new line, RECORD IT -- add the text to
    // assets/audio/kid/auto-manifest.json, generate the clip with the pipeline
    // above, then run `node scripts/sync_narration.js`.
    // Game sound effects are separate (oscillator tones) and always on.
    // ------------------------------------------------------------------
    var NARRATION_ENABLED = true;

    function clipFor(text) {
        try {
            const map = window.NARRATION_MAP;
            if (!map || !text) return null;
            return map[String(text).trim()] || null;
        } catch (e) { return null; }
    }

    // Play a recorded clip by file name (no extension) from assets/audio/kid/.
    function playClip(name, onEnd) {
        if (!NARRATION_ENABLED || sfxMuted || !name) return false;
        if (!AVAILABLE_CLIPS.has(String(name))) return false;
        try {
            stopClip();
            const audio = new Audio(`assets/audio/kid/${name}.mp3`);
            audio.preload = 'auto';
            currentClip = audio;
            audio.onended = () => { currentClip = null; if (onEnd) onEnd(); };
            audio.onerror = () => { currentClip = null; };
            const p = audio.play();
            if (p && p.catch) p.catch(() => { currentClip = null; });
            return true;
        } catch (e) { return false; }
    }

    // Speak a line by playing its recording. Never synthesises anything.
    function speak(text) {
        if (!NARRATION_ENABLED || sfxMuted || !text) return false;
        const clip = clipFor(text);
        if (!clip) return false;
        return playClip(clip);
    }

    function stopSpeak() {
        stopClip();
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
        listTracks,
        setTrack,
        nextTrack,
        currentTrackTitle,
        playClip,
        hasClip,
        hasClipFile,
        hasPersianVoice: () => false,
        stopSpeak,
        startMusic,
        stopMusic,
        toggleMusic,
        isMusicOn,
        setSfxMuted,
        isSfxMuted,
        setMusicMuted,
        sfx,
        ensureCtx,
        narrationEnabled: () => NARRATION_ENABLED};
})();

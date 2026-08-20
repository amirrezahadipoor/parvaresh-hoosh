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
        'auto-002edff4b5e5',
        'auto-00c7047c8d42',
        'auto-016ccf29afa9',
        'auto-01b434058026',
        'auto-01d6855dd781',
        'auto-01e23debe0f1',
        'auto-022e392ea99c',
        'auto-028797ee699c',
        'auto-029aba368d32',
        'auto-02b387179732',
        'auto-02d45b6053a3',
        'auto-03093f43887b',
        'auto-0331db013eee',
        'auto-037475c10db0',
        'auto-038d0aa0865f',
        'auto-03d6788a967f',
        'auto-0469f7544663',
        'auto-046f6f664ded',
        'auto-04ad426e83ea',
        'auto-04ae89cbc463',
        'auto-05fe693d6006',
        'auto-062d5dea8e93',
        'auto-063f2d995596',
        'auto-0667a9588e05',
        'auto-068bb0c7f313',
        'auto-06ba40949850',
        'auto-06cd43caa06e',
        'auto-0757b39b308a',
        'auto-077c0f8b58b1',
        'auto-079e0fd49984',
        'auto-07ceb948709e',
        'auto-07cf089921d2',
        'auto-07d9ed64eeda',
        'auto-081e53558d55',
        'auto-082c76020dba',
        'auto-08bc0ee5de8a',
        'auto-09020e71d43b',
        'auto-0907b68f5ee3',
        'auto-0963d9a562a2',
        'auto-098f2b47e808',
        'auto-0a2ae5e45863',
        'auto-0a7ba79bc852',
        'auto-0ac59bf754fc',
        'auto-0b18da6c6e88',
        'auto-0b4f90724ea1',
        'auto-0b6282112d78',
        'auto-0c15072d1263',
        'auto-0c73b030addd',
        'auto-0c7ef5b52fbb',
        'auto-0c899b4086ca',
        'auto-0cd9b9a14f6b',
        'auto-0d5e72f4b51e',
        'auto-0ec690c11391',
        'auto-0eebaff589ee',
        'auto-0f166f0dcdbf',
        'auto-0f39d3f6cd5d',
        'auto-0fb09d3c4429',
        'auto-0febb9d0d153',
        'auto-1059d28e146e',
        'auto-10f5699012fe',
        'auto-112ebe69bd94',
        'auto-1155e7b9b0fe',
        'auto-11cda8e254a7',
        'auto-11e1b575f69c',
        'auto-11e6797b7055',
        'auto-121acdc49afd',
        'auto-1253c8fe2de8',
        'auto-12750b6d2fef',
        'auto-1311b3be8c50',
        'auto-131c87cee73c',
        'auto-141b6ac34bb1',
        'auto-146b31d0a8b7',
        'auto-14c7211aa7df',
        'auto-14cbec062a10',
        'auto-14df9d8b2925',
        'auto-14fe7e722289',
        'auto-152565039a8f',
        'auto-153e94d71796',
        'auto-15b4805ef6cb',
        'auto-15ca56f438eb',
        'auto-1783af1d8d45',
        'auto-17878ad2e478',
        'auto-17937d89561b',
        'auto-17d1793f5f0d',
        'auto-17de3f45ed85',
        'auto-183f773bcfaf',
        'auto-1857401b87a2',
        'auto-18c9fedc80fc',
        'auto-195673a213ed',
        'auto-1a194575888f',
        'auto-1a3c04ff19d7',
        'auto-1a4065413c84',
        'auto-1a4686813f16',
        'auto-1a550449e67f',
        'auto-1aac3fd79cda',
        'auto-1b2e7d39bec6',
        'auto-1b4c9be348ae',
        'auto-1b665a024622',
        'auto-1b6c8248851d',
        'auto-1b8ed008d199',
        'auto-1c1a6627a289',
        'auto-1c242deb35cb',
        'auto-1ce900769b82',
        'auto-1d379ba59309',
        'auto-1dd95c00f4a1',
        'auto-1dec989dd5b8',
        'auto-1df40b968b5d',
        'auto-1e2536ec1090',
        'auto-1e63a929a925',
        'auto-1e6569a9e80d',
        'auto-1eb49c770161',
        'auto-1ed65c683662',
        'auto-1eff0b7fef2c',
        'auto-1f5c9a540f07',
        'auto-1fd0823d7028',
        'auto-1fd58ea0d6a5',
        'auto-2029746f7892',
        'auto-203515db2864',
        'auto-205e120b719c',
        'auto-207c84ead609',
        'auto-20cc67a71feb',
        'auto-20e9b4e549d5',
        'auto-20ec69979968',
        'auto-21029eb0346d',
        'auto-214625a24e66',
        'auto-215fa2a020c1',
        'auto-21b042c5cdce',
        'auto-21df91f7df4b',
        'auto-228742e3f863',
        'auto-22cb47a25ec4',
        'auto-233f80e5f78f',
        'auto-234933e6fc8e',
        'auto-237a11ab78ca',
        'auto-239b14739ea0',
        'auto-23cbcfd18728',
        'auto-242fdafcf230',
        'auto-2461cc4bb173',
        'auto-24920ad7ec9d',
        'auto-24e823808546',
        'auto-25033c1a871b',
        'auto-252a5ef57aa0',
        'auto-25dc55006b09',
        'auto-26d0ed91d5de',
        'auto-26e87a0d5035',
        'auto-27dc14c28b15',
        'auto-2818cd65aa78',
        'auto-28357ee63448',
        'auto-2867758b2ba4',
        'auto-2893e16c4930',
        'auto-28a2db5dde28',
        'auto-28def723a123',
        'auto-29b29ddc8606',
        'auto-29bf9f41d64f',
        'auto-29e951cc6997',
        'auto-2a5acce801b5',
        'auto-2a755af372aa',
        'auto-2a8281d03703',
        'auto-2a9e96cd80fa',
        'auto-2aa45e710347',
        'auto-2abaa2334277',
        'auto-2b14b2077ea3',
        'auto-2b1a549bcbf0',
        'auto-2bba4365fc6a',
        'auto-2bcf75acae04',
        'auto-2bda013c5608',
        'auto-2be8739a262c',
        'auto-2c4e8bad6636',
        'auto-2c9856c0e706',
        'auto-2ce5000f6f64',
        'auto-2ce50fdd65fa',
        'auto-2cf19929a947',
        'auto-2cf34fbe74ce',
        'auto-2d60f5276687',
        'auto-2ddb4ca6cf58',
        'auto-2dfbff7debc3',
        'auto-2e6ebfc0278e',
        'auto-2fea8dad45a6',
        'auto-300299aa6370',
        'auto-30d48f6e60b6',
        'auto-315c39b4e480',
        'auto-31c767656866',
        'auto-321c3535e1ea',
        'auto-32481d96a718',
        'auto-3262f5bec192',
        'auto-32bc0ec35b74',
        'auto-32ce61b6dd99',
        'auto-32fd7dc74671',
        'auto-3364f1d0c666',
        'auto-336b184837e2',
        'auto-3387c008df8a',
        'auto-33f2f1cf7659',
        'auto-343de1ce3c6e',
        'auto-3469b8af8866',
        'auto-34861348df71',
        'auto-351b7a362a8e',
        'auto-35592d725ed4',
        'auto-3655967f7dd0',
        'auto-36705c5be8d6',
        'auto-3748bc4161d7',
        'auto-3754c8152ee5',
        'auto-375691893ec7',
        'auto-3761529b720a',
        'auto-379b8d372835',
        'auto-37a8739eab74',
        'auto-37cdc360280f',
        'auto-385931f96b4e',
        'auto-387adc3e05cb',
        'auto-38d4edb183bb',
        'auto-38f0771c0638',
        'auto-3956a6c5c37f',
        'auto-39c2e366ae85',
        'auto-3a168da82ca4',
        'auto-3a4c145ae91f',
        'auto-3ae5479962d3',
        'auto-3b51864d35b7',
        'auto-3b75946bba8c',
        'auto-3bddb4696338',
        'auto-3c33fb765697',
        'auto-3c5e67c64abb',
        'auto-3c91a04f1045',
        'auto-3cbf0086b1af',
        'auto-3d0056cca3c4',
        'auto-3d2dedc237df',
        'auto-3d6700a60d47',
        'auto-3d780a4198f5',
        'auto-3da65a3758a1',
        'auto-3dc358ca6c2e',
        'auto-3de3ae00d687',
        'auto-3e178b12f06e',
        'auto-3e260e9a318c',
        'auto-3e56c637e5db',
        'auto-3ef4304b5adf',
        'auto-3fb9d6dbdfbc',
        'auto-3fce8085315c',
        'auto-3fdc06943f57',
        'auto-3ffb068b4446',
        'auto-3fff564331cb',
        'auto-4032b3ee48d2',
        'auto-40abe08007cf',
        'auto-40c5bf4a1f7b',
        'auto-4101371c6fd2',
        'auto-410f2e11f67d',
        'auto-413731d8df69',
        'auto-41a197eecb62',
        'auto-4201479258e6',
        'auto-420eccf3092b',
        'auto-422f51a5020e',
        'auto-4268eb881a27',
        'auto-428ea916689d',
        'auto-42a11497c658',
        'auto-42d6f120a06e',
        'auto-42e00e24e4b1',
        'auto-435d7fbbfea9',
        'auto-438f1acab564',
        'auto-43ae50b8dcc2',
        'auto-43ec4ce59388',
        'auto-44506cf9c4b4',
        'auto-44a7383bb2be',
        'auto-44d640095d15',
        'auto-4548b1da06dd',
        'auto-45756f6c3af8',
        'auto-45a711ff0c6b',
        'auto-45b3fc0b0e3b',
        'auto-4618050eea15',
        'auto-469d668b7819',
        'auto-46a5b7c2b0a3',
        'auto-46ee0abcd775',
        'auto-470c6ad19f2a',
        'auto-47b7b07580b5',
        'auto-47c29b3de4fb',
        'auto-47db74267d14',
        'auto-48aa4331f5a3',
        'auto-4906ac4eab4a',
        'auto-4920ac42884f',
        'auto-496b2308af20',
        'auto-4a2d34f3d495',
        'auto-4a47fa692e33',
        'auto-4a6397eb2104',
        'auto-4b6dac9bb022',
        'auto-4b7b53c66dc7',
        'auto-4b9d4e76c7e8',
        'auto-4bc667c2e07e',
        'auto-4c02696df7a9',
        'auto-4c06b9aae711',
        'auto-4c473d526190',
        'auto-4cd7de5c6a4b',
        'auto-4d1b4cb08ea9',
        'auto-4d72d686e235',
        'auto-4d8f274e4264',
        'auto-4d9b9fedbb3b',
        'auto-4db696193de3',
        'auto-4e03de273d1a',
        'auto-4e3a02091aaa',
        'auto-4ec8171b1801',
        'auto-4ee90efac15e',
        'auto-4f0ed6b6111f',
        'auto-4f229982a760',
        'auto-4f3909faac27',
        'auto-4f697eeb51fb',
        'auto-4fcf6cadac0e',
        'auto-4ff411c3ed49',
        'auto-4ff91f946570',
        'auto-50124bf54291',
        'auto-5020cdfaeec7',
        'auto-5087c610a574',
        'auto-50e3c458aeaf',
        'auto-52106b8cb0d1',
        'auto-521daaa0c9e3',
        'auto-525b6f63b378',
        'auto-5271c46fb3a3',
        'auto-52a788db959d',
        'auto-52aa748990bc',
        'auto-52c36c36f448',
        'auto-52d1ef5fafb7',
        'auto-52df04a6808e',
        'auto-530925d4f8ba',
        'auto-54006de5ee7c',
        'auto-54e23beff3f7',
        'auto-55249fe41efa',
        'auto-552eca02c81c',
        'auto-55645e808dbc',
        'auto-55b9cc44d221',
        'auto-562c747e552c',
        'auto-5669bdd33ab7',
        'auto-570759aeca37',
        'auto-5712328aff3f',
        'auto-578eba986af6',
        'auto-57adebcbd1c4',
        'auto-5808f9e81939',
        'auto-587861776971',
        'auto-5919dbe8420b',
        'auto-5999fccae79b',
        'auto-59ec31bae59f',
        'auto-5a4dab45333c',
        'auto-5adb0d73c428',
        'auto-5b04206579d7',
        'auto-5bd2fae769ca',
        'auto-5c5669f941b0',
        'auto-5cb361e4c69f',
        'auto-5d43cd620329',
        'auto-5dbace16360f',
        'auto-5ddec5177425',
        'auto-5df126fc18cf',
        'auto-5e21b51bea3d',
        'auto-5e31916c8ce7',
        'auto-5e65c6829076',
        'auto-5e97769ff7eb',
        'auto-5e99a207a529',
        'auto-5ed2b86f53d0',
        'auto-5edcbd7fd3b5',
        'auto-5f04b3bd0d91',
        'auto-5f336a837ac4',
        'auto-5f4e314d7341',
        'auto-5f694e1ccc5e',
        'auto-5f862ce1c3db',
        'auto-5fc55f5481ca',
        'auto-602597e79f9e',
        'auto-60292be35d1d',
        'auto-60a3101dc05c',
        'auto-60d87aa252a6',
        'auto-60d894dfb819',
        'auto-613f954212c8',
        'auto-61426b93ae54',
        'auto-61733d9704b3',
        'auto-618162c2130a',
        'auto-61822ea582b1',
        'auto-61bac00f2fc1',
        'auto-61c05bf78065',
        'auto-61c70e40fb07',
        'auto-6208df47d03b',
        'auto-6269d35da229',
        'auto-6277b21bab8d',
        'auto-62ea38944e83',
        'auto-632e09967596',
        'auto-63389ed30e83',
        'auto-6396b139ee8e',
        'auto-63e114a6b3f8',
        'auto-6480b6590e34',
        'auto-64ab71840568',
        'auto-657f8ca106e0',
        'auto-65f58a354557',
        'auto-66db69cc2bd2',
        'auto-66f7107cce5a',
        'auto-6732fc8d1f80',
        'auto-675f8dc91d8f',
        'auto-67a94ec0ad8c',
        'auto-67fa9bcebb15',
        'auto-681218b61b02',
        'auto-681602d36e44',
        'auto-6840fd085d4a',
        'auto-686ac1e94e8a',
        'auto-68a28122029f',
        'auto-694f80b4b76c',
        'auto-6953d63a7135',
        'auto-69cf43630228',
        'auto-6a4e6858ede2',
        'auto-6a6d2444b4f5',
        'auto-6ae228ba32d8',
        'auto-6b058bee0f1c',
        'auto-6c293f3b3721',
        'auto-6d9bb0b140b7',
        'auto-6da20e021144',
        'auto-6dcd54936834',
        'auto-6dd5a9ad64ba',
        'auto-6e4067ed4d69',
        'auto-6e53ceeeb261',
        'auto-6e88540c6973',
        'auto-6eb8a1ce3b94',
        'auto-6f2d208685d7',
        'auto-6f356df704d3',
        'auto-6fb6d14345e1',
        'auto-703aa706b9f5',
        'auto-70891722e038',
        'auto-70b94b8302c7',
        'auto-70bc6a3264e1',
        'auto-70ed235424e1',
        'auto-7169a652d79a',
        'auto-718462211f8f',
        'auto-71ee480bd89e',
        'auto-71f574a792ae',
        'auto-7211eeb63087',
        'auto-7240c9cd553b',
        'auto-730fdf1362b3',
        'auto-73e9ed974545',
        'auto-740374baacfd',
        'auto-7417c5ae199e',
        'auto-744c88e9eb4b',
        'auto-7455578baf73',
        'auto-74b8c9126413',
        'auto-750edd10e0ef',
        'auto-7521fa82497c',
        'auto-7543633906e8',
        'auto-76504fdc75c3',
        'auto-76aaec75ea81',
        'auto-76cfee38ea40',
        'auto-7702c375d3c8',
        'auto-7757fbb57b20',
        'auto-77b67499924b',
        'auto-77ff76fa143d',
        'auto-789eb14a5491',
        'auto-79329064b202',
        'auto-793318840a12',
        'auto-7967c72b0915',
        'auto-797614c26d61',
        'auto-799443f3b7ae',
        'auto-79981c428e9f',
        'auto-7a1b0b80562c',
        'auto-7a1bfa76f251',
        'auto-7a3c6b4c352f',
        'auto-7a489b5e996c',
        'auto-7a843c30cf6e',
        'auto-7b4aa6e5740a',
        'auto-7b7ec1e7fffc',
        'auto-7bdcf66be69b',
        'auto-7be9d225384b',
        'auto-7c68d7c16ee4',
        'auto-7ca059045da8',
        'auto-7caa5c30709a',
        'auto-7cb5a8377a55',
        'auto-7cf036a1c082',
        'auto-7d7d7502c143',
        'auto-7da388c964e7',
        'auto-7e05765e3df5',
        'auto-7ef0c6422d52',
        'auto-7f125a5482e6',
        'auto-7f1d092b7378',
        'auto-7f46f51b7d52',
        'auto-7ff583617876',
        'auto-801235bc83eb',
        'auto-802ebc60dfc1',
        'auto-8045aa4ba629',
        'auto-808caaeabb50',
        'auto-8094af2534eb',
        'auto-80969f679ef1',
        'auto-80b7062a3451',
        'auto-812f3b9482a0',
        'auto-81443ccd8837',
        'auto-816f714cfd54',
        'auto-81798bc46f46',
        'auto-81815e19cc7d',
        'auto-81a0c2325c2d',
        'auto-81fef9fe4872',
        'auto-827a10c9f6fc',
        'auto-827bed3db2b4',
        'auto-830f78755cb5',
        'auto-83246dcd837a',
        'auto-8324afab32fe',
        'auto-8325f34c1bb6',
        'auto-834069f6fbc2',
        'auto-8352cc9e92d2',
        'auto-83d72da1736e',
        'auto-83db4583681b',
        'auto-84792e982ebd',
        'auto-84ed52dfd5eb',
        'auto-84f9038b0bbc',
        'auto-851533ea6989',
        'auto-854ab7935ba2',
        'auto-856ee2b009e6',
        'auto-85a2c1514a22',
        'auto-85a2c58c439d',
        'auto-861a66b4b338',
        'auto-8683221703a7',
        'auto-86ce48e10e17',
        'auto-86f4d562db25',
        'auto-86f835ab290d',
        'auto-872dba5ea61c',
        'auto-874128d60661',
        'auto-87df1487c66c',
        'auto-883fc158c009',
        'auto-886673566dc6',
        'auto-8875ce6a3ba8',
        'auto-887b00a715b6',
        'auto-89a2e32b08a9',
        'auto-8a21d773c8ef',
        'auto-8a57b859d30d',
        'auto-8a6f373a619f',
        'auto-8a786af145c8',
        'auto-8aa1e3cd4aec',
        'auto-8ada8c7592d6',
        'auto-8af1993f5391',
        'auto-8b96392cd607',
        'auto-8bb0fefc1b4e',
        'auto-8bb83d597c13',
        'auto-8c3fc4c8fa33',
        'auto-8c80c92e6957',
        'auto-8d2d295ebd7c',
        'auto-8d7700c1c56b',
        'auto-8d9e4964e60a',
        'auto-8dcf0843a33c',
        'auto-8e1f62a1b2a7',
        'auto-8e3c66c29b78',
        'auto-8e45476f6d4b',
        'auto-8e46d2ad4384',
        'auto-8ef64649ea6e',
        'auto-8f2e2e552db6',
        'auto-8f4f71b13de1',
        'auto-8ff8d9ecf7ed',
        'auto-9068944de271',
        'auto-910dc8d66241',
        'auto-91176e8667f5',
        'auto-9127545f73f1',
        'auto-9197838186ed',
        'auto-920b91f5dc33',
        'auto-9214d77da884',
        'auto-92385c26b1e2',
        'auto-9267a72dda8d',
        'auto-92a587aec459',
        'auto-93015ff2b429',
        'auto-93096d9bb85d',
        'auto-934b418f8029',
        'auto-93861c309eb1',
        'auto-93e316a60659',
        'auto-944eff205f89',
        'auto-948c4c4174b7',
        'auto-94da305fe37f',
        'auto-956b1dcddee6',
        'auto-956b7e01c49c',
        'auto-95bb3cfedbcf',
        'auto-95bdfa5ada69',
        'auto-9641a76c71d6',
        'auto-964d9b3dc629',
        'auto-9667e750caa9',
        'auto-9671f89af6e7',
        'auto-974308b22485',
        'auto-97468bb3dbf2',
        'auto-9783a9dc6481',
        'auto-978bd88a1839',
        'auto-97b876fcb424',
        'auto-97dd7f140596',
        'auto-98c8a99afe4c',
        'auto-98f652555ab3',
        'auto-9945073a3fef',
        'auto-9958985ab446',
        'auto-995b5324eb85',
        'auto-99add638e0d9',
        'auto-99c3fd1dcdd2',
        'auto-9a7de2d1a16e',
        'auto-9aa3fe07ff21',
        'auto-9aaeb07594ba',
        'auto-9b114ff9463a',
        'auto-9b4fd97bb2f7',
        'auto-9bcffc76ee78',
        'auto-9bd10cbb8486',
        'auto-9bddfa2fc7c1',
        'auto-9bf17561d30e',
        'auto-9cf234ca6ffa',
        'auto-9d15c6748955',
        'auto-9d4d86238ddc',
        'auto-9d6f47351971',
        'auto-9d9f82dca87a',
        'auto-9da04739e5fe',
        'auto-9dd44448c7f9',
        'auto-9df39c359c7f',
        'auto-9e6f7e19605e',
        'auto-9f041bc13ffc',
        'auto-9fabb10cb4cc',
        'auto-9ffca96fda1f',
        'auto-a015a5784a34',
        'auto-a01c83c3f3bb',
        'auto-a07920d1e29f',
        'auto-a0b8337d3944',
        'auto-a0c49ae42c65',
        'auto-a111e01d0a8a',
        'auto-a11cf05a4267',
        'auto-a14152775588',
        'auto-a1866a42b972',
        'auto-a1bb109e7a5e',
        'auto-a1f18b122992',
        'auto-a26d1c579173',
        'auto-a27f81ba272e',
        'auto-a2d2495b8d6a',
        'auto-a2fba183bd7a',
        'auto-a31815dff27b',
        'auto-a3eb8740f3fc',
        'auto-a457375265d2',
        'auto-a4667c415bd9',
        'auto-a4ea8b3ac1dd',
        'auto-a4eb394c4245',
        'auto-a520c935bb36',
        'auto-a54a1abf6527',
        'auto-a588d8e9301b',
        'auto-a5adf34a0fa1',
        'auto-a637867e2094',
        'auto-a65210259c31',
        'auto-a72aff6ce774',
        'auto-a7325cd532fb',
        'auto-a76f66221f6e',
        'auto-a78ced171a26',
        'auto-a78f9dbf5a55',
        'auto-a79cc05672e3',
        'auto-a88178ccb4b5',
        'auto-a8f9e7bee404',
        'auto-a92204110221',
        'auto-a954c94dbc7a',
        'auto-a989a1eaf429',
        'auto-a9c8a01ae3a6',
        'auto-a9d2e04b7098',
        'auto-a9e36a40b99f',
        'auto-a9efa410b881',
        'auto-a9f123e052cd',
        'auto-a9ffb943653d',
        'auto-aa5c12e096c7',
        'auto-aa6e143ec40d',
        'auto-aacd46254f7e',
        'auto-aae063fa5aa2',
        'auto-aafdcd160535',
        'auto-ab465ee5b806',
        'auto-abc3a0847410',
        'auto-abcfed0983b1',
        'auto-ac1a46fc9557',
        'auto-ac62308790dd',
        'auto-acd1b71dfb98',
        'auto-ade12480f062',
        'auto-ae5512e73aa9',
        'auto-aeb95b5a2c9d',
        'auto-aee01230ebf2',
        'auto-aee5f96089a7',
        'auto-aeee14acdebc',
        'auto-af2336849725',
        'auto-af4e5cc4b4bd',
        'auto-af618511743b',
        'auto-afa7324c61eb',
        'auto-aff7932f878b',
        'auto-aff8c297904a',
        'auto-b09553fd4036',
        'auto-b1444a3fe0d8',
        'auto-b148c1e81e44',
        'auto-b159189f499a',
        'auto-b1ed48d7f3f8',
        'auto-b1fad9807bbb',
        'auto-b1fd125ccf42',
        'auto-b288ba5d8a5f',
        'auto-b2f2834375c9',
        'auto-b2f3c8612f15',
        'auto-b3ce6231a677',
        'auto-b3f079732ebc',
        'auto-b3fcf6da0821',
        'auto-b436e3f9937f',
        'auto-b4740beed987',
        'auto-b4a98982c36d',
        'auto-b4c43c0a153a',
        'auto-b4e5693a97e5',
        'auto-b524a9c395e9',
        'auto-b57afd1b2e67',
        'auto-b5aa06b0c0eb',
        'auto-b5d3deda3a1f',
        'auto-b649d598a5fe',
        'auto-b68881ba4485',
        'auto-b70f2286b982',
        'auto-b728f3372ffd',
        'auto-b741822699dc',
        'auto-b74907288a02',
        'auto-b76a035c049a',
        'auto-b7e42d9c851e',
        'auto-b8768ce43206',
        'auto-b893c18403dd',
        'auto-b896b87ae8d1',
        'auto-b8d6ab027def',
        'auto-b915b7be7881',
        'auto-b93e3b4473bc',
        'auto-b957995953cc',
        'auto-b95d6e321dd5',
        'auto-b96f0c2e6380',
        'auto-b96f56a2f567',
        'auto-b998949fa06f',
        'auto-ba04f8b06d9c',
        'auto-ba6db7dd0a80',
        'auto-bac855844655',
        'auto-bad35c30b48b',
        'auto-bafc4a604807',
        'auto-bb25eb394183',
        'auto-bb36dd597fd5',
        'auto-bb82222e68af',
        'auto-bbaac7c65c52',
        'auto-bd088b4a6c12',
        'auto-bd08da0ffd3f',
        'auto-bd6f8cb0ca02',
        'auto-bdd944a9689d',
        'auto-bdefbb38159d',
        'auto-be2e08ff61c5',
        'auto-bed8ee401a4e',
        'auto-bf257be4122f',
        'auto-c05d7b3b7ff2',
        'auto-c09f40603d39',
        'auto-c0f4460c4b71',
        'auto-c105c61a633d',
        'auto-c122921d2e91',
        'auto-c18b55177fcf',
        'auto-c1c970f3026b',
        'auto-c24a4cbb78fd',
        'auto-c2602f24d42c',
        'auto-c281e90464df',
        'auto-c2ac32c37b03',
        'auto-c2d382777de4',
        'auto-c2f2e61795ba',
        'auto-c3249eca5406',
        'auto-c3a80fbfb17e',
        'auto-c3c8f555633e',
        'auto-c413f818bb73',
        'auto-c4583cb0eec1',
        'auto-c47e11db4d2d',
        'auto-c5011cbb2d64',
        'auto-c596eca7b1f8',
        'auto-c5bfe551a384',
        'auto-c5c839ca902f',
        'auto-c5dc9da15468',
        'auto-c60acb8ba277',
        'auto-c64acfb1143d',
        'auto-c68fd6d79341',
        'auto-c6d53c14e0df',
        'auto-c72d0d7372a3',
        'auto-c74864fd7551',
        'auto-c805165e56af',
        'auto-c8486cc590b4',
        'auto-c880c3ce1d89',
        'auto-c892ca962b37',
        'auto-c92a0a27455e',
        'auto-c9753597856e',
        'auto-c9943891bc32',
        'auto-c9f5d89ce399',
        'auto-ca08746922c6',
        'auto-ca1aecff8dea',
        'auto-ca976e4a13db',
        'auto-cab8a665e039',
        'auto-cada4a3f44c1',
        'auto-cae79d9b1c29',
        'auto-caf214110ee2',
        'auto-cb0a50af7aa3',
        'auto-cc33fce0484b',
        'auto-cc8a23e84291',
        'auto-ccadf8a58032',
        'auto-ccd8c085dd4a',
        'auto-cd3da55fd65a',
        'auto-cda84920a116',
        'auto-ce387881a30c',
        'auto-ce578b14ea85',
        'auto-cf14ba96cc87',
        'auto-cf6a4f32f3f6',
        'auto-cf869ae6fdb1',
        'auto-cf8c8b55074a',
        'auto-d01065a43ee2',
        'auto-d02bbd49d7c9',
        'auto-d037e7ee66c3',
        'auto-d04901acf8a4',
        'auto-d064f516eba6',
        'auto-d13512353558',
        'auto-d1bfa726ff96',
        'auto-d24c97b8fdbf',
        'auto-d2a9befa3b26',
        'auto-d2c9872fca52',
        'auto-d4704e93373f',
        'auto-d49c2775da4a',
        'auto-d4be401bba92',
        'auto-d50dc86c7d28',
        'auto-d53fed73a522',
        'auto-d5aac9d8aef4',
        'auto-d64be06e1d5d',
        'auto-d6580d173058',
        'auto-d65e89d9a45a',
        'auto-d68072ea3f23',
        'auto-d6d580de55a3',
        'auto-d720be350b53',
        'auto-d7aca0ef663b',
        'auto-d7c24e6b0110',
        'auto-d7f20808c0f3',
        'auto-d80dc0378121',
        'auto-d850ba5eb871',
        'auto-d861f3efcae7',
        'auto-d86cfc90176c',
        'auto-d8e806a87256',
        'auto-d91f0f041b7a',
        'auto-d9292d939163',
        'auto-d934ceb90ebe',
        'auto-d9695600e6b6',
        'auto-da3f4caabfd1',
        'auto-da5d9e484596',
        'auto-daad45f3a56a',
        'auto-daadd13ffb5b',
        'auto-dac1c93582e2',
        'auto-dacaaa15fe32',
        'auto-daee4781fdde',
        'auto-daefb05d406a',
        'auto-db2909eb8dfb',
        'auto-db2e82e4aa59',
        'auto-db3cd2a1e1c5',
        'auto-dc00ce8e55b9',
        'auto-dcd82dbf3b07',
        'auto-dd0efaae76e5',
        'auto-dd704681ad5d',
        'auto-ddd245038c86',
        'auto-dddaa23f4b16',
        'auto-de27372397c4',
        'auto-de339f6a1804',
        'auto-de395c1840e6',
        'auto-dea1a8eb6c1c',
        'auto-deada81e7277',
        'auto-dec84c8992cc',
        'auto-df166c307981',
        'auto-df8bfd76895f',
        'auto-dfbc48436fff',
        'auto-dff497ae3233',
        'auto-e0085c9d0bff',
        'auto-e02b9de08b84',
        'auto-e046e58252e2',
        'auto-e056c6c6bdff',
        'auto-e079a460f966',
        'auto-e0bc342f4445',
        'auto-e0ddaa38a66e',
        'auto-e11ffbd06a18',
        'auto-e12c7aa9849d',
        'auto-e152eaf8a7da',
        'auto-e15ef131130a',
        'auto-e17c5c9d03e3',
        'auto-e1c7e34f817f',
        'auto-e1eab6ec9bef',
        'auto-e25e920a5c29',
        'auto-e296518f65bc',
        'auto-e29a3ba04849',
        'auto-e2d6c265cb9c',
        'auto-e359c73dee04',
        'auto-e37ae9121022',
        'auto-e3cc5f88686c',
        'auto-e40625392585',
        'auto-e440793b5845',
        'auto-e4d083bf2059',
        'auto-e4e18fb2448a',
        'auto-e4f04e5bd43b',
        'auto-e53525d53f0d',
        'auto-e572b6a29894',
        'auto-e58dd268eb24',
        'auto-e60201cc64dd',
        'auto-e624e5268365',
        'auto-e642d08119be',
        'auto-e67daaa9fc99',
        'auto-e6af287013e3',
        'auto-e6f860f65ff6',
        'auto-e7bce4680b00',
        'auto-e7f69e873606',
        'auto-e8164c2d61db',
        'auto-e86ade55993d',
        'auto-e8bc34495ec3',
        'auto-e8cbf0ca9116',
        'auto-e8d11b180c90',
        'auto-e8d169b6775d',
        'auto-e963a22054c0',
        'auto-e981c438f515',
        'auto-e99efdc7925a',
        'auto-e9bba871eea8',
        'auto-e9d48dd7faa9',
        'auto-ea274a659732',
        'auto-ea95c5fd3aaf',
        'auto-eaa6fc11f041',
        'auto-ead6e91b5d8a',
        'auto-eae2ed9fc341',
        'auto-eb38e95738d6',
        'auto-eca095e995c6',
        'auto-ece774c53851',
        'auto-ed06d9920508',
        'auto-ee26e7d024c0',
        'auto-ee4f814cb48f',
        'auto-f0019dae32ff',
        'auto-f084b372286e',
        'auto-f09350503f54',
        'auto-f0a2620fa343',
        'auto-f0cc197ea7cb',
        'auto-f10e2b03fe35',
        'auto-f1ffd0a2059f',
        'auto-f21ad4ace74b',
        'auto-f2ef97743dd4',
        'auto-f31dafd0d4dd',
        'auto-f354973099b0',
        'auto-f362af3a2fa4',
        'auto-f36fd3af97f6',
        'auto-f37a98ea8458',
        'auto-f3a152182c34',
        'auto-f3b5aa563d27',
        'auto-f3f92ef3c8c3',
        'auto-f4151053b487',
        'auto-f42d27452c24',
        'auto-f47237339187',
        'auto-f4de215984f1',
        'auto-f4de76302202',
        'auto-f50702064bb8',
        'auto-f5174da42ec5',
        'auto-f583237f6626',
        'auto-f5d47a89965d',
        'auto-f7125af3d856',
        'auto-f71643b7ac24',
        'auto-f71db896328a',
        'auto-f783c4e75eef',
        'auto-f7ac84664ca2',
        'auto-f7bc36de3995',
        'auto-f7ffa090e0af',
        'auto-f8379c77d5cf',
        'auto-f8381c5f4d47',
        'auto-f89e01f4478a',
        'auto-f8fc6c443094',
        'auto-f91b75451880',
        'auto-f92a68a13387',
        'auto-f931584abac9',
        'auto-f99781c42bae',
        'auto-f99c5c30f608',
        'auto-f9b270e101d4',
        'auto-f9d90f411a6b',
        'auto-fa1bf38e0c5e',
        'auto-fa32c1093f9f',
        'auto-fa40b17f968f',
        'auto-fa8ce4900f4a',
        'auto-fac603b6a830',
        'auto-fb1f53baab52',
        'auto-fb29f7f5e5cf',
        'auto-fb47e3220c29',
        'auto-fb9f0dc537a4',
        'auto-fba4b8d2e177',
        'auto-fbd22e8bf957',
        'auto-fbd4bf936fde',
        'auto-fbdd481118d0',
        'auto-fc296c62bdc2',
        'auto-fc34adf41e00',
        'auto-fc3809ccacc3',
        'auto-fcba0ad83815',
        'auto-fce32cf87e86',
        'auto-fcfd4245f450',
        'auto-fd0795eae8da',
        'auto-fd32a0c74028',
        'auto-fd3f532a2615',
        'auto-fdd47c2671f1',
        'auto-fe03e44bc99d',
        'auto-fe598e43cb90',
        'auto-fe72466e7f70',
        'auto-fe8c1d860203',
        'auto-fecb6f2ccb80',
        'auto-ff2aaeda2908',
        'auto-ff3af1957510',
        'auto-ff4cad8ee698',
        'auto-ff7574718de9',
        'gifted-balance',
        'gifted-classify',
        'gifted-compare',
        'gifted-g-l1-l01',
        'gifted-g-l1-l02',
        'gifted-g-l1-l03',
        'gifted-g-l1-l04',
        'gifted-g-l1-l05',
        'gifted-g-l10-l01',
        'gifted-g-l10-l02',
        'gifted-g-l10-l03',
        'gifted-g-l10-l04',
        'gifted-g-l10-l05',
        'gifted-g-l2-l01',
        'gifted-g-l2-l02',
        'gifted-g-l2-l03',
        'gifted-g-l2-l04',
        'gifted-g-l2-l05',
        'gifted-g-l3-l01',
        'gifted-g-l3-l02',
        'gifted-g-l3-l03',
        'gifted-g-l3-l04',
        'gifted-g-l3-l05',
        'gifted-g-l4-l01',
        'gifted-g-l4-l02',
        'gifted-g-l4-l03',
        'gifted-g-l4-l04',
        'gifted-g-l4-l05',
        'gifted-g-l5-l01',
        'gifted-g-l5-l02',
        'gifted-g-l5-l03',
        'gifted-g-l5-l04',
        'gifted-g-l5-l05',
        'gifted-g-l6-l01',
        'gifted-g-l6-l02',
        'gifted-g-l6-l03',
        'gifted-g-l6-l04',
        'gifted-g-l6-l05',
        'gifted-g-l7-l01',
        'gifted-g-l7-l02',
        'gifted-g-l7-l03',
        'gifted-g-l7-l04',
        'gifted-g-l7-l05',
        'gifted-g-l8-l01',
        'gifted-g-l8-l02',
        'gifted-g-l8-l03',
        'gifted-g-l8-l04',
        'gifted-g-l8-l05',
        'gifted-g-l9-l01',
        'gifted-g-l9-l02',
        'gifted-g-l9-l03',
        'gifted-g-l9-l04',
        'gifted-g-l9-l05',
        'gifted-memory',
        'gifted-number',
        'gifted-odd',
        'gifted-order',
        'gifted-pattern',
        'gifted-raven',
        'gifted-reason',
        'gifted-riddle',
        'gifted-shadow',
        'gifted-welcome',
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
        'letter-zhe',
        'topic-addition',
        'topic-animals',
        'topic-art',
        'topic-classify',
        'topic-counting',
        'topic-create',
        'topic-emotions',
        'topic-energy',
        'topic-experiment',
        'topic-logic',
        'topic-matching',
        'topic-measure',
        'topic-memory',
        'topic-music',
        'topic-reading',
        'topic-recycle',
        'topic-seasons',
        'topic-senses',
        'topic-sentence',
        'topic-sequence',
        'topic-shapes',
        'topic-subtraction',
        'topic-time',
        'topic-words'
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
    // Every spoken line is a pre-recorded clip in assets/audio/kid/. Each clip
    // was generated with an AI voice model (edge-tts fa-IR-DilaraNeural at -10%
    // rate) and then pitch-shifted +28% with formant shifting via
    // scripts/kidify.sh, which is what gives the approved child timbre.
    // Measured: raw adult voice ~178 Hz, after kidify ~232-250 Hz.
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

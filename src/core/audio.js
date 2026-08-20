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
        'auto-00b8ae8695eb',
        'auto-00f78f44513f',
        'auto-011859774cc9',
        'auto-012a9f35ee7f',
        'auto-028d63fc6c94',
        'auto-045f71835dfb',
        'auto-068b9bf97f9d',
        'auto-068e05d910a0',
        'auto-068f4ae648dd',
        'auto-06ab91264447',
        'auto-07175e79c6a3',
        'auto-072bd68ea403',
        'auto-085cb72bb513',
        'auto-086a2c056167',
        'auto-0884bc90f939',
        'auto-08e98b058275',
        'auto-093dffae894b',
        'auto-09666e071126',
        'auto-09fe73c9e35b',
        'auto-0a9c3eef5256',
        'auto-0af999531ae0',
        'auto-0b285dd9715e',
        'auto-0b53e0ea2de3',
        'auto-0be5cda5a55b',
        'auto-0bf2e403105d',
        'auto-0c19c3bb27f8',
        'auto-0c3f6cf02127',
        'auto-0cceda1b02af',
        'auto-0cd00d04761a',
        'auto-0d6024d77764',
        'auto-0d8ed99897e6',
        'auto-0de1a1c91a35',
        'auto-0e0dfa85c94d',
        'auto-0e31e559e90f',
        'auto-0e6711cd5867',
        'auto-0e6cc49b58be',
        'auto-0eae8c25f71c',
        'auto-0efccce5d600',
        'auto-0f57e8226d4e',
        'auto-0f78519c3594',
        'auto-0f78eb37c74d',
        'auto-0fcca1986742',
        'auto-12a431a78b20',
        'auto-12f1d8c49e98',
        'auto-134873896e5e',
        'auto-13ac1135f8e7',
        'auto-1416e3736b87',
        'auto-14bef067bcd5',
        'auto-14e59aa45390',
        'auto-1515aeeaeec0',
        'auto-163cc48621b9',
        'auto-16f4d7f89e4a',
        'auto-1793c0eec2fa',
        'auto-17dc3bf0b729',
        'auto-1806cdb94f01',
        'auto-182100ec7cf0',
        'auto-1849485a7058',
        'auto-187fe7821162',
        'auto-19d5556af968',
        'auto-1a1227e74e89',
        'auto-1b6a9859397e',
        'auto-1b9df5e95547',
        'auto-1bcf5c4ea32b',
        'auto-1c6ca0fde586',
        'auto-1d515fe48516',
        'auto-1ddd821a1e89',
        'auto-1e3ba7678c04',
        'auto-1e6bef39af94',
        'auto-1eaf1a3981c7',
        'auto-1f4f18783caa',
        'auto-1f87e4a1aaf9',
        'auto-2031c329547f',
        'auto-2033f2b0d139',
        'auto-21142d132674',
        'auto-2152e07eb28a',
        'auto-2172efd3c7e0',
        'auto-21abed529d3b',
        'auto-223d65a1dd5d',
        'auto-225bb97e6017',
        'auto-229b757ab6c5',
        'auto-22cf51294166',
        'auto-238773381143',
        'auto-23d7db795e15',
        'auto-24ba8c5fbe2e',
        'auto-24fd63a43f0c',
        'auto-25066ce33683',
        'auto-25822462d119',
        'auto-25ee8a37759c',
        'auto-26a5d395a31f',
        'auto-2701d4cb5d8a',
        'auto-27257abe176a',
        'auto-27ac5e5b8321',
        'auto-28d6253b58a6',
        'auto-290f102635ac',
        'auto-296401b2612e',
        'auto-297f10a4ccc2',
        'auto-2aa8733bccfe',
        'auto-2acf0eb11805',
        'auto-2b438bef55b3',
        'auto-2b86a6bea537',
        'auto-2ba628c809a8',
        'auto-2bd0aff91437',
        'auto-2ce65b7a7a9b',
        'auto-2e585204b9f3',
        'auto-2faefe9e1b9f',
        'auto-3040a34b9ad8',
        'auto-30969d05c11f',
        'auto-309d8031a774',
        'auto-30dad329efa7',
        'auto-31226af05caa',
        'auto-313f8e7401c8',
        'auto-31a6fc6850c0',
        'auto-31ae93b9eec8',
        'auto-32fdedeeca9f',
        'auto-333b3b614a57',
        'auto-333c51121e92',
        'auto-337d92b00aca',
        'auto-3467451a2ecc',
        'auto-3512456359e7',
        'auto-35801342ba60',
        'auto-3599be724a0e',
        'auto-3762b1ea3264',
        'auto-37fa5c30bdce',
        'auto-384af8674ba5',
        'auto-3920f884232c',
        'auto-394060178dfa',
        'auto-399753b48fb0',
        'auto-3a346ed458dd',
        'auto-3ac9e18b4f78',
        'auto-3af59cdd00ad',
        'auto-3ba6bbfef6da',
        'auto-3d1cba86e8d5',
        'auto-3e129b8665a7',
        'auto-3e45b73ccc22',
        'auto-3f1d0f15a844',
        'auto-3f994ed6483a',
        'auto-403717d0a154',
        'auto-4053fa85206f',
        'auto-40c4a72b8b77',
        'auto-410e10d7f63a',
        'auto-4111a294f78b',
        'auto-41822a1bfaa0',
        'auto-41f4b5f83ab4',
        'auto-425d5cdfbd56',
        'auto-42b96e6e4141',
        'auto-42faa8de4cf7',
        'auto-431f04ad4e31',
        'auto-436cf5e77996',
        'auto-43cf20d21b5c',
        'auto-43fd9dc4b110',
        'auto-442d5770b89a',
        'auto-4459d1663e92',
        'auto-44acccc2ddf0',
        'auto-44e68618eb78',
        'auto-4504e27c5980',
        'auto-45129a5882c5',
        'auto-453d18939907',
        'auto-45993ed1da94',
        'auto-45ff44bb8c48',
        'auto-461b62668176',
        'auto-46844e74466f',
        'auto-46dba63ecb05',
        'auto-47059e51816b',
        'auto-470a46b7b962',
        'auto-474a423841f3',
        'auto-475ff45d3379',
        'auto-47dc2ed361fe',
        'auto-47ef447d3557',
        'auto-47f0ebb80758',
        'auto-47f1b9ee3378',
        'auto-483e8146d198',
        'auto-486a7a1a97bd',
        'auto-489bb2356ff8',
        'auto-48fbd1d68e16',
        'auto-49a64a5ee437',
        'auto-49fad7b8451e',
        'auto-4a9976eb593b',
        'auto-4ad74673f40f',
        'auto-4b70763753ef',
        'auto-4cc8258cf971',
        'auto-4cdb38287534',
        'auto-4d18b2d09f4f',
        'auto-4d32a4a2625c',
        'auto-4e0db369fab4',
        'auto-4e80367e9944',
        'auto-4fa6032ffd92',
        'auto-503541bb0822',
        'auto-50bf9cada4d2',
        'auto-5112d6028fba',
        'auto-5135834c7609',
        'auto-51675cc177e9',
        'auto-51a2e40dc965',
        'auto-51aba1956db8',
        'auto-51d299757f38',
        'auto-51d471edfdfe',
        'auto-53a8ae01fb2e',
        'auto-54c33b5fac6d',
        'auto-55a363120e88',
        'auto-55c073dc2371',
        'auto-5623ba6ef67b',
        'auto-56812e488118',
        'auto-569ae5039498',
        'auto-5755e481b2fe',
        'auto-5b3f1b8684fd',
        'auto-5bd33ae3ef76',
        'auto-5cf7a35cce74',
        'auto-5df2cc867576',
        'auto-5dfbf28fdf27',
        'auto-5ecb9e07a184',
        'auto-5fd37407d500',
        'auto-5fda5438fc90',
        'auto-6057336d93dc',
        'auto-609fc936d769',
        'auto-61248b7d1b66',
        'auto-618947757ccc',
        'auto-619ab7b74ced',
        'auto-6201bd370025',
        'auto-621512f9ca38',
        'auto-62fee88e1b10',
        'auto-632dc6465b6e',
        'auto-6436981fb2db',
        'auto-647c3053f953',
        'auto-65050ea4fa80',
        'auto-653240e4ae40',
        'auto-65515ebad841',
        'auto-65b977e8d5d4',
        'auto-6672cfd10c59',
        'auto-6676a2febec8',
        'auto-66b97e63b6e6',
        'auto-66ddff58ffbe',
        'auto-672001504001',
        'auto-6722be0e1aa9',
        'auto-674def74e89f',
        'auto-6841e026bfff',
        'auto-68a09739ca1d',
        'auto-69ab597a45ff',
        'auto-69ef74bc305f',
        'auto-6a5be8a2e19b',
        'auto-6a80b3f45ba2',
        'auto-6abc12946500',
        'auto-6b03bf188690',
        'auto-6b08e2075e2f',
        'auto-6b6d2d66d674',
        'auto-6bfa3b70a110',
        'auto-6c8cc7bfe102',
        'auto-6cce4cd5f3d3',
        'auto-6cf9a0c2a21f',
        'auto-6d3354fc7071',
        'auto-6d69298ed22b',
        'auto-6d7650fd6c24',
        'auto-6eaf2440e5b3',
        'auto-6f84905a5193',
        'auto-705832bb27c7',
        'auto-70942213d2af',
        'auto-726257d17d10',
        'auto-73729ed083c0',
        'auto-739d299ae1a1',
        'auto-740fc27ff489',
        'auto-748d20a68e94',
        'auto-74a9be89b012',
        'auto-753f590bfd93',
        'auto-75c85ab75676',
        'auto-75e2ab610b1c',
        'auto-76b4ed6027a7',
        'auto-76c34a43b06e',
        'auto-76d97b19102e',
        'auto-76ff7b43d6bf',
        'auto-77bf4576a110',
        'auto-78c5c674d839',
        'auto-78f646c5f3ff',
        'auto-799e45d588cf',
        'auto-79a00d7f1bcd',
        'auto-7a2b55a627ac',
        'auto-7b67daffd07e',
        'auto-7d151fd9deb7',
        'auto-7e071de17092',
        'auto-7e87e8504042',
        'auto-7ecb48fc4da4',
        'auto-7f5fa7045f94',
        'auto-7fa613b84813',
        'auto-80c00d4543df',
        'auto-80d20d64bbc9',
        'auto-8159d5de29e3',
        'auto-8219b9e19d45',
        'auto-8253250dc593',
        'auto-8268c3f13bf9',
        'auto-865c43234a98',
        'auto-86b7a2abcb1b',
        'auto-88333ac09046',
        'auto-8845b698b3d8',
        'auto-8906fba94968',
        'auto-896254c563df',
        'auto-8a278ecd67da',
        'auto-8a704359177d',
        'auto-8a902fc05946',
        'auto-8b455c59a94f',
        'auto-8b4856b85e20',
        'auto-8b5af10ce9b2',
        'auto-8be0fed33440',
        'auto-8c3640abf9a3',
        'auto-8cf95173afca',
        'auto-8d060298e09f',
        'auto-8dda49ce650f',
        'auto-8debc09d3e21',
        'auto-8f7c88bd8725',
        'auto-8f957d40e820',
        'auto-902e218a7bc8',
        'auto-9047ccdb4e69',
        'auto-90e393713e5f',
        'auto-919a5b565cdf',
        'auto-928e4e12c999',
        'auto-949f1f49ed53',
        'auto-95e9452125ba',
        'auto-960419b121c2',
        'auto-96b0d087394b',
        'auto-96b68ac87159',
        'auto-9756c2ab54cd',
        'auto-97bd8a218740',
        'auto-9943d7154a21',
        'auto-9b3385fd24fb',
        'auto-9b4d8def541f',
        'auto-9b7efdf88f60',
        'auto-9c8bafd1ad22',
        'auto-9d015055659e',
        'auto-9d2a89a23870',
        'auto-9e6f60a83017',
        'auto-9f534fd0e86d',
        'auto-9f633a0b81f2',
        'auto-a0b0012c3e0f',
        'auto-a0ee7b2a7a1b',
        'auto-a17cdb7e997b',
        'auto-a207bcdd7800',
        'auto-a22a3a4b437c',
        'auto-a28b1b2835ea',
        'auto-a2a37a461518',
        'auto-a2bf1fb7e9dd',
        'auto-a2df29448c6d',
        'auto-a382f538f349',
        'auto-a38c129d18c9',
        'auto-a42c9a995f2e',
        'auto-a45c9a943250',
        'auto-a47451aac0d2',
        'auto-a5e800b7b7ea',
        'auto-a6472efb40ea',
        'auto-a65ba804bdd4',
        'auto-a6dee86a0665',
        'auto-a755d1587cdb',
        'auto-a7bb31c50410',
        'auto-a7c1f93d10ce',
        'auto-a83902e8f766',
        'auto-a93fa0e7aaeb',
        'auto-a9fa8bd9ecb4',
        'auto-ab7e4ee3f17a',
        'auto-ac8426b5ddd2',
        'auto-acdf46ff25b5',
        'auto-ad129f0dd58f',
        'auto-adba68775f36',
        'auto-af1286a61ac0',
        'auto-b0a0c6e7aa8f',
        'auto-b100f1e0eb84',
        'auto-b12a015862f9',
        'auto-b14ab50a7a76',
        'auto-b1572868f797',
        'auto-b198ea33868f',
        'auto-b26d47e2d726',
        'auto-b26f9d960a3a',
        'auto-b2940a21306a',
        'auto-b375637529be',
        'auto-b3a9b57e60d4',
        'auto-b562574a6ff1',
        'auto-b68c16931c49',
        'auto-b6d158b7c02a',
        'auto-b743df7e1288',
        'auto-b88531c279de',
        'auto-b8faaf9f06b2',
        'auto-b90476c72783',
        'auto-b9460eff570e',
        'auto-ba22ded02443',
        'auto-ba369dbdaba5',
        'auto-ba99038a074a',
        'auto-bae7239ed6db',
        'auto-bb8006088ac2',
        'auto-bba470f727f7',
        'auto-bbdccf0e036e',
        'auto-bc35361b5b5c',
        'auto-bc4c168f8ae2',
        'auto-bc7d62a008d0',
        'auto-bd384e4eff8a',
        'auto-bda1b95ac495',
        'auto-bddb4b379551',
        'auto-bde19d6c55ac',
        'auto-bde1f0fdfd9c',
        'auto-bf2586cd4219',
        'auto-c037cb126008',
        'auto-c1bd6ae40b6d',
        'auto-c1f8ee60fd90',
        'auto-c3e08b4ca3ca',
        'auto-c4beec63c54b',
        'auto-c6d10bf858b0',
        'auto-c70710924c07',
        'auto-c73bff3a7520',
        'auto-c74b85782c72',
        'auto-c76bf610f1a3',
        'auto-c817c54bfbfb',
        'auto-c822b9764497',
        'auto-c8bf068215d3',
        'auto-c93ea19417fc',
        'auto-c9539c1d1436',
        'auto-c9ac264b0b68',
        'auto-c9e401485556',
        'auto-ca218f048cfb',
        'auto-caf51aa0eb8c',
        'auto-cb305fc3a146',
        'auto-cbe912f42cbf',
        'auto-cc2b2eb313c3',
        'auto-cc68614b1837',
        'auto-cd733dace61a',
        'auto-cf9d2c8c9e2f',
        'auto-d03966871715',
        'auto-d05dffcd8ee0',
        'auto-d0734c1e1f68',
        'auto-d19946752753',
        'auto-d377e265cb64',
        'auto-d479d45bbadd',
        'auto-d4cd0806644d',
        'auto-d5411c56c472',
        'auto-d54b83ac9db2',
        'auto-d54f00073b0f',
        'auto-d70299fd61c7',
        'auto-d77fa2dd9f0f',
        'auto-d7c05483b857',
        'auto-d8656923b10f',
        'auto-d9b64704bf8a',
        'auto-d9e14183d4bb',
        'auto-da4c79b170f4',
        'auto-dc065f8efaa2',
        'auto-ddb13c7cf26a',
        'auto-de03de35583f',
        'auto-ded7784d5f13',
        'auto-df0ecd98bef0',
        'auto-df16b4275e97',
        'auto-df53a83c221a',
        'auto-dfe53cd69588',
        'auto-e0a17b4494c4',
        'auto-e0a302b116d3',
        'auto-e0f166aa7a38',
        'auto-e1404530b7f0',
        'auto-e153252d0238',
        'auto-e1a1cfe96ee6',
        'auto-e1b7a847e60c',
        'auto-e1dc2af89987',
        'auto-e25f281c49cb',
        'auto-e4923523f480',
        'auto-e4a47ea07396',
        'auto-e4b6a5da69bc',
        'auto-e550f97cb1da',
        'auto-e5702f8ae8f1',
        'auto-e5b43f1c5dcf',
        'auto-e5b99c9c4758',
        'auto-e5d22319a34e',
        'auto-e5d48f5e96a0',
        'auto-e649ec184783',
        'auto-e67a64d58858',
        'auto-e785427a9207',
        'auto-e8fe4b4ef717',
        'auto-e9232b297239',
        'auto-e93b8d376c1d',
        'auto-e97460277e7f',
        'auto-e9b7c11af4a0',
        'auto-ea6f852a6af6',
        'auto-eb0b985c2bde',
        'auto-eb35680886a1',
        'auto-eb6038acdc72',
        'auto-ebde36d71c22',
        'auto-ec1d81c8638e',
        'auto-ecfd623974ac',
        'auto-ecfdd25b73c3',
        'auto-ed4bc90749fb',
        'auto-ed7a84c776ae',
        'auto-ee539ac21f65',
        'auto-ee8a30510a15',
        'auto-eea2ab4878f7',
        'auto-f0b3356f620e',
        'auto-f15bcf4f4fd8',
        'auto-f18e6dea8e14',
        'auto-f1a65b77961e',
        'auto-f1b2ce350179',
        'auto-f3574c9c3653',
        'auto-f392e6a97953',
        'auto-f39cb88347f7',
        'auto-f3b07afa5a41',
        'auto-f5a839a40cd2',
        'auto-f5b01c349d10',
        'auto-f669c2c5795a',
        'auto-f6814b75038e',
        'auto-f695dcb5888d',
        'auto-f6aff068c198',
        'auto-f8f37ce3fe51',
        'auto-f91e3e51ed46',
        'auto-f92b1f94aaad',
        'auto-f958df288e77',
        'auto-fa3fde4ae52e',
        'auto-fad312ae58dc',
        'auto-fafa0c3d5e1f',
        'auto-fbe3caa00051',
        'auto-fd1c673545e6',
        'auto-fd3020081107',
        'auto-fd57590a7faf',
        'auto-fd84ea6b0e26',
        'auto-fd9ce5440f70',
        'auto-fe7e8914680f',
        'auto-febcdf9a303b',
        'auto-ffc4669febb6',
        'auto-ffd6e06bdf55',
        'fixed-balloons',
        'gifted-balance',
        'gifted-classify',
        'gifted-compare',
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
        'praise-great',
        'praise-lesson-done',
        'praise-retry',
        'praise-set',
        't1-01-memory',
        't1-02-order-size',
        't1-03-good-behavior',
        't1-04-story-order',
        't1-05-painting',
        't1-06-sort-behavior',
        't1-07-next-color',
        't1-08-next-shape',
        't1-09-complete-pattern',
        't1-10-order-words',
        't1-11-match-material',
        't1-12-shadow',
        't2-13-balance',
        't2-14-build-sentence',
        't2-15-smaller-number',
        't2-16-bigger-number',
        't2-17-odd-one-out',
        't2-18-color-purple',
        't2-19-opposites',
        't2-20-color-green',
        't2-21-color-red',
        't2-22-color-yellow',
        't2-23-put-in-place',
        't2-24-month-season',
        't2-25-emotion-situation',
        't2-26-color-blue',
        't2-27-plant-growth',
        't3-30-syllables',
        't3-31-friend-sad',
        't3-32-new-friend',
        't3-33-sort-animals-fruit',
        't3-34-remember-bells',
        't3-35-order-colors',
        't3-36-remember-tray',
        't3-37-black-white-mix',
        't3-38-how-many-shapes',
        't3-39-fill-blank',
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

    // ------------------------------------------------------------------
    // RECORDED CHILD-VOICE NARRATION (no TTS).
    // There is no text-to-speech left in the app. Instead, a set of clips was
    // pre-generated with an AI voice model and pitch-shifted +28% with formant
    // shifting, giving the approved child timbre. speak(text) looks the text up
    // in window.NARRATION_MAP; if a recording exists it plays, otherwise the
    // call is silently ignored -- lines without a clip simply stay unvoiced
    // instead of falling back to a robotic synthesiser.
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

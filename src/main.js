// Main Application Controller & Hub for "پرورش هوش کودک" (Zero-Scroll Fullscreen Mobile UX)
(function() {
    'use strict';

    const state = {
        curriculum: null,
        domainId: null,
        levelId: null,
        lessonId: null,
        lessonsDone: {},
        totalStars: 0,
        sfxMuted: false,
        musicMuted: false,
        activeWorldIdx: 0
    };

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    function toFa(num) {
        const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/[0-9]/g, (w) => faDigits[+w]);
    }

    function pickMsg(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // World Carousel Definitions
    const WORLDS = [
        { id: 'reading', title: 'جزیره الفبا و کلمات', subtitle: 'شناخت حروف، صداکشی و جمله‌سازی', color: '#FF5252', mascot: 'dana', icon: 'الف' },
        { id: 'math', title: 'برکه ریاضی و هوش عددی', subtitle: 'شمارش، جمع، تفریق و اشکال هندسی', color: '#00D2D3', mascot: 'toto', icon: '۱۲۳' },
        { id: 'logic', title: 'قلعه منطق و پازل', subtitle: 'ماتریس‌های ریون، سایه‌شناسی و حافظه', color: '#6C5CE7', mascot: 'shiri', icon: 'منطق' },
        { id: 'science', title: 'جنگل شگفت‌انگیز علوم', subtitle: 'حیوانات، حواس پنج‌گانه و فصل‌ها', color: '#FFA502', mascot: 'fandogh', icon: 'علوم' },
        { id: 'art', title: 'کارگاه نقاشی و هنر', subtitle: 'رنگ‌آمیزی شاد و خلاقیت کودکانه', color: '#FD79A8', mascot: 'barfi', icon: 'هنر' },
        { id: 'arcade', title: 'شهربازی بازی‌های بی‌پایان', subtitle: 'شکار بادکنک، بلز موسیقی و غذا به حیوانات', color: '#00B894', mascot: 'dana', icon: 'بازی' }
    ];

    // ===== INIT =====
    async function init() {
        await Storage.init();

        // 1. Load Curriculum
        try {
            const res = await fetch('content/curriculum.json');
            state.curriculum = await res.json();
        } catch (e) {
            console.warn('Curriculum fetch fallback:', e);
            state.curriculum = { domains: App.domains };
        }

        // 2. Load Progress & Mascot
        const savedProgress = await Storage.load('progress');
        if (savedProgress) {
            state.lessonsDone = savedProgress.lessonsDone || {};
            state.totalStars = savedProgress.totalStars || 0;
        }

        const savedMascot = await Storage.load('selected_mascot');
        if (savedMascot) {
            Mascot.setCharacter(savedMascot);
        }

        // 3. Load Settings
        const savedSettings = await Storage.load('settings');
        if (savedSettings) {
            state.sfxMuted = !!savedSettings.sfxMuted;
            state.musicMuted = !!savedSettings.musicMuted;
            AudioEngine.setSfxMuted(state.sfxMuted);
        }

        updateAudioButtons();
        updateHeaderStars();

        // 4. Bind Global Header Controls
        bindHeader();

        // 5. Start Background Music on first user interaction
        const startAudioOnFirstClick = () => {
            AudioEngine.ensureCtx();
            if (!state.musicMuted) AudioEngine.startMusic();
            document.removeEventListener('pointerdown', startAudioOnFirstClick);
        };
        document.addEventListener('pointerdown', startAudioOnFirstClick);

        // 6. Initialize Living World Stardust Particles
        if (window.LivingWorld) LivingWorld.init();

        // 7. Hide Splash and Launch Home
        setTimeout(() => {
            Nav.reset('home');
            renderHome();
        }, 1800);
    }

    function bindHeader() {
        $('#btn-parent').addEventListener('click', () => {
            AudioEngine.play('click');
            Nav.push('parents');
            renderParents();
        });

        $('#btn-stars').addEventListener('click', () => {
            AudioEngine.play('click');
            Nav.push('rewards');
            renderRewards();
        });

        $('#btn-music').addEventListener('click', async () => {
            const isOn = AudioEngine.toggleMusic();
            state.musicMuted = !isOn;
            await Storage.save('settings', { sfxMuted: state.sfxMuted, musicMuted: state.musicMuted });
            updateAudioButtons();
            AudioEngine.play('click');
        });

        $('#btn-voice').addEventListener('click', async () => {
            state.sfxMuted = !state.sfxMuted;
            AudioEngine.setSfxMuted(state.sfxMuted);
            await Storage.save('settings', { sfxMuted: state.sfxMuted, musicMuted: state.musicMuted });
            updateAudioButtons();
            AudioEngine.play('click');
        });
    }

    function updateAudioButtons() {
        const musicBtn = $('#btn-music');
        const voiceBtn = $('#btn-voice');
        if (musicBtn) musicBtn.style.opacity = state.musicMuted ? '0.4' : '1';
        if (voiceBtn) voiceBtn.style.opacity = state.sfxMuted ? '0.4' : '1';
    }

    function updateHeaderStars() {
        const starEl = $('#header-star-count');
        if (starEl) {
            starEl.textContent = toFa(state.totalStars || 0);
        }
    }

    // ===== HOME SCREEN RENDERING (CAROUSEL WORLD) =====
    function renderHome() {
        updateHeaderStars();
        updateAudioButtons();

        const container = $('#home-content');
        container.innerHTML = '';

        const homeStage = document.createElement('div');
        homeStage.className = 'home-living-stage';

        // 1. Companion Mascot Mini Speech Strip
        const mascotObj = Mascot.getCharacter();
        const speechStrip = document.createElement('div');
        speechStrip.className = 'mascot-speech-strip';

        const miniMascot = document.createElement('div');
        miniMascot.className = 'mascot-avatar-mini';
        miniMascot.innerHTML = Mascot.svg(48, 'happy', mascotObj.id);

        const speechBubble = document.createElement('div');
        speechBubble.className = 'speech-text-bubble';
        speechBubble.textContent = pickMsg(MESSAGES.greeting);

        speechStrip.onclick = () => {
            AudioEngine.play('bubble');
            Mascot.bounce(miniMascot);
            AudioEngine.speak(speechBubble.textContent);
        };

        speechStrip.appendChild(miniMascot);
        speechStrip.appendChild(speechBubble);
        homeStage.appendChild(speechStrip);

        // 2. World Carousel Stage
        const carouselWrap = document.createElement('div');
        carouselWrap.className = 'world-carousel-wrap';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-nav-btn';
        prevBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-nav-btn';
        nextBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;

        const activeWorldCard = document.createElement('div');
        activeWorldCard.className = 'world-card-active';

        function updateWorldCard() {
            const world = WORLDS[state.activeWorldIdx];
            activeWorldCard.style.setProperty('--wcolor', world.color);

            activeWorldCard.innerHTML = `
                <span class="world-card-badge">${toFa(state.activeWorldIdx + 1)} از ۶</span>
                <div class="world-card-visual">
                    ${Mascot.svg(120, 'happy', world.mascot)}
                </div>
                <div style="text-align:center;">
                    <div class="world-card-title">${world.title}</div>
                    <div class="world-card-subtitle">${world.subtitle}</div>
                </div>
                <button class="world-play-action-btn">ورود به این دنیای شاد</button>
            `;

            activeWorldCard.onclick = () => {
                AudioEngine.play('click');
                if (world.id === 'arcade') {
                    $('#arcade-title').textContent = 'شهربازی هوش';
                    Nav.push('arcade');
                    renderArcadeGrid();
                } else {
                    state.domainId = world.id;
                    Nav.push('domain');
                    renderDomain();
                }
            };
        }

        prevBtn.onclick = (e) => {
            e.stopPropagation();
            AudioEngine.play('click');
            state.activeWorldIdx = (state.activeWorldIdx - 1 + WORLDS.length) % WORLDS.length;
            updateWorldCard();
        };

        nextBtn.onclick = (e) => {
            e.stopPropagation();
            AudioEngine.play('click');
            state.activeWorldIdx = (state.activeWorldIdx + 1) % WORLDS.length;
            updateWorldCard();
        };

        updateWorldCard();

        carouselWrap.appendChild(prevBtn);
        carouselWrap.appendChild(activeWorldCard);
        carouselWrap.appendChild(nextBtn);
        homeStage.appendChild(carouselWrap);

        // 3. Quick Play Adventure Journey Button
        const nextNode = AdventureJourney.getNextNode(state.lessonsDone);
        const advBtn = document.createElement('button');
        advBtn.className = 'btn-primary-action';
        advBtn.style.cssText = 'flex-shrink:0; margin-top:4px; font-size:16px;';
        advBtn.textContent = `ادامه ماجراجویی (${nextNode.title})`;
        advBtn.onclick = () => {
            AudioEngine.play('win');
            startAdventureLesson(nextNode);
        };
        homeStage.appendChild(advBtn);

        container.appendChild(homeStage);
    }

    function startAdventureLesson(node) {
        state.domainId = node.domain;
        state.lessonId = node.lessonId;
        const lessonDef = findLesson(node.lessonId) || { id: node.lessonId, title: node.title };
        Nav.push('lesson');
        startLesson(lessonDef);
    }

    function findLesson(lessonId) {
        if (!state.curriculum) return null;
        for (const dom of state.curriculum.domains || []) {
            for (const lv of dom.levels || []) {
                for (const l of lv.lessons || []) {
                    if (l.id === lessonId) return l;
                }
            }
        }
        return null;
    }

    // ===== DOMAIN LEVELS SCREEN =====
    function renderDomain() {
        const d = App.domains.find(x => x.id === state.domainId) || { color: '#6C5CE7', title: 'حوزه' };
        const dom = (state.curriculum.domains || []).find(x => x.id === state.domainId);
        $('#domain-title').textContent = dom ? dom.title : d.title;

        const content = $('#domain-content');
        content.innerHTML = '';

        const levels = levelsOfDomain(state.domainId);
        const allLessons = lessonsOfDomain(state.domainId);
        const doneLessons = allLessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;

        $('#domain-progress-text').textContent = `${toFa(doneLessons)} از ${toFa(allLessons.length)} درس`;

        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:10px;';

        levels.forEach((lv, idx) => {
            const lessons = lv.lessons || [];
            const doneInLevel = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const isCompleted = lessons.length > 0 && doneInLevel === lessons.length;

            const card = document.createElement('button');
            card.className = `level-card ${isCompleted ? 'done' : ''}`;
            card.style.setProperty('--dcolor', d.color);

            card.innerHTML = `
                <div class="level-num" style="background:${isCompleted ? 'var(--ok)' : d.color}">${toFa(idx + 1)}</div>
                <div class="level-info">
                    <div class="level-name">${lv.title}</div>
                    <div class="level-label">${lv.label || `سطح ${toFa(idx + 1)}`}</div>
                </div>
                <div class="level-progress">${toFa(doneInLevel)} / ${toFa(lessons.length)}</div>
            `;

            card.addEventListener('click', () => {
                AudioEngine.play('click');
                state.levelId = lv.id;
                Nav.push('level');
                renderLevel();
            });

            scrollContainer.appendChild(card);
        });

        content.appendChild(scrollContainer);

        $('#btn-back-domain').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
            renderHome();
        };
    }

    // ===== LEVEL LESSONS SCREEN =====
    function renderLevel() {
        const dom = (state.curriculum.domains || []).find(x => x.id === state.domainId);
        const level = (dom.levels || []).find(l => l.id === state.levelId);
        $('#level-title').textContent = level ? level.title : 'درس‌ها';

        const content = $('#level-content');
        content.innerHTML = '';

        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:10px;';

        (level.lessons || []).forEach((lesson, i) => {
            const prog = state.lessonsDone[lesson.id];
            const isDone = prog && prog.done;

            const card = document.createElement('button');
            card.className = `lesson-card ${isDone ? 'done' : ''}`;

            card.innerHTML = `
                <div class="lstate">${isDone ? 'تکمیل' : toFa(i + 1)}</div>
                <div class="ltitle">${lesson.title}</div>
            `;

            card.addEventListener('click', () => {
                AudioEngine.play('click');
                state.lessonId = lesson.id;
                Nav.push('lesson');
                startLesson(lesson);
            });

            scrollContainer.appendChild(card);
        });

        content.appendChild(scrollContainer);

        $('#btn-back-level').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
        };
    }

    // ===== LESSON RUNNER (FULLSCREEN ZERO-SCROLL) =====
    function startLesson(lesson) {
        const rounds = Generator.generate(lesson.id);
        const body = $('#lesson-body');
        const fill = $('#lesson-progress-fill');
        const ptext = $('#lesson-progress-text');
        const starsEl = $('#lesson-star-num');

        let roundIdx = 0;
        let starCount = 0;

        $('#btn-exit-lesson').onclick = () => {
            AudioEngine.stopSpeak();
            Nav.back();
        };

        function updateProgress() {
            const pct = Math.round((100 * roundIdx) / rounds.length);
            if (fill) fill.style.width = pct + '%';
            if (ptext) ptext.textContent = `${toFa(roundIdx + 1)} از ${toFa(rounds.length)}`;
            if (starsEl) starsEl.textContent = toFa(starCount);
        }

        function showMascotMood(mood, msg) {
            const m = document.createElement('div');
            m.style.cssText = 'position:fixed; bottom:70px; left:50%; transform:translateX(-50%); background:#FFF; border-radius:18px; padding:6px 14px; border:2px solid #EFE6DC; box-shadow:0 6px 16px rgba(0,0,0,0.15); display:flex; align-items:center; gap:8px; z-index:9999; animation:popInBounce 0.3s;';
            m.innerHTML = `
                <div style="width:36px; height:36px;">${Mascot.svg(36, mood)}</div>
                <span style="font-size:13px; font-weight:800; color:var(--ink);">${msg}</span>
            `;
            document.body.appendChild(m);
            setTimeout(() => m.remove(), 1400);
        }

        function nextRound() {
            if (roundIdx >= rounds.length) {
                finishLesson();
                return;
            }

            updateProgress();
            const round = rounds[roundIdx];
            const renderer = rendererFor(round.type);

            if (!renderer) {
                roundIdx++;
                nextRound();
                return;
            }

            body.innerHTML = '';
            if (window.LivingWorld) LivingWorld.resetHintTimer('.game-tap-choice-btn, .shadow-opt-btn, .raven-opt-btn, .simon-bell, .disp-opt-btn');
            renderer.render(body, round, {
                onCorrect: () => {
                    starCount = Math.min(3, starCount + 1);
                    updateProgress();
                    AudioEngine.play('star');
                    showMascotMood('celebrating', pickMsg(MESSAGES.correct));
                    Adaptive.record(state.domainId || 'reading', true);
                    IQAssessment.recordTrial(state.domainId || round.type, true);
                    roundIdx++;
                    setTimeout(() => nextRound(), 800);
                },
                onWrong: () => {
                    AudioEngine.play('wrong');
                    showMascotMood('thinking', pickMsg(MESSAGES.wrong));
                    Adaptive.record(state.domainId || 'reading', false);
                    IQAssessment.recordTrial(state.domainId || round.type, false);
                }
            });
        }

        function finishLesson() {
            const stars = Math.max(1, starCount);
            const prev = state.lessonsDone[lesson.id] || { stars: 0, done: false };
            const newStars = Math.max(prev.stars || 0, stars);

            state.lessonsDone[lesson.id] = {
                stars: newStars,
                done: true,
                domain: state.domainId || 'reading',
                lastPlayed: Date.now()
            };

            state.totalStars = (state.totalStars || 0) + (newStars - (prev.stars || 0));
            Storage.save('progress', {
                lessonsDone: state.lessonsDone,
                totalStars: state.totalStars
            });
            updateHeaderStars();

            // Result Celebration Overlay
            const overlay = document.createElement('div');
            overlay.className = 'result-fullscreen-overlay';

            overlay.innerHTML = `
                <div class="result-celebrate-card">
                    <div style="margin: 0 auto 6px;">${Mascot.svg(84, 'celebrating')}</div>
                    <h2 style="font-size:22px; font-weight:900; margin-bottom:2px;">آفرین قهرمان باهوش من!</h2>
                    <p style="font-size:14px; font-weight:700; color:var(--ink2); margin-bottom:12px;">${pickMsg(MESSAGES.win)}</p>
                    <button class="btn-primary-action" id="btn-continue-result">
                        ادامه ماجراجویی
                    </button>
                    <button class="btn-secondary-action" id="btn-home-result">
                        بازگشت به صفحه اصلی
                    </button>
                </div>
            `;

            document.body.appendChild(overlay);
            if (window.Fx) {
                Fx.confetti();
                Fx.stars(overlay, 6);
            }
            AudioEngine.play('win');
            AudioEngine.play('applause');

            overlay.querySelector('#btn-continue-result').addEventListener('click', () => {
                overlay.remove();
                AudioEngine.play('click');
                Nav.back();
                renderHome();
            });

            overlay.querySelector('#btn-home-result').addEventListener('click', () => {
                overlay.remove();
                AudioEngine.play('click');
                Nav.reset('home');
                renderHome();
            });
        }

        nextRound();
    }

    function rendererFor(type) {
        switch (type) {
            case 'quiz': return QuizActivity;
            case 'memory': return MemoryActivity;
            case 'drag-match': return DragDropActivity;
            case 'tracing': return TracingActivity;
            case 'order-steps':
            case 'order-size': return OrderingActivity;
            case 'painting': return PaintingActivity;
            case 'balloon-pop': return BalloonPopActivity;
            case 'raven-matrix': return IQEngines.RavenMatrixActivity;
            case 'shadow-match': return IQEngines.ShadowMatchActivity;
            case 'simon-memory': return IQEngines.SimonSequenceActivity;
            case 'disappeared-item': return IQEngines.DisappearedItemActivity;
            case 'balance-scale': return IQEngines.BalanceScaleActivity;
            default: return QuizActivity;
        }
    }

    // Tab Arcade
    function renderArcadeGrid() {
        const content = $('#arcade-container');
        content.innerHTML = '';

        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;';

        const games = ArcadeGames.list();
        games.forEach(g => {
            const card = document.createElement('button');
            card.className = 'arcade-game-card';
            card.style.setProperty('--gcolor', g.color);
            card.innerHTML = `
                <div class="arcade-game-icon" style="background:${g.color}">${g.iconHtml}</div>
                <div class="arcade-game-title">${g.title}</div>
                <div class="arcade-game-desc">${g.subtitle}</div>
            `;

            card.addEventListener('click', () => {
                AudioEngine.play('click');
                $('#arcade-title').textContent = g.title;
                ArcadeGames.openGame(g.id, content, () => {
                    renderArcadeGrid();
                });
            });

            scrollContainer.appendChild(card);
        });

        content.appendChild(scrollContainer);

        $('#btn-back-arcade').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
            renderHome();
        };
    }

    function lessonsOfDomain(domainId) {
        const dom = (state.curriculum.domains || []).find(d => d.id === domainId);
        if (!dom) return [];
        const out = [];
        (dom.levels || []).forEach(lv => {
            (lv.lessons || []).forEach(l => {
                out.push({ ...l, levelTitle: lv.title, levelId: lv.id, difficulty: lv.difficulty });
            });
        });
        return out;
    }

    function levelsOfDomain(domainId) {
        const dom = (state.curriculum.domains || []).find(d => d.id === domainId);
        return dom ? (dom.levels || []) : [];
    }

    // ===== REWARDS & MASCOT CUSTOMIZER =====
    function renderRewards() {
        const content = $('#rewards-content');
        content.innerHTML = '';

        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:12px;';

        // 1. Stats Hero
        const hero = document.createElement('div');
        hero.className = 'stats-hero';
        hero.innerHTML = `
            <div class="big">${toFa(state.totalStars || 0)}</div>
            <div class="small">ستاره‌های طلایی جمع‌شده</div>
        `;
        scrollContainer.appendChild(hero);

        // 2. Choose Companion Mascot
        const pickerSection = document.createElement('div');
        pickerSection.className = 'companion-picker-section';
        pickerSection.innerHTML = `<div class="companion-picker-title">همبازی و کاراکتر موردعلاقه‌ات را انتخاب کن:</div>`;

        const grid = document.createElement('div');
        grid.className = 'companion-grid';

        const mascots = Mascot.listCharacters();
        const currentMascot = Mascot.getCharacter();

        mascots.forEach(m => {
            const card = document.createElement('div');
            card.className = `companion-card ${m.id === currentMascot.id ? 'selected' : ''}`;
            card.innerHTML = `
                ${Mascot.svg(52, 'happy', m.id)}
                <span class="companion-name">${m.name}</span>
            `;

            card.onclick = () => {
                AudioEngine.play('bubble');
                Mascot.setCharacter(m.id);
                renderRewards();
                renderHome();
            };

            grid.appendChild(card);
        });

        pickerSection.appendChild(grid);
        scrollContainer.appendChild(pickerSection);

        // 3. Badges List
        const list = document.createElement('div');
        list.className = 'achievement-list';

        const achievements = [
            { id: 'first', name: 'اولین ستاره درخشان', cond: state.totalStars >= 1 },
            { id: 'ten', name: '۱۰ ستاره طلایی', cond: state.totalStars >= 10 },
            { id: 'fifty', name: '۵۰ ستاره قهرمانی', cond: state.totalStars >= 50 },
            { id: 'hundred', name: '۱۰۰ ستاره جادویی', cond: state.totalStars >= 100 },
            { id: 'reader', name: 'استاد الفبا و کلمات', cond: (state.totalStars >= 15) },
            { id: 'mathematician', name: 'نابغه ریاضی و هوش', cond: (state.totalStars >= 20) }
        ];

        achievements.forEach(a => {
            const el = document.createElement('div');
            el.className = `achievement ${a.cond ? '' : 'locked'}`;
            el.innerHTML = `
                <div class="a-name">${a.name}</div>
                <span style="font-size:12px; color:${a.cond ? 'var(--ok)' : 'var(--ink-light)'}; font-weight:800; margin-top:4px; display:block;">
                    ${a.cond ? 'کسب شده' : 'قفل'}
                </span>
            `;
            list.appendChild(el);
        });

        scrollContainer.appendChild(list);
        content.appendChild(scrollContainer);

        $('#btn-back-rewards').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
            renderHome();
        };
    }

    // ===== PARENT DASHBOARD =====
    const PARENT_PIN_KEY = 'parvaresh_parent_pin';

    async function renderParents() {
        const content = $('#parents-content');
        content.innerHTML = '';
        $('#btn-back-parents').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
        };

        const storedPin = await Storage.load(PARENT_PIN_KEY);
        if (!storedPin) {
            renderMathGate(content);
        } else {
            renderPinEntry(content, storedPin);
        }
    }

    function renderMathGate(content) {
        const a = Math.floor(Math.random() * 5) + 3;
        const b = Math.floor(Math.random() * 5) + 2;
        const correctSum = a + b;

        content.innerHTML = `
            <div class="pin-wrap">
                <h3 style="font-size:18px; font-weight:900; margin-bottom:6px;">قفل محافظتی ورود والدین</h3>
                <p style="color:var(--ink2); font-size:13px; margin-bottom:12px;">پاسخ معادله زیر را برای ورود انتخاب کنید:</p>
                <div style="font-size:22px; font-weight:900; color:#6C5CE7; margin-bottom:14px;">
                    ${toFa(a)} + ${toFa(b)} = ؟
                </div>
                <div class="pin-pad" id="gate-pad"></div>
            </div>
        `;

        const pad = content.querySelector('#gate-pad');
        const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        keys.forEach(k => {
            const btn = document.createElement('button');
            btn.className = 'pin-key';
            btn.textContent = toFa(k);
            btn.addEventListener('click', () => {
                if (k === correctSum) {
                    AudioEngine.play('correct');
                    renderDashboard(content);
                } else {
                    AudioEngine.play('wrong');
                    if (window.Fx) Fx.shake(content.querySelector('.pin-wrap'));
                }
            });
            pad.appendChild(btn);
        });
    }

    function renderPinEntry(content, correctPin) {
        content.innerHTML = `
            <div class="pin-wrap">
                <h3 style="font-size:18px; font-weight:900; margin-bottom:6px;">رمز ورود والدین</h3>
                <p style="color:var(--ink2); font-size:13px; margin-bottom:12px;">رمز ۴ رقمی را وارد کنید:</p>
                <div class="pin-dots" id="pin-dots"></div>
                <div class="pin-pad" id="pin-pad"></div>
            </div>
        `;

        let buffer = '';
        const dotsEl = content.querySelector('#pin-dots');
        const pad = content.querySelector('#pin-pad');

        function updateDots() {
            dotsEl.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const d = document.createElement('div');
                d.className = `pin-dot ${i < buffer.length ? 'filled' : ''}`;
                dotsEl.appendChild(d);
            }
        }

        const rows = [[1,2,3],[4,5,6],[7,8,9],['del',0,'ok']];
        rows.forEach(row => {
            row.forEach(k => {
                const b = document.createElement('button');
                b.className = 'pin-key';
                if (k === 'del') {
                    b.textContent = '⌫';
                    b.addEventListener('click', () => {
                        buffer = buffer.slice(0, -1);
                        updateDots();
                        AudioEngine.play('click');
                    });
                } else if (k === 'ok') {
                    b.textContent = 'تایید';
                    b.addEventListener('click', () => {
                        if (buffer === String(correctPin)) {
                            AudioEngine.play('correct');
                            renderDashboard(content);
                        } else {
                            AudioEngine.play('wrong');
                            buffer = '';
                            updateDots();
                            if (window.Fx) Fx.shake(content.querySelector('.pin-wrap'));
                        }
                    });
                } else {
                    b.textContent = toFa(k);
                    b.addEventListener('click', () => {
                        if (buffer.length < 4) {
                            buffer += k;
                            AudioEngine.play('pop');
                            updateDots();
                            if (buffer.length === 4 && buffer === String(correctPin)) {
                                setTimeout(() => {
                                    AudioEngine.play('correct');
                                    renderDashboard(content);
                                }, 200);
                            }
                        }
                    });
                }
                pad.appendChild(b);
            });
        });
        updateDots();
    }

    async function renderDashboard(content) {
        content.innerHTML = '';
        const scrollBody = document.createElement('div');
        scrollBody.className = 'parent-scroll-body';

        const iqReport = IQAssessment.getReport();

        // 1. Milestone IQ
        const milestoneCard = document.createElement('div');
        milestoneCard.className = 'milestone-iq-card';
        milestoneCard.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div class="milestone-iq-number">${toFa(iqReport.overallIQ)}</div>
                    <div class="milestone-iq-label">شاخص رشد شناختی کودک</div>
                </div>
                <div style="text-align:left;">
                    <div style="font-size:16px; font-weight:900;">${iqReport.estimatedMentalAge}</div>
                    <div style="font-size:12px; opacity:0.9;">سن شناختی تخمینی</div>
                </div>
            </div>
            <div class="milestone-headline">نکته روان‌شناختی: ${iqReport.headline}</div>
        `;
        scrollBody.appendChild(milestoneCard);

        // 2. Radar Chart
        const radarCard = document.createElement('div');
        radarCard.className = 'parent-radar-container';
        radarCard.innerHTML = `
            <h3 style="font-size:16px; font-weight:900; margin-bottom:4px;">نمودار راداری ۶ بعد هوش گاردنر و پیاژه</h3>
            <p style="font-size:12px; color:var(--ink2); margin-bottom:10px;">تحلیل توزیع استعدادها و ابعاد شناختی</p>
            <canvas id="radar-chart" width="320" height="260" class="parent-radar-canvas"></canvas>
        `;
        scrollBody.appendChild(radarCard);

        // 3. Detailed Dimensions
        const detailsCard = document.createElement('div');
        detailsCard.className = 'parent-card';
        detailsCard.innerHTML = `<h3>تحلیل تخصصی ابعاد ۶ گانه</h3>`;

        iqReport.dimensions.forEach(dim => {
            const row = document.createElement('div');
            row.className = 'dimension-report-card';
            row.innerHTML = `
                <div class="dim-head">
                    <span>${dim.title}</span>
                    <span style="background:${dim.badgeColor}; color:#FFF; font-size:11px; padding:2px 8px; border-radius:10px; font-weight:800;">
                        ${dim.status}
                    </span>
                </div>
                <div class="dim-bar">
                    <i style="width:${dim.score}%; background:${dim.color};"></i>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--ink2); font-weight:700; margin-bottom:6px;">
                    <span>امتیاز تسلط: ${toFa(dim.score)} / ۱۰۰</span>
                    <span>سطح: ${toFa(dim.level)}</span>
                </div>
                <div class="dim-advice">${dim.advice}</div>
            `;
            detailsCard.appendChild(row);
        });

        scrollBody.appendChild(detailsCard);

        // 4. Data Privacy
        const settingsCard = document.createElement('div');
        settingsCard.className = 'parent-card';
        settingsCard.innerHTML = `
            <h3>مدیریت داده‌ها</h3>
            <p style="font-size:12px; color:var(--ink2); margin-bottom:10px;">
                داده‌ها به صورت ۱۰۰٪ آفلاین روی حافظه دستگاه نگهداری می‌شوند.
            </p>
            <button class="btn-secondary-action" id="btn-reset-data" style="background:#FFEAEA; color:var(--err); width:100%;">
                پاک کردن تمام داده‌ها و شروع مجدد
            </button>
        `;

        settingsCard.querySelector('#btn-reset-data').addEventListener('click', async () => {
            if (confirm('آیا مایلید تمام داده‌ها بازنشانی شوند؟')) {
                await Storage.clearAll();
                Adaptive.reset();
                state.lessonsDone = {};
                state.totalStars = 0;
                AudioEngine.play('pop');
                renderHome();
                Nav.reset('home');
            }
        });

        scrollBody.appendChild(settingsCard);
        content.appendChild(scrollBody);

        setTimeout(() => {
            const canvas = content.querySelector('#radar-chart');
            if (canvas) IQAssessment.drawRadarChart(canvas);
        }, 100);
    }

    // Launch App
    document.addEventListener('DOMContentLoaded', () => {
        const logo = $('#splash-logo');
        if (logo) logo.innerHTML = Mascot.svg(140, 'happy');
        init();
    });
})();

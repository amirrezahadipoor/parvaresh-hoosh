// Main Application Controller for "پرورش هوش کودک"
(function() {
    'use strict';

    const state = {
        curriculum: null,
        domainId: null,
        levelId: null,
        lessonId: null,
        lessonsDone: {}, // lessonId -> { stars: number, done: boolean, domain: string, lastPlayed: number }
        totalStars: 0,
        muted: false
    };

    const $ = (s) => document.querySelector(s);

    function toFa(num) {
        const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/[0-9]/g, (w) => faDigits[+w]);
    }

    function pickMsg(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

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

        // 2. Load Progress
        const savedProgress = await Storage.load('progress');
        if (savedProgress) {
            state.lessonsDone = savedProgress.lessonsDone || {};
            state.totalStars = savedProgress.totalStars || 0;
        }

        // 3. Load Settings
        const savedSettings = await Storage.load('settings');
        if (savedSettings) {
            state.muted = !!savedSettings.muted;
            AudioEngine.setMuted(state.muted);
        }
        updateVoiceBtn();
        updateHeaderStars();

        // 4. Bind Global Header Controls
        bindHeader();

        // 5. Hide Splash and Launch Home
        setTimeout(() => {
            Nav.reset('home');
            renderHome();
        }, 2000);
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

        $('#btn-voice').addEventListener('click', async () => {
            state.muted = !state.muted;
            AudioEngine.setMuted(state.muted);
            await Storage.save('settings', { muted: state.muted });
            updateVoiceBtn();
            AudioEngine.play('click');
        });
    }

    function updateVoiceBtn() {
        const btn = $('#btn-voice');
        if (btn) {
            btn.style.opacity = state.muted ? '0.45' : '1';
            btn.style.filter = state.muted ? 'grayscale(1)' : 'none';
        }
    }

    function updateHeaderStars() {
        const starEl = $('#header-star-count');
        if (starEl) {
            starEl.textContent = toFa(state.totalStars || 0);
        }
    }

    // ===== HOME SCREEN =====
    function renderHome() {
        updateHeaderStars();
        const grid = $('#domains-grid');
        grid.innerHTML = '';

        App.domains.forEach(d => {
            const domainDef = (state.curriculum.domains || []).find(x => x.id === d.id);
            const title = domainDef ? domainDef.title : d.title;
            const subtitle = d.subtitle || '';
            const lessons = lessonsOfDomain(d.id);
            const doneCount = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const pct = lessons.length ? Math.round((100 * doneCount) / lessons.length) : 0;

            const card = document.createElement('button');
            card.className = 'domain-card';
            card.style.setProperty('--dcolor', d.color);
            card.innerHTML = `
                <div class="domain-icon" style="background:${d.color}">${d.iconChar}</div>
                <div class="domain-name">${title}</div>
                <div class="domain-subtitle">${subtitle}</div>
                <div class="domain-meta">
                    <div class="mini-bar"><i style="width:${pct}%; background:${d.color}"></i></div>
                    <span class="mini-text">${toFa(pct)}٪</span>
                </div>
            `;

            card.addEventListener('click', () => {
                AudioEngine.play('click');
                state.domainId = d.id;
                Nav.push('domain');
                renderDomain();
            });

            grid.appendChild(card);
        });

        // Mascot Greeting
        const mascotEl = $('#home-mascot');
        mascotEl.innerHTML = Mascot.svg(86, 'happy');
        const speech = $('#home-speech');
        const greetingText = pickMsg(MESSAGES.greeting);
        speech.textContent = greetingText;

        mascotEl.onclick = () => {
            AudioEngine.play('bubble');
            Mascot.bounce(mascotEl);
            AudioEngine.speak(speech.textContent);
        };

        setTimeout(() => {
            AudioEngine.speak(speech.textContent);
        }, 500);
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

            content.appendChild(card);
        });

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

        (level.lessons || []).forEach((lesson, i) => {
            const prog = state.lessonsDone[lesson.id];
            const isDone = prog && prog.done;

            const card = document.createElement('button');
            card.className = `lesson-card ${isDone ? 'done' : ''}`;

            card.innerHTML = `
                <div class="lstate">${isDone ? '✓' : toFa(i + 1)}</div>
                <div class="ltitle">${lesson.title}</div>
                ${isDone ? `<span style="color:#F1C40F; font-size:16px; font-weight:900;">${'★'.repeat(prog.stars || 3)}</span>` : ''}
            `;

            card.addEventListener('click', () => {
                AudioEngine.play('click');
                state.lessonId = lesson.id;
                Nav.push('lesson');
                startLesson(lesson);
            });

            content.appendChild(card);
        });

        $('#btn-back-level').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
        };
    }

    // ===== LESSON RUNNER =====
    function startLesson(lesson) {
        const rounds = Generator.generate(lesson.id);
        const body = $('#lesson-body');
        const fill = $('#lesson-progress-fill');
        const ptext = $('#lesson-progress-text');
        const starsEl = $('#star-counter');

        let roundIdx = 0;
        let starCount = 0;

        $('#btn-exit-lesson').onclick = () => {
            AudioEngine.stopSpeak();
            Nav.back();
        };

        function updateProgress() {
            const pct = Math.round((100 * roundIdx) / rounds.length);
            fill.style.width = pct + '%';
            ptext.textContent = `${toFa(roundIdx + 1)} از ${toFa(rounds.length)}`;
            starsEl.textContent = `★ ${toFa(starCount)}`;
        }

        function showMascotMood(mood, msg) {
            const m = document.createElement('div');
            m.className = 'lesson-mascot';
            m.innerHTML = `
                <div class="mini-mascot">${Mascot.svg(56, mood)}</div>
                <div class="mini-speech">${msg}</div>
            `;
            body.appendChild(m);
            setTimeout(() => m.remove(), 1600);
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
            renderer.render(body, round, {
                onCorrect: () => {
                    starCount = Math.min(3, starCount + 1);
                    updateProgress();
                    AudioEngine.play('star');
                    showMascotMood('celebrating', pickMsg(MESSAGES.correct));
                    Adaptive.record(state.domainId, true);
                    roundIdx++;
                    setTimeout(() => nextRound(), 1000);
                },
                onWrong: () => {
                    AudioEngine.play('wrong');
                    showMascotMood('thinking', pickMsg(MESSAGES.wrong));
                    Adaptive.record(state.domainId, false);
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
                domain: state.domainId,
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
            overlay.className = 'result-overlay';
            const starString = '★'.repeat(stars) + '☆'.repeat(3 - stars);

            overlay.innerHTML = `
                <div class="result-card">
                    <div style="margin: 0 auto 10px;">${Mascot.svg(90, 'celebrating')}</div>
                    <h2>آفرین قهرمان!</h2>
                    <div class="r-stars">${starString}</div>
                    <p>${pickMsg(MESSAGES.win)}</p>
                    <button class="big-action-btn primary" id="btn-continue-result" style="margin-bottom:10px;">
                        <span>ادامه ماجراجویی</span>
                    </button>
                    <button class="action-pill-btn" id="btn-home-result" style="width:100%; justify-content:center;">
                        <span>بازگشت به خانه</span>
                    </button>
                </div>
            `;

            document.body.appendChild(overlay);
            if (window.Fx) {
                Fx.confetti();
                Fx.stars(overlay, 6);
            }
            AudioEngine.play('win');

            overlay.querySelector('#btn-continue-result').addEventListener('click', () => {
                overlay.remove();
                AudioEngine.play('click');
                Nav.back();
                renderDomain();
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
            default: return QuizActivity;
        }
    }

    // ===== REWARDS & ACHIEVEMENTS =====
    function renderRewards() {
        const content = $('#rewards-content');
        content.innerHTML = '';

        const hero = document.createElement('div');
        hero.className = 'stats-hero';
        hero.innerHTML = `
            <div class="big">${toFa(state.totalStars || 0)}</div>
            <div class="small">ستاره‌های طلایی جمع‌شده</div>
        `;
        content.appendChild(hero);

        const list = document.createElement('div');
        list.className = 'achievement-list';

        const achievements = [
            { id: 'first', icon: '⭐', name: 'اولین ستاره درخشان', cond: state.totalStars >= 1 },
            { id: 'ten', icon: '🌟', name: '۱۰ ستاره طلایی', cond: state.totalStars >= 10 },
            { id: 'fifty', icon: '🏆', name: '۵۰ ستاره قهرمانی', cond: state.totalStars >= 50 },
            { id: 'hundred', icon: '👑', name: '۱۰۰ ستاره جادویی', cond: state.totalStars >= 100 },
            { id: 'reader', icon: '📚', name: 'استاد الفبا و کلمات', cond: (state.totalStars >= 15) },
            { id: 'mathematician', icon: '🔢', name: 'نابغه ریاضی و هوش', cond: (state.totalStars >= 20) }
        ];

        achievements.forEach(a => {
            const el = document.createElement('div');
            el.className = `achievement ${a.cond ? '' : 'locked'}`;
            el.innerHTML = `
                <div class="a-icon">${a.icon}</div>
                <div class="a-name">${a.name}</div>
                <span style="font-size:12px; color:${a.cond ? 'var(--ok)' : 'var(--ink-light)'}; font-weight:800; margin-top:4px; display:block;">
                    ${a.cond ? 'کسب شده ✓' : 'قفل شده 🔒'}
                </span>
            `;
            list.appendChild(el);
        });

        content.appendChild(list);

        $('#btn-back-rewards').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
        };
    }

    // ===== PARENT DASHBOARD & CHILD GATE =====
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
                <div style="font-size:40px; margin-bottom:8px;">🔒</div>
                <h3 style="font-size:20px; font-weight:900; margin-bottom:6px;">قفل محافظتی ورود والدین</h3>
                <p style="color:var(--ink2); font-size:14px; margin-bottom:16px;">برای اطمینان از حضور والد، پاسخ معادله زیر را وارد کنید:</p>
                <div style="font-size:26px; font-weight:900; color:#6C5CE7; margin-bottom:18px;">
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
                <div style="font-size:40px; margin-bottom:8px;">🔐</div>
                <h3 style="font-size:20px; font-weight:900; margin-bottom:6px;">رمز ورود والدین</h3>
                <p style="color:var(--ink2); font-size:14px; margin-bottom:16px;">رمز ۴ رقمی را وارد کنید:</p>
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
                    b.textContent = '✓';
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
        const panel = document.createElement('div');
        panel.className = 'parent-panel';

        // 1. Overview Summary Card
        const completedCount = Object.values(state.lessonsDone).filter(x => x.done).length;
        const totalLessonsCount = (state.curriculum.domains || []).reduce((acc, d) => {
            return acc + lessonsOfDomain(d.id).length;
        }, 0);
        const overallPct = totalLessonsCount ? Math.round((100 * completedCount) / totalLessonsCount) : 0;

        const overviewCard = document.createElement('div');
        overviewCard.className = 'parent-card';
        overviewCard.innerHTML = `
            <h3>📊 گزارش جامع رشد و پیشرفت کودک</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
                <div style="background:#FDFBF8; padding:12px; border-radius:var(--r-md); border:1px solid #EFE6DC; text-align:center;">
                    <div style="font-size:26px; font-weight:900; color:#6C5CE7;">${toFa(state.totalStars || 0)}</div>
                    <div style="font-size:12px; color:var(--ink2); font-weight:700;">ستاره‌های کسب‌شده</div>
                </div>
                <div style="background:#FDFBF8; padding:12px; border-radius:var(--r-md); border:1px solid #EFE6DC; text-align:center;">
                    <div style="font-size:26px; font-weight:900; color:var(--ok);">${toFa(completedCount)} / ${toFa(totalLessonsCount)}</div>
                    <div style="font-size:12px; color:var(--ink2); font-weight:700;">درس‌های تکمیل‌شده (${toFa(overallPct)}٪)</div>
                </div>
            </div>
            <p style="font-size:13px; color:var(--ink2); line-height:1.6;">
                🔒 این اپلیکیشن کاملاً آفلاین بوده و داده‌های فرزند شما تنها بر روی حافظه همین دستگاه نگهداری می‌شود.
            </p>
        `;
        panel.appendChild(overviewCard);

        // 2. Domain Detailed Radar/Stats Card
        const domainCard = document.createElement('div');
        domainCard.className = 'parent-card';
        domainCard.innerHTML = `<h3>🎯 عملکرد در ۶ حوزه شناختی و مهارتی</h3>`;

        const domainStats = document.createElement('div');
        domainStats.className = 'domain-stats';

        App.domains.forEach(d => {
            const domainDef = (state.curriculum.domains || []).find(x => x.id === d.id);
            const title = domainDef ? domainDef.title : d.title;
            const s = Adaptive.stats(d.id);
            const lessons = lessonsOfDomain(d.id);
            const done = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const pct = lessons.length ? Math.round((100 * done) / lessons.length) : 0;

            const row = document.createElement('div');
            row.className = 'ds-row';
            row.innerHTML = `
                <div class="ds-head">
                    <span>${title}</span>
                    <span class="ds-badge ${s.statusClass}">${s.statusLabel}</span>
                </div>
                <div class="ds-bar">
                    <i style="width:${pct}%; background:${d.color}"></i>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--ink2); font-weight:700; margin-bottom:6px;">
                    <span>پیشرفت: ${toFa(pct)}٪ (${toFa(done)} از ${toFa(lessons.length)})</span>
                    <span>دقت: ${toFa(s.accuracy)}٪ (${toFa(s.correct)} از ${toFa(s.total)})</span>
                </div>
                <div class="ds-tip">💡 ${s.tip}</div>
            `;
            domainStats.appendChild(row);
        });

        domainCard.appendChild(domainStats);
        panel.appendChild(domainCard);

        // 3. Settings & Data Management
        const settingsCard = document.createElement('div');
        settingsCard.className = 'parent-card';
        settingsCard.innerHTML = `
            <h3>⚙️ مدیریت داده‌ها و حریم خصوصی</h3>
            <button class="action-pill-btn" id="btn-reset-data" style="background:#FFEAEA; color:var(--err); width:100%; justify-content:center;">
                <span>پاک کردن تمام داده‌ها و شروع مجدد</span>
            </button>
        `;

        settingsCard.querySelector('#btn-reset-data').addEventListener('click', async () => {
            if (confirm('آیا مطمئن هستید که می‌خواهید تمام پیشرفت و ستاره‌ها بازنشانی شوند؟')) {
                await Storage.clearAll();
                Adaptive.reset();
                state.lessonsDone = {};
                state.totalStars = 0;
                AudioEngine.play('pop');
                renderHome();
                Nav.reset('home');
            }
        });

        panel.appendChild(settingsCard);
        content.appendChild(panel);
    }

    // Launch App
    document.addEventListener('DOMContentLoaded', () => {
        const logo = $('#splash-logo');
        if (logo) logo.innerHTML = Mascot.svg(140, 'happy');
        init();
    });
})();

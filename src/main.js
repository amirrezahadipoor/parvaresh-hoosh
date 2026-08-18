// Khanak Academy - Main controller
(function() {
    'use strict';

    const state = {
        curriculum: null,
        domainId: null,
        levelId: null,
        lessonId: null,
        lessonsDone: {},   // lessonId -> {stars, done}
        totalStars: 0,
        muted: false
    };

    const $ = (s) => document.querySelector(s);

    // ===== Load helpers =====
    const domainConfig = (id) => App.domains.find(d => d.id === id);

    // ===== Init =====
    async function init() {
        // Load curriculum
        try {
            const res = await fetch('content/curriculum.json');
            state.curriculum = await res.json();
        } catch (e) {
            console.error('Curriculum load failed', e);
            // Minimal fallback so app still runs
            state.curriculum = { domains: [] };
        }

        // Load progress
        const progress = await Storage.load('progress');
        if (progress) {
            state.lessonsDone = progress.lessonsDone || {};
            state.totalStars = progress.totalStars || 0;
        }

        // Load settings
        const settings = await Storage.load('settings');
        if (settings) {
            state.muted = !!settings.muted;
            App.sounds = !state.muted;
            App.voice = !state.muted;
            AudioEngine.setMuted(state.muted);
            updateVoiceBtn();
        }

        // Splash -> Home
        setTimeout(() => {
            Nav.reset('home');
            renderHome();
            bindHeader();
        }, 2200);
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
            App.sounds = !state.muted;
            App.voice = !state.muted;
            AudioEngine.setMuted(state.muted);
            await Storage.save('settings', { muted: state.muted });
            updateVoiceBtn();
        });
    }

    function updateVoiceBtn() {
        const btn = $('#btn-voice');
        btn.style.opacity = state.muted ? 0.4 : 1;
    }

    // ===== Home =====
    function renderHome() {
        const grid = $('#domains-grid');
        grid.innerHTML = '';
        App.domains.forEach(d => {
            const domainDef = (state.curriculum.domains || []).find(x => x.id === d.id);
            const title = domainDef ? domainDef.title : d.id;
            const lessons = lessonsOfDomain(d.id);
            const done = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const pct = lessons.length ? Math.round(100 * done / lessons.length) : 0;

            const card = document.createElement('button');
            card.className = 'domain-card';
            card.style.setProperty('--dcolor', d.color);
            card.innerHTML = `
                <div class="domain-icon" style="background:${d.color}">${d.iconChar}</div>
                <div class="domain-name">${title}</div>
                <div class="domain-meta">
                    <div class="mini-bar"><i style="width:${pct}%"></i></div>
                    <span class="mini-text">${pct}%</span>
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

        // Mascot greeting
        const mascotEl = $('#home-mascot');
        mascotEl.innerHTML = Mascot.svg(88, 'happy');
        const speech = $('#home-speech');
        speech.textContent = pickMsg(MESSAGES.greeting);
        setTimeout(() => AudioEngine.speak(speech.textContent), 400);
    }

    function lessonsOfDomain(domainId) {
        const dom = (state.curriculum.domains || []).find(d => d.id === domainId);
        if (!dom) return [];
        const out = [];
        (dom.levels || []).forEach(lv => {
            (lv.lessons || []).forEach(l => out.push({ ...l, levelTitle: lv.title, levelId: lv.id, difficulty: lv.difficulty }));
        });
        return out;
    }

    function levelsOfDomain(domainId) {
        const dom = (state.curriculum.domains || []).find(d => d.id === domainId);
        return dom ? (dom.levels || []) : [];
    }

    // ===== Domain screen =====
    function renderDomain() {
        const d = domainConfig(state.domainId);
        const dom = (state.curriculum.domains || []).find(x => x.id === state.domainId);
        $('#domain-title').textContent = d ? d.title : 'حوزه';

        const content = $('#domain-content');
        content.innerHTML = '';

        // Levels
        const levels = levelsOfDomain(state.domainId);
        const doneLessons = lessonsOfDomain(state.domainId).filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
        const all = lessonsOfDomain(state.domainId).length;
        $('#domain-progress-text').textContent = doneLessons + ' از ' + all;

        levels.forEach((lv, i) => {
            const lessons = lv.lessons;
            const doneInLevel = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const card = document.createElement('button');
            card.className = 'level-card' + (doneInLevel === lessons.length ? ' done' : '');
            card.style.setProperty('--dcolor', d.color);
            card.innerHTML = `
                <div class="level-num">${i + 1}</div>
                <div class="level-info">
                    <div class="level-name">${lv.title}</div>
                    <div class="level-label">${lv.label}</div>
                </div>
                <div class="level-progress">${doneInLevel}/${lessons.length}</div>
            `;
            card.addEventListener('click', () => {
                AudioEngine.play('click');
                state.levelId = lv.id;
                Nav.push('level');
                renderLevel();
            });
            content.appendChild(card);
        });

        $('#btn-back-domain').onclick = () => { AudioEngine.play('click'); Nav.back(); };
    }

    // ===== Level screen =====
    function renderLevel() {
        const dom = (state.curriculum.domains || []).find(x => x.id === state.domainId);
        const level = (dom.levels || []).find(l => l.id === state.levelId);
        $('#level-title').textContent = level ? level.title : 'سطح';

        const content = $('#level-content');
        content.innerHTML = '';

        (level.lessons || []).forEach(lesson => {
            const prog = state.lessonsDone[lesson.id];
            const card = document.createElement('button');
            card.className = 'lesson-card' + (prog && prog.done ? ' done' : '');
            const stateIcon = prog && prog.done ? '✓' : (prog ? '★' : '');
            card.innerHTML = `
                <div class="lstate">${stateIcon}</div>
                <div class="ltitle">${lesson.title}</div>
            `;
            card.addEventListener('click', () => {
                AudioEngine.play('click');
                state.lessonId = lesson.id;
                Nav.push('lesson');
                startLesson(lesson);
            });
            content.appendChild(card);
        });

        $('#btn-back-level').onclick = () => { AudioEngine.play('click'); Nav.back(); };
    }

    // ===== Lesson player =====
    function startLesson(lesson) {
        const rounds = Generator.generate(lesson.id);
        const body = $('#lesson-body');
        const fill = $('#lesson-progress-fill');
        const ptext = $('#lesson-progress-text');
        const starsEl = $('#star-counter');

        let roundIdx = 0;
        let starCount = 0;
        let attempts = 0;
        let correctCount = 0;

        $('#btn-exit-lesson').onclick = () => {
            AudioEngine.stopSpeak();
            Nav.back();
        };

        function updateProgress() {
            fill.style.width = (100 * roundIdx / rounds.length) + '%';
            ptext.textContent = (roundIdx + 1) + ' / ' + rounds.length;
            starsEl.textContent = '★ ' + starCount;
        }

        function showMascotMood(mood, msg) {
            const m = document.createElement('div');
            m.className = 'lesson-mascot';
            m.innerHTML = `<div class="mini-mascot">${Mascot.svg(54, mood)}</div><div class="mini-speech">${msg}</div>`;
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
                onCorrect: (r, extra) => {
                    correctCount++;
                    starCount = Math.min(3, starCount + 1);
                    updateProgress();
                    AudioEngine.play('star');
                    showMascotMood('happy', pickMsg(MESSAGES.correct));
                    Adaptive.record(state.domainId, true);
                    attempts++;
                    roundIdx++;
                    setTimeout(() => nextRound(), 900);
                },
                onWrong: (r) => {
                    AudioEngine.play('wrong');
                    showMascotMood('sad', pickMsg(MESSAGES.wrong));
                    Adaptive.record(state.domainId, false);
                    attempts++;
                    // wrong answers retry the same round
                }
            });
        }

        function finishLesson() {
            const stars = Math.max(1, starCount);
            const prev = state.lessonsDone[lesson.id] || { stars: 0, done: false };
            const newStars = Math.max(prev.stars || 0, stars);
            state.lessonsDone[lesson.id] = { stars: newStars, done: true, domain: state.domainId, lastPlayed: Date.now() };
            state.totalStars = (state.totalStars || 0) + (newStars - (prev.stars || 0));
            Storage.save('progress', { lessonsDone: state.lessonsDone, totalStars: state.totalStars });

            // Result overlay
            const overlay = document.createElement('div');
            overlay.className = 'result-overlay';
            const starIcons = '★★★'.slice(0, stars) + '☆☆☆'.slice(0, 3 - stars);
            overlay.innerHTML = `
                <div class="result-card">
                    <h2>آفرين!</h2>
                    <div class="r-stars">${starIcons}</div>
                    <p>${pickMsg(MESSAGES.win)}</p>
                    <button class="big-btn green" id="btn-continue">ادامه</button>
                    <button class="big-btn" style="background:#95A5A6" id="btn-home-result">بازگشت به خانه</button>
                </div>
            `;
            document.body.appendChild(overlay);
            Fx.confetti();
            AudioEngine.play('win');

            $('#btn-continue').addEventListener('click', () => {
                overlay.remove();
                AudioEngine.play('click');
                Nav.back();
            });
            $('#btn-home-result').addEventListener('click', () => {
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
            case 'order-steps': return OrderingActivity;
            case 'order-size': return OrderingActivity;
            case 'painting': return PaintingActivity;
            default: return null;
        }
    }

    // ===== Rewards =====
    function renderRewards() {
        const content = $('#rewards-content');
        content.innerHTML = '';

        const hero = document.createElement('div');
        hero.className = 'stats-hero';
        hero.innerHTML = `<div class="big">${state.totalStars || 0}</div><div class="small">ستاره</div>`;
        content.appendChild(hero);

        const grid = document.createElement('div');
        grid.className = 'achievement-list';
        const achievements = [
            { id: 'first', icon: '★', name: 'اولين ستاره', cond: state.totalStars >= 1 },
            { id: 'ten', icon: '★★', name: 'ده ستاره', cond: state.totalStars >= 10 },
            { id: 'fifty', icon: '★★★', name: 'پنجاه ستاره', cond: state.totalStars >= 50 },
            { id: 'hundred', icon: '🏆', name: 'صد ستاره', cond: state.totalStars >= 100 }
        ];
        achievements.forEach(a => {
            const el = document.createElement('div');
            el.className = 'achievement' + (a.cond ? '' : ' locked');
            el.innerHTML = `<div class="a-icon">${a.icon}</div><div class="a-name">${a.name}</div>`;
            grid.appendChild(el);
        });
        content.appendChild(grid);

        $('#btn-back-rewards').onclick = () => { AudioEngine.play('click'); Nav.back(); };
    }

    // ===== Parents =====
    const PARENT_PIN_KEY = 'khanak_parent_pin';
    let pinStage = 'entry';
    let pinBuffer = '';

    async function renderParents() {
        const content = $('#parents-content');
        content.innerHTML = '';
        $('#btn-back-parents').onclick = () => { AudioEngine.play('click'); Nav.back(); };

        const stored = await Storage.load(PARENT_PIN_KEY);
        if (!stored) {
            renderPinSetup(content);
        } else {
            pinStage = 'entry';
            pinBuffer = '';
            renderPinEntry(content, stored);
        }
    }

    function renderPinSetup(content) {
        content.innerHTML = `
            <div class="pin-wrap">
                <h3 style="margin-bottom:8px">رمز والدين بساز</h3>
                <p style="color:var(--ink2);font-size:14px">یک رمز ۴ رقمی برای ورود به بخش والدين انتخاب کن</p>
                <div class="pin-dots" id="pin-dots"></div>
                <div class="pin-pad" id="pin-pad"></div>
            </div>
        `;
        bindPinPad(content, async (pin) => {
            await Storage.save(PARENT_PIN_KEY, pin);
            AudioEngine.play('correct');
            renderDashboard(content);
        });
    }

    function renderPinEntry(content, correctPin) {
        content.innerHTML = `
            <div class="pin-wrap">
                <h3 style="margin-bottom:8px">رمز والدين</h3>
                <p style="color:var(--ink2);font-size:14px" id="pin-msg">برای ورود رمز را وارد کن</p>
                <div class="pin-dots" id="pin-dots"></div>
                <div class="pin-pad" id="pin-pad"></div>
            </div>
        `;
        bindPinPad(content, (pin) => {
            if (pin === String(correctPin)) {
                AudioEngine.play('correct');
                renderDashboard(content);
            } else {
                AudioEngine.play('wrong');
                const msg = $('#pin-msg');
                msg.textContent = 'رمز اشتباه است، دوباره تلاش کن';
                Fx.shake($('.pin-wrap'));
            }
        });
    }

    function bindPinPad(content, onSubmit) {
        const dotsEl = $('#pin-dots');
        const pad = $('#pin-pad');
        let buffer = '';
        function updateDots() {
            dotsEl.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const d = document.createElement('div');
                d.className = 'pin-dot' + (i < buffer.length ? ' filled' : '');
                dotsEl.appendChild(d);
            }
        }
        function key(n) {
            if (buffer.length >= 4) return;
            buffer += n;
            AudioEngine.play('pop');
            updateDots();
            if (buffer.length === 4) {
                setTimeout(() => { onSubmit(buffer); buffer = ''; }, 300);
            }
        }
        const rows = [[1,2,3],[4,5,6],[7,8,9],['del',0,'ok']];
        rows.forEach(row => {
            row.forEach(k => {
                const b = document.createElement('button');
                b.className = 'pin-key';
                if (k === 'del') { b.textContent = '⌫'; b.classList.add('back'); b.addEventListener('click', () => { buffer = buffer.slice(0,-1); updateDots(); AudioEngine.play('click'); }); }
                else if (k === 'ok') { b.textContent = 'OK'; b.classList.add('ok'); b.addEventListener('click', () => { if (buffer.length === 4) { onSubmit(buffer); buffer=''; } }); }
                else if (k === 0) { b.textContent = '0'; b.classList.add('zero'); b.addEventListener('click', () => key(0)); }
                else { b.textContent = k; b.addEventListener('click', () => key(k)); }
                pad.appendChild(b);
            });
        });
        updateDots();
    }

    async function renderDashboard(content) {
        content.innerHTML = '';
        const panel = document.createElement('div');
        panel.className = 'parent-panel';

        // Domain performance
        const card = document.createElement('div');
        card.className = 'parent-card';
        card.innerHTML = '<h3>عملکرد در حوزه‌ها</h3>';
        const stats = document.createElement('div');
        stats.className = 'domain-stats';

        App.domains.forEach(d => {
            const domainDef = (state.curriculum.domains || []).find(x => x.id === d.id);
            const domainTitle = domainDef ? domainDef.title : d.id;
            const s = Adaptive.stats(d.id);
            const lessons = lessonsOfDomain(d.id);
            const done = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const pct = lessons.length ? Math.round(100 * done / lessons.length) : 0;
            const row = document.createElement('div');
            row.className = 'ds-row';
            const badge = s.accuracy >= 80 ? 'قوي' : s.accuracy >= 60 ? 'در حال رشد' : 'نياز به تمرين';
            const badgeColor = s.accuracy >= 80 ? 'var(--ok)' : s.accuracy >= 60 ? 'var(--science)' : 'var(--err)';
            row.innerHTML = `
                <div class="ds-head">
                    <span>${domainTitle}</span>
                    <span><span class="ds-badge" style="background:${badgeColor}">${badge}</span></span>
                </div>
                <div class="ds-bar"><i style="width:${pct}%;background:${d.color}"></i></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--ink2);margin-top:3px">
                    <span>پیشرفت: ${pct}%</span>
                    <span>دقت: ${s.accuracy}% (${s.correct}/${s.total})</span>
                    <span>سطح: ${s.difficulty}</span>
                </div>
            `;
            stats.appendChild(row);
        });
        card.appendChild(stats);
        panel.appendChild(card);

        // Overall
        const overall = document.createElement('div');
        overall.className = 'parent-card';
        overall.innerHTML = `
            <h3>خلاصه کلی</h3>
            <p style="font-size:14px;color:var(--ink2);margin-bottom:6px">
                ستاره‌های جمع‌شده: <b>${state.totalStars || 0}</b> —
                درس‌های انجام‌شده: <b>${Object.values(state.lessonsDone).filter(x => x.done).length}</b>
            </p>
            <p style="font-size:12px;color:var(--ink2)">
                تمام اطلاعات به‌صورت کاملاً محلی روی همین دستگاه ذخیره می‌شود و به هیچ سروری ارسال نمی‌شود.
            </p>
        `;
        panel.appendChild(overall);

        // Parent PIN change
        const pinCard = document.createElement('div');
        pinCard.className = 'parent-card';
        pinCard.innerHTML = '<h3>تغییر رمز</h3><button class="big-btn" id="btn-change-pin" style="margin-top:8px">تغییر رمز والدین</button>';
        pinCard.querySelector('#btn-change-pin').addEventListener('click', async () => {
            await Storage.save(PARENT_PIN_KEY, null);
            renderParents();
        });
        panel.appendChild(pinCard);

        content.appendChild(panel);
    }

    // ===== Helpers =====
    function pickMsg(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // ===== Bottom nav =====
    // Home screen is the only main screen; rewards accessible via nav placeholder on home
    // (We attach a small floating rewards button too)

    // Wire splash mascot
    document.addEventListener('DOMContentLoaded', () => {
        $('#splash-logo').innerHTML = Mascot.svg(140, 'happy');
        init();
    });
})();

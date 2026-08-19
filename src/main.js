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

    // Expose read-only app state to progression helpers; no child-facing data is added.
    window.AppState = state;

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    function toFa(num) {
        const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/[0-9]/g, (w) => faDigits[+w]);
    }

    function pickMsg(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ===== IN-APP DIALOGS =====
    // window.confirm/alert are silent no-ops inside the Android Capacitor WebView,
    // so every confirmation/notice must use this in-app modal instead.
    function showDialog(options) {
        const title = options.title || '';
        const message = options.message || '';
        const okLabel = options.okLabel || 'باشه';
        const cancelLabel = options.cancelLabel || null;
        const tone = options.tone || 'default'; // 'default' | 'danger'

        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.className = 'app-dialog-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');

            const card = document.createElement('div');
            card.className = `app-dialog-card ${tone === 'danger' ? 'danger' : ''}`;

            const titleEl = document.createElement('h3');
            titleEl.className = 'app-dialog-title';
            titleEl.textContent = title;

            const messageEl = document.createElement('p');
            messageEl.className = 'app-dialog-message';
            messageEl.textContent = message;

            const actions = document.createElement('div');
            actions.className = 'app-dialog-actions';

            const okBtn = document.createElement('button');
            okBtn.type = 'button';
            okBtn.className = 'btn-primary-action';
            okBtn.textContent = okLabel;

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn-secondary-action';
            cancelBtn.textContent = cancelLabel;

            actions.appendChild(okBtn);
            if (cancelLabel) actions.appendChild(cancelBtn);

            card.appendChild(titleEl);
            card.appendChild(messageEl);
            card.appendChild(actions);
            overlay.appendChild(card);

            const close = result => {
                overlay.remove();
                resolve(result);
            };

            okBtn.addEventListener('click', () => close(true));
            if (cancelLabel) cancelBtn.addEventListener('click', () => close(false));
            overlay.addEventListener('click', event => {
                if (event.target === overlay && cancelLabel) close(false);
            });

            document.body.appendChild(overlay);
            okBtn.focus();
        });
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
    function registerOfflineShell() {
        if (!('serviceWorker' in navigator)) return;
        if (!/^https?:$/.test(window.location.protocol)) return;
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    async function init() {
        registerOfflineShell();
        await Storage.init();
        if (window.Engagement) await window.Engagement.init();

        // 1. Load the bundled curriculum first, then refresh it from the local JSON when available.
        state.curriculum = window.CURRICULUM && Array.isArray(window.CURRICULUM.domains)
            ? window.CURRICULUM
            : { domains: window.App.domains };
        try {
            if (typeof window.fetch === 'function') {
                const res = await window.fetch('content/curriculum.json', { cache: 'no-store' });
                if (res && res.ok) {
                    const remote = await res.json();
                    if (remote && Array.isArray(remote.domains)) state.curriculum = remote;
                }
            }
        } catch (e) {
            // The embedded curriculum keeps file:// and offline launches functional.
            console.warn('Curriculum refresh unavailable; using bundled copy.', e);
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
            if (AudioEngine.setMusicMuted) AudioEngine.setMusicMuted(state.musicMuted);
        } else if (AudioEngine.setMusicMuted) {
            AudioEngine.setMusicMuted(false);
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
            if (window.Engagement && !window.Engagement.hasProfile()) showProfileOnboarding();
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

        // Tap = open the song picker (mute/unmute + choose a tune).
        $('#btn-music').addEventListener('click', () => {
            AudioEngine.play('click');
            showMusicPicker();
        });

        $('#btn-voice').addEventListener('click', async () => {
            state.sfxMuted = !state.sfxMuted;
            AudioEngine.setSfxMuted(state.sfxMuted);
            await Storage.save('settings', { sfxMuted: state.sfxMuted, musicMuted: state.musicMuted });
            updateAudioButtons();
            AudioEngine.play('click');
        });
    }

    function showMusicPicker() {
        if (document.querySelector('.music-picker-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'music-picker-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML = `
            <div class="music-picker-card">
                <h2>آهنگ‌های شاد</h2>
                <p>یک آهنگ انتخاب کن یا بگذار خودش عوض شود.</p>
                <button type="button" class="music-toggle-btn" id="music-toggle"></button>
                <div class="music-track-list" id="music-track-list"></div>
                <button type="button" class="btn-secondary-action" id="music-close">بستن</button>
            </div>
        `;

        const toggleBtn = overlay.querySelector('#music-toggle');
        const listEl = overlay.querySelector('#music-track-list');

        const paint = () => {
            toggleBtn.textContent = state.musicMuted ? 'روشن کردن موسیقی' : 'خاموش کردن موسیقی';
            toggleBtn.classList.toggle('is-off', !!state.musicMuted);
            listEl.innerHTML = '';
            (AudioEngine.listTracks ? AudioEngine.listTracks() : []).forEach(t => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'music-track-btn' + (t.active ? ' active' : '');
                b.innerHTML = `<span class="music-note-ico" aria-hidden="true">♪</span><span>${t.title}</span>`;
                b.addEventListener('click', async () => {
                    AudioEngine.play('click');
                    if (state.musicMuted) {
                        state.musicMuted = false;
                        AudioEngine.setMusicMuted(false);
                        AudioEngine.startMusic();
                        await Storage.save('settings', { sfxMuted: state.sfxMuted, musicMuted: false });
                    }
                    AudioEngine.setTrack(t.index);
                    updateAudioButtons();
                    paint();
                });
                listEl.appendChild(b);
            });
        };

        toggleBtn.addEventListener('click', async () => {
            const isOn = AudioEngine.toggleMusic();
            state.musicMuted = !isOn;
            AudioEngine.setMusicMuted(state.musicMuted);
            await Storage.save('settings', { sfxMuted: state.sfxMuted, musicMuted: state.musicMuted });
            updateAudioButtons();
            paint();
        });

        overlay.querySelector('#music-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', ev => { if (ev.target === overlay) overlay.remove(); });
        paint();
        document.body.appendChild(overlay);
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
    const DAILY_CHALLENGES = [
        { id: 'reading', icon: 'book', title: 'روز کلمه‌ها', desc: 'امروز ۲ درس از خواندن و الفبا را تمام کن', domain: 'reading', target: 2 },
        { id: 'math', icon: 'numbers', title: 'روز اعداد', desc: 'امروز ۲ درس از ریاضی را تمام کن', domain: 'math', target: 2 },
        { id: 'logic', icon: 'puzzle', title: 'روز کارآگاه', desc: 'امروز ۲ درس از منطق و پازل را تمام کن', domain: 'logic', target: 2 },
        { id: 'science', icon: 'science', title: 'روز دانشمند', desc: 'امروز ۲ درس از علوم و طبیعت را تمام کن', domain: 'science', target: 2 },
        { id: 'social', icon: 'heart', title: 'روز مهربانی', desc: 'امروز ۲ درس از مهارت اجتماعی را تمام کن', domain: 'socio-emotional', target: 2 },
        { id: 'art', icon: 'art', title: 'روز هنرمند', desc: 'امروز ۲ درس از هنر و خلاقیت را تمام کن', domain: 'art', target: 2 },
        { id: 'mixed', icon: 'star', title: 'روز رنگین‌کمان', desc: 'امروز از ۳ حوزهٔ مختلف درس بخوان', domain: null, target: 3 }
    ];

    function todayChallenge() {
        // Deterministic per calendar day: same challenge all day, new one tomorrow.
        const now = new Date();
        const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        const dayNumber = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000);
        return { ...DAILY_CHALLENGES[dayNumber % DAILY_CHALLENGES.length], dateKey: key };
    }

    function createDailyChallenge(allLessons, todayNote) {
        const ch = todayChallenge();
        const today = window.Engagement ? window.Engagement.getToday() : { lessonIds: [] };
        const doneToday = new Set(today.lessonIds || []);
        const byId = new Map((allLessons || []).map(l => [l.id, l]));

        let progress;
        if (ch.domain) {
            progress = [...doneToday].filter(id => (byId.get(id) || {}).domainId === ch.domain).length;
        } else {
            progress = new Set([...doneToday].map(id => (byId.get(id) || {}).domainId).filter(Boolean)).size;
        }
        const complete = progress >= ch.target;
        const pct = Math.min(100, Math.round((progress / ch.target) * 100));

        const card = document.createElement('section');
        card.className = 'daily-challenge-card' + (complete ? ' is-complete' : '');
        card.innerHTML = `
            <div class="challenge-head">
                <span class="challenge-badge">${complete ? '✓' : '★'}</span>
                <div class="challenge-copy">
                    <b>چالش امروز · ${ch.title}</b>
                    <small>${complete ? 'آفرین! چالش امروز را بردی.' : ch.desc}</small>
                </div>
            </div>
            <div class="challenge-track"><div class="challenge-fill" style="width:${pct}%"></div></div>
            <div class="challenge-count">${toFa(Math.min(progress, ch.target))} از ${toFa(ch.target)}</div>
            ${todayNote ? `<div class="challenge-today">${todayNote}</div>` : ''}
        `;
        return card;
    }

    function renderHome() {
        updateHeaderStars();
        updateAudioButtons();

        const container = $('#home-content');
        if (!container) return;
        container.innerHTML = '';

        const dashboard = document.createElement('div');
        dashboard.className = 'home-dashboard';

        // Welcome card: one clear primary message and one touch target.
        const mascot = Mascot.getCharacter();
        const profile = window.Engagement ? window.Engagement.getProfile() : { name: '', age: null };
        const childName = profile.name || 'قهرمان کوچولو';
        const welcome = document.createElement('section');
        welcome.className = 'home-welcome-card';

        const mascotButton = document.createElement('button');
        mascotButton.className = 'home-mascot-button';
        mascotButton.type = 'button';
        mascotButton.setAttribute('aria-label', 'شنیدن پیام دانا');
        mascotButton.innerHTML = Mascot.svg(76, 'happy', mascot.id);

        const welcomeCopy = document.createElement('div');
        welcomeCopy.className = 'home-welcome-copy';
        const welcomeTitle = document.createElement('h1');
        welcomeTitle.textContent = `سلام ${childName}`;
        const welcomeText = document.createElement('p');
        welcomeText.textContent = pickMsg(window.MESSAGES.greeting);
        welcomeCopy.append(welcomeTitle, welcomeText);
        welcome.append(mascotButton, welcomeCopy);
        // Stars live in the greeting row instead of their own card: the home screen
        // was 1467px tall in an 851px viewport, so a child had to scroll past four
        // status widgets to reach the lessons.
        const inlineStars = document.createElement('div');
        inlineStars.className = 'home-inline-stars';
        inlineStars.innerHTML = `<strong>${toFa(state.totalStars || 0)}</strong><span>ستاره</span>`;
        welcome.appendChild(inlineStars);

        const sayWelcome = () => {
            AudioEngine.play('bubble');
            Mascot.bounce(mascotButton);
            AudioEngine.speak(welcomeText.textContent);
        };
        mascotButton.addEventListener('click', sayWelcome);
        welcomeCopy.addEventListener('click', sayWelcome);
        dashboard.appendChild(welcome);

        const allLessons = (state.curriculum && state.curriculum.domains || []).flatMap(domain =>
            (domain.levels || []).flatMap(level => (level.lessons || []).map(lesson => ({ ...lesson, domainId: domain.id, levelId: level.id })))
        );
        const completedLessons = allLessons.filter(lesson => state.lessonsDone[lesson.id] && state.lessonsDone[lesson.id].done).length;
        const completion = allLessons.length ? Math.round((completedLessons / allLessons.length) * 100) : 0;

        const today = window.Engagement ? window.Engagement.getToday() : { completed: 0, goal: 3, percent: 0 };
        const streak = window.Engagement ? window.Engagement.getStreak() : { current: 0 };
        // The 78px stats row duplicated numbers already shown elsewhere; its two
        // useful figures are folded into the daily-challenge card below.
        const todayLine = `${toFa(today.completed)} از ${toFa(today.goal)} فعالیت امروز · زنجیره ${toFa(streak.current)} روز`;

        // The single primary call to action is always the next unfinished milestone.
        const nextNode = AdventureJourney.getNextNode(state.lessonsDone);

        // ---- Giant animated play button ----
        // One huge, pulsing target a child can hit without reading anything. It runs
        // the mixed ladder: lesson -> quiz -> game -> painting, easy to hard.
        const bigPlay = document.createElement('button');
        bigPlay.type = 'button';
        bigPlay.className = 'giant-play-btn';
        bigPlay.setAttribute('aria-label', 'شروع بازی و یادگیری');
        bigPlay.innerHTML = `
            <span class="giant-play-glow" aria-hidden="true"></span>
            <span class="giant-play-ring" aria-hidden="true"></span>
            <span class="giant-play-core">
                <span class="giant-play-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>
                </span>
                <span class="giant-play-label">بزن بریم!</span>
                <span class="giant-play-sub">درس، سوال، بازی و نقاشی</span>
            </span>
        `;
        bigPlay.addEventListener('click', () => {
            AudioEngine.play('click');
            startMixedJourney();
        });
        dashboard.appendChild(bigPlay);

        // ---- Daily challenge -------------------------------------------------
        // Long-term retention was the weakest part of the app: nothing on the home
        // screen changed from day to day. This card rotates deterministically by
        // date, so every morning there is a different, nameable goal. Placed high
        // on the page so the child actually sees it without scrolling.
        dashboard.appendChild(createDailyChallenge(allLessons, todayLine));

        const dailyPlan = document.createElement('section');
        dailyPlan.className = 'daily-plan-card';
        const todayPlan = window.Engagement ? window.Engagement.getToday() : { completed: 0, goal: 3 };
        const planLessons = buildDailyPlan(allLessons, todayPlan).slice(0, 2);
        dailyPlan.innerHTML = `
            <div class="daily-plan-head"><div><h2>برنامهٔ امروز</h2><p>سه تمرین کوتاه و متنوع</p></div><strong>${toFa(todayPlan.completed)} / ${toFa(todayPlan.goal)}</strong></div>
            <div class="daily-plan-list"></div>
        `;
        const planList = dailyPlan.querySelector('.daily-plan-list');
        if (!planLessons.length) {
            const doneMessage = document.createElement('p');
            doneMessage.className = 'daily-plan-complete';
            doneMessage.textContent = 'هدف امروز کامل شد؛ آفرین به پشتکارت!';
            planList.appendChild(doneMessage);
        } else {
            planLessons.forEach((lesson, index) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'daily-plan-item';
                item.innerHTML = `<span class="daily-plan-index">${toFa(index + 1)}</span><span class="daily-plan-copy"><b></b><small></small></span><span class="daily-plan-arrow">‹</span>`;
                const guide = lessonGuide(lesson.type);
                item.querySelector('.daily-plan-copy b').textContent = lesson.title;
                item.querySelector('.daily-plan-copy small').textContent = `${lesson.isReview ? 'مرور پیشنهادی · ' : ''}${guide.label} · ${toFa(guide.minutes)} دقیقه`;
                item.addEventListener('click', () => {
                    AudioEngine.play('click');
                    state.domainId = lesson.domainId;
                    state.lessonId = lesson.id;
                    Nav.push('lesson');
                    startLesson(lesson);
                });
                planList.appendChild(item);
            });
        }
        const learningHeader = document.createElement('div');
        learningHeader.className = 'home-section-heading';
        learningHeader.innerHTML = `<div><h2>دنیای یادگیری</h2><p>پیشرفت کلی ${toFa(completion)}٪ · یک حوزه را انتخاب کن</p></div>`;
        dashboard.appendChild(learningHeader);

        const grid = document.createElement('div');
        grid.className = 'domains-grid home-domains-grid';

        const openDomain = domainId => {
            state.domainId = domainId;
            AudioEngine.play('click');
            Nav.push('domain');
            renderDomain();
        };

        window.App.domains.forEach(domain => {
            const lessons = lessonsOfDomain(domain.id);
            const done = lessons.filter(lesson => state.lessonsDone[lesson.id] && state.lessonsDone[lesson.id].done).length;
            const tile = document.createElement('button');
            tile.type = 'button';
            tile.className = 'domain-tile';
            tile.style.setProperty('--tile-color', domain.color);
            tile.style.setProperty('--tile-bg', domain.bg);
            tile.innerHTML = `
                <span class="domain-tile-icon"></span>
                <span class="domain-tile-title"></span>
                <span class="domain-tile-subtitle"></span>
                <span class="domain-tile-progress"><i></i><b></b></span>
            `;
            tile.querySelector('.domain-tile-icon').innerHTML = window.AppIcons
                ? window.AppIcons.get(domain.iconId || domain.id, 25)
                : domain.iconChar;
            tile.querySelector('.domain-tile-title').textContent = domain.title;
            tile.querySelector('.domain-tile-subtitle').textContent = domain.subtitle;
            const progress = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
            tile.querySelector('.domain-tile-progress i').style.setProperty('--progress', `${progress}%`);
            tile.querySelector('.domain-tile-progress b').textContent = `${toFa(done)} / ${toFa(lessons.length)}`;
            tile.addEventListener('click', () => openDomain(domain.id));
            grid.appendChild(tile);
        });

        dashboard.appendChild(grid);

        // ---- Play zone -------------------------------------------------------
        // The arcade used to be a 7th tile inside the "دنیای یادگیری" grid, so the
        // free-play games looked like another school subject. It is now its own
        // clearly separated section: lessons above, games below.
        const playHeading = document.createElement('div');
        playHeading.className = 'home-section-heading';
        playHeading.innerHTML = '<div><h2>بازی و سرگرمی</h2><p>بدون درس؛ فقط بازی کن و تمرین کن</p></div>';
        dashboard.appendChild(playHeading);

        const arcadeBanner = document.createElement('button');
        arcadeBanner.type = 'button';
        arcadeBanner.className = 'arcade-banner';
        arcadeBanner.innerHTML = `
            <span class="arcade-banner-icon">${window.AppIcons ? window.AppIcons.get('arcade', 30) : 'بازی'}</span>
            <span class="arcade-banner-copy">
                <b>شهربازی هوش</b>
                <small>شکار بادکنک، پیانو، غذا به حیوانات و بازی‌های کوتاه</small>
            </span>
            <span class="arcade-banner-go">برو</span>
        `;
        arcadeBanner.addEventListener('click', () => {
            AudioEngine.play('click');
            $('#arcade-title').textContent = 'شهربازی هوش';
            Nav.push('arcade');
            renderArcadeGrid();
        });
        dashboard.appendChild(arcadeBanner);

        // Daily plan & adventure map come after the domain grid: on Android the primary
        // navigation (domain tiles) must be visible right away, not buried below the fold.
        // The 194px «برنامهٔ امروز» card repeated what the challenge card and the
        // giant play button already offer, and pushed the domains below the fold.
        // dashboard.appendChild(dailyPlan);

        const quickActions = document.createElement('div');
        quickActions.className = 'home-quick-actions';
        quickActions.appendChild(createHomeAction('ستاره‌ها و همبازی', 'rewards', renderRewards));
        quickActions.appendChild(createHomeAction('داشبورد والدین', 'parents', renderParents));
        dashboard.appendChild(quickActions);

        container.appendChild(dashboard);
    }

    function showProfileOnboarding() {
        if (!window.Engagement || document.querySelector('.profile-onboarding-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'profile-onboarding-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML = `
            <div class="profile-onboarding-card">
                <div class="profile-onboarding-mark">شروع</div>
                <h2>هم‌بازی کوچولویت را بشناسیم</h2>
                <p>نام اختیاری است؛ سن برای تنظیم مسیر یادگیری لازم است و فقط روی همین دستگاه ذخیره می‌شود.</p>
                <label class="profile-field-label" for="child-name">نام کودک</label>
                <input id="child-name" class="profile-name-input" type="text" maxlength="24" autocomplete="off" placeholder="مثلاً آریا">
                <span class="profile-field-label">سن کودک</span>
                <div class="age-choice-grid" id="age-choice-grid"></div>
                <div class="profile-onboarding-actions">
                    <button type="button" class="profile-start-btn" id="profile-start" disabled>شروع کنیم</button>
                </div>
            </div>
        `;

        const profile = window.Engagement.getProfile();
        const nameInput = overlay.querySelector('#child-name');
        nameInput.value = profile.name || '';
        const ageGrid = overlay.querySelector('#age-choice-grid');
        let selectedAge = Number(profile.age) || null;
        const startButton = overlay.querySelector('#profile-start');
        startButton.disabled = selectedAge === null;
        [4, 5, 6, 7, 8].forEach(age => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'age-choice';
            button.textContent = `${toFa(age)} سال`;
            button.addEventListener('click', () => {
                selectedAge = age;
                ageGrid.querySelectorAll('.age-choice').forEach(item => item.classList.remove('selected'));
                button.classList.add('selected');
                startButton.disabled = false;
            });
            ageGrid.appendChild(button);
            if (selectedAge === age) button.classList.add('selected');
        });

        const close = async profile => {
            await window.Engagement.saveProfile(profile);
            overlay.remove();
            Nav.reset('home');
            renderHome();
        };
        overlay.querySelector('#profile-start').addEventListener('click', () => {
            if (selectedAge === null) return;
            const name = overlay.querySelector('#child-name').value.trim();
            close({ name, age: selectedAge });
        });
        document.body.appendChild(overlay);
        setTimeout(() => overlay.querySelector('#child-name').focus(), 50);
    }

    function buildDailyPlan(allLessons, today) {
        const completedToday = new Set((window.Engagement && window.Engagement.getToday && window.Engagement.getToday().lessonIds) || []);
        const queue = window.Engagement && window.Engagement.getReviewQueue ? window.Engagement.getReviewQueue() : [];
        const lessonById = new Map(allLessons.map(lesson => [lesson.id, lesson]));
        const selected = [];
        const domains = new Set();
        const limit = Math.min(3, today.goal || 3);

        queue.forEach(item => {
            const lesson = lessonById.get(item.lessonId);
            if (!lesson || completedToday.has(lesson.id) || selected.length >= limit) return;
            selected.push({ ...lesson, isReview: true, reviewCount: item.count || 1 });
            domains.add(lesson.domainId);
        });

        const candidates = allLessons.filter(lesson =>
            !completedToday.has(lesson.id) && !(state.lessonsDone[lesson.id] && state.lessonsDone[lesson.id].done) &&
            !selected.some(item => item.id === lesson.id)
        );
        for (const lesson of candidates) {
            if (selected.length >= limit) break;
            if (!domains.has(lesson.domainId)) {
                selected.push(lesson);
                domains.add(lesson.domainId);
            }
        }
        for (const lesson of candidates) {
            if (selected.length >= limit) break;
            if (!selected.some(item => item.id === lesson.id)) selected.push(lesson);
        }
        return selected;
    }

    function createAdventureMap() {
        const nodes = AdventureJourney.getNodes();
        const firstIncomplete = nodes.findIndex(node => !(state.lessonsDone[node.lessonId] && state.lessonsDone[node.lessonId].done));
        const activeIndex = firstIncomplete < 0 ? nodes.length - 1 : firstIncomplete;
        const completed = nodes.filter(node => state.lessonsDone[node.lessonId] && state.lessonsDone[node.lessonId].done).length;
        const section = document.createElement('section');
        section.className = 'adventure-map-card';
        section.innerHTML = `<div class="adventure-map-head"><div><h2>نقشهٔ ماجراجویی</h2><p>هر مرحله، یک مهارت تازه</p></div><strong>${toFa(completed)} / ${toFa(nodes.length)}</strong></div><div class="adventure-map-track"></div>`;
        const track = section.querySelector('.adventure-map-track');
        nodes.forEach((node, index) => {
            const done = state.lessonsDone[node.lessonId] && state.lessonsDone[node.lessonId].done;
            const unlocked = index <= activeIndex;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `adventure-map-node ${done ? 'done' : ''} ${index === activeIndex ? 'current' : ''} ${unlocked ? '' : 'locked'}`;
            button.style.setProperty('--node-color', node.color);
            button.innerHTML = `<span class="adventure-map-node-icon"></span><small></small>`;
            const nodeIcon = button.querySelector('.adventure-map-node-icon');
            if (done) {
                nodeIcon.textContent = '✓';
            } else {
                nodeIcon.innerHTML = window.AppIcons ? window.AppIcons.get(node.domain || 'play', 21) : node.icon;
            }
            button.querySelector('small').textContent = node.title.replace(/^\d+\.\s*/, '');
            button.disabled = !unlocked;
            button.setAttribute('aria-label', `${node.title} ${done ? 'تکمیل شده' : unlocked ? 'باز' : 'قفل'}`);
            if (unlocked) button.addEventListener('click', () => startAdventureLesson(node));
            track.appendChild(button);
        });
        return section;
    }

    function createHomeStat(label, value, caption) {
        const card = document.createElement('div');
        card.className = 'home-stat-card';
        card.innerHTML = '<span class="home-stat-label"></span><strong class="home-stat-value"></strong><small class="home-stat-caption"></small>';
        card.querySelector('.home-stat-label').textContent = label;
        card.querySelector('.home-stat-value').textContent = value;
        card.querySelector('.home-stat-caption').textContent = caption;
        return card;
    }

    function createHomeAction(label, screen, render) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'home-quick-action';
        button.textContent = label;
        button.addEventListener('click', () => {
            AudioEngine.play('click');
            Nav.push(screen);
            render();
        });
        return button;
    }

    function startAdventureLesson(node) {
        if (!node || !node.lessonId) return;
        state.domainId = node.domain;
        state.lessonId = node.lessonId;
        const lessonDef = findLesson(node.lessonId);
        if (!lessonDef) return;
        Nav.push('lesson');
        startLesson(lessonDef);
    }

    // ------------------------------------------------------------------
    // Mixed journey: one big button starts a varied, easy-to-hard ladder that
    // alternates domains so the child gets lesson / question / game / painting
    // in turn instead of the same drill five times.
    // ------------------------------------------------------------------
    function startMixedJourney() {
        const all = [];
        for (const dom of (state.curriculum && state.curriculum.domains) || []) {
            for (const lv of dom.levels || []) {
                for (const l of lv.lessons || []) {
                    all.push({ ...l, domain: dom.id, difficulty: l.difficulty || lv.difficulty || 1 });
                }
            }
        }
        if (!all.length) return;

        const done = id => state.lessonsDone[id] && state.lessonsDone[id].done;
        // Easiest-first, unfinished lessons lead the queue.
        const pool = all.slice().sort((a, b) => (a.difficulty - b.difficulty));
        const fresh = pool.filter(l => !done(l.id));
        const source = fresh.length ? fresh : pool;

        // Round-robin across domains so consecutive picks feel different.
        const byDomain = {};
        source.forEach(l => { (byDomain[l.domain] = byDomain[l.domain] || []).push(l); });

        // Smarter ordering: domains the child is weakest at come first, so practice
        // goes where it is actually needed instead of a fixed reading-first list.
        const weakness = domain => {
            if (!window.Adaptive || !window.Adaptive.stats) return 0.5;
            try {
                const st = window.Adaptive.stats(domain);
                if (!st || !st.total) return 0.6;        // untouched -> fairly high priority
                return 1 - (st.accuracy || 0) / 100;      // lower accuracy -> higher priority
            } catch (e) { return 0.5; }
        };
        const order = ['reading', 'math', 'logic', 'science', 'socio-emotional', 'art']
            .filter(d => byDomain[d] && byDomain[d].length)
            .sort((a, b) => weakness(b) - weakness(a));
        const extra = Object.keys(byDomain).filter(d => !order.includes(d));
        const domainRing = [...order, ...extra];

        const queue = [];
        for (let i = 0; queue.length < 8 && i < 40; i++) {
            const d = domainRing[i % domainRing.length];
            const list = byDomain[d];
            if (list && list.length) queue.push(list.shift());
        }
        if (!queue.length) return;

        state.mixedQueue = queue.slice(1);
        const first = queue[0];
        state.domainId = first.domain;
        state.lessonId = first.id;
        Nav.push('lesson');
        startLesson(first);
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
        const d = window.App.domains.find(x => x.id === state.domainId) || { color: '#6C5CE7', title: 'حوزه' };
        const dom = (state.curriculum && state.curriculum.domains || []).find(x => x.id === state.domainId);
        $('#domain-title').textContent = dom ? dom.title : d.title;

        const content = $('#domain-content');
        content.innerHTML = '';

        const levels = levelsOfDomain(state.domainId);
        const allLessons = lessonsOfDomain(state.domainId);
        const doneLessons = allLessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;

        $('#domain-progress-text').textContent = `${toFa(doneLessons)} از ${toFa(allLessons.length)} درس`;

        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:10px; touch-action:pan-y; overscroll-behavior-y:contain;';

        // The adventure map lives here rather than on the home screen. Home had three
        // competing "what to do next" widgets stacked on top of each other; the map
        // belongs next to the levels it actually describes.
        if (state.domainId === 'reading') scrollContainer.appendChild(createAdventureMap());

        // A 6-year-old was shown all 12-13 levels of a domain at once, most of them
        // for 5- or 8-year-olds. That is the "too many categories / cluttered"
        // problem: the child scrolls past content they cannot use to reach theirs.
        // Split the list into "for you now" and a collapsed "later / earlier".
        const myAge = Number(window.Engagement ? (window.Engagement.getProfile().age) : 0) || 0;
        const bandOf = lv => ageStart(lv.ageBand || (lv.lessons || [])[0]?.ageBand);
        const forMe = myAge ? levels.filter(lv => { const a = bandOf(lv); return a <= myAge + 0.5 && a >= myAge - 1.5; }) : levels;
        const others = myAge ? levels.filter(lv => forMe.indexOf(lv) === -1) : [];
        const primary = forMe.length ? forMe : levels;
        const secondary = forMe.length ? others : [];

        const makeHeading = text => {
            const h = document.createElement('div');
            h.className = 'level-group-heading';
            h.textContent = text;
            h.style.cssText = 'margin:14px 6px 8px; font-weight:800; font-size:14px; color:var(--ink-soft,#6b6b6b);';
            return h;
        };

        const renderLevelCard = (lv, idx) => {
            const lessons = sortLessonsForChild(lv.lessons || []);
            const doneInLevel = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const isCompleted = lessons.length > 0 && doneInLevel === lessons.length;

            const card = document.createElement('button');
            card.className = `level-card ${isCompleted ? 'done' : ''}`;
            card.style.setProperty('--dcolor', d.color);

            card.innerHTML = `
                <div class="level-num" style="background:color-mix(in srgb, ${isCompleted ? 'var(--ok)' : d.color} 72%, #000)">${toFa(idx + 1)}</div>
                <div class="level-info">
                    <div class="level-name">${lv.title}</div>
                    <div class="level-label">${lv.ageBand || ((lv.lessons || [])[0] && (lv.lessons || [])[0].ageBand) || 'مسیر آموزشی'}</div>
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
        };

        if (myAge && secondary.length) scrollContainer.appendChild(makeHeading('برای تو'));
        primary.forEach((lv, idx) => renderLevelCard(lv, idx));

        if (secondary.length) {
            const toggle = document.createElement('button');
            toggle.className = 'level-more-toggle';
            toggle.style.cssText = 'width:100%; margin:14px 0 4px; padding:12px; min-height:44px; border:0; border-radius:14px; background:#EFE6DC; color:var(--ink,#2d3436); font-family:inherit; font-weight:800; font-size:14px; cursor:pointer;';
            toggle.textContent = `مرحله‌های دیگر (${toFa(secondary.length)})`;
            const laterWrap = document.createElement('div');
            laterWrap.style.display = 'none';
            secondary.forEach((lv, idx) => {
                const before = scrollContainer.childNodes.length;
                renderLevelCard(lv, primary.length + idx);
                // move the freshly appended card into the collapsed group
                while (scrollContainer.childNodes.length > before) laterWrap.appendChild(scrollContainer.childNodes[before]);
            });
            toggle.addEventListener('click', () => {
                AudioEngine.play('click');
                const open = laterWrap.style.display !== 'none';
                laterWrap.style.display = open ? 'none' : 'block';
                toggle.textContent = open ? `مرحله‌های دیگر (${toFa(secondary.length)})` : 'بستن';
            });
            scrollContainer.appendChild(toggle);
            scrollContainer.appendChild(laterWrap);
        }

        content.appendChild(scrollContainer);

        $('#btn-back-domain').onclick = () => {
            AudioEngine.play('click');
            Nav.back();
            renderHome();
        };
    }

    // ===== LEVEL LESSONS SCREEN =====
    const SKILL_LABELS = {
        recognition: 'شناخت و انتخاب',
        'phonemic-awareness': 'آگاهی از صداها',
        rhyming: 'هم‌قافیه‌ها',
        syllables: 'بخش‌کردن کلمه',
        blending: 'ترکیب صداها',
        'word-building': 'کلمه‌سازی',
        tracing: 'ردگیری با انگشت',
        'sentence-building': 'جمله‌سازی',
        comprehension: 'درک مطلب',
        vocabulary: 'واژه‌آموزی',
        counting: 'شمارش',
        addition: 'جمع',
        subtraction: 'تفریق',
        shapes: 'اشکال هندسی',
        patterns: 'الگوها',
        comparison: 'مقایسه',
        time: 'ساعت و زمان',
        matching: 'جفت‌یابی',
        categorization: 'دسته‌بندی',
        sequencing: 'ترتیب و توالی',
        'odd-one-out': 'عضو متفاوت',
        'animal-sounds': 'صدای حیوانات',
        seasons: 'فصل‌ها',
        emotions: 'شناخت احساسات',
        etiquette: 'آداب مهربانی',
        drawing: 'نقاشی خلاق',
        coloring: 'رنگ‌آمیزی'
    };

    function lessonGuide(type) {
        return (window.LESSON_GUIDE && window.LESSON_GUIDE[type]) || window.LESSON_GUIDE_DEFAULT || { label: 'بازی آموزشی', objective: '', parentTip: '', minutes: 6 };
    }

    function skillLabel(type) {
        return lessonGuide(type).label || SKILL_LABELS[type] || 'بازی آموزشی';
    }

    function renderLevel() {
        const dom = (state.curriculum && state.curriculum.domains || []).find(x => x.id === state.domainId);
        const level = dom && (dom.levels || []).find(l => l.id === state.levelId);
        $('#level-title').textContent = level ? level.title : 'درس‌ها';

        const content = $('#level-content');
        content.innerHTML = '';
        if (!level) {
            const empty = document.createElement('p');
            empty.textContent = 'این سطح در محتوای فعلی پیدا نشد.';
            empty.style.cssText = 'padding:20px; text-align:center; color:var(--ink2); font-weight:800;';
            content.appendChild(empty);
            return;
        }

        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:10px; touch-action:pan-y; overscroll-behavior-y:contain;';

        (level.lessons || []).forEach((lesson, i) => {
            const prog = state.lessonsDone[lesson.id];
            const isDone = prog && prog.done;

            const card = document.createElement('button');
            card.className = `lesson-card ${isDone ? 'done' : ''}`;

            card.innerHTML = `
                <div class="lstate">${isDone ? 'تکمیل' : toFa(i + 1)}</div>
                <div class="lesson-card-main">
                    <div class="ltitle"></div>
                    <div class="lesson-meta"><span class="lesson-skill"></span><span>۵ فعالیت</span></div>
                </div>
                <span class="lesson-open-mark" aria-hidden="true">‹</span>
            `;
            const guide = lessonGuide(lesson.type);
            card.setAttribute('aria-label', `${lesson.title}؛ ${guide.objective}`);
            card.querySelector('.ltitle').textContent = lesson.title;
            card.querySelector('.lesson-skill').textContent = skillLabel(lesson.type);
            card.querySelector('.lesson-meta span:last-child').textContent = `${toFa(guide.minutes)} دقیقه`;

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
        if (!lesson || !lesson.id) return;
        const childAge = window.Engagement ? window.Engagement.getProfile().age : null;
        const adaptiveDifficulty = window.Adaptive ? window.Adaptive.getDifficulty(state.domainId || 'general') : null;
        const rounds = Generator.generate(lesson.id, { ...lesson, domain: state.domainId, childAge, adaptiveDifficulty }) || [];
        const body = $('#lesson-body');
        if (!body) return;
        const fill = $('#lesson-progress-fill');
        const ptext = $('#lesson-progress-text');
        const starsEl = $('#lesson-star-num');

        let roundIdx = 0;
        let starCount = 0;
        let lessonFinished = false;
        let roundSettled = false;

        $('#btn-exit-lesson').onclick = () => {
            AudioEngine.stopSpeak();
            Nav.back();
        };

        function updateProgress() {
            const pct = rounds.length ? Math.round((100 * roundIdx) / rounds.length) : 100;
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
            if (!round) {
                finishLesson();
                return;
            }
            roundSettled = false;
            const renderer = rendererFor(round.type);

            if (!renderer) {
                roundIdx++;
                nextRound();
                return;
            }

            body.innerHTML = '';
            // Auto-play bundled Persian narration. Per-letter clips take priority so
            // the child hears the exact letter being taught in this round; otherwise
            // fall back to the lesson-level intro clip on the first round.
            if (AudioEngine.playClip) {
                // Only rounds that INTRODUCE a letter auto-play its narration. The
                // follow-up picture/tracing rounds keep the clip on their speaker
                // button so the same intro is not repeated two or three times.
                if (round.audioClip && round.audioAutoPlay !== false) AudioEngine.playClip(round.audioClip);
                else if (roundIdx === 0 && !round.audioClip && AudioEngine.hasClip(`lesson-${lesson.id}`)) {
                    AudioEngine.playClip(`lesson-${lesson.id}`);
                }
            }
            if (roundIdx === 0 && round.lessonStory) {
                const context = document.createElement('div');
                context.className = 'lesson-context-strip';
                context.innerHTML = '<span class="lesson-context-kicker">ماموریت امروز</span><strong class="lesson-context-story"></strong><small class="lesson-context-objective"></small>';
                context.querySelector('.lesson-context-story').textContent = round.lessonStory;
                context.querySelector('.lesson-context-objective').textContent = round.lessonObjective || '';
                body.appendChild(context);
            }
            const activityHost = document.createElement('div');
            activityHost.className = 'activity-round-host';
            body.appendChild(activityHost);
            if (window.LivingWorld) LivingWorld.resetHintTimer('.game-tap-choice-btn, .shadow-opt-btn, .raven-opt-btn, .simon-bell, .disp-opt-btn', round.hintDelay);
            renderer.render(activityHost, round, {
                onCorrect: () => {
                    if (roundSettled || lessonFinished) return;
                    roundSettled = true;
                    starCount = Math.min(3, starCount + 1);
                    updateProgress();
                    AudioEngine.play('star');
                    showMascotMood('celebrating', pickMsg(window.MESSAGES.correct));
                    Adaptive.record(state.domainId || 'reading', true);
                    IQAssessment.recordTrial(state.domainId || round.type, true);
                    if (window.Engagement) window.Engagement.recordSuccess(lesson.id);
                    roundIdx++;
                    setTimeout(() => nextRound(), 800);
                },
                onWrong: () => {
                    if (roundSettled || lessonFinished) return;
                    AudioEngine.play('wrong');
                    showMascotMood('thinking', pickMsg(window.MESSAGES.wrong));
                    Adaptive.record(state.domainId || 'reading', false);
                    IQAssessment.recordTrial(state.domainId || round.type, false);
                    if (window.Engagement) window.Engagement.recordMistake(lesson.id, round.skillType || round.type);
                }
            });
        }

        function finishLesson() {
            if (lessonFinished) return;
            lessonFinished = true;
            if (window.LivingWorld) LivingWorld.clearHint();
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
            if (window.Engagement) window.Engagement.recordLesson(lesson.id);
            updateHeaderStars();

            // Result Celebration Overlay
            const overlay = document.createElement('div');
            overlay.className = 'result-fullscreen-overlay';

            overlay.innerHTML = `
                <div class="result-celebrate-card">
                    <div style="margin: 0 auto 6px;">${Mascot.svg(84, 'celebrating')}</div>
                    <h2 style="font-size:22px; font-weight:900; margin-bottom:2px;">آفرین قهرمان باهوش من!</h2>
                    <p style="font-size:14px; font-weight:700; color:var(--ink2); margin-bottom:12px;">${pickMsg(window.MESSAGES.win)}</p>
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
                // Continue the mixed ladder if the big play button started one.
                if (Array.isArray(state.mixedQueue) && state.mixedQueue.length) {
                    const next = state.mixedQueue.shift();
                    state.domainId = next.domain;
                    state.lessonId = next.id;
                    startLesson(next);
                    return;
                }
                Nav.reset('home');
                renderHome();
            });

            overlay.querySelector('#btn-home-result').addEventListener('click', () => {
                overlay.remove();
                AudioEngine.play('click');
                state.mixedQueue = [];
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
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px; touch-action:pan-y; overscroll-behavior-y:contain;';

        const games = ArcadeGames.list();
        games.forEach(g => {
            const card = document.createElement('button');
            card.className = 'arcade-game-card';
            card.style.setProperty('--gcolor', g.color);
            const gameStats = window.GameProgress ? window.GameProgress.getStats(g.id) : { bestScore: 0, plays: 0 };
            card.innerHTML = `
                <div class="arcade-game-icon" style="background:${g.color}">${g.iconHtml}</div>
                <div class="arcade-game-title">${g.title}</div>
                <div class="arcade-game-desc">${g.subtitle}</div>
                <div class="arcade-game-record">${gameStats.plays ? `رکورد: ${toFa(gameStats.bestScore)}` : 'هنوز امتحان نکردی'}</div>
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

    function ageStart(ageBand) {
        // Bands are written with PERSIAN digits («۵ تا ۶ سال»), which /\d/ never
        // matched, so every level scored 99 and age ordering/filtering was inert.
        const norm = String(ageBand || '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
        const m = norm.match(/(\d+)\s*تا\s*(\d+)/);
        return m ? Number(m[1]) : 99;
    }

    // Progression rule: age first, then the curriculum's internal progression rank,
    // then the lesson's own order. Difficulty is never shown to the child.
    function sortLevelsForChild(levels) {
        return [...(levels || [])].sort((a, b) => {
            const aa = ageStart(a.ageBand || (a.lessons || [])[0]?.ageBand);
            const ba = ageStart(b.ageBand || (b.lessons || [])[0]?.ageBand);
            return aa - ba || (a.difficulty || 999) - (b.difficulty || 999) || (a.progressionOrder || 999) - (b.progressionOrder || 999);
        });
    }

    function sortLessonsForChild(lessons) {
        return [...(lessons || [])].sort((a, b) =>
            ageStart(a.ageBand) - ageStart(b.ageBand) ||
            (a.difficulty || 999) - (b.difficulty || 999) ||
            (a.order || 999) - (b.order || 999)
        );
    }

    function lessonsOfDomain(domainId) {
        const dom = (state.curriculum.domains || []).find(d => d.id === domainId);
        if (!dom) return [];
        const out = [];
        sortLevelsForChild(dom.levels).forEach(lv => {
            sortLessonsForChild(lv.lessons).forEach(l => {
                out.push({ ...l, levelTitle: lv.title, levelId: lv.id });
            });
        });
        return out;
    }

    function levelsOfDomain(domainId) {
        const dom = (state.curriculum.domains || []).find(d => d.id === domainId);
        return dom ? sortLevelsForChild(dom.levels) : [];
    }

    // ===== REWARDS & MASCOT CUSTOMIZER =====
    function renderRewards() {
        const content = $('#rewards-content');
        content.innerHTML = '';

        const scrollContainer = document.createElement('div');
        scrollContainer.style.cssText = 'flex:1; overflow-y:auto; padding:12px; touch-action:pan-y; overscroll-behavior-y:contain;';

        // 0. Painting gallery — the child's saved artwork, shown large.
        let gallery = [];
        try { gallery = JSON.parse(localStorage.getItem('ph_gallery') || '[]'); } catch (e) { gallery = []; }
        if (gallery.length) {
            const galleryCard = document.createElement('section');
            galleryCard.className = 'gallery-card';
            galleryCard.innerHTML = `<div class="gallery-head"><h2>گالری نقاشی‌های من</h2><strong>${toFa(gallery.length)}</strong></div><div class="gallery-grid"></div>`;
            const grid = galleryCard.querySelector('.gallery-grid');
            gallery.forEach((item, index) => {
                const fig = document.createElement('button');
                fig.type = 'button';
                fig.className = 'gallery-item';
                fig.setAttribute('aria-label', `نقاشی شمارهٔ ${toFa(index + 1)}`);
                const im = document.createElement('img');
                im.src = item.img;
                im.alt = '';
                fig.appendChild(im);
                fig.addEventListener('click', () => {
                    AudioEngine.play('click');
                    const viewer = document.createElement('div');
                    viewer.className = 'gallery-viewer';
                    viewer.innerHTML = `<div class="gallery-viewer-inner"><img src="${item.img}" alt=""><button class="big-action-btn" id="gallery-close">بستن</button></div>`;
                    viewer.addEventListener('click', ev => { if (ev.target === viewer) viewer.remove(); });
                    viewer.querySelector('#gallery-close').addEventListener('click', () => viewer.remove());
                    document.body.appendChild(viewer);
                });
                grid.appendChild(fig);
            });
            scrollContainer.appendChild(galleryCard);
        }

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

        // Badges must reflect what the child actually did. Previously every badge
        // keyed off totalStars alone, so "استاد الفبا و کلمات" unlocked at 15 stars
        // even if the child had never opened a reading lesson — a fake award.
        const doneByDomain = {};
        ((state.curriculum && state.curriculum.domains) || []).forEach(domain => {
            const lessons = (domain.levels || []).flatMap(level => level.lessons || []);
            doneByDomain[domain.id] = {
                done: lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length,
                total: lessons.length
            };
        });
        const dDone = id => (doneByDomain[id] && doneByDomain[id].done) || 0;
        const streakNow = window.Engagement ? window.Engagement.getStreak() : { current: 0, best: 0 };
        const totalDone = Object.values(doneByDomain).reduce((a, x) => a + x.done, 0);

        const achievements = [
            { id: 'first', name: 'اولین ستاره درخشان', need: 'اولین ستاره را بگیر', cond: state.totalStars >= 1 },
            { id: 'ten', name: '۱۰ ستاره طلایی', need: '۱۰ ستاره جمع کن', cond: state.totalStars >= 10 },
            { id: 'fifty', name: '۵۰ ستاره قهرمانی', need: '۵۰ ستاره جمع کن', cond: state.totalStars >= 50 },
            { id: 'hundred', name: '۱۰۰ ستاره جادویی', need: '۱۰۰ ستاره جمع کن', cond: state.totalStars >= 100 },
            { id: 'reader', name: 'استاد الفبا و کلمات', need: '۵ درس خواندن را تمام کن', cond: dDone('reading') >= 5 },
            { id: 'reader-pro', name: 'قهرمان خواندن', need: '۱۵ درس خواندن را تمام کن', cond: dDone('reading') >= 15 },
            { id: 'mathematician', name: 'نابغه ریاضی', need: '۵ درس ریاضی را تمام کن', cond: dDone('math') >= 5 },
            { id: 'math-pro', name: 'استاد اعداد', need: '۱۵ درس ریاضی را تمام کن', cond: dDone('math') >= 15 },
            { id: 'thinker', name: 'کارآگاه منطق', need: '۵ درس منطق را تمام کن', cond: dDone('logic') >= 5 },
            { id: 'scientist', name: 'دانشمند کوچک', need: '۵ درس علوم را تمام کن', cond: dDone('science') >= 5 },
            { id: 'kind', name: 'دل مهربان', need: '۵ درس مهارت اجتماعی را تمام کن', cond: dDone('socio-emotional') >= 5 },
            { id: 'artist', name: 'هنرمند خلاق', need: '۵ درس هنر را تمام کن', cond: dDone('art') >= 5 },
            { id: 'streak3', name: '۳ روز پیوسته', need: '۳ روز پشت سر هم تمرین کن', cond: (streakNow.best || 0) >= 3 },
            { id: 'streak7', name: 'هفتهٔ کامل', need: '۷ روز پشت سر هم تمرین کن', cond: (streakNow.best || 0) >= 7 },
            { id: 'explorer', name: 'کاشف شش حوزه', need: 'از هر شش حوزه حداقل یک درس', cond: Object.keys(doneByDomain).length > 0 && Object.values(doneByDomain).every(x => x.done >= 1) },
            { id: 'marathon', name: 'ماجراجوی بزرگ', need: '۵۰ درس را تمام کن', cond: totalDone >= 50 }
        ];

        achievements.forEach(a => {
            const el = document.createElement('div');
            el.className = `achievement ${a.cond ? '' : 'locked'}`;
            el.innerHTML = `
                <div class="a-name">${a.name}</div>
                <span style="font-size:12px; color:${a.cond ? 'var(--ok)' : 'var(--ink-light)'}; font-weight:800; margin-top:4px; display:block;">
                    ${a.cond ? 'کسب شده' : a.need}
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
        if (!/^\d{4}$/.test(String(storedPin || ''))) {
            renderMathGate(content);
        } else {
            renderPinEntry(content, String(storedPin));
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
        let unlocked = false;
        const keys = Array.from({ length: 13 }, (_, index) => index + 1);
        keys.forEach(k => {
            const btn = document.createElement('button');
            btn.className = 'pin-key';
            btn.textContent = toFa(k);
            btn.addEventListener('click', () => {
                if (unlocked) return;
                if (k === correctSum) {
                    unlocked = true;
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
        let unlocking = false;
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
                        if (unlocking) return;
                        if (buffer === String(correctPin)) {
                            unlocking = true;
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
                            if (buffer.length === 4 && buffer === String(correctPin) && !unlocking) {
                                unlocking = true;
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

    function renderPinSetup(content) {
        let firstPin = '';
        let buffer = '';
        let confirming = false;
        content.innerHTML = '';

        function renderPad() {
            content.innerHTML = `
                <div class="pin-wrap">
                    <h3 style="font-size:18px; font-weight:900; margin-bottom:6px;">${confirming ? 'تکرار رمز والدین' : 'انتخاب رمز والدین'}</h3>
                    <p style="color:var(--ink2); font-size:13px; margin-bottom:12px;">یک رمز چهار رقمی انتخاب کنید:</p>
                    <div class="pin-dots" id="pin-dots"></div>
                    <div class="pin-pad" id="pin-pad"></div>
                    <button class="btn-secondary-action" id="cancel-pin-setup">انصراف</button>
                </div>
            `;

            const dotsEl = content.querySelector('#pin-dots');
            const pad = content.querySelector('#pin-pad');
            const updateDots = () => {
                dotsEl.innerHTML = '';
                for (let i = 0; i < 4; i++) {
                    const dot = document.createElement('div');
                    dot.className = `pin-dot ${i < buffer.length ? 'filled' : ''}`;
                    dotsEl.appendChild(dot);
                }
            };

            const rows = [[1,2,3],[4,5,6],[7,8,9],['del',0,'ok']];
            rows.forEach(row => row.forEach(key => {
                const button = document.createElement('button');
                button.className = 'pin-key';
                button.textContent = key === 'del' ? '⌫' : key === 'ok' ? 'تایید' : toFa(key);
                button.addEventListener('click', () => {
                    AudioEngine.play(key === 'ok' ? 'click' : 'pop');
                    if (key === 'del') {
                        buffer = buffer.slice(0, -1);
                        updateDots();
                        return;
                    }
                    if (key === 'ok') {
                        if (buffer.length !== 4) {
                            AudioEngine.play('wrong');
                            return;
                        }
                        if (!confirming) {
                            firstPin = buffer;
                            buffer = '';
                            confirming = true;
                            renderPad();
                        } else if (buffer === firstPin) {
                            Storage.save(PARENT_PIN_KEY, firstPin).then(() => renderDashboard(content));
                        } else {
                            AudioEngine.play('wrong');
                            buffer = '';
                            confirming = false;
                            firstPin = '';
                            renderPad();
                        }
                        return;
                    }
                    if (buffer.length < 4) {
                        buffer += String(key);
                        updateDots();
                    }
                });
                pad.appendChild(button);
            }));

            content.querySelector('#cancel-pin-setup').addEventListener('click', () => renderDashboard(content));
            updateDots();
        }

        renderPad();
    }

    function exportParentReport(iqReport) {
        const report = {
            app: window.App.name,
            exportedAt: new Date().toISOString(),
            profile: window.Engagement ? window.Engagement.getProfile() : {},
            today: window.Engagement ? window.Engagement.getToday() : null,
            streak: window.Engagement ? window.Engagement.getStreak() : null,
            history: window.Engagement ? window.Engagement.getHistory() : [],
            cognitiveReport: iqReport,
            progress: {
                totalStars: state.totalStars || 0,
                lessonsDone: state.lessonsDone
            }
        };
        try {
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'گزارش-پرورش-هوش-کودک.json';
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) {
            AudioEngine.speak('دانلود گزارش در این دستگاه در دسترس نیست');
        }
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
                    <div class="milestone-iq-label">شاخص رشد بازی‌محور</div>
                </div>
                <div style="text-align:left; max-width:45%;">
                    <div style="font-size:14px; font-weight:900;">${iqReport.estimatedMentalAge}</div>
                    <div style="font-size:11px; opacity:0.9;">تفسیر آموزشی</div>
                </div>
            </div>
            <div class="milestone-headline">${iqReport.headline}</div>
            <div class="milestone-disclaimer">${iqReport.disclaimer}</div>
        `;
        scrollBody.appendChild(milestoneCard);

        const todayEngagement = window.Engagement ? window.Engagement.getToday() : { completed: 0, goal: 3, percent: 0 };
        const streakEngagement = window.Engagement ? window.Engagement.getStreak() : { current: 0, best: 0 };
        const childProfile = window.Engagement ? window.Engagement.getProfile() : { name: '', age: null };
        const reviewQueue = window.Engagement ? window.Engagement.getReviewQueue() : [];
        const history = window.Engagement ? window.Engagement.getHistory() : [];
        const historyByDate = new Map(history.map(item => [item.date, item.completed]));
        const dayBars = Array.from({ length: 7 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const value = Math.min(100, Math.round(((historyByDate.get(key) || 0) / todayEngagement.goal) * 100));
            return `<span class="engagement-day-bar"><i style="height:${Math.max(8, value)}%;"></i></span>`;
        }).join('');
        const engagementCard = document.createElement('div');
        engagementCard.className = 'parent-card engagement-parent-card';
        engagementCard.innerHTML = `
            <div class="engagement-parent-head">
                <div><h3>روال تمرین کودک</h3><p>${childProfile.name || 'قهرمان کوچولو'} · هدف امروز ${toFa(todayEngagement.goal)} فعالیت</p></div>
                <strong>${toFa(streakEngagement.current)} روز</strong>
            </div>
            <div class="engagement-parent-progress"><i style="width:${todayEngagement.percent}%;"></i></div>
            <div class="engagement-parent-meta"><span>امروز: ${toFa(todayEngagement.completed)} از ${toFa(todayEngagement.goal)}</span><span>مرور پیشنهادی: ${toFa(reviewQueue.length)}</span><span>بهترین زنجیره: ${toFa(streakEngagement.best)} روز</span></div>
            <div class="engagement-week-label">فعالیت هفت روز اخیر</div>
            <div class="engagement-week-bars">${dayBars}</div>
        `;
        scrollBody.appendChild(engagementCard);

        // 2. Radar Chart
        const radarCard = document.createElement('div');
        radarCard.className = 'parent-radar-container';
        radarCard.innerHTML = `
            <h3 style="font-size:16px; font-weight:900; margin-bottom:4px;">نمودار مهارت‌های بازی‌محور</h3>
            <p style="font-size:12px; color:var(--ink2); margin-bottom:10px;">نمایش روند تمرین در شش حوزه، نه تشخیص تخصصی</p>
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

        // 3b. Per-domain curriculum progress — parents asked "where is my child actually at?"
        const progressCard = document.createElement('div');
        progressCard.className = 'parent-card';
        const pDomains = (state.curriculum && state.curriculum.domains) || [];
        const domainRows = pDomains.map(domain => {
            const lessons = (domain.levels || []).flatMap(level => level.lessons || []);
            const total = lessons.length;
            const done = lessons.filter(l => state.lessonsDone[l.id] && state.lessonsDone[l.id].done).length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const meta = (window.App.domains || []).find(d => d.id === domain.id) || {};
            return { title: domain.title || meta.title || domain.id, color: meta.color || '#6C5CE7', done, total, pct };
        });
        const grandTotal = domainRows.reduce((a, r) => a + r.total, 0);
        const grandDone = domainRows.reduce((a, r) => a + r.done, 0);
        const grandPct = grandTotal ? Math.round((grandDone / grandTotal) * 100) : 0;
        progressCard.innerHTML = `
            <h3>پیشرفت در برنامهٔ درسی</h3>
            <p class="parent-card-sub">${toFa(grandDone)} درس از ${toFa(grandTotal)} درس انجام شده — ${toFa(grandPct)}٪ کل مسیر</p>
            <div class="domain-progress-list">
                ${domainRows.map(r => `
                    <div class="domain-progress-row">
                        <div class="domain-progress-head">
                            <span class="domain-progress-name">${r.title}</span>
                            <span class="domain-progress-count">${toFa(r.done)} / ${toFa(r.total)}</span>
                        </div>
                        <div class="domain-progress-track">
                            <div class="domain-progress-fill" style="width:${r.pct}%; background:${r.color};"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        scrollBody.appendChild(progressCard);

        // 4. Data Privacy
        // Dedicated, prominent child-profile card so raising the age is easy to find
        // (it used to be buried inside "data management" at the bottom).
        const profileCard = document.createElement('div');
        profileCard.className = 'parent-card profile-age-card';
        const curProfile = window.Engagement ? window.Engagement.getProfile() : { name: '', age: null };
        profileCard.innerHTML = `
            <h3>پروفایل کودک</h3>
            <p class="profile-age-current">نام: <strong>${curProfile.name || '—'}</strong> · سن فعلی: <strong>${curProfile.age ? toFa(curProfile.age) + ' سال' : '—'}</strong></p>
            <p class="profile-age-hint">با تغییر سن، سختی درس‌ها و تعداد گزینه‌ها متناسب می‌شود.</p>
            <div class="age-quick-grid" id="age-quick-grid"></div>
        `;
        const quickGrid = profileCard.querySelector('#age-quick-grid');
        [4, 5, 6, 7, 8].forEach(age => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'age-choice' + (Number(curProfile.age) === age ? ' selected' : '');
            b.textContent = `${toFa(age)} سال`;
            b.addEventListener('click', async () => {
                AudioEngine.play('click');
                if (window.Engagement) {
                    await window.Engagement.saveProfile({ name: curProfile.name || '', age });
                }
                renderDashboard(content);
            });
            quickGrid.appendChild(b);
        });
        scrollBody.appendChild(profileCard);

        const settingsCard = document.createElement('div');
        settingsCard.className = 'parent-card';
        settingsCard.innerHTML = `
            <h3>مدیریت داده‌ها</h3>
            <p style="font-size:12px; color:var(--ink2); margin-bottom:10px;">
                داده‌ها به صورت ۱۰۰٪ آفلاین روی حافظه دستگاه نگهداری می‌شوند.
            </p>
            <div class="parent-legal-links"><a href="privacy.html">حریم خصوصی</a><a href="terms.html">شرایط استفاده</a></div>
            <button class="btn-secondary-action" id="btn-change-profile" style="width:100%;">
                تغییر نام و گروه سنی کودک
            </button>
            <button class="btn-secondary-action" id="btn-change-pin" style="width:100%;">
                ${'تنظیم یا تغییر رمز والدین'}
            </button>
            <button class="btn-secondary-action" id="btn-export-report" style="width:100%;">
                دانلود گزارش آفلاین کودک
            </button>
            <div class="backup-warning">فایل پشتیبان شامل اطلاعات کودک است؛ آن را در جای امن نگه دارید.</div>
            <button class="btn-secondary-action" id="btn-create-backup" style="width:100%;">
                ساخت پشتیبان کامل
            </button>
            <button class="btn-secondary-action" id="btn-restore-backup" style="width:100%;">
                بازیابی پشتیبان
            </button>
            <input id="backup-file-input" type="file" accept="application/json,.json" hidden>
            <button class="btn-secondary-action" id="btn-reset-data" style="background:#FFEAEA; color:#C1121F; width:100%;">
                پاک کردن تمام داده‌ها و شروع مجدد
            </button>
        `;

        settingsCard.querySelector('#btn-change-profile').addEventListener('click', () => {
            AudioEngine.play('click');
            showProfileOnboarding();
        });

        settingsCard.querySelector('#btn-change-pin').addEventListener('click', () => {
            AudioEngine.play('click');
            renderPinSetup(content);
        });

        settingsCard.querySelector('#btn-export-report').addEventListener('click', () => {
            AudioEngine.play('click');
            exportParentReport(iqReport);
        });

        settingsCard.querySelector('#btn-create-backup').addEventListener('click', async () => {
            AudioEngine.play('click');
            try {
                const payload = await window.BackupRestore.create();
                window.BackupRestore.download(payload);
            } catch (error) {
                AudioEngine.speak('ساخت پشتیبان انجام نشد');
            }
        });

        const backupInput = settingsCard.querySelector('#backup-file-input');
        settingsCard.querySelector('#btn-restore-backup').addEventListener('click', () => {
            AudioEngine.play('click');
            backupInput.click();
        });
        backupInput.addEventListener('change', async () => {
            const file = backupInput.files && backupInput.files[0];
            if (!file) return;
            try {
                const payload = JSON.parse(await file.text());
                window.BackupRestore.validate(payload);
                const proceed = await showDialog({
                    title: 'بازیابی پشتیبان',
                    message: 'اطلاعات فعلی با این پشتیبان جایگزین می‌شود. ادامه می‌دهید؟',
                    okLabel: 'بله، بازیابی کن',
                    cancelLabel: 'انصراف',
                    tone: 'danger'
                });
                if (!proceed) return;
                await window.BackupRestore.restore(payload);
                window.location.reload();
            } catch (error) {
                showDialog({
                    title: 'بازیابی انجام نشد',
                    message: error && error.message ? error.message : 'فایل پشتیبان معتبر نیست یا خوانده نشد.',
                    okLabel: 'باشه'
                });
            } finally {
                backupInput.value = '';
            }
        });

        settingsCard.querySelector('#btn-reset-data').addEventListener('click', async () => {
            const proceed = await showDialog({
                title: 'پاک کردن همهٔ داده‌ها',
                message: 'همهٔ پیشرفت، ستاره‌ها و تنظیمات پاک می‌شود و برنامه از نو شروع می‌شود. مطمئنی؟',
                okLabel: 'بله، پاک کن',
                cancelLabel: 'انصراف',
                tone: 'danger'
            });
            if (proceed) {
                await Storage.clearAll();
                Adaptive.reset();
                if (IQAssessment.reset) IQAssessment.reset();
                if (window.Engagement) await window.Engagement.reset();
                if (window.GameProgress) window.GameProgress.reset();
                state.lessonsDone = {};
                state.totalStars = 0;
                state.sfxMuted = false;
                state.musicMuted = false;
                AudioEngine.setSfxMuted(false);
                if (AudioEngine.setMusicMuted) AudioEngine.setMusicMuted(false);
                Mascot.setCharacter('dana');
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

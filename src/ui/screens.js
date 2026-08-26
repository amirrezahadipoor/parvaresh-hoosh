// صفحه‌ها — هر تابع یک صفحه را در ریشه رسم می‌کند.
// بدون فریم‌ورک، ولی با مرزهای روشن: هیچ صفحه‌ای به داخل صفحهٔ دیگر دست نمی‌زند.

import { DOMAINS, AGE_TRACKS, TRACK_ORDER, trackForAge, TARGET_AGE } from '../data/curriculum.js';
import { lessonsByDomain, LESSONS } from '../data/lessons/index.js';
import * as store from '../core/storage.js';
import {
  speak, sfx, setMuted, isMuted, hasClip, stop as stopAudio,
  setDomainVoice, resetStreak,
} from '../core/audio.js';
import { buildLesson, buildRound, toFa } from '../core/rounds.js';
import { nextStep, stepAfter, stepOf, SEQUENCE, isLocked, progress, milestoneOf } from '../core/journey.js';
import { masterySummary, isDue, MASTERY_SCORE } from '../core/mastery.js';
import { taskIcon, actionLabel } from '../core/task-icon.js';
import { shape as svgShape, geo as svgGeo, COLOR_HEX } from '../core/svg.js';
import {
  starIcon, soundOnIcon, soundOffIcon, gearIcon,
  lockIcon, checkIcon, reviewIcon, moonIcon, backIcon, domainIcon, trophyIcon,
} from '../core/ui-icons.js';
import { buddy, line as buddyLine } from '../core/buddy.js';
import { playMusic, stopMusic, TRACKS } from '../core/music.js';
import { sparkle } from '../core/sparkle.js';
import { gentleBuzz } from '../core/haptics.js';
import { GAMES, gameById } from '../data/games.js';

const el = (tag, props = {}, kids = []) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined) n.setAttribute(k, v);
  }
  for (const kid of [].concat(kids)) if (kid) n.append(kid);
  return n;
};

let root = null;
export function mount(node) {
  root = node;
  installTapSound(node);
}

/**
 * صدای لمس — یک شنونده برای کلِ برنامه.
 *
 * ── چرا سراسری و نه در هر دکمه ────────────────────────────────────
 * حدود بیست دکمهٔ ناوبری در برنامه هست: بازگشت، نقشهٔ سفر، بازی‌ها،
 * تنظیمات، «باز هم»، «خانه»… هیچ‌کدام بازخوردِ صوتی نداشتند. راهِ
 * آشکار این بود که در هر بیست جا یک `sfx.tap()` بنویسم — یعنی همان
 * تکراری که قانونِ ۶ منعش می‌کند، و تضمینِ اینکه دکمهٔ بیست‌ویکم
 * فراموش شود.
 *
 * یک شنوندهٔ واحد در مرحلهٔ *capture* روی ریشه، هر لمسِ دکمه را
 * می‌گیرد. دکمهٔ تازه خودبه‌خود صدا دارد.
 *
 * ⚠ چرا `pointerdown` و نه `click`: بازخورد باید در لحظهٔ *لمس*
 * بیاید نه در لحظهٔ رها کردن. تأخیرِ ۱۰۰ میلی‌ثانیه‌ای کافی است که
 * حس «دکمه جواب نداد» بدهد و کودک دوباره فشار دهد.
 *
 * ⚠ چرا گزینه‌های پاسخ مستثنا هستند: آن‌ها صدای *خودشان* را دارند
 * (`sfx.correct` یا `sfx.wrong`). اگر صدای لمس هم بدهند، دو صدا روی
 * هم می‌افتند و نتیجه گِل‌آلود می‌شود — نه «تِرِنگ» و نه «آفرین».
 */
function installTapSound(node) {
  node.addEventListener(
    'pointerdown',
    (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;
      // این‌ها صدای معنادارِ خودشان را دارند.
      if (btn.closest('.options, .order-slots, .order-tray, .memory-grid')) return;
      sfx.tap();
    },
    true,
  );
}

function render(screen) {
  stopAudio();
  root.replaceChildren(screen);
  window.scrollTo(0, 0);
  applyMusic(screen);
}

// ── آهنگِ هر صفحه ───────────────────────────────────────────────────────
//
// ⚠ یک نقطهٔ تصمیم، نه چهارده تا. هر صفحه فقط *اعلام* می‌کند چه حالی
// دارد (`data-music`) و `render` تصمیم می‌گیرد. اگر صفحه‌ای چیزی نگوید،
// پیش‌فرض «خاموش» است — یعنی هیچ صفحهٔ جدیدی نمی‌تواند سهواً وسط درس
// آهنگ پخش کند. ایمنی از جنسِ پیش‌فرض، نه از جنسِ یادآوری.
function applyMusic(screen) {
  const mood = screen.dataset ? screen.dataset.music : null;
  if (!mood || mood === 'off' || isMuted() || !store.getState().music) {
    stopMusic();
    return;
  }
  playMusic(mood);
}

function topbar(title, onBack) {
  const s = store.getState();
  return el('div', { class: 'topbar' }, [
    onBack
      ? el('button', { class: 'icon-btn', 'aria-label': 'بازگشت', onClick: onBack, html: backIcon() })
      : null,
    el('h1', { text: title }),
    el('div', { class: 'stars' }, [
      el('span', { class: 'star-ico', html: starIcon() }),
      el('span', { text: toFa(s.stars) }),
    ]),
  ]);
}

// ── خانه ────────────────────────────────────────────────────────────────
// یک تصمیم، نه سه تا. دکمهٔ بزرگ «بریم بازی» کودک را مستقیم به درس
// درست می‌برد؛ برنامه خودش می‌داند کجا مانده است. نقشهٔ سفر و تنظیمات
// در دسترس‌اند ولی سر راه نیستند.
export function homeScreen() {
  const s = store.getState();
  const greeting = s.childName ? `سلام ${s.childName}!` : 'پرورش هوش';
  const { step, mode } = nextStep();
  const d = DOMAINS.find((x) => x.id === step.domainId);
  const p = progress();

  const play = el(
    'button',
    {
      class: 'play-btn',
      style: `--c:${d.color}`,
      onClick: () => render(store.limitReached() ? timeUpScreen() : playScreen(step.lesson.id)),
    },
    [
      // ⚠ نشانِ حوزه، پیش از هر متنی.
      // کارتِ اصلیِ خانه ۲۵۰ پیکسل ارتفاع داشت و فقط سه خط *متن* بود.
      // برای کودکِ پنج‌ساله‌ای که خواندن بلد نیست، بزرگ‌ترین عنصرِ
      // صفحه یعنی «یک مستطیلِ نارنجی» — هیچ. حالا نشان می‌گوید امروز
      // چه چیزی در انتظار اوست، پیش از آنکه کسی چیزی بخواند.
      el('span', { class: 'play-ico', html: domainIcon(d.icon), 'aria-hidden': 'true' }),
      el('span', { class: 'play-kicker', text: mode === 'review' ? 'بیا مرور کنیم' : 'بریم بازی' }),
      el('span', { class: 'play-title', text: step.lesson.title }),
      el('span', { class: 'play-meta' }, [
        el('span', { text: d.title }),
        el('span', { class: 'sep', 'aria-hidden': 'true' }),
        el('span', { text: `${toFa(step.lesson.minutes)} دقیقه` }),
      ]),
    ],
  );

  // نوار پیشرفت سفر — کودک ببیند کجای راه است
  const bar = el('div', { class: 'journey-bar', 'aria-hidden': 'true' }, [
    el('div', { class: 'journey-fill', style: `width:${p.percent}%;--c:${d.color}` }),
  ]);

  return el('div', { class: 'screen home', 'data-music': 'calm' }, [
    el('div', { class: 'topbar' }, [
      el('h1', { text: greeting }),
      el('button', {
        class: 'icon-btn',
        'aria-label': isMuted() ? 'روشن‌کردن صدا' : 'خاموش‌کردن صدا',
        html: isMuted() ? soundOffIcon() : soundOnIcon(),
        onClick: (e) => {
          const m = setMuted(!isMuted());
          store.setMutedPref(m);
          // بلندگوی خاموش یعنی سکوتِ کامل — آهنگ هم زیرمجموعهٔ صداست.
          if (m) stopMusic();
          else if (store.getState().music) playMusic('calm');
          const btn = e.currentTarget;
          btn.innerHTML = m ? soundOffIcon() : soundOnIcon();
          btn.setAttribute('aria-label', m ? 'روشن‌کردن صدا' : 'خاموش‌کردن صدا');
        },
      }),
      el('button', {
        class: 'icon-btn',
        'aria-label': 'تنظیمات',
        html: gearIcon(),
        // اول دروازه: تنظیمات سن و پاک‌کردن پیشرفت کار والد است.
        onClick: () => render(parentGate(settingsScreen)),
      }),
    ]),
    el('div', { class: 'buddy-row' }, [
      el('span', { class: 'buddy wave', html: buddy('happy', d.color) }),
      el('span', { class: 'buddy-bubble', text: buddyLine('welcome') }),
    ]),
    play,
    el('div', { class: 'journey-row' }, [
      bar,
      el('span', { class: 'journey-label', text: `${toFa(p.done)} از ${toFa(p.total)} درس` }),
    ]),
    el('div', { class: 'stars' }, [
      el('span', { class: 'star-ico', html: starIcon() }),
      el('span', { text: `${toFa(s.stars)} ستاره` }),
    ]),
    // ⚠ دو دکمهٔ ثانویه، هم‌ردیف و هم‌وزن. بازی‌ها *در دسترس* است
    // ولی سرِ راه نیست: دکمهٔ بزرگِ بالا همچنان درسِ بعدی است، چون
    // مسیر یادگیری باید مسیر پیش‌فرض بماند (نقشهٔ راه ۷.۴).
    el('div', { class: 'home-actions' }, [
      el('button', { class: 'btn ghost', text: 'نقشهٔ سفر', onClick: () => render(mapScreen()) }),
      el('button', { class: 'btn ghost', text: 'بازی‌ها', onClick: () => render(gamesScreen()) }),
    ]),
  ]);
}

// ── نقشهٔ سفر ────────────────────────────────────────────────────────────
// همهٔ درس‌ها یک‌جا، به ترتیب مسیر. جایگزین منوی دوطبقهٔ قبلی:
// اینجا برای مرور و دیدن کل راه است، نه مانعی سر راه بازی.
function mapScreen() {
  const p = progress();

  // ── صحنهٔ نقشه (§۷.۱۶ آیتم ۳) ─────────────────────────────────
  // یک راهِ پیوسته در گودیِ سمتِ راست (جایی که نقطه‌های درس می‌نشینند)
  // + شش نشانِ رنگی در آغازِ هر حوزه. ⚠ یک `path` پس‌زمینه، نه ۳۰۷
  // گرافِ تازه — این SVG کلِ راه را با یک مسیر می‌کشد.
  const firsts = DOMAINS.map((d) => ({
    d,
    i: SEQUENCE.findIndex((st) => st.domainId === d.id),
  })).filter((x) => x.i >= 0);
  const scene = el(
    'svg',
    {
      class: 'map-scene',
      viewBox: '0 0 34 307',
      preserveAspectRatio: 'none',
      'aria-hidden': 'true',
      focusable: 'false',
    },
    [
      el('path', {
        // پیچ‌وخمِ ملایم — کلم «راهِ سفر» را می‌گوید، نه «فهرست».
        d: 'M17 0 C 9 34, 25 68, 17 102 C 9 136, 25 170, 17 204 C 9 238, 25 272, 17 307',
        fill: 'none',
        stroke: '#D8CFC0',
        'stroke-width': '3',
        'stroke-linecap': 'round',
      }),
      ...firsts.map(({ d, i }) =>
        el('circle', {
          cx: '17',
          cy: String(i + 0.5),
          r: '3.6',
          fill: d.color,
          stroke: '#FBF6EF',
          'stroke-width': '1.4',
        }),
      ),
    ],
  );

  const cards = SEQUENCE.map((st) => {
    const d = DOMAINS.find((x) => x.id === st.domainId);
    const pr = store.lessonProgress(st.lesson.id);
    const locked = isLocked(st.lesson.id);
    const due = isDue(st.lesson.id);
    // نشانِ وضعیت درس: قفل، مرور، انجام‌شده، یا شمارهٔ قدم.
    const markHtml = locked ? lockIcon() : due ? reviewIcon() : pr.completions ? checkIcon() : null;
    return el(
      'button',
      {
        class: `map-item${pr.completions ? ' done' : ''}${locked ? ' locked' : ''}${due ? ' due' : ''}`,
        style: `--c:${d.color}`,
        disabled: locked ? '' : null,
        'aria-label': locked ? `${st.lesson.title} — هنوز باز نشده` : st.lesson.title,
        onClick: locked ? null : () => render(playScreen(st.lesson.id)),
      },
      [
        markHtml
          ? el('div', { class: 'map-dot', html: markHtml })
          : el('div', { class: 'map-dot', text: toFa(st.order + 1) }),
        el('div', { class: 'map-body' }, [
          el('strong', { text: st.lesson.title }),
          el('span', { class: 'map-meta' }, [
            // ⚠ نشانِ کوچکِ حوزه کنارِ نامش. در فهرستی به طولِ ۳۰۷
            // سطر، متنِ «خواندن و نوشتن» و «تماشا و شناخت» در یک
            // نگاه از هم جدا نمی‌شوند؛ شکل می‌شود. رنگِ حوزه هم
            // هست، ولی قانونِ دسترس‌پذیریِ برنامه می‌گوید هرگز فقط
            // با رنگ پیام نده — این نشان همان لایهٔ دومِ لازم است.
            el('span', { class: 'map-dom-ico', html: domainIcon(d.icon), 'aria-hidden': 'true' }),
            el('span', { text: d.title }),
            el('span', { class: 'sep', 'aria-hidden': 'true' }),
            el('span', {
              text: pr.completions ? `بهترین: ${toFa(pr.bestScore)}٪` : `${toFa(st.lesson.minutes)} دقیقه`,
            }),
          ]),
        ]),
      ],
    );
  });

  return el('div', { class: 'screen', 'data-music': 'calm' }, [
    topbar('نقشهٔ سفر', () => render(homeScreen())),
    el('div', { class: 'map-summary', text: `${toFa(p.done)} از ${toFa(p.total)} درس انجام شده` }),
    el('div', { class: 'map-list' }, [scene, ...cards]),
  ]);
}

// ── بازی ────────────────────────────────────────────────────────────────
function playScreen(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const state = store.getState();
  const track = trackForAge(state.age);
  const rounds = buildLesson(lesson, track);
  const dom = DOMAINS.find((x) => x.id === lesson.domain) || DOMAINS[0];

  // «یک رنگ = یک معنی» در صدا هم صادق است: هر حوزه رنگِ صوتیِ
  // خودش را دارد. و زنجیرهٔ نُت‌ها با هر درس از نو شروع می‌شود،
  // وگرنه درسِ دوم از وسطِ ملودی آغاز می‌شد.
  setDomainVoice(lesson.domain);
  resetStreak();

  let idx = 0;
  let correct = 0;
  // ⚠ زنجیرهٔ دیداری (§۷.۱۶ آیتم ۱) — همتایِ دیداریِ ملودیِ
  // بالارونده. سه نشان، هر پاسخِ درست یکی را روشن می‌کند، خطا
  // همه را خاموش. تا سه — بیش از سه معنیِ «یک جشنِ طولانی» می‌دهد
  // و چیزی یاد نمی‌دهد.
  let streak = 0;
  const wrap = el('div', { class: 'screen' });

  const startedAt = Date.now();
  const finish = () => {
    const spent = Math.min(30, (Date.now() - startedAt) / 60000);
    store.addPlayTime(Math.round(spent * 10) / 10);
    store.recordLesson(lessonId, { correct, total: rounds.length });
    sfx.win();
    render(doneScreen(lesson, correct, rounds.length));
  };

  const next = () => {
    idx++;
    if (idx >= rounds.length) finish();
    else draw();
  };

  function draw() {
    const r = rounds[idx];
    const bar = el('div', { class: 'progress' }, [
      el('i', { style: `width:${((idx) / rounds.length) * 100}%` }),
    ]);
    const feedback = el('div', { class: 'feedback' });

    // ── سربرگِ درس: هوشیِ کوچک + زنجیرهٔ دیداری + شمارهٔ تمرین ──
    // ⚠ ملودیِ بالارونده (§۷.۳) فقط صدا داشت؛ در حالتِ بی‌صدا هیچ
    // نشانه‌ای از «رشتهٔ درست‌ها» نبود. این سه نقطه همان زنجیره‌اند
    // به زبانِ چشم. روشن‌شدن فقط در *لحظهٔ گذار* (بعد از پاسخ) است —
    // حینِ پرسش هیچ حرکتی نیست (قانونِ ۱ §۷.۱۶).
    const head = el('div', { class: 'lesson-head' }, [
      el('span', { class: 'buddy mini', html: buddy('neutral', dom.color), 'aria-hidden': 'true' }),
      el('span', { class: 'streak', 'aria-hidden': 'true' }, [
        el('i', { class: 'streak-dot' }),
        el('i', { class: 'streak-dot' }),
        el('i', { class: 'streak-dot' }),
      ]),
      el('span', { class: 'muted', text: `تمرین ${toFa(idx + 1)} از ${toFa(rounds.length)}` }),
    ]);

    // به‌روزرسانیِ زنجیره — فقط در لحظه‌های گذار.
    const light = (ok) => {
      streak = ok ? Math.min(3, streak + 1) : 0;
      const dots = head.querySelectorAll('.streak-dot');
      dots.forEach((d, i) => d.classList.toggle('on', i < streak));
      // هوشی با زنجیره حال می‌گیرد: سه درستِ پیاپی = شاد، خطا = خنثی.
      // هر دو در گذار رخ می‌دهند؛ حینِ پرسش دست نمی‌خورد.
      const b = head.querySelector('.buddy');
      if (b && streak === 3) b.innerHTML = buddy('happy', dom.color);
      else if (b && streak === 0) b.innerHTML = buddy('neutral', dom.color);
    };

    const body =
      r.type === 'choice'
        ? choiceView(r, feedback, next, track, light)
        : r.type === 'trace'
          ? traceView(r, next, feedback, light)
          : r.type === 'order'
            ? orderView(r, feedback, next, () => { correct++; light(true); gentleBuzz(); }, light)
            : memoryView(r, feedback, next, () => { correct++; light(true); gentleBuzz(); }, light);

    wrap.replaceChildren(
      topbar(lesson.title, () => render(homeScreen())),
      bar,
      head,
      // ردیف پرسش: نشان تصویری + متن + دکمهٔ شنیدن.
      // کودکی که خواندن بلد نیست از روی نشان می‌فهمد باید چه کند،
      // و با تپ روی نشان پرسش را دوباره می‌شنود.
      el('div', { class: 'ask' }, [
        el('button', {
          // بلندگو فقط وقتی کلیپ واقعی وجود دارد — وعدهٔ دروغ به کودک
          // بدتر از نبودِ دکمه است. بیشتر گِردها صدا ندارند و باید
          // کاملاً بی‌صدا قابل انجام باشند.
          class: `task-ico${hasClip(r.speak) ? ' can-play' : ''}`,
          'aria-label': hasClip(r.speak)
            ? `شنیدن دوباره: ${actionLabel(r.kindName || '')}`
            : actionLabel(r.kindName || ''),
          html:
            taskIcon(r.kindName || '', dom.color) +
            // بلندگوی SVG، نه ایموجی: ایموجی روی هر دستگاه شکل و
            // اندازهٔ متفاوتی دارد و در اندروید بریده می‌شد.
            (hasClip(r.speak)
              ? `<span class="spk"><svg viewBox="0 0 24 24" aria-hidden="true">
                   <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor"/>
                   <path d="M15.5 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round"/>
                 </svg></span>`
              : ''),
          onClick: () => {
            if (hasClip(r.speak)) speak(r.speak);
          },
        }),
        el('p', { class: 'prompt', text: r.prompt }),
      ]),
      ...body,
      feedback,
    );

    if (r.speak) setTimeout(() => speak(r.speak), 220);
  }

  function choiceView(r, feedback, done, trk, onStreak = () => {}) {
    const stage = buildStage(r);

    const grid = el('div', { class: `options${r.options.length === 3 ? ' cols-3' : ''}` });
    let answered = false;

    r.options.forEach((o) => {
      const btn = optionButton(o);
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const right = o.value === r.answer;
        btn.classList.add(right ? 'correct' : 'wrong');
        [...grid.children].forEach((c) => (c.disabled = true));

        if (right) {
          correct++;
          sfx.correct();
          // جشنِ دیداری، برای وقتی که صدا خاموش است — و برای وقتی
          // که روشن است هم بهتر می‌شود.
          sparkle(btn);
          markOk(feedback, 'آفرین!');
          speak('آفرین!');
          // لرزشِ مهربان — فقط اینجا، فقط روی درست (§۷.۱۶ آیتم ۲).
          gentleBuzz();
          onStreak(true);
        } else {
          sfx.wrong();
          markRetry(feedback, r.because || 'اشکالی ندارد، دفعهٔ بعد!');
          speak('اشکالی ندارد، دوباره تلاش کن!');
          // پاسخ درست را نشان بده — کودک باید یاد بگیرد، نه فقط رد شود.
          [...grid.children].forEach((c, i) => {
            if (r.options[i].value === r.answer) c.classList.add('correct');
          });
          onStreak(false);
        }
        setTimeout(done, right ? 900 : 1900);
      });
      grid.append(btn);
    });

    // راهنمای خودکار بعد از مکث متناسب با سن
    setTimeout(() => {
      if (!answered) {
        const target = [...grid.children][r.options.findIndex((o) => o.value === r.answer)];
        if (target) target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 700, iterations: 2 });
      }
    }, trk.hintDelayMs);

    return [stage, grid].filter(Boolean);
  }


  // جای‌های پراکنده ولی بدون هم‌پوشانی، برای بازی شمردن.

  function traceView(r, done, feedback, onStreak = () => {}) {
    const canvas = el('canvas', { class: 'pad' });
    const wrapEl = el('div', { class: 'trace-wrap' }, [
      el('div', { class: 'trace-ghost', text: r.letter }),
      canvas,
    ]);
    let drawn = 0;
    let drawing = false;
    let advanced = false;

    requestAnimationFrame(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#E4572E';

      const pos = (e) => {
        const b = canvas.getBoundingClientRect();
        const t = e.touches?.[0] || e;
        return { x: t.clientX - b.left, y: t.clientY - b.top };
      };
      const start = (e) => {
        e.preventDefault();
        drawing = true;
        const p = pos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      };
      const move = (e) => {
        if (!drawing) return;
        e.preventDefault();
        const p = pos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        drawn++;
      };
      const end = () => {
        drawing = false;
        // کودکِ پیش‌خوان دکمهٔ «تمام شد» را نمی‌خواند. وقتی حرف را
        // کشید، خودش جلو می‌رود — دکمه فقط راه فرار برای کسی است
        // که زودتر خسته شد.
        if (!advanced && drawn > 24) {
          advanced = true;
          setTimeout(() => finishTrace(), 650);
        }
      };
      canvas.addEventListener('pointerdown', start);
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerup', end);
      canvas.addEventListener('pointerleave', end);
    });

    // اعلان تابع (نه const): بالا برده می‌شود، پس رویداد pointerup
    // که پیش از این خط اجرا می‌شود هم می‌تواند صدایش بزند.
    function finishTrace() {
      // خط کشیدن نمره‌دهی درست/غلط ندارد — تلاش کافی است.
      if (drawn > 8) {
        correct++;
        onStreak(true);
        gentleBuzz();
      }
      markOk(feedback);
      sfx.correct();
      setTimeout(done, 550);
    }

    const btns = el('div', { style: 'display:grid;gap:10px' }, [
      el('button', {
        class: 'btn',
        text: 'تمام شد',
        onClick: () => {
          if (advanced) return;
          advanced = true;
          finishTrace();
        },
      }),
      ...(hasClip(r.speak) ? [el('button', { class: 'btn ghost', text: 'شنیدن دوباره', onClick: () => speak(r.speak) })] : []),
    ]);
    return [wrapEl, btns];
  }



  draw();
  return wrap;
}

// ── بازخورد شکلی ────────────────────────────────────────────────────────
// کودک پیش‌خوان «آفرین!» را نمی‌خواند. تیک سبز و ضربدر نارنجی را
// در یک نگاه می‌فهمد. متن زیرش می‌ماند برای والد و کودک بزرگ‌تر،
// ولی پیام اصلی شکل است نه نوشته.
const OK_MARK = `<svg viewBox="0 0 48 48" aria-hidden="true">
  <circle cx="24" cy="24" r="21" fill="var(--ok)"/>
  <path d="M14 25l7 7 13-14" fill="none" stroke="#fff" stroke-width="5"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// نه ضربدرِ قرمزِ «باختی» — یک فلش چرخشی «دوباره». پژوهش می‌گوید
// بازخورد اصلاحی باید راهنما باشد نه تنبیه.
const RETRY_MARK = `<svg viewBox="0 0 48 48" aria-hidden="true">
  <circle cx="24" cy="24" r="21" fill="var(--life)"/>
  <path d="M33 20a11 11 0 1 0 2 8" fill="none" stroke="#fff" stroke-width="4.5"
    stroke-linecap="round"/>
  <path d="M33 12v9h-9" fill="none" stroke="#fff" stroke-width="4.5"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/**
 * دکمهٔ یک گزینه — با هر نشانهٔ دیداری که داشته باشد.
 *
 * ⚠ این تابع از دلِ choiceView بیرون کشیده شد تا بخش بازی‌ها هم
 * بتواند از آن استفاده کند. پیش از این داخل playScreen بسته بود و
 * تنها راهِ استفادهٔ دوباره‌اش، کپی کردنِ ۵۰ خط بود — یعنی همان
 * تکراری که قانون ۶ منعش می‌کند. هر کلید نشانهٔ تازه فقط اینجا
 * اضافه می‌شود و هر دو مسیر با هم به‌روز می‌شوند.
 */
// ⚠ chip و scatterSlots هم ماژولی شدند: buildStage بیرون از
// playScreen زندگی می‌کند و بدون اینها نمی‌توانست صحنهٔ «دنبالهٔ
// الگو» و «شمردن پراکنده» را بسازد. تا وقتی داخل playScreen بودند،
// بخش بازی‌ها به آن دو نوع نمایش دسترسی نداشت.
function chip(label, unit) {
  if (unit === 'color') {
    return el('div', { class: 'chip', style: `background:${COLOR_HEX[label] || '#999'}` });
  }
  return el('div', { class: 'chip plain', html: svgGeo(label, '#2D2A32') || label });
}

function scatterSlots(count) {
  const cols = count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const out = [];
  for (let i = 0; i < count; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    out.push({
      x: (cx + 0.5) * (100 / cols) - 9 + (Math.random() * 8 - 4),
      y: (cy + 0.5) * (100 / rows) - 9 + (Math.random() * 8 - 4),
      r: Math.random() * 24 - 12,
    });
  }
  return out;
}

/**
 * صحنهٔ بالای پرسش — هر بیست‌وچند نوع نمایش.
 *
 * ⚠ مثل optionButton، این هم از دلِ choiceView بیرون کشیده شد تا
 * بخش بازی‌ها بتواند همان صحنه‌ها را رسم کند بی‌آنکه کدی کپی شود.
 * `chip` و `scatterSlots` هم به همین دلیل ماژولی شدند.
 */
function buildStage(r) {
  const stage = r.display ? el('div', { class: 'stage' }) : null;
  if (stage) {
    if (r.display.kind === 'text') stage.textContent = r.display.value;
    // صداکشی: هر صدا جدا، با قوس پیوند زیرشان — همان حرکتی که
    // معلم با انگشت روی تخته می‌کشد. کودک باید صداها را به هم
    // بچسباند و واژه را بسازد.
    if (r.display.kind === 'sounds') {
      const row = el('div', { class: 'sounds' });
      r.display.parts.forEach((p, i) => {
        if (i) row.append(el('span', { class: 'snd-link', 'aria-hidden': 'true' }));
        row.append(
          el('span', { class: 'snd' }, [
            // آنچه نوشته می‌شود (مصوت کوتاه نوشته نمی‌شود → خالی)
            el('span', { class: 'snd-g', text: p.g || '·' }),
            // آنچه شنیده می‌شود
            el('span', { class: 'snd-s', text: p.s }),
          ]),
        );
      });
      // تعداد صدا به CSS می‌رود تا کارت‌ها کوچک شوند و واژه در
      // یک خط بماند. شکستن خط در RTL ترتیب خواندن را وارونه
      // می‌کرد — «ا ک ِ ش ر» به‌جای «ش ِ ک ا ر».
      row.dataset.n = String(r.display.parts.length);
      stage.append(row);
    }
    if (r.display.kind === 'repeat') {
      const row = el('div', { class: 'repeat' });
      for (let k = 0; k < r.display.times; k++) {
        row.append(el('span', { class: 'ico', html: svgShape(r.display.icon) || '' }));
      }
      stage.append(row);
    }
    if (r.display.kind === 'scatter') {
      // چیدمان پراکنده ولی بدون هم‌پوشانی: شبکهٔ نامنظمِ از پیش محاسبه‌شده.
      const box = el('div', { class: 'scatter' });
      const slots = scatterSlots(r.display.times);
      slots.forEach((p) => {
        box.append(
          el('span', {
            class: 'ico',
            style: `left:${p.x}%;top:${p.y}%;transform:rotate(${p.r}deg)`,
            html: svgShape(r.display.icon) || '',
          }),
        );
      });
      stage.append(box);
    }
    // حرف در کنار تصویرِ کلمه‌ای که با آن شروع می‌شود.
    // پیوند «نشانه ↔ معنا» برای کودکی که هنوز نمی‌خواند.
    if (r.display.kind === 'letter-pic') {
      stage.append(
        el('div', { class: 'letter-pic' }, [
          el('span', { class: 'lp-letter', text: r.display.letter }),
          el('span', { class: 'lp-ico ico', html: svgShape(r.display.icon) || '' }),
        ]),
      );
    }
    // چند شکل درهم — کودک باید عضوهای یک دسته را جدا کند
    if (r.display.kind === 'mixed') {
      const box = el('div', { class: 'mixed' });
      r.display.items.forEach((it, k) => {
        box.append(
          el('span', {
            class: 'ico',
            style: `animation-delay:${k * 55}ms`,
            html: svgShape(it) || '',
          }),
        );
      });
      stage.append(box);
    }
    // الگوی تاس — چیدمان آشنا که تشخیص فوری را ممکن می‌کند
    if (r.display.kind === 'dice') {
      const box = el('div', { class: `dice d${r.display.times}` });
      for (let k = 0; k < r.display.times; k++) {
        box.append(el('span', { class: 'pip', style: `animation-delay:${k * 50}ms` }));
      }
      stage.append(box);
    }
    // قاب ده‌تایی
    if (r.display.kind === 'ten-frame') {
      const frame = el('div', { class: 'ten-frame' });
      for (let k = 0; k < 10; k++) {
        frame.append(
          el('span', {
            class: `cell${k < r.display.filled ? ' on' : ''}`,
            style: `animation-delay:${k * 40}ms`,
          }),
        );
      }
      stage.append(frame);
    }
    // دسته‌های ده‌تایی — کودک *دسته* می‌شمارد، نه واحد. همین است
    // که شمارش ده‌تایی را ممکن می‌کند بی‌آنکه تا ۴۰ بشمارد.
    if (r.display.kind === 'ten-groups') {
      const box = el('div', { class: 'ten-groups' });
      for (let g = 0; g < r.display.groups; g++) {
        const frame = el('div', { class: 'ten-frame mini' });
        for (let k = 0; k < 10; k++) {
          frame.append(el('span', { class: 'cell on', style: `animation-delay:${(g * 10 + k) * 18}ms` }));
        }
        box.append(frame);
      }
      stage.append(box);
    }
    // تجزیهٔ عدد: کل بالا، بخش شناخته‌شده پایین
    if (r.display.kind === 'bond') {
      stage.append(
        el('div', { class: 'bond' }, [
          el('span', { class: 'bond-total', text: toFa(r.display.total) }),
          el('span', { class: 'bond-line', 'aria-hidden': 'true' }),
          el('span', { class: 'bond-parts' }, [
            el('span', { class: 'bond-part', text: toFa(r.display.part) }),
            el('span', { class: 'bond-part q', text: '؟' }),
          ]),
        ]),
      );
    }
    // متن لاتین در محیط راست‌به‌چپ: باید dir="ltr" صریح داشته باشد،
    // وگرنه نویسه‌های خنثی (خط تیره، فاصله) جابه‌جا می‌شوند.
    if (r.display.kind === 'latin') {
      stage.append(el('span', { class: 'latin-big', dir: 'ltr', lang: 'en', text: r.display.value }));
    }
    // فقط تصویر — بدون حرف، تا پاسخ لو نرود
    if (r.display.kind === 'pic-only') {
      stage.append(el('span', { class: 'lp-ico ico big-pic', html: svgShape(r.display.icon) || '' }));
    }
    // نقطه‌های شمردنی — پیوند «عدد ↔ مقدار»
    if (r.display.kind === 'dots') {
      const box = el('div', { class: 'dots' });
      for (let k = 0; k < r.display.times; k++) {
        box.append(el('span', { class: 'dot', style: `animation-delay:${k * 55}ms` }));
      }
      stage.append(box);
    }
    if (r.display.kind === 'shadow') {
      stage.append(el('div', { class: 'ico shadow', html: svgShape(r.display.value) || '' }));
    }
    // ── نمایش‌های ریاضیِ دور دوم ─────────────────────────────
    // ⚠ درس گرفته‌شده: کلیدی که این‌جا شاخه نداشته باشد بی‌سروصدا
    // نادیده گرفته می‌شود و صفحه خالی می‌ماند. هر kind تازه در
    // rounds.js باید این‌جا هم شاخه بگیرد.

    // چوب‌خط: دسته‌های ۵تایی، پنجمی مورب روی چهارتای قبل
    if (r.display.kind === 'tally') {
      const box = el('div', { class: 'tally' });
      const groups = Math.floor(r.display.times / 5);
      const rest = r.display.times % 5;
      for (let g = 0; g < groups; g++) {
        box.append(
          el('span', { class: 'tally-g full', style: `animation-delay:${g * 70}ms` }, [
            ...Array.from({ length: 4 }, () => el('i', { class: 'tick' })),
            el('i', { class: 'tick cross' }),
          ]),
        );
      }
      if (rest) {
        box.append(
          el('span', { class: 'tally-g', style: `animation-delay:${groups * 70}ms` },
            Array.from({ length: rest }, () => el('i', { class: 'tick' }))),
        );
      }
      stage.append(box);
    }

    // رشتهٔ عددی برای شمردن چندتایی: ۲ ۴ ۶ ؟
    if (r.display.kind === 'number-seq') {
      const seq = el('div', { class: 'num-seq' });
      r.display.items.forEach((v, i) =>
        seq.append(el('span', { class: 'num-chip', style: `animation-delay:${i * 80}ms`, text: v })),
      );
      seq.append(el('span', { class: 'num-chip q', text: '؟' }));
      stage.append(seq);
    }

    // ارزش مکانی: دسته‌های ده‌تایی کنار یکی‌ها
    if (r.display.kind === 'place-value') {
      const box = el('div', { class: 'pv' });
      const tens = el('div', { class: 'pv-tens' });
      for (let t = 0; t < r.display.tens; t++) {
        const rod = el('span', { class: 'pv-rod', style: `animation-delay:${t * 70}ms` });
        for (let k = 0; k < 10; k++) rod.append(el('i', { class: 'pv-bead' }));
        tens.append(rod);
      }
      box.append(tens);
      // ⚠ وقتی یکی‌ها صفرند، ظرفِ خالی با padding/gap باقی می‌ماند و
      // یک جعبهٔ نامرئی کنار دسته‌ها می‌سازد. اصلاً نسازش.
      if (r.display.ones > 0) {
        const ones = el('div', { class: 'pv-ones' });
        for (let o = 0; o < r.display.ones; o++) {
          ones.append(el('i', { class: 'pv-one', style: `animation-delay:${(r.display.tens + o) * 50}ms` }));
        }
        box.append(ones);
      }
      stage.append(box);
    }

    // محور اعداد: خانه‌های مساوی + فلشِ قدم‌ها.
    //
    // ⚠ کتاب هشدار می‌دهد «رسم محور با فاصلهٔ مساوی ممکن است زود
    // باشد» — پس خانه‌ها را درشت و شماره‌دار نگه می‌داریم و قدم را
    // با کمانِ دیدنی نشان می‌دهیم، نه با فلشِ نازکِ ریاضی‌وار.
    if (r.display.kind === 'number-line') {
      const d = r.display;
      const line = el('div', { class: 'nline' });
      for (let v = 0; v <= d.span; v++) {
        const isFrom = d.from === v;
        // مقصد فقط وقتی رنگی می‌شود که پرسش دربارهٔ آن نباشد.
        const isTo = !d.hideTo && d.steps != null && d.from + d.steps === v;
        const marked = Array.isArray(d.mark) && d.mark.includes(v);
        // خانه‌هایی که قدم روی‌شان می‌افتد، کمانِ پرش می‌گیرند —
        // کودک باید قدم‌ها را بشمارد، نه عددِ آخر را بخواند.
        const hop = d.steps != null && v > d.from && v <= d.from + d.steps;
        const tick = el('span', {
          class: `nl-tick${isFrom ? ' from' : ''}${isTo ? ' to' : ''}${marked ? ' mark' : ''}${hop ? ' hop' : ''}`,
          style: `animation-delay:${v * 40}ms`,
        });
        if (hop) tick.append(el('i', { class: 'nl-arc', 'aria-hidden': 'true' }));
        tick.append(el('i', { class: 'nl-dot' }));
        tick.append(el('b', { class: 'nl-num', text: toFa(v) }));
        line.append(tick);
      }
      stage.append(line);
    }

    // اندازه‌گیری با واحد غیراستاندارد: نوار کنار n واحدِ چیده‌شده.
    if (r.display.kind === 'measure') {
      const box = el('div', { class: 'measure' });
      box.append(el('span', { class: 'ms-bar', style: `--n:${r.display.len}` }));
      const row = el('div', { class: 'ms-units' });
      for (let i = 0; i < r.display.len; i++) {
        row.append(
          el('span', {
            class: 'ico ms-unit',
            style: `animation-delay:${i * 70}ms`,
            html: svgShape(r.display.unit) || '',
          }),
        );
      }
      box.append(row);
      stage.append(box);
    }

    // صفِ ترتیبی: اولی، دومی، سومی…
    //
    // ⚠ فارسی راست‌به‌چپ است و «اولی» باید سمت راست باشد. ترتیب
    // DOM را دست نمی‌زنیم و چیدمان را به جهتِ صفحه می‌سپاریم؛
    // row-reverse اینجا همان اشتباهی است که در .sounds کردیم.
    if (r.display.kind === 'queue') {
      const wrap = el('div', { class: 'queue-wrap' });
      const row = el('div', { class: 'queue' });
      // ⚠ بدون نشانهٔ شروع، «اولی» حدس است: کودک نمی‌داند از راست
      // بشمارد یا از چپ. پرچمِ شروع سمت راست (جهت خواندن فارسی)
      // می‌گذاریم تا صف مبدأ داشته باشد.
      row.append(el('span', { class: 'q-start', 'aria-hidden': 'true' }));
      r.display.items.forEach((name, i) => {
        const cell = el('span', { class: 'q-cell', style: `animation-delay:${i * 80}ms` });
        cell.append(el('span', { class: 'ico q-pic', html: svgShape(name) || '' }));
        row.append(cell);
      });
      wrap.append(row);
      wrap.append(el('span', { class: 'q-hint', text: 'شروع صف' }));
      stage.append(wrap);
    }

    // شکل هندسی بزرگ با گوشه‌های برجسته
    if (r.display.kind === 'geo-big') {
      stage.append(el('span', { class: 'ico big-pic', html: svgGeo(r.display.name, '#2E86AB') || '' }));
    }

    // تقارن: فقط *نیمهٔ* شکل کنار خط آینه.
    //
    // ⚠ نسخهٔ اول شکل کامل و بازتابش را کنار هم می‌گذاشت — یعنی
    // پاسخ را مستقیم نشان می‌داد و کودک فقط شکلِ دیده‌شده را
    // می‌زد. هیچ تقارنی آموخته نمی‌شد. حالا نیمه را می‌بیند و
    // باید در ذهن کاملش کند.
    if (r.display.kind === 'mirror') {
      stage.append(
        el('div', { class: 'mirror' }, [
          el('span', { class: 'ico mr-half', html: svgGeo(r.display.name, '#2E86AB') || '' }),
          el('span', { class: 'mr-line', 'aria-hidden': 'true' }),
        ]),
      );
    }

    // جمع با جای خالی: ۵ + ؟ = ۷ به‌صورت دیدنی
    if (r.display.kind === 'missing') {
      const box = el('div', { class: 'missing' });
      // هر دو گروه نقطهٔ هم‌اندازه دارند: اگر یکی درشت و دیگری
      // ریز باشد، کودک اندازه را با تعداد اشتباه می‌گیرد.
      const known = el('span', { class: 'ms-group' });
      for (let k = 0; k < r.display.part; k++) known.append(el('i', { class: 'dot sm' }));
      box.append(known, el('span', { class: 'ms-plus', text: '+' }), el('span', { class: 'ms-q', text: '؟' }));
      box.append(el('span', { class: 'ms-eq', text: '=' }));
      const goal = el('span', { class: 'ms-group goal' });
      for (let k = 0; k < r.display.total; k++) goal.append(el('i', { class: 'dot sm' }));
      box.append(goal);
      stage.append(box);
    }

    if (r.display.kind === 'sequence') {
      const seq = el('div', { class: 'seq' });
      r.display.items.forEach((it) => seq.append(chip(it, r.display.unit)));
      seq.append(el('div', { class: 'chip q', text: '؟' }));
      stage.append(seq);
    }
  }
  return stage;
}

function optionButton(o) {
  const btn = el('button', { class: `opt${o.big ? ' big' : ''}` });
    if (o.spot) {
      // صحنهٔ کوچک: یک کادر و شکلی که در آن جای مشخصی نشسته.
      // ⚠ گزینه‌های «بالا/پایین/وسط» اگر فقط واژه بودند، کودک
      // پیش‌خوان نمی‌توانست حل کند. پس خودِ جای‌گیری نشان داده
      // می‌شود و برچسب برای والد زیرش می‌ماند.
      btn.append(
        el('span', { class: `spot spot-${o.spot.where}` }, [
          el('span', { class: 'ico', html: svgShape(o.spot.icon) || '' }),
        ]),
        el('span', { class: 'pic-label', text: o.label }),
      );
    } else if (o.pic) {
      btn.append(el('span', { class: 'ico lg', html: svgShape(o.pic) || '' }));
      // در درس انگلیسی، واژه زیر تصویر می‌آید تا شکل و واژه با هم دیده شوند.
      if (o.latinLabel) {
        btn.append(el('span', { class: 'pic-label', dir: 'ltr', lang: 'en', text: o.label }));
      } else if (o.picLabel) {
        // در مهارت زندگی، نامِ احساس خودش درسِ اصلی است: کودک باید
        // یاد بگیرد به این حس بگوید «غمگین». تصویر تنها، واژه را
        // یاد نمی‌دهد. برای والد هم روشن می‌کند برنامه چه می‌آموزد.
        btn.append(el('span', { class: 'pic-label', text: o.label }));
      }
    } else if (o.geo) {
      btn.append(el('span', { class: 'ico lg', html: svgGeo(o.geo.name, o.geo.color) || '' }));
      // در گِردِ دو معیاره، شکل تنها کافی نیست: کودک باید ببیند
      // گزینه «قلب قرمز» است نه فقط یک قلب. برچسب هر دو شرط را
      // می‌گوید و انتخاب را از حدس جدا می‌کند.
      if (o.geoLabel) {
        btn.append(el('span', { class: 'pic-label', text: o.label }));
      }
    } else if (o.shapeRepeat) {
      const g = el('span', { class: 'grp' });
      for (let k = 0; k < o.shapeRepeat.times; k++) {
        g.append(el('span', { class: 'ico sm', html: svgShape(o.shapeRepeat.icon) || '' }));
      }
      btn.append(g);
    } else if (o.latin) {
      // کلاس طول، تا واژهٔ بلند به‌جای شکستن، کوچک‌تر نوشته شود.
      const len = String(o.label).length;
      const sz = len >= 9 ? ' len-9' : len >= 7 ? ' len-7' : '';
      btn.append(el('span', { class: `latin-opt${sz}`, dir: 'ltr', lang: 'en', text: o.label }));
    } else if (o.dots) {
      // عدد + نقطه‌های متناظرش روی خودِ گزینه: کودک پیوند
      // «رقم ↔ مقدار» را می‌بیند بدون آنکه پاسخ لو برود.
      btn.append(el('span', { class: 'opt-num', text: o.label }));
      const dg = el('span', { class: 'opt-dots' });
      for (let k = 0; k < o.dots; k++) dg.append(el('i', { class: 'dot sm' }));
      btn.append(dg);
    } else if (o.swatch) {
      btn.append(el('div', { class: 'swatch', style: `background:${o.swatch}` }));
    } else {
      btn.append(document.createTextNode(o.label));
    }

  return btn;
}

function markOk(feedback, text) {
  if (!feedback) return;
  feedback.className = 'feedback ok';
  feedback.replaceChildren(
    el('span', { class: 'fb-mark', html: OK_MARK }),
    ...(text ? [el('span', { class: 'fb-text', text })] : []),
  );
}

function markRetry(feedback, text) {
  if (!feedback) return;
  feedback.className = 'feedback no';
  feedback.replaceChildren(
    el('span', { class: 'fb-mark', html: RETRY_MARK }),
    ...(text ? [el('span', { class: 'fb-text', text })] : []),
  );
}

// ⚠ orderView و memoryView هم از playScreen بیرون آمدند تا بخش
// بازی‌ها بتواند «حافظهٔ بزرگ» را اجرا کند. هر دو به شمارندهٔ
// `correct` درس وابسته بودند؛ حالا به‌جای دست‌بردن در متغیرِ
// بیرونی، یک callback به نام onWin می‌گیرند. درس شمارنده‌اش را
// بالا می‌برد و بازی امتیازش را — بدون آنکه هیچ‌کدام از دیگری خبر
// داشته باشد.
function orderView(r, feedback, done, onWin = () => {}, onStreak = () => {}) {
  const chosen = [];
  // ⚠ چیدنِ *جمله* با چیدنِ حرف فرق دارد: «گربه ماهی خورد» در یک
  // کارتِ ۶۸px جا نمی‌شود و در عرض ۳۲۰px به سه سطر می‌شکند، و کنار
  // هم نشستنِ دو جملهٔ چندسطری در RTL ترتیب خواندن را وارونه
  // نشان می‌دهد. پس هر جمله یک سطر کامل می‌گیرد.
  // معیار: بلندترین آیتم بیش از ۶ نویسه = جمله، نه حرف/بخش.
  const longItems = r.items.some((it) => String(it.label).length > 6);
  const mod = longItems ? ' stacked' : '';
  const slots = el('div', { class: `order-slots${mod}` });
  const tray = el('div', { class: `order-tray${mod}` });

  // ⚠ تا امروز گِردهای چیدنی هیچ صحنه‌ای نداشتند و همین محدودشان
  // می‌کرد: «حرف‌ها را بچین تا کلمه بسازی» بدون تصویر بی‌معناست —
  // کودک نمی‌داند کدام کلمه را باید بسازد. صحنه فقط تصویر می‌شود،
  // نه متن: اگر واژه نوشته شود کودک فقط کپی می‌کند و املا نمی‌آموزد
  // (همان دام «نشتی پاسخ» که در syllable-build گرفته شد).
  const stage =
    r.display && r.display.kind === 'pic-only'
      ? el('div', { class: 'stage' }, [
          el('span', { class: 'lp-ico ico big-pic', html: svgShape(r.display.icon) || '' }),
        ])
      : null;

  // چیدن گِردهای مهارت زندگی («نه، برو، بگو») تصویری است، نه متنی:
  // کودک پیش‌خوان باید ترتیب را از روی تصویر بچیند. پس اگر آیتم
  // تصویر داشت، تصویر بالا و برچسب زیرش می‌آید؛ وگرنه مثل قبل
  // فقط متن. برچسب هرگز حذف نمی‌شود — والد باید بتواند بخواند.
  const fill = (node, it) => {
    if (it.pic && svgShape(it.pic)) {
      node.append(
        el('span', { class: 'ico ord-ico', html: svgShape(it.pic) }),
        el('span', { class: 'ord-label', text: it.label }),
      );
    } else {
      node.append(document.createTextNode(it.label));
    }
    return node;
  };

  const refresh = () => {
    slots.replaceChildren(
      ...(chosen.length
        ? chosen.map((c) =>
            fill(
              el('div', {
                class: `order-item${c.pic ? ' has-pic' : ''}`,
                style: `transform:scale(${c.scale})`,
              }),
              c,
            ),
          )
        : [el('span', { class: 'muted', text: 'به ترتیب لمس کن' })]),
    );
  };
  refresh();

  r.items.forEach((it) => {
    const b = fill(
      el('button', {
        class: `order-item${it.pic ? ' has-pic' : ''}`,
        style: `transform:scale(${it.scale})`,
      }),
      it,
    );
    b.addEventListener('click', () => {
      if (b.classList.contains('picked')) return;
      b.classList.add('picked');
      chosen.push(it);
      sfx.tap();
      refresh();
      if (chosen.length === r.items.length) {
        // ⚠ باگ جدی: مقایسه با `value` (که شاخصِ جایگاه است) وقتی دو
        // آیتم برچسب یکسان دارند پاسخِ درست را غلط می‌شمارد.
        // «انار» = ا ن ا ر — کودک اگر «ا»ی دوم را اول بگذارد،
        // واژه‌ای که روی صفحه می‌سازد دقیقاً «انار» است ولی برنامه
        // می‌گوید اشتباه. همین برای «بابا» (با + با) هم رخ می‌داد.
        //
        // معیار درست همان چیزی است که کودک *می‌بیند*: رشتهٔ
        // برچسب‌ها. جایگاهِ داخلی برای او وجود ندارد.
        const want = r.answer.map((v) => r.items.find((x) => x.value === v)?.label);
        const ok = chosen.every((c, i) => c.label === want[i]);
        if (ok) {
          onWin();
          sfx.correct();
          // جرقه روی خودِ ردیفِ چیده‌شده — همان چیزی که کودک ساخت.
          sparkle(slots, 16);
          markOk(feedback, 'آفرین! درست چیدی.');
          speak('آفرین!');
        } else {
          sfx.wrong();
          markRetry(feedback, 'ترتیب درست نبود — دوباره نگاه کن.');
          // زنجیرهٔ دیداری هم باید بداند رشته پاره شد.
          onStreak(false);
        }
        setTimeout(done, ok ? 1000 : 1800);
      }
    });
    tray.append(b);
  });

  return stage ? [stage, slots, tray] : [slots, tray];
}

/**
 * تعدادِ ستونِ جدولِ حافظه.
 *
 * ⚠ نسخهٔ اول از `auto-fit` استفاده می‌کرد و برای ۶ و ۱۰ کارت چیدمانِ
 * ناهموار می‌ساخت: چهار کارت در ردیفِ اول و دو تا در ردیفِ دوم، با یک
 * فضای خالیِ بزرگ کنارشان. کودک آن فضای خالی را «جای یک کارتِ گمشده»
 * می‌بیند. `auto-fit` وقتی خوب است که تعدادِ آیتم نامعلوم باشد؛ اینجا
 * دقیقاً چهار حالت داریم (۶، ۸، ۱۰، ۱۲) پس چیدمان باید صریح باشد.
 *
 * هدف: ردیف‌های مساوی. ۶→۳×۲، ۸→۴×۲، ۱۰→۵×۲، ۱۲→۴×۳.
 */
function memoryCols(n) {
  if (n % 4 === 0 && n > 8) return 4; // ۱۲ → ۴×۳
  if (n % 2 === 0) return n / 2; // ۶→۳، ۸→۴، ۱۰→۵
  return 3;
}

function memoryView(r, feedback, done, onWin = () => {}) {
  const grid = el('div', {
    class: 'memory-grid',
    style: `--cols:${memoryCols(r.cards.length)}`,
  });
  let first = null;
  let lock = false;
  let found = 0;

  r.cards.forEach((c) => {
    // ⚠ باگ جدی: پیش از این کارت با `text: c.icon` ساخته می‌شد و
    // c.icon نامِ شکل است، نه تصویرش. یعنی کودکِ پیش‌خوان بازی
    // حافظه را با واژه‌های «سیب» و «ماهی» می‌دید — بازی‌ای که
    // اصلاً نمی‌توانست انجام دهد. قانون الزامی برنامه این است که
    // هر گِرد بدون خواندن حل شود.
    //
    // برچسب متنی زیر تصویر می‌ماند (قانون: هر گزینه برچسب دارد)
    // ولی تصویر است که بازی را ممکن می‌کند.
    const b = el('button', { class: 'card' }, [
      el('span', { class: 'ico card-ico', html: svgShape(c.icon) || '' }),
      el('span', { class: 'card-label', text: c.icon }),
    ]);
    b.dataset.icon = c.icon;
    b.addEventListener('click', () => {
      if (lock || b.classList.contains('up') || b.classList.contains('matched')) return;
      b.classList.add('up');
      sfx.tap();
      if (!first) {
        first = b;
        return;
      }
      if (first.dataset.icon === b.dataset.icon) {
        // جشنِ کوچک روی *هر دو* کارت، نه فقط دومی: کودک جفت را
        // پیدا کرده، نه یک کارت را.
        sparkle(first, 6);
        sparkle(b, 6);
        first.classList.add('matched');
        b.classList.add('matched');
        first = null;
        found++;
        sfx.correct();
        if (found === r.pairs) {
          correct++;
          markOk(feedback, 'همه را پیدا کردی!');
          speak('آفرین! عالی بود.');
          setTimeout(done, 1100);
        }
      } else {
        lock = true;
        const a = first;
        first = null;
        setTimeout(() => {
          a.classList.remove('up');
          b.classList.remove('up');
          lock = false;
        }, 800);
      }
    });
    grid.append(b);
  });

  return [grid];
}

// ── بخش بازی‌ها ─────────────────────────────────────────────────────────
//
// جدا از مسیر درس، و عمداً پشتِ یک دکمه در خانه — نه بخشِ اول صفحه.
// مسیر یادگیری باید مسیر پیش‌فرض بماند (نقشهٔ راه، ۷.۴).
//
// ⚠ هیچ محتوای تازه‌ای اینجا ساخته نمی‌شود: همان buildRound موتور
// درس‌ها را صدا می‌زنیم و فقط قالبِ دور را عوض می‌کنیم. یعنی هر
// گِردی که به برنامه اضافه شود خودبه‌خود بازی‌ها را غنی‌تر می‌کند.

/**
 * صحنهٔ کوچکِ هر کارتِ بازی (§۷.۱۶ آیتم ۸).
 * کارت‌ها «آیکون + متن» بودند؛ حالا هرکدام یک صحنه دارند: خورشید و
 * تپهٔ مشترک + نشانِ هویتیِ همان بازی (جاده، برج، کتاب، ستاره…).
 * ⚠ تزئینی است: aria-hidden، بی‌تعامل و بی‌حرکت.
 */
function gameScene(g) {
  const hill = `<path d="M0 60 Q 55 28 115 46 T 200 42 L200 60 Z" fill="#E9EFDA"/>`;
  const sun = `<circle cx="176" cy="13" r="9" fill="#F6E3B4"/>`;
  let glyph = '';
  switch (g.id) {
    case 'speed':
      glyph = `<path d="M14 46 Q 60 26 105 38 T 190 34" fill="none" stroke="#C8461F" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>`;
      break;
    case 'tower':
      glyph = `<rect x="88" y="26" width="24" height="9" rx="2" fill="#256E8C" opacity=".45"/>
               <rect x="82" y="15" width="36" height="9" rx="2" fill="#256E8C" opacity=".7"/>
               <rect x="90" y="4" width="20" height="9" rx="2" fill="#256E8C"/>`;
      break;
    case 'wordmatch':
      glyph = `<path d="M58 32 v-18 a9 9 0 0 1 9-9 h66 a9 9 0 0 1 9 9 v18" fill="none" stroke="#2F7C3E" stroke-width="2.8" opacity=".6"/>
               <path d="M66 28 h58" stroke="#2F7C3E" stroke-width="2.8" opacity=".6"/>`;
      break;
    case 'memory':
      glyph = `<path d="M38 42 l4.4-8.8 8.6-1.3-6.2-6 1.5-8.6-8.3 4.4-8.3-4.4 1.5 8.6-6.2 6 8.6 1.3z" fill="#7B4B94" opacity=".7"/>`;
      break;
    case 'count':
      glyph = `<circle cx="58" cy="34" r="4.6" fill="#E08A1E" opacity=".45"/>
               <circle cx="100" cy="34" r="4.6" fill="#E08A1E" opacity=".72"/>
               <circle cx="142" cy="34" r="4.6" fill="#E08A1E"/>`;
      break;
    case 'nature':
      glyph = `<path d="M100 42 v-18 M88 42 a12 12 0 0 1 24 0" fill="none" stroke="#2F7C3E" stroke-width="3.4" stroke-linecap="round" opacity=".65"/>`;
      break;
    case 'pattern':
      glyph = `<rect x="66" y="28" width="13" height="13" rx="2.5" fill="#00897B" opacity=".5"/>
               <rect x="92" y="28" width="13" height="13" rx="2.5" fill="#F4B942"/>
               <rect x="118" y="28" width="13" height="13" rx="2.5" fill="#00897B" opacity=".8"/>
               <rect x="144" y="28" width="13" height="13" rx="2.5" fill="#F4B942" opacity=".7"/>`;
      break;
  }
  return `<svg viewBox="0 0 200 60" aria-hidden="true" focusable="false">${sun}${hill}${glyph}</svg>`;
}

/** فهرست بازی‌ها. */
function gamesScreen() {
  const cards = GAMES.map((g) =>
    el(
      'button',
      {
        class: 'game-card',
        style: `--c:${g.color}`,
        onClick: () => render(store.limitReached() ? timeUpScreen() : gameScreen(g.id)),
      },
      [
        el('span', { class: 'game-scene', 'aria-hidden': 'true', html: gameScene(g) }),
        el('span', { class: 'game-ico ico', html: svgShape(g.icon) || '' }),
        el('span', { class: 'game-body' }, [
          el('strong', { text: g.title }),
          el('span', { class: 'game-tag', text: g.tagline }),
        ]),
        el('span', {
          class: 'game-best',
          text: store.gameBest(g.id) ? `${toFa(store.gameBest(g.id))}` : '—',
        }),
      ],
    ),
  );

  // ⚠ بخشِ بازی تنها جایی است که آهنگِ تند مجاز است: اینجا کودک
  // نمی‌خواند و نمی‌شمارد، پس رقابتِ کانالِ توجه پیش نمی‌آید.
  return el('div', { class: 'screen', 'data-music': 'lively' }, [
    topbar('بازی‌ها', () => render(homeScreen())),
    el('p', { class: 'muted center', text: 'اینجا درسی نیست — فقط بازی.' }),
    el('div', { class: 'game-list' }, cards),
  ]);
}

/**
 * موتور مشترک هر سه حالت بازی.
 *
 * حالت‌ها:
 *  timed  — ثانیه‌شمار، پاسخ غلط وقت کم می‌کند
 *  lives  — سه جان، پاسخ غلط یک جان می‌گیرد
 *  levels — مرحله‌ای، هر مرحله سخت‌تر (فعلاً فقط حافظه)
 */
function gameScreen(gameId) {
  const g = gameById(gameId);
  const state = store.getState();
  const track = trackForAge(state.age);

  let score = 0;
  let lives = g.lives ?? 0;
  let level = 0;
  let left = g.seconds ?? 0;
  let over = false;
  let timer = null;

  // بازیِ زمان‌دار برخلافِ درس از برانگیختگی سود می‌برد: پژوهشِ
  // «موسیقیِ تند = شاد» از سنِ ۴ سالگی برقرار است و اینجا هدف
  // تمرکزِ طولانی نیست، سرعت است. پس آهنگِ تند مجاز است.
  const wrap = el('div', { class: 'screen game-play', style: `--c:${g.color}`, 'data-music': 'lively' });
  const startedAt = Date.now();

  // استخر گِردهای این بازی: از همهٔ درس‌ها، هر گِردی که نوعش در
  // فهرست بازی باشد. ⚠ یکتاسازی بر پایهٔ JSON لازم است چون یک نوع
  // در ده‌ها درس تکرار شده و بدون آن استخر پر از تکرار می‌شود.
  const seen = new Set();
  const pool = [];
  for (const lesson of LESSONS) {
    for (const rd of lesson.rounds) {
      if (!g.kinds.includes(rd.kind)) continue;
      const key = JSON.stringify(rd);
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push(rd);
    }
  }

  const stopTimer = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const finish = () => {
    if (over) return;
    over = true;
    stopTimer();
    const spent = Math.min(30, (Date.now() - startedAt) / 60000);
    store.addPlayTime(Math.round(spent * 10) / 10);
    const isRecord = store.recordGame(g.id, score);
    sfx.win();
    render(gameOverScreen(g, score, isRecord));
  };

  /** ساخت یک گِرد تازه از استخر — با تلاش مجدد اگر داده کم بود. */
  const nextRound = () => {
    for (let attempt = 0; attempt < 12; attempt++) {
      const rd = pool[Math.floor(Math.random() * pool.length)];
      try {
        const built = buildRound(rd, track);
        if (built) return built;
      } catch {
        /* این گِرد الان دادهٔ کافی ندارد — یکی دیگر */
      }
    }
    return null;
  };

  const draw = () => {
    if (over) return;
    const r = g.mode === 'levels' ? levelRound() : nextRound();
    if (!r) {
      finish();
      return;
    }

    const feedback = el('div', { class: 'feedback' });
    const onDone = (wasRight) => {
      if (over) return;
      if (wasRight) {
        score += 1;
        sfx.point();
        if (g.mode === 'levels') level += 1;
      } else {
        sfx.wrong();
        if (g.mode === 'lives') {
          lives -= 1;
          if (lives <= 0) {
            finish();
            return;
          }
        } else if (g.mode === 'timed') {
          left = Math.max(0, left - (g.penaltySec ?? 5));
          if (left <= 0) {
            finish();
            return;
          }
        } else {
          finish();
          return;
        }
      }
      draw();
    };

    const body =
      r.type === 'choice'
        ? gameChoiceView(r, feedback, onDone, track)
        : r.type === 'order'
          ? orderView(r, feedback, () => onDone(true))
          : memoryView(r, feedback, () => onDone(true));

    wrap.replaceChildren(
      topbar(g.title, () => {
        stopTimer();
        over = true;
        render(gamesScreen());
      }),
      statusRow(),
      ...(r.display || r.type !== 'choice' ? [] : []),
      el('div', { class: 'ask' }, [
        el('span', { class: 'task-ico', html: taskIcon(r.action, g.color) }),
        el('p', { class: 'prompt', text: r.prompt }),
      ]),
      ...(Array.isArray(body) ? body : [body]),
      feedback,
    );
  };

  /** نوار وضعیت: امتیاز، و زمان یا جان. */
  function statusRow() {
    // ⚠ دو عددِ برهنه کنار هم قابل تشخیص نبودند: در تصویر آزمایشی
    // «۴۷» ثانیه بود ولی مثل امتیاز به‌نظر می‌رسید، و امتیازِ صفر
    // فقط یک خطِ کوچک بود. حالا هرکدام نشانهٔ دیداری خودش را دارد —
    // ستاره برای امتیاز، ساعت برای زمان — که کودک پیش‌خوان هم
    // می‌فهمدشان.
    const bits = [
      el('span', { class: 'g-score' }, [
        el('span', { class: 'g-ico', html: starIcon() }),
        el('span', { class: 'g-num', text: `${toFa(score)}` }),
      ]),
    ];
    if (g.mode === 'timed') {
      bits.push(
        el('span', { class: `g-time${left <= 10 ? ' low' : ''}` }, [
          el('span', { class: 'g-ico', html: svgShape('ساعت') || '' }),
          el('span', { class: 'g-num', text: `${toFa(left)}` }),
        ]),
      );
    } else if (g.mode === 'lives') {
      // ⚠ جان‌ها با شکل نشان داده می‌شوند نه عدد: کودک پیش‌خوان
      // «۲ جان» را نمی‌خواند ولی دو قلب را می‌شمارد.
      const hearts = el('span', { class: 'g-lives' });
      for (let i = 0; i < (g.lives ?? 3); i++) {
        hearts.append(
          el('span', {
            class: `g-heart${i < lives ? '' : ' gone'}`,
            html: svgGeo('قلب', i < lives ? '#D14343' : '#E7DFD4') || '',
          }),
        );
      }
      bits.push(hearts);
    } else {
      bits.push(el('span', { class: 'g-level', text: `مرحلهٔ ${toFa(level + 1)}` }));
    }
    return el('div', { class: 'g-status' }, bits);
  }

  /** گِرد مرحله‌ایِ حافظه: هر مرحله جفت بیشتر. */
  function levelRound() {
    const pairs = g.levels[Math.min(level, g.levels.length - 1)];
    try {
      return buildRound({ kind: 'memory-pairs', pairs, prompt: 'جفت‌های مثل هم را پیدا کن' }, track);
    } catch {
      return null;
    }
  }

  /**
   * نسخهٔ بازیِ صفحهٔ گزینه‌ها.
   *
   * ⚠ چرا از choiceView درس استفاده نمی‌شود: آن نسخه پس از پاسخ
   * درست ۹۰۰ms مکث می‌کند تا کودک بازخورد را ببیند. در بازیِ
   * زمان‌دار همان مکث یعنی از دست دادنِ وقت و حسِ کندی. اینجا
   * بازخورد فوری و گذر سریع است — ۳۲۰ms.
   */
  function gameChoiceView(r, feedback, done, trk) {
    const stage = r.display ? buildStage(r, trk) : null;
    const opts = el('div', {
      class: `options${r.options.length > 2 ? ' cols-3' : ''}`,
    });

    let locked = false;
    r.options.forEach((o) => {
      const btn = optionButton(o);
      btn.addEventListener('click', () => {
        if (locked) return;
        locked = true;
        const right = String(o.value) === String(r.answer);
        btn.classList.add(right ? 'correct' : 'wrong');
        // ⚠ در بازی ذره‌های کمتر: چرخهٔ بازی ۳۲۰ms است، نه ۹۰۰ms.
        // انفجارِ کامل نیمه‌کاره بریده می‌شود و شلوغ به‌نظر می‌رسد.
        if (right) sparkle(btn, 8);
        if (right) markOk(feedback, '');
        else markRetry(feedback, '');
        setTimeout(() => done(right), right ? 320 : 700);
      });
      opts.append(btn);
    });

    return stage ? [stage, opts] : [opts];
  }

  if (g.mode === 'timed') {
    timer = setInterval(() => {
      if (over) return;
      left -= 1;
      if (left <= 0) {
        finish();
        return;
      }
      const t = wrap.querySelector('.g-time');
      const num = t && t.querySelector('.g-num');
      if (num) {
        num.textContent = toFa(left);
        t.classList.toggle('low', left <= 10);
      }
    }, 1000);
  }

  draw();
  return wrap;
}

/** صفحهٔ پایان بازی. */
function gameOverScreen(g, score, isRecord) {
  return el('div', { class: 'screen', style: `--c:${g.color}`, 'data-music': 'lively' }, [
    topbar(g.title, () => render(gamesScreen())),
    el('div', { class: 'done-card' }, [
      el('div', { class: 'buddy big', html: buddy(isRecord ? 'star' : 'happy', g.color) }),
      el('h2', { text: isRecord ? 'رکورد تازه!' : 'خسته نباشی!' }),
      el('div', { class: 'g-final', text: toFa(score) }),
      el('p', { class: 'muted', text: `بهترین امتیاز تو: ${toFa(store.gameBest(g.id))}` }),
      el('button', {
        class: 'btn next-btn',
        text: 'دوباره',
        onClick: () => render(gameScreen(g.id)),
      }),
      el('button', {
        class: 'btn ghost',
        text: 'بازی‌های دیگر',
        onClick: () => render(gamesScreen()),
      }),
    ]),
  ]);
}

// ── پایان درس ───────────────────────────────────────────────────────────
function doneScreen(lesson, correct, total) {
  const pct = Math.round((correct / total) * 100);
  const msg = pct >= 80 ? 'عالی بود!' : pct >= 50 ? 'خوب بود!' : 'تمرین بیشتر، بهتر!';

  // ⚠ قدم‌های گردِ سفر (§۷.۱۶ آیتم ۴): گامِ ۵۰/۱۰۰/۲۰۰/۳۰۷ و پایانِ
  // هر حوزه جشنِ *متفاوت* دارند — جام، هوشیِ «وای»، هالهٔ طلایی و
  // جرقهٔ بیشتر. هر ۳۰۷ درس نباید یکسان تمام شوند.
  const m = milestoneOf(lesson.id);
  const isBig = !!m.kind;
  const d0 = DOMAINS.find((x) => x.id === lesson.domain) || DOMAINS[0];

  // زنجیرهٔ بازی: درس بعدی مستقیم شروع می‌شود، بدون برگشت به منو.
  // این همان جایی است که در طرح قبلی جریان بازی می‌شکست.
  const nxt = stepAfter(lesson.id);
  const nd = DOMAINS.find((x) => x.id === nxt.domainId);

  const card = el('div', { class: `done-card${isBig ? ' milestone' : ''}` }, [
    el('span', {
      class: 'buddy big-buddy cheer',
      html: buddy(isBig ? 'wow' : pct >= 50 ? 'happy' : 'encourage', nd.color),
    }),
    el('h2', { text: msg }),
    // نشانِ قدم: جام + عددِ قدم (یا «پایانِ حوزه»). کودکِ پیش‌خوان
    // جام و هالهٔ طلایی را می‌بیند؛ متن برای والد است.
    isBig
      ? el('div', { class: 'milestone-badge' }, [
          el('span', { class: 'mb-ico', html: trophyIcon(), 'aria-hidden': 'true' }),
          el('span', {
            class: 'mb-label',
            text: m.kind === 'milestone' ? `قدم ${toFa(m.step)}` : `پایانِ ${d0.title}`,
          }),
        ])
      : null,
    // ستاره‌ها یکی‌یکی روشن می‌شوند — لحظهٔ جشن باید دیده شود،
    // نه اینکه فقط یک عدد نوشته شود.
    el(
      'div',
      { class: 'star-row', 'aria-hidden': 'true' },
      [1, 2, 3].map((i) =>
        el('span', {
          class: `award${i <= Math.max(1, Math.round((pct / 100) * 3)) ? ' on' : ''}`,
          style: `animation-delay:${140 + i * 190}ms`,
          html: starIcon(),
        }),
      ),
    ),
    el('p', { class: 'muted', text: `${toFa(correct)} از ${toFa(total)} تمرین درست` }),
  ]);

  // جرقهٔ بیشتر برای لحظهٔ بزرگ — پس از ورودِ کارت، نه در همان لحظه
  // (تا با انیمیشنِ ورود قاطی نشود). در سکوت هم دیده می‌شود.
  if (isBig) setTimeout(() => sparkle(card, 26), 420);

  return el('div', { class: 'screen done' }, [
    topbar('پایان درس', () => render(homeScreen())),
    card,
    // ⚠ یادداشت والدین گاهی ۳۰۰ نویسه است و در گوشیِ ۳۲۰×۵۶۸
    // دکمهٔ «بعدی» را زیر لبه می‌بُرد. بریدن متن هم رد شد: والد
    // باید کل توصیه را ببیند. پس تاشو می‌شود — بسته، فقط یک خط
    // می‌گیرد؛ باز، همهٔ متن هست. کودک دکمه‌اش را دارد.
    (() => {
      const box = el('details', { class: 'note note-fold' });
      box.append(el('summary', { text: 'برای والدین' }));
      box.append(el('p', { text: lesson.parentNote }));
      return box;
    })(),
    el(
      'button',
      { class: 'btn next-btn', style: `--c:${nd.color}`, onClick: () => render(playScreen(nxt.lesson.id)) },
      [
        el('span', { class: 'next-kicker', text: 'بعدی' }),
        el('span', { class: 'next-title', text: nxt.lesson.title }),
      ],
    ),
    el('button', { class: 'btn ghost', text: 'خانه', onClick: () => render(homeScreen()) }),
  ]);
}

// ── تنظیمات ─────────────────────────────────────────────────────────────


// وقتی سهم روزانه تمام می‌شود — با مهربانی، نه با تنبیه.
function timeUpScreen() {
  return el('div', { class: 'screen home' }, [
    el('div', { class: 'topbar' }, [el('h1', { text: 'برای امروز کافی است' })]),
    el('div', { class: 'done-card' }, [
      el('div', { class: 'big moon', html: moonIcon() }),
      el('h2', { text: 'آفرین! امروز خوب بازی کردی' }),
      el('p', { class: 'muted', text: 'فردا دوباره منتظرت هستیم.' }),
    ]),
    el('button', { class: 'btn ghost', text: 'نقشهٔ سفر', onClick: () => render(mapScreen()) }),
  ]);
}

// ── دروازهٔ والدین ───────────────────────────────────────────────────────
// یک ضرب ساده. کودک ۵ تا ۸ ساله نمی‌تواند از آن بگذرد، ولی والد در دو
// ثانیه رد می‌شود. رمز واقعی برای برنامه‌ای که هیچ خریدی درونش نیست
// زیاده‌روی است و فقط والد را آزار می‌دهد.
//
// ⚠ این دروازه اول فقط جلوی «گزارش پیشرفت» بود، ولی صفحهٔ تنظیمات —
// با دکمهٔ «پاک کردن همهٔ پیشرفت» — پشت آن نبود و کودک با یک تپ روی
// چرخ‌دنده به آن می‌رسید. confirm() هم محافظ نیست: کودکی که خواندن
// بلد نیست متنش را نمی‌فهمد و «تأیید» را می‌زند. حالا هر چیزی که
// حال برنامه را تغییر می‌دهد پشت دروازه است.
function parentGate(next = parentScreen) {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  const input = el('input', { type: 'number', inputmode: 'numeric', placeholder: '؟' });
  const err = el('div', { class: 'muted' });

  const submit = () => {
    if (Number(input.value) === a * b) render(next());
    else {
      err.textContent = 'درست نیست. دوباره تلاش کنید.';
      input.value = '';
    }
  };

  return el('div', { class: 'screen' }, [
    topbar(next === settingsScreen ? 'تنظیمات' : 'بخش والدین', () => render(homeScreen())),
    el('div', { class: 'gate' }, [
      el('p', { class: 'prompt', dir: 'ltr', text: `${a} × ${b} = ?` }),
      input,
      el('button', { class: 'btn', text: 'ورود', onClick: submit }),
      err,
    ]),
    el('div', { class: 'note', text: 'این بخش برای والدین است: گزارش پیشرفت، محدودیت زمان و پشتیبان‌گیری.' }),
  ]);
}

// ── پنل والدین ──────────────────────────────────────────────────────────
// تنها جایی که متن طولانی مجاز است (قانون ۱۳ نقشهٔ راه): اینجا
// بزرگسال می‌خواند، نه کودک.
function parentScreen() {
  const s = store.getState();
  const p = progress();
  const week = store.weekLog();
  const maxMin = Math.max(10, ...week.map((d) => d.minutes));
  const DAY_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

  // نمودار هفته
  const chart = el(
    'div',
    { class: 'chart' },
    week.map((d) =>
      el('div', { class: 'bar-wrap' }, [
        el('div', { class: 'bar', style: `height:${Math.round((d.minutes / maxMin) * 100)}%` }),
        el('span', { class: 'bar-label', text: DAY_FA[d.day][0] }),
      ]),
    ),
  );

  // پیشرفت هر حوزه
  const domains = el(
    'div',
    { class: 'dom-list' },
    p.byDomain.map((d) =>
      el('div', { class: 'dom-row' }, [
        el('span', { class: 'dom-name', text: d.title }),
        el('span', { class: 'dom-bar' }, [
          el('span', {
            class: 'dom-fill',
            style: `width:${d.total ? Math.round((d.done / d.total) * 100) : 0}%;background:${d.color}`,
          }),
        ]),
        el('span', { class: 'dom-num', text: `${toFa(d.done)} از ${toFa(d.total)}` }),
      ]),
    ),
  );

  // محدودیت زمان روزانه
  const limitSel = el('select');
  [0, 10, 15, 20, 30, 45, 60].forEach((m) => {
    limitSel.append(
      el('option', {
        value: String(m),
        text: m === 0 ? 'بدون محدودیت' : `${toFa(m)} دقیقه`,
        ...(m === s.dailyLimitMin ? { selected: 'selected' } : {}),
      }),
    );
  });
  limitSel.addEventListener('change', () => store.setDailyLimit(Number(limitSel.value)));

  return el('div', { class: 'screen' }, [
    topbar('بخش والدین', () => render(homeScreen())),

    el('div', { class: 'stat-row' }, [
      el('div', { class: 'stat' }, [
        el('strong', { text: `${toFa(p.done)}` }),
        el('span', { text: `از ${toFa(p.total)} درس` }),
      ]),
      el('div', { class: 'stat' }, [
        el('strong', { text: toFa(s.stars) }),
        el('span', { text: 'ستاره' }),
      ]),
      el('div', { class: 'stat' }, [
        el('strong', { text: toFa(store.todayMinutes()) }),
        el('span', { text: 'دقیقه امروز' }),
      ]),
    ]),

    el('h2', { class: 'sec', text: 'هفت روز گذشته' }),
    chart,

    el('h2', { class: 'sec', text: 'پیشرفت در هر حوزه' }),
    domains,

    el('h2', { class: 'sec', text: 'تسلط و مرور' }),
    (() => {
      const m = masterySummary();
      return el('div', { class: 'dom-list' }, [
        el('div', { class: 'dom-row plain' }, [
          el('span', { text: 'درس‌های مسلط‌شده' }),
          el('strong', { text: `${toFa(m.mastered)} از ${toFa(m.played)}` }),
        ]),
        el('div', { class: 'dom-row plain' }, [
          el('span', { text: 'آمادهٔ مرور امروز' }),
          el('strong', { text: toFa(m.due) }),
        ]),
        ...(m.weak.length
          ? [
              el('div', { class: 'note weak' }, [
                el('span', { text: 'نیاز به تمرین بیشتر: ' }),
                el('span', { text: m.weak.map((w) => `${w.title} (${toFa(w.score)}٪)`).join('، ') }),
              ]),
            ]
          : []),
      ]);
    })(),
    el('div', {
      class: 'note',
      text: `درس‌ها پس از ۱، ۳ و ۷ روز دوباره پیشنهاد می‌شوند تا در حافظه بمانند. درسی که نمره‌اش زیر ${toFa(MASTERY_SCORE)}٪ باشد زودتر برمی‌گردد. مرور جای درس تازه را نمی‌گیرد؛ هر سه درس یک بار می‌آید تا حس پیشرفت حفظ شود.`,
    }),

    el('h2', { class: 'sec', text: 'محدودیت زمان روزانه' }),
    el('label', { class: 'field' }, [el('span', { text: 'هر روز حداکثر' }), limitSel]),
    el('div', {
      class: 'note',
      text: 'وقتی سهم روز تمام شود، برنامه با مهربانی بازی را تا فردا می‌بندد. پژوهش‌ها نشان می‌دهند نشست‌های کوتاه و منظم از نشست‌های طولانی مؤثرترند؛ برای این سن ۱۵ تا ۲۰ دقیقه در روز کافی است.',
    }),

    el('h2', { class: 'sec', text: 'پشتیبان‌گیری' }),
    el('button', {
      class: 'btn ghost',
      text: 'ذخیرهٔ پیشرفت روی دستگاه',
      onClick: () => {
        const blob = new Blob([store.exportData()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'parvaresh-hoosh-backup.json';
        a.click();
        URL.revokeObjectURL(a.href);
      },
    }),
    el('div', {
      class: 'note',
      text: 'همهٔ اطلاعات فقط روی همین دستگاه ذخیره می‌شود. هیچ چیز به هیچ سروری فرستاده نمی‌شود و برنامه به اینترنت نیازی ندارد.',
    }),
  ]);
}

function settingsScreen() {
  const s = store.getState();
  const name = el('input', { type: 'text', value: s.childName, placeholder: 'مثلاً سارا', maxlength: '20' });
  const age = el('select');
  for (let a = TARGET_AGE.min; a <= TARGET_AGE.max; a++) {
    age.append(el('option', { value: String(a), text: `${toFa(a)} سال`, ...(a === s.age ? { selected: 'selected' } : {}) }));
  }

  const trackInfo = el('div', { class: 'muted' });
  const updateInfo = () => {
    const t = trackForAge(Number(age.value));
    trackInfo.textContent = `در این سن: ${toFa(t.optionCount)} گزینه در هر پرسش، اعداد تا ${toFa(t.maxNumber)}، ${toFa(t.roundsPerLesson)} تمرین در هر درس.`;
  };
  age.addEventListener('change', updateInfo);
  updateInfo();

  return el('div', { class: 'screen' }, [
    topbar('تنظیمات', () => render(homeScreen())),
    el('label', { class: 'field' }, [el('span', { text: 'اسم کودک' }), name]),
    el('label', { class: 'field' }, [el('span', { text: 'سن' }), age]),
    trackInfo,
    el('button', {
      class: 'btn',
      text: 'ذخیره',
      onClick: () => {
        store.setProfile({ childName: name.value, age: Number(age.value) });
        render(homeScreen());
      },
    }),
    // ── آهنگِ پس‌زمینه ───────────────────────────────────────────
    // ⚠ چرا اینجا و نه کنارِ دکمهٔ بلندگو در صفحهٔ خانه: آن دکمه
    // صدای *بازخورد* را قطع می‌کند و کودک باید بتواند خودش به آن
    // دست بزند. آهنگ اما تصمیمِ والد است — پژوهش می‌گوید ممکن است
    // به تمرکز آسیب بزند. پس پشتِ دروازهٔ والدین می‌ماند.
    el('label', { class: 'field switch-field' }, [
      el('span', { text: 'آهنگِ پس‌زمینه' }),
      el('input', {
        type: 'checkbox',
        class: 'switch',
        'aria-label': 'آهنگ پس‌زمینه',
        ...(s.music ? { checked: 'checked' } : {}),
        onChange: (e) => {
          const on = e.currentTarget.checked;
          store.setMusicPref(on);
          // ⚠ پیش‌نمایشِ فوری. والد کلید را می‌زند و باید *بشنود* چه
          // چیزی را روشن کرده؛ وگرنه باید برگردد به خانه تا بفهمد.
          if (on && !isMuted()) playMusic('calm');
          else stopMusic();
        },
      }),
    ]),
    el('div', {
      class: 'note',
      text: 'آهنگ فقط در صفحهٔ خانه، نقشه و بخش بازی‌ها پخش می‌شود. داخل درس هرگز پخش نمی‌شود، چون تمرکز کودک روی شنیدن حرف‌ها و شمردن است.',
    }),
    // ── لرزشِ مهربان (§۷.۱۶ آیتم ۲) ───────────────────────────
    // ⚠ چرا اینجا: تصمیمِ والد است، پس پشتِ دروازهٔ والدین می‌ماند
    // (کلِ این صفحه پشتِ دروازه است). کودکِ نشنونده این لرزش را
    // همان «آفرین» می‌گیرد.
    el('label', { class: 'field switch-field' }, [
      el('span', { text: 'لرزشِ مهربان' }),
      el('input', {
        type: 'checkbox',
        class: 'switch',
        'aria-label': 'لرزش مهربان',
        ...(s.vibrate ? { checked: 'checked' } : {}),
        onChange: (e) => store.setVibratePref(e.currentTarget.checked),
      }),
    ]),
    el('div', {
      class: 'note',
      text: 'وقتی پاسخ درست است، گوشی یک تپِ کوتاه می‌زند — همان «آفرین» به زبانِ لمس. هرگز روی پاسخِ غلط. در دستگاه‌های بدون لرزش اثری ندارد.',
    }),
    el('div', { class: 'note', text: 'همهٔ اطلاعات فقط روی همین دستگاه ذخیره می‌شود و به هیچ سروری فرستاده نمی‌شود.' }),
    el('button', { class: 'btn ghost', text: 'بخش والدین', onClick: () => render(parentGate()) }),
    el('button', { class: 'btn ghost', text: 'دربارهٔ برنامه', onClick: () => render(aboutScreen()) }),
    el('button', {
      class: 'btn ghost',
      text: 'پاک کردن همهٔ پیشرفت',
      onClick: () => {
        if (confirm('همهٔ ستاره‌ها و پیشرفت پاک شود؟')) {
          store.resetAll();
          render(homeScreen());
        }
      },
    }),
  ]);
}

/**
 * دربارهٔ برنامه.
 *
 * ── این صفحه برای والد است، نه کودک ───────────────────────────────
 * فروشگاه معمولاً چنین صفحه‌ای می‌خواهد، ولی دلیلِ واقعیِ وجودش این
 * است: والدی که ۱۹۰٬۰۰۰ تومان می‌دهد حق دارد بداند دقیقاً چه خریده.
 * پس اینجا شعار نیست؛ عدد است.
 *
 * ⚠ همهٔ اعداد **در لحظه شمرده می‌شوند**، هیچ‌کدام دستی نوشته
 * نشده‌اند. عددِ دستی در سندی که هفته‌ای دو بار محتوا اضافه می‌شود،
 * ظرف چند روز دروغ می‌شود — و دروغِ کوچک در صفحهٔ «دربارهٔ ما» بدترین
 * جای ممکن برای دروغ است. اگر فردا ده درس اضافه شود، این صفحه
 * خودش به‌روز است.
 */
function aboutScreen() {
  const totalRounds = LESSONS.reduce((a, l) => a + l.rounds.length, 0);
  const minutes = LESSONS.reduce((a, l) => a + (l.minutes || 0), 0);
  const hours = Math.round(minutes / 60);

  const row = (k, v) => el('div', { class: 'about-row' }, [
    el('span', { class: 'about-k', text: k }),
    el('span', { class: 'about-v', text: v }),
  ]);

  // شمارشِ درس‌های هر حوزه — از خودِ داده، نه از جدولی جداگانه.
  const perDomain = DOMAINS.map((d) => {
    const n = LESSONS.filter((l) => l.domain === d.id).length;
    return el('div', { class: 'about-dom' }, [
      el('span', { class: 'about-dot', style: `background:${d.color}` }),
      el('span', { text: d.title }),
      el('span', { class: 'about-num', text: `${toFa(n)} درس` }),
    ]);
  });

  return el('div', { class: 'screen' }, [
    topbar('دربارهٔ برنامه', () => render(parentGate(settingsScreen))),
    el('h2', { class: 'about-title', text: 'پرورش هوش' }),
    el('p', {
      class: 'about-lead',
      text: 'یک برنامهٔ کاملاً آفلاین برای کودکان ۵ تا ۸ سال. بدون تبلیغ، بدون خرید درون‌برنامه‌ای، بدون اینترنت.',
    }),
    el('div', { class: 'about-box' }, [
      row('درس‌ها', `${toFa(LESSONS.length)} درس`),
      row('تمرین‌ها', `${toFa(totalRounds)} تمرین`),
      row('زمانِ آموزش', `حدود ${toFa(hours)} ساعت`),
      row('حوزه‌ها', `${toFa(DOMAINS.length)} حوزه`),
      row('آهنگ‌ها', `${toFa(TRACKS.length)} آهنگ`),
    ]),
    el('h3', { class: 'about-h', text: 'چه چیزهایی آموزش داده می‌شود' }),
    el('div', { class: 'about-doms' }, perDomain),
    el('h3', { class: 'about-h', text: 'حریمِ خصوصی' }),
    el('p', {
      class: 'about-lead',
      text: 'این برنامه به اینترنت وصل نمی‌شود. نام و پیشرفتِ کودک فقط روی همین دستگاه ذخیره می‌شود و برای هیچ‌کس فرستاده نمی‌شود. هیچ تبلیغی و هیچ ردیابی‌ای وجود ندارد.',
    }),
    el('h3', { class: 'about-h', text: 'برای والدین' }),
    el('p', {
      class: 'about-lead',
      text: 'در «بخش والدین» می‌توانید زمانِ روزانهٔ بازی را محدود کنید و گزارشِ پیشرفت را ببینید. برنامه خودش می‌داند کودک کجای مسیر است و درسِ بعدی را انتخاب می‌کند.',
    }),
    el('div', { class: 'note', text: `نسخهٔ ${toFa(1)}٫${toFa(0)}٫${toFa(0)}` }),
    el('button', { class: 'btn ghost', text: 'بازگشت', onClick: () => render(parentGate(settingsScreen)) }),
  ]);
}

export { render };

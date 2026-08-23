// صفحه‌ها — هر تابع یک صفحه را در ریشه رسم می‌کند.
// بدون فریم‌ورک، ولی با مرزهای روشن: هیچ صفحه‌ای به داخل صفحهٔ دیگر دست نمی‌زند.

import { DOMAINS, AGE_TRACKS, TRACK_ORDER, trackForAge, TARGET_AGE } from '../data/curriculum.js';
import { lessonsByDomain, LESSONS } from '../data/lessons/index.js';
import * as store from '../core/storage.js';
import { speak, sfx, setMuted, isMuted, stop as stopAudio } from '../core/audio.js';
import { buildLesson, toFa } from '../core/rounds.js';
import { nextStep, stepAfter, stepOf, SEQUENCE, isLocked, progress } from '../core/journey.js';
import { masterySummary, isDue, MASTERY_SCORE } from '../core/mastery.js';
import { taskIcon, actionLabel } from '../core/task-icon.js';
import { shape as svgShape, geo as svgGeo, COLOR_HEX } from '../core/svg.js';
import { buddy, line as buddyLine } from '../core/buddy.js';

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
}

function render(screen) {
  stopAudio();
  root.replaceChildren(screen);
  window.scrollTo(0, 0);
}

function topbar(title, onBack) {
  const s = store.getState();
  return el('div', { class: 'topbar' }, [
    onBack ? el('button', { class: 'icon-btn', 'aria-label': 'بازگشت', onClick: onBack, text: '→' }) : null,
    el('h1', { text: title }),
    el('div', { class: 'stars', text: `⭐ ${toFa(s.stars)}` }),
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

  return el('div', { class: 'screen home' }, [
    el('div', { class: 'topbar' }, [
      el('h1', { text: greeting }),
      el('button', {
        class: 'icon-btn',
        'aria-label': 'صدا',
        text: isMuted() ? '🔇' : '🔊',
        onClick: (e) => {
          const m = setMuted(!isMuted());
          store.setMutedPref(m);
          e.currentTarget.textContent = m ? '🔇' : '🔊';
        },
      }),
      el('button', { class: 'icon-btn', 'aria-label': 'تنظیمات', text: '⚙', onClick: () => render(settingsScreen()) }),
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
    el('div', { class: 'stars', text: `⭐ ${toFa(s.stars)} ستاره` }),
    el('button', { class: 'btn ghost', text: 'نقشهٔ سفر', onClick: () => render(mapScreen()) }),
  ]);
}

// ── نقشهٔ سفر ────────────────────────────────────────────────────────────
// همهٔ درس‌ها یک‌جا، به ترتیب مسیر. جایگزین منوی دوطبقهٔ قبلی:
// اینجا برای مرور و دیدن کل راه است، نه مانعی سر راه بازی.
function mapScreen() {
  const p = progress();
  const cards = SEQUENCE.map((st) => {
    const d = DOMAINS.find((x) => x.id === st.domainId);
    const pr = store.lessonProgress(st.lesson.id);
    const locked = isLocked(st.lesson.id);
    const due = isDue(st.lesson.id);
    const doneMark = due ? '↻' : pr.completions ? '✓' : toFa(st.order + 1);
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
        el('div', { class: 'map-dot', text: locked ? '🔒' : doneMark }),
        el('div', { class: 'map-body' }, [
          el('strong', { text: st.lesson.title }),
          el('span', { class: 'map-meta' }, [
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

  return el('div', { class: 'screen' }, [
    topbar('نقشهٔ سفر', () => render(homeScreen())),
    el('div', { class: 'map-summary', text: `${toFa(p.done)} از ${toFa(p.total)} درس انجام شده` }),
    el('div', { class: 'map-list' }, cards),
  ]);
}

// ── بازی ────────────────────────────────────────────────────────────────
function playScreen(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const state = store.getState();
  const track = trackForAge(state.age);
  const rounds = buildLesson(lesson, track);
  const dom = DOMAINS.find((x) => x.id === lesson.domain) || DOMAINS[0];

  let idx = 0;
  let correct = 0;
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

    const body =
      r.type === 'choice'
        ? choiceView(r, feedback, next, track)
        : r.type === 'trace'
          ? traceView(r, next)
          : r.type === 'order'
            ? orderView(r, feedback, next)
            : memoryView(r, feedback, next);

    wrap.replaceChildren(
      topbar(lesson.title, () => render(homeScreen())),
      bar,
      el('div', { class: 'muted', text: `تمرین ${toFa(idx + 1)} از ${toFa(rounds.length)}` }),
      // ردیف پرسش: نشان تصویری + متن + دکمهٔ شنیدن.
      // کودکی که خواندن بلد نیست از روی نشان می‌فهمد باید چه کند،
      // و با تپ روی نشان پرسش را دوباره می‌شنود.
      el('div', { class: 'ask' }, [
        el('button', {
          class: `task-ico${r.speak ? ' can-play' : ''}`,
          'aria-label': r.speak ? `شنیدن دوباره: ${actionLabel(r.kindName || '')}` : actionLabel(r.kindName || ''),
          html:
            taskIcon(r.kindName || '', dom.color) +
            // بلندگوی SVG، نه ایموجی: ایموجی روی هر دستگاه شکل و
            // اندازهٔ متفاوتی دارد و در اندروید بریده می‌شد.
            (r.speak
              ? `<span class="spk"><svg viewBox="0 0 24 24" aria-hidden="true">
                   <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor"/>
                   <path d="M15.5 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round"/>
                 </svg></span>`
              : ''),
          onClick: () => {
            if (r.speak) speak(r.speak);
          },
        }),
        el('p', { class: 'prompt', text: r.prompt }),
      ]),
      ...body,
      feedback,
    );

    if (r.speak) setTimeout(() => speak(r.speak), 220);
  }

  function choiceView(r, feedback, done, trk) {
    const stage = r.display ? el('div', { class: 'stage' }) : null;
    if (stage) {
      if (r.display.kind === 'text') stage.textContent = r.display.value;
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
      if (r.display.kind === 'sequence') {
        const seq = el('div', { class: 'seq' });
        r.display.items.forEach((it) => seq.append(chip(it, r.display.unit)));
        seq.append(el('div', { class: 'chip q', text: '؟' }));
        stage.append(seq);
      }
    }

    const grid = el('div', { class: `options${r.options.length === 3 ? ' cols-3' : ''}` });
    let answered = false;

    r.options.forEach((o) => {
      const btn = el('button', { class: `opt${o.big ? ' big' : ''}` });
      if (o.pic) {
        btn.append(el('span', { class: 'ico lg', html: svgShape(o.pic) || '' }));
        // در درس انگلیسی، واژه زیر تصویر می‌آید تا شکل و واژه با هم دیده شوند.
        if (o.latinLabel) {
          btn.append(el('span', { class: 'pic-label', dir: 'ltr', lang: 'en', text: o.label }));
        }
      } else if (o.geo) {
        btn.append(el('span', { class: 'ico lg', html: svgGeo(o.geo.name, o.geo.color) || '' }));
      } else if (o.shapeRepeat) {
        const g = el('span', { class: 'grp' });
        for (let k = 0; k < o.shapeRepeat.times; k++) {
          g.append(el('span', { class: 'ico sm', html: svgShape(o.shapeRepeat.icon) || '' }));
        }
        btn.append(g);
      } else if (o.latin) {
        btn.append(el('span', { class: 'latin-opt', dir: 'ltr', lang: 'en', text: o.label }));
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

      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const right = o.value === r.answer;
        btn.classList.add(right ? 'correct' : 'wrong');
        [...grid.children].forEach((c) => (c.disabled = true));

        if (right) {
          correct++;
          sfx.correct();
          feedback.className = 'feedback ok';
          feedback.textContent = 'آفرین!';
          speak('آفرین!');
        } else {
          sfx.wrong();
          feedback.className = 'feedback no';
          feedback.textContent = r.because || 'اشکالی ندارد، دفعهٔ بعد!';
          speak('اشکالی ندارد، دوباره تلاش کن!');
          // پاسخ درست را نشان بده — کودک باید یاد بگیرد، نه فقط رد شود.
          [...grid.children].forEach((c, i) => {
            if (r.options[i].value === r.answer) c.classList.add('correct');
          });
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

  function chip(label, unit) {
    if (unit === 'color') {
      return el('div', { class: 'chip', style: `background:${COLOR_HEX[label] || '#999'}` });
    }
    return el('div', { class: 'chip plain', html: svgGeo(label, '#2D2A32') || label });
  }

  // جای‌های پراکنده ولی بدون هم‌پوشانی، برای بازی شمردن.
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

  function traceView(r, done) {
    const canvas = el('canvas', { class: 'pad' });
    const wrapEl = el('div', { class: 'trace-wrap' }, [
      el('div', { class: 'trace-ghost', text: r.letter }),
      canvas,
    ]);
    let drawn = 0;
    let drawing = false;

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
      };
      canvas.addEventListener('pointerdown', start);
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerup', end);
      canvas.addEventListener('pointerleave', end);
    });

    const btns = el('div', { style: 'display:grid;gap:10px' }, [
      el('button', {
        class: 'btn',
        text: 'تمام شد',
        onClick: () => {
          // خط کشیدن نمره‌دهی درست/غلط ندارد — تلاش کافی است.
          if (drawn > 8) correct++;
          sfx.correct();
          done();
        },
      }),
      el('button', { class: 'btn ghost', text: 'شنیدن دوباره', onClick: () => speak(r.speak) }),
    ]);
    return [wrapEl, btns];
  }

  function orderView(r, feedback, done) {
    const chosen = [];
    const slots = el('div', { class: 'order-slots' });
    const tray = el('div', { class: 'order-tray' });

    const refresh = () => {
      slots.replaceChildren(
        ...(chosen.length
          ? chosen.map((c) => el('div', { class: 'order-item', text: c.label, style: `transform:scale(${c.scale})` }))
          : [el('span', { class: 'muted', text: 'به ترتیب لمس کن' })]),
      );
    };
    refresh();

    r.items.forEach((it) => {
      const b = el('button', {
        class: 'order-item',
        text: it.label,
        style: `transform:scale(${it.scale})`,
      });
      b.addEventListener('click', () => {
        if (b.classList.contains('picked')) return;
        b.classList.add('picked');
        chosen.push(it);
        sfx.tap();
        refresh();
        if (chosen.length === r.items.length) {
          const ok = chosen.every((c, i) => c.value === r.answer[i]);
          if (ok) {
            correct++;
            sfx.correct();
            feedback.className = 'feedback ok';
            feedback.textContent = 'آفرین! درست چیدی.';
            speak('آفرین!');
          } else {
            sfx.wrong();
            feedback.className = 'feedback no';
            feedback.textContent = 'ترتیب درست نبود — دوباره نگاه کن.';
          }
          setTimeout(done, ok ? 1000 : 1800);
        }
      });
      tray.append(b);
    });

    return [slots, tray];
  }

  function memoryView(r, feedback, done) {
    const grid = el('div', { class: 'memory-grid' });
    let first = null;
    let lock = false;
    let found = 0;

    r.cards.forEach((c) => {
      const b = el('button', { class: 'card', text: c.icon });
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
          first.classList.add('matched');
          b.classList.add('matched');
          first = null;
          found++;
          sfx.correct();
          if (found === r.pairs) {
            correct++;
            feedback.className = 'feedback ok';
            feedback.textContent = 'همه را پیدا کردی!';
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

  draw();
  return wrap;
}

// ── پایان درس ───────────────────────────────────────────────────────────
function doneScreen(lesson, correct, total) {
  const pct = Math.round((correct / total) * 100);
  const msg = pct >= 80 ? 'عالی بود!' : pct >= 50 ? 'خوب بود!' : 'تمرین بیشتر، بهتر!';

  // زنجیرهٔ بازی: درس بعدی مستقیم شروع می‌شود، بدون برگشت به منو.
  // این همان جایی است که در طرح قبلی جریان بازی می‌شکست.
  const nxt = stepAfter(lesson.id);
  const nd = DOMAINS.find((x) => x.id === nxt.domainId);

  return el('div', { class: 'screen' }, [
    topbar('پایان درس', () => render(homeScreen())),
    el('div', { class: 'done-card' }, [
      el('span', { class: 'buddy big-buddy cheer', html: buddy(pct >= 50 ? 'happy' : 'encourage', nd.color) }),
      el('h2', { text: msg }),
      // ستاره‌ها یکی‌یکی روشن می‌شوند — لحظهٔ جشن باید دیده شود،
      // نه اینکه فقط یک عدد نوشته شود.
      el(
        'div',
        { class: 'star-row', 'aria-hidden': 'true' },
        [1, 2, 3].map((i) =>
          el('span', {
            class: `award${i <= Math.max(1, Math.round((pct / 100) * 3)) ? ' on' : ''}`,
            style: `animation-delay:${140 + i * 190}ms`,
            text: '★',
          }),
        ),
      ),
      el('p', { class: 'muted', text: `${toFa(correct)} از ${toFa(total)} تمرین درست` }),
    ]),
    el('div', { class: 'note', text: `برای والدین: ${lesson.parentNote}` }),
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
      el('div', { class: 'big', text: '🌙' }),
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
function parentGate() {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  const input = el('input', { type: 'number', inputmode: 'numeric', placeholder: '؟' });
  const err = el('div', { class: 'muted' });

  const submit = () => {
    if (Number(input.value) === a * b) render(parentScreen());
    else {
      err.textContent = 'درست نیست. دوباره تلاش کنید.';
      input.value = '';
    }
  };

  return el('div', { class: 'screen' }, [
    topbar('بخش والدین', () => render(homeScreen())),
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
    el('div', { class: 'note', text: 'همهٔ اطلاعات فقط روی همین دستگاه ذخیره می‌شود و به هیچ سروری فرستاده نمی‌شود.' }),
    el('button', { class: 'btn ghost', text: 'بخش والدین', onClick: () => render(parentGate()) }),
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

export { render };

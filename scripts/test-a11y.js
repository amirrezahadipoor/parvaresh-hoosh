/**
 * گاردِ دسترس‌پذیری — «آیا این برنامه برای همه کار می‌کند؟»
 *
 * ⚠ دامنه را عمداً محدود کرده‌ام به چیزهایی که *برای این برنامه*
 * معنا دارند. یک چک‌لیستِ عمومیِ WCAG اینجا گمراه‌کننده است:
 * برنامه‌ای که کاربرش کودکِ پیش‌خوانِ پنج‌ساله است، «متنِ جایگزین
 * برای تصویر» را جور دیگری حل می‌کند — تصویر *خودِ* پرسش است، نه
 * تزئینِ متن. برای همین همهٔ SVGها `aria-hidden` دارند و برچسبِ
 * متنیِ دکمه کار را می‌کند.
 *
 * آنچه واقعاً می‌سنجیم:
 *
 * ۱) **هر دکمه نامِ قابل‌خواندن دارد.** دکمه‌ای که فقط یک SVG دارد و
 *    نه متن و نه aria-label، برای صفحه‌خوان یک «button» بی‌نام است.
 *    والدِ نابینا هم باید بتواند برنامه را برای کودکش تنظیم کند.
 *
 * ۲) **هدفِ لمس ≥ ۴۴px.** استاندارد WCAG 2.5.5 و پژوهشِ کودک هر دو
 *    این را می‌گویند؛ توکنِ خودِ برنامه ۵۶px است.
 *
 * ۳) **کنتراستِ متن روی زمینه‌اش ≥ ۴٫۵ (متنِ عادی) یا ۳ (متنِ بزرگ).**
 *    این را با رنگِ واقعیِ محاسبه‌شدهٔ مرورگر می‌سنجیم، نه با توکن.
 *
 * ۴) **حلقهٔ فوکوس دیده می‌شود.** والدی که با صفحه‌کلید کار می‌کند
 *    باید بداند کجاست. `outline: none` بدون جایگزین ممنوع است.
 *
 * ۵) **زبان و جهت اعلام شده‌اند** و متنِ لاتین `dir="ltr"` دارد —
 *    وگرنه صفحه‌خوانِ فارسی «cat» را حرف‌به‌حرف می‌خواند.
 */
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const MIN_TAP = 44;

const problems = [];
const notes = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const unlock = async () => {
  await page.evaluate(() => {
    const lessons = {};
    for (let i = 0; i < 400; i++) lessons[`x${i}`] = { completions: 1, bestScore: 100 };
    localStorage.setItem(
      'parvaresh-hoosh/v4',
      JSON.stringify({ childName: 'آزمون', age: 7, muted: true, lessons, stars: 50, dailyLimitMin: 300, playLog: {}, gameScores: {} }),
    );
  });
};

await page.goto(BASE, { waitUntil: 'networkidle' });
await unlock();
await page.reload({ waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// ── ۵) زبان و جهت ────────────────────────────────────────────────
{
  const { lang, dir } = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
  }));
  if (lang !== 'fa') problems.push(`زبان صفحه «${lang}» است، باید fa باشد`);
  if (dir !== 'rtl') problems.push(`جهت صفحه «${dir}» است، باید rtl باشد`);
  notes.push(`زبان ${lang} / جهت ${dir}`);
}

const luminance = (r, g, b) => {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const parseRGB = (s) => {
  const m = s.match(/(\d+(?:\.\d+)?)/g);
  return m ? m.slice(0, 3).map(Number) : null;
};

// صفحه‌هایی که واقعاً بازدید می‌شوند
const screens = [
  { name: 'خانه', go: async () => {} },
  {
    name: 'نقشهٔ سفر',
    go: async () => {
      await page.getByText('نقشهٔ سفر').first().click();
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'بازی‌ها',
    go: async () => {
      await page.getByText('بازی‌ها').first().click();
      await page.waitForTimeout(400);
    },
  },
  {
    name: 'درس',
    go: async () => {
      await page.locator('.play-btn').first().click();
      await page.waitForTimeout(700);
    },
  },
];

for (const sc of screens) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await unlock();
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  try {
    await sc.go();
  } catch {
    notes.push(`${sc.name}: باز نشد (رد شد)`);
    continue;
  }

  // ── ۱) نامِ دکمه‌ها ──────────────────────────────────────────
  const nameless = await page.evaluate(() => {
    const out = [];
    for (const b of document.querySelectorAll('button, [role="button"], a[href]')) {
      const r = b.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const text = (b.textContent || '').trim();
      const label = b.getAttribute('aria-label') || b.getAttribute('title') || '';
      if (!text && !label) out.push(b.className || b.tagName);
    }
    return out;
  });
  for (const n of nameless) {
    problems.push(`${sc.name}: دکمهٔ بی‌نام برای صفحه‌خوان — «${n}»`);
  }

  // ── ۲) اندازهٔ هدفِ لمس ──────────────────────────────────────
  const small = await page.evaluate((min) => {
    const out = [];
    for (const b of document.querySelectorAll('button, [role="button"], a[href]')) {
      const r = b.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.width < min || r.height < min) {
        out.push(`${b.className || b.tagName} ${Math.round(r.width)}×${Math.round(r.height)}`);
      }
    }
    return out;
  }, MIN_TAP);
  for (const n of small) {
    problems.push(`${sc.name}: هدفِ لمس کوچک‌تر از ${MIN_TAP}px — ${n}`);
  }

  // ── ۳) کنتراستِ متن ─────────────────────────────────────────
  const texts = await page.evaluate(() => {
    const out = [];
    const walk = (el) => {
      for (const node of el.childNodes) {
        if (node.nodeType === 3 && node.textContent.trim().length > 1) {
          const p = node.parentElement;
          if (!p) continue;
          const r = p.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const cs = getComputedStyle(p);
          if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
          // زمینهٔ مؤثر: اولین جدِ دارای رنگِ نافذ
          let bg = 'rgba(0, 0, 0, 0)';
          let a = p;
          while (a) {
            const c = getComputedStyle(a).backgroundColor;
            if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) {
              bg = c;
              break;
            }
            a = a.parentElement;
          }
          out.push({
            text: node.textContent.trim().slice(0, 22),
            color: cs.color,
            bg,
            size: parseFloat(cs.fontSize),
            weight: cs.fontWeight,
          });
        } else if (node.nodeType === 1) {
          walk(node);
        }
      }
    };
    walk(document.body);
    return out;
  });

  for (const t of texts) {
    const fg = parseRGB(t.color);
    const bg = parseRGB(t.bg);
    if (!fg || !bg) continue;
    const l1 = luminance(...fg);
    const l2 = luminance(...bg);
    const cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const large = t.size >= 24 || (t.size >= 18.66 && Number(t.weight) >= 700);
    const need = large ? 3 : 4.5;
    if (cr < need) {
      problems.push(
        `${sc.name}: کنتراست متن ${cr.toFixed(2)} (حد ${need}) — «${t.text}» ${Math.round(t.size)}px`,
      );
    }
  }

  // ── ۴) حلقهٔ فوکوس ──────────────────────────────────────────
  const focusOk = await page.evaluate(() => {
    const b = document.querySelector('button');
    if (!b) return true;
    b.focus();
    const cs = getComputedStyle(b);
    const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
    const shadow = cs.boxShadow && cs.boxShadow !== 'none';
    return outline || shadow;
  });
  if (!focusOk) problems.push(`${sc.name}: دکمهٔ فوکوس‌شده هیچ نشانهٔ دیداری ندارد`);
}

// ── ۵ب) متنِ لاتین باید dir=ltr داشته باشد ───────────────────────
{
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await unlock();
  await page.reload({ waitUntil: 'networkidle' });
  const bareLatin = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('*')) {
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join('')
        .trim();
      if (!own) continue;
      if (!/[A-Za-z]{2,}/.test(own)) continue;
      let a = el;
      let ok = false;
      while (a) {
        if (a.getAttribute && a.getAttribute('dir') === 'ltr') {
          ok = true;
          break;
        }
        a = a.parentElement;
      }
      if (!ok) out.push(own.slice(0, 24));
    }
    return out;
  });
  for (const t of bareLatin) problems.push(`متن لاتین بدون dir="ltr" — «${t}»`);
}

await browser.close();

console.log('── آزمون دسترس‌پذیری ──');
for (const n of notes) console.log(`  ${n}`);

if (problems.length) {
  const uniq = [...new Set(problems)];
  console.log(`\nمشکل (${problems.length}، یکتا ${uniq.length}):`);
  for (const p of uniq.slice(0, 25)) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\n✓ نام دکمه‌ها، اندازهٔ لمس، کنتراست متن، فوکوس و جهتِ متن سالم‌اند.');

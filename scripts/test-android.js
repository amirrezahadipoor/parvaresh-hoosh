#!/usr/bin/env node
/**
 * نگهبانِ «آماده‌سازیِ ظاهری برای اندروید» — پوستهٔ وب، نه APK (قانون ۳).
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * برنامه روی اندروید از طریق WebView/کاپاسیتور یا نصبِ PWA دیده
 * می‌شود؛ «ظاهرِ اندروید» یعنی پوستهٔ وب درست آماده باشد. این
 * نگهبان چیزهایی را قفل می‌کند که قبلاً یک بار شکستند یا بی‌سروصدا
 * خراب می‌شوند:
 *
 *   • theme-color دقیقاً برابر --bg باشد — قبلاً نبود و یک خطِ
 *     رنگیِ ناهم‌خوان زیر نوارِ وضعیت اندروید می‌افتاد.
 *   • viewport-fit=cover تا env(safe-area-inset-*) کار کند.
 *   • manifest: نمایشِ مستقل (بدون نوار آدرس)، عمودی، و آیکون‌های
 *     maskable برای اندروید — فایل‌ها واقعاً وجود داشته باشند.
 *   • لمسِ تند (touch-action: manipulation) و خاموشیِ
 *     بزرگ‌نماییِ خودکارِ فونت (text-size-adjust) در CSS.
 *   • متاهایِ حالتِ مستقل و منعِ «شمارهٔ تلفن» (format-detection).
 *
 * چه چیزی را نمی‌سنجد: خودِ بسته‌بندیِ اندروید (android/، APK) را
 * نمی‌سنجد — آن قانون ۳ است و اجازهٔ صریحِ مالک می‌خواهد.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), 'utf8');

const html = read('index.html');
const css = read('src/styles/main.css');
const manifest = JSON.parse(read('manifest.webmanifest'));

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};
const lower = (s) => String(s || '').toLowerCase();

// ── ۱. theme-color == --bg (باگی که قبلاً خوردیم) ─────────────────────
{
  const m = html.match(/name="theme-color" content="(#[0-9A-Fa-f]{6})"/);
  check(m, 'متای theme-color در index.html نیست');
  const c = css.match(/--bg:\s*(#[0-9A-Fa-f]{6})/);
  check(c, 'توکنِ --bg در main.css نیست');
  if (m && c) {
    check(lower(m[1]) === lower(c[1]), `theme-color «${m[1]}» با --bg «${c[1]}» نمی‌خواند — خطِ رنگیِ اندروید`);
  }
  notes.push('theme-color با --bg می‌خواند');
}

// ── ۲. viewport و متاهایِ حالتِ مستقل ────────────────────────────────
{
  const vp = html.match(/name="viewport" content="([^"]+)"/);
  check(vp, 'متای viewport نیست');
  if (vp) {
    check(vp[1].includes('viewport-fit=cover'), 'viewport-fit=cover نیست — حاشیهٔ امنِ اندروید کار نمی‌کند');
    check(vp[1].includes('maximum-scale=1'), 'maximum-scale=1 نیست — زومِ بیرویه ممکن است');
  }
  check(html.includes('name="mobile-web-app-capable"'), 'متای mobile-web-app-capable نیست (نصبِ PWA)');
  check(html.includes('name="apple-mobile-web-app-capable"'), 'متای apple-mobile-web-app-capable نیست (WebView)');
  check(html.includes('name="format-detection" content="telephone=no"'), 'format-detection نیست — عدد ممکن است «شمارهٔ تلفن» شود');
  check(html.includes('rel="manifest"'), 'ارجاع به manifest نیست');
  notes.push('viewport و متاهایِ حالتِ مستقل حاضرند');
}

// ── ۳. manifest و آیکون‌ها ───────────────────────────────────────────
{
  check(manifest.display === 'standalone', 'display باید standalone باشد (بدون نوار آدرس)');
  check(manifest.orientation === 'portrait', 'orientation باید portrait باشد');
  check(manifest.theme_color === '#FBF6EF', `theme_color «${manifest.theme_color}» با --bg نمی‌خواند`);
  check(manifest.background_color === '#FBF6EF', `background_color «${manifest.background_color}» با --bg نمی‌خواند`);
  const icons = manifest.icons || [];
  const has = (sizes, purpose) =>
    icons.some((i) => i.sizes === sizes && (i.purpose || 'any').includes(purpose));
  check(has('192x192', 'any'), 'آیکون 192 نیست');
  check(has('512x512', 'any'), 'آیکون 512 نیست');
  check(has('192x192', 'maskable'), 'آیکون maskable-192 نیست (اندروید می‌بُرد)');
  check(has('512x512', 'maskable'), 'آیکون maskable-512 نیست (اندروید می‌بُرد)');
  // فایل‌های آیکون واقعاً وجود داشته باشند.
  for (const f of ['icon-32.png', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-192.png', 'icon-maskable-512.png']) {
    check(existsSync(fileURLToPath(new URL(`assets/icon/${f}`, ROOT))), `فایلِ آیکون «${f}» وجود ندارد`);
  }
  notes.push('manifest: مستقل، عمودی، ۶ آیکون حاضر');
}

// ── ۴. حسِ لمس و فونت در CSS ─────────────────────────────────────────
{
  check(css.includes('touch-action: manipulation'), 'touch-action: manipulation نیست — تأخیرِ دوبار-تپ می‌ماند');
  check(css.includes('-webkit-text-size-adjust: 100%'), 'خاموشیِ بزرگ‌نماییِ خودکارِ فونت نیست');
}

// ── ۵. آیکون از یک منبع (app-icon.js) ساخته می‌شود ──────────────────
{
  const iconsJs = read('scripts/build-icons.js');
  check(iconsJs.includes('maskable'), 'ساختِ آیکون نسخهٔ maskable ندارد');
  const appIcon = read('src/core/app-icon.js');
  check(appIcon.includes('maskable'), 'app-icon.js حالتِ maskable را نمی‌شناسد');
}

console.log('── نگهبانِ آماده‌سازیِ ظاهری برای اندروید (پوستهٔ وب) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ پوستهٔ وب برای اندروید آماده است (بسته‌بندیِ APK همچنان قانون ۳).');

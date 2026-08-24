// نشان تصویری نوع تمرین.
//
// مسئله‌ای که حل می‌کند:
// کودک ۵ ساله خواندن بلد نیست. پرسش «کدام گروه بیشتر است؟» برای او
// یک نوار خاکستری بی‌معناست. تا امروز ۶۷٪ گِردها هیچ صدایی نداشتند و
// تنها راهنمای کودک، متنی بود که نمی‌توانست بخواند.
//
// راه‌حل سه‌لایه است و این فایل لایهٔ اول است:
//   ۱. نشان تصویری — کودک از روی شکل می‌فهمد «باید بشمارم» یا
//      «باید جفت پیدا کنم»، حتی پیش از هر صدایی.
//   ۲. صدای ضبط‌شده (audio.js) — پرسش را می‌گوید.
//   ۳. متن — برای والد و کودک بزرگ‌تر که می‌خواند.
//
// هیچ‌کدام جای دیگری را نمی‌گیرد. کودک باید بتواند فقط با نشان و صدا
// بازی کند. این همان اصل «هرگز فقط با رنگ/متن پیام نده» است.
//
// نشان‌ها عمداً بسیار ساده‌اند: کودک باید در یک نگاه بفهمد، نه اینکه
// نشان خودش معما شود.

/** فعل تمرین: کودک باید چه کاری بکند؟ */
export const ACTIONS = Object.freeze({
  count: 'count', // بشمار
  pick: 'pick', // یکی را انتخاب کن
  listen: 'listen', // گوش کن و انتخاب کن
  trace: 'trace', // با انگشت بکش
  order: 'order', // مرتب کن
  match: 'match', // جفت پیدا کن
  compare: 'compare', // مقایسه کن
  odd: 'odd', // متفاوت را پیدا کن
  next: 'next', // ادامهٔ الگو
  add: 'add', // جمع
  sub: 'sub', // تفریق
  blend: 'blend', // صداها را به هم بچسبان
});

/** هر نوع گِرد به یک فعل نگاشت می‌شود. */
const KIND_ACTION = Object.freeze({
  'letter-sound': ACTIONS.listen,
  'letter-trace': ACTIONS.trace,
  'digit-trace': ACTIONS.trace,
  'letter-word': ACTIONS.pick,
  'letter-in-word': ACTIONS.pick,
  'blend-word': ACTIONS.blend,
  'segment-count': ACTIONS.count,
  'syllable-build': ACTIONS.order,
  'sentence-pic': ACTIONS.pick,
  'pic-sentence': ACTIONS.pick,
  'sentence-build': ACTIONS.order,
  'count-letters': ACTIONS.count,
  'count-objects': ACTIONS.count,
  'count-shapes': ACTIONS.count,
  'count-group': ACTIONS.count,
  subitize: ACTIONS.count,
  'ten-frame': ACTIONS.count,
  'pick-number': ACTIONS.pick,
  'next-number': ACTIONS.next,
  'compare-groups': ACTIONS.compare,
  'compare-numbers': ACTIONS.compare,
  add: ACTIONS.add,
  sub: ACTIONS.sub,
  'number-bond': ACTIONS.add,
  'make-ten': ACTIONS.count,
  'story-problem': ACTIONS.count,
  'tally': ACTIONS.count,
  'two-rule': ACTIONS.pick,
  'not-rule': ACTIONS.odd,
  'event-order': ACTIONS.order,
  'what-if': ACTIONS.next,
  'same-different': ACTIONS.match,
  'skip-count': ACTIONS.next,
  'place-value': ACTIONS.count,
  'number-line': ACTIONS.next,
  between: ACTIONS.pick,
  'teen-build': ACTIONS.count,
  'measure-units': ACTIONS.count,
  ordinal: ACTIONS.pick,
  'shape-corners': ACTIONS.count,
  'symmetry': ACTIONS.pick,
  'missing-addend': ACTIONS.add,
  'pattern-next': ACTIONS.next,
  'pattern-make': ACTIONS.pick,
  'bigger-smaller': ACTIONS.pick,
  'odd-one-out': ACTIONS.odd,
  'order-size': ACTIONS.order,
  'order-number': ACTIONS.order,
  'memory-pairs': ACTIONS.match,
  'shape-color': ACTIONS.pick,
  category: ACTIONS.pick,
  shadow: ACTIONS.match,
  trait: ACTIONS.pick,
  'which-group': ACTIONS.pick,
  'en-letter-pic': ACTIONS.pick,
  'en-word-pic': ACTIONS.pick,
  'en-pic-word': ACTIONS.pick,
  'en-color': ACTIONS.pick,
  'en-number': ACTIONS.count,
  'en-cvc': ACTIONS.pick,
  'en-translate': ACTIONS.pick,
  'en-sight-find': ACTIONS.pick,
  'en-rime-build': ACTIONS.blend,
  // علوم — «چیدن» فقط برای چرخهٔ زندگی که واقعاً ترتیبی است.
  living: ACTIONS.pick,
  'life-cycle': ACTIONS.order,
  'life-cycle-next': ACTIONS.next,
  season: ACTIONS.pick,
  'weather-need': ACTIONS.pick,
  'weather-name': ACTIONS.pick,
  needs: ACTIONS.pick,
  habitat: ACTIONS.pick,
  sense: ACTIONS.pick,
  'float-sink': ACTIONS.pick,
  // مهارت زندگی — «انتخاب کن» درست است: کودک از میان چند تصویر یکی
  // را برمی‌گزیند. «چیدن» فقط برای گِردِ سه‌گامیِ ایمنی.
  'feel-face': ACTIONS.pick,
  'name-face': ACTIONS.pick,
  'safe-pick': ACTIONS.pick,
  'problem-solve': ACTIONS.pick,
  'feeling-fix': ACTIONS.pick,
  'good-habit': ACTIONS.pick,
  'safety-order': ACTIONS.order,
});

/** برچسب فارسی — برای والد و صفحه‌خوان، نه برای کودک پیش‌خوان. */
const LABEL = Object.freeze({
  count: 'بشمار',
  pick: 'یکی را انتخاب کن',
  listen: 'گوش کن و انتخاب کن',
  trace: 'با انگشت بکش',
  order: 'مرتب کن',
  match: 'جفت پیدا کن',
  compare: 'کدام بیشتر؟',
  odd: 'کدام فرق دارد؟',
  next: 'بعدی کدام است؟',
  add: 'با هم جمع کن',
  sub: 'کم کن',
  blend: 'صداها را بچسبان',
});

const S = { w: 3.2, cap: 'round', join: 'round' };
const stroke = (d, c = 'currentColor') =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${S.w}" stroke-linecap="${S.cap}" stroke-linejoin="${S.join}"/>`;

/** نقاشی هر فعل. viewBox یکسان ۰ ۰ ۴۰ ۴۰ تا اندازه‌ها دقیق بمانند. */
const ART = Object.freeze({
  // سه شیء با قوسِ «جهش شمارش» روی آن‌ها → «بشمار».
  // عدد داخل نشان نمی‌گذاریم: در گِردی که پاسخش ۲ بود، نشانِ حاوی ۳
  // کودک را مستقیماً گمراه می‌کرد. نشان باید بگوید «چه کار کن»،
  // نه اینکه عددی را پیشنهاد دهد.
  // قوس‌ها همان یک‌به‌یک‌شماری‌اند که معلم با انگشت نشان می‌دهد.
  count: `${stroke('M9 17 Q14.5 8 20 17')}
          ${stroke('M20 17 Q25.5 8 31 17')}
          <circle cx="9" cy="24" r="4.2" fill="currentColor"/>
          <circle cx="20" cy="24" r="4.2" fill="currentColor"/>
          <circle cx="31" cy="24" r="4.2" fill="currentColor"/>`,
  // انگشت روی یک گزینه → «انتخاب کن»
  pick: `<rect x="6" y="8" width="12" height="12" rx="3.5" fill="none" stroke="currentColor" stroke-width="${S.w}"/>
         <rect x="22" y="8" width="12" height="12" rx="3.5" fill="currentColor"/>
         ${stroke('M28 24v7')}
         ${stroke('M24 28l4 4 4-4')}`,
  // موج صوتی → «گوش کن»
  listen: `${stroke('M12 16v8')}
           ${stroke('M19 11v18')}
           ${stroke('M26 14v12')}
           ${stroke('M33 18v4')}
           ${stroke('M6 18v4')}`,
  // مسیر نقطه‌چین با انگشت → «بکش»
  trace: `<path d="M8 30 Q14 8 20 20 T32 12" fill="none" stroke="currentColor"
            stroke-width="${S.w}" stroke-linecap="round" stroke-dasharray="1.5 5"/>
          <circle cx="32" cy="12" r="4" fill="currentColor"/>`,
  // سه میله با ارتفاع صعودی → «مرتب کن»
  order: `<rect x="7" y="24" width="7" height="9" rx="2" fill="currentColor"/>
          <rect x="16.5" y="17" width="7" height="16" rx="2" fill="currentColor"/>
          <rect x="26" y="9" width="7" height="24" rx="2" fill="currentColor"/>`,
  // دو کارت یکسان → «جفت پیدا کن»
  match: `<rect x="5" y="11" width="13" height="17" rx="3.5" fill="none" stroke="currentColor" stroke-width="${S.w}"/>
          <rect x="22" y="11" width="13" height="17" rx="3.5" fill="none" stroke="currentColor" stroke-width="${S.w}"/>
          <circle cx="11.5" cy="19.5" r="3.2" fill="currentColor"/>
          <circle cx="28.5" cy="19.5" r="3.2" fill="currentColor"/>`,
  // دو ستون نابرابر → «کدام بیشتر»
  compare: `<rect x="7" y="20" width="10" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="${S.w}"/>
            <rect x="23" y="9" width="10" height="24" rx="2.5" fill="currentColor"/>`,
  // دو همسان و یکی متفاوت، با حلقهٔ تأکید → «فرق دارد».
  // ضربدر حذف شد: نشانهٔ «غلط» است و کودک پیش از پاسخ دادن آن را
  // بازخورد منفی می‌فهمد.
  odd: `<circle cx="9" cy="20" r="4.2" fill="currentColor"/>
        <circle cx="20" cy="20" r="4.2" fill="currentColor"/>
        <rect x="26.5" y="15.5" width="9" height="9" rx="2" fill="currentColor"/>
        <circle cx="31" cy="20" r="8.5" fill="none" stroke="currentColor"
          stroke-width="2.4" stroke-dasharray="3 3"/>`,
  // دنباله با جای خالی → «بعدی کدام است»
  next: `<circle cx="7" cy="20" r="3.6" fill="currentColor"/>
         <circle cx="17" cy="20" r="3.6" fill="currentColor"/>
         <circle cx="27" cy="20" r="3.6" fill="currentColor"/>
         <circle cx="35.5" cy="20" r="3.4" fill="none" stroke="currentColor"
           stroke-width="2.4" stroke-dasharray="2.5 3"/>`,
  // علامت جمع
  add: `${stroke('M20 9v22')}${stroke('M9 20h22')}`,
  // علامت تفریق
  sub: `${stroke('M9 20h22')}`,
  // سه صدای جدا که با قوس به هم می‌پیوندند → «صداکشی».
  // این همان حرکتی است که معلم با انگشت روی تخته می‌کشد.
  blend: `<circle cx="9" cy="15" r="4" fill="currentColor"/>
          <circle cx="20" cy="15" r="4" fill="currentColor"/>
          <circle cx="31" cy="15" r="4" fill="currentColor"/>
          ${stroke('M9 22 Q20 34 31 22')}`,
});

/** فعلِ یک نوع گِرد. */
export function actionFor(kind) {
  return KIND_ACTION[kind] || ACTIONS.pick;
}

/** برچسب فارسی فعل. */
export function actionLabel(kind) {
  return LABEL[actionFor(kind)] || LABEL.pick;
}

/**
 * نشان تصویری نوع تمرین.
 * @param {string} kind نوع گِرد
 * @param {string} color رنگ حوزه
 */
export function taskIcon(kind, color = 'currentColor') {
  const art = ART[actionFor(kind)] || ART.pick;
  return `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" style="color:${color}">${art}</svg>`;
}

/** بررسی سلامت — هر نوع گِرد باید نشان داشته باشد. */
export function auditIcons(kinds) {
  const problems = [];
  for (const k of kinds) {
    if (!KIND_ACTION[k]) problems.push(`${k}: نشان تصویری ندارد`);
  }
  for (const a of Object.values(ACTIONS)) {
    if (!ART[a]) problems.push(`فعل ${a}: نقاشی ندارد`);
    if (!LABEL[a]) problems.push(`فعل ${a}: برچسب ندارد`);
  }
  return problems;
}

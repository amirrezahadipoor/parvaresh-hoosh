// موتور گِرد را روی همهٔ درس‌ها و هر سه ردهٔ سنی اجرا می‌کند.
//
// هدف: مطمئن شویم هیچ گِردی خطا نمی‌دهد، پاسخ درست همیشه بین گزینه‌هاست،
// و ردهٔ سنی واقعاً روی خروجی اثر می‌گذارد.

import { LESSONS } from '../src/data/lessons/index.js';
import { AGE_TRACKS, TRACK_ORDER } from '../src/data/curriculum.js';
import { buildRound } from '../src/core/rounds.js';
import { shape as svgShape, geo as svgGeo } from '../src/core/svg.js';

let checks = 0;
const errors = [];
const ITERATIONS = 40; // گِردها تصادفی‌اند؛ چند بار اجرا می‌کنیم

for (const trackId of TRACK_ORDER) {
  const track = AGE_TRACKS[trackId];
  for (const lesson of LESSONS) {
    for (const [i, def] of lesson.rounds.entries()) {
      for (let it = 0; it < ITERATIONS; it++) {
        const tag = `${lesson.id}#${i + 1} [${trackId}]`;
        let r;
        try {
          r = buildRound(def, track);
        } catch (e) {
          errors.push(`${tag}: خطا — ${e.message}`);
          break;
        }
        checks++;

        if (!r.prompt || !String(r.prompt).trim()) errors.push(`${tag}: پرسش خالی`);
        if (/\{[a-z]\}/.test(r.prompt)) errors.push(`${tag}: جای‌نگهدار پر نشده: ${r.prompt}`);

        if (r.type === 'choice') {
          if (!r.options?.length) errors.push(`${tag}: بدون گزینه`);
          const vals = r.options.map((o) => o.value);
          if (!vals.includes(r.answer)) {
            errors.push(`${tag}: پاسخ ${r.answer} بین گزینه‌ها نیست (${vals.join(',')})`);
          }
          if (new Set(vals).size !== vals.length) errors.push(`${tag}: گزینهٔ تکراری`);
          // هر گزینه باید یا برچسب متنی داشته باشد یا یک نمایش دیداری،
          // ولی برچسب متنی همیشه لازم است (خوانندهٔ صفحه و آزمون).
          if (r.options.some((o) => o.label === undefined || o.label === '')) {
            errors.push(`${tag}: گزینهٔ بدون برچسب`);
          }
          // عدد نباید از سقف سنی بیشتر باشد
          for (const v of vals) {
            if (typeof v === 'number' && v > track.maxNumber + 2) {
              errors.push(`${tag}: عدد ${v} از سقف سنی ${track.maxNumber} بیشتر است`);
            }
          }

          // هر گزینهٔ تصویری باید واقعاً یک SVG بسازد — نه شکل گمشده.
          for (const o of r.options) {
            if (o.pic && !svgShape(o.pic)) errors.push(`${tag}: شکل «${o.pic}» وجود ندارد`);
            if (o.geo && !svgGeo(o.geo.name, o.geo.color)) {
              errors.push(`${tag}: شکل هندسی «${o.geo.name}» وجود ندارد`);
            }
            if (o.shapeRepeat && !svgShape(o.shapeRepeat.icon)) {
              errors.push(`${tag}: شکل «${o.shapeRepeat.icon}» وجود ندارد`);
            }
          }
          if (r.display?.kind === 'scatter' && !svgShape(r.display.icon)) {
            errors.push(`${tag}: شکل پراکنده «${r.display.icon}» وجود ندارد`);
          }
          if (r.display?.kind === 'repeat' && !svgShape(r.display.icon)) {
            errors.push(`${tag}: شکل تکرارشونده «${r.display.icon}» وجود ندارد`);
          }
          if (r.display?.kind === 'shadow' && !svgShape(r.display.value)) {
            errors.push(`${tag}: سایهٔ «${r.display.value}» شکل ندارد`);
          }
          if (r.display?.kind === 'letter-pic' && !svgShape(r.display.icon)) {
            errors.push(`${tag}: تصویر حرف «${r.display.icon}» وجود ندارد`);
          }
          if (r.display?.kind === 'pic-only' && !svgShape(r.display.icon)) {
            errors.push(`${tag}: تصویر «${r.display.icon}» وجود ندارد`);
          }

          // ── لو رفتن پاسخ ────────────────────────────────────────
          // اگر صحنه خودِ پاسخ را نشان دهد، گِرد چیزی نمی‌سنجد:
          // کودک فقط از بالا کپی می‌کند. این دسته باگ با آزمون
          // ساختاری دیده نمی‌شود چون همه‌چیز «معتبر» است.
          const shown = [];
          if (r.display?.kind === 'text') shown.push(String(r.display.value));
          if (r.display?.kind === 'letter-pic') shown.push(String(r.display.letter));
          if (r.display?.kind === 'dots') shown.push(String(r.display.times));
          if (shown.includes(String(r.answer))) {
            errors.push(`${tag}: صحنه پاسخ «${r.answer}» را لو می‌دهد`);
          }
        }

        if (r.type === 'order') {
          if (!r.items?.length) errors.push(`${tag}: بدون آیتم`);
          // نشتی پاسخ در چیدن: اگر صحنه همان چیزی را نشان دهد که
          // کودک باید از قطعه‌ها بسازد، تمرین به تطبیق شکلی تبدیل
          // می‌شود و هیچ چیز نمی‌آموزد. («اتو» بالا، «ا»+«تو» پایین)
          if (r.display?.kind === 'text') {
            const built = r.answer.map((i) => r.items.find((x) => x.value === i)?.label ?? '').join('');
            if (String(r.display.value) === built) {
              errors.push(`${tag}: صحنه چیدمان درست «${built}» را لو می‌دهد`);
            }
          }
          if (r.answer.length !== r.items.length) errors.push(`${tag}: طول پاسخ با آیتم‌ها فرق دارد`);
          const sorted = [...r.answer].every((v, k, a) => k === 0 || a[k - 1] <= v);
          if (!sorted) errors.push(`${tag}: پاسخ مرتب نیست`);
        }

        if (r.type === 'memory') {
          if (r.cards.length !== r.pairs * 2) errors.push(`${tag}: تعداد کارت با جفت‌ها نمی‌خواند`);
          const counts = {};
          r.cards.forEach((c) => (counts[c.icon] = (counts[c.icon] || 0) + 1));
          if (Object.values(counts).some((c) => c !== 2)) errors.push(`${tag}: کارت بدون جفت`);
        }

        if (r.type === 'trace' && !r.letter) errors.push(`${tag}: حرف برای خط‌کشیدن ندارد`);
      }
    }
  }
}

// ── هر گِرد باید بدون خواندن حل شود ─────────────────────────────────────
//
// قانون الزامی برنامه: کودک ۵ ساله خواندن بلد نیست. اگر همهٔ
// گزینه‌های یک گِرد فقط واژهٔ فارسی باشند، آن گِرد برای مخاطب اصلی
// غیرقابل‌حل است.
//
// ⚠ سه باگ واقعی با همین بررسی پیدا شد:
//   pattern-next  کلید `shape` می‌فرستاد که رابط کاربری نمی‌شناخت
//   which-group   نام دسته‌ها را بدون هیچ نمونهٔ تصویری نشان می‌داد
//   odd-one-out   «کفش/کلاه/نان» شکل نداشتند و واژه می‌ماندند
//
// استثناها: گِردهای خواندن و انگلیسی که *هدفشان* خواندن واژه است، و
// گزینه‌های عددی (رقم فارسی را کودک این سن می‌خواند).
{
  const READING_KINDS = new Set([
    'letter-sound',
    'letter-word',
    'letter-in-word',
    'blend-word',
    'en-translate',
    // name-face پیوند «چهره ↔ واژه» را می‌آموزد و برای ردهٔ سنی
    // پایین خودش به feel-face تبدیل می‌شود.
    'name-face',
  ]);
  const isNumeric = (v) => /^[۰-۹0-9\s+\-−=]+$/.test(String(v ?? ''));
  const wordOnly = new Map();
  const mixed = new Map();

  for (const lesson of LESSONS) {
    for (const rd of lesson.rounds) {
      if (READING_KINDS.has(rd.kind)) continue;
      for (const t of TRACK_ORDER) {
        for (let i = 0; i < 8; i++) {
          let r;
          try {
            r = buildRound(rd, AGE_TRACKS[t]);
          } catch {
            continue;
          }
          if (!r || r.type !== 'choice' || !r.options) continue;
          const bare = r.options.filter(
            (o) => !o.pic && !o.geo && !o.shapeRepeat && !o.latin && !o.dots && !o.swatch,
          );
          const words = bare.filter((o) => !isNumeric(o.label));
          if (words.length === r.options.length && !wordOnly.has(rd.kind)) {
            wordOnly.set(rd.kind, r.options.map((o) => o.label).join('/'));
          }
          // ⚠ گِرد «نیمه‌تصویری» بدتر از گِرد تمام-واژه‌ای است: وقتی سه
          // گزینه تصویر دارند و یکی واژهٔ خالی است، همان یکی «فرق‌دار»
          // به‌نظر می‌رسد و پاسخ لو می‌رود. («سگ 🖼 / اسب 📝 / درخت 🖼»)
          const cuedCount = r.options.length - bare.length;
          if (cuedCount > 0 && bare.length > 0) {
            const key = `${lesson.id}/${rd.kind}`;
            if (!mixed.has(key)) {
              mixed.set(
                key,
                r.options.map((o) => (bare.includes(o) ? `«${o.label}»` : o.label)).join(' '),
              );
            }
          }
          // گزینهٔ بی‌برچسب یعنی دکمهٔ خالی — کودک چیزی برای انتخاب نمی‌بیند.
          if (r.options.some((o) => o.label === undefined || o.label === null || o.label === '')) {
            errors.push(`${lesson.id}/${rd.kind}: گزینهٔ بدون برچسب`);
          }
        }
      }
    }
  }
  for (const [kind, sampleOpts] of wordOnly) {
    errors.push(`${kind}: همهٔ گزینه‌ها فقط واژه‌اند (${sampleOpts}) — کودک پیش‌خوان نمی‌تواند حل کند`);
  }
  for (const [where, sampleOpts] of mixed) {
    errors.push(`${where}: بعضی گزینه‌ها تصویر دارند و بعضی فقط واژه (${sampleOpts}) — پاسخ لو می‌رود`);
  }
  if (!wordOnly.size && !mixed.size) {
    console.log('✓ هیچ گِردی فقط با واژه پرسیده نمی‌شود و هیچ گِردی نیمه‌تصویری نیست.');
  }
}

// ردهٔ سنی باید واقعاً اثر داشته باشد: تعداد گزینه‌ها باید فرق کند.
const sample = LESSONS.flatMap((l) => l.rounds).find((r) => r.kind === 'count-objects');
if (sample) {
  const counts = TRACK_ORDER.map((t) => buildRound(sample, AGE_TRACKS[t]).options.length);
  if (new Set(counts).size === 1) {
    errors.push(`ردهٔ سنی بی‌اثر است: تعداد گزینه در هر سه رده ${counts[0]} است`);
  } else {
    console.log(`تعداد گزینه بر حسب سن: ${TRACK_ORDER.map((t, i) => `${AGE_TRACKS[t].label}=${counts[i]}`).join('، ')}`);
  }
}

console.log(`${checks} گِرد ساخته و بررسی شد.`);
if (errors.length) {
  const shown = [...new Set(errors)].slice(0, 25);
  console.log(`\nخطا (${errors.length}، یکتا ${new Set(errors).size}):`);
  shown.forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('✓ همهٔ گِردها در هر سه ردهٔ سنی سالم‌اند.');

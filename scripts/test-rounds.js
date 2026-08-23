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
        }

        if (r.type === 'order') {
          if (!r.items?.length) errors.push(`${tag}: بدون آیتم`);
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

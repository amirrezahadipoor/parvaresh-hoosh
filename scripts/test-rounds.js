// موتور گِرد را روی همهٔ درس‌ها و هر سه ردهٔ سنی اجرا می‌کند.
//
// هدف: مطمئن شویم هیچ گِردی خطا نمی‌دهد، پاسخ درست همیشه بین گزینه‌هاست،
// و ردهٔ سنی واقعاً روی خروجی اثر می‌گذارد.

import { LIFE_CYCLES } from '../src/data/science-data.js';
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
        // ⚠ الگوی قبلی {[a-z]} فقط جای‌نگهدارِ تک‌حرفی را می‌گرفت، پس
        // «کدام {trait}؟» بی‌سروصدا رد شد و تا صفحهٔ کودک رسید.
        // هر {…} پر نشده باگ است، چند حرفی هم که باشد.
        if (/\{[a-zA-Z]+\}/.test(r.prompt)) {
          errors.push(`${tag}: جای‌نگهدار پر نشده: ${r.prompt}`);
        }

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
          // ⚠ «لو رفتن» یعنی کودک بتواند بدون فکر، متنِ بالای صفحه را
          // روی یک گزینه پیدا کند. پس مقایسه باید با آنچه *دیده*
          // می‌شود باشد، نه با مقدار داخلیِ گزینه.
          //
          // این تمایز با گِردِ word-pic روشن شد: واژه بالا نوشته
          // می‌شود و گزینه‌ها فقط تصویرند (بی‌برچسب). مقدار داخلی
          // گزینه همان رشتهٔ واژه است، پس مقایسهٔ خام ۱۱۰۰ خطای
          // دروغین ساخت — در حالی که کودک هیچ متنی روی گزینه‌ها
          // نمی‌بیند و *باید* بخواند. این دقیقاً هدفِ تمرین است.
          //
          // برچسب فقط وقتی دیده می‌شود که گزینه نشانهٔ تصویری نداشته
          // باشد، یا صریحاً یکی از پرچم‌های برچسب را داشته باشد
          // (همان شرطی که screens.js برای رسمِ .pic-label دارد).
          const isVisibleText = (o) => {
            const cued = o.pic || o.geo || o.shapeRepeat || o.latin || o.dots || o.swatch || o.spot;
            if (!cued) return true;
            return Boolean(o.picLabel || o.latinLabel || o.geoLabel);
          };
          const answerOpt = r.options.find((o) => String(o.value) === String(r.answer));
          const answerText = answerOpt && isVisibleText(answerOpt) ? String(answerOpt.label) : null;
          if (answerText !== null && shown.includes(answerText)) {
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
    // letter-sound از این فهرست حذف شد: گزینه‌هایش یک نویسه‌اند و
    // قاعدهٔ عمومیِ isGlyph حالا آن را پوشش می‌دهد. فهرست استثنا هر
    // چه کوتاه‌تر، صادق‌تر.
    'letter-word',
    'letter-in-word',
    'blend-word',
    // pic-sentence جمله‌ها را در گزینه می‌گذارد و تصویر را در صحنه.
    // این عمدی است و *خودِ* مهارتی است که آموزش می‌دهد: کودک باید
    // جمله را بخواند تا بفهمد کدام به تصویر می‌خورد. همهٔ بدل‌ها
    // هم‌تصویرند («سگ دوید» کنار «سگ خوابید»)، پس تصویر پاسخ را لو
    // نمی‌دهد و راهی جز خواندن نیست. این درس‌ها از نشانهٔ چهاردهم به
    // بعد می‌آیند، جایی که کودک دیگر کلمه‌خوان است.
    'pic-sentence',
    // pic-word دقیقاً همان الگو در سطح واژه است: تصویر در صحنه،
    // واژه‌ها در گزینه. اگر گزینه‌ها هم تصویر بگیرند، کودک شکل‌ها را
    // جفت می‌کند و هرگز نمی‌خواند — یعنی تمرین هدفش را از دست می‌دهد.
    'pic-word',
    'en-translate',
    // name-face پیوند «چهره ↔ واژه» را می‌آموزد و برای ردهٔ سنی
    // پایین خودش به feel-face تبدیل می‌شود.
    'name-face',
  ]);
  const isNumeric = (v) => /^[۰-۹0-9\s+\-−=]+$/.test(String(v ?? ''));
  // ⚠ «نشانه» واژه نیست.
  //
  // این تمایز با گِردهای first-sound و which-sound روشن شد: گزینه‌ها
  // یک نویسه‌اند («ب»، «ت»)، نه واژه‌ای که باید خوانده شود. کودک
  // پیش‌خوان هم آنها را می‌شناسد — شناختن نشانه اولین چیزی است که
  // در همین برنامه یاد می‌گیرد، و letter-sound از روز اول همین کار
  // را می‌کند.
  //
  // معیار عمداً تنگ است: فقط یک نویسهٔ فارسی، یا نام یکی از سه
  // مصوت بلند. «ما» و «پا» هم دو نویسه‌اند ولی واژه‌اند، پس فهرست
  // مصوت‌ها صریح نوشته شده و قاعدهٔ «هر دو نویسه» به کار نرفته.
  const VOWEL_NAMES = new Set(['آ', 'ای', 'او', 'اَ', 'اِ', 'اُ']);
  const isGlyph = (v) => {
    const t = String(v ?? '').trim();
    return VOWEL_NAMES.has(t) || (t.length === 1 && /[\u0600-\u06FF]/.test(t));
  };
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
          // ⚠ هر کلید نشانهٔ تازه باید اینجا هم شناخته شود، وگرنه
          // گِردِ کاملاً تصویری «همه‌واژه‌ای» گزارش می‌شود. `spot`
          // صحنهٔ کوچکِ جای‌گیری است (بالا/وسط/پایین) و کودک از روی
          // خودِ چیدمان می‌فهمد، نه از روی واژه.
          const bare = r.options.filter(
            (o) => !o.pic && !o.geo && !o.shapeRepeat && !o.latin && !o.dots && !o.swatch && !o.spot,
          );
          const words = bare.filter((o) => !isNumeric(o.label) && !isGlyph(o.label));
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

// ── گزینهٔ «نادرست»ی که در واقع درست است ────────────────────────────
//
// این باگ را هیچ‌کدام از بررسی‌های بالا نمی‌گیرد: گِرد ساختار سالمی
// دارد، پاسخ در گزینه‌ها هست، همه تصویر دارند — ولی یک گزینهٔ دیگر
// هم واقعاً درست است و کودکی که آن را می‌زند به‌ناحق «اشتباه» می‌شود.
//
// نمونهٔ واقعی: در life-cycle-next تصویر «تخم» نشان داده می‌شد و
// «جوجه» جزو گزینه‌های نادرست بود — در حالی که تخم سرِ چرخهٔ جوجه هم
// هست. کودکی که جوجه را انتخاب می‌کرد درست گفته بود.
{
  const nextStages = (shown) =>
    new Set(
      LIFE_CYCLES.flatMap((c) => {
        const k = c.steps.indexOf(shown);
        return k >= 0 && k < c.steps.length - 1 ? [c.steps[k + 1]] : [];
      }),
    );
  const found = new Set();
  const rd = { kind: 'life-cycle-next', prompt: 'بعد از این چه می‌شود؟' };
  for (const track of TRACK_ORDER) {
    for (let i = 0; i < 600; i++) {
      const r = buildRound(rd, AGE_TRACKS[track]);
      const valid = nextStages(r.display.icon);
      for (const o of r.options) {
        if (o.value !== r.answer && valid.has(o.value)) {
          found.add(`${r.display.icon}: پاسخ «${r.answer}» ولی «${o.value}» هم درست است`);
        }
      }
    }
  }
  if (found.size) {
    [...found].forEach((f) => errors.push(`life-cycle-next: ${f}`));
  } else {
    console.log('✓ چرخهٔ زندگی: هیچ گزینهٔ نادرستی در واقع درست نیست.');
  }
}

// ── تنوعِ واقعی: آیا کودک یاد می‌گیرد یا حفظ می‌کند؟ ────────────────
//
// ⚠ این گارد پس از پیدا شدن یک باگِ خاموش نوشته شد.
//
// گِرد «او چه حسی دارد؟» فقط هفت موقعیت داشت و در عمل **سه پرسش
// متمایز** می‌ساخت. کودک بعد از دو بار بازی، جفتِ «تصویر ← پاسخ»
// را حفظ می‌کرد نه *احساس* را. همهٔ آزمون‌ها سبز بودند: ساختار
// سالم، پاسخ درست، تصویر موجود. ولی درس چیزی نمی‌آموخت.
//
// بدتر از آن: دو احساس («عصبانی» و «متعجب») چهره داشتند ولی هیچ
// موقعیتی نداشتند، یعنی هرگز پاسخ نمی‌شدند و فقط بدل بودند.
//
// معیار: گِردی که در ۴۰ ساخت کمتر از سه *صحنهٔ* متمایز تولید کند،
// حفظ‌کردنی است نه یادگرفتنی. صحنه = چیزی که کودک می‌بیند
// (تصویر یا متنِ صحنه)، نه پرسشِ ثابتِ بالای صفحه.
//
// گِردهایی که درس عمداً پارامترشان را ثابت کرده (مثل
// letter-trace با یک حرف مشخص) استثنا هستند: آنجا تکرار خودِ هدف
// است، نه تنبلیِ داده.
{
  const lowVariety = [];
  for (const lesson of LESSONS) {
    for (const rd of lesson.rounds) {
      // درس اگر خودش موضوع را قفل کرده، تنوع را از او نمی‌خواهیم.
      // ⚠ فهرست باید *هر* کلیدی را که درس موضوع را با آن قفل می‌کند
      // بشناسد، وگرنه گارد مثبتِ کاذب می‌دهد. `cycle` جا افتاده بود
      // و درسِ «رشد گیاه را بچین» را — که عمداً همیشه گیاه است —
      // به‌عنوان کم‌تنوع گزارش می‌کرد.
      const pinned = rd.situation || rd.emotion || rd.letter !== undefined
        || rd.digit !== undefined || rd.category || rd.sequence || rd.items
        || rd.topic || rd.group || rd.word || rd.cycle || rd.want
        || rd.unit || rd.op !== undefined || rd.step !== undefined;
      if (pinned) continue;

      // ⚠ معیار باید *کلِ چیزی که کودک می‌بیند* باشد، نه فقط صحنه.
      // نخست فقط `display` را می‌شمردم و ۶ مثبتِ کاذب داد: گِردهایی
      // مثل float-sink صحنهٔ ثابت دارند ولی ۱۵ مجموعهٔ گزینهٔ
      // متفاوت — یعنی هر بار پرسشِ تازه‌ای است.
      //
      // حفظ‌کردنی یعنی صحنه *و* گزینه‌ها هر دو تکراری باشند.
      const views = new Set();
      for (let i = 0; i < 40; i++) {
        let r;
        try {
          r = buildRound(rd, AGE_TRACKS.school);
        } catch {
          continue;
        }
        if (!r) continue;
        const d = r.display;
        const scene = d
          ? `${d.kind}:${d.icon ?? d.value ?? d.letter ?? d.total ?? d.times ?? d.filled ?? d.groups ?? ''}`
          : '';
        // ⚠ برچسبِ گزینه تنها بخشی از آنچه کودک می‌بیند نیست:
        // گِرد position برچسب ثابت دارد («بالا/وسط/پایین») ولی
        // *تصویرِ* داخل هر گزینه عوض می‌شود. پس نشانهٔ دیداری هم
        // باید در کلید بیاید، وگرنه گِردِ متنوع کم‌تنوع شمرده می‌شود.
        const opts = (r.options ?? r.items ?? r.cards ?? [])
          .map((o) => `${o.label ?? o.icon ?? ''}~${o.pic ?? o.spot?.icon ?? ''}`)
          .sort()
          .join('|');
        views.add(`${scene}##${opts}`);
      }
      if (views.size > 0 && views.size < 3) {
        const tag = `${rd.kind}`;
        if (!lowVariety.some((x) => x.startsWith(tag + ':'))) {
          lowVariety.push(`${tag}: فقط ${views.size} نمای متمایز در ۴۰ ساخت (${lesson.id}) — کودک حفظ می‌کند، یاد نمی‌گیرد`);
        }
      }
    }
  }
  if (lowVariety.length) {
    lowVariety.forEach((m) => errors.push(m));
  } else {
    console.log('✓ هیچ گِردی آن‌قدر کم‌تنوع نیست که حفظ‌کردنی شود.');
  }
}

// ── هر احساس باید دست‌کم یک بار پاسخ باشد ──────────────────────────
//
// ⚠ «چهره داشتن» کافی نیست. اگر احساسی هیچ موقعیتی نداشته باشد،
// همیشه در نقش بدل ظاهر می‌شود و کودک هرگز یاد نمی‌گیرد آن حس چه
// شکلی است — دقیقاً وضعیت «عصبانی» و «متعجب» پیش از این بازبینی.
{
  const answered = new Set();
  const shown = new Set();
  for (const lesson of LESSONS) {
    for (const rd of lesson.rounds) {
      if (rd.kind !== 'feel-face' && rd.kind !== 'name-face') continue;
      for (let i = 0; i < 60; i++) {
        let r;
        try {
          r = buildRound(rd, AGE_TRACKS.school);
        } catch {
          continue;
        }
        if (!r) continue;
        answered.add(String(r.answer));
        for (const o of r.options ?? []) shown.add(String(o.label));
      }
    }
  }
  const neverAnswer = [...shown].filter((f) => !answered.has(f));
  if (neverAnswer.length) {
    errors.push(
      `احساس‌های ${neverAnswer.join('، ')} هرگز پاسخ نمی‌شوند و فقط بدل‌اند — کودک یادشان نمی‌گیرد`,
    );
  } else if (answered.size) {
    console.log(`✓ هر ${answered.size} احساس دست‌کم یک بار پاسخ است، نه فقط بدل.`);
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

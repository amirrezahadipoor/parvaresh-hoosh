// Keep the narration wiring in sync with whatever clips exist on disk.
//
// Three places have to agree or narration breaks in confusing ways:
//   1. src/data/narration-map.js  - spoken text -> clip id
//   2. src/core/audio.js          - AVAILABLE_CLIPS guard (stops 404s)
//   3. sw.js                      - PRECACHE list (offline support)
// Editing them by hand each time a batch of clips lands is how entries get
// missed, so this script regenerates all three from assets/audio/kid/.
//
//   node scripts/sync_narration.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KID = path.join(ROOT, 'assets', 'audio', 'kid');
const clips = fs.readdirSync(KID).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)).sort();

// Persian letter names, matching src/data/alphabet.js exactly.
const LETTER_NAMES = {
  alef:'الف', be:'بِ', pe:'پِ', te:'تِ', se:'ثِ', jim:'جیم', che:'چِه', he:'حِ',
  khe:'خِ', dal:'دال', zal:'ذال', re:'رِ', ze:'زِ', zhe:'ژِ', sin:'سین', shin:'شین',
  sad:'صاد', zad:'ضاد', ta:'طا', za:'ظا', eyn:'عین', gheyn:'غین', fe:'فِ', ghaf:'قاف',
  kaf:'کاف', gaf:'گاف', lam:'لام', mim:'میم', nun:'نون', vav:'واو', heh:'هِ', ye:'یِ'
};

// Prompt lines that are not letters. Several texts intentionally share a clip
// because the activities word the same instruction slightly differently.
const PROMPTS = {
  't1-01-memory': ['کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن',
                   'کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن گل من!'],
  't1-02-order-size': ['تصاویر را از کوچک به بزرگ بچین'],
  't1-03-good-behavior': ['کدام رفتار خوب و درست است؟'],
  't1-04-story-order': ['داستان را از اول تا آخر مرتب کن'],
  't1-05-painting': ['هر چی دوست داری با رنگ‌های شاد نقاشی کن!',
                     'هر چی دوست داری با رنگ‌های شاد نقاشی کن گل من!'],
  't1-06-sort-behavior': ['رفتار خوب را از رفتار بد جدا کن'],
  't1-07-next-color': ['رنگ بعدی در الگو کدام است؟'],
  't1-08-next-shape': ['شکل بعدی در الگو کدام است؟'],
  't1-09-complete-pattern': ['شکل کامل‌کننده الگو را پیدا کن'],
  't1-10-order-words': ['کلمه‌ها را مرتب کن'],
  't1-11-match-material': ['هر وسیله را به جنس خودش وصل کن'],
  't1-12-shadow': ['سایه دقیق این تصویر را پیدا کن!'],
  't2-13-balance': ['کدام کفه ترازو سنگین‌تر است؟',
                    'کدام کفه ترازو به سمت پایین رفته و سنگین‌تر است؟'],
  't2-14-build-sentence': ['کلمات را به ترتیب درست بچین تا جمله ساخته شود'],
  't2-15-smaller-number': ['کدام عدد کوچک‌تر است؟'],
  't2-16-bigger-number': ['کدام عدد بزرگ‌تر است؟'],
  't2-17-odd-one-out': ['کدام تصویر با بقیه فرق دارد؟'],
  't2-18-color-purple': ['رنگ بنفش را انتخاب کن'],
  't2-19-opposites': ['کلمه‌ها را به متضادشان وصل کن'],
  't2-20-color-green': ['رنگ سبز را انتخاب کن'],
  't2-21-color-red': ['رنگ قرمز را انتخاب کن'],
  't2-22-color-yellow': ['رنگ زرد را انتخاب کن'],
  't2-23-put-in-place': ['هر چیز را در جای درست بگذار'],
  't2-24-month-season': ['هر ماه مال کدام فصل است؟'],
  't2-25-emotion-situation': ['هر احساس مال کدام موقعیت است؟'],
  't2-26-color-blue': ['رنگ آبی را انتخاب کن'],
  't2-27-plant-growth': ['مراحل رشد گیاه را مرتب کن'],
  'fixed-balloons': ['بادکنک‌ها را لمس کن تا بترکند!'],
  'praise-great': ['آفرین!', 'عالی بود!', 'آفرین! عالی بود.'],
  'praise-retry': ['اشکالی ندارد، دوباره تلاش کن!'],
  'praise-lesson-done': ['درس تمام شد! آفرین به پشتکارت.'],
  't3-30-syllables': ['این بخش‌ها چه کلمه‌ای می‌سازند؟'],
  't3-31-friend-sad': ['وقتی دوستم ناراحت است:'],
  't3-32-new-friend': ['مراحل دوست شدن با بچهٔ تازه‌وارد:'],
  't3-33-sort-animals-fruit': ['حیوانات و میوه‌ها را جدا کن'],
  't3-34-remember-bells': ['صدای زنگ‌ها را به خاطر بسپار!'],
  't3-35-order-colors': ['رنگ‌ها را به ترتیب بچین'],
  't3-36-remember-tray': ['تصاویر سینی را به خاطر بسپار!'],
  't3-37-black-white-mix': ['سیاه و سفید با هم چه رنگی می‌سازند؟'],
  't3-39-fill-blank': ['جای خالی را پر کن'],
  // "چند تا شکل می‌بینی؟ سه تا" and friends differ only by the answer word, so
  // one recording of the question serves every variant via the prefix rule below.
  't3-38-how-many-shapes': ['چند تا شکل می‌بینی؟'],
};

// Clips generated in bulk by scripts/generate_missing_audio.py for lines that
// the content generator produces dynamically (maths questions, colour mixing,
// shape prompts, riddles...). Their text lives in a manifest next to the audio
// so this script stays the single source of truth for the wiring.
const AUTO_MANIFEST = path.join(KID, 'auto-manifest.json');
const auto = fs.existsSync(AUTO_MANIFEST)
  ? JSON.parse(fs.readFileSync(AUTO_MANIFEST, 'utf8'))
  : {};

const map = {};
// Some generated prompts append the answer to a fixed question. Registering the
// question alone is not enough because speak() looks up the exact string, so the
// variants are expanded here from the same clip.
const PREFIX_VARIANTS = {
  'چند تا شکل می‌بینی؟': ['یک تا', 'دو تا', 'سه تا', 'چهار تا', 'پنج تا', 'شش تا', 'هفت تا', 'هشت تا', 'نه تا', 'ده تا']
};
for (const clip of clips) {
  if (clip.startsWith('letter-')) {
    const name = LETTER_NAMES[clip.slice(7)];
    // Rounds ask for a letter in more than one wording. Register every form
    // that appears in the content so a clip is never missed on a phrasing
    // difference; short clips are recorded once and reused for all of them.
    // Every letter clip is recorded with the same wording the rounds use, so a
    // single key is enough. Registering bare letter names as keys was tried and
    // removed: it made common words collide with letter clips.
    if (name) map[`صدای حرف ${name}`] = clip;
  } else if (PROMPTS[clip]) {
    for (const text of PROMPTS[clip]) {
      map[text] = clip;
      const variants = PREFIX_VARIANTS[text];
      if (variants) for (const v of variants) map[`${text} ${v}`] = clip;
    }
  }
}

// Bulk-generated lines are one-text/one-file and therefore override old shared
// prompt clips. The only exception is a letter lesson: its richer, deliberately
// authored explanation (e.g. «ثِ سه‌نقطه») must keep the stable letter-* id.
const clipSet = new Set(clips);
let autoAdded = 0, autoOrphan = 0;
for (const [text, clip] of Object.entries(auto)) {
  if (!clipSet.has(clip)) { autoOrphan++; continue; }
  if (map[text] && String(map[text]).startsWith('letter-')) continue;
  map[text] = clip;
  autoAdded++;
}

// 1) narration-map.js
fs.writeFileSync(path.join(ROOT, 'src/data/narration-map.js'),
  '// GENERATED by scripts/sync_narration.js -- do not edit by hand.\n' +
  '// Spoken line -> recorded child-voice clip in assets/audio/kid/.\n' +
  '// Clips are AI-generated speech, pitch +28% with formant shifting.\n' +
  'window.NARRATION_MAP = ' + JSON.stringify(map, null, 2) + ';\n', 'utf8');

// 2) AVAILABLE_CLIPS in audio.js
const audioPath = path.join(ROOT, 'src/core/audio.js');
let audio = fs.readFileSync(audioPath, 'utf8');
const setLit = '    const AVAILABLE_CLIPS = new Set([\n' +
  clips.map(c => `        '${c}'`).join(',\n') + '\n    ]);\n';
audio = audio.replace(/ {4}const AVAILABLE_CLIPS = new Set\(\[[\s\S]*?\n {4}\]\);\n/, setLit);
fs.writeFileSync(audioPath, audio, 'utf8');

// 3) PRECACHE in sw.js. Rebuild the list rather than editing a stale list in
// place: every local index dependency must be present for a true cold offline
// launch of the unbundled PWA. prepare_web.js later swaps these source scripts
// for the production bundle in the shipped build.
const swPath = path.join(ROOT, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const indexRefs = [...indexHtml.matchAll(/(?:src|href)="([^"#?]+)"/g)]
  .map(match => match[1])
  .filter(ref => !/^(?:https?:|data:|blob:)/.test(ref))
  .map(ref => './' + ref.replace(/^\.\//, ''));
const shell = [...new Set([
  './', './index.html', './privacy.html', './terms.html',
  './content/curriculum.json', './content/content_manifest.json',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png',
  './assets/fonts/Vazirmatn-Regular.woff2', './assets/fonts/Vazirmatn-Medium.woff2',
  './assets/fonts/Vazirmatn-Bold.woff2', './assets/fonts/Vazirmatn-ExtraBold.woff2',
  './assets/fonts/Vazirmatn-Black.woff2',
  ...indexRefs
])];
const precache = [...shell, ...clips.map(clip => `./assets/audio/kid/${clip}.mp3`)];
const listLiteral = 'const PRECACHE = [\n' + precache.map(entry => `  '${entry}'`).join(',\n') + '\n];';
sw = sw.replace(/const PRECACHE\s*=\s*\[[\s\S]*?\n\];/, listLiteral);
fs.writeFileSync(swPath, sw, 'utf8');

const letters = clips.filter(c => c.startsWith('letter-')).length;
console.log(`clips: ${clips.length} | letters: ${letters}/32 | map entries: ${Object.keys(map).length} | auto: ${autoAdded}${autoOrphan ? ` (${autoOrphan} orphan)` : ''}`);

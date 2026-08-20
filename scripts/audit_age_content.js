// Guard: every generated round must make sense FOR THE CHILD'S AGE.
//
// This exists because real, shipped bugs were only visible when the rounds were
// generated with an actual child age attached:
//
//   * «کدام گزینه با بقیه متفاوت است؟» was trimmed to TWO options for ages 4-5.
//     With two pictures there is no odd one - each differs from the other - so
//     the question was unanswerable. ~380 such rounds per pass.
//   * Long prompts leaked past the pre-reader gate because the gate only
//     inspected `quiz` rounds, so an order-steps round could open with
//     «رنگ‌ها را به همان ترتیبی که گفته شد بچین: قرمز ← سبز ← زرد».
//
// Run: node scripts/audit_age_content.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

// ------------------------------------------------------------- boot the app --
function boot() {
    const order = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .matchAll(/src="([^"]*\.js)"/g)].map(m => m[1]).filter(p => !p.includes('vendor'));
    const stub = () => ({
        style: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
        appendChild() {}, setAttribute() {}, addEventListener() {},
        querySelector: () => null, querySelectorAll: () => [], innerHTML: '', textContent: '',
        dataset: {}, children: [], remove() {}, insertBefore() {}, cloneNode() { return stub(); },
        getContext: () => null
    });
    const doc = {
        createElement: stub, createElementNS: stub, createDocumentFragment: stub,
        querySelector: () => null, querySelectorAll: () => [], addEventListener() {},
        getElementById: () => null, body: stub(), documentElement: stub(), head: stub()
    };
    const win = {
        document: doc,
        localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
        addEventListener() {}, navigator: { userAgent: 'node' }, location: { href: '', search: '' },
        matchMedia: () => ({ matches: false, addEventListener() {} }),
        requestAnimationFrame: () => 0, cancelAnimationFrame() {},
        setTimeout, clearTimeout, setInterval: () => 0, clearInterval() {},
        Audio: function () { return { play: () => Promise.resolve(), pause() {} }; },
        AudioContext: function () {
            return {
                createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: { value: 0 } }),
                createGain: () => ({ connect() {}, gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} } }),
                destination: {}, currentTime: 0, state: 'running', resume() {}
            };
        },
        screen: { width: 400, height: 800 }, innerWidth: 400, innerHeight: 800,
        getComputedStyle: () => ({ getPropertyValue: () => '' })
    };
    win.window = win; win.self = win; win.globalThis = win;
    const ctx = vm.createContext(win);
    vm.runInContext(`
        let __randomState = 0x51a7e123;
        Math.random = () => {
            __randomState = (Math.imul(__randomState, 1664525) + 1013904223) >>> 0;
            return __randomState / 0x100000000;
        };
    `, ctx);
    for (const file of order) {
        try { vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file }); }
        catch (err) { console.error('load error', file, err.message.slice(0, 80)); }
    }
    return win;
}

function allLessons() {
    const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));
    const out = [];
    for (const domain of curriculum.domains)
        for (const level of domain.levels)
            for (const lesson of level.lessons)
                out.push({ ...lesson, domain: domain.id });
    return out;
}

// --------------------------------------------------------------- the rules --
// Prompt/option ceilings mirror TRACK_RULES in generator.js. Ages 6+ read, so
// only the pre-reader tracks have a text budget.
const AGE_RULES = {
    4: { maxPrompt: 46 },
    5: { maxPrompt: 52 },
    6: {},
    7: {},
    8: {}
};

// Question forms that are meaningless with fewer than three choices.
const NEEDS_THREE = /فرق دارد|متفاوت|ناجور|وصله|با بقیه/;

const win = boot();
const Generator = win.Generator;
const lessons = allLessons();
const PASSES = Number(process.env.AGE_AUDIT_PASSES || 4);

const errors = [];
const counts = { rounds: 0, oddOneOut: 0 };

for (const age of Object.keys(AGE_RULES).map(Number)) {
    const rules = AGE_RULES[age];
    for (const lesson of lessons) {
        const metadata = {
            domain: lesson.domain, id: lesson.id, title: lesson.title,
            difficulty: lesson.difficulty, ageBand: lesson.ageBand, type: lesson.type,
            childAge: age
        };
        for (let pass = 0; pass < PASSES; pass++) {
            let rounds;
            try { rounds = Generator.generate(lesson.id, metadata) || []; }
            catch (err) { errors.push(`${lesson.id} age ${age}: generate threw ${err.message}`); continue; }

            for (const round of rounds) {
                counts.rounds++;
                const prompt = String(round.prompt || round.speech || '').trim();
                const options = Array.isArray(round.options) ? round.options : null;

                // 1. set-based questions need at least three choices
                if (NEEDS_THREE.test(prompt)) {
                    counts.oddOneOut++;
                    if (options && options.length < 3) {
                        errors.push(`${lesson.id} age ${age}: "${prompt.slice(0, 40)}" has only ${options.length} options - unanswerable`);
                    }
                }

                // 2. the answer must be a real index
                if (options && !(Number.isInteger(round.answer) && round.answer >= 0 && round.answer < options.length)) {
                    errors.push(`${lesson.id} age ${age}: answer index ${round.answer} out of range (${options.length} options)`);
                }

                // 3. pre-readers must not be given a wall of text
                if (rules.maxPrompt && prompt.length > rules.maxPrompt) {
                    errors.push(`${lesson.id} age ${age}: prompt ${prompt.length} chars > ${rules.maxPrompt} - "${prompt.slice(0, 46)}"`);
                }

                // 4. pre-readers must not be given word-only answers.
                //    Digits and single glyphs are symbols they are learning, not reading.
                if (rules.maxPrompt && options) {
                    for (const option of options) {
                        if (!option || option.img || option.tile) continue;
                        const label = String(option.label || option.text || '').trim();
                        if (!label) continue;
                        if (/^[۰-۹0-9]+$/.test(label)) continue;
                        if ([...label].length <= 1) continue;
                        errors.push(`${lesson.id} age ${age}: word-only option "${label}" with no picture`);
                    }
                }
            }
        }
    }
}

// De-duplicate: one line per distinct problem is enough to act on.
const unique = [...new Set(errors)];
console.log(JSON.stringify({
    lessons: lessons.length,
    passesPerAge: PASSES,
    roundsChecked: counts.rounds,
    oddOneOutRoundsChecked: counts.oddOneOut,
    distinctProblems: unique.length
}, null, 2));

if (unique.length) {
    console.error('\nFAIL: age-inappropriate content generated.');
    unique.slice(0, 25).forEach(e => console.error('  - ' + e));
    if (unique.length > 25) console.error(`  ... and ${unique.length - 25} more`);
    process.exit(1);
}
console.log('\nOK: sampled rounds passed the project\'s answerability and age-band rules for ages 4-8.');

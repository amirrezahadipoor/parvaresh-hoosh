// Comprehensive Multi-Round Activity Generator for "پرورش هوش کودک"
// Dynamically generates 5 balanced, progressive, interactive rounds for any lesson ID
window.Generator = (function() {

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function rint(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function toFaDigit(n) {
        const faMap = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(n).split('').map(ch => faMap[ch] !== undefined ? faMap[ch] : ch).join('');
    }

    function toFaWord(n) {
        const obj = (window.NUMBERS || []).find(x => x.n === n);
        return obj ? obj.fa : String(n);
    }

    function mc(prompt, img, options, correctIdx, speechText) {
        return {
            type: 'quiz',
            prompt,
            img,
            options,
            answer: correctIdx,
            speech: speechText || prompt
        };
    }

    // ==========================================
    // 1. RAVEN'S MATRICES FOR KIDS
    // ==========================================
    function ravenRound() {
        const shapeTypes = ['circle', 'square', 'triangle', 'diamond'];
        const colors = ['#FF4757', '#1E90FF', '#2ED573', '#FFA502'];

        const baseShape = pick(shapeTypes);
        const secondShape = pick(shapeTypes.filter(s => s !== baseShape));

        const grid = [
            SvgArt.shape(baseShape, colors[0], 88),
            SvgArt.shape(baseShape, colors[1], 88),
            SvgArt.shape(secondShape, colors[0], 88)
        ];

        const correctImg = SvgArt.shape(secondShape, colors[1], 88);
        const distractors = [
            SvgArt.shape(secondShape, colors[2], 88),
            SvgArt.shape(baseShape, colors[1], 88),
            SvgArt.shape(secondShape, colors[0], 88)
        ];

        const allOpts = shuffle([{ img: correctImg, isCorrect: true }, ...distractors.map(d => ({ img: d, isCorrect: false }))]);
        const answerIdx = allOpts.findIndex(x => x.isCorrect);

        return {
            type: 'raven-matrix',
            grid,
            options: allOpts,
            answer: answerIdx,
            speech: 'شکل کامل‌کننده الگو را پیدا کن'
        };
    }

    // ==========================================
    // 2. SHADOW SILHOUETTE MATCH
    // ==========================================
    function shadowRound() {
        const pool = ['cat', 'dog', 'rabbit', 'lion', 'elephant', 'apple', 'car', 'tree', 'flower'];
        const targetKey = pick(pool);
        const isAnimal = ['cat', 'dog', 'rabbit', 'lion', 'elephant'].includes(targetKey);

        const originalImg = isAnimal ? SvgArt.animal(targetKey, 112) : SvgArt.object(targetKey, 112);
        const correctShadow = originalImg;

        const otherKeys = shuffle(pool.filter(k => k !== targetKey)).slice(0, 2);
        const distractorShadows = otherKeys.map(k => {
            return ['cat', 'dog', 'rabbit', 'lion', 'elephant'].includes(k) ? SvgArt.animal(k, 112) : SvgArt.object(k, 112);
        });

        const allShadows = shuffle([
            { img: correctShadow, isCorrect: true },
            ...distractorShadows.map(img => ({ img, isCorrect: false }))
        ]);

        return {
            type: 'shadow-match',
            originalImg,
            shadowOptions: allShadows,
            answer: allShadows.findIndex(x => x.isCorrect),
            speech: 'سایه دقیق این تصویر را پیدا کن!'
        };
    }

    // ==========================================
    // 3. BALANCE SCALE
    // ==========================================
    function balanceRound() {
        const leftCount = rint(1, 4);
        let rightCount = rint(1, 4);
        while (rightCount === leftCount) rightCount = rint(1, 4);

        return {
            type: 'balance-scale',
            leftCount,
            rightCount,
            speech: 'کدام کفه ترازو سنگین‌تر است؟'
        };
    }

    // ==========================================
    // 4. SIMON SEQUENCE
    // ==========================================
    function simonRound(len) {
        return {
            type: 'simon-memory',
            length: len || 3,
            speech: 'صدای زنگ‌ها را به خاطر بسپار!'
        };
    }

    // ==========================================
    // 5. DISAPPEARED ITEM
    // ==========================================
    function disappearedRound() {
        return {
            type: 'disappeared-item',
            speech: 'تصاویر سینی را به خاطر بسپار!'
        };
    }

    // ==========================================
    // 6. READING & LITERACY ROUNDS
    // ==========================================
    // ---------------------------------------------------------------------
    // Lesson-accurate letter selection.
    // Lessons are titled e.g. «صدای الفبا: اَ - ب - پ - ت» but used to draw a
    // RANDOM letter from the whole alphabet, so the "اَ ب پ ت" lesson would ask
    // about «گ» or «ش». Parse the title and teach only those letters.
    // ---------------------------------------------------------------------
    function lessonLetters(metadata) {
        const title = (metadata && metadata.title) || '';
        const after = title.includes(':') ? title.slice(title.indexOf(':') + 1) : '';
        if (!after) return null;
        const found = [];
        for (const ch of after) {
            const hit = ALPHABET.find(l => l.letter === ch);
            if (hit && !found.includes(hit)) found.push(hit);
        }
        return found.length ? found : null;
    }

    // Words that actually have drawn artwork, so options are real pictures.
    function hasRealArt(word) {
        return !!(ANIMAL_IMG[word] || OBJECT_IMG[word] || SHAPE_IMG[word] || SEASON_IMG[word]);
    }

    function bestWordForLetter(letterObj) {
        const words = FIRST_SOUND_WORDS[letterObj.letter] || [letterObj.example];
        return words.find(hasRealArt) || words[0];
    }

    // Map each letter to its bundled narration clip id (assets/audio/letter-<id>.mp3).
    const LETTER_AUDIO = {
        'ا':'alef','ب':'be','پ':'pe','ت':'te','ث':'se','ج':'jim','چ':'che','ح':'he',
        'خ':'khe','د':'dal','ذ':'zal','ر':'re','ز':'ze','ژ':'zhe','س':'sin','ش':'shin',
        'ص':'sad','ض':'zad','ط':'ta','ظ':'za','ع':'eyn','غ':'gheyn','ف':'fe','ق':'ghaf',
        'ک':'kaf','گ':'gaf','ل':'lam','م':'mim','ن':'nun','و':'vav','ه':'heh','ی':'ye'
    };

    function letterSoundRound(letterObj) {
        const correct = letterObj.letter;
        const others = shuffle(ALPHABET.filter(l => l.letter !== correct)).slice(0, 3);
        const opts = shuffle([correct, ...others.map(l => l.letter)]);
        const round = mc(
            `کدام حرف صدای «${letterObj.name}» است؟`,
            null,
            opts.map(l => ({ label: l, big: true })),
            opts.indexOf(correct),
            `صدای حرف ${letterObj.name}`
        );
        // Bundled narration for this exact letter, auto-played by the activity.
        round.audioClip = LETTER_AUDIO[correct] ? `letter-${LETTER_AUDIO[correct]}` : null;
        round.letter = correct;
        return round;
    }

    function letterExampleRound(letterObj) {
        // Prefer a word that has real drawn artwork so the child compares pictures,
        // not text tiles pretending to be pictures.
        const correctWord = bestWordForLetter(letterObj);
        const drawable = hasRealArt(correctWord);
        const others = pickOtherWords(letterObj.letter, 3, [], drawable);

        // Some letters (ص، ض، ظ، ع …) have no illustrated word. Ask about the WORD
        // rather than showing text tiles under a prompt that promises pictures.
        if (!drawable) {
            const opts = shuffle([correctWord, ...others].map(w => ({ label: w })));
            return mc(
                `کدام کلمه با حرف «${letterObj.letter}» شروع می‌شود؟`,
                null,
                opts,
                opts.findIndex(o => o.label === correctWord),
                `کدام کلمه با حرف ${letterObj.letter} شروع می‌شود؟`
            );
        }

        const correctImg = imgForWord(correctWord);
        const opts = shuffle([
            { label: correctWord, img: correctImg },
            ...others.map(w => ({ label: w, img: imgForWord(w) }))
        ]);
        const picRound = mc(
            `کدام تصویر با حرف «${letterObj.letter}» شروع می‌شود؟`,
            null,
            opts,
            opts.findIndex(o => o.label === correctWord),
            `کدام کلمه با حرف ${letterObj.letter} شروع می‌شود؟`
        );
        picRound.audioClip = LETTER_AUDIO[letterObj.letter] ? `letter-${LETTER_AUDIO[letterObj.letter]}` : null;
        picRound.audioAutoPlay = false;   // speaker button only — avoids repeating the intro
        picRound.letter = letterObj.letter;
        return picRound;
    }

    function firstSoundRound() {
        const keys = Object.keys(FIRST_SOUND_WORDS);
        const k = pick(keys);
        const correctWord = pick(FIRST_SOUND_WORDS[k]);
        const otherKey = pick(keys.filter(x => x !== k));
        const others = shuffle(FIRST_SOUND_WORDS[otherKey]).slice(0, 2);
        const opts = shuffle([correctWord, ...others]);
        return mc(
            `کدام کلمه با صدای «${k}» شروع می‌شود؟`,
            null,
            opts.map(w => ({ label: w, img: imgForWord(w) })),
            opts.indexOf(correctWord),
            `کدام کلمه با صدای ${k} شروع می‌شود؟`
        );
    }

    function rhymeRound() {
        const pair = pick(RHYMES);
        const correct = pair[1];
        const otherWords = shuffle(FREQUENT_WORDS.filter(w => w !== pair[0] && w !== correct)).slice(0, 2);
        const opts = shuffle([correct, ...otherWords]);
        return mc(
            `کدام کلمه با «${pair[0]}» هم‌قافیه و هم‌آهنگ است؟`,
            null,
            opts.map(w => ({ label: w, img: imgForWord(w) })),
            opts.indexOf(correct),
            `کدام کلمه با ${pair[0]} هم‌قافیه است؟`
        );
    }

    function syllableRound() {
        const w = pick(BLEND_WORDS_2.concat(BLEND_WORDS_3));
        const sylCount = w.syllables.length;
        const correctLabel = `${toFaDigit(sylCount)} بخش`;
        const options = ['۱ بخش', '۲ بخش', '۳ بخش', '۴ بخش'].map(l => ({ label: l }));
        const opts = shuffle(options);
        return mc(
            `کلمه «${w.word}» چند بخش (هجا) دارد؟`,
            imgForWord(w.word),
            opts,
            opts.findIndex(o => o.label === correctLabel),
            `${w.word} چند بخش دارد؟`
        );
    }

    function blendRound() {
        const w = pick(BLEND_WORDS_2.concat(BLEND_WORDS_3));
        const others = shuffle(pickOtherWords(null, 3, [w.word]));
        const opts = shuffle([w.word, ...others]).map(ww => ({ label: ww, img: imgForWord(ww) }));
        return mc(
            `حروف «${w.parts.join(' - ')}» کدام کلمه را می‌سازند؟`,
            null,
            opts,
            opts.findIndex(o => o.label === w.word),
            `این بخش‌ها چه کلمه‌ای می‌سازند؟`
        );
    }

    function sightWordRound() {
        // Only words with real artwork can be asked as "which word is this picture?".
        // Otherwise the stage showed a tile with the word printed on it and asked the
        // child to read that same word back — the answer was written on the question.
        const drawable = FREQUENT_WORDS.filter(hasRealArt);
        if (drawable.length >= 3) {
            const w = pick(drawable);
            const others = shuffle(drawable.filter(x => x !== w)).slice(0, 3);
            const opts = shuffle([w, ...others]);
            return mc(
                `این تصویر مربوط به کدام کلمه است؟`,
                imgForWord(w),
                opts.map(x => ({ label: x })),
                opts.indexOf(w),
                `تصویر ${w} را پیدا کن`
            );
        }
        // Fall back to a genuine reading task instead of a fake picture question.
        const w = pick(FREQUENT_WORDS);
        const others = shuffle(FREQUENT_WORDS.filter(x => x !== w)).slice(0, 3);
        const opts = shuffle([w, ...others]);
        return mc(
            `کدام یک واژهٔ «${w}» است؟`,
            null,
            opts.map(x => ({ label: x })),
            opts.indexOf(w),
            `واژهٔ ${w} را پیدا کن`
        );
    }

    function oppositeRound() {
        const pair = pick(OPPOSITES);
        const correct = pair.b;
        const others = shuffle(OPPOSITES.map(p => p.b).filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct, ...others]);
        return mc(
            `متضاد و مخالف کلمه «${pair.a}» چیست؟`,
            null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            `متضاد کلمه ${pair.a} کدام است؟`
        );
    }

    function wordMeaningRound() {
        const item = pick(WORD_MEANINGS);
        const correct = item.word;
        const others = shuffle(WORD_MEANINGS.map(m => m.word).filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct, ...others]);
        // This is a riddle: the child must infer the word from its description.
        // Showing a tile with the answer printed on it gave the whole thing away,
        // so only real artwork may illustrate it.
        return mc(
            `«${item.meaning}» — این نشانه کدام است؟`,
            null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            item.meaning
        );
    }

    function sentenceRound() {
        const s = pick(SENTENCE_POOL);
        const items = s.words.map((w, i) => ({ label: w, img: imgForWord(w), idx: i }));
        const shuffled = shuffle(items);
        return {
            type: 'order-steps',
            prompt: 'کلمات را مرتب کن تا جمله کامل ساخته شود:',
            items: shuffled,
            answer: 'idx',
            speech: 'کلمات را به ترتیب درست بچین تا جمله ساخته شود'
        };
    }

    // ==========================================
    // 7. MATHEMATICS ROUNDS
    // ==========================================
    // Candidate distractors for a numeric question, never exceeding the band the
    // child is working in. Falls back to a small spread when the band is tiny.
    function numberPool(max) {
        const hi = Math.max(2, Math.floor(Number(max) || 10));
        const pool = [];
        for (let v = 1; v <= hi; v++) pool.push(v);
        return pool;
    }

    function countRound(max) {
        const n = rint(1, max);
        const img = countImage(n);
        const faDigit = toFaDigit(n);
        // Distractors must stay inside the same band as the answer: "max + 2" pushed
        // a 4-year-old (ceiling 3) up to 5, and a 5-year-old up to 7.
        const others = shuffle(numberPool(max).filter(x => x !== n)).slice(0, 3);
        const opts = shuffle([n, ...others]);
        return mc(
            'چند تا شکل در تصویر می‌بینی؟',
            img,
            opts.map(x => ({ label: toFaDigit(x), big: true })),
            opts.indexOf(n),
            `چند تا شکل می‌بینی؟ ${toFaWord(n)} تا`
        );
    }

    function numberNameRound(max) {
        const n = rint(1, max);
        const others = shuffle(numberPool(max).filter(x => x !== n)).slice(0, 3);
        const opts = shuffle([n, ...others]);
        return mc(
            `عدد «${toFaWord(n)}» کدام است؟`,
            // Showing numberCard(n) printed the answer on the stage. Show that many
            // objects instead so the child links the spoken name to the numeral.
            n <= 10 ? countImage(n) : null,
            opts.map(x => ({ label: toFaDigit(x), big: true })),
            opts.indexOf(n),
            `عدد ${toFaWord(n)} را انتخاب کن`
        );
    }

    function numberOrderRound(max) {
        const hi = Math.max(2, Math.floor(Number(max) || 10));
        const a = rint(1, Math.max(1, hi - 1));
        const missing = a + 1;
        const others = shuffle(numberPool(max).filter(x => x !== missing)).slice(0, 3);
        const opts = shuffle([missing, ...others]);
        return mc(
            `عدد بعدی کدام است؟   ${toFaDigit(a)}  ←  ؟`,
            null,
            opts.map(x => ({ label: toFaDigit(x), big: true })),
            opts.indexOf(missing),
            `عدد بعد از ${toFaWord(a)} کدام است؟`
        );
    }

    function compareRound(max) {
        // `a + rint(1,4)` ignored the ceiling, so a toddler band of 3 produced 5.
        const hi = Math.max(3, Math.floor(Number(max) || 10));
        const a = rint(1, Math.max(1, hi - 1));
        const b = Math.min(hi, a + rint(1, Math.max(1, Math.min(4, hi - a))));
        const isBigger = Math.random() < 0.5;
        const correct = isBigger ? b : a;
        const opts = shuffle([a, b]);
        const qText = isBigger ? 'کدام عدد بزرگ‌تر است؟' : 'کدام عدد کوچک‌تر است؟';
        return mc(
            qText,
            null,
            opts.map(x => ({ label: toFaDigit(x), big: true })),
            opts.indexOf(correct),
            qText
        );
    }

    function arithRound(op, max) {
        let a, b, answer;
        if (op === '+') {
            a = rint(1, Math.max(1, max - 1));
            b = rint(1, Math.max(1, max - a));
            answer = a + b;
        } else if (op === '-') {
            a = rint(2, max);
            b = rint(1, a - 1);
            answer = a - b;
        } else {
            if (Math.random() < 0.5) {
                a = rint(1, Math.max(1, max - 1));
                b = rint(1, Math.max(1, max - a));
                answer = a + b;
                op = '+';
            } else {
                a = rint(2, max);
                b = rint(1, a - 1);
                answer = a - b;
                op = '-';
            }
        }

        const sign = op === '+' ? '+' : '−';
        const expr = `${toFaDigit(a)} ${sign} ${toFaDigit(b)} = ؟`;
        const img = arithImage(sign, a, b);
        // Distractors were drawn from a fixed 0..20 list regardless of the band, so
        // «۱ + ۲ = ؟» could offer ۱۳ to a five-year-old. Keep them near the answer
        // and inside the band, which also makes them pedagogically meaningful.
        const hi = Math.max(2, Math.floor(Number(max) || 10));
        const near = [];
        for (let d = 1; d <= hi; d++) {
            if (answer - d >= 0) near.push(answer - d);
            if (answer + d <= hi) near.push(answer + d);
        }
        const others = shuffle([...new Set(near)].filter(x => x !== answer)).slice(0, 3);
        const opts = shuffle([answer, ...others]);
        return mc(
            expr,
            img,
            opts.map(x => ({ label: toFaDigit(x), big: true })),
            opts.indexOf(answer),
            `${toFaWord(a)} ${op === '+' ? 'به اضافه' : 'منهای'} ${toFaWord(b)} چند می‌شود؟`
        );
    }

    function shapeNameRound() {
        const s = pick(SHAPES);
        const correct = s.fa;
        const others = shuffle(SHAPES.map(x => x.fa).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct, ...others]);
        return mc(
            'این چه شکلی است؟',
            SvgArt.shape(s.id, s.color, 128),
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            // The narration used to append the correct name ("این شکل چیست؟ مستطیل"),
            // so a child who listened never had to look at the shape. Ask only.
            'این چه شکلی است؟'
        );
    }

    function shapeMatchRound() {
        const s = pick(SHAPES);
        const others = shuffle(SHAPES.filter(x => x.id !== s.id)).slice(0, 3);
        const opts = shuffle([s, ...others]);
        return mc(
            `شکل «${s.fa}» را پیدا کن:`,
            null,
            opts.map(x => ({ img: SvgArt.shape(x.id, x.color, 94), label: '' })),
            opts.indexOf(s),
            `شکل ${s.fa} را انتخاب کن`
        );
    }

    // Renders the actual pattern the child is asked to continue. Both pattern
    // branches used to pass `null` as the stage image, so the round fell through
    // to a generic decorative fallback and the child had to guess the "next" item
    // of a sequence that was never drawn.
    function patternStrip(cells) {
        // A pattern must be read as ONE unbroken line; wrapping a 6-cell sequence
        // onto two rows destroys the left-to-right (here right-to-left) logic the
        // child is meant to infer. Size the cells to fit the row instead.
        const n = cells.length;
        const gap = 8;
        const size = Math.max(44, Math.min(84, Math.floor((352 - gap * (n - 1)) / n)));
        const html = cells.map(c => c === null
            ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:16px;border:3px dashed #B9A9F5;background:#F3EFFF;color:#6C5CE7;font-size:${Math.round(size * 0.5)}px;font-weight:800;">؟</span>`
            : `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;">${c}</span>`
        ).join('');
        return `<div dir="rtl" style="display:flex;flex-wrap:nowrap;align-items:center;justify-content:center;gap:${gap}px;max-width:340px;margin:0 auto">${html}</div>`;
    }

    function patternRound() {
        const p = pick(PATTERNS);
        if (p.type === 'color') {
            const correctColor = PATTERN_COLORS[p.answer];
            const others = shuffle(PATTERN_COLORS.filter(c => c !== correctColor)).slice(0, 2);
            const options = shuffle([correctColor, ...others]);
            const strip = patternStrip(p.seq.map(i => i === null ? null : SvgArt.shape('circle', PATTERN_COLORS[i], 92)));
            return mc(
                'کدام رنگ جای علامت سوال در الگو قرار می‌گیرد؟',
                strip,
                options.map(c => ({ img: SvgArt.shape('circle', c, 106), label: '' })),
                options.indexOf(correctColor),
                'رنگ بعدی در الگو کدام است؟'
            );
        } else {
            const correctShape = p.answer;
            const others = shuffle(SHAPES.map(s => s.id).filter(x => x !== correctShape)).slice(0, 2);
            const options = shuffle([correctShape, ...others]);
            const strip = patternStrip(p.seq.map(sid => sid === null ? null : SvgArt.shape(sid, '#6C5CE7', 92)));
            return mc(
                'کدام شکل جای علامت سوال در الگو قرار می‌گیرد؟',
                strip,
                options.map(sid => ({ img: SvgArt.shape(sid, '#6C5CE7', 106), label: '' })),
                options.indexOf(correctShape),
                'شکل بعدی در الگو کدام است؟'
            );
        }
    }

    // ==========================================
    // 8. LOGIC & PUZZLE ROUNDS
    // ==========================================
    function oddOneOutRound(kind) {
        if (kind === 'animals') {
            const land = ['cat', 'dog', 'rabbit', 'lion', 'bear'];
            const water = ['fish', 'turtle', 'duck'];
            const isWaterOdd = Math.random() < 0.5;

            let threeGroup = isWaterOdd ? shuffle(land).slice(0, 3) : shuffle(water).slice(0, 3);
            let singleOdd = isWaterOdd ? pick(water) : pick(land);

            const all = shuffle([...threeGroup, singleOdd]);
            const names = { cat: 'گربه', dog: 'سگ', rabbit: 'خرگوش', lion: 'شیر', bear: 'خرس', fish: 'ماهی', turtle: 'لاک‌پشت', duck: 'اردک' };
            const opts = all.map(a => ({ img: SvgArt.animal(a, 94), label: names[a] || a, id: a }));

            return mc(
                'کدام گزینه با بقیه متفاوت است؟',
                null,
                opts,
                opts.findIndex(o => o.id === singleOdd),
                'کدام تصویر با بقیه فرق دارد؟'
            );
        } else {
            const shapeIds = ['circle', 'triangle', 'square', 'oval', 'diamond'];
            const base = pick(shapeIds);
            const oddShape = pick(shapeIds.filter(s => s !== base));
            const all = shuffle([base, base, base, oddShape]);
            const opts = all.map(sid => ({ img: SvgArt.shape(sid, '#A29BFE', 94), label: '', id: sid }));

            return mc(
                'کدام شکل با بقیه فرق دارد؟',
                null,
                opts,
                opts.findIndex(o => o.id === oddShape),
                'شکل متفاوت را پیدا کن'
            );
        }
    }

    function orderSizeRound() {
        const obj = pick(['apple', 'ball', 'car', 'flower', 'tree', 'balloon']);
        const sizes = [45, 65, 88];
        const shuffled = shuffle(sizes.map(s => ({ size: s, img: SvgArt.object(obj, s) })));
        return {
            type: 'order-steps',
            prompt: 'از کوچک‌ترین به بزرگ‌ترین مرتب کن:',
            items: shuffled.map(s => ({ img: s.img, size: s.size, label: '' })),
            answer: 'size',
            speech: 'تصاویر را از کوچک به بزرگ بچین'
        };
    }

    function plantGrowthRound() {
        const stages = [
            { label: '۱. کاشت دانه', img: SvgArt.object('apple', 82), idx: 0 },
            { label: '۲. رشد جوانه', img: SvgArt.object('tree', 82), idx: 1 },
            { label: '۳. رویش گل و برگ', img: SvgArt.object('flower', 82), idx: 2 }
        ];
        return {
            type: 'order-steps',
            prompt: 'مراحل رشد گیاه را به ترتیب بچین:',
            items: shuffle(stages),
            answer: 'idx',
            speech: 'مراحل رشد گیاه را مرتب کن'
        };
    }

    function storyOrderRound() {
        const steps = [
            { label: '۱. بیدار شدن از خواب', img: SvgArt.object('sun', 82), idx: 0 },
            { label: '۲. شستن دست و صورت', img: SvgArt.object('soap', 82), idx: 1 },
            { label: '۳. خوردن صبحانه مقوی', img: SvgArt.object('apple', 82), idx: 2 },
            { label: '۴. رفتن به مدرسه و بازی', img: SvgArt.object('car', 82), idx: 3 }
        ];
        return {
            type: 'order-steps',
            prompt: 'داستان روز شاد را به ترتیب مرتب کن:',
            items: shuffle(steps),
            answer: 'idx',
            speech: 'داستان را از اول تا آخر مرتب کن'
        };
    }

    function classifyRound() {
        const items = shuffle([
            { id: 'گربه', label: 'گربه', img: SvgArt.animal('cat', 88), target: 'animals' },
            { id: 'خرگوش', label: 'خرگوش', img: SvgArt.animal('rabbit', 88), target: 'animals' },
            { id: 'سیب', label: 'سیب', img: SvgArt.object('apple', 88), target: 'fruits' },
            { id: 'موز', label: 'موز', img: SvgArt.object('banana', 88), target: 'fruits' }
        ]);

        return {
            type: 'drag-match',
            prompt: 'حیوانات و میوه‌ها را در جای درست بگذار:',
            targets: [
                { id: 'animals', label: 'حیوانات' },
                { id: 'fruits', label: 'میوه‌ها' }
            ],
            items,
            speech: 'حیوانات و میوه‌ها را جدا کن'
        };
    }

    // ==========================================
    // 9. SCIENCE & NATURE ROUNDS
    // ==========================================
    function animalSoundRound() {
        const a = pick(ANIMALS);
        const others = shuffle(ANIMALS.map(x => x.fa).filter(x => x !== a.fa)).slice(0, 3);
        const opts = shuffle([a.fa, ...others]);
        return mc(
            `صدای «${a.sound}» صدای کدام حیوان است؟`,
            SvgArt.animal(a.key, 118),
            opts.map(x => ({ label: x })),
            opts.indexOf(a.fa),
            // Naming the animal here defeated the whole exercise: the child was
            // told the answer in the same breath as the question.
            `صدای ${a.sound} صدای کدام حیوان است؟`
        );
    }

    function animalHabitatRound() {
        const a = pick(ANIMALS.filter(x => x.habitat));
        const correct = a.habitat;
        const others = shuffle(['خانه', 'مزرعه', 'دریا و رودخانه', 'جنگل', 'قطب برفی'].filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct, ...others]);
        return mc(
            `«${a.fa}» بیشتر در کجا زندگی می‌کند؟`,
            SvgArt.animal(a.key, 118),
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            `${a.fa} در کجا زندگی می‌کند؟`
        );
    }

    function bodyPartRound() {
        const b = pick(BODY_PARTS);
        const others = shuffle(BODY_PARTS.map(x => x.fa).filter(x => x !== b.fa)).slice(0, 3);
        const opts = shuffle([b.fa, ...others]);
        return mc(
            `برای «${b.use}» از کدام عضو استفاده می‌کنیم؟`,
            SvgArt.object(b.icon || 'eye', 112),
            opts.map(x => ({ label: x })),
            opts.indexOf(b.fa),
            b.use
        );
    }

    function senseRound() {
        const s = pick(SENSES);
        const others = shuffle(SENSES.map(x => x.organ).filter(x => x !== s.organ)).slice(0, 3);
        const opts = shuffle([s.organ, ...others]);
        return mc(
            `برای «${s.example}» کدام حس و عضو فعال است؟`,
            null,
            opts.map(x => ({ label: x })),
            opts.indexOf(s.organ),
            s.example
        );
    }

    function seasonRound() {
        const s = pick(SEASONS);
        const others = shuffle(SEASONS.map(x => x.fa).filter(x => x !== s.fa)).slice(0, 3);
        const opts = shuffle([s.fa, ...others]);
        return mc(
            `«${s.weather}» نشانه کدام فصل زیباست؟`,
            SvgArt.object(s.fa === 'زمستان' ? 'rain' : s.fa === 'بهار' ? 'flower' : s.fa === 'تابستان' ? 'sun' : 'tree', 112),
            opts.map(x => ({ label: x })),
            opts.indexOf(s.fa),
            s.weather
        );
    }

    // ==========================================
    // 10. SOCIO-EMOTIONAL ROUNDS
    // ==========================================
    function emotionRound() {
        const e = pick(EMOTIONS);
        const others = shuffle(EMOTIONS.map(x => x.fa).filter(x => x !== e.fa)).slice(0, 3);
        const opts = shuffle([e.fa, ...others]);
        const emoPhrasings = [
            `«${e.situation}» چه حسی داریم؟`,
            `«${e.situation}» — این چه احساسی است؟`,
            `وقتی این اتفاق می‌افتد چه حسی پیدا می‌کنیم؟ «${e.situation}»`
        ];
        return mc(
            pick(emoPhrasings),
            Mascot.svg(95, e.icon || 'happy'),
            // Pre-readers cannot pick «سرخوردگی» from text. Every feeling shows a face.
            opts.map(x => ({ label: x, img: SvgArt.emotionFace(x, 84) || undefined })),
            opts.indexOf(e.fa),
            e.situation
        );
    }

    function habitRound() {
        const good = pick(GOOD_HABITS);
        const badPool = [
            'داد زدن در خانه', 'نخوردن صبحانه', 'به وسایل خطرناک دست زدن',
            'ریختن زباله روی زمین', 'پریدن وسط حرف دیگران', 'قهر کردن سر بازی',
            'شکستن اسباب‌بازی از عصبانیت', 'مسخره کردن دوستان',
            'باز گذاشتن شیر آب', 'نشستن طولانی جلوی تلویزیون'
        ];
        const others = shuffle(badPool).slice(0, 2);
        const opts = shuffle([good.fa, ...others]);
        // Vary the wording so the same habit question does not feel identical
        // across dozens of rounds.
        const phrasings = [
            'کدام رفتار پسندیده و مفید است؟',
            'کدام کار درست است؟',
            'یک بچهٔ مهربان کدام کار را می‌کند؟',
            'کدام رفتار باعث می‌شود دیگران خوشحال شوند؟',
            'کدام یک عادت خوب است؟',
            'اگر بخواهی کار درست را انتخاب کنی، کدام است؟'
        ];
        const round = mc(
            pick(phrasings),
            null,
            opts.map(x => ({ label: x })),
            opts.indexOf(good.fa),
            'کدام رفتار خوب و درست است؟'
        );
        // Teach the "why", not just the right answer.
        round.explain = good.desc || '';
        return round;
    }

    function familyRound() {
        const f = pick(FAMILY);
        const others = shuffle(FAMILY.map(x => x.fa).filter(x => x !== f.fa)).slice(0, 3);
        const opts = shuffle([f.fa, ...others]);
        return mc(
            `«${f.role}» — او در خانواده کیست؟`,
            SvgArt.object('house', 112),
            opts.map(x => ({ label: x, img: SvgArt.object(FAMILY_IMG[x] || 'mother', 96) })),
            opts.indexOf(f.fa),
            f.role
        );
    }

    // ==========================================
    // 11. MEMORY, TRACING, BALLOON & ART
    // ==========================================
    function memoryRound(pairCount) {
        const pool = [
            { img: SvgArt.animal('cat', 82), label: 'گربه' },
            { img: SvgArt.animal('rabbit', 82), label: 'خرگوش' },
            { img: SvgArt.animal('lion', 82), label: 'شیر' },
            { img: SvgArt.animal('fish', 82), label: 'ماهی' },
            { img: SvgArt.object('apple', 82), label: 'سیب' },
            { img: SvgArt.object('banana', 82), label: 'موز' },
            { img: SvgArt.object('sun', 82), label: 'خورشید' },
            { img: SvgArt.object('star', 82), label: 'ستاره' },
            { img: SvgArt.object('flower', 82), label: 'گل' },
            { img: SvgArt.object('car', 82), label: 'ماشین' }
        ];

        const chosen = shuffle(pool).slice(0, pairCount || 3);
        const cards = [];
        chosen.forEach((c, i) => {
            cards.push({ pair: i, img: c.img, label: c.label });
            cards.push({ pair: i, img: c.img, label: c.label });
        });

        return {
            type: 'memory',
            cards: shuffle(cards),
            speech: 'کارت‌ها را برگردان و جفت‌های مثل هم را پیدا کن'
        };
    }

    function tracingRound(char, kind) {
        const round = {
            type: 'tracing',
            char: String(char),
            kind: kind || 'letter',
            speech: `با انگشت روی ${kind === 'number' ? 'عدد' : 'حرف'} ${char} بکش`
        };
        if (kind !== 'number' && LETTER_AUDIO[String(char)]) {
            round.audioClip = `letter-${LETTER_AUDIO[String(char)]}`;
            round.audioAutoPlay = false;  // speaker button only
            round.letter = String(char);
        }
        return round;
    }

    function balloonRound() {
        const pool = [
            { text: 'الف', sound: 'صدای آ' },
            { text: 'ب', sound: 'صدای ب' },
            { text: 'پ', sound: 'صدای پ' },
            { text: 'ت', sound: 'صدای ت' },
            { text: '۱', sound: 'عدد یک' },
            { text: '۲', sound: 'عدد دو' },
            { text: '۳', sound: 'عدد سه' }
        ];
        const target = pick(pool);
        const items = shuffle([target, ...shuffle(pool.filter(item => item.text !== target.text)).slice(0, 4)]);
        return {
            type: 'balloon-pop',
            prompt: `فقط بادکنک‌های «${target.text}» را بترکان!`,
            items,
            targetText: target.text,
            speech: `بادکنک ${target.text} را پیدا کن و لمس کن!`
        };
    }

    function paintingRound() {
        return {
            type: 'painting',
            prompt: 'کارگاه نقاشی آزاد و رنگ‌آمیزی خلاقانه',
            speech: 'هر چی دوست داری با رنگ‌های شاد نقاشی کن!'
        };
    }

    // ==========================================
    // HELPERS
    // ==========================================
    const ANIMAL_IMG = {
        'اسب': 'horse', 'گربه': 'cat', 'سگ': 'dog', 'خرگوش': 'rabbit',
        'فیل': 'elephant', 'شیر': 'lion', 'خرس': 'bear', 'میمون': 'monkey',
        'ماهی': 'fish', 'لاک‌پشت': 'turtle', 'پروانه': 'butterfly', 'زنبور': 'bee',
        'جوجه': 'chick', 'مرغ': 'chicken', 'خروس': 'rooster', 'اردک': 'duck',
        'قورباغه': 'frog', 'گوسفند': 'sheep', 'گاو': 'cow', 'روباه': 'fox'
    };
    // Family members drawn with existing art so the options are not text-only.
    const FAMILY_IMG = {
        'مادر': 'mother', 'مادربزرگ': 'mother', 'خاله': 'mother', 'عمه': 'mother',
        'پدر': 'home', 'پدربزرگ': 'home', 'عمو': 'home', 'دایی': 'home',
        'خواهر': 'doll', 'دخترخاله': 'doll', 'برادر': 'ball', 'پسرعمو': 'ball',
        'نوه': 'doll', 'همسایه': 'home', 'دوست': 'ball', 'معلم': 'book'
    };

    const OBJECT_IMG = {
        'سیب': 'apple', 'موز': 'banana', 'پرتقال': 'orange', 'هندوانه': 'watermelon',
        'توپ': 'ball', 'بادکنک': 'balloon', 'خورشید': 'sun', 'ماه': 'moon',
        'ستاره': 'star', 'گل': 'flower', 'درخت': 'tree', 'باران': 'rain',
        'ابر': 'rain', 'ماشین': 'car', 'کتاب': 'book', 'خانه': 'house',
        'چشم': 'eye', 'گوش': 'ear', 'بینی': 'nose', 'دست': 'hand',
        'زبان': 'tongue', 'پا': 'foot', 'دندان': 'tooth', 'مغز': 'brain',
        'ساعت': 'clock', 'هدیه': 'gift', 'کیک': 'cake',
        // Newly illustrated vocabulary (previously fell back to text tiles).
        'انگور': 'grape', 'انار': 'pomegranate', 'بستنی': 'icecream',
        'پیراهن': 'shirt', 'لباس': 'shirt', 'جوراب': 'sock', 'جعبه': 'box',
        'چای': 'tea', 'فنجان': 'tea', 'شمع': 'candle', 'صندلی': 'chair',
        'عینک': 'glasses', 'عروسک': 'doll', 'طبل': 'drum', 'لامپ': 'lamp',
        'قایق': 'boat', 'قفل': 'lock', 'کلاه': 'hat', 'کفش': 'shoe',
        'هویج': 'carrot', 'هواپیما': 'plane', 'چتر': 'umbrella',
        'مسواک': 'toothbrush', 'رنگین‌کمان': 'rainbow',
        'مادر': 'mother', 'مامان': 'mother', 'نان': 'bread', 'پنجره': 'window',
        'دوچرخه': 'bicycle', 'صابون': 'soap2', 'گیلاس': 'cherry', 'نهنگ': 'whale',
        'وال': 'whale', 'ببر': 'tiger', 'تاب': 'swing', 'کوه': 'mountain',
        'مدرسه': 'school', 'وزنه': 'dumbbell',
        'زرافه': 'giraffe', 'فندق': 'nut', 'شانه': 'comb', 'راکت': 'racket',
        'ذرت': 'grain', 'شکلات': 'chocolate', 'شتر': 'camel', 'قوری': 'jar',
        'جام': 'jar', 'برف': 'snow', 'یخ': 'snow', 'ظرف': 'plate',
        'طناب': 'rope', 'رادیو': 'radio', 'میز': 'table', 'رودخانه': 'river',
        'دریا': 'river',
        'تخم‌مرغ': 'egg', 'پنیر': 'cheese', 'سوپ': 'soup', 'چوب': 'wood',
        'آب': 'water', 'حوض': 'water', 'حباب': 'bubble', 'عکس': 'photo',
        'تاج': 'crown', 'شاه': 'crown', 'جنگل': 'forest', 'فرفره': 'pinwheel',
        'در': 'door', 'یاس': 'jasmine', 'یوزپلنگ': 'cheetah', 'بلبل': 'nightingale',
        'صورت': 'mother', 'خواهر': 'mother', 'توت': 'cherry', 'سیر': 'nut',
        'ویولن': 'violin', 'زنگ': 'bell', 'زمین': 'earth', 'لیمو': 'lemon',
        'عصا': 'cane', 'پرنده': 'bird2', 'ژاکت': 'shirt', 'غذا': 'soup',
        'نارنجی': 'orange', 'ضربه': 'drum'
    };
    const SHAPE_IMG = {
        'دایره': ['circle', '#FF6B6B'], 'مثلث': ['triangle', '#4ECDC4'],
        'مربع': ['square', '#A29BFE'], 'مستطیل': ['rectangle', '#F9CA24'],
        'بیضی': ['oval', '#FF8A5C'], 'لوزی': ['diamond', '#F368E0']
    };
    const SEASON_IMG = {
        'بهار': 'flower', 'تابستان': 'sun', 'پاییز': 'tree', 'زمستان': 'rain'
    };

    function wordColor(word) {
        const palette = ['#6C5CE7', '#00B894', '#1E90FF', '#FF8A5C', '#F368E0', '#00D2D3', '#FF6B6B', '#A29BFE'];
        let hash = 0;
        const text = String(word || '؟');
        for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
        return palette[hash % palette.length];
    }

    function imgForWord(word) {
        if (!word) return SvgArt.wordTile('؟', '#A4B0BE', 85);
        if (ANIMAL_IMG[word]) return SvgArt.animal(ANIMAL_IMG[word], 104);
        if (OBJECT_IMG[word]) return SvgArt.object(OBJECT_IMG[word], 104);
        if (SHAPE_IMG[word]) return SvgArt.shape(SHAPE_IMG[word][0], SHAPE_IMG[word][1], 104);
        if (SEASON_IMG[word]) return SvgArt.object(SEASON_IMG[word], 104);
        // Honest fallback: a colored tile carrying the word itself (never a wrong picture).
        return SvgArt.wordTile(word, wordColor(word), 85);
    }

    function pickOtherWords(excludeLetter, count, excludeList, preferArt) {
        excludeList = excludeList || [];
        const pool = [];
        Object.keys(FIRST_SOUND_WORDS).forEach(k => {
            if (k !== excludeLetter) pool.push(...FIRST_SOUND_WORDS[k]);
        });
        const available = pool.filter(w => !excludeList.includes(w));
        if (preferArt) {
            // Keep every option visually consistent: if the answer is a real picture,
            // the distractors must be real pictures too (never a text tile among art).
            const drawn = shuffle(available.filter(hasRealArt)).slice(0, count);
            if (drawn.length === count) return drawn;
            const rest = shuffle(available.filter(w => !drawn.includes(w))).slice(0, count - drawn.length);
            return shuffle([...drawn, ...rest]);
        }
        return shuffle(available).slice(0, count);
    }

    function countImage(n) {
        const obj = pick(['apple', 'ball', 'star', 'flower', 'balloon']);
        // The items the child must COUNT were locked at 52px, so five stars occupied
        // a 273x50 strip inside a ~370x630 stage: tiny objects marooned in white
        // space. Scale to the count so few items are big and many items still fit.
        const size = n <= 3 ? 104 : n <= 5 ? 88 : n <= 8 ? 72 : n <= 12 ? 58 : 46;
        let svgs = '';
        for (let i = 0; i < n; i++) svgs += SvgArt.object(obj, size);
        return `<div style="display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:10px;max-width:330px;margin:0 auto">${svgs}</div>`;
    }

    function arithImage(sign, a, b) {
        const obj = pick(['apple', 'ball', 'star']);
        const most = Math.max(a, b);
        const size = most <= 3 ? 74 : most <= 5 ? 62 : most <= 8 ? 50 : 40;
        let left = '', right = '';
        for (let i = 0; i < a; i++) left += SvgArt.object(obj, size);
        for (let i = 0; i < b; i++) right += SvgArt.object(obj, size);

        return `
            <div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;">
                <div style="display:flex;flex-wrap:wrap;gap:4px;max-width:140px;justify-content:center;">${left}</div>
                <span style="font-size:36px;font-weight:900;color:#6C5CE7;">${sign}</span>
                <div style="display:flex;flex-wrap:wrap;gap:4px;max-width:140px;justify-content:center;">${right}</div>
            </div>
        `;
    }

    // ==========================================
    // DATA-DRIVEN LESSON RESOLVER
    // Every curriculum type gets a matching activity plan before the legacy fallback.
    // ==========================================
    function inferDomain(lessonId, metadata) {
        if (metadata && metadata.domain) return metadata.domain;
        if (String(lessonId).startsWith('R-')) return 'reading';
        if (String(lessonId).startsWith('M-')) return 'math';
        if (String(lessonId).startsWith('L-')) return 'logic';
        if (String(lessonId).startsWith('S-')) return 'science';
        if (String(lessonId).startsWith('SE-')) return 'socio-emotional';
        if (String(lessonId).startsWith('A-')) return 'art';
        // Gifted / entrance-exam track.
        if (String(lessonId).startsWith('G-')) return 'gifted';
        return 'general';
    }

    function lessonLevel(lessonId, metadata) {
        const match = String(lessonId).match(/^[A-Z]+-L(\d+)/);
        let level = match ? Number(match[1]) : 1;
        const adaptive = Number(metadata && metadata.adaptiveDifficulty);
        if (Number.isFinite(adaptive)) level = adaptive;
        const age = Number(metadata && metadata.childAge);
        if (Number.isFinite(age)) {
            if (age <= 5) level -= 1;
            if (age >= 7) level += 1;
        }
        return Math.max(1, Math.min(8, level));
    }

    // Identity of a round for de-duplication purposes: same question AND same
    // answer set means the child is being asked literally the same thing twice.
    function roundSignature(round) {
        if (!round) return '';
        const prompt = String(round.prompt || round.question || '');
        const opts = Array.isArray(round.options)
            ? round.options.map(o => String(o && o.label !== undefined ? o.label : o)).join('|')
            : '';
        const items = Array.isArray(round.items)
            ? round.items.map(i => String(i && i.label !== undefined ? i.label : i)).sort().join('|')
            : '';
        const cards = Array.isArray(round.cards)
            ? round.cards.map(c => String(c && c.label)).sort().join('|')
            : '';
        return [round.type, prompt, opts, items, cards, round.char || ''].join('#');
    }

    function plan(factories, metadata, exactLength) {
        const list = Array.isArray(factories) ? factories.filter(Boolean) : [];
        if (!list.length) return [];
        // Default lesson length is 5 rounds. `exactLength` lets a lesson run every
        // factory it built (alphabet lessons must cover all four of their letters,
        // which needs 9 rounds — truncating to 5 silently dropped two letters).
        const count = exactLength ? list.length : 5;

        // Most round factories are randomised, so calling the same factory twice
        // usually yields a different question — but not always. Previously ~44% of
        // lessons repeated an identical prompt within the same five rounds, which is
        // exactly the "repetitive loop" the child feels. Retry a few times per slot
        // and, if a factory is genuinely exhausted, borrow another factory instead.
        const seen = new Set();
        const rounds = [];
        for (let index = 0; index < count; index++) {
            let round = null;
            for (let attempt = 0; attempt < 8 && !round; attempt++) {
                // After a few failures, rotate to a different factory in the list.
                const factory = list[(index + (attempt >= 4 ? attempt : 0)) % list.length];
                let candidate;
                try { candidate = factory(); } catch (e) { continue; }
                if (!candidate) continue;
                const sig = roundSignature(candidate);
                if (!seen.has(sig)) { seen.add(sig); round = candidate; }
            }
            // Last resort: accept a duplicate rather than dropping a round.
            if (!round) { try { round = list[index % list.length](); } catch (e) { continue; } }
            if (round) rounds.push(round);
        }

        return rounds.map(round => ({
            ...round,
            lessonId: metadata && metadata.id,
            skillType: metadata && metadata.type,
            difficulty: metadata && metadata.difficulty || lessonLevel(metadata && metadata.id, metadata)
        }));
    }

    function colorRound() {
        const colors = [
            { name: 'قرمز', value: '#FF4757' },
            { name: 'آبی', value: '#1E90FF' },
            { name: 'سبز', value: '#2ED573' },
            { name: 'زرد', value: '#F9CA24' },
            { name: 'بنفش', value: '#A29BFE' }
        ];
        const target = pick(colors);
        const options = shuffle([target, ...shuffle(colors.filter(item => item.name !== target.name)).slice(0, 3)]);
        return mc(
            `رنگ «${target.name}» را پیدا کن:`,
            null,
            options.map(item => ({ img: SvgArt.shape('circle', item.value, 84), label: item.name })),
            options.indexOf(target),
            `رنگ ${target.name} را انتخاب کن`
        );
    }

    function clockRound() {
        const hour = rint(1, 12);
        const options = shuffle([hour, ((hour + 2) % 12) + 1, ((hour + 5) % 12) + 1, ((hour + 8) % 12) + 1]);
        return mc(
            `عقربهٔ ساعت، ساعت ${toFaWord(hour)} را نشان می‌دهد؟`,
            SvgArt.object('clock', 128),
            options.map(value => ({ label: `${toFaDigit(value)}:۰۰`, big: true })),
            options.indexOf(hour),
            `ساعت ${toFaWord(hour)} را پیدا کن`
        );
    }

    // ==========================================
    // 12. EXPANDED CONTENT ROUNDS (variety pass)
    // These deliberately use non-quiz activity types so that reading, science,
    // socio-emotional and art stop being 60% multiple-choice.
    // ==========================================

    // --- science: what is it made of? (drag-match) ---
    function materialRound() {
        const bank = (window.MATERIALS || []).slice();
        if (bank.length < 3) return classifyRound();
        const chosen = shuffle(bank).slice(0, 3);
        const mats = [...new Set(chosen.map(x => x.material))];
        return {
            type: 'drag-match',
            prompt: 'هر چیز را به جنسی که از آن ساخته شده وصل کن:',
            items: shuffle(chosen.map(x => ({ id: x.fa, label: x.fa, target: x.material }))),
            targets: shuffle(mats.map(m => ({ id: m, label: m }))),
            speech: 'هر وسیله را به جنس خودش وصل کن'
        };
    }

    // --- science: does it float or sink? (drag-match, two buckets) ---
    function floatSinkRound() {
        const bank = (window.FLOAT_SINK || []).slice();
        if (bank.length < 4) return classifyRound();
        const floaters = shuffle(bank.filter(x => x.floats)).slice(0, 2);
        const sinkers = shuffle(bank.filter(x => !x.floats)).slice(0, 2);
        const items = shuffle([...floaters, ...sinkers]);
        return {
            type: 'drag-match',
            prompt: 'کدام روی آب می‌ماند و کدام ته می‌رود؟',
            items: items.map(x => ({ id: x.fa, label: x.fa, target: x.floats ? 'شناور' : 'غرق' })),
            targets: shuffle([{ id: 'شناور', label: 'روی آب می‌ماند' }, { id: 'غرق', label: 'ته می‌رود' }]),
            speech: 'هر چیز را در جای درست بگذار'
        };
    }

    // --- science: which month belongs to which season? (drag-match) ---
    function monthSeasonRound() {
        const bank = (window.FA_MONTHS || []).slice();
        if (bank.length < 4) return seasonRound();
        const chosen = shuffle(bank).slice(0, 4);
        const seasons = [...new Set(chosen.map(m => m.season))];
        return {
            type: 'drag-match',
            prompt: 'هر ماه را به فصل خودش وصل کن:',
            items: shuffle(chosen.map(m => ({ id: m.fa, label: m.fa, target: m.season }))),
            targets: shuffle(seasons.map(x => ({ id: x, label: x }))),
            speech: 'هر ماه مال کدام فصل است؟'
        };
    }

    // --- reading: opposites as a matching game instead of a quiz ---
    function oppositeMatchRound() {
        const bank = (window.OPPOSITES || []).slice();
        if (bank.length < 3) return oppositeRound();
        const chosen = shuffle(bank).slice(0, 3);
        return {
            type: 'drag-match',
            prompt: 'هر کلمه را به متضادش وصل کن:',
            items: shuffle(chosen.map(x => ({ id: x.a, label: x.a, target: x.b }))),
            targets: shuffle(chosen.map(x => ({ id: x.b, label: x.b }))),
            speech: 'کلمه‌ها را به متضادشان وصل کن'
        };
    }

    // --- socio-emotional: order the steps of a kind action (order-steps) ---
    const SOCIAL_STORIES = [
        { prompt: 'مراحل عذرخواهی را به ترتیب بچین:', steps: ['۱. متوجه می‌شوم اشتباه کردم', '۲. به چشم دوستم نگاه می‌کنم', '۳. می‌گویم معذرت می‌خواهم', '۴. جبران می‌کنم'] },
        { prompt: 'مراحل دوست شدن با بچهٔ تازه‌وارد:', steps: ['۱. لبخند می‌زنم', '۲. سلام می‌کنم و نامم را می‌گویم', '۳. او را به بازی دعوت می‌کنم', '۴. با هم بازی می‌کنیم'] },
        { prompt: 'وقتی عصبانی می‌شوم چه می‌کنم؟', steps: ['۱. می‌ایستم و نفس عمیق می‌کشم', '۲. تا پنج می‌شمارم', '۳. می‌گویم چه چیزی ناراحتم کرد', '۴. با آرامش راه‌حل پیدا می‌کنم'] },
        { prompt: 'مراحل رعایت نوبت در بازی:', steps: ['۱. صبر می‌کنم', '۲. نوبت دوستم را نگه می‌دارم', '۳. وقتی نوبتم شد بازی می‌کنم', '۴. بعد نوبت را به بعدی می‌دهم'] },
        { prompt: 'وقتی دوستم ناراحت است:', steps: ['۱. کنارش می‌نشینم', '۲. می‌پرسم چه شده', '۳. با دقت گوش می‌دهم', '۴. دلداری‌اش می‌دهم'] },
        { prompt: 'مراحل کمک به کارهای خانه:', steps: ['۱. می‌پرسم چه کمکی از من برمی‌آید', '۲. وسایل را جمع می‌کنم', '۳. میز را می‌چینم', '۴. دست‌هایم را می‌شویم'] }
    ];
    // `topic` lets a lesson request the story that matches ITS title instead of a
    // random one: 150 lessons had no authored pack and fell through to a generic
    // default, so «عذرخواهی و جبران» could show the turn-taking story.
    function socialStoryRound(topic) {
        let bank = SOCIAL_STORIES;
        if (topic) {
            const re = new RegExp(topic);
            const hit = SOCIAL_STORIES.filter(x => re.test(x.prompt));
            if (hit.length) bank = hit;
        }
        const story = pick(bank);
        const items = story.steps.map((label, idx) => ({ label, idx }));
        return {
            type: 'order-steps',
            prompt: story.prompt,
            items: shuffle(items),
            answer: 'idx',
            speech: story.prompt
        };
    }

    // --- socio-emotional: sort behaviours into kind / unkind (drag-match) ---
    function behaviourSortRound() {
        const good = shuffle((window.GOOD_HABITS || []).map(h => h.fa)).slice(0, 2);
        const bad = shuffle([
            'داد زدن سر دوستان', 'گرفتن اسباب‌بازی بدون اجازه', 'مسخره کردن دیگران',
            'ریختن زباله روی زمین', 'پریدن وسط حرف بزرگترها', 'قهر کردن سر بازی'
        ]).slice(0, 2);
        if (good.length < 2) return habitRound();
        return {
            type: 'drag-match',
            prompt: 'رفتارها را در جای درست بگذار:',
            items: shuffle([
                ...good.map(g => ({ id: g, label: g, target: 'مهربان' })),
                ...bad.map(bd => ({ id: bd, label: bd, target: 'نامهربان' }))
            ]),
            targets: shuffle([{ id: 'مهربان', label: 'رفتار مهربان' }, { id: 'نامهربان', label: 'رفتار نامهربان' }]),
            speech: 'رفتار خوب را از رفتار بد جدا کن'
        };
    }

    // --- socio-emotional: match a feeling to its situation (drag-match) ---
    function emotionMatchRound(topic) {
        let bank = (window.EMOTIONS || []).slice();
        if (topic) {
            const re = new RegExp(topic);
            const hit = bank.filter(e => re.test(e.fa) || re.test(e.situation || ''));
            // Keep the focus emotion plus contrasting ones so the round stays solvable.
            if (hit.length) bank = [...hit, ...shuffle(bank.filter(e => !hit.includes(e))).slice(0, 3)];
        }
        if (bank.length < 3) return emotionRound();
        const chosen = shuffle(bank).slice(0, 3);
        return {
            type: 'drag-match',
            prompt: 'هر حس را به موقعیتش وصل کن:',
            items: shuffle(chosen.map(e => ({ id: e.fa, label: e.fa, img: SvgArt.emotionFace(e.fa, 62) || undefined, target: e.situation }))),
            targets: shuffle(chosen.map(e => ({ id: e.situation, label: e.situation }))),
            speech: 'هر احساس مال کدام موقعیت است؟'
        };
    }

    // --- reading: build a sentence (order-steps over words) ---
    function sentenceOrderRound() {
        const bank = (window.SENTENCE_POOL || []).slice();
        if (!bank.length) return sentenceRound();
        const s2 = pick(bank);
        const items = s2.words.map((w, idx) => ({ label: w, idx }));
        return {
            type: 'order-steps',
            prompt: 'کلمه‌ها را مرتب کن تا جمله درست شود:',
            items: shuffle(items),
            answer: 'idx',
            speech: 'کلمه‌ها را مرتب کن'
        };
    }

    // --- art: colour-mixing knowledge (quiz but genuinely new content) ---
    const COLOR_MIXES = [
        { a: 'قرمز', b: 'زرد', result: 'نارنجی' },
        { a: 'آبی', b: 'زرد', result: 'سبز' },
        { a: 'قرمز', b: 'آبی', result: 'بنفش' },
        { a: 'سفید', b: 'قرمز', result: 'صورتی' },
        { a: 'سیاه', b: 'سفید', result: 'خاکستری' },
        { a: 'قرمز', b: 'سبز', result: 'قهوه‌ای' }
    ];
    function colorMixRound() {
        const m = pick(COLOR_MIXES);
        const others = shuffle(COLOR_MIXES.map(x => x.result).filter(r => r !== m.result)).slice(0, 3);
        const opts = shuffle([m.result, ...others]);
        return mc(
            `اگر «${m.a}» و «${m.b}» را با هم قاطی کنیم چه رنگی می‌شود؟`,
            null,
            opts.map(x => ({ label: x })),
            opts.indexOf(m.result),
            `${m.a} و ${m.b} با هم چه رنگی می‌سازند؟`
        );
    }

    // --- art / logic: continue the colour pattern as an ordering task ---
    function patternOrderRound() {
        const colors = [
            { name: 'قرمز', value: '#FF4757' }, { name: 'آبی', value: '#1E90FF' },
            { name: 'زرد', value: '#F9CA24' }, { name: 'سبز', value: '#2ED573' }
        ];
        const picked = shuffle(colors).slice(0, 3);
        const items = picked.map((c, idx) => ({ label: c.name, img: SvgArt.shape('circle', c.value, 76), idx }));
        return {
            type: 'order-steps',
            prompt: 'رنگ‌ها را به همان ترتیبی که گفته شد بچین: ' + picked.map(c => c.name).join(' ← '),
            items: shuffle(items),
            answer: 'idx',
            speech: 'رنگ‌ها را به ترتیب بچین'
        };
    }

    // --- science: body part -> what we use it for (drag-match) ---
    function bodyUseRound() {
        const bank = (window.BODY_PARTS || []).slice();
        if (bank.length < 3) return bodyPartRound();
        const chosen = shuffle(bank).slice(0, 3);
        return {
            type: 'drag-match',
            prompt: 'هر عضو بدن را به کارش وصل کن:',
            items: shuffle(chosen.map(b => ({ id: b.fa, label: b.fa, target: b.use }))),
            targets: shuffle(chosen.map(b => ({ id: b.use, label: b.use }))),
            speech: 'هر عضو بدن برای چه کاری است؟'
        };
    }

    // --- science: animal -> habitat (drag-match) ---
    function habitatMatchRound() {
        const bank = (window.ANIMALS || []).slice();
        if (bank.length < 3) return animalHabitatRound();
        const chosen = [];
        const usedHab = new Set();
        for (const a of shuffle(bank)) {
            if (usedHab.has(a.habitat)) continue;
            usedHab.add(a.habitat); chosen.push(a);
            if (chosen.length === 3) break;
        }
        if (chosen.length < 3) return animalHabitatRound();
        return {
            type: 'drag-match',
            prompt: 'هر حیوان را به خانه‌اش وصل کن:',
            items: shuffle(chosen.map(a => ({ id: a.fa, label: a.fa, target: a.habitat }))),
            targets: shuffle(chosen.map(a => ({ id: a.habitat, label: a.habitat }))),
            speech: 'هر حیوان کجا زندگی می‌کند؟'
        };
    }

    function resolveAgeTrack(metadata, pkg) {
        const age = Number(metadata && metadata.childAge);
        // A gifted child who is consistently correct is promoted to the next track
        // so they meet harder content instead of looping through easy rounds.
        // `adaptiveDifficulty` comes from Adaptive.getDifficulty() (1..maxLevel).
        const adaptive = Number(metadata && metadata.adaptiveDifficulty);
        // Age 4 gets the gentlest track, 5-6 early, 7-8 school. Previously 4 and 5
        // were merged into one bucket, so a 4-year-old got 5-year-old content.
        let track = 'early';
        if (Number.isFinite(age) && age <= 4) track = 'toddler';
        else if (Number.isFinite(age) && age <= 5) track = 'preschool';
        else if (Number.isFinite(age) && age >= 7) track = 'school';

        if (Number.isFinite(adaptive)) {
            const ladder = ['toddler', 'preschool', 'early', 'school'];
            let idx = ladder.indexOf(track);
            if (adaptive >= 4 && idx < ladder.length - 1) idx++;   // mastering -> harder
            else if (adaptive <= 1 && idx > 0) idx--;              // struggling -> gentler
            track = ladder[idx];
        }
        return track;
    }

    function roleFactory(role, level, letterCursor, metadata) {
        // `letterCursor` walks the letters this lesson is named after, so the
        // «اَ ب پ ت» lesson never asks about «گ». Falls back to the full alphabet.
        const nextLetter = letterCursor || (() => pick(ALPHABET));
        const roles = {
            'letter-sound': () => letterSoundRound(nextLetter()),
            'letter-example': () => letterExampleRound(nextLetter()),
            trace: () => tracingRound(nextLetter().letter, 'letter'),
            'trace-number': () => tracingRound(toFaDigit(rint(1, Math.max(3, level * 3))), 'number'),
            'first-sound': firstSoundRound,
            rhyme: rhymeRound,
            syllable: syllableRound,
            blend: blendRound,
            memory: () => memoryRound(Math.min(5, 2 + Math.floor(level / 2))),
            sentence: sentenceRound,
            'story-order': storyOrderRound,
            'word-meaning': wordMeaningRound,
            'sight-word': sightWordRound,
            count: () => countRound(level <= 2 ? 5 : level <= 4 ? 10 : 20),
            'number-name': () => numberNameRound(level <= 2 ? 5 : level <= 4 ? 10 : 20),
            'number-order': () => numberOrderRound(level <= 2 ? 5 : level <= 4 ? 10 : 20),
            compare: () => compareRound(level <= 2 ? 5 : level <= 4 ? 10 : 20),
            add: () => arithRound('+', level <= 2 ? 5 : level <= 4 ? 10 : 20),
            subtract: () => arithRound('-', level <= 2 ? 5 : level <= 4 ? 10 : 20),
            balance: balanceRound,
            'shape-name': shapeNameRound,
            // Same domain problem as 'matching' below: a reading lesson asking to
            // pair a picture with its word must not drill geometric shapes.
            'shape-match': () => (String((metadata && metadata.domain) || '') === 'reading'
                ? sightWordRound()
                : shapeMatchRound()),
            'order-size': orderSizeRound,
            pattern: patternRound,
            color: colorRound,
            // These three roles are referenced by authored round plans but were
            // never registered, so those lessons silently fell back to filler.
            'color-mix': colorMixRound,
            material: materialRound,
            // 'matching' used to mean shapeMatchRound, so «تصویر و کلمه: وصل کن»
            // -- a reading lesson about matching a PICTURE to its WORD -- asked
            // the child to pick shapes instead. Route it by domain: reading
            // lessons match words to pictures, everything else matches shapes.
            matching: () => (String((metadata && metadata.domain) || '') === 'reading'
                ? sightWordRound()
                : shapeMatchRound()),
            raven: ravenRound,
            shadow: shadowRound,
            classify: classifyRound,
            drag: classifyRound,
            'odd-animals': () => oddOneOutRound('animals'),
            'odd-shapes': () => oddOneOutRound('shapes'),
            'animal-sound': animalSoundRound,
            'animal-habitat': animalHabitatRound,
            'body-part': bodyPartRound,
            sense: senseRound,
            season: seasonRound,
            'plant-growth': plantGrowthRound,
            habit: habitRound,
            emotion: emotionRound,
            family: familyRound,
            painting: paintingRound,
            balloon: balloonRound,
            clock: clockRound,
            disappeared: disappearedRound,
            simon: () => simonRound(Math.min(5, 2 + level)),
            sequence: () => simonRound(Math.min(5, 2 + level)),
            quiz: wordMeaningRound
        };
        return roles[role] || roles.quiz;
    }

    // Which activity types suit each age track. Previously every age saw exactly
    // the same mix of round types and only the option count changed, so a 4-year-old
    // and an 8-year-old effectively played an identical game.
    const TRACK_RULES = {
        // Youngest: no abstract matrix reasoning, no multi-step ordering, no dragging.
        toddler: {
            avoid: ['raven-matrix', 'balance-scale', 'drag-match', 'order-steps', 'simon-memory', 'disappeared-item'],
            prefer: ['quiz', 'painting', 'balloon-pop', 'tracing', 'memory'],
            // A 4-year-old cannot read. Any question whose OPTIONS are long words or
            // whole sentences is unanswerable for them no matter how pretty it looks.
            maxOptionChars: 8,
            // A 4-year-old cannot sit through a 68-character riddle either.
            maxPromptChars: 46
        },
        preschool: {
            avoid: ['raven-matrix', 'balance-scale'],
            prefer: ['quiz', 'memory', 'painting', 'balloon-pop', 'tracing', 'order-steps'],
            // A 5-year-old is still a pre-reader: word-only answers and long riddle
            // prompts («قطره‌های آبی که از ابر روی زمین می‌ریزد») are unusable.
            maxOptionChars: 8,
            maxPromptChars: 52
        },
        early: { avoid: [], prefer: [] },
        // Oldest / gifted: drop the babyish fillers, favour reasoning.
        school: {
            avoid: ['painting', 'tracing', 'balloon-pop'],
            prefer: ['raven-matrix', 'balance-scale', 'drag-match', 'order-steps', 'simon-memory', 'quiz']
        }
    };

    // Simpler stand-ins used when a round is too advanced for the youngest track.
    // Deliberately weighted toward hands-on, non-quiz activities so the youngest
    // track does not collapse into wall-to-wall multiple choice.
    function simpleSubstitute() {
        return pick([
            // Picture-answer shape round: the child hears/sees the name and taps the
            // SHAPE. The word-answer variant (shapeNameRound) requires reading.
            shapeMatchRound, shapeMatchRound,
            paintingRound, paintingRound,
            () => memoryRound(2), () => memoryRound(2),
            balloonRound, balloonRound,
            () => tracingRound(pick(ALPHABET).letter, 'letter'),
            () => tracingRound(toFaDigit(rint(1, 5)), 'number'),
            // shapeNameRound was in this pool, so the pre-reader gate sometimes swapped
            // one word-answer round for another ("این چه شکلی است؟" -> «قلب»).
            colorRound, animalSoundRound, emotionRound
        ])();
    }
    // Harder stand-ins used when a round is too babyish for the oldest track.
    function advancedSubstitute() {
        return pick([ravenRound, shadowRound, oppositeMatchRound, materialRound, socialStoryRound])();
    }

    // True when every option is a picture/tile, or short enough to recognise by shape.
    function optionsReadableFor(round, maxChars, maxPromptChars) {
        // A pre-reader cannot read «کلید» any more than a long sentence: character
        // count alone was the wrong test. Words with NO picture are unusable, and a
        // long riddle prompt is unusable too even when the options are pictures.
        const opts = round && round.options;
        if (Number.isFinite(maxPromptChars)) {
            const prompt = String((round && round.prompt) || '').trim();
            if (prompt.length > maxPromptChars) return false;
        }
        if (!Array.isArray(opts) || !opts.length) return true;
        return opts.every(o => {
            if (o.img || o.tile) return true;
            const t = String(o.label || '').trim();
            if (!t) return true;
            // Digits and single glyphs (letters/numerals) are learnable symbols, not reading.
            if (/^[۰-۹0-9]+$/.test(t)) return true;
            if ([...t].length <= 1) return true;
            // Any real word without a picture fails, regardless of length.
            return false;
        });
    }

    function retypeRoundForTrack(round, trackKey, domainHint) {
        const rules = TRACK_RULES[trackKey];
        if (!rules || !round || !round.type) return round;

        // Swap out text-heavy questions for the youngest children.
        const promptTooLong = Number.isFinite(rules.maxPromptChars) &&
            String(round.prompt || '').trim().length > rules.maxPromptChars;
        if (round.type === 'quiz' && (promptTooLong ||
            (rules.maxOptionChars && !optionsReadableFor(round, rules.maxOptionChars, rules.maxPromptChars)))) {
            try {
                let alt = null;
                for (let attempt = 0; attempt < 6; attempt++) {
                    const cand = simpleSubstitute();
                    if (!cand) continue;
                    const candLong = Number.isFinite(rules.maxPromptChars) &&
                        String(cand.prompt || '').trim().length > rules.maxPromptChars;
                    if (!candLong && optionsReadableFor(cand, rules.maxOptionChars, rules.maxPromptChars)) { alt = cand; break; }
                }
                // Deterministic last resort: a shape round always has picture answers,
                // so a pre-reader can never be left with a word-only question.
                if (!alt) {
                    try {
                        const cand = shapeMatchRound();
                        if (cand && optionsReadableFor(cand, rules.maxOptionChars, rules.maxPromptChars)) alt = cand;
                    } catch (e) { /* keep null */ }
                }
                if (alt) {
                    return { ...alt, lessonId: round.lessonId, skillType: round.skillType, difficulty: round.difficulty };
                }
            } catch (e) { /* keep the original */ }
        }

        if (rules.avoid.indexOf(round.type) === -1) return round;
        // The `school` track avoids painting/tracing/balloon as "babyish", but an ART
        // lesson replaced by a raven matrix no longer teaches art at all: «رنگ گرم و
        // سرد» became a shadow-matching drill. Keep the round when it IS the subject
        // of the lesson, and only swap filler.
        // An art lesson must stay art for every age: swapping its rounds for logic
        // puzzles is exactly the "wrong category" problem. Same for the youngest
        // track, whose `avoid` list must not strip a lesson's own subject.
        const subject = String(domainHint || '');
        if (subject === 'art') return round;
        try {
            const replacement = (trackKey === 'school') ? advancedSubstitute() : simpleSubstitute();
            if (replacement && replacement.type && rules.avoid.indexOf(replacement.type) === -1) {
                return { ...replacement, lessonId: round.lessonId, skillType: round.skillType, difficulty: round.difficulty };
            }
        } catch (e) { /* fall through and keep the original round */ }
        return round;
    }

    function adaptRoundForAge(round, metadata, pkg) {
        const trackKey = resolveAgeTrack(metadata, pkg);
        round = retypeRoundForTrack(round, trackKey, (metadata && metadata.domain) || '');
        let track = (pkg.ageTracks && pkg.ageTracks[trackKey])
            || (trackKey === 'toddler' && pkg.ageTracks && pkg.ageTracks.preschool)
            || { optionCount: 4, hintDelay: 4500, maxNumber: 20, language: 'ساده' };
        if (trackKey === 'toddler') {
            // Youngest children: fewest choices, longest patience, smallest numbers.
            track = { ...track, optionCount: 2, hintDelay: 2200, maxNumber: Math.min(3, Number(track.maxNumber) || 3) };
        }
        const tagged = {
            ...round,
            lessonStory: pkg.story,
            lessonObjective: pkg.objective,
            lessonExample: pkg.example,
            mistakeFeedback: pkg.mistakeFeedback,
            parentTip: pkg.parentTip,
            ageTrack: trackKey,
            ageLanguage: track.language,
            hintDelay: track.hintDelay,
            reviewDays: pkg.reviewDays || [1, 3, 7]
        };

        if (Array.isArray(tagged.options) && Number(track.optionCount) < tagged.options.length) {
            const correct = tagged.options[tagged.answer];
            const distractors = tagged.options.filter((_, index) => index !== tagged.answer).slice(0, Math.max(1, track.optionCount - 1));
            tagged.options = shuffle([correct, ...distractors]);
            tagged.answer = tagged.options.indexOf(correct);
        }
        if (Array.isArray(tagged.shadowOptions) && Number(track.optionCount) < tagged.shadowOptions.length) {
            const correct = tagged.shadowOptions[tagged.answer];
            const distractors = tagged.shadowOptions.filter((_, index) => index !== tagged.answer).slice(0, Math.max(1, track.optionCount - 1));
            tagged.shadowOptions = shuffle([correct, ...distractors]);
            tagged.answer = tagged.shadowOptions.indexOf(correct);
        }
        // maxNumber was computed for every track but never enforced, so a 4-year-old
        // (ceiling 3) could be asked to count 7 objects, solve ۱ + ۷, or pick between
        // ۳ and ۷. Magnitude is a real developmental limit, so REGENERATE the round at
        // the child's ceiling; rewriting the printed labels afterwards cannot fix an
        // arithmetic round (the sum itself must change).
        const ceiling = Number(track.maxNumber);
        if (Number.isFinite(ceiling) && ceiling > 0 && Array.isArray(tagged.options) && tagged.options.length) {
            const valueOf = opt => {
                const raw = (opt && typeof opt === 'object') ? opt.label : opt;
                if (raw == null) return null;
                const t = String(raw).replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
                return /^\s*-?\d+\s*$/.test(t) ? Number(t) : null;
            };
            const values = tagged.options.map(valueOf);
            const allNumeric = values.length > 0 && values.every(v => v !== null);
            const promptNums = String(tagged.prompt || '')
                .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
                .match(/\d+/g) || [];
            const breaches = (allNumeric && values.some(v => Math.abs(v) > ceiling)) ||
                             promptNums.some(n => Math.abs(Number(n)) > ceiling);

            if (breaches) {
                const prompt = String(tagged.prompt || '');
                const safeMax = Math.max(2, ceiling);
                let rebuilt = null;
                try {
                    if (/چند تا شکل/.test(prompt)) rebuilt = countRound(safeMax);
                    else if (/عدد «/.test(prompt)) rebuilt = numberNameRound(safeMax);
                    else if (/عدد بعدی/.test(prompt)) rebuilt = numberOrderRound(safeMax);
                    else if (/بزرگ‌تر|کوچک‌تر/.test(prompt)) rebuilt = compareRound(safeMax);
                    else if (/[+＋]/.test(prompt)) rebuilt = arithRound('+', safeMax);
                    else if (/[-−]/.test(prompt)) rebuilt = arithRound('-', safeMax);
                } catch (e) { rebuilt = null; }

                if (rebuilt) {
                    Object.assign(tagged, rebuilt);
                    // The rebuild yields a fresh full-size option list; re-apply the cap.
                    const cap = Number(track.optionCount);
                    if (Number.isFinite(cap) && cap > 0 && Array.isArray(tagged.options) && cap < tagged.options.length) {
                        const keep = tagged.options[tagged.answer];
                        const others = tagged.options.filter((_, i) => i !== tagged.answer).slice(0, Math.max(1, cap - 1));
                        tagged.options = shuffle([keep, ...others]);
                        tagged.answer = tagged.options.indexOf(keep);
                    }
                } else if (allNumeric) {
                    // Non-arithmetic numeric round: shrink oversized distractors only.
                    const correctVal = values[tagged.answer];
                    if (correctVal !== null && Math.abs(correctVal) <= ceiling) {
                        const used = new Set([correctVal]);
                        const pool = [];
                        for (let v = 1; v <= ceiling; v++) if (!used.has(v)) pool.push(v);
                        const repl = shuffle(pool);
                        let r = 0;
                        const fixed = tagged.options.map((opt, i) => {
                            const v = values[i];
                            if (i === tagged.answer || (v !== null && Math.abs(v) <= ceiling)) return opt;
                            const nv = repl[r++];
                            if (nv === undefined) return opt;
                            return (opt && typeof opt === 'object') ? { ...opt, label: toFaDigit(nv) } : toFaDigit(nv);
                        });
                        const labels = fixed.map(o => (o && typeof o === 'object') ? o.label : o);
                        if (new Set(labels).size === labels.length) {
                            const keep = fixed[tagged.answer];
                            tagged.options = shuffle(fixed);
                            tagged.answer = tagged.options.indexOf(keep);
                        }
                    }
                }
            }
        }

        if (tagged.type === 'memory' && Array.isArray(tagged.cards)) {
            const maxPairs = trackKey === 'preschool' ? 2 : trackKey === 'early' ? 3 : 4;
            const pairIds = [...new Set(tagged.cards.map(card => card.pair))].slice(0, maxPairs);
            tagged.cards = tagged.cards.filter(card => pairIds.includes(card.pair));
        }
        if (tagged.type === 'simon-memory') {
            tagged.length = trackKey === 'preschool' ? Math.min(tagged.length, 2) : trackKey === 'early' ? Math.min(tagged.length, 3) : tagged.length;
        }
        return tagged;
    }

    function authoredLessonPlan(lessonId, metadata, pkg) {
        const level = lessonLevel(lessonId, metadata);
        // Letters named in the lesson title (package title is authoritative).
        const set = lessonLetters(pkg) || lessonLetters(metadata);

        // Alphabet lessons get a complete, deterministic plan. The old rotating
        // cursor walked a 5-slot roundPlan over 4 letters, so one letter was only
        // ever traced (never taught) while another was asked twice.
        if (set && set.length && /صدای الفبا/.test(pkg.title || metadata.title || '')) {
            // Teach each letter, but break the drill up with hands-on rounds. Before
            // this, a new child met 60+ consecutive multiple-choice questions and never
            // reached a game or the painting sheet at all.
            const factories = [];
            set.forEach((letterObj, i) => {
                factories.push(() => letterSoundRound(letterObj));
                factories.push(() => letterExampleRound(letterObj));
                // Halfway through, hand the child something to DO rather than choose.
                if (i === 1) factories.push(() => tracingRound(letterObj.letter, 'letter'));
            });
            // Finish on a game, not another question. A 4-year-old will not sit
            // through a 12-round lesson, so the set is capped at 10.
            factories.push(() => balloonRound());
            const rounds = plan(factories, { ...metadata, difficulty: level }, true);
            return rounds.map(round => adaptRoundForAge(round, metadata, pkg));
        }

        // A roundPlan made only of generic roles carries no topic information: a
        // plain "quiz" role pulls a random vocabulary word, so «عذرخواهی کردن»
        // asked about clocks and butterflies, and «چرخه آب» asked about good
        // manners. 29 authored lessons across science, socio-emotional, reading,
        // logic and art shipped that way.
        // The domain/type router below DOES have correct builders for these
        // topics, so when the authored plan says nothing specific we defer to it
        // instead of letting the placeholder win.
        const GENERIC_ROLES = new Set(['quiz', 'memory', 'order-size', 'balloon', 'painting']);
        const authoredRoles = pkg.roundPlan || [];
        const allGeneric = authoredRoles.length > 0 && authoredRoles.every(r => GENERIC_ROLES.has(r));
        if (allGeneric) return null;

        let li = 0;
        const letterCursor = set ? () => set[li++ % set.length] : null;
        const factories = authoredRoles.map(role => roleFactory(role, level, letterCursor, metadata));
        const rounds = plan(factories, { ...metadata, difficulty: level });
        return rounds.map(round => adaptRoundForAge(round, metadata, pkg));
    }


    // Fallback age tracks for lessons that have no authored package. Without this
    // 150 of 292 lessons ignored the child's age completely: a 4-year-old and an
    // 8-year-old saw the same number of options.
    const GENERIC_AGE_TRACKS = {
        toddler:   { label: '۴ سال', optionCount: 2, hintDelay: 2200, maxNumber: 3, language: 'خیلی کوتاه و تصویری' },
        preschool: { label: '۵ سال', optionCount: 2, hintDelay: 2600, maxNumber: 5, language: 'کوتاه و شنیداری' },
        early:     { label: '۵ تا ۶ سال', optionCount: 3, hintDelay: 3800, maxNumber: 10, language: 'ساده و تصویری' },
        school:    { label: '۷ تا ۸ سال', optionCount: 4, hintDelay: 5000, maxNumber: 20, language: 'استدلالی و دقیق' }
    };

    // Topic narration: the first round of a lesson in these skill areas plays a
    // short spoken explanation, so maths/science/emotions are taught aloud too
    // (previously only the alphabet had any narration at all).
    const TOPIC_AUDIO = {
        'counting': 'topic-counting', 'counting-game': 'topic-counting',
        'number-recognition': 'topic-counting', 'number-order': 'topic-counting',
        'addition': 'topic-addition', 'addition-concept': 'topic-addition',
        'addition-game': 'topic-addition',
        'subtraction': 'topic-subtraction', 'subtraction-concept': 'topic-subtraction',
        'subtraction-game': 'topic-subtraction',
        'shapes': 'topic-shapes', 'shape-matching': 'topic-shapes',
        'shape-construction': 'topic-shapes',
        'animal': 'topic-animals', 'animals': 'topic-animals',
        'animal-sounds': 'topic-animals',
        'seasons': 'topic-seasons', 'seasons-activity': 'topic-seasons',
        'senses': 'topic-senses', 'body-parts': 'topic-senses',
        'emotions': 'topic-emotions', 'emotion-game': 'topic-emotions',
        'social-emotional': 'topic-emotions',
        // Broader coverage so most lessons open with a spoken explanation.
        'arithmetic': 'topic-addition', 'mixed-operations': 'topic-addition',
        'problem-solving': 'topic-addition', 'place-value': 'topic-counting',
        'comparison': 'topic-counting', 'number-pattern': 'topic-counting',
        'patterns': 'topic-shapes', 'create-patterns': 'topic-shapes',
        
        'plant-parts': 'topic-seasons', 'plant-growth': 'topic-seasons',
        'flowers': 'topic-seasons', 'earth-science': 'topic-seasons',
        'water-cycle': 'topic-seasons', 
        'health': 'topic-senses',
        'friendship': 'topic-emotions', 'sharing': 'topic-emotions',
        'apologizing': 'topic-emotions', 'etiquette': 'topic-emotions',
        'patience': 'topic-emotions', 'family': 'topic-emotions',
        'responsibility': 'topic-emotions', 'self-identity': 'topic-emotions',
        'conflict-resolution': 'topic-emotions', 'teamwork': 'topic-emotions',
        'diversity': 'topic-emotions',
        // These 25 lessons opened in silence because their type had no clip:
        // measurement, volume, time, matching, recycling, energy, conservation
        // and scientific-reasoning. Each now has its own Persian narration.
        'measurement': 'topic-measure', 'volume': 'topic-measure',
        'time': 'topic-time',
        'matching': 'topic-matching', 'pairing': 'topic-matching',
        'recycling': 'topic-recycle', 'conservation': 'topic-recycle',
        'energy': 'topic-energy',
        'science': 'topic-experiment', 'scientific-reasoning': 'topic-experiment',
        // Remaining skill areas -> every lesson now opens with spoken guidance.
        'creative-art': 'topic-art', 'drawing': 'topic-art', 'colors': 'topic-art',
        'coloring': 'topic-art', 'finger-painting': 'topic-art',
        'illustration': 'topic-art', 'craft': 'topic-art', 'sculpture': 'topic-art',
        'free-drawing': 'topic-art',
        'reading': 'topic-reading', 'comprehension': 'topic-reading',
        'story': 'topic-reading', 'character-analysis': 'topic-reading',
        'sight-words': 'topic-reading', 'language': 'topic-reading',
        'reasoning': 'topic-logic', 'deduction': 'topic-logic', 'riddle': 'topic-logic',
        'odd-one-out': 'topic-logic', 'spot-difference': 'topic-logic',
        'maze': 'topic-logic', 'puzzle': 'topic-logic', 'jigsaw': 'topic-logic',
        'venn-diagram': 'topic-logic', 'association': 'topic-logic',
        'phonemic-awareness': 'topic-words', 'rhyming': 'topic-words',
        'syllables': 'topic-words', 'blending': 'topic-words',
        'word-building': 'topic-words', 'letter-connection': 'topic-words',
        'vocabulary': 'topic-words', 
        'memory-logic': 'topic-memory', 'pairing': 'topic-memory',
        'shadow-matching': 'topic-memory',
        'sequencing': 'topic-sequence', 'ordering': 'topic-sequence',
        'word-order': 'topic-sequence',
        'sentence-building': 'topic-sentence', 'fill-blank': 'topic-sentence',
        'classification': 'topic-classify', 'categorization': 'topic-classify',
        'creative-writing': 'topic-create', 'story-creation': 'topic-create',
        'journaling': 'topic-create', 'comic': 'topic-create',
        'music': 'topic-music'
    };

    // Gifted lessons reuse generic skill types ('reasoning', 'patterns'...), so a
    // type lookup would give them a maths or shapes intro. Route them by TITLE to
    // their own recorded intros instead, and only fall back to the type table.
    const GIFTED_TOPIC_AUDIO = [
        [/ماتریس|ریون/, 'gifted-raven'],
        [/ترازو|تعادل|سنگین/, 'gifted-balance'],
        [/حافظه|توالی|زنگ|ناپدید|کم شد/, 'gifted-memory'],
        [/سایه/, 'gifted-shadow'],
        [/ناجور|تفاوت/, 'gifted-odd'],
        [/دسته بندی|طبقه بندی|دسته‌بندی|طبقه‌بندی/, 'gifted-classify'],
        [/الگو|دنباله|قرینه/, 'gifted-pattern'],
        [/مرتب|ترتیب|اندازه|مراحل|داستان/, 'gifted-order'],
        [/شمارش|محاسبه|جمع|تفریق|عددی/, 'gifted-number'],
        [/معما|راز/, 'gifted-riddle'],
        [/قیاس|رابطه|استنتاج|استدلال|منطقی|مسئله/, 'gifted-reason'],
        [/جفت|مقایسه|بزرگ‌تر|بیشتر/, 'gifted-compare']
    ];

    // Every gifted lesson has its OWN recorded line, written for its age band:
    // clip id is the lesson id lower-cased (G-L1-L01 -> gifted-g-l1-l01). These
    // are produced by scripts/generate_gifted_audio.py with the same
    // AI-voice + kidify (+28% pitch, formant shifted) pipeline as every other
    // clip. The keyword table above stays as a fallback for any future gifted
    // lesson added before its line is recorded.
    function giftedLessonClip(metadata) {
        const id = String((metadata && metadata.id) || '');
        if (!/^G-/.test(id)) return null;
        const clip = 'gifted-' + id.toLowerCase();
        // Only claim the clip if it was actually recorded and shipped.
        return (window.AudioEngine && window.AudioEngine.hasClipFile
            && window.AudioEngine.hasClipFile(clip)) ? clip : null;
    }

    function topicClipFor(metadata) {
        const isGifted = metadata && (metadata.domain === 'gifted'
            || /^G-/.test(String(metadata.id || '')));
        if (isGifted) {
            const own = giftedLessonClip(metadata);
            if (own) return own;
            const title = String((metadata && metadata.title) || '');
            for (const [re, clip] of GIFTED_TOPIC_AUDIO) if (re.test(title)) return clip;
            return 'gifted-welcome';
        }
        const t = metadata && metadata.type;
        return (t && TOPIC_AUDIO[t]) || null;
    }

    // ------------------------------------------------------------------
    // TITLE-DRIVEN ROUTING
    // 150 of 292 lessons have no authored package. Their `type` is a coarse
    // bucket -- 15 lessons share "social-emotional", 15 share "creative-art",
    // 10 share "reasoning" -- so they all collapsed into one `default:` branch
    // and produced the same generic rounds no matter what their title promised.
    // «عذرخواهی و جبران» and «گوش دادن فعال» taught identical content.
    // The titles ARE specific, so use them: the first matching keyword wins.
    // ------------------------------------------------------------------
    function titlePlan(metadata, level) {
        const title = String((metadata && metadata.title) || '');
        if (!title) return null;
        const has = (...words) => words.some(w => title.includes(w));
        // Title keywords were matched with no regard for the lesson's domain, so
        // a READING lesson called «پاراگراف کوتاه: یک دوست تازه» was captured by
        // the friendship rule and taught socio-emotional content instead of
        // reading; «نوشتن یک پیام کوتاه برای دوست» likewise. Gate the
        // domain-specific blocks so a keyword can only fire inside its own
        // subject. `null` here means "no title rule applies", and the caller
        // then falls through to the correct domain/type router.
        const dom = (metadata && metadata.domain) || '';
        const inDomain = (...allowed) => !dom || allowed.indexOf(dom) !== -1;

        // --- gifted / entrance-exam track -------------------------------------
        // Checked first and gated to the domain: these titles ("الگو", "معما",
        // "حافظه") also appear in maths and logic lessons, and the gifted track
        // must not steal them, nor be routed by them.
        // Callers that pass a bare curriculum lesson (audit scripts, tests) have
        // no `domain` field, so fall back to the G- id prefix.
        const giftedId = /^G-/.test(String((metadata && metadata.id) || ''));
        if (dom === 'gifted' || (!dom && giftedId)) {
            // Age gate: the youngest gifted band must never be handed an abstract
            // Raven matrix or a balance scale, and the oldest must not be handed
            // finger-painting. `level` carries the lesson difficulty (2..12).
            const tiny = level <= 3;      // ۴ تا ۵ سال
            const young = level <= 7;     // ۵ تا ۶ سال
            const nmax = level <= 6 ? 10 : 20;

            // Hands-on rounds keep a 4-year-old engaged between thinking rounds.
            const playful = () => pick([
                balloonRound,
                () => tracingRound(toFaDigit(rint(1, tiny ? 5 : 9)), 'number'),
                paintingRound
            ])();

            if (has('ماتریس', 'ریون'))
                return tiny
                    ? [shadowRound, patternRound, oddOneOutRound, playful, patternRound]
                    : [ravenRound, ravenRound, patternRound, ravenRound, oddOneOutRound];
            if (has('ترازو', 'تعادل', 'سنگین'))
                return tiny
                    ? [() => compareRound(10), orderSizeRound, playful, () => compareRound(10), oddOneOutRound]
                    : [balanceRound, balanceRound, () => compareRound(nmax), balanceRound, orderSizeRound];
            if (has('زنگ', 'توالی'))
                return [simonRound, simonRound, () => memoryRound(tiny ? 2 : 3), disappearedRound, patternOrderRound];
            if (has('ناپدید', 'کم شد'))
                return [disappearedRound, disappearedRound, () => memoryRound(tiny ? 2 : 3), simonRound, oddOneOutRound];
            if (has('حافظه'))
                return [() => memoryRound(tiny ? 2 : 3), simonRound, disappearedRound, () => memoryRound(tiny ? 2 : 3), patternRound];
            if (has('سایه'))
                return [shadowRound, shadowRound, oddOneOutRound, shadowRound, playful];
            if (has('وصله ناجور', 'ناجور'))
                return [oddOneOutRound, oddOneOutRound, classifyRound, oddOneOutRound, tiny ? playful : ravenRound];
            if (has('تفاوت'))
                return [shadowRound, oddOneOutRound, shadowRound, oddOneOutRound, classifyRound];
            if (has('دسته بندی', 'طبقه بندی', 'دسته‌بندی', 'طبقه‌بندی'))
                return [classifyRound, classifyRound, oddOneOutRound, classifyRound, tiny ? playful : ravenRound];
            if (has('الگوی عددی', 'دنباله عددی'))
                return [() => numberOrderRound(nmax), patternRound, () => numberOrderRound(nmax), () => compareRound(nmax), patternOrderRound];
            if (has('قرینه', 'نقاشی'))
                return [paintingRound, patternRound, shadowRound, paintingRound, patternOrderRound];
            if (has('بادکنک'))
                return [balloonRound, patternRound, balloonRound, oddOneOutRound, patternOrderRound];
            if (has('الگو', 'دنباله'))
                return tiny
                    ? [patternRound, patternOrderRound, playful, patternRound, shadowRound]
                    : [patternRound, patternOrderRound, patternRound, ravenRound, patternOrderRound];
            if (has('داستان'))
                return [storyOrderRound, storyOrderRound, patternOrderRound, orderSizeRound, classifyRound];
            if (has('مرتب', 'کوچک به بزرگ', 'مراحل', 'ترتیب اندازه'))
                return [orderSizeRound, storyOrderRound, orderSizeRound, patternOrderRound, () => compareRound(nmax)];
            if (has('محاسبه', 'جمع و تفریق', 'ذهنی'))
                return [() => arithRound('+', nmax), () => arithRound('-', nmax), () => compareRound(nmax), () => arithRound('+', nmax), () => arithRound('-', nmax)];
            if (has('شمارش')) {
                const cmax = tiny ? 5 : 10;
                return [() => countRound(cmax), () => countRound(cmax), () => compareRound(cmax), () => countRound(cmax), playful];
            }
            if (has('بزرگ‌تر', 'بیشتر', 'مقایسه'))
                return [() => compareRound(tiny ? 10 : nmax), orderSizeRound, () => compareRound(tiny ? 10 : nmax), oddOneOutRound, playful];
            if (has('جفت'))
                return [() => memoryRound(tiny ? 2 : 3), shadowRound, () => memoryRound(tiny ? 2 : 3), oddOneOutRound, classifyRound];
            if (has('قیاس', 'رابطه'))
                return young
                    ? [classifyRound, oddOneOutRound, shadowRound, classifyRound, patternRound]
                    : [ravenRound, classifyRound, oddOneOutRound, ravenRound, balanceRound];
            if (has('استنتاج', 'استدلال', 'منطقی', 'مسئله'))
                return young
                    ? [oddOneOutRound, classifyRound, patternRound, orderSizeRound, shadowRound]
                    : [ravenRound, oddOneOutRound, classifyRound, balanceRound, () => arithRound('+', nmax)];
            if (has('معما', 'راز'))
                return young
                    ? [oddOneOutRound, shadowRound, classifyRound, patternRound, playful]
                    : [oddOneOutRound, ravenRound, shadowRound, classifyRound, balanceRound];
            // Any other gifted lesson still gets reasoning work, never filler.
            return tiny
                ? [oddOneOutRound, patternRound, shadowRound, playful, classifyRound]
                : [ravenRound, oddOneOutRound, patternRound, shadowRound, classifyRound];
        }

        // --- reading / phonics (most specific first) --------------------------
        if (has('صدای اول', 'صدای آغازین'))
            return [firstSoundRound, () => letterExampleRound(pick(ALPHABET)), firstSoundRound, syllableRound];
        if (has('صدای آخر', 'صدای مشترک'))
            return [firstSoundRound, rhymeRound, firstSoundRound, syllableRound];
        if (has('قافیه'))
            return [rhymeRound, rhymeRound, syllableRound, firstSoundRound];
        if (has('هجا', 'بخش بندی', 'بخش‌بندی'))
            return [syllableRound, syllableRound, rhymeRound, firstSoundRound];
        if (has('دوحرفی', 'سه حرفی', 'ترکیب حروف', 'کلمه سازی', 'کلمه‌سازی', 'واژه‌سازی'))
            return [blendRound, blendRound, sightWordRound, () => memoryRound(3)];
        if (has('متصل و منفصل'))
            return [blendRound, () => letterSoundRound(pick(ALPHABET)), () => tracingRound(pick(ALPHABET).letter, 'letter'), blendRound];
        if (has('واژه‌های روزمره', 'پرکاربرد', 'روان خوانی', 'روان‌خوانی'))
            return [sightWordRound, sightWordRound, sentenceRound, wordMeaningRound];
        if (has('متضاد', 'مخالف'))
            return [oppositeRound, oppositeMatchRound, oppositeRound, wordMeaningRound];
        if (has('هم‌معنی', 'هم معنی'))
            return [wordMeaningRound, sightWordRound, oppositeRound, sentenceRound];
        if (has('ترتیب واژه', 'مرتب کردن کلمات', 'جمله سازی', 'جمله‌سازی'))
            return [sentenceOrderRound, sentenceRound, sentenceOrderRound, storyOrderRound];
        if (has('نوشتن حروف', 'نوشتن کلمات') || (has('با انگشت') && !has('جمع', 'تفریق', 'عدد')))
            return [() => tracingRound(pick(ALPHABET).letter, 'letter'), () => tracingRound(pick(ALPHABET).letter, 'letter'), blendRound, sightWordRound];

        // --- math patterns / numbers ------------------------------------------
        if (has('الگوی عددی'))
            return [() => numberOrderRound(level <= 4 ? 10 : 20), patternRound, () => numberOrderRound(level <= 4 ? 10 : 20), () => compareRound(level <= 4 ? 10 : 20)];
        if (has('الگوی رنگی'))
            return [patternRound, colorRound, patternRound, patternOrderRound];
        if (has('عدد گمشده', 'دنباله'))
            return [() => numberOrderRound(level <= 4 ? 10 : 20), () => numberOrderRound(level <= 4 ? 10 : 20), patternRound, () => compareRound(level <= 4 ? 10 : 20)];
        if (has('الگوی ترکیبی'))
            return [patternRound, patternOrderRound, shapeMatchRound, colorRound];
        if (has('جمع با', 'جمع تا', 'جمع کردن'))
            return [() => arithRound('+', level <= 4 ? 10 : 20), () => countRound(level <= 4 ? 10 : 20), () => arithRound('+', level <= 4 ? 10 : 20), () => numberOrderRound(level <= 4 ? 10 : 20)];
        if (has('تفریق'))
            return [() => arithRound('-', level <= 4 ? 10 : 20), () => countRound(level <= 4 ? 10 : 20), () => arithRound('-', level <= 4 ? 10 : 20), () => compareRound(level <= 4 ? 10 : 20)];
        if (has('جمع و تفریق', 'چالش ترکیبی'))
            return [() => arithRound('+', level <= 4 ? 10 : 20), () => arithRound('-', level <= 4 ? 10 : 20), () => arithRound('both', level <= 4 ? 10 : 20), () => compareRound(level <= 4 ? 10 : 20)];

        // --- plants (science + logic sequencing both use these titles) ---------
        if (has('بخش های یک گیاه', 'بخش‌های گیاه', 'بخش های گیاه', 'بخش‌های یک گیاه'))
            return [plantGrowthRound, plantGrowthRound, materialRound, plantGrowthRound];
        if (has('گیاه', 'دانه') && has('رشد', 'روند', 'ترتیب', 'مراحل'))
            return [plantGrowthRound, plantGrowthRound, storyOrderRound, plantGrowthRound];
        if (has('گل های رنگارنگ', 'گل‌های رنگارنگ'))
            return [colorRound, colorMixRound, plantGrowthRound, colorRound];

        // --- colour-led logic/math titles --------------------------------------
        if (has('رنگ های مشابه', 'رنگ‌های مشابه'))
            return [colorRound, colorRound, () => memoryRound(3), shapeMatchRound];
        if (has('رنگ') && has('دسته‌بندی', 'دسته بندی', 'طبقه'))
            return [colorRound, classifyRound, colorRound, shapeMatchRound];
        if (has('رنگ') && has('ماتریس', 'الگو'))
            return [colorRound, patternRound, ravenRound, colorMixRound];

        // --- art: painting titles ----------------------------------------------
        if (has('نقاشی با انگشت', 'انگشتی'))
            return [paintingRound, paintingRound, colorRound, colorMixRound];
        if (has('طراحی') && has('حیوان', 'گل'))
            return [paintingRound, paintingRound, colorRound, shapeMatchRound];

        // --- science ----------------------------------------------------------
        if (has('رشد') && has('گیاه', 'دانه'))
            return [plantGrowthRound, plantGrowthRound, () => oddOneOutRound('shapes'), storyOrderRound];
        if (has('بخش های یک گیاه', 'بخش‌های گیاه', 'بخش های گیاه'))
            return [plantGrowthRound, plantGrowthRound, materialRound, plantGrowthRound];
        if (has('گل های رنگارنگ', 'گل‌های رنگارنگ'))
            return [colorRound, plantGrowthRound, colorRound, colorMixRound];
        if (has('زیستگاه', 'سازگاری حیوان', 'ردپای حیوان', 'محافظت از حیوان'))
            return [animalHabitatRound, animalSoundRound, animalHabitatRound, () => oddOneOutRound('animals')];
        if (has('صدای حیوان'))
            return [animalSoundRound, animalSoundRound, animalHabitatRound, () => oddOneOutRound('animals')];

        // --- socio-emotional -------------------------------------------------
        // Only for socio-emotional lessons: words like «دوست» and «خانه» appear
        // in reading titles too, and used to steal those lessons.
        if (!inDomain('socio-emotional')) return null;
        if (has('عذرخواهی', 'جبران'))
            return [() => socialStoryRound('عذرخواهی'), behaviourSortRound, () => emotionMatchRound('پشیمان|ناراحت'), habitRound];
        if (has('عصبانی', 'خشم', 'کنترل هیجان'))
            return [() => socialStoryRound('عصبانی'), () => emotionMatchRound('عصبان|خشم|آرامش'), emotionRound, behaviourSortRound];
        if (has('صبر', 'نوبت'))
            return [() => socialStoryRound('نوبت'), behaviourSortRound, habitRound, emotionRound];
        if (has('دوست', 'دوستی'))
            return [() => socialStoryRound('دوست'), behaviourSortRound, emotionMatchRound, socialStoryRound];
        if (has('ناراحت', 'همدلی', 'دلداری'))
            return [() => socialStoryRound('ناراحت'), () => emotionMatchRound('ناراحت|غم|همدل'), emotionRound, behaviourSortRound];
        if (has('کمک', 'مسئولیت', 'خانه'))
            return [() => socialStoryRound('خانه|کمک'), habitRound, behaviourSortRound, familyRound];
        if (has('کار گروهی', 'تقسیم', 'همکاری'))
            return [behaviourSortRound, () => socialStoryRound('دوست|نوبت'), familyRound, habitRound];
        if (has('گوش دادن', 'گفت‌وگو', 'محترمانه', 'نه گفتن'))
            return [() => socialStoryRound('ناراحت|دوست'), behaviourSortRound, habitRound, emotionRound];
        if (has('خودم را می‌شناسم', 'نقطه قوت', 'خودشناسی'))
            return [emotionRound, () => emotionMatchRound('افتخار|اعتماد|شاد'), familyRound, habitRound];
        if (has('متفاوت', 'ارزشمند', 'تفاوت'))
            return [familyRound, behaviourSortRound, emotionRound, () => socialStoryRound('دوست')];
        if (has('احساس', 'هیجان', 'حس'))
            return [emotionRound, emotionMatchRound, () => socialStoryRound('ناراحت'), behaviourSortRound];

        // --- art --------------------------------------------------------------
        if (has('رنگ گرم', 'رنگ سرد', 'ترکیب رنگ', 'ترکیب دو رنگ', 'ترکیب سه رنگ'))
            return [colorMixRound, colorRound, colorMixRound, paintingRound];
        if (has('الگو') && has('نقطه', 'خط', 'تکرارشونده'))
            return [patternRound, patternOrderRound, paintingRound, colorRound];
        if (has('نقاشی', 'رنگ‌آمیزی', 'طراحی', 'کمیک', 'پوستر', 'کارت تبریک', 'شخصیت', 'قاب'))
            return [paintingRound, paintingRound, colorRound, colorMixRound];
        if (has('ریتم', 'موسیقی', 'آهنگ', 'دست زدن'))
            return [balloonRound, patternOrderRound, paintingRound, colorRound];
        if (has('شکل') && has('دایره', 'مربع', 'ساختن', 'تبدیل'))
            return [shapeMatchRound, patternRound, paintingRound, orderSizeRound];

        // --- logic --------------------------------------------------------------
        if (has('حافظه') || /حافظه \d/.test(title))
            return [() => memoryRound(Math.min(5, 3 + Math.floor(level / 3))), () => memoryRound(4), disappearedRound, simonRound];
        if (has('جفت‌یابی', 'جفت یابی'))
            return [() => memoryRound(4), () => memoryRound(3), shadowRound, disappearedRound];
        if (has('شیء گمشده', 'شیء گم'))
            return [disappearedRound, () => memoryRound(4), shadowRound, simonRound];
        if (has('سایه'))
            return [shadowRound, shadowRound, shapeMatchRound, () => memoryRound(3)];
        if (has('ماتریس'))
            return [ravenRound, ravenRound, patternRound, shapeMatchRound];
        if (has('دنباله', 'الگوی پنهان', 'الگو'))
            return [patternRound, patternOrderRound, ravenRound, orderSizeRound];
        if (has('رنگ های مشابه', 'رنگ‌های مشابه'))
            return [colorRound, () => memoryRound(3), colorRound, shapeMatchRound];
        if (has('حیوانات') && has('دسته', 'میوه'))
            return [classifyRound, () => oddOneOutRound('animals'), animalHabitatRound, classifyRound];
        if (has('دسته‌بندی', 'دسته بندی', 'طبقه‌بندی', 'طبقه بندی'))
            return [classifyRound, classifyRound, () => oddOneOutRound('shapes'), () => oddOneOutRound('animals')];
        if (has('متفاوت است', 'کدام تصویر متفاوت'))
            return [() => oddOneOutRound('animals'), () => oddOneOutRound('shapes'), shadowRound, classifyRound];
        if (has('ترتیب') && has('رشد', 'گیاه'))
            return [plantGrowthRound, storyOrderRound, orderSizeRound, plantGrowthRound];
        if (has('اول اتفاق', 'ترتیب', 'مراحل'))
            return [storyOrderRound, orderSizeRound, plantGrowthRound, socialStoryRound];
        if (has('معما', 'سرنخ'))
            return [wordMeaningRound, ravenRound, () => oddOneOutRound('animals'), shadowRound];
        if (has('مسیر', 'پازل'))
            return [ravenRound, patternRound, shadowRound, () => memoryRound(3)];

        return null;
    }

    function lessonPlan(lessonId, metadata) {
        const pkg = window.LESSON_PACKAGES && window.LESSON_PACKAGES[lessonId];
        if (pkg) {
            const authored = authoredLessonPlan(lessonId, metadata, pkg);
            // null means the package had nothing topic-specific to contribute.
            if (authored) return authored;
        }
        {
            const lvl = lessonLevel(lessonId, metadata);
            const tp = titlePlan(metadata, lvl);
            if (tp) return plan(tp, { ...metadata, difficulty: lvl });
        }
        const domain = inferDomain(lessonId, metadata);
        const type = metadata && metadata.type || '';
        const level = lessonLevel(lessonId, metadata);
        const countMax = level <= 2 ? 5 : level <= 4 ? 10 : 20;
        const pairCount = Math.min(5, 2 + Math.floor(level / 2));

        if (domain === 'reading') {
            switch (type) {
                case 'recognition': {
                    // Teach the letters this lesson is actually named after.
                    const set = lessonLetters(metadata) || ALPHABET;
                    let i = 0;
                    const nextLetter = () => set[i++ % set.length];
                    return plan(
                        set.map((_, idx) => (idx % 3 === 1
                            ? () => letterExampleRound(nextLetter())
                            : idx % 3 === 2
                                ? () => tracingRound(nextLetter().letter, 'letter')
                                : () => letterSoundRound(nextLetter()))),
                        metadata
                    );
                }
                case 'phonemic-awareness':
                case 'rhyming':
                case 'syllables':
                    return plan([firstSoundRound, rhymeRound, syllableRound], metadata);
                case 'blending':
                case 'letter-connection':
                case 'word-building':
                    return plan([blendRound, blendRound, memoryRound.bind(null, 3)], metadata);
                case 'tracing':
                    return plan([() => tracingRound(pick(ALPHABET).letter, 'letter'), () => tracingRound(pick(ALPHABET).letter, 'letter'), paintingRound], metadata);
                case 'sentence-building':
                case 'word-order':
                case 'sequencing':
                case 'creative-writing':
                case 'story':
                case 'story-creation':
                case 'journaling':
                    return plan([sentenceOrderRound, storyOrderRound, sentenceRound, wordMeaningRound], metadata);
                case 'opposites':
                    return plan([oppositeMatchRound, oppositeRound, oppositeMatchRound], metadata);
                case 'vocabulary':
                case 'sight-words':
                case 'comprehension':
                case 'character-analysis':
                case 'fill-blank':
                case 'matching':
                case 'reading':
                default:
                    return plan([sightWordRound, wordMeaningRound, oppositeMatchRound, sentenceOrderRound, oppositeRound, sentenceRound], metadata);
            }
        }

        if (domain === 'math') {
            switch (type) {
                case 'counting':
                case 'counting-game':
                    return plan([() => countRound(countMax), () => countRound(countMax), () => tracingRound(toFaDigit(rint(1, countMax)), 'number')], metadata);
                case 'number-recognition':
                    return plan([() => numberNameRound(countMax), () => tracingRound(toFaDigit(rint(1, countMax)), 'number'), () => countRound(countMax)], metadata);
                case 'number-order':
                case 'number-pattern':
                case 'place-value':
                    return plan([() => numberOrderRound(countMax), () => compareRound(countMax), () => numberNameRound(countMax)], metadata);
                case 'addition':
                case 'addition-concept':
                case 'addition-game':
                    return plan([() => arithRound('+', countMax), () => arithRound('+', countMax), balanceRound], metadata);
                case 'subtraction':
                case 'subtraction-concept':
                case 'subtraction-game':
                    return plan([() => arithRound('-', countMax), () => arithRound('-', countMax), balanceRound], metadata);
                case 'shapes':
                case 'shape-matching':
                case 'shape-construction':
                    return plan([shapeNameRound, shapeMatchRound, orderSizeRound], metadata);
                case 'patterns':
                case 'create-patterns':
                    return plan([patternRound, patternRound, ravenRound], metadata);
                case 'comparison':
                case 'measurement':
                case 'volume':
                    return plan([() => compareRound(countMax), orderSizeRound, balanceRound], metadata);
                case 'time':
                    return plan([clockRound, clockRound, () => numberNameRound(12)], metadata);
                case 'mixed-operations':
                default:
                    return plan([() => arithRound('both', countMax), () => compareRound(countMax), () => countRound(countMax), balanceRound], metadata);
            }
        }

        if (domain === 'logic') {
            switch (type) {
                case 'matching':
                case 'pairing':
                    return plan([() => memoryRound(pairCount), () => memoryRound(pairCount), disappearedRound], metadata);
                case 'jigsaw':
                case 'puzzle':
                case 'maze':
                    return plan([orderSizeRound, ravenRound, shadowRound, storyOrderRound], metadata);
                case 'categorization':
                case 'classification':
                case 'venn-diagram':
                    return plan([classifyRound, classifyRound, oddOneOutRound.bind(null, 'animals')], metadata);
                case 'spot-difference':
                case 'odd-one-out':
                    return plan([oddOneOutRound.bind(null, 'animals'), oddOneOutRound.bind(null, 'shapes'), shadowRound], metadata);
                case 'shadow-matching':
                    return plan([shadowRound, shadowRound, shapeMatchRound], metadata);
                case 'sequencing':
                case 'ordering':
                case 'association':
                case 'deduction':
                case 'riddle':
                    return plan([storyOrderRound, orderSizeRound, ravenRound, classifyRound], metadata);
                default:
                    return plan([() => memoryRound(pairCount), ravenRound, shadowRound, storyOrderRound], metadata);
            }
        }

        if (domain === 'science') {
            switch (type) {
                case 'animal':
                case 'animals':
                case 'animal-sounds':
                    return plan([animalSoundRound, habitatMatchRound, animalHabitatRound, animalSoundRound], metadata);
                case 'body-parts':
                    return plan([bodyPartRound, bodyUseRound, senseRound], metadata);
                case 'senses':
                    return plan([senseRound, bodyUseRound, senseRound, bodyPartRound], metadata);
                case 'seasons':
                case 'seasons-activity':
                    return plan([seasonRound, monthSeasonRound, plantGrowthRound], metadata);
                case 'plant-growth':
                    return plan([plantGrowthRound, monthSeasonRound, seasonRound], metadata);
                case 'plant-parts':
                case 'flowers':
                    return plan([shapeNameRound, plantGrowthRound, materialRound, colorRound], metadata);
                case 'health':
                    return plan([habitRound, bodyUseRound, senseRound, bodyPartRound], metadata);
                case 'materials':
                    return plan([materialRound, floatSinkRound, classifyRound], metadata);
                case 'water-cycle':
                    return plan([floatSinkRound, storyOrderRound, materialRound, seasonRound], metadata);
                case 'conservation':
                case 'recycling':
                case 'energy':
                default:
                    return plan([storyOrderRound, materialRound, floatSinkRound, habitRound, monthSeasonRound, classifyRound], metadata);
            }
        }

        if (domain === 'socio-emotional') {
            switch (type) {
                case 'emotions':
                case 'emotion-game':
                    return plan([emotionRound, emotionMatchRound, socialStoryRound, habitRound], metadata);
                case 'family':
                    return plan([familyRound, emotionMatchRound, socialStoryRound, habitRound], metadata);
                case 'apologizing':
                case 'conflict-resolution':
                    return plan([socialStoryRound, behaviourSortRound, emotionRound, habitRound], metadata);
                case 'friendship':
                case 'sharing':
                case 'teamwork':
                    return plan([socialStoryRound, behaviourSortRound, emotionMatchRound, familyRound], metadata);
                case 'etiquette':
                case 'patience':
                case 'responsibility':
                case 'diversity':
                case 'self-identity':
                default:
                    return plan([behaviourSortRound, socialStoryRound, emotionMatchRound, habitRound, emotionRound, familyRound], metadata);
            }
        }

        if (domain === 'art') {
            switch (type) {
                case 'colors':
                    return plan([colorRound, colorMixRound, patternOrderRound, patternRound], metadata);
                case 'drawing':
                case 'coloring':
                case 'finger-painting':
                case 'illustration':
                case 'free-drawing':
                case 'comic':
                    return plan([paintingRound, colorMixRound, paintingRound, colorRound], metadata);
                case 'music':
                    return plan([balloonRound, patternOrderRound, colorRound, paintingRound], metadata);
                case 'craft':
                case 'sculpture':
                default:
                    return plan([paintingRound, materialRound, orderSizeRound, colorMixRound, patternOrderRound], metadata);
            }
        }

        return null;
    }

    // ==========================================
    // LEGACY FALLBACKS (kept for direct calls from old integrations)
    // ==========================================
    // ==========================================
    // VISUAL & ICON ENRICHMENT (Android-first UI)
    // Guarantees that every quiz option carries an icon and every quiz round has a
    // non-empty center stage — previously many rounds rendered an empty white box.
    // ==========================================
    const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

    function isFaNumber(text) {
        return /^[۰-۹0-9]+$/.test(String(text || '').trim());
    }

    function optionIcon(label) {
        const text = String(label || '').trim();
        if (!text) return '';
        if (isFaNumber(text)) return SvgArt.numberTile(text, wordColor(text), 58);
        if (text.length === 1) return SvgArt.letterTile(text, wordColor(text), 58);
        return imgForWord(text);
    }

    function enrichRound(round) {
        if (!round || typeof round !== 'object') return round;

        // 1) Every option gets a visual identity:
        //    - single letters & numbers become colorful tile buttons (the button IS the icon);
        //    - words with REAL drawn artwork get that picture;
        //    - everything else stays clean text. Previously every option was forced
        //      through a "word tile" (a coloured rectangle with the word written in
        //      it), which pretended to be an illustration and produced nonsense like
        //      a picture-tile for the phrase «داد زدن در خانه».
        (round.options || []).forEach(opt => {
            if (!opt.img && opt.label) {
                const text = String(opt.label).trim();
                if (text.length === 1 || isFaNumber(text)) {
                    opt.tile = true;
                    opt.big = true;
                    opt.tileColor = wordColor(text);
                } else if (hasRealArt(text)) {
                    opt.img = optionIcon(text);
                }
            }
        });

        // 2) Every quiz round gets a non-empty center stage.
        if (round.type === 'quiz' && !round.img) {
            round.img = visualForQuiz(round);
        }
        return round;
    }

    function visualForQuiz(round) {
        const prompt = String(round.prompt || '');
        const opts = round.options || [];
        const answerOpt = opts[round.answer];

        // Listening questions (letter sound / rhyme) get a neutral sound banner.
        if (/صدای|هم‌قافیه|هم‌آهنگ|بشنو|بگو/i.test(prompt)) {
            return SvgArt.soundVisual(110);
        }

        // «عدد بعدی» -> number card + arrow + question tile.
        if (/عدد بعدی|بعدی کدام/i.test(prompt)) {
            const faNums = prompt.match(/[۰-۹0-9]+/g) || [];
            const nums = faNums.map(s => Number(s.replace(/[۰-۹]/g, d => String(FA_DIGITS.indexOf(d)))));
            const a = nums.find(Number.isFinite);
            if (Number.isFinite(a)) {
                return `<div class="round-visual-flex">${SvgArt.numberCard(a, '#4ECDC4', 106)}<span style="font-size:30px;font-weight:900;color:#6C5CE7;user-select:none;">←</span>${SvgArt.questionTile('#A4B0BE', 88)}</div>`;
            }
        }

        // «بزرگ‌تر / کوچک‌تر» -> the two number cards side by side.
        if (/بزرگ‌تر|کوچک‌تر/i.test(prompt)) {
            const cards = opts.map(o => o.img || optionIcon(o.label));
            return `<div class="round-visual-flex">${cards.join('')}</div>`;
        }

        // Patterns -> three option tiles + question tile.
        if (/الگو|علامت سوال/i.test(prompt)) {
            const icons = opts.slice(0, 3).map(o => o.img || optionIcon(o.label));
            return `<div class="round-visual-flex">${icons.join('')}${SvgArt.questionTile('#A4B0BE', 62)}</div>`;
        }

        // Sense organs -> the organ itself.
        if (/حس|عضو/i.test(prompt)) {
            const organ = answerOpt && answerOpt.label;
            const key = OBJECT_IMG[organ];
            if (key) return SvgArt.object(key, 128);
        }

        // Good behavior -> warm heart.
        if (/رفتار|پسندیده|مفید/i.test(prompt)) {
            return SvgArt.shape('heart', '#FF6B6B', 128);
        }

        // Antonyms -> prompt word tile + question tile (no answer reveal).
        if (/متضاد|مخالف/i.test(prompt)) {
            const quoted = prompt.match(/«([^»]+)»/);
            if (quoted && quoted[1]) {
                return `<div class="round-visual-flex">${SvgArt.wordTile(quoted[1], wordColor(quoted[1]), 90)}${SvgArt.questionTile('#A4B0BE', 90)}</div>`;
            }
        }

        // Colors -> decorative palette (never reveals the target color).
        if (/رنگ/i.test(prompt)) {
            // 34px dots were far too small for the centre of a 630px-tall stage.
            const swatches = ['#FF6B6B', '#4ECDC4', '#F9CA24', '#A29BFE', '#FF8A5C', '#2ED573']
                .map(c => `<span style="display:inline-block;width:72px;height:72px;border-radius:50%;background:${c};border:4px solid #FFF;box-shadow:0 3px 0 rgba(0,0,0,.14);"></span>`).join('');
            return `<div class="round-visual-flex"><span style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;max-width:300px;">${swatches}</span></div>`;
        }

        // NEVER show the answer image on the stage. This used to render the correct
        // option in the centre of the screen for "کدام تصویر با حرف ... شروع می‌شود؟",
        // which answered the question for the child (114 rounds were self-answering).
        // For letter questions the honest visual is the LETTER being asked about.
        const letterQ = prompt.match(/حرف «([^»]+)»/);
        if (letterQ && letterQ[1]) {
            return SvgArt.letterTile(letterQ[1], wordColor(letterQ[1]), 150);
        }

        // Blending: «حروف «ما - شین» کدام کلمه را می‌سازند؟» -> show the syllables.
        const blendQ = prompt.match(/حروف «([^»]+)»/);
        if (blendQ && blendQ[1]) {
            const parts = blendQ[1].split(/\s*-\s*/).filter(Boolean).slice(0, 4);
            if (parts.length) {
                const tiles = parts.map(t => SvgArt.wordTile(t, wordColor(t), 74)).join('');
                return `<div class="round-visual-flex">${tiles}${SvgArt.questionTile('#A4B0BE', 74)}</div>`;
            }
        }

        // Riddle / definition rounds («… — این نشانه کدام است؟») -> a thinking mascot
        // plus a question tile. Honest: it signals "guess", it does not fake an answer.
        if (/این نشانه کدام|چیست|کدام است/i.test(prompt)) {
            return `<div class="round-visual-flex">${window.Mascot ? Mascot.svg(104, 'thinking') : ''}${SvgArt.questionTile('#A4B0BE', 88)}</div>`;
        }

        // Shape questions -> the named shape.
        const shapeQ = prompt.match(/شکل «([^»]+)»/);
        if (shapeQ && shapeQ[1] && SHAPE_IMG[shapeQ[1]]) {
            return SvgArt.shape(SHAPE_IMG[shapeQ[1]][0], SHAPE_IMG[shapeQ[1]][1], 150);
        }

        // Counting / number questions -> keep the numeric focus.
        if (/چند|تعداد|بشمار/i.test(prompt)) {
            return `<div class="round-visual-flex">${SvgArt.questionTile('#A4B0BE', 110)}</div>`;
        }

        // Final fallback: a neutral "think about it" tile. A big gold STAR used to sit
        // here on 223 rounds (25% of all quizzes) with no relation to the question,
        // which is exactly the meaningless decoration reported.
        return `<div class="round-visual-flex">${window.Mascot ? Mascot.svg(110, 'thinking') : SvgArt.questionTile('#A4B0BE', 110)}</div>`;
    }

    // Progressive expansion pack: every new lesson gets a different round mix.
    // This prevents the Android app from feeling like the same 5-question loop repeated forever.
    function progressiveExtraPlan(lessonId, metadata) {
        if (!metadata || !metadata.extraTier) return null;
        const v = Math.max(1, Number(metadata.variation || 1));
        const hard = Number(metadata.extraTier) >= 5;
        const pickVar = v % 8;
        const tagExtra = rounds => rounds.map(round => ({ ...round, lessonId: metadata.id || lessonId, skillType: metadata.type, difficulty: metadata.difficulty || (hard ? 5 : 4) }));
        if (lessonId.startsWith('R-L9') || lessonId.startsWith('R-L10') || lessonId.startsWith('R-L11') || lessonId.startsWith('R-L12')) {
            const sets = [
                [sentenceRound(), wordMeaningRound(), storyOrderRound(), oppositeRound(), sightWordRound()],
                [sightWordRound(), sentenceRound(), rhymeRound(), wordMeaningRound(), storyOrderRound()],
                [syllableRound(), sentenceRound(), oppositeRound(), wordMeaningRound(), balloonRound()],
                [storyOrderRound(), sentenceRound(), sightWordRound(), rhymeRound(), wordMeaningRound()],
                [wordMeaningRound(), oppositeRound(), sentenceRound(), storyOrderRound(), syllableRound()],
                [rhymeRound(), sightWordRound(), sentenceRound(), oppositeRound(), storyOrderRound()],
                [sentenceRound(), sentenceRound(), wordMeaningRound(), sightWordRound(), storyOrderRound()],
                [storyOrderRound(), wordMeaningRound(), oppositeRound(), sentenceRound(), balloonRound()]
            ];
            return tagExtra(sets[pickVar]);
        }
        if (lessonId.startsWith('M-L10') || lessonId.startsWith('M-L11') || lessonId.startsWith('M-L12') || lessonId.startsWith('M-L13')) {
            const max = hard ? 20 : 15;
            const sets = [
                [arithRound('+',max), arithRound('-',max), compareRound(max), balanceRound(), numberOrderRound(max)],
                [arithRound('both',max), patternRound(), compareRound(max), countRound(max), balanceRound()],
                [patternRound(), ravenRound(), arithRound('+',max), arithRound('-',max), compareRound(max)],
                [countRound(max), numberOrderRound(max), arithRound('both',max), balanceRound(), patternRound()],
                [compareRound(max), arithRound('+',max), patternRound(), arithRound('-',max), ravenRound()],
                [balanceRound(), countRound(max), arithRound('both',max), numberOrderRound(max), patternRound()],
                [arithRound('+',max), arithRound('both',max), ravenRound(), compareRound(max), balanceRound()],
                [patternRound(), arithRound('-',max), countRound(max), ravenRound(), numberOrderRound(max)]
            ];
            return tagExtra(sets[pickVar]);
        }
        if (lessonId.startsWith('L-L8') || lessonId.startsWith('L-L9') || lessonId.startsWith('L-L10')) {
            const mem = hard ? 6 : 4;
            const sets = [
                [memoryRound(mem), disappearedRound(), ravenRound(), shadowRound(), classifyRound()],
                [simonRound(mem-1), memoryRound(mem), classifyRound(), storyOrderRound(), ravenRound()],
                [shadowRound(), ravenRound(), disappearedRound(), memoryRound(mem), simonRound(mem-1)],
                [classifyRound(), storyOrderRound(), ravenRound(), shadowRound(), memoryRound(mem)],
                [ravenRound(), simonRound(mem-1), shadowRound(), classifyRound(), disappearedRound()],
                [memoryRound(mem), classifyRound(), ravenRound(), storyOrderRound(), shadowRound()],
                [disappearedRound(), memoryRound(mem), simonRound(mem-1), ravenRound(), classifyRound()],
                [storyOrderRound(), shadowRound(), memoryRound(mem), ravenRound(), simonRound(mem-1)]
            ];
            return tagExtra(sets[pickVar]);
        }
        if (lessonId.startsWith('S-L8') || lessonId.startsWith('S-L9') || lessonId.startsWith('S-L10')) {
            const sets = [
                [animalHabitatRound(), animalSoundRound(), habitRound(), seasonRound(), plantGrowthRound()],
                [seasonRound(), animalHabitatRound(), bodyPartRound(), senseRound(), habitRound()],
                [plantGrowthRound(), habitRound(), animalHabitatRound(), seasonRound(), senseRound()],
                [animalSoundRound(), bodyPartRound(), seasonRound(), habitRound(), animalHabitatRound()],
                [senseRound(), plantGrowthRound(), animalSoundRound(), habitRound(), seasonRound()],
                [habitRound(), animalHabitatRound(), plantGrowthRound(), bodyPartRound(), seasonRound()],
                [seasonRound(), senseRound(), animalHabitatRound(), animalSoundRound(), habitRound()],
                [bodyPartRound(), plantGrowthRound(), habitRound(), seasonRound(), animalHabitatRound()]
            ];
            return tagExtra(sets[pickVar]);
        }
        if (lessonId.startsWith('SE-L7') || lessonId.startsWith('SE-L8') || lessonId.startsWith('SE-L9')) {
            const sets = [
                [emotionRound(), habitRound(), familyRound(), habitRound(), emotionRound()],
                [habitRound(), emotionRound(), habitRound(), familyRound(), emotionRound()],
                [familyRound(), habitRound(), emotionRound(), habitRound(), familyRound()],
                [emotionRound(), emotionRound(), habitRound(), familyRound(), habitRound()],
                [habitRound(), familyRound(), habitRound(), emotionRound(), emotionRound()],
                [familyRound(), emotionRound(), habitRound(), habitRound(), familyRound()],
                [emotionRound(), habitRound(), emotionRound(), familyRound(), habitRound()],
                [habitRound(), emotionRound(), familyRound(), emotionRound(), habitRound()]
            ];
            return tagExtra(sets[pickVar]);
        }
        if (lessonId.startsWith('A-L6') || lessonId.startsWith('A-L7') || lessonId.startsWith('A-L8')) {
            const sets = [
                [paintingRound(), shadowRound(), balloonRound(), paintingRound(), shadowRound()],
                [balloonRound(), paintingRound(), shadowRound(), paintingRound(), balloonRound()],
                [shadowRound(), paintingRound(), paintingRound(), balloonRound(), shadowRound()],
                [paintingRound(), balloonRound(), shadowRound(), balloonRound(), paintingRound()],
                [shadowRound(), balloonRound(), paintingRound(), shadowRound(), paintingRound()],
                [paintingRound(), paintingRound(), balloonRound(), shadowRound(), balloonRound()],
                [balloonRound(), shadowRound(), paintingRound(), paintingRound(), shadowRound()],
                [paintingRound(), shadowRound(), balloonRound(), shadowRound(), paintingRound()]
            ];
            return tagExtra(sets[pickVar]);
        }
        return null;
    }

    function adaptGeneric(rounds, metadata) {
        if (!Array.isArray(rounds) || !rounds.length) return rounds;
        // Already adapted by an authored package? leave it alone.
        if (rounds[0] && rounds[0].ageTrack) return rounds;
        return rounds.map(round => adaptRoundForAge(round, metadata, { ageTracks: GENERIC_AGE_TRACKS }));
    }

    function buildRounds(lessonId, metadata) {
        // The lesson's own TITLE outranks the numeric variation sets. The
        // progressive tiers (difficulty 9-12, 121 of 292 lessons) chose their
        // rounds purely by `variation % 8`, so all 15 art lessons shared one
        // painting/shadow/balloon rotation and «رنگ گرم و سرد» never taught
        // colour, while every SE lesson from «گوش دادن فعال» to «تقسیم عادلانه»
        // ran the same emotion/habit/family loop.
        // An authored package is hand-written for that lesson, so it outranks
        // keyword guessing; only unpackaged lessons fall to the title router.
        if (!(window.LESSON_PACKAGES && window.LESSON_PACKAGES[lessonId])) {
            const lvl = lessonLevel(lessonId, metadata);
            const titled = titlePlan(metadata, lvl);
            if (titled) {
                const built = plan(titled, { ...metadata, difficulty: lvl });
                if (built && built.length) return adaptGeneric(built, metadata);
            }
        }
        const progressivePlan = progressiveExtraPlan(lessonId, metadata);
        if (progressivePlan && progressivePlan.length) return adaptGeneric(progressivePlan, metadata);
        const metadataPlan = lessonPlan(lessonId, metadata);
        if (metadataPlan && metadataPlan.length) return adaptGeneric(metadataPlan, metadata);

        // READING
        if (lessonId.startsWith('R-L1')) {
            const l1 = pick(ALPHABET);
            const l2 = pick(ALPHABET.filter(x => x.letter !== l1.letter));
            return [
                letterSoundRound(l1),
                letterExampleRound(l1),
                tracingRound(l1.letter, 'letter'),
                letterSoundRound(l2),
                letterExampleRound(l2)
            ];
        }

        if (lessonId.startsWith('R-L2')) {
            return [firstSoundRound(), rhymeRound(), syllableRound(), firstSoundRound(), rhymeRound()];
        }

        if (lessonId.startsWith('R-L3')) {
            return [blendRound(), blendRound(), memoryRound(3), sightWordRound(), blendRound()];
        }

        if (lessonId.startsWith('R-L4')) {
            return [sightWordRound(), oppositeRound(), wordMeaningRound(), sentenceRound(), sightWordRound()];
        }

        if (lessonId.startsWith('R-L5')) {
            const sampleLetters = ['ب', 'ت', 'س', 'م', 'د', 'ر', 'ک', 'گ', 'ن', 'ل'];
            return [
                tracingRound(pick(sampleLetters), 'letter'),
                tracingRound(pick(sampleLetters), 'letter'),
                sentenceRound(),
                wordMeaningRound(),
                oppositeRound()
            ];
        }

        if (lessonId.startsWith('R-L6') || lessonId.startsWith('R-L7')) {
            return [sentenceRound(), storyOrderRound(), wordMeaningRound(), oppositeRound(), balloonRound()];
        }

        // MATH
        if (lessonId.startsWith('M-L1')) {
            return [countRound(5), numberNameRound(5), tracingRound(toFaDigit(rint(1, 5)), 'number'), countRound(5), numberOrderRound(5)];
        }

        if (lessonId.startsWith('M-L2')) {
            return [countRound(10), numberNameRound(10), compareRound(10), numberOrderRound(10), balanceRound()];
        }

        if (lessonId.startsWith('M-L3')) {
            return [shapeNameRound(), shapeMatchRound(), shadowRound(), shapeNameRound(), shapeMatchRound()];
        }

        if (lessonId.startsWith('M-L4')) {
            return [arithRound('+', 5), arithRound('+', 5), balanceRound(), arithRound('+', 5), arithRound('+', 5)];
        }

        if (lessonId.startsWith('M-L5')) {
            return [arithRound('-', 5), arithRound('-', 5), arithRound('-', 10), balanceRound(), arithRound('-', 10)];
        }

        if (lessonId.startsWith('M-L6')) {
            return [patternRound(), ravenRound(), patternRound(), ravenRound(), patternRound()];
        }

        if (lessonId.startsWith('M-L7') || lessonId.startsWith('M-L8')) {
            return [arithRound('both', 10), compareRound(20), balanceRound(), arithRound('+', 10), countRound(20)];
        }

        // LOGIC
        if (lessonId.startsWith('L-L1')) {
            return [memoryRound(3), classifyRound(), disappearedRound(), classifyRound(), memoryRound(4)];
        }

        if (lessonId.startsWith('L-L2')) {
            return [oddOneOutRound('animals'), shadowRound(), oddOneOutRound('shapes'), shadowRound(), oddOneOutRound('animals')];
        }

        if (lessonId.startsWith('L-L3')) {
            return [simonRound(3), memoryRound(4), simonRound(4), memoryRound(4), disappearedRound()];
        }

        if (lessonId.startsWith('L-L4') || lessonId.startsWith('L-L5') || lessonId.startsWith('L-L6')) {
            return [ravenRound(), shadowRound(), storyOrderRound(), balanceRound(), ravenRound()];
        }

        // SCIENCE
        if (lessonId.startsWith('S-L1')) {
            return [animalSoundRound(), animalSoundRound(), animalHabitatRound(), animalSoundRound(), animalHabitatRound()];
        }

        if (lessonId.startsWith('S-L2')) {
            return [bodyPartRound(), senseRound(), bodyPartRound(), senseRound(), bodyPartRound()];
        }

        if (lessonId.startsWith('S-L3') || lessonId.startsWith('S-L4')) {
            return [plantGrowthRound(), seasonRound(), seasonRound(), seasonRound(), plantGrowthRound()];
        }

        if (lessonId.startsWith('S-L5') || lessonId.startsWith('S-L6')) {
            return [animalHabitatRound(), habitRound(), seasonRound(), animalSoundRound(), habitRound()];
        }

        // SOCIO-EMOTIONAL
        if (lessonId.startsWith('SE-L1')) {
            return [emotionRound(), emotionRound(), emotionRound(), emotionRound(), emotionRound()];
        }

        if (lessonId.startsWith('SE-L2') || lessonId.startsWith('SE-L3')) {
            return [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()];
        }

        if (lessonId.startsWith('SE-L4') || lessonId.startsWith('SE-L5')) {
            return [familyRound(), emotionRound(), habitRound(), familyRound(), habitRound()];
        }

        // ART
        if (lessonId.startsWith('A-L')) {
            return [balloonRound(), paintingRound(), shadowRound(), paintingRound(), balloonRound()];
        }

        // General Fallback
        return [countRound(5), shapeNameRound(), ravenRound(), shadowRound(), balloonRound()];
    }

    function generate(lessonId, metadata) {
        const rounds = buildRounds(lessonId, metadata);
        const list = (Array.isArray(rounds) ? rounds : []).map(enrichRound);
        // Give the opening round a spoken topic intro when one exists and the
        // round does not already carry its own narration.
        //
        // The guard used to be `!list[0].audioClip`, which only protected rounds
        // that had a letter clip. Rounds whose *spoken line* has a recording were
        // still overwritten, so 114 rounds announced the subject ("بیا با کلمه‌ها
        // بازی کنیم") instead of the instruction the child needed to act on
        // ("کارت‌ها را برگردان..."). The instruction always wins; the intro is
        // only used when the opening round would otherwise be silent.
        const topic = topicClipFor(metadata);
        if (topic && list.length && !list[0].audioClip) {
            const opening = list[0];
            const spoken = String(opening.speech || opening.prompt || '').trim();
            const hasOwnVoice = !!(spoken && window.NARRATION_MAP && window.NARRATION_MAP[spoken]);
            if (!hasOwnVoice) {
                opening.audioClip = topic;
                opening.audioAutoPlay = true;
            }
        }

        // Gifted lessons carry a purpose-written line of their own. It must not
        // replace the round's instruction (that rule stands), so it is exposed
        // separately as `lessonIntro`: main.js plays it once when the lesson
        // opens, and the instruction follows. Without this the 50 recorded
        // gifted lines were never reachable, because every opening round
        // already has its own narration and always won the check above.
        const own = giftedLessonClip(metadata);
        if (own && list.length) list[0].lessonIntro = own;

        return list;
    }

    return { generate };
})();

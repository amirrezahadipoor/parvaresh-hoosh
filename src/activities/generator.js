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
            SvgArt.shape(baseShape, colors[0], 70),
            SvgArt.shape(baseShape, colors[1], 70),
            SvgArt.shape(secondShape, colors[0], 70)
        ];

        const correctImg = SvgArt.shape(secondShape, colors[1], 70);
        const distractors = [
            SvgArt.shape(secondShape, colors[2], 70),
            SvgArt.shape(baseShape, colors[1], 70),
            SvgArt.shape(secondShape, colors[0], 70)
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

        const originalImg = isAnimal ? SvgArt.animal(targetKey, 95) : SvgArt.object(targetKey, 95);
        const correctShadow = originalImg;

        const otherKeys = shuffle(pool.filter(k => k !== targetKey)).slice(0, 2);
        const distractorShadows = otherKeys.map(k => {
            return ['cat', 'dog', 'rabbit', 'lion', 'elephant'].includes(k) ? SvgArt.animal(k, 95) : SvgArt.object(k, 95);
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
    function letterSoundRound(letterObj) {
        const correct = letterObj.letter;
        const others = shuffle(ALPHABET.filter(l => l.letter !== correct)).slice(0, 3);
        const opts = shuffle([correct, ...others.map(l => l.letter)]);
        return mc(
            `کدام حرف صدای «${letterObj.name}» است؟`,
            null,
            opts.map(l => ({ label: l, big: true })),
            opts.indexOf(correct),
            `صدای حرف ${letterObj.name}`
        );
    }

    function letterExampleRound(letterObj) {
        const words = (FIRST_SOUND_WORDS[letterObj.letter] || [letterObj.example]);
        const correctWord = words[0];
        const correctImg = imgForWord(correctWord);
        const others = pickOtherWords(letterObj.letter, 3);
        const opts = shuffle([
            { label: correctWord, img: correctImg },
            ...others.map(w => ({ label: w, img: imgForWord(w) }))
        ]);
        return mc(
            `کدام تصویر با حرف «${letterObj.letter}» شروع می‌شود؟`,
            null,
            opts,
            opts.findIndex(o => o.label === correctWord),
            `کدام کلمه با حرف ${letterObj.letter} شروع می‌شود؟`
        );
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
        const w = pick(FREQUENT_WORDS);
        const others = shuffle(FREQUENT_WORDS.filter(x => x !== w)).slice(0, 3);
        const opts = shuffle([w, ...others]);
        return mc(
            `این تصویر مربوط به کدام کلمه است؟`,
            imgForWord(w),
            opts.map(x => ({ label: x })),
            opts.indexOf(w),
            `تصویر ${w} را پیدا کن`
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
        return mc(
            `«${item.meaning}» — این نشانه کدام است؟`,
            imgForWord(item.word),
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
    function countRound(max) {
        const n = rint(1, max);
        const img = countImage(n);
        const faDigit = toFaDigit(n);
        const others = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].filter(x => x !== n && x <= max + 2)).slice(0, 3);
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
        const others = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].filter(x => x !== n)).slice(0, 3);
        const opts = shuffle([n, ...others]);
        return mc(
            `عدد «${toFaWord(n)}» کدام است؟`,
            SvgArt.numberCard(n, '#4ECDC4'),
            opts.map(x => ({ label: toFaDigit(x), big: true })),
            opts.indexOf(n),
            `عدد ${toFaWord(n)} را انتخاب کن`
        );
    }

    function numberOrderRound(max) {
        const a = rint(1, max - 1);
        const missing = a + 1;
        const others = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => x !== missing)).slice(0, 3);
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
        const a = rint(1, max - 2);
        const b = a + rint(1, 4);
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
        const others = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].filter(x => x !== answer)).slice(0, 3);
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
            SvgArt.shape(s.id, s.color, 110),
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            `این شکل چیست؟ ${correct}`
        );
    }

    function shapeMatchRound() {
        const s = pick(SHAPES);
        const others = shuffle(SHAPES.filter(x => x.id !== s.id)).slice(0, 3);
        const opts = shuffle([s, ...others]);
        return mc(
            `شکل «${s.fa}» را پیدا کن:`,
            null,
            opts.map(x => ({ img: SvgArt.shape(x.id, x.color, 75), label: '' })),
            opts.indexOf(s),
            `شکل ${s.fa} را انتخاب کن`
        );
    }

    function patternRound() {
        const p = pick(PATTERNS);
        if (p.type === 'color') {
            const correctColor = PATTERN_COLORS[p.answer];
            const others = shuffle(PATTERN_COLORS.filter(c => c !== correctColor)).slice(0, 2);
            const options = shuffle([correctColor, ...others]);
            return mc(
                'کدام رنگ جای علامت سوال در الگو قرار می‌گیرد؟',
                null,
                options.map(c => ({ img: SvgArt.shape('circle', c, 65), label: '' })),
                options.indexOf(correctColor),
                'رنگ بعدی در الگو کدام است؟'
            );
        } else {
            const correctShape = p.answer;
            const others = shuffle(SHAPES.map(s => s.id).filter(x => x !== correctShape)).slice(0, 2);
            const options = shuffle([correctShape, ...others]);
            return mc(
                'کدام شکل جای علامت سوال در الگو قرار می‌گیرد؟',
                null,
                options.map(sid => ({ img: SvgArt.shape(sid, '#6C5CE7', 65), label: '' })),
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
            const opts = all.map(a => ({ img: SvgArt.animal(a, 75), label: names[a] || a, id: a }));

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
            const opts = all.map(sid => ({ img: SvgArt.shape(sid, '#A29BFE', 75), label: '', id: sid }));

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
            { label: '۱. کاشت دانه', img: SvgArt.object('apple', 65), idx: 0 },
            { label: '۲. رشد جوانه', img: SvgArt.object('tree', 65), idx: 1 },
            { label: '۳. رویش گل و برگ', img: SvgArt.object('flower', 65), idx: 2 }
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
            { label: '۱. بیدار شدن از خواب', img: SvgArt.object('sun', 65), idx: 0 },
            { label: '۲. شستن دست و صورت', img: SvgArt.object('tooth', 65), idx: 1 },
            { label: '۳. خوردن صبحانه مقوی', img: SvgArt.object('apple', 65), idx: 2 },
            { label: '۴. رفتن به مدرسه و بازی', img: SvgArt.object('car', 65), idx: 3 }
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
            { id: 'گربه', label: 'گربه', img: SvgArt.animal('cat', 70), target: 'animals' },
            { id: 'خرگوش', label: 'خرگوش', img: SvgArt.animal('rabbit', 70), target: 'animals' },
            { id: 'سیب', label: 'سیب', img: SvgArt.object('apple', 70), target: 'fruits' },
            { id: 'موز', label: 'موز', img: SvgArt.object('banana', 70), target: 'fruits' }
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
            SvgArt.animal(a.key, 100),
            opts.map(x => ({ label: x })),
            opts.indexOf(a.fa),
            `صدای ${a.sound} صدای کیست؟ ${a.fa}`
        );
    }

    function animalHabitatRound() {
        const a = pick(ANIMALS.filter(x => x.habitat));
        const correct = a.habitat;
        const others = shuffle(['خانه', 'مزرعه', 'دریا و رودخانه', 'جنگل', 'قطب برفی'].filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct, ...others]);
        return mc(
            `«${a.fa}» بیشتر در کجا زندگی می‌کند؟`,
            SvgArt.animal(a.key, 100),
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
            SvgArt.object(b.icon || 'eye', 95),
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
            SvgArt.object(s.fa === 'زمستان' ? 'rain' : s.fa === 'بهار' ? 'flower' : s.fa === 'تابستان' ? 'sun' : 'tree', 95),
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
        return mc(
            `«${e.situation}» چه حسی داریم؟`,
            Mascot.svg(95, e.icon || 'happy'),
            opts.map(x => ({ label: x })),
            opts.indexOf(e.fa),
            e.situation
        );
    }

    function habitRound() {
        const good = pick(GOOD_HABITS);
        const badPool = ['داد زدن در خانه', 'نخوردن صبحانه', 'به وسایل خطرناک دست زدن', 'ریختن زباله روی زمین'];
        const others = shuffle(badPool).slice(0, 2);
        const opts = shuffle([good.fa, ...others]);
        return mc(
            'کدام رفتار پسندیده و مفید است؟',
            null,
            opts.map(x => ({ label: x })),
            opts.indexOf(good.fa),
            'کدام رفتار خوب و درست است؟'
        );
    }

    function familyRound() {
        const f = pick(FAMILY);
        const others = shuffle(FAMILY.map(x => x.fa).filter(x => x !== f.fa)).slice(0, 3);
        const opts = shuffle([f.fa, ...others]);
        return mc(
            `«${f.role}» — او در خانواده کیست؟`,
            SvgArt.object('house', 95),
            opts.map(x => ({ label: x })),
            opts.indexOf(f.fa),
            f.role
        );
    }

    // ==========================================
    // 11. MEMORY, TRACING, BALLOON & ART
    // ==========================================
    function memoryRound(pairCount) {
        const pool = [
            { img: SvgArt.animal('cat', 65), label: 'گربه' },
            { img: SvgArt.animal('rabbit', 65), label: 'خرگوش' },
            { img: SvgArt.animal('lion', 65), label: 'شیر' },
            { img: SvgArt.animal('fish', 65), label: 'ماهی' },
            { img: SvgArt.object('apple', 65), label: 'سیب' },
            { img: SvgArt.object('banana', 65), label: 'موز' },
            { img: SvgArt.object('sun', 65), label: 'خورشید' },
            { img: SvgArt.object('star', 65), label: 'ستاره' },
            { img: SvgArt.object('flower', 65), label: 'گل' },
            { img: SvgArt.object('car', 65), label: 'ماشین' }
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
        return {
            type: 'tracing',
            char: String(char),
            kind: kind || 'letter',
            speech: `با انگشت روی ${kind === 'number' ? 'عدد' : 'حرف'} ${char} بکش`
        };
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
        return {
            type: 'balloon-pop',
            prompt: 'بادکنک‌ها را بترکان و صداهایشان را بشنو!',
            items: shuffle(pool).slice(0, 5),
            speech: 'بادکنک‌ها را لمس کن تا بترکند!'
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
    function imgForWord(word) {
        const animalMap = {
            'اسب': 'horse', 'گربه': 'cat', 'سگ': 'dog', 'خرگوش': 'rabbit',
            'فیل': 'elephant', 'شیر': 'lion', 'خرس': 'bear', 'میمون': 'monkey',
            'ماهی': 'fish', 'لاک‌پشت': 'turtle', 'پروانه': 'butterfly', 'زنبور': 'bee',
            'جوجه': 'chick', 'مرغ': 'chicken', 'خروس': 'rooster', 'اردک': 'duck',
            'قورباغه': 'frog', 'گوسفند': 'sheep', 'گاو': 'cow'
        };
        const objectMap = {
            'سیب': 'apple', 'موز': 'banana', 'پرتقال': 'orange', 'هندوانه': 'watermelon',
            'توپ': 'ball', 'بادکنک': 'balloon', 'خورشید': 'sun', 'ماه': 'moon',
            'ستاره': 'star', 'گل': 'flower', 'درخت': 'tree', 'باران': 'rain',
            'ابر': 'rain', 'ماشین': 'car', 'کتاب': 'book', 'خانه': 'house',
            'چشم': 'eye', 'گوش': 'ear', 'بینی': 'nose', 'دست': 'hand',
            'دندان': 'tooth', 'ساعت': 'clock', 'هدیه': 'gift', 'کیک': 'cake'
        };

        if (animalMap[word]) return SvgArt.animal(animalMap[word], 85);
        if (objectMap[word]) return SvgArt.object(objectMap[word], 85);
        return SvgArt.object('book', 85);
    }

    function pickOtherWords(excludeLetter, count, excludeList) {
        excludeList = excludeList || [];
        const pool = [];
        Object.keys(FIRST_SOUND_WORDS).forEach(k => {
            if (k !== excludeLetter) pool.push(...FIRST_SOUND_WORDS[k]);
        });
        return shuffle(pool.filter(w => !excludeList.includes(w))).slice(0, count);
    }

    function countImage(n) {
        const obj = pick(['apple', 'ball', 'star', 'flower', 'balloon']);
        let svgs = '';
        for (let i = 0; i < n; i++) {
            svgs += SvgArt.object(obj, 52);
        }
        return `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:320px;margin:0 auto">${svgs}</div>`;
    }

    function arithImage(sign, a, b) {
        const obj = pick(['apple', 'ball', 'star']);
        let left = '', right = '';
        for (let i = 0; i < a; i++) left += SvgArt.object(obj, 42);
        for (let i = 0; i < b; i++) right += SvgArt.object(obj, 42);

        return `
            <div style="display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;">
                <div style="display:flex;flex-wrap:wrap;gap:4px;max-width:140px;justify-content:center;">${left}</div>
                <span style="font-size:36px;font-weight:900;color:#6C5CE7;">${sign}</span>
                <div style="display:flex;flex-wrap:wrap;gap:4px;max-width:140px;justify-content:center;">${right}</div>
            </div>
        `;
    }

    // ==========================================
    // DYNAMIC LESSON RESOLVER
    // ==========================================
    function generate(lessonId) {
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

    return { generate };
})();

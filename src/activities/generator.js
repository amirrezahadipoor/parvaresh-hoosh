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
            { label: '۲. شستن دست و صورت', img: SvgArt.object('soap', 65), idx: 1 },
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
    const OBJECT_IMG = {
        'سیب': 'apple', 'موز': 'banana', 'پرتقال': 'orange', 'هندوانه': 'watermelon',
        'توپ': 'ball', 'بادکنک': 'balloon', 'خورشید': 'sun', 'ماه': 'moon',
        'ستاره': 'star', 'گل': 'flower', 'درخت': 'tree', 'باران': 'rain',
        'ابر': 'rain', 'ماشین': 'car', 'کتاب': 'book', 'خانه': 'house',
        'چشم': 'eye', 'گوش': 'ear', 'بینی': 'nose', 'دست': 'hand',
        'زبان': 'tongue', 'پا': 'foot', 'دندان': 'tooth', 'مغز': 'brain',
        'ساعت': 'clock', 'هدیه': 'gift', 'کیک': 'cake'
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
        if (ANIMAL_IMG[word]) return SvgArt.animal(ANIMAL_IMG[word], 85);
        if (OBJECT_IMG[word]) return SvgArt.object(OBJECT_IMG[word], 85);
        if (SHAPE_IMG[word]) return SvgArt.shape(SHAPE_IMG[word][0], SHAPE_IMG[word][1], 85);
        if (SEASON_IMG[word]) return SvgArt.object(SEASON_IMG[word], 85);
        // Honest fallback: a colored tile carrying the word itself (never a wrong picture).
        return SvgArt.wordTile(word, wordColor(word), 85);
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

    function plan(factories, metadata) {
        const list = Array.isArray(factories) ? factories.filter(Boolean) : [];
        if (!list.length) return [];
        const rounds = Array.from({ length: 5 }, (_, index) => list[index % list.length]());
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
            options.map(item => ({ img: SvgArt.shape('circle', item.value, 68), label: item.name })),
            options.indexOf(target),
            `رنگ ${target.name} را انتخاب کن`
        );
    }

    function clockRound() {
        const hour = rint(1, 12);
        const options = shuffle([hour, ((hour + 2) % 12) + 1, ((hour + 5) % 12) + 1, ((hour + 8) % 12) + 1]);
        return mc(
            `عقربهٔ ساعت، ساعت ${toFaWord(hour)} را نشان می‌دهد؟`,
            SvgArt.object('clock', 110),
            options.map(value => ({ label: `${toFaDigit(value)}:۰۰`, big: true })),
            options.indexOf(hour),
            `ساعت ${toFaWord(hour)} را پیدا کن`
        );
    }

    function resolveAgeTrack(metadata, pkg) {
        const age = Number(metadata && metadata.childAge);
        if (Number.isFinite(age) && age <= 5) return 'preschool';
        if (Number.isFinite(age) && age >= 7) return 'school';
        return 'early';
    }

    function roleFactory(role, level) {
        const roles = {
            'letter-sound': () => letterSoundRound(pick(ALPHABET)),
            'letter-example': () => letterExampleRound(pick(ALPHABET)),
            trace: () => tracingRound(pick(ALPHABET).letter, 'letter'),
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
            'shape-match': shapeMatchRound,
            'order-size': orderSizeRound,
            pattern: patternRound,
            color: colorRound,
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

    function adaptRoundForAge(round, metadata, pkg) {
        const trackKey = resolveAgeTrack(metadata, pkg);
        const track = (pkg.ageTracks && pkg.ageTracks[trackKey]) || { optionCount: 4, hintDelay: 4500, maxNumber: 20, language: 'ساده' };
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
        const factories = (pkg.roundPlan || []).map(role => roleFactory(role, level));
        const rounds = plan(factories, { ...metadata, difficulty: level });
        return rounds.map(round => adaptRoundForAge(round, metadata, pkg));
    }

    function lessonPlan(lessonId, metadata) {
        const pkg = window.LESSON_PACKAGES && window.LESSON_PACKAGES[lessonId];
        if (pkg) return authoredLessonPlan(lessonId, metadata, pkg);
        const domain = inferDomain(lessonId, metadata);
        const type = metadata && metadata.type || '';
        const level = lessonLevel(lessonId, metadata);
        const countMax = level <= 2 ? 5 : level <= 4 ? 10 : 20;
        const pairCount = Math.min(5, 2 + Math.floor(level / 2));

        if (domain === 'reading') {
            switch (type) {
                case 'recognition':
                    return plan([
                        () => letterSoundRound(pick(ALPHABET)),
                        () => letterExampleRound(pick(ALPHABET)),
                        () => tracingRound(pick(ALPHABET).letter, 'letter')
                    ], metadata);
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
                    return plan([sentenceRound, storyOrderRound, wordMeaningRound], metadata);
                case 'vocabulary':
                case 'sight-words':
                case 'comprehension':
                case 'character-analysis':
                case 'fill-blank':
                case 'matching':
                case 'reading':
                default:
                    return plan([sightWordRound, wordMeaningRound, oppositeRound, sentenceRound], metadata);
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
                    return plan([animalSoundRound, animalHabitatRound, animalSoundRound], metadata);
                case 'body-parts':
                    return plan([bodyPartRound, bodyPartRound, senseRound], metadata);
                case 'senses':
                    return plan([senseRound, bodyPartRound, senseRound], metadata);
                case 'seasons':
                case 'seasons-activity':
                    return plan([seasonRound, seasonRound, plantGrowthRound], metadata);
                case 'plant-growth':
                    return plan([plantGrowthRound, plantGrowthRound, seasonRound], metadata);
                case 'plant-parts':
                case 'flowers':
                    return plan([shapeNameRound, plantGrowthRound, colorRound], metadata);
                case 'health':
                    return plan([habitRound, bodyPartRound, senseRound], metadata);
                case 'conservation':
                case 'water-cycle':
                case 'recycling':
                case 'energy':
                default:
                    return plan([storyOrderRound, habitRound, seasonRound, classifyRound], metadata);
            }
        }

        if (domain === 'socio-emotional') {
            switch (type) {
                case 'emotions':
                case 'emotion-game':
                    return plan([emotionRound, emotionRound, habitRound], metadata);
                case 'family':
                    return plan([familyRound, emotionRound, habitRound], metadata);
                case 'etiquette':
                case 'friendship':
                case 'sharing':
                case 'apologizing':
                case 'patience':
                case 'responsibility':
                case 'conflict-resolution':
                case 'teamwork':
                case 'diversity':
                case 'self-identity':
                default:
                    return plan([habitRound, emotionRound, familyRound], metadata);
            }
        }

        if (domain === 'art') {
            switch (type) {
                case 'colors':
                    return plan([colorRound, colorRound, patternRound], metadata);
                case 'drawing':
                case 'coloring':
                case 'finger-painting':
                case 'illustration':
                case 'free-drawing':
                case 'comic':
                    return plan([paintingRound, paintingRound, colorRound], metadata);
                case 'music':
                    return plan([balloonRound, colorRound, paintingRound], metadata);
                case 'craft':
                case 'sculpture':
                default:
                    return plan([paintingRound, orderSizeRound, colorRound], metadata);
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
        //    - words get an SVG icon (object/animal picture or a word tile).
        (round.options || []).forEach(opt => {
            if (!opt.img && opt.label) {
                const text = String(opt.label).trim();
                if (text.length === 1 || isFaNumber(text)) {
                    opt.tile = true;
                    opt.big = true;
                    opt.tileColor = wordColor(text);
                } else {
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
                return `<div class="round-visual-flex">${SvgArt.numberCard(a, '#4ECDC4', 88)}<span style="font-size:30px;font-weight:900;color:#6C5CE7;user-select:none;">←</span>${SvgArt.questionTile('#A4B0BE', 88)}</div>`;
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
            if (key) return SvgArt.object(key, 110);
        }

        // Good behavior -> warm heart.
        if (/رفتار|پسندیده|مفید/i.test(prompt)) {
            return SvgArt.shape('heart', '#FF6B6B', 110);
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
            const swatches = ['#FF6B6B', '#4ECDC4', '#F9CA24', '#A29BFE', '#FF8A5C', '#2ED573']
                .map(c => `<span style="display:inline-block;width:34px;height:34px;border-radius:50%;background:${c};border:3px solid #FFF;box-shadow:0 2px 0 rgba(0,0,0,.12);"></span>`).join('');
            return `<div class="round-visual-flex"><span style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;max-width:230px;">${swatches}</span></div>`;
        }

        // Image-matching questions (which image starts with…, which word…, builds…)
        // may safely show the answer image as the question content.
        if (answerOpt && answerOpt.img && /شروع می‌شود|می‌سازند|نشانه|کدام کلمه|کدام گزینه|کدام تصویر/i.test(prompt)) {
            return `<div class="round-visual-flex">${answerOpt.img}</div>`;
        }

        // Final fallback: a friendly decorative tile so the stage is never blank.
        return SvgArt.object('star', '#F9CA24', 110);
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

    function buildRounds(lessonId, metadata) {
        const progressivePlan = progressiveExtraPlan(lessonId, metadata);
        if (progressivePlan && progressivePlan.length) return progressivePlan;
        const metadataPlan = lessonPlan(lessonId, metadata);
        if (metadataPlan && metadataPlan.length) return metadataPlan;

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
        return (Array.isArray(rounds) ? rounds : []).map(enrichRound);
    }

    return { generate };
})();

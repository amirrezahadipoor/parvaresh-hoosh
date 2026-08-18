// Activity Generator: produces rounds (questions/activities) for a lesson
// Each round: { type, prompt, img (svg), options:[{label,img}], answer:index|value, ... }
const Generator = (function() {

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function toFa(n) {
        const fa = NUMBERS[n];
        return fa ? fa.fa : String(n);
    }

    // Build multiple-choice round with 3-4 options
    function mc(prompt, img, options, correctIdx, speechText) {
        return { type: 'quiz', prompt, img, options, answer: correctIdx, speech: speechText || prompt };
    }

    function optionsFrom(items, correctItem, extraCount, labelFn) {
        // items: array of candidate values; correctItem is one of them
        const others = shuffle(items.filter(x => JSON.stringify(x) !== JSON.stringify(correctItem)));
        const opts = [correctItem].concat(others.slice(0, extraCount));
        const order = shuffle(opts.map((v, i) => i));
        const shuffled = order.map(i => opts[i]);
        return { options: shuffled.map(labelFn || (v => v)), answerIdx: shuffled.indexOf(correctItem) };
    }

    // ============ READING ============
    function letterSoundRound(letterObj) {
        // Say: "صدای (letter name) چیه؟" pick the letter among options
        const correct = letterObj.letter;
        const others = shuffle(ALPHABET.filter(l => l.letter !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others.map(l => l.letter)));
        return mc('کدوم حرف صدای «' + letterObj.name + '» است؟', null,
            opts.map(l => ({ label: l, big: true })),
            opts.indexOf(correct),
            'صدای حرف ' + letterObj.name);
    }

    function letterExampleRound(letterObj) {
        // Show letter, pick the picture whose word starts with it
        const words = (FIRST_SOUND_WORDS[letterObj.letter] || [letterObj.example]);
        const correctWord = words[0];
        const correctImg = imgForWord(correctWord);
        const others = pickOtherWords(letterObj.letter, 3);
        const opts = shuffle([{ label: correctWord, img: correctImg }].concat(
            others.map(w => ({ label: w, img: imgForWord(w) }))));
        return mc('کدام تصویر با حرف «' + letterObj.letter + '» شروع می‌شود؟', null, opts, opts.indexOf(opts.find(o => o.label === correctWord)),
            'کدام کلمه با حرف ' + letterObj.letter + ' شروع می‌شود؟ ' + correctWord);
    }

    function firstSoundRound() {
        // Pick a letter that has words, show 3 word-images, find which starts with the sound
        const keys = Object.keys(FIRST_SOUND_WORDS);
        const k = pick(keys);
        const correctWord = pick(FIRST_SOUND_WORDS[k]);
        const others = shuffle(FIRST_SOUND_WORDS[pick(keys.filter(x => x !== k))]).slice(0, 2);
        const opts = shuffle([correctWord].concat(others));
        return mc('کدام کلمه با صدای «' + k + '» شروع می‌شود؟', null,
            opts.map(w => ({ label: w, img: imgForWord(w) })),
            opts.indexOf(correctWord),
            'کدام کلمه با صدای ' + k + ' شروع می‌شود؟');
    }

    function rhymeRound() {
        const pair = pick(RHYMES);
        const correct = pair[1];
        const otherWords = shuffle(FREQUENT_WORDS.filter(w => w !== pair[0] && w !== correct)).slice(0, 2);
        const opts = shuffle([correct].concat(otherWords));
        return mc('کدام کلمه با «' + pair[0] + '» هم‌قافیه است؟', null,
            opts.map(w => ({ label: w, img: imgForWord(w) })),
            opts.indexOf(correct),
            'کدام کلمه با ' + pair[0] + ' هم‌قافیه است؟');
    }

    function syllableRound() {
        const w = pick(BLEND_WORDS_2.concat(BLEND_WORDS_3));
        const sylCount = w.syllables.length;
        const options = [
            { label: '۲ بخش' }, { label: '۱ بخش' }, { label: '۳ بخش' }, { label: '۴ بخش' }
        ];
        const correctLabel = sylCount + ' بخش';
        const opts = shuffle(options);
        return mc('«' + w.word + '» چند بخش (هجا) دارد؟', imgForWord(w.word),
            opts, opts.indexOf(opts.find(o => o.label === correctLabel)),
            w.word + ' چند بخش دارد؟');
    }

    function blendRound() {
        const w = pick(BLEND_WORDS_2.concat(BLEND_WORDS_3, BLEND_WORDS_4));
        const letters = shuffle(w.parts.map((p, i) => i));
        // Show the parts, ask to pick the image that matches the built word
        const correctImg = imgForWord(w.word);
        const others = shuffle([w.word].concat(pickOtherWords(null, 3, [w.word])));
        const opts = shuffle(others.map(ww => ({ label: ww, img: imgForWord(ww) })));
        return mc('حروف را کنار هم بگذار: «' + w.parts.join(' ') + '» کدام کلمه می‌شود؟', null,
            opts, opts.indexOf(opts.find(o => o.label === w.word)),
            w.parts.join(' ') + ' چه کلمه‌ای می‌شود؟ ' + w.word);
    }

    function sightWordRound() {
        const w = pick(FREQUENT_WORDS);
        const others = shuffle(FREQUENT_WORDS.filter(x => x !== w)).slice(0, 3);
        const opts = shuffle([w].concat(others));
        return mc('کدام کلمه را می‌بینی؟', imgForWord(w),
            opts.map(x => ({ label: x })),
            opts.indexOf(w),
            'این تصویر چیست؟ ' + w);
    }

    function oppositeRound() {
        const pair = pick(OPPOSITES);
        const correct = pair.b;
        const others = shuffle(OPPOSITES.map(p => p.b).filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct].concat(others));
        return mc('متضاد «' + pair.a + '» کدام است؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            'متضاد کلمه ' + pair.a + ' چیست؟ ' + correct);
    }

    function wordMeaningRound() {
        const item = pick(WORD_MEANINGS);
        const correct = item.word;
        const others = shuffle(WORD_MEANINGS.map(m => m.word).filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct].concat(others));
        return mc(item.meaning + ' — این یعنی کدام کلمه؟', imgForWord(item.word),
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            item.meaning);
    }

    function sentenceRound() {
        const s = pick(SENTENCE_POOL.filter(x => x.words.length >= 3));
        const items = s.words.map((w, i) => ({ label: w, img: imgForWord(w), idx: i }));
        const shuffled = shuffle(items);
        return {
            type: 'order-steps',
            prompt: 'کلمات را مرتب کن تا جمله درست شود:',
            items: shuffled,
            answer: 'idx',
            speech: 'کلمات را مرتب کن'
        };
    }

    // ============ MATH ============
    function countRound(max) {
        const n = rint(1, max);
        const img = countImage(n);
        const faN = toFa(n);
        const others = shuffle([1,2,3,4,5,6,7,8,9,10].filter(x => x !== n && x <= max + 2)).slice(0, 3);
        const opts = shuffle([n].concat(others));
        return mc('چند تا می‌بینی؟', img,
            opts.map(x => ({ label: toFa(x) })),
            opts.indexOf(n),
            'چند تا می‌بینی؟ ' + faN);
    }

    function numberNameRound(max) {
        const n = rint(1, max);
        const others = shuffle([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].filter(x => x !== n)).slice(0, 3);
        const opts = shuffle([n].concat(others));
        return mc('عدد «' + toFa(n) + '» با کدام رقم نوشته می‌شود؟', SvgArt.numberCard(n, '#FF6B6B'),
            opts.map(x => ({ label: String(x) })),
            opts.indexOf(n),
            'عدد ' + toFa(n));
    }

    function numberOrderRound(max) {
        const a = rint(1, max - 1);
        const seq = [a, a + 1];
        const missing = seq[1];
        const others = shuffle([1,2,3,4,5,6,7,8,9,10].filter(x => x !== missing)).slice(0, 3);
        const opts = shuffle([missing].concat(others));
        return mc('عدد بعدی کدام است؟  ' + toFa(a) + '  ←  ؟', null,
            opts.map(x => ({ label: toFa(x) })),
            opts.indexOf(missing),
            'عدد بعد از ' + toFa(a) + ' کدام است؟');
    }

    function compareRound(max) {
        const a = rint(1, max - 1);
        const b = a + rint(1, 3);
        const question = Math.random() < 0.5 ? 'bigger' : 'smaller';
        const correct = question === 'bigger' ? b : a;
        const opts = shuffle([a, b]);
        const qText = question === 'bigger' ? 'کدام عدد بزرگ‌تر است؟' : 'کدام عدد کوچک‌تر است؟';
        return mc(qText, null,
            opts.map(x => ({ label: String(x) })),
            opts.indexOf(correct),
            qText);
    }

    function arithRound(op, max) {
        let a, b, answer;
        if (op === '+') {
            a = rint(1, max); b = rint(1, max - a);
            answer = a + b;
        } else if (op === '-') {
            a = rint(2, max); b = rint(1, a - 1);
            answer = a - b;
        } else {
            if (Math.random() < 0.5) { a = rint(1, max); b = rint(1, max - a); answer = a + b; }
            else { a = rint(2, max); b = rint(1, a - 1); answer = a - b; }
        }
        const sign = op === '+' ? '+' : '-';
        const expr = toFa(a) + ' ' + sign + ' ' + toFa(b) + ' = ؟';
        const img = arithImage(op === '+' ? '+' : '-', a, b);
        const others = shuffle([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].filter(x => x !== answer)).slice(0, 3);
        const opts = shuffle([answer].concat(others));
        return mc(expr, img,
            opts.map(x => ({ label: String(x) })),
            opts.indexOf(answer),
            toFa(a) + ' ' + (op === '+' ? 'به اضافه' : 'منهای') + ' ' + toFa(b) + ' چند می‌شود؟');
    }

    function shapeNameRound() {
        const shape = pick(SHAPES);
        const correct = shape.fa;
        const others = shuffle(SHAPES.map(s => s.fa).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others));
        return mc('این چه شکلی است؟', SvgArt.shape(shape.id, shape.color),
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            'این شکل چیست؟ ' + correct);
    }

    function shapeMatchRound() {
        // Given shape name, pick the right shape among options
        const shape = pick(SHAPES);
        const others = shuffle(SHAPES.filter(s => s.id !== shape.id)).slice(0, 3);
        const opts = shuffle([shape].concat(others));
        return mc('کدام شکل «' + shape.fa + '» است؟', null,
            opts.map(s => ({ img: SvgArt.shape(s.id, s.color), label: '' })),
            opts.indexOf(shape),
            'شکل ' + shape.fa + ' را پیدا کن');
    }

    function patternRound() {
        const p = pick(PATTERNS);
        // build display sequence with one empty slot (null in seq)
        const seq = p.seq;
        const missingIdx = seq.indexOf(null);
        const missingVal = p.answer;
        // options: correct + 2 distractors
        let options;
        if (p.type === 'color') {
            const correctColor = PATTERN_COLORS[missingVal];
            const others = shuffle(PATTERN_COLORS.filter(c => c !== correctColor)).slice(0, 2);
            options = shuffle([correctColor].concat(others));
            const cells = seq.map(v => v === null ? '?' : v).map(v => ({
                color: v === '?' ? '#EEE' : PATTERN_COLORS[v], text: v === '?' ? '؟' : ''
            }));
            return mc('کدام رنگ جای علامت سوال است؟', null,
                options.map(c => ({ img: SvgArt.shape('circle', c), label: '' })),
                options.indexOf(correctColor),
                'رنگ بعدی در الگو کدام است؟');
        } else if (p.type === 'shape') {
            const correctShape = p.answer;
            const others = shuffle(SHAPES.map(s => s.id).filter(x => x !== correctShape)).slice(0, 2);
            options = shuffle([correctShape].concat(others));
            return mc('کدام شکل جای علامت سوال است؟', null,
                options.map(sid => ({ img: SvgArt.shape(sid, '#6C5CE7'), label: '' })),
                options.indexOf(correctShape),
                'شکل بعدی در الگو کدام است؟');
        }
        return countRound(5);
    }

    // ============ LOGIC ============
    function oddOneOutRound(kind) {
        // kind: 'animals' | 'fruits' | 'shapes' | 'colors'
        let group, odd, isOdd = null;
        if (kind === 'animals') {
            group = ['cat','dog','bird','fish','turtle','lion','elephant','monkey','rabbit','fox','chicken','bear'];
            const pets = ['cat','dog'];
            const wilds = ['lion','elephant','monkey','bear','fox','rabbit'];
            const waters = ['fish','turtle'];
            const chose = Math.random() < 0.5 ? pets : wilds;
            group = chose;
            const water = pick(waters);
            const trio = shuffle(group.concat([water]));
            const names = { cat:'گربه', dog:'سگ', bird:'پرنده', fish:'ماهي', turtle:'لاک‌پشت', lion:'شير',
                elephant:'فيل', monkey:'ميمون', rabbit:'خرگوش', fox:'روباه', chicken:'جوجه', bear:'خرس' };
            const opts = shuffle(trio.map(a => ({ img: SvgArt.animal(a), label: names[a] || a })));
            const isWater = (id) => id === 'fish' || id === 'turtle';
            const oddIdx = opts.findIndex(o => isWater(o.label === 'ماهي' || o.label === 'لاک‌پشت' ? (o.img.includes('fish') ? 'fish' : 'turtle') : ''));
            // simpler: find odd by checking img content
            let correctIdx = -1;
            opts.forEach((o, i) => {
                const isWaterItem = o.img.includes('fish') || o.img.includes('turtle');
                const isLandItem = !isWaterItem;
                if ((isWaterItem && group.length === 3 && !group.includes('fish') && !group.includes('turtle')) ||
                    (isLandItem && group.includes('fish'))) { /* nop */ }
            });
            // Determine: 3 land + 1 water -> odd is water
            const landOpts = opts.filter(o => !o.img.includes('fish') && !o.img.includes('turtle'));
            const waterOpts = opts.filter(o => o.img.includes('fish') || o.img.includes('turtle'));
            const oddList = landOpts.length === 3 ? waterOpts : landOpts;
            correctIdx = opts.indexOf(oddList[0]);
            return mc('کدام یکی با بقیه فرق دارد؟', null, opts, correctIdx, 'کدام با بقیه فرق دارد؟');
        }
        if (kind === 'shapes') {
            const shapeIds = ['circle','triangle','square','rectangle','oval','diamond'];
            const base = pick(shapeIds);
            const trio = shuffle([base, base, base].concat([pick(shapeIds.filter(s => s !== base))]));
            const opts = shuffle(trio.map(id => ({ img: SvgArt.shape(id, '#6C5CE7'), label: '' })));
            const correct = opts.find(o => o.img.includes(trio.filter(x => x !== base)[0]) && true);
            // find odd: count each; the one appearing once
            const counts = {};
            trio.forEach(t => counts[t] = (counts[t] || 0) + 1);
            const oddVal = Object.keys(counts).find(k => counts[k] === 1);
            const correctIdx = opts.findIndex(o => o.img.includes(oddVal));
            return mc('کدام شکل با بقیه فرق دارد؟', null, opts, correctIdx, 'کدام شکل فرق دارد؟');
        }
        return countRound(5);
    }

    function orderSizeRound() {
        // three objects of different sizes - order small -> big
        const obj = pick(['apple','ball','car','flower','tree']);
        const sizes = [46, 64, 82];
        const shuffled = shuffle(sizes.map(s => ({ size: s, img: SvgArt.object(obj, s) })));
        return {
            type: 'order-size',
            prompt: 'از کوچک‌ترین به بزرگ‌ترین مرتب کن:',
            items: shuffled.map(s => ({ img: s.img, size: s.size })),
            answer: 'size',
            speech: 'از کوچک به بزرگ مرتب کن'
        };
    }

    function plantGrowthRound() {
        const stages = [
            { label: 'بذر', img: '<svg width="60" height="60" viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="16" ry="11" fill="#A974BC"/><path d="M50 62 Q50 44 62 38" stroke="#00B894" stroke-width="5" fill="none"/></svg>' },
            { label: 'جوانه', img: '<svg width="60" height="60" viewBox="0 0 100 100"><ellipse cx="50" cy="70" rx="18" ry="8" fill="#8B6B4A"/><path d="M50 70 L50 40 M50 40 Q36 36 32 48 Q48 46 50 40 M50 40 Q64 36 68 48 Q52 46 50 40" fill="#00B894"/></svg>' },
            { label: 'گل', img: SvgArt.flower('flower') },
            { label: 'درخت', img: SvgArt.object('tree') }
        ];
        const shuffled = shuffle(stages.map((s, i) => ({ label: s.label, img: s.img, idx: i })));
        return {
            type: 'order-steps',
            prompt: 'مراحل رشد گیاه را مرتب کن (از اول تا آخر):',
            items: shuffled.map(s => ({ label: s.label, img: s.img, idx: s.idx })),
            answer: 'idx',
            speech: 'مراحل رشد گیاه را مرتب کن'
        };
    }

    function storyOrderRound() {
        const story = {
            prompt: 'داستان را مرتب کن:',
            steps: [
                { label: 'صبح از خواب بیدار شدم', img: '<svg width="54" height="54" viewBox="0 0 100 100"><circle cx="50" cy="50" r="24" fill="#F9CA24"/><path d="M50 12 L50 22 M50 78 L50 88 M12 50 L22 50 M78 50 L88 50 M25 25 L32 32 M68 68 L75 75 M75 25 L68 32 M32 68 L25 75" stroke="#F9CA24" stroke-width="5" stroke-linecap="round"/></svg>' },
                { label: 'صبحانه خوردم', img: '<svg width="54" height="54" viewBox="0 0 100 100"><path d="M20 60 Q50 42 80 60 L74 80 Q50 88 26 80 Z" fill="#FFF"/><rect x="24" y="56" width="52" height="6" rx="3" fill="#E1B12C"/></svg>' },
                { label: 'به مدرسه رفتم', img: SvgArt.object('car', 60) },
                { label: 'بازی کردم', img: SvgArt.object('ball', 60) }
            ]
        };
        const shuffled = shuffle(story.steps.map((s, i) => ({ label: s.label, img: s.img, idx: i })));
        return {
            type: 'order-steps',
            prompt: story.prompt,
            items: shuffled.map(s => ({ label: s.label, img: s.img, idx: s.idx })),
            answer: 'idx',
            speech: 'داستان را به ترتیب بچین'
        };
    }

    function classifyRound() {
        // drag animals/fruits into two categories
        const animals = ['cat','dog','fish'];
        const fruits = ['apple','banana','orange'];
        const items = shuffle([
            { label: 'گربه', img: SvgArt.animal('cat'), cat: 'animals' },
            { label: 'ماهي', img: SvgArt.animal('fish'), cat: 'animals' },
            { label: 'سيب', img: SvgArt.object('apple'), cat: 'fruits' },
            { label: 'موز', img: SvgArt.object('banana'), cat: 'fruits' }
        ]);
        return {
            type: 'drag-match',
            prompt: 'هر چیز را در جای درستش بگذار:',
            targets: [
                { id: 'animals', label: 'حيوانات', img: '' },
                { id: 'fruits', label: 'ميوه‌ها', img: '' }
            ],
            items: items.map(it => ({ id: it.label, label: it.label, img: it.img, target: it.cat })),
            speech: 'حیوانات و میوه‌ها را جدا کن'
        };
    }

    // ============ SCIENCE ============
    function animalFactRound() {
        const a = pick(ANIMALS);
        const correct = a.fa;
        const others = shuffle(ANIMALS.map(x => x.fa).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others));
        return mc('این صدای کیست؟  «' + a.sound + '»', SvgArt.animal(animalKey(a.fa)),
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            'این صدای کیست؟ ' + a.sound);
    }

    function animalHabitatRound() {
        const a = pick(ANIMALS.filter(x => x.habitat));
        const correct = a.habitat;
        const others = shuffle(['خانه','مزرعه','دريا','جنگل','قطب','صحرا','باتلاق','ساوانا','طبيعت'].filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct].concat(others));
        return mc('«' + a.fa + '» کجا زندگی می‌کند؟', SvgArt.animal(animalKey(a.fa)),
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            a.fa + ' کجا زندگی می‌کند؟');
    }

    function bodyPartRound() {
        const b = pick(BODY_PARTS);
        const correct = b.fa;
        const others = shuffle(BODY_PARTS.map(x => x.fa).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others));
        return mc(b.use + ' — با کدام عضو؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            b.use);
    }

    function senseRound() {
        const s = pick(SENSES);
        const correct = s.sense;
        const others = shuffle(SENSES.map(x => x.sense).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others));
        return mc(s.example + ' — با کدام حس؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            s.example);
    }

    function seasonRound() {
        const s = pick(SEASONS);
        const correct = s.fa;
        const others = shuffle(SEASONS.map(x => x.fa).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others));
        return mc(s.weather + ' — کدام فصل؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            s.weather + ' کدام فصل است؟');
    }

    function seasonClothesRound() {
        const s = pick(SEASONS);
        const correct = s.clothes;
        const clothesPool = ['لباس سبک','لباس خنک','لباس گرم‌تر','پالتو و شال'];
        const others = shuffle(clothesPool.filter(x => x !== correct)).slice(0, 2);
        const opts = shuffle([correct].concat(others));
        return mc('در فصل «' + s.fa + '» چه می‌پوشیم؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            'در فصل ' + s.fa + ' چه می‌پوشیم؟');
    }

    // ============ SOCIO ============
    function emotionRound() {
        const e = pick(EMOTIONS);
        const correct = e.fa;
        const others = shuffle(EMOTIONS.map(x => x.fa).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others));
        return mc(e.situation + ' — چه حسی داریم؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            e.situation + ' چه حسی داریم؟');
    }

    function habitRound() {
        const good = pick(GOOD_HABITS);
        const correct = good.fa;
        const badPool = ['داد زدن','جیغ کشیدن','به حرف دیگران گوش ندادن','اسباب‌بازی‌ها را پرت کردن'];
        const others = shuffle(badPool).slice(0, 2);
        const opts = shuffle([correct].concat(others));
        return mc('کدام کار خوب است؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            'کدام کار خوب است؟');
    }

    function familyRound() {
        const f = pick(FAMILY);
        const correct = f.fa;
        const others = shuffle(FAMILY.map(x => x.fa).filter(x => x !== correct)).slice(0, 3);
        const opts = shuffle([correct].concat(others));
        return mc(f.role + ' — او کیست؟', null,
            opts.map(x => ({ label: x })),
            opts.indexOf(correct),
            f.role);
    }

    // ============ Memory (pairs) ============
    function memoryRound(pairCount) {
        // pick distinct items (image pairs)
        const pool = [
            { img: SvgArt.animal('cat'), label: 'گربه' },
            { img: SvgArt.animal('dog'), label: 'سگ' },
            { img: SvgArt.animal('fish'), label: 'ماهي' },
            { img: SvgArt.object('apple'), label: 'سيب' },
            { img: SvgArt.object('banana'), label: 'موز' },
            { img: SvgArt.object('ball'), label: 'توپ' },
            { img: SvgArt.object('flower'), label: 'گل' },
            { img: SvgArt.object('tree'), label: 'درخت' },
            { img: SvgArt.object('sun'), label: 'خورشيد' },
            { img: SvgArt.object('moon'), label: 'ماه' },
            { img: SvgArt.object('book'), label: 'کتاب' },
            { img: SvgArt.object('home'), label: 'خانه' }
        ];
        const chosen = shuffle(pool).slice(0, pairCount);
        const cards = [];
        chosen.forEach((c, i) => {
            cards.push({ pair: i, img: c.img, label: c.label });
            cards.push({ pair: i, img: c.img, label: c.label });
        });
        return {
            type: 'memory',
            cards: shuffle(cards),
            speech: 'جفت‌های مثل هم را پیدا کن'
        };
    }

    // ============ Tracing ============
    function tracingRound(letterOrNumber) {
        if (typeof letterOrNumber === 'string') {
            return { type: 'tracing', char: letterOrNumber, kind: 'letter', speech: 'حرف ' + letterOrNumber + ' را بنویس' };
        }
        return { type: 'tracing', char: String(letterOrNumber), kind: 'number', speech: 'عدد ' + toFa(letterOrNumber) + ' را بنویس' };
    }

    // ============ Painting ============
    function paintingRound() {
        return { type: 'painting', speech: 'هر چه دوست داری بکش!' };
    }

    // ============ Helpers ============
    function imgForWord(word) {
        const map = {
            'اسب':'horse','انار':'flower','ابر':'rain','بابا':'home','بچه':'rabbit','باران':'rain',
            'پنير':'bread','پروانه':'butterfly','تاب':'sun','توت':'apple','توپ':'ball','تخم مرغ':'chicken',
            'جوجه':'chicken','جنگل':'tree','چاي':'milk','چتر':'rain','چشم':'eye','چراغ':'sun',
            'خروس':'chicken','خورشيد':'sun','خانه':'home','دست':'hand','دريا':'fish','دوست':'cat',
            'روباه':'fox','رنگ':'flower','روز':'sun','سيب':'apple','سبز':'flower','ستاره':'star','سگ':'dog',
            'شير':'lion','شب':'moon','شتر':'camel','عروسک':'ball','عسل':'bee','عينک':'eye','فيل':'elephant',
            'فنجان':'milk','فرش':'rectangle','قلب':'apple','قلم':'rectangle','کتاب':'book','کفش':'hand',
            'کوه':'tree','کلاغ':'bird','گل':'flower','گربه':'cat','گوش':'ear','گردو':'apple','لاک‌پشت':'turtle',
            'لب':'nose','ليمو':'apple','لانه':'bird','مادر':'home','ماه':'moon','ميز':'rectangle','موز':'banana',
            'نان':'bread','نخود':'apple','هوا':'rain','هويج':'carrot','هندوانه':'watermelon','هفته':'book',
            'يخ':'snow','ماشين':'car','دوچرخه':'car','مدرسه':'home','موش':'rabbit','پنير':'bread'
        };
        const key = map[word];
        if (!key) return SvgArt.object('book');
        if (['horse','camel','carrot'].includes(key)) return SvgArt.object('apple');
        if (['cat','dog','bird','fish','turtle','lion','elephant','monkey','rabbit','fox','chicken','bear','bee','butterfly','frog','duck','sheep','cow'].includes(key)) {
            return SvgArt.animal(key);
        }
        return SvgArt.object(key);
    }

    function pickOtherWords(letter, count, exclude) {
        exclude = exclude || [];
        const pool = [];
        Object.keys(FIRST_SOUND_WORDS).forEach(k => {
            if (k !== letter) pool.push(...FIRST_SOUND_WORDS[k]);
        });
        return shuffle(pool.filter(w => !exclude.includes(w))).slice(0, count);
    }

    function animalKey(fa) {
        const map = {
            'گربه':'cat','سگ':'dog','مرغ':'chicken','خروس':'chicken','ماهي':'fish','لاک‌پشت':'turtle',
            'روباه':'fox','شير':'lion','فيل':'elephant','خرس':'bear','ميمون':'monkey','زرافه':'giraffe',
            'پنگوئن':'duck','خرگوش':'rabbit','جوجه':'chicken','زنبور':'bee','پروانه':'butterfly','قورباغه':'frog'
        };
        const k = map[fa];
        if (k && !['giraffe'].includes(k)) return k;
        return 'fox';
    }

    function countImage(n) {
        // row of n objects
        const obj = pick(['ball','apple','flower','star','fish']);
        const size = 54;
        let svgs = '';
        for (let i = 0; i < n; i++) svgs += SvgArt.object(obj, size);
        return `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:340px;margin:0 auto">${svgs}</div>`;
    }

    function arithImage(op, a, b) {
        const obj = pick(['ball','apple','star']);
        const size = 40;
        let left = '', right = '';
        for (let i = 0; i < a; i++) left += SvgArt.object(obj, size);
        for (let i = 0; i < b; i++) right += SvgArt.object(obj, size);
        return `<div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap">
            <div style="display:flex;flex-wrap:wrap;gap:4px;max-width:180px;justify-content:center">${left}</div>
            <span style="font-size:34px;font-weight:900">${op === '+' ? '+' : '−'}</span>
            <div style="display:flex;flex-wrap:wrap;gap:4px;max-width:180px;justify-content:center">${right}</div>
        </div>`;
    }

    // ============ Lesson plan mapping ============
    // Each lesson id -> array of round generators (functions) to build ~5 rounds
    const plans = {
        'R-L1-L01': () => [
            letterSoundRound(letter('ا')), letterSoundRound(letter('ب')),
            letterExampleRound(letter('ب')), letterSoundRound(letter('پ')),
            letterExampleRound(letter('ت'))
        ],
        'R-L1-L02': () => [
            letterSoundRound(letter('ث')), letterSoundRound(letter('ج')),
            letterExampleRound(letter('ج')), letterSoundRound(letter('چ')),
            letterExampleRound(letter('ح'))
        ],
        'R-L1-L03': () => [
            letterSoundRound(letter('خ')), letterExampleRound(letter('خ')),
            letterSoundRound(letter('د')), letterExampleRound(letter('د')),
            letterSoundRound(letter('ر'))
        ],
        'R-L1-L04': () => [
            letterSoundRound(letter('ز')), letterSoundRound(letter('س')),
            letterExampleRound(letter('س')), letterSoundRound(letter('ش')),
            letterExampleRound(letter('ش'))
        ],
        'R-L1-L05': () => [
            letterSoundRound(letter('ص')), letterSoundRound(letter('ط')),
            letterSoundRound(letter('ع')), letterExampleRound(letter('ف')),
            letterSoundRound(letter('ق'))
        ],
        'R-L1-L06': () => [
            letterSoundRound(letter('غ')), letterSoundRound(letter('ف')),
            letterExampleRound(letter('ف')), letterSoundRound(letter('ق')),
            letterExampleRound(letter('ق'))
        ],
        'R-L1-L07': () => [
            letterSoundRound(letter('ک')), letterExampleRound(letter('ک')),
            letterSoundRound(letter('گ')), letterExampleRound(letter('گ')),
            letterSoundRound(letter('م'))
        ],
        'R-L1-L08': () => [
            letterSoundRound(letter('ن')), letterExampleRound(letter('ن')),
            letterSoundRound(letter('و')), letterSoundRound(letter('ه')),
            letterExampleRound(letter('ي'))
        ],
        'R-L2-L01': () => [firstSoundRound(), firstSoundRound(), firstSoundRound(), firstSoundRound(), firstSoundRound()],
        'R-L2-L02': () => [rhymeRound(), rhymeRound(), rhymeRound(), rhymeRound(), rhymeRound()],
        'R-L2-L03': () => [syllableRound(), syllableRound(), syllableRound(), syllableRound(), syllableRound()],
        'R-L2-L04': () => [rhymeRound(), rhymeRound(), rhymeRound(), rhymeRound(), rhymeRound()],
        'R-L2-L05': () => [syllableRound(), syllableRound(), syllableRound(), syllableRound(), syllableRound()],
        'R-L3-L01': () => [blendRound(), blendRound(), blendRound(), blendRound(), blendRound()],
        'R-L3-L02': () => [blendRound(), blendRound(), blendRound(), blendRound(), blendRound()],
        'R-L3-L03': () => [memoryRound(3), memoryRound(3), memoryRound(4), memoryRound(4), memoryRound(4)],
        'R-L3-L04': () => [blendRound(), blendRound(), blendRound(), blendRound(), blendRound()],
        'R-L3-L05': () => [sightWordRound(), sightWordRound(), sightWordRound(), sightWordRound(), sightWordRound()],
        'R-L4-L01': () => [sightWordRound(), sightWordRound(), sightWordRound(), sightWordRound(), sightWordRound()],
        'R-L4-L02': () => [sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound()],
        'R-L4-L03': () => [sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound()],
        'R-L4-L04': () => [wordMeaningRound(), wordMeaningRound(), wordMeaningRound(), wordMeaningRound(), wordMeaningRound()],
        'R-L4-L05': () => [oppositeRound(), oppositeRound(), oppositeRound(), oppositeRound(), oppositeRound()],
        'R-L5-L01': () => [tracingRound(pick(['ا','ب','ت','م','س','د','ک','گ'])),
                          tracingRound(pick(['ا','ب','ت','م','س','د','ک','گ'])),
                          tracingRound(pick(['ا','ب','ت','م','س','د','ک','گ'])),
                          tracingRound(pick(['ا','ب','ت','م','س','د','ک','گ'])),
                          tracingRound(pick(['ا','ب','ت','م','س','د','ک','گ']))],
        'R-L5-L02': () => [tracingRound(pick(['اب','بابا','مادر','نان','سيب','گل'])),
                          tracingRound(pick(['اب','بابا','مادر','نان','سيب','گل'])) ,
                          tracingRound(pick(['اب','بابا','مادر','نان','سيب','گل'])) ,
                          tracingRound(pick(['اب','بابا','مادر','نان','سيب','گل'])) ,
                          tracingRound(pick(['اب','بابا','مادر','نان','سيب','گل']))],
        'R-L5-L03': () => [sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound()],
        'R-L5-L04': () => [wordMeaningRound(), wordMeaningRound(), wordMeaningRound(), wordMeaningRound(), wordMeaningRound()],
        'R-L5-L05': () => [sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound(), sentenceRound()],
        'R-L6-L01': () => [storyOrderRound(), wordMeaningRound(), storyOrderRound(), wordMeaningRound(), oppositeRound()],
        'R-L6-L02': () => [storyOrderRound(), storyOrderRound(), wordMeaningRound(), storyOrderRound(), oppositeRound()],
        'R-L6-L03': () => [wordMeaningRound(), wordMeaningRound(), wordMeaningRound(), wordMeaningRound(), wordMeaningRound()],
        'R-L6-L04': () => [storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound()],
        'R-L6-L05': () => [wordMeaningRound(), wordMeaningRound(), oppositeRound(), wordMeaningRound(), oppositeRound()],
        'R-L7-L01': () => [sentenceRound(), sentenceRound(), wordMeaningRound(), sentenceRound(), sentenceRound()],
        'R-L7-L02': () => [paintingRound()],
        'R-L7-L03': () => [storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound()],
        'R-L7-L04': () => [paintingRound()],

        // MATH
        'M-L1-L01': () => [countRound(3), countRound(3), countRound(3), countRound(3), countRound(3)],
        'M-L1-L02': () => [countRound(5), countRound(5), countRound(5), countRound(5), countRound(5)],
        'M-L1-L03': () => [countRound(10), countRound(10), countRound(10), countRound(10), countRound(10)],
        'M-L1-L04': () => [numberNameRound(5), numberNameRound(5), numberNameRound(5), numberNameRound(5), numberNameRound(5)],
        'M-L1-L05': () => [numberNameRound(10), numberNameRound(10), numberNameRound(10), numberNameRound(10), numberNameRound(10)],
        'M-L1-L06': () => [countRound(10), countRound(10), numberNameRound(10), countRound(10), numberNameRound(10)],
        'M-L2-L01': () => [countRound(20), countRound(20), countRound(20), countRound(20), countRound(20)],
        'M-L2-L02': () => [numberOrderRound(10), numberOrderRound(10), numberOrderRound(10), numberOrderRound(10), numberOrderRound(10)],
        'M-L2-L03': () => [compareRound(10), compareRound(10), compareRound(10), compareRound(10), compareRound(10)],
        'M-L2-L04': () => [countRound(20), countRound(20), countRound(20), countRound(20), countRound(20)],
        'M-L2-L05': () => [numberOrderRound(10), numberOrderRound(10), numberOrderRound(10), numberOrderRound(10), numberOrderRound(10)],
        'M-L3-L01': () => [shapeNameRound(), shapeNameRound(), shapeMatchRound(), shapeNameRound(), shapeMatchRound()],
        'M-L3-L02': () => [shapeNameRound(), shapeNameRound(), shapeMatchRound(), shapeNameRound(), shapeMatchRound()],
        'M-L3-L03': () => [shapeNameRound(), shapeNameRound(), shapeMatchRound(), shapeNameRound(), shapeMatchRound()],
        'M-L3-L04': () => [shapeMatchRound(), shapeMatchRound(), shapeNameRound(), shapeMatchRound(), shapeMatchRound()],
        'M-L3-L05': () => [oddOneOutRound('shapes'), oddOneOutRound('shapes'), oddOneOutRound('shapes'), oddOneOutRound('shapes'), oddOneOutRound('shapes')],
        'M-L4-L01': () => [arithRound('+', 5), arithRound('+', 5), arithRound('+', 5), arithRound('+', 5), arithRound('+', 5)],
        'M-L4-L02': () => [arithRound('+', 5), arithRound('+', 5), arithRound('+', 5), arithRound('+', 5), arithRound('+', 5)],
        'M-L4-L03': () => [arithRound('+', 5), arithRound('+', 5), arithRound('+', 5), arithRound('+', 5), arithRound('+', 5)],
        'M-L4-L04': () => [arithRound('+', 10), arithRound('+', 10), arithRound('+', 10), arithRound('+', 10), arithRound('+', 10)],
        'M-L4-L05': () => [arithRound('+', 10), arithRound('+', 10), arithRound('+', 10), arithRound('+', 10), arithRound('+', 10)],
        'M-L5-L01': () => [arithRound('-', 5), arithRound('-', 5), arithRound('-', 5), arithRound('-', 5), arithRound('-', 5)],
        'M-L5-L02': () => [arithRound('-', 5), arithRound('-', 5), arithRound('-', 5), arithRound('-', 5), arithRound('-', 5)],
        'M-L5-L03': () => [arithRound('-', 10), arithRound('-', 10), arithRound('-', 10), arithRound('-', 10), arithRound('-', 10)],
        'M-L5-L04': () => [arithRound('both', 10), arithRound('both', 10), arithRound('both', 10), arithRound('both', 10), arithRound('both', 10)],
        'M-L5-L05': () => [arithRound('-', 10), arithRound('-', 10), arithRound('-', 10), arithRound('-', 10), arithRound('-', 10)],
        'M-L6-L01': () => [patternRound(), patternRound(), patternRound(), patternRound(), patternRound()],
        'M-L6-L02': () => [patternRound(), patternRound(), patternRound(), patternRound(), patternRound()],
        'M-L6-L03': () => [patternRound(), patternRound(), patternRound(), patternRound(), patternRound()],
        'M-L6-L04': () => [patternRound(), patternRound(), patternRound(), patternRound(), patternRound()],
        'M-L6-L05': () => [patternRound(), patternRound(), patternRound(), patternRound(), patternRound()],
        'M-L7-L01': () => [arithRound('+', 20), arithRound('+', 20), arithRound('+', 20), arithRound('+', 20), arithRound('+', 20)],
        'M-L7-L02': () => [arithRound('-', 20), arithRound('-', 20), arithRound('-', 20), arithRound('-', 20), arithRound('-', 20)],
        'M-L7-L03': () => [countRound(20), numberNameRound(20), countRound(20), numberNameRound(20), countRound(20)],
        'M-L7-L04': () => [arithRound('both', 20), arithRound('both', 20), arithRound('both', 20), arithRound('both', 20), arithRound('both', 20)],
        'M-L8-L01': () => [orderSizeRound(), orderSizeRound(), compareRound(10), orderSizeRound(), compareRound(10)],
        'M-L8-L02': () => [orderSizeRound(), orderSizeRound(), orderSizeRound(), orderSizeRound(), orderSizeRound()],
        'M-L8-L03': () => [countRound(10), orderSizeRound(), countRound(10), orderSizeRound(), countRound(10)],
        'M-L8-L04': () => [storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound()],

        // LOGIC
        'L-L1-L01': () => [memoryRound(3), memoryRound(3), memoryRound(4), memoryRound(3), memoryRound(4)],
        'L-L1-L02': () => [memoryRound(4), memoryRound(4), memoryRound(4), memoryRound(4), memoryRound(4)],
        'L-L1-L03': () => [classifyRound(), classifyRound(), classifyRound(), classifyRound(), classifyRound()],
        'L-L1-L04': () => [memoryRound(3), memoryRound(3), memoryRound(4), memoryRound(3), memoryRound(4)],
        'L-L2-L01': () => [oddOneOutRound('animals'), oddOneOutRound('animals'), oddOneOutRound('animals'), oddOneOutRound('animals'), oddOneOutRound('animals')],
        'L-L2-L02': () => [oddOneOutRound('animals'), oddOneOutRound('animals'), oddOneOutRound('shapes'), oddOneOutRound('animals'), oddOneOutRound('shapes')],
        'L-L2-L03': () => [memoryRound(3), oddOneOutRound('shapes'), memoryRound(4), oddOneOutRound('animals'), memoryRound(4)],
        'L-L3-L01': () => [memoryRound(4), memoryRound(4), memoryRound(4), memoryRound(4), memoryRound(4)],
        'L-L3-L02': () => [memoryRound(4), memoryRound(4), memoryRound(4), memoryRound(4), memoryRound(4)],
        'L-L3-L03': () => [memoryRound(4), memoryRound(4), memoryRound(6), memoryRound(4), memoryRound(6)],
        'L-L4-L01': () => [orderSizeRound(), orderSizeRound(), orderSizeRound(), orderSizeRound(), orderSizeRound()],
        'L-L4-L02': () => [storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound(), storyOrderRound()],
        'L-L4-L03': () => [plantGrowthRound(), plantGrowthRound(), plantGrowthRound(), plantGrowthRound(), plantGrowthRound()],
        'L-L5-L01': () => [classifyRound(), classifyRound(), classifyRound(), classifyRound(), classifyRound()],
        'L-L5-L02': () => [classifyRound(), classifyRound(), classifyRound(), classifyRound(), classifyRound()],
        'L-L5-L03': () => [classifyRound(), classifyRound(), classifyRound(), classifyRound(), classifyRound()],
        'L-L6-L01': () => [oddOneOutRound('shapes'), oddOneOutRound('animals'), oddOneOutRound('shapes'), oddOneOutRound('animals'), oddOneOutRound('shapes')],
        'L-L6-L02': () => [plantGrowthRound(), storyOrderRound(), plantGrowthRound(), storyOrderRound(), plantGrowthRound()],
        'L-L6-L03': () => [oddOneOutRound('animals'), oddOneOutRound('shapes'), oddOneOutRound('animals'), oddOneOutRound('shapes'), oddOneOutRound('animals')],

        // SCIENCE
        'S-L1-L01': () => [animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound()],
        'S-L1-L02': () => [animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound()],
        'S-L1-L03': () => [animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound()],
        'S-L1-L04': () => [animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound(), animalFactRound()],
        'S-L2-L01': () => [bodyPartRound(), bodyPartRound(), bodyPartRound(), bodyPartRound(), bodyPartRound()],
        'S-L2-L02': () => [senseRound(), senseRound(), senseRound(), senseRound(), senseRound()],
        'S-L2-L03': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'S-L3-L01': () => [plantGrowthRound(), plantGrowthRound(), plantGrowthRound(), plantGrowthRound(), plantGrowthRound()],
        'S-L3-L02': () => [plantGrowthRound(), plantGrowthRound(), plantGrowthRound(), plantGrowthRound(), plantGrowthRound()],
        'S-L3-L03': () => [classifyRound(), classifyRound(), classifyRound(), classifyRound(), classifyRound()],
        'S-L4-L01': () => [seasonRound(), seasonRound(), seasonRound(), seasonRound(), seasonRound()],
        'S-L4-L02': () => [seasonRound(), seasonRound(), seasonRound(), seasonRound(), seasonRound()],
        'S-L4-L03': () => [seasonClothesRound(), seasonClothesRound(), seasonClothesRound(), seasonClothesRound(), seasonClothesRound()],
        'S-L5-L01': () => [animalHabitatRound(), animalHabitatRound(), animalHabitatRound(), animalHabitatRound(), animalHabitatRound()],
        'S-L5-L02': () => [animalHabitatRound(), animalHabitatRound(), animalHabitatRound(), animalHabitatRound(), animalHabitatRound()],
        'S-L5-L03': () => [animalHabitatRound(), animalHabitatRound(), animalHabitatRound(), animalHabitatRound(), animalHabitatRound()],
        'S-L5-L04': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'S-L6-L01': () => [seasonRound(), seasonRound(), seasonRound(), seasonRound(), seasonRound()],
        'S-L6-L02': () => [classifyRound(), habitRound(), classifyRound(), habitRound(), classifyRound()],
        'S-L6-L03': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],

        // SOCIO
        'SE-L1-L01': () => [emotionRound(), emotionRound(), emotionRound(), emotionRound(), emotionRound()],
        'SE-L1-L02': () => [emotionRound(), emotionRound(), emotionRound(), emotionRound(), emotionRound()],
        'SE-L1-L03': () => [emotionRound(), emotionRound(), emotionRound(), emotionRound(), emotionRound()],
        'SE-L2-L01': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'SE-L2-L02': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'SE-L2-L03': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'SE-L3-L01': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'SE-L3-L02': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'SE-L3-L03': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'SE-L4-L01': () => [familyRound(), familyRound(), familyRound(), familyRound(), familyRound()],
        'SE-L4-L02': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],
        'SE-L4-L03': () => [familyRound(), familyRound(), familyRound(), familyRound(), familyRound()],
        'SE-L5-L01': () => [habitRound(), emotionRound(), habitRound(), emotionRound(), habitRound()],
        'SE-L5-L02': () => [classifyRound(), habitRound(), classifyRound(), habitRound(), classifyRound()],
        'SE-L5-L03': () => [habitRound(), habitRound(), habitRound(), habitRound(), habitRound()],

        // ART
        'A-L1-L01': () => [memoryRound(3), memoryRound(3), memoryRound(4), memoryRound(3), memoryRound(4)],
        'A-L1-L02': () => [paintingRound()],
        'A-L1-L03': () => [paintingRound()],
        'A-L2-L01': () => [paintingRound()],
        'A-L2-L02': () => [paintingRound()],
        'A-L2-L03': () => [paintingRound()],
        'A-L3-L01': () => [paintingRound()],
        'A-L3-L02': () => [paintingRound()],
        'A-L3-L03': () => [paintingRound()],
        'A-L4-L01': () => [paintingRound()],
        'A-L4-L02': () => [paintingRound()],
        'A-L4-L03': () => [paintingRound()]
    };

    function letter(ch) {
        return ALPHABET.find(l => l.letter === ch) || ALPHABET[0];
    }

    // Generate rounds for a lesson id
    function generate(lessonId) {
        const fn = plans[lessonId];
        if (fn) return fn();
        // Fallback: generic rounds
        return [countRound(10), countRound(10), countRound(10), countRound(10), countRound(10)];
    }

    return { generate };
})();

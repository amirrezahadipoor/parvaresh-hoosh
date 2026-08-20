#!/usr/bin/env node
'use strict';

// Deep semantic invariants for generated educational rounds. This catches
// questions that are structurally renderable but have duplicate/ambiguous
// options, a wrong answer index, mismatched letters or broken match targets.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function boot() {
    const order = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .matchAll(/src="([^"]*\.js)"/g)].map(match => match[1]).filter(file => !file.includes('vendor'));
    const stub = () => ({
        style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
        appendChild() {}, setAttribute() {}, addEventListener() {}, querySelector: () => null,
        querySelectorAll: () => [], innerHTML: '', textContent: '', dataset: {}, children: [],
        remove() {}, insertBefore() {}, cloneNode() { return stub(); }, getContext: () => null
    });
    const document = {
        createElement: stub, createElementNS: stub, createDocumentFragment: stub,
        querySelector: () => null, querySelectorAll: () => [], addEventListener() {},
        getElementById: () => null, body: stub(), documentElement: stub(), head: stub()
    };
    const window = {
        document, localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
        addEventListener() {}, navigator: { userAgent: 'semantic-audit' }, location: { href: '', search: '' },
        matchMedia: () => ({ matches: false, addEventListener() {} }),
        requestAnimationFrame: () => 0, cancelAnimationFrame() {}, setTimeout, clearTimeout,
        setInterval: () => 0, clearInterval() {}, screen: { width: 390, height: 844 },
        innerWidth: 390, innerHeight: 844, getComputedStyle: () => ({ getPropertyValue: () => '' }),
        Audio: function Audio() { return { play: () => Promise.resolve(), pause() {} }; },
        AudioContext: function AudioContext() { return {
            createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: { value: 0 } }),
            createGain: () => ({ connect() {}, gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} } }),
            destination: {}, currentTime: 0, state: 'running', resume() {}
        }; }
    };
    window.window = window; window.self = window; window.globalThis = window;
    const context = vm.createContext(window);
    vm.runInContext(`let seed=0x6d2b79f5;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}`, context);
    for (const file of order) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
    return window;
}

const faToLatin = value => String(value).replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
const normalizeAlef = value => String(value).replace(/^آ/, 'ا');
const optionKey = option => {
    const label = String(option && (option.label ?? option.text ?? option.id) || '').trim();
    if (label) return `text:${label}`;
    const image = String(option && option.img || '')
        .replace(/(?:lt|nt)[a-z0-9]{6}/g, 'generated-id')
        .replace(/\s+/g, ' ').trim();
    return image ? `img:${image}` : '';
};
const errors = [];
const stats = { lessons: 0, rounds: 0, quiz: 0, dragMatch: 0, ordering: 0, memory: 0, special: 0 };
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));
const window = boot();
const passes = Number(process.env.SEMANTIC_AUDIT_PASSES || 8);

// Canonical data checks, independent of random round sampling.
for (const [letter, words] of Object.entries(window.FIRST_SOUND_WORDS || {})) {
    for (const word of words) {
        if (normalizeAlef(word)[0] !== normalizeAlef(letter)[0]) errors.push(`FIRST_SOUND_WORDS: «${word}» does not start with «${letter}»`);
    }
}
const oppositeStarts = (window.OPPOSITES || []).map(pair => pair.a);
if (new Set(oppositeStarts).size !== oppositeStarts.length) errors.push('OPPOSITES contains duplicate source words');
for (const pair of window.OPPOSITES || []) if (!pair.a || !pair.b || pair.a === pair.b) errors.push(`invalid opposite pair ${pair.a}/${pair.b}`);
const months = window.FA_MONTHS || [];
if (months.length !== 12) errors.push(`expected 12 Persian months, got ${months.length}`);
for (const season of ['بهار', 'تابستان', 'پاییز', 'زمستان']) {
    if (months.filter(month => month.season === season).length !== 3) errors.push(`${season} must contain exactly three months`);
}
for (const animal of window.ANIMALS || []) {
    if (animal.soundQuiz !== false && /بی‌صدا|هویج|زرنگ|بال‌زدن/.test(String(animal.sound))) errors.push(`${animal.fa}: unsuitable animal-sound quiz text «${animal.sound}»`);
}
for (const domain of curriculum.domains) for (const level of domain.levels) for (const lesson of level.lessons) {
    if (/[0-9]/.test(lesson.title)) errors.push(`${lesson.id}: title contains Latin digits`);
}

function fail(lesson, age, pass, message) {
    errors.push(`${lesson.id} age=${age} pass=${pass + 1}: ${message}`);
}

for (const domain of curriculum.domains) for (const level of domain.levels) for (const lesson of level.lessons) {
    stats.lessons++;
    for (const age of [4, 5, 6, 7, 8]) for (let pass = 0; pass < passes; pass++) {
        const metadata = { ...lesson, domain: domain.id, childAge: age };
        const rounds = window.Generator.generate(lesson.id, metadata) || [];
        for (const [roundIndex, round] of rounds.entries()) {
            stats.rounds++;
            const where = message => fail(lesson, age, pass, `round ${roundIndex + 1}/${round.type}: ${message}`);
            const options = Array.isArray(round.options) ? round.options : null;
            if (options) {
                if (options.length < 2) where(`only ${options.length} option(s)`);
                if (!Number.isInteger(round.answer) || round.answer < 0 || round.answer >= options.length) where(`invalid answer ${round.answer}`);
                const keys = options.map(optionKey);
                if (keys.some(key => !key)) where('empty option without text or image');
                const allowsRepeatedGroup = /فرق دارد|متفاوت|ناجور|وصله|با بقیه/.test(String(round.prompt || round.speech || ''));
                if (!allowsRepeatedGroup && new Set(keys).size !== keys.length) where(`duplicate/ambiguous options: ${keys.join(' | ')}`);
            }

            if (round.type === 'quiz') {
                stats.quiz++;
                const answer = options && options[round.answer];
                const answerLabel = String(answer && (answer.label ?? answer.text) || '').trim();
                const prompt = String(round.prompt || '');
                const letterPrompt = prompt.match(/با (?:حرف|صدای) «([^»]+)» شروع/);
                if (letterPrompt && answerLabel && normalizeAlef(answerLabel)[0] !== normalizeAlef(letterPrompt[1])[0]) {
                    where(`answer «${answerLabel}» does not start with «${letterPrompt[1]}»`);
                }
                if (round.letter) {
                    if (/کدام حرف/.test(prompt) && answerLabel !== round.letter) where(`letter answer «${answerLabel}» != metadata «${round.letter}»`);
                    const expected = ({'ث':'letter-se','ف':'letter-fe'})[round.letter];
                    if (expected && round.audioClip !== expected) where(`letter ${round.letter} uses ${round.audioClip}, expected ${expected}`);
                }
                const arithmetic = prompt.match(/^([۰-۹]+)\s*([+−])\s*([۰-۹]+)\s*=\s*؟$/);
                if (arithmetic) {
                    const a = Number(faToLatin(arithmetic[1]));
                    const b = Number(faToLatin(arithmetic[3]));
                    const expected = arithmetic[2] === '+' ? a + b : a - b;
                    if (Number(faToLatin(answerLabel)) !== expected) where(`arithmetic answer ${answerLabel} != ${expected}`);
                }
                if (/بزرگ‌تر/.test(prompt) && Number(faToLatin(answerLabel)) !== Math.max(...options.map(option => Number(faToLatin(option.label))))) {
                    where(`wrong maximum answer ${answerLabel}`);
                }
                if (/کوچک‌تر/.test(prompt) && Number(faToLatin(answerLabel)) !== Math.min(...options.map(option => Number(faToLatin(option.label))))) {
                    where(`wrong minimum answer ${answerLabel}`);
                }
                if (round.clockHour && Number(faToLatin(answerLabel).split(':')[0]) !== round.clockHour) {
                    where(`clock answer ${answerLabel} != drawn hour ${round.clockHour}`);
                }
            } else if (round.type === 'drag-match') {
                stats.dragMatch++;
                const items = round.items || [], targets = round.targets || [];
                const targetIds = targets.map(target => target.id);
                if (!items.length || !targets.length) where('empty items or targets');
                if (new Set(targetIds).size !== targetIds.length) where('duplicate target ids');
                if (new Set(items.map(item => item.id)).size !== items.length) where('duplicate item ids');
                for (const item of items) if (!targetIds.includes(item.target)) where(`item ${item.id} points to missing target ${item.target}`);
            } else if (round.type === 'order-steps') {
                stats.ordering++;
                const items = round.items || [];
                if (round.answer === 'idx') {
                    const indices = items.map(item => item.idx);
                    if (!items.length || indices.some(index => !Number.isInteger(index))) where('missing integer ordering index');
                    if (new Set(indices).size !== indices.length) where('duplicate ordering indices');
                    const sorted = [...indices].sort((a, b) => a - b);
                    if (sorted.some((value, index) => value !== index)) where(`non-contiguous ordering indices ${sorted}`);
                } else if (round.answer === 'size') {
                    const sizes = items.map(item => item.size);
                    if (!items.length || sizes.some(size => !Number.isFinite(size))) where('missing numeric size key');
                    if (new Set(sizes).size !== sizes.length) where('duplicate size keys');
                } else {
                    where(`unsupported ordering answer key ${round.answer}`);
                }
            } else if (round.type === 'memory') {
                stats.memory++;
                const groups = new Map();
                for (const card of round.cards || []) {
                    if (!groups.has(card.pair)) groups.set(card.pair, []);
                    groups.get(card.pair).push(card);
                }
                for (const [pair, cards] of groups) {
                    if (cards.length !== 2) where(`pair ${pair} has ${cards.length} cards`);
                    if (cards.length === 2 && (cards[0].label !== cards[1].label || cards[0].img !== cards[1].img)) where(`pair ${pair} is not identical`);
                }
            } else if (round.type === 'balloon-pop') {
                stats.special++;
                const matches = (round.items || []).filter(item => item.text === round.targetText).length;
                if (matches !== 1) where(`target ${round.targetText} appears ${matches} times`);
            } else if (round.type === 'shadow-match') {
                stats.special++;
                const correct = (round.shadowOptions || []).map((option, index) => option.isCorrect ? index : -1).filter(index => index >= 0);
                if (correct.length !== 1 || correct[0] !== round.answer) where(`shadow correct=${correct}, answer=${round.answer}`);
            } else if (round.type === 'raven-matrix') {
                stats.special++;
                const correct = (round.options || []).map((option, index) => option.isCorrect ? index : -1).filter(index => index >= 0);
                if (correct.length !== 1 || correct[0] !== round.answer) where(`raven correct=${correct}, answer=${round.answer}`);
            } else if (round.type === 'balance-scale') {
                stats.special++;
                if (!(round.leftCount > 0 && round.rightCount > 0) || round.leftCount === round.rightCount) where('balance sides must be positive and unequal');
            } else if (round.type === 'tracing') {
                stats.special++;
                if (!String(round.char || '').trim() || !['letter', 'number'].includes(round.kind)) where('invalid tracing character/kind');
            }
        }
    }
}

const unique = [...new Set(errors)];
console.log(JSON.stringify({ ...stats, passesPerAge: passes, distinctProblems: unique.length }, null, 2));
if (unique.length) {
    unique.slice(0, 100).forEach(error => console.error(`- ${error}`));
    if (unique.length > 100) console.error(`... ${unique.length - 100} more`);
    process.exit(1);
}
console.log('OK: generated answers, options, letters, arithmetic, matching, ordering, memory and special-engine semantics are internally consistent.');

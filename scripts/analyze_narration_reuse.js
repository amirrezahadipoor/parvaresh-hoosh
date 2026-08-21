#!/usr/bin/env node
'use strict';

// Runtime-aware narration inventory. It resolves rounds exactly as the app does:
// an explicit audioClip wins; only rounds without one require an exact speech-text
// mapping. This prevents stale manifest aliases from being mistaken for real work.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function stub() {
    return {
        style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
        appendChild() {}, setAttribute() {}, addEventListener() {}, querySelector: () => null,
        querySelectorAll: () => [], innerHTML: '', textContent: '', dataset: {}, children: [],
        remove() {}, insertBefore() {}, cloneNode() { return stub(); }, getContext: () => null
    };
}

const document = {
    createElement: stub, createElementNS: stub, createDocumentFragment: stub,
    querySelector: () => null, querySelectorAll: () => [], addEventListener() {},
    getElementById: () => null, body: stub(), documentElement: stub(), head: stub()
};
const window = {
    document, localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    addEventListener() {}, navigator: { userAgent: 'narration-reuse-audit' }, location: { href: '', search: '' },
    matchMedia: () => ({ matches: false, addEventListener() {} }), requestAnimationFrame: () => 0,
    cancelAnimationFrame() {}, setTimeout, clearTimeout, setInterval: () => 0, clearInterval() {},
    screen: { width: 390, height: 844 }, innerWidth: 390, innerHeight: 844,
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    Audio: function Audio() { return { play: () => Promise.resolve(), pause() {} }; },
    AudioContext: function AudioContext() { return {
        createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: { value: 0 } }),
        createGain: () => ({ connect() {}, gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} } }),
        destination: {}, currentTime: 0, state: 'running', resume() {}
    }; }
};
window.window = window;
window.self = window;
window.globalThis = window;
const context = vm.createContext(window);
vm.runInContext(`let seed=0x21c0ffee;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}`, context);

const order = [...fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/src="([^"]*\.js)"/g)]
    .map(match => match[1]).filter(file => !file.includes('vendor'));
for (const file of order) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });

const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));
const queue = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/narration-rebuild-queue.json'), 'utf8'));
const passes = Number(process.env.NARRATION_REUSE_PASSES || 20);
const spoken = new Set();
const directClipIds = new Set();
let rounds = 0;

for (const domain of curriculum.domains) for (const level of domain.levels) for (const lesson of level.lessons) {
    for (const age of [4, 5, 6, 7, 8]) for (let pass = 0; pass < passes; pass++) {
        const generated = window.Generator.generate(lesson.id, { ...lesson, domain: domain.id, childAge: age }) || [];
        for (const round of generated) {
            rounds++;
            const text = String(round.speech || round.prompt || '').trim();
            if (round.audioClip) directClipIds.add(String(round.audioClip));
            else if (text) spoken.add(text);
            if (round.lessonIntro) directClipIds.add(String(round.lessonIntro));
        }
    }
}

// Literal calls outside generated rounds (system errors and fixed activity lines).
for (const file of order.filter(file => file.endsWith('.js'))) {
    const code = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of code.matchAll(/AudioEngine\.speak\(\s*(['"])(.*?)\1\s*\)/gs)) spoken.add(match[2]);
}

const queueByText = new Map(queue.items.map(item => [item.text, item]));
const required = item => spoken.has(item.text) || directClipIds.has(item.clip);
const result = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    passesPerAge: passes,
    rounds,
    queueTotal: queue.items.length,
    queueGenerated: queue.generatedTexts,
    uniqueRuntimeSpeechTexts: spoken.size,
    directClipIds: directClipIds.size,
    requiredGenerated: queue.items.filter(item => item.status === 'generated' && required(item)).length,
    reservedGenerated: queue.items.filter(item => item.status === 'generated' && !required(item)),
    requiredPending: queue.items.filter(item => item.status === 'pending' && required(item)),
    deadPending: queue.items.filter(item => item.status === 'pending' && !required(item)),
    runtimeNotQueued: [...spoken].filter(text => !queueByText.has(text)).sort()
};

if (process.argv.includes('--write')) {
    const output = path.join(root, 'QA_NARRATION_RUNTIME_INVENTORY.json');
    fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
    console.log(output);
} else {
    console.log(JSON.stringify({
        ...result,
        requiredPending: result.requiredPending.length,
        deadPending: result.deadPending.length
    }, null, 2));
}

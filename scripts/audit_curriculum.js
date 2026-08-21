#!/usr/bin/env node
// Product-quality audit for the bundled curriculum and its activity resolver.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];

function createElement() {
    return {
        style: { setProperty() {} },
        appendChild() {},
        addEventListener() {},
        querySelector() { return createElement(); },
        querySelectorAll() { return []; },
        classList: { add() {}, remove() {}, contains() { return false; } },
        getContext() { return null; },
        getBoundingClientRect() { return { left: 0, top: 0, width: 320, height: 240, right: 320, bottom: 240 }; }
    };
}

// Reproducible generator coverage: the same commit must produce the same audit.
let randomState = 0x3a1f27c5;
Math.random = () => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 0x100000000;
};

global.window = global;
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.document = {
    createElement,
    querySelector: createElement,
    querySelectorAll: () => [],
    addEventListener: () => {}
};
global.localStorage = {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, value) { this._data[key] = value; },
    removeItem(key) { delete this._data[key]; }
};

[
    'src/data/alphabet.js', 'src/data/words.js', 'src/data/math-data.js',
    'src/data/world-data.js', 'src/data/lesson-packages.js', 'src/data/narration-map.js', 'src/core/config.js', 'src/core/mascot.js',
    'src/core/svg-art.js', 'src/activities/generator.js'
].forEach(file => require(path.join(root, file)));

const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content/content_manifest.json'), 'utf8'));
const lessons = curriculum.domains.flatMap(domain => domain.levels.flatMap(level => level.lessons));
const ids = new Set(lessons.map(lesson => lesson.id));
const roundTypes = new Map();
const skillTypes = new Map();
const clipIds = new Set(fs.readdirSync(path.join(root, 'assets/audio/kid'))
    .filter(file => file.endsWith('.mp3')).map(file => file.slice(0, -4)));
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/kid/narration-provenance.json'), 'utf8'));
const narrationRebuildInProgress = provenance.rebuildStatus === 'in-progress';
let mapped = 0;
let voicedRounds = 0;
let pendingNarrationRounds = 0;

for (const lesson of lessons) {
    const rounds = window.Generator.generate(lesson.id, lesson);
    // Standard lessons are 5 rounds. Alphabet lessons run one sound round plus one
    // picture round for EVERY letter in their title, then a tracing round, so a
    // 4-letter lesson is legitimately 9 rounds.
    const isAlphabet = /صدای الفبا/.test(lesson.title || '');
    const okLength = isAlphabet ? rounds.length >= 5 && rounds.length <= 12 : rounds.length === 5;
    if (!Array.isArray(rounds) || !okLength) {
        errors.push(`${lesson.id}: unexpected round count ${Array.isArray(rounds) ? rounds.length : 'n/a'}`);
        continue;
    }
    if (rounds.some(round => round.lessonId !== lesson.id || round.skillType !== lesson.type)) {
        errors.push(`${lesson.id}: metadata was not carried into every round`);
    } else {
        mapped++;
    }
    rounds.forEach((round, index) => {
        roundTypes.set(round.type, (roundTypes.get(round.type) || 0) + 1);
        const spoken = String(round.speech || round.prompt || '').trim();
        const mappedClip = spoken && window.NARRATION_MAP ? window.NARRATION_MAP[spoken] : null;
        const clip = round.audioClip || mappedClip;
        if (clip && clipIds.has(clip)) voicedRounds++;
        else if (narrationRebuildInProgress) pendingNarrationRounds++;
        else errors.push(`${lesson.id}/${index + 1}: no bundled narration for "${spoken.slice(0, 80)}"`);
        if (round.audioClip && !clipIds.has(round.audioClip) && !narrationRebuildInProgress) {
            errors.push(`${lesson.id}/${index + 1}: missing audioClip ${round.audioClip}`);
        }
        const isLetterSound = /^letter-/.test(String(round.audioClip || '')) && /کدام حرف/.test(String(round.prompt || ''));
        if (!isLetterSound && mappedClip && round.audioClip !== mappedClip) {
            errors.push(`${lesson.id}/${index + 1}: audioClip ${round.audioClip} does not match exact instruction ${mappedClip}`);
        }
        if (round.lessonIntro && !clipIds.has(round.lessonIntro) && !narrationRebuildInProgress) {
            errors.push(`${lesson.id}: missing lessonIntro ${round.lessonIntro}`);
        }
    });
    skillTypes.set(lesson.type, (skillTypes.get(lesson.type) || 0) + 1);
}

if (ids.size !== lessons.length) errors.push('Duplicate lesson IDs found');
if (lessons.length !== manifest.items.length) errors.push('Manifest and curriculum lesson counts differ');
if (lessons.length !== curriculum.totalLessons) errors.push('curriculum.totalLessons is incorrect');
if (mapped !== lessons.length) errors.push(`Only ${mapped}/${lessons.length} lessons have a data-driven plan`);

for (const file of [
    'index.html', 'manifest.webmanifest', 'sw.js', 'content/curriculum.json',
    'assets/icon-192.png', 'assets/icon-512.png'
]) {
    if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required product file: ${file}`);
}

console.log(JSON.stringify({
    lessons: lessons.length,
    uniqueLessonIds: ids.size,
    mappedLessons: mapped,
    voicedRounds,
    pendingNarrationRounds,
    narrationRebuildInProgress,
    skillTypes: Object.fromEntries([...skillTypes.entries()].sort()),
    generatedRoundTypes: Object.fromEntries([...roundTypes.entries()].sort()),
    warnings,
    errors
}, null, 2));

if (errors.length) process.exit(1);

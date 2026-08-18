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
    'src/data/world-data.js', 'src/core/config.js', 'src/core/mascot.js',
    'src/core/svg-art.js', 'src/activities/generator.js'
].forEach(file => require(path.join(root, file)));

const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content/content_manifest.json'), 'utf8'));
const lessons = curriculum.domains.flatMap(domain => domain.levels.flatMap(level => level.lessons));
const ids = new Set(lessons.map(lesson => lesson.id));
const roundTypes = new Map();
const skillTypes = new Map();
let mapped = 0;

for (const lesson of lessons) {
    const rounds = window.Generator.generate(lesson.id, lesson);
    if (!Array.isArray(rounds) || rounds.length !== 5) {
        errors.push(`${lesson.id}: expected exactly 5 rounds`);
        continue;
    }
    if (rounds.some(round => round.lessonId !== lesson.id || round.skillType !== lesson.type)) {
        errors.push(`${lesson.id}: metadata was not carried into every round`);
    } else {
        mapped++;
    }
    rounds.forEach(round => roundTypes.set(round.type, (roundTypes.get(round.type) || 0) + 1));
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
    skillTypes: Object.fromEntries([...skillTypes.entries()].sort()),
    generatedRoundTypes: Object.fromEntries([...roundTypes.entries()].sort()),
    warnings,
    errors
}, null, 2));

if (errors.length) process.exit(1);

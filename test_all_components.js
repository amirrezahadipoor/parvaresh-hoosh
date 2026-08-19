// Deterministic data, generator and renderer smoke tests; DOM behavior is covered by test_runtime.js
const fs = require('fs');

function createMockEl(tag) {
    const el = {
        tagName: (tag || 'DIV').toUpperCase(),
        className: '',
        style: { setProperty: () => {} },
        dataset: {},
        innerHTML: '',
        textContent: '',
        children: [],
        appendChild: (c) => el.children.push(c),
        addEventListener: () => {},
        removeEventListener: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false
        },
        querySelector: () => createMockEl('div'),
        querySelectorAll: () => [createMockEl('div')],
        animate: () => ({ onfinish: () => {} }),
        getContext: () => ({
            scale: () => {},
            clearRect: () => {},
            fillRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            fill: () => {},
            arc: () => {},
            closePath: () => {},
            strokeRect: () => {},
            setLineDash: () => {},
            fillText: () => {},
            strokeText: () => {},
            createRadialGradient: () => ({ addColorStop: () => {} })
        }),
        getBoundingClientRect: () => ({ left: 0, top: 0, right: 300, bottom: 300, width: 300, height: 300 })
    };
    return el;
}

global.window = global;
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.document = {
    querySelector: () => createMockEl('div'),
    querySelectorAll: () => [createMockEl('div')],
    createElement: (tag) => createMockEl(tag),
    addEventListener: () => {}
};

global.localStorage = {
    _data: {},
    getItem: (k) => global.localStorage._data[k] || null,
    setItem: (k, v) => { global.localStorage._data[k] = v; },
    removeItem: (k) => { delete global.localStorage._data[k]; }
};

// Load data files
require('./src/data/alphabet.js');
require('./src/data/words.js');
require('./src/data/math-data.js');
require('./src/data/world-data.js');
require('./src/data/curriculum.js');
require('./src/data/lesson-packages.js');
// generator.js consults window.NARRATION_MAP to decide whether a round already
// has its own voiced instruction, so the harness must load it like the page does.
require('./src/data/narration-map.js');

// Load core files
require('./src/core/config.js');
require('./src/core/icons.js');
require('./src/core/audio.js');
require('./src/core/storage.js');
require('./src/core/game-progress.js');
require('./src/core/adaptive.js');
require('./src/core/iq-assessment.js');
require('./src/core/living-world.js');
require('./src/core/mascot.js');
require('./src/core/svg-art.js');
require('./src/core/fx.js');
require('./src/core/nav.js');

// Load activities & adventure & arcade & IQ engines
require('./src/activities/generator.js');
require('./src/activities/adventure-journey.js');
require('./src/activities/arcade-games.js');
require('./src/activities/iq-engines.js');
require('./src/activities/quiz.js');
require('./src/activities/memory.js');
require('./src/activities/dragdrop.js');
require('./src/activities/tracing.js');
require('./src/activities/ordering.js');
require('./src/activities/painting.js');
require('./src/activities/balloon-pop.js');

global.AudioEngine = window.AudioEngine;
global.Mascot = window.Mascot;
global.SvgArt = window.SvgArt;
global.IQAssessment = window.IQAssessment;
global.AdventureJourney = window.AdventureJourney;
global.ArcadeGames = window.ArcadeGames;
global.IQEngines = window.IQEngines;
global.QuizActivity = window.QuizActivity;
global.MemoryActivity = window.MemoryActivity;
global.DragDropActivity = window.DragDropActivity;
global.TracingActivity = window.TracingActivity;
global.OrderingActivity = window.OrderingActivity;
global.PaintingActivity = window.PaintingActivity;
global.BalloonPopActivity = window.BalloonPopActivity;

console.log('All modules loaded without error!');

// Test IQ Assessment & Radar Chart
const iqReport = IQAssessment.getReport();
console.log(`IQ Assessment: Overall Index ${iqReport.overallIQ}, Mental Age: ${iqReport.estimatedMentalAge}`);
const canvasMock = createMockEl('canvas');
IQAssessment.drawRadarChart(canvasMock);
console.log('Radar chart canvas rendered without error!');

// Test Adventure Journey
const nodes = AdventureJourney.getNodes();
console.log(`Adventure Journey: ${nodes.length} progressive milestones configured.`);

// Test Arcade Games
const arcadeList = ArcadeGames.list();
console.log(`Arcade Games: ${arcadeList.length} endless games available.`);

for (const game of arcadeList) {
    const dummyDiv = createMockEl('div');
    ArcadeGames.openGame(game.id, dummyDiv, () => {});
}
console.log('All arcade games rendered without error!');

// Test All 142 Curriculum Lessons
const manifest = JSON.parse(fs.readFileSync('./content/content_manifest.json', 'utf8'));
const curriculum = JSON.parse(fs.readFileSync('./content/curriculum.json', 'utf8'));
let passed = 0;
const errors = [];
const knownTypes = new Set([
    'quiz', 'memory', 'drag-match', 'tracing', 'order-steps', 'order-size',
    'painting', 'balloon-pop', 'raven-matrix', 'shadow-match', 'simon-memory',
    'disappeared-item', 'balance-scale'
]);
const curriculumIds = new Set((curriculum.domains || []).flatMap(domain =>
    (domain.levels || []).flatMap(level => (level.lessons || []).map(lesson => lesson.id))
));
if (curriculumIds.size !== manifest.items.length || curriculumIds.size !== curriculum.totalLessons) {
    errors.push(`Curriculum count mismatch: ${curriculumIds.size} generated IDs, ${manifest.items.length} manifest items.`);
}
if (!window.CURRICULUM || window.CURRICULUM.domains.length !== curriculum.domains.length) {
    errors.push('Bundled curriculum fallback is missing or incomplete.');
}

function validateRound(round, lessonId) {
    if (!round || !knownTypes.has(round.type)) {
        errors.push(`Lesson ${lessonId} has unknown round type: ${round && round.type}`);
        return;
    }
    if (round.type === 'quiz') {
        if (!Array.isArray(round.options) || round.options.length < 2 || !Number.isInteger(round.answer) || round.answer < 0 || round.answer >= round.options.length) {
            errors.push(`Lesson ${lessonId} has an invalid quiz answer/options pair.`);
        }
        // Android-first UI invariants: every quiz round must have a center visual and
        // every option must carry an icon (SVG) or a text label.
        if (!round.img) errors.push(`Lesson ${lessonId} quiz round has an empty visual stage (no img).`);
        (round.options || []).forEach((opt, idx) => {
            if (!opt.img && !opt.label) errors.push(`Lesson ${lessonId} quiz option ${idx} has neither icon nor label.`);
            if (opt.img && typeof opt.img !== 'string') errors.push(`Lesson ${lessonId} quiz option ${idx} has a non-string icon.`);
            if (!opt.img && opt.label && !String(opt.label).trim()) errors.push(`Lesson ${lessonId} quiz option ${idx} has an empty label.`);
        });
    } else if (round.type === 'memory') {
        const cards = round.cards || [];
        const pairs = new Set(cards.map(card => card.pair));
        if (!cards.length || cards.length % 2 || pairs.size * 2 !== cards.length) errors.push(`Lesson ${lessonId} has invalid memory cards.`);
    } else if (round.type === 'drag-match') {
        const targets = new Set((round.targets || []).map(target => target.id));
        if (!targets.size || !(round.items || []).length || (round.items || []).some(item => !targets.has(item.target))) {
            errors.push(`Lesson ${lessonId} has invalid drag/drop targets.`);
        }
    } else if (round.type === 'order-steps' || round.type === 'order-size') {
        const items = round.items || [];
        if (items.length < 2 || !['idx', 'size'].includes(round.answer)) errors.push(`Lesson ${lessonId} has invalid ordering data.`);
        if (round.answer === 'idx' && new Set(items.map(item => item.idx)).size !== items.length) errors.push(`Lesson ${lessonId} has duplicate ordering indices.`);
    } else if (round.type === 'raven-matrix') {
        if ((round.grid || []).length !== 3 || !(round.options || []).length || !Number.isInteger(round.answer)) errors.push(`Lesson ${lessonId} has invalid Raven data.`);
    } else if (round.type === 'shadow-match') {
        if (!round.originalImg || !(round.shadowOptions || []).length || !Number.isInteger(round.answer)) errors.push(`Lesson ${lessonId} has invalid shadow data.`);
    } else if (round.type === 'simon-memory') {
        if (!Number.isInteger(round.length) || round.length < 2) errors.push(`Lesson ${lessonId} has invalid Simon length.`);
    } else if (round.type === 'balance-scale') {
        if (!(round.leftCount > 0) || !(round.rightCount > 0) || round.leftCount === round.rightCount) errors.push(`Lesson ${lessonId} has invalid balance data.`);
    }
}

for (const item of manifest.items) {
    try {
        const rounds = Generator.generate(item.id, item);
        if (!Array.isArray(rounds) || rounds.length === 0) {
            errors.push(`Lesson ${item.id} returned empty rounds!`);
            continue;
        }

        for (const round of rounds) {
            validateRound(round, item.id);
            const container = createMockEl('div');
            let renderer = null;
            switch (round.type) {
                case 'quiz': renderer = QuizActivity; break;
                case 'memory': renderer = MemoryActivity; break;
                case 'drag-match': renderer = DragDropActivity; break;
                case 'tracing': renderer = TracingActivity; break;
                case 'order-steps':
                case 'order-size': renderer = OrderingActivity; break;
                case 'painting': renderer = PaintingActivity; break;
                case 'balloon-pop': renderer = BalloonPopActivity; break;
                case 'raven-matrix': renderer = IQEngines.RavenMatrixActivity; break;
                case 'shadow-match': renderer = IQEngines.ShadowMatchActivity; break;
                case 'simon-memory': renderer = IQEngines.SimonSequenceActivity; break;
                case 'disappeared-item': renderer = IQEngines.DisappearedItemActivity; break;
                case 'balance-scale': renderer = IQEngines.BalanceScaleActivity; break;
                default: renderer = null; break;
            }
            if (!renderer) continue;
            renderer.render(container, round, { onCorrect: () => {}, onWrong: () => {} });
        }
        passed++;
    } catch (err) {
        errors.push(`Lesson ${item.id} error: ${err.message}`);
    }
}

console.log(`\nResults: ${passed} of ${manifest.items.length} lessons generated and structurally validated.`);

// Test all 5 Mascot characters
const characters = Mascot.listCharacters();
console.log(`\nTesting ${characters.length} Mascot Characters:`);
characters.forEach(c => {
    ['happy', 'thinking', 'celebrating'].forEach(m => {
        const str = Mascot.svg(80, m, c.id);
        if (!str.includes('<svg')) errors.push(`Character ${c.id} mood ${m} failed!`);
    });
    console.log(`- Character ${c.name}: OK`);
});

if (errors.length > 0) {
    console.error('Errors:', errors);
    process.exit(1);
} else {
    console.log('\nSUCCESS: curriculum data, generated rounds, SVG assets, IQ engines and arcade render smoke checks passed.');
    process.exit(0);
}

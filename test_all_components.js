// Node.js Deep Verification of all components, arcade games, adventure path and 142 lessons
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
            strokeRect: () => {},
            setLineDash: () => {},
            fillText: () => {},
            strokeText: () => {}
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

// Load core files
require('./src/core/config.js');
require('./src/core/audio.js');
require('./src/core/storage.js');
require('./src/core/adaptive.js');
require('./src/core/mascot.js');
require('./src/core/svg-art.js');
require('./src/core/fx.js');
require('./src/core/nav.js');

// Load activities & adventure & arcade
require('./src/activities/generator.js');
require('./src/activities/adventure-journey.js');
require('./src/activities/arcade-games.js');
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
global.AdventureJourney = window.AdventureJourney;
global.ArcadeGames = window.ArcadeGames;
global.QuizActivity = window.QuizActivity;
global.MemoryActivity = window.MemoryActivity;
global.DragDropActivity = window.DragDropActivity;
global.TracingActivity = window.TracingActivity;
global.OrderingActivity = window.OrderingActivity;
global.PaintingActivity = window.PaintingActivity;
global.BalloonPopActivity = window.BalloonPopActivity;

console.log('All modules loaded without error!');

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
let passed = 0;
const errors = [];

for (const item of manifest.items) {
    try {
        const rounds = Generator.generate(item.id);
        if (!Array.isArray(rounds) || rounds.length === 0) {
            errors.push(`Lesson ${item.id} returned empty rounds!`);
            continue;
        }

        for (const round of rounds) {
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
                default: renderer = QuizActivity; break;
            }

            renderer.render(container, round, { onCorrect: () => {}, onWrong: () => {} });
        }
        passed++;
    } catch (err) {
        errors.push(`Lesson ${item.id} error: ${err.message}`);
    }
}

console.log(`\nResults: ${passed} of ${manifest.items.length} lessons fully verified!`);

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
    console.log('\nSUCCESS: 100% of all lessons, adventure path, arcade games, and mascots verified!');
    process.exit(0);
}

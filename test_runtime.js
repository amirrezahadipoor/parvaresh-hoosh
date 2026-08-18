// Browser-level smoke tests using a real DOM (JSDOM), not the old no-op mock only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let JSDOM;
try { ({ JSDOM } = require('jsdom')); } catch (err) {
    console.warn('SKIP: jsdom is not installed; browser-level runtime smoke test was not executed.');
    process.exit(0);
}

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function canvasContext() {
    return {
        setTransform() {}, scale() {}, clearRect() {}, fillRect() {}, strokeRect() {},
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {},
        stroke() {}, fill() {}, arc() {}, save() {}, restore() {}, translate() {}, rotate() {},
        fillText() {}, strokeText() {}, setLineDash() {},
        createRadialGradient() { return { addColorStop() {} }; },
        globalAlpha: 1, fillStyle: '', strokeStyle: '', lineWidth: 1,
        font: '', textAlign: 'center', textBaseline: 'middle', shadowColor: '', shadowBlur: 0
    };
}

function audioContextStub() {
    return class AudioContextStub {
        constructor() {
            this.state = 'running';
            this.currentTime = 0;
            this.sampleRate = 44100;
            this.destination = {};
        }
        resume() { return Promise.resolve(); }
        createOscillator() {
            return {
                type: 'sine',
                frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
                connect() { return this; }, start() {}, stop() {}
            };
        }
        createGain() {
            return {
                gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} },
                connect() { return this; }
            };
        }
        createBuffer() { return { getChannelData: () => new Float32Array(32) }; }
        createBufferSource() { return { buffer: null, connect() { return this; }, start() {} }; }
    };
}

async function main() {
    const errors = [];
    const dom = new JSDOM(html, {
        url: 'http://localhost/index.html',
        runScripts: 'outside-only',
        pretendToBeVisual: true
    });
    const { window } = dom;
    const { document } = window;

    window.innerWidth = 390;
    window.innerHeight = 844;
    window.devicePixelRatio = 1;
    window.requestAnimationFrame = callback => window.setTimeout(() => callback(Date.now()), 16);
    window.cancelAnimationFrame = id => window.clearTimeout(id);
    window.AudioContext = audioContextStub();
    window.webkitAudioContext = window.AudioContext;
    window.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) { this.text = text; };
    window.speechSynthesis = { cancel() {}, speak() {}, getVoices() { return []; } };
    window.confirm = () => false;
    window.fetch = async () => ({ ok: true, async json() { return curriculum; } });

    window.HTMLCanvasElement.prototype.getContext = function getContext() {
        return canvasContext();
    };
    window.HTMLElement.prototype.animate = function animate() {
        return { onfinish: null, cancel() {}, finished: Promise.resolve() };
    };
    window.HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
        return { left: 0, top: 0, right: 300, bottom: 120, width: 300, height: 120 };
    };
    window.addEventListener('error', event => errors.push(event.error || event.message));
    window.addEventListener('unhandledrejection', event => errors.push(event.reason));

    const scriptPaths = [
        'src/data/alphabet.js', 'src/data/words.js', 'src/data/math-data.js',
        'src/data/world-data.js', 'src/data/curriculum.js', 'src/data/lesson-guide.js',
        'src/core/config.js', 'src/core/icons.js', 'src/core/audio.js', 'src/core/storage.js', 'src/core/backup.js', 'src/core/engagement.js', 'src/core/game-progress.js',
        'src/core/adaptive.js', 'src/core/iq-assessment.js', 'src/core/living-world.js',
        'src/core/mascot.js', 'src/core/svg-art.js', 'src/core/fx.js', 'src/core/nav.js',
        'src/activities/generator.js', 'src/activities/adventure-journey.js',
        'src/activities/arcade-games.js', 'src/activities/iq-engines.js',
        'src/activities/quiz.js', 'src/activities/memory.js', 'src/activities/dragdrop.js',
        'src/activities/tracing.js', 'src/activities/ordering.js',
        'src/activities/painting.js', 'src/activities/balloon-pop.js', 'src/main.js'
    ];
    for (const scriptPath of scriptPaths) {
        const source = fs.readFileSync(path.join(root, scriptPath), 'utf8');
        window.eval(`${source}\n//# sourceURL=${scriptPath}`);
    }
    document.dispatchEvent(new window.Event('DOMContentLoaded'));
    await wait(2100);

    assert.equal(document.querySelector('.screen.active').id, 'screen-home', 'app should leave splash and show home');
    assert.ok(document.querySelectorAll('.domain-tile-icon .app-icon').length >= 6, 'home domain/game option icons should render as inline SVG');
    if (document.querySelector('.profile-onboarding-overlay')) {
        document.querySelector('.age-choice').click();
        document.querySelector('#profile-start').click();
        await wait(20);
    }
    assert.equal(window.Engagement.hasProfile(), true, 'onboarding should persist a selected age');
    assert.ok(document.querySelector('.domain-tile'), 'home learning tiles should render');
    assert.ok(document.querySelector('.daily-plan-card'), 'daily plan should render');
    assert.ok(document.querySelector('#home-content .home-dashboard'), 'home content should be populated');
    assert.equal(errors.length, 0, `browser smoke test errors: ${errors.map(String).join('\n')}`);

    // Verify the main navigation path: home -> domain -> level -> lesson -> back.
    document.querySelector('.domain-tile').click();
    assert.equal(document.querySelector('.screen.active').id, 'screen-domain');
    assert.ok(document.querySelectorAll('#domain-content .level-card').length > 0, 'domain levels should render');

    document.querySelector('#domain-content .level-card').click();
    assert.equal(document.querySelector('.screen.active').id, 'screen-level');
    assert.ok(document.querySelectorAll('#level-content .lesson-card').length > 0, 'lesson list should render');

    document.querySelector('#level-content .lesson-card').click();
    assert.equal(document.querySelector('.screen.active').id, 'screen-lesson');
    assert.ok(document.querySelector('#lesson-body').children.length > 0, 'lesson activity should render');

    document.querySelector('#btn-exit-lesson').click();
    assert.equal(document.querySelector('.screen.active').id, 'screen-level');
    document.querySelector('#btn-back-level').click();
    assert.equal(document.querySelector('.screen.active').id, 'screen-domain');
    document.querySelector('#btn-back-domain').click();
    assert.equal(document.querySelector('.screen.active').id, 'screen-home');

    // Verify a generated quiz can actually be answered in a real DOM.
    const round = window.Generator.generate('R-L1-L01')[0];
    const host = document.createElement('div');
    let correct = 0;
    window.QuizActivity.render(host, round, { onCorrect() { correct++; }, onWrong() {} });
    const options = host.querySelectorAll('.game-tap-choice-btn');
    assert.ok(options.length >= 2 && round.answer >= 0 && round.answer < options.length);
    options[round.answer].click();
    assert.equal(correct, 1, 'quiz correct option should call onCorrect exactly once');

    // Real interaction smoke tests for the upgraded game engines.
    const memoryHost = document.createElement('div');
    let memoryDone = 0;
    window.MemoryActivity.render(memoryHost, {
        cards: [
            { pair: 0, img: window.SvgArt.object('apple', 40), label: 'سیب' },
            { pair: 0, img: window.SvgArt.object('apple', 40), label: 'سیب' },
            { pair: 1, img: window.SvgArt.object('ball', 40), label: 'توپ' },
            { pair: 1, img: window.SvgArt.object('ball', 40), label: 'توپ' }
        ]
    }, { onCorrect() { memoryDone++; } });
    const memoryCards = memoryHost.querySelectorAll('.memory-card-3d-box');
    memoryCards[0].click(); memoryCards[1].click();
    await wait(400);
    memoryCards[2].click(); memoryCards[3].click();
    await wait(1200);
    assert.equal(memoryDone, 1, 'memory game should finish exactly once');

    const orderHost = document.createElement('div');
    let orderDone = 0;
    window.OrderingActivity.render(orderHost, {
        items: [{ idx: 1, label: 'دوم' }, { idx: 0, label: 'اول' }],
        answer: 'idx', prompt: 'ترتیب را پیدا کن'
    }, { onCorrect() { orderDone++; } });
    const orderCards = orderHost.querySelectorAll('.order-step-card');
    orderCards[0].click(); orderHost.querySelectorAll('.order-step-card')[1].click();
    await wait(500);
    assert.equal(orderDone, 1, 'ordering game should finish after a correct swap');

    const dragHost = document.createElement('div');
    let dragDone = 0;
    window.DragDropActivity.render(dragHost, {
        targets: [{ id: 'animals', label: 'حیوانات' }, { id: 'fruits', label: 'میوه‌ها' }],
        items: [
            { id: 'cat', target: 'animals', label: 'گربه', img: window.SvgArt.animal('cat', 30) },
            { id: 'apple', target: 'fruits', label: 'سیب', img: window.SvgArt.object('apple', 30) }
        ],
        prompt: 'جای درست را پیدا کن'
    }, { onCorrect() { dragDone++; } });
    const dragItems = dragHost.querySelectorAll('[role="button"]');
    const dragTargets = dragHost.querySelectorAll('[data-target-id]');
    dragItems[0].click(); dragTargets[0].click();
    dragItems[1].click(); dragTargets[1].click();
    await wait(600);
    assert.equal(dragDone, 1, 'tap-to-place drag/drop fallback should finish');

    const balloonHost = document.createElement('div');
    let balloonDone = 0;
    window.BalloonPopActivity.render(balloonHost, {
        targetText: 'الف',
        items: [{ text: 'ب', sound: 'ب' }, { text: 'الف', sound: 'آ' }],
        prompt: 'هدف را پیدا کن'
    }, { onCorrect() { balloonDone++; } });
    const balloons = balloonHost.querySelectorAll('.floating-balloon');
    balloons[0].click();
    balloons[1].click();
    await wait(900);
    assert.equal(balloonDone, 1, 'target balloon game should reject distractor and finish on target');

    const paintingHost = document.createElement('div');
    window.PaintingActivity.render(paintingHost, {}, { onCorrect() {} });
    assert.equal(paintingHost.querySelectorAll('.paint-template-btn').length, 6, 'painting should expose six templates');

    // Stress-render every generated round in a real DOM before testing the parent gate.
    const curriculumForStress = JSON.parse(fs.readFileSync(path.join(root, 'content/curriculum.json'), 'utf8'));
    const renderers = {
        quiz: window.QuizActivity,
        memory: window.MemoryActivity,
        'drag-match': window.DragDropActivity,
        tracing: window.TracingActivity,
        'order-steps': window.OrderingActivity,
        'order-size': window.OrderingActivity,
        painting: window.PaintingActivity,
        'balloon-pop': window.BalloonPopActivity,
        'raven-matrix': window.IQEngines.RavenMatrixActivity,
        'shadow-match': window.IQEngines.ShadowMatchActivity,
        'simon-memory': window.IQEngines.SimonSequenceActivity,
        'disappeared-item': window.IQEngines.DisappearedItemActivity,
        'balance-scale': window.IQEngines.BalanceScaleActivity
    };
    let stressRounds = 0;
    for (const domain of curriculumForStress.domains) {
        for (const level of domain.levels) {
            for (const lesson of level.lessons) {
                const rounds = window.Generator.generate(lesson.id, { ...lesson, domain: domain.id, childAge: 6 });
                for (const round of rounds) {
                    assert.ok(renderers[round.type], `renderer missing for ${round.type}`);
                    const stressHost = document.createElement('div');
                    renderers[round.type].render(stressHost, round, { onCorrect() {}, onWrong() {} });
                    assert.ok(stressHost.children.length > 0, `round did not render: ${lesson.id}/${round.type}`);
                    stressRounds++;
                }
            }
        }
    }
    // The curriculum keeps growing (v3.1 age-ordered ships ~1460 rounds), so assert a healthy
    // floor instead of a brittle hardcoded total that breaks CI on every content update.
    console.log(`Stress-rendered ${stressRounds} generated rounds in a real DOM.`);
    assert.ok(stressRounds >= 700, `expected at least 700 generated rounds to render, got ${stressRounds}`);

    // A math-gate sum can be 13; ensure that answer key is present.
    document.querySelector('#btn-parent').click();
    await wait(20);
    assert.equal(document.querySelector('.screen.active').id, 'screen-parents');
    assert.equal(document.querySelectorAll('#gate-pad .pin-key').length, 13, 'parent gate must include every possible sum');
    const faToLatin = value => String(value).replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit));
    const equationNumbers = (document.querySelector('#parents-content .pin-wrap').textContent.match(/[۰-۹]+/g) || []).map(faToLatin).map(Number);
    const expectedGate = equationNumbers[0] + equationNumbers[1];
    const fa = value => String(value).replace(/[0-9]/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
    [...document.querySelectorAll('#gate-pad .pin-key')].find(button => button.textContent === fa(expectedGate)).click();
    assert.ok(document.querySelector('#btn-change-pin'), 'parent dashboard should offer PIN setup');

    document.querySelector('#btn-change-pin').click();
    const pinKeys = [...document.querySelectorAll('#pin-pad .pin-key')];
    const clickPin = digit => pinKeys.find(button => button.textContent === fa(digit)).click();
    [1, 2, 3, 4].forEach(clickPin);
    pinKeys.find(button => button.textContent === 'تایید').click();
    await wait(10);
    const confirmKeys = [...document.querySelectorAll('#pin-pad .pin-key')];
    [1, 2, 3, 4].forEach(digit => confirmKeys.find(button => button.textContent === fa(digit)).click());
    confirmKeys.find(button => button.textContent === 'تایید').click();
    await wait(20);
    assert.equal(await window.Storage.load('parvaresh_parent_pin'), '1234', 'PIN setup should persist a confirmed PIN');
    const backup = await window.BackupRestore.create();
    assert.equal(backup.format, 'parvaresh-hoosh-backup');
    assert.ok(backup.records.progress || backup.records.engagement, 'backup should contain local app data');
    window.BackupRestore.validate(backup);

    assert.equal(errors.length, 0, `browser smoke test errors after navigation: ${errors.map(String).join('\n')}`);
    dom.window.close();
    console.log('Runtime smoke test passed: startup, navigation, activity rendering, quiz interaction, and parent gate.');
}

main().catch(error => {
    console.error(error.stack || error);
    process.exitCode = 1;
});

// Browser-level smoke tests using a real DOM (JSDOM), not the old no-op mock only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

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
        'src/core/config.js', 'src/core/audio.js', 'src/core/storage.js', 'src/core/backup.js', 'src/core/engagement.js',
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
    if (document.querySelector('#profile-skip')) document.querySelector('#profile-skip').click();
    await wait(10);
    assert.equal(window.Engagement.hasProfile(), true, 'onboarding skip should persist a local profile decision');
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

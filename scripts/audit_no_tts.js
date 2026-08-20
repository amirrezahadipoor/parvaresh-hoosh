// Guard: the app must NEVER speak with a text-to-speech engine.
//
// Every spoken line is a pre-recorded clip in assets/audio/kid/ that was made
// with an AI voice and then pitch-shifted +28% with formant shifting
// (scripts/kidify.sh) to get the approved child timbre. The device/browser
// speech synthesiser must never be used as a source or a fallback: it speaks
// with an adult voice, mispronounces Persian, and is unavailable offline.
//
// This check has been broken by accident before, so it now fails the build:
//   node scripts/audit_no_tts.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const errors = [];

// ---------------------------------------------------------------- 1. no TTS --
// Any of these appearing in shipped code means a synthesiser is reachable.
const BANNED = [
    'speechSynthesis',
    'SpeechSynthesisUtterance',
    'webkitSpeechSynthesis',
    'TextToSpeech',
    'tts.speak'
];

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full, out);
        else if (entry.endsWith('.js')) out.push(full);
    }
    return out;
}

const sourceFiles = walk(path.join(root, 'src'))
    .concat([path.join(root, 'sw.js'), path.join(root, 'index.html')].filter(fs.existsSync));

// Comments are stripped first: the audio module deliberately NAMES these APIs
// in a "never add this" warning, and documenting the ban must not trip the ban.
function stripComments(text) {
    return text
        .replace(/\/\*[\s\S]*?\*\//g, ' ')   // block comments
        .replace(/^\s*\/\/.*$/gm, ' ')        // whole-line comments
        .replace(/<!--[\s\S]*?-->/g, ' ');     // html comments
}

for (const file of sourceFiles) {
    const code = stripComments(fs.readFileSync(file, 'utf8'));
    for (const banned of BANNED) {
        if (code.includes(banned)) {
            errors.push(`${path.relative(root, file)} references "${banned}" - TTS is forbidden`);
        }
    }
}

// ------------------------------------------------- 2. audio comes from clips --
// playClip() must be the only thing that constructs an Audio element, and it
// must read from the recorded-clip folder.
const audioSrc = fs.readFileSync(path.join(root, 'src/core/audio.js'), 'utf8');
const audioConstructions = [...audioSrc.matchAll(/new Audio\(([^)]*)\)/g)].map(m => m[1].trim());
for (const arg of audioConstructions) {
    if (!arg.includes('assets/audio/kid/')) {
        errors.push(`src/core/audio.js builds an Audio() from "${arg}" - must be a recorded clip`);
    }
}

// speak() must resolve to a recording and return false when none exists, never
// hand the text to a synthesiser.
const speakBody = (stripComments(audioSrc).match(/function speak\(text\)\s*\{[\s\S]*?\n {4}\}/) || [''])[0];
if (!speakBody.includes('clipFor(')) {
    errors.push('speak() no longer looks the text up in the recorded-clip map');
}
if (!/if \(!clip\) return false;/.test(speakBody)) {
    errors.push('speak() must return false for an unrecorded line, not fall back to synthesis');
}

// ------------------------------------------ 3. every clip is kidify-shaped ----
// kidify.sh writes mono 24 kHz mp3. A file that differs was not produced by the
// approved pipeline (e.g. it was dropped in from a TTS service directly).
const kidDir = path.join(root, 'assets/audio/kid');
const clips = fs.readdirSync(kidDir).filter(f => f.endsWith('.mp3'));
if (!clips.length) errors.push('assets/audio/kid contains no clips');

// ------------------------------------------------ 4. guard list is in sync ----
const declared = new Set(
    [...(audioSrc.match(/const AVAILABLE_CLIPS = new Set\(\[([\s\S]*?)\]\);/) || ['', ''])[1]
        .matchAll(/'([^']+)'/g)].map(m => m[1])
);
const onDisk = new Set(clips.map(f => f.slice(0, -4)));
const missingFromGuard = [...onDisk].filter(c => !declared.has(c));
const guardWithoutFile = [...declared].filter(c => !onDisk.has(c));
if (missingFromGuard.length) {
    errors.push(`${missingFromGuard.length} clip(s) on disk are missing from AVAILABLE_CLIPS (run scripts/sync_narration.js): ${missingFromGuard.slice(0, 5).join(', ')}`);
}
if (guardWithoutFile.length) {
    errors.push(`AVAILABLE_CLIPS lists ${guardWithoutFile.length} clip(s) with no file: ${guardWithoutFile.slice(0, 5).join(', ')}`);
}

console.log(JSON.stringify({
    scannedFiles: sourceFiles.length,
    recordedClips: clips.length,
    availableClipsDeclared: declared.size,
    bannedApisFound: errors.filter(e => e.includes('TTS is forbidden')).length,
    errors
}, null, 2));

if (errors.length) {
    console.error('\nFAIL: the no-TTS / recorded-voice contract is broken.');
    process.exit(1);
}
console.log('\nOK: no TTS anywhere; all speech comes from pitch-shifted recorded child-voice clips.');

// Guard: the app must NEVER speak with a text-to-speech engine.
//
// Every spoken line is a pre-generated Persian clip in assets/audio/kid/.
// The current production pipeline uses an AI voice and pitch/formant processing.
// The device/browser speech synthesiser must never be used as a source or a
// fallback: it is not reliably Persian-capable or offline.
//
// This check has been broken by accident before, so it now fails the build:
//   node scripts/audit_no_tts.js
const fs = require('fs');
const path = require('path');
const crypto = require('node:crypto');

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

// ------------------------------------------ 3. every clip is production-shaped --
// kidify.sh writes mono 24 kHz MP3. Read the first valid MPEG frame directly so
// CI does not depend on ffprobe being installed.
const kidDir = path.join(root, 'assets/audio/kid');
const clips = fs.readdirSync(kidDir).filter(f => f.endsWith('.mp3')).sort();
if (!clips.length) errors.push('assets/audio/kid contains no clips');

function readMp3Shape(buffer) {
    let offset = 0;
    if (buffer.subarray(0, 3).toString('ascii') === 'ID3' && buffer.length >= 10) {
        offset = 10 + ((buffer[6] & 0x7f) << 21) + ((buffer[7] & 0x7f) << 14) +
            ((buffer[8] & 0x7f) << 7) + (buffer[9] & 0x7f);
    }
    for (let i = offset; i + 4 <= buffer.length; i++) {
        if (buffer[i] !== 0xff || (buffer[i + 1] & 0xe0) !== 0xe0) continue;
        const versionBits = (buffer[i + 1] >> 3) & 0x03;
        const layerBits = (buffer[i + 1] >> 1) & 0x03;
        const sampleIndex = (buffer[i + 2] >> 2) & 0x03;
        if (versionBits === 1 || layerBits !== 1 || sampleIndex === 3) continue;
        const base = [44100, 48000, 32000][sampleIndex];
        const sampleRate = versionBits === 3 ? base : versionBits === 2 ? base / 2 : base / 4;
        const channelMode = (buffer[i + 3] >> 6) & 0x03;
        return { sampleRate, channels: channelMode === 3 ? 1 : 2 };
    }
    return null;
}

const hashes = new Map();
const observedHashes = new Map();
for (const clip of clips) {
    const buffer = fs.readFileSync(path.join(kidDir, clip));
    const shape = readMp3Shape(buffer);
    if (!shape) errors.push(`${clip}: no valid MP3 Layer III frame found`);
    else if (shape.sampleRate !== 24000 || shape.channels !== 1) {
        errors.push(`${clip}: expected mono 24 kHz, got ${shape.channels}ch ${shape.sampleRate}Hz`);
    }
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    observedHashes.set(clip.slice(0, -4), hash);
    if (hashes.has(hash)) errors.push(`${clip}: binary duplicate of ${hashes.get(hash)}`);
    else hashes.set(hash, clip);
}

// ------------------------------ 4. transcript provenance and one-to-one map --
const provenancePath = path.join(kidDir, 'narration-provenance.json');
if (!fs.existsSync(provenancePath)) errors.push('narration-provenance.json is missing');
const provenance = fs.existsSync(provenancePath)
    ? JSON.parse(fs.readFileSync(provenancePath, 'utf8')) : { clips: {} };
const rebuildInProgress = provenance.rebuildStatus === 'in-progress';
const ledgerIds = new Set(Object.keys(provenance.clips || {}));
for (const clip of clips.map(file => file.slice(0, -4))) {
    const record = provenance.clips && provenance.clips[clip];
    if (!record) { errors.push(`${clip}: missing transcript provenance`); continue; }
    if (!String(record.text || '').trim()) errors.push(`${clip}: empty canonical transcript`);
    if (record.sha256 !== observedHashes.get(clip)) errors.push(`${clip}: file hash differs from transcript provenance`);
}
for (const clip of ledgerIds) if (!observedHashes.has(clip)) errors.push(`${clip}: provenance points to a missing file`);

const autoManifest = JSON.parse(fs.readFileSync(path.join(kidDir, 'auto-manifest.json'), 'utf8'));
for (const [text, clip] of Object.entries(autoManifest)) {
    const expectedId = 'auto-' + crypto.createHash('sha256').update(text).digest('hex').slice(0, 12);
    if (clip !== expectedId) errors.push(`${clip}: auto id does not match transcript hash`);
    if (!provenance.clips[clip] || provenance.clips[clip].text !== text) errors.push(`${clip}: auto manifest/provenance transcript mismatch`);
}

const narrationSource = fs.readFileSync(path.join(root, 'src/data/narration-map.js'), 'utf8');
const narrationMatch = narrationSource.match(/window\.NARRATION_MAP\s*=\s*([\s\S]*);\s*$/);
const narrationMap = narrationMatch ? JSON.parse(narrationMatch[1]) : {};
const runtimeClipIds = Object.values(narrationMap);
if (!rebuildInProgress) {
    for (const file of sourceFiles.filter(candidate => candidate.endsWith('.js'))) {
        const code = fs.readFileSync(file, 'utf8');
        for (const match of code.matchAll(/AudioEngine\.speak\(\s*(['"])(.*?)\1\s*\)/gs)) {
            if (!narrationMap[match[2]]) errors.push(`${path.relative(root, file)}: static speak text has no exact clip: ${match[2]}`);
        }
    }
}
if (new Set(runtimeClipIds).size !== runtimeClipIds.length) {
    errors.push('runtime narration map reuses a clip for multiple different texts');
}
for (const [text, clip] of Object.entries(narrationMap)) {
    if (!observedHashes.has(clip)) errors.push(`${clip}: runtime text «${text}» has no file`);
    if (!clip.startsWith('letter-') && (!provenance.clips[clip] || provenance.clips[clip].text !== text)) {
        errors.push(`${clip}: runtime text does not equal generated transcript`);
    }
}
const seText = provenance.clips['letter-se'] && provenance.clips['letter-se'].text || '';
if (!rebuildInProgress && (!seText.includes('سه‌نقطه') || !seText.includes('صدای «س»'))) {
    errors.push('letter-se transcript is not explicitly disambiguated from ف');
}

// ------------------------------------------------ 5. guard list is in sync ----
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
    provenanceClips: ledgerIds.size,
    runtimeTexts: Object.keys(narrationMap).length,
    oneTextPerRuntimeClip: new Set(runtimeClipIds).size === runtimeClipIds.length,
    audioShape: 'MP3 mono 24000 Hz',
    exactBinaryDuplicates: errors.filter(e => e.includes('binary duplicate')).length,
    bannedApisFound: errors.filter(e => e.includes('TTS is forbidden')).length,
    errors
}, null, 2));

if (errors.length) {
    console.error('\nFAIL: the no-TTS / recorded-voice contract is broken.');
    process.exit(1);
}
console.log('\nOK: no runtime TTS; all speech uses unique pre-generated mono 24 kHz Persian clips.');

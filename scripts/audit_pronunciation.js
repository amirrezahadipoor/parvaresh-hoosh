#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'assets/audio/kid/narration-provenance.json'), 'utf8'));
const records = Object.entries(ledger.clips || {});
const errors = [];
const forbidden = [
    [/[A-Za-z]/, 'Latin letters'], [/[0-9]/, 'ASCII digits'], [/[يك]/, 'Arabic yeh/kaf'],
    [/\uFFFD/, 'replacement character'], [/ـ/, 'tatweel'], [/ {2,}/, 'double spaces'],
    [/ چی غذا بدیم؟/, 'colloquial food prompt'], [/ تا هدیه داخل واگن قطار بذار!/, 'colloquial train prompt'],
    [/هر چی دوست داری/, 'colloquial painting prompt'], [/بزرگتر مهربان/, 'missing Persian half-space']
];

for (const [clip, record] of records) {
    const text = String(record.text || '');
    if (text.normalize('NFC') !== text) errors.push(`${clip}: transcript is not NFC-normalized`);
    for (const [pattern, label] of forbidden) if (pattern.test(text)) errors.push(`${clip}: ${label}: ${text}`);
    if (/^[\s\p{P}\p{N}]*$/u.test(text)) errors.push(`${clip}: transcript has no spoken Persian word`);
}

const requiredLetterPhrases = {
    'letter-se': ['ثِ سه‌نقطه', 'صدای «س»'],
    'letter-he': ['حِ جیمی', 'صدای «ه»'],
    'letter-zal': ['ذال', 'صدای «ز»'],
    'letter-sad': ['صاد', 'صدای «س»'],
    'letter-zad': ['ضاد', 'صدای «ز»'],
    'letter-ta': ['طا', 'صدای «ت»'],
    'letter-za': ['ظا', 'صدای «ز»'],
    'letter-heh': ['هِ دوچشم', 'صدای «ه»']
};
for (const [clip, phrases] of Object.entries(requiredLetterPhrases)) {
    const text = ledger.clips[clip] && ledger.clips[clip].text || '';
    for (const phrase of phrases) if (!text.includes(phrase)) errors.push(`${clip}: missing pronunciation phrase ${phrase}`);
}

console.log(JSON.stringify({
    clipsChecked: records.length,
    voice: ledger.voice,
    rate: ledger.rate,
    pitch: ledger.pitch,
    normalization: 'NFC',
    explicitHomophoneLetterRules: Object.keys(requiredLetterPhrases).length,
    errors
}, null, 2));
if (errors.length) process.exit(1);
console.log('OK: Persian transcripts are normalized, formal, digit-safe, and ambiguous letter sounds are explicitly disambiguated.');

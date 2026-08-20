#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const packageJson = JSON.parse(read('package.json'));
const manifest = JSON.parse(read('manifest.webmanifest'));
const sw = read('sw.js');
const index = read('index.html');

assert.ok(sw.includes(`const CACHE_NAME = 'parvaresh-hoosh-v${packageJson.version}'`), 'service-worker cache version drift');
const listMatch = sw.match(/const PRECACHE\s*=\s*\[([\s\S]*?)\n\];/);
assert.ok(listMatch, 'PRECACHE array is missing');
const entries = [...listMatch[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
assert.equal(new Set(entries).size, entries.length, 'duplicate service-worker precache entries');

const missing = [];
for (const entry of entries) {
    if (entry === './') continue;
    const relative = entry.replace(/^\.\//, '');
    if (!fs.existsSync(path.join(root, relative))) missing.push(relative);
}
assert.deepEqual(missing, [], 'service-worker references missing files');
assert.ok(entries.includes('./index.html'), 'offline shell omits index.html');
assert.ok(entries.includes('./content/curriculum.json'), 'offline shell omits curriculum');

assert.equal(manifest.lang, 'fa-IR');
assert.equal(manifest.dir, 'rtl');
assert.equal(manifest.display, 'standalone');
for (const icon of manifest.icons || []) {
    assert.ok(fs.existsSync(path.join(root, icon.src.replace(/^\.\//, ''))), `manifest icon missing: ${icon.src}`);
}

const refs = [...index.matchAll(/(?:src|href)="([^"#?]+)"/g)].map(match => match[1]);
const localRefs = refs.filter(ref => !/^(?:https?:|data:|blob:)/.test(ref));
const missingRefs = localRefs.filter(ref => !fs.existsSync(path.join(root, ref.replace(/^\.\//, ''))));
assert.deepEqual(missingRefs, [], 'index references missing local assets');
const uncachedRefs = localRefs.filter(ref => !entries.includes(`./${ref.replace(/^\.\//, '')}`));
assert.deepEqual(uncachedRefs, [], 'cold offline shell omits index dependencies');
assert.match(index, /navigator\.serviceWorker|src\/main\.js/, 'application bootstrap is missing');

console.log(JSON.stringify({
    cacheName: `parvaresh-hoosh-v${packageJson.version}`,
    precacheEntries: entries.length,
    manifestIcons: manifest.icons.length,
    indexLocalReferences: refs.length,
    missing: 0,
    errors: []
}, null, 2));

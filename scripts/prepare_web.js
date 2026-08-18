#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'www');
const entries = [
  'index.html', 'manifest.webmanifest', 'sw.js', 'privacy.html', 'terms.html',
  'src', 'assets', 'content', 'vendor'
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const entry of entries) {
  const from = path.join(root, entry);
  const to = path.join(output, entry);
  if (!fs.existsSync(from)) throw new Error(`Missing web asset: ${entry}`);
  fs.cpSync(from, to, { recursive: true });
}

const required = [
  'index.html', 'src/main.js', 'src/core/icons.js', 'src/styles/main.css',
  'assets/icon-192.png', 'content/curriculum.json', 'vendor/gsap.min.js'
];
for (const file of required) {
  if (!fs.existsSync(path.join(output, file))) throw new Error(`Incomplete web bundle: ${file}`);
}
console.log(`Prepared Android/PWA web bundle in ${output}`);

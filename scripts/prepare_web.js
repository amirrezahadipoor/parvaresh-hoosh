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
// ---------------------------------------------------------------------------
// Bundle + minify for the shipped build.
//
// The app loads 35 separate classic scripts. Inside an APK there is no network
// cost, but the WebView still opens, parses and compiles each file separately,
// and that parse time is the single largest remaining startup cost. Nothing is
// removed: the files are concatenated IN THE SAME ORDER as index.html, minified,
// and emitted as one script. The source tree keeps its 35 readable files.
// Falls back to the unbundled copy if terser is unavailable, so a fresh clone
// without dev dependencies still produces a working build.
// ---------------------------------------------------------------------------
function bundleScripts() {
  let terser;
  try { terser = require('terser'); }
  catch (e) { console.warn('terser unavailable; shipping unbundled scripts.'); return null; }

  const htmlPath = path.join(output, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  const tagRe = /[ \t]*<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>\r?\n?/g;
  const srcs = [];
  let m;
  while ((m = tagRe.exec(html)) !== null) srcs.push(m[1]);
  if (srcs.length < 2) return null;

  const parts = [];
  for (const src of srcs) {
    const file = path.join(output, src);
    if (!fs.existsSync(file)) throw new Error(`Bundle source missing: ${src}`);
    // Each file is an IIFE assigning to window; a newline and semicolon keep
    // them independent even if one lacks a trailing semicolon.
    parts.push(`/* ${src} */\n` + fs.readFileSync(file, 'utf8') + '\n;');
  }
  const joined = parts.join('\n');
  return { html, htmlPath, srcs, joined };
}

const bundle = bundleScripts();
if (bundle) {
  const terser = require('terser');
  terser.minify(bundle.joined, {
    compress: { passes: 2, drop_debugger: true },
    mangle: true,
    format: { comments: false },
    sourceMap: false
  }).then(res => {
    if (res.error) throw res.error;
    const outFile = path.join(output, 'src', 'app.bundle.js');
    fs.writeFileSync(outFile, res.code, 'utf8');
    // Replace the 35 tags with one, at the position of the first tag.
    let html = bundle.html;
    let first = true;
    html = html.replace(/[ \t]*<script[^>]*\ssrc="([^"]+)"[^>]*><\/script>\r?\n?/g, () => {
      if (first) { first = false; return '    <script defer src="src/app.bundle.js"></script>\n'; }
      return '';
    });
    // Preload the bundle from <head>. Deferred scripts near the end of <body>
    // are only discovered once the parser reaches them, which pushed first
    // contentful paint out; preloading starts the fetch immediately while the
    // deferred execution order stays exactly the same.
    if (!html.includes('src/app.bundle.js" as="script"')) {
      html = html.replace('</head>',
        '    <link rel="preload" href="src/app.bundle.js" as="script">\n</head>');
    }
    fs.writeFileSync(bundle.htmlPath, html, 'utf8');
    // The service worker still precaches the 35 originals, which the page no
    // longer requests: it would download them for nothing and, worse, omit the
    // bundle itself, so a cold offline launch would have no JS at all.
    const swPath = path.join(output, 'sw.js');
    if (fs.existsSync(swPath)) {
      let sw = fs.readFileSync(swPath, 'utf8');
      const bundled = new Set(bundle.srcs.map(x => './' + x.replace(/^\.\//, '')));
      sw = sw.replace(/(const PRECACHE\s*=\s*\[)([\s\S]*?)(\n\];)/, (_m, head, body, tail) => {
        const kept = body.split('\n').filter(line => {
          const hit = line.match(/'([^']+)'/);
          return !(hit && bundled.has(hit[1]));
        }).join('\n').replace(/,(\s*)$/, '');
        return head + kept + ",\n    './src/app.bundle.js'" + tail;
      });
      fs.writeFileSync(swPath, sw, 'utf8');
    }

    // The 35 source files are now inlined in app.bundle.js and referenced by
    // nothing (no script tags, no dynamic import, not in PRECACHE), so shipping
    // them would just pad the APK. The readable originals stay in src/.
    let pruned = 0, prunedKB = 0;
    for (const rel of bundle.srcs) {
      const dead = path.join(output, rel.replace(/^\.\//, ''));
      if (path.resolve(dead) === path.resolve(outFile)) continue;
      if (fs.existsSync(dead)) {
        prunedKB += fs.statSync(dead).size / 1024;
        fs.unlinkSync(dead);
        pruned++;
      }
    }
    if (pruned) console.log(`Pruned ${pruned} bundled sources from output (-${prunedKB.toFixed(0)}KB)`);

    const before = Buffer.byteLength(bundle.joined) / 1024;
    const after = Buffer.byteLength(res.code) / 1024;
    console.log(`Bundled ${bundle.srcs.length} scripts: ${before.toFixed(0)}KB -> ${after.toFixed(0)}KB (1 request)`);
    console.log(`Prepared Android/PWA web bundle in ${output}`);
  }).catch(err => { console.error('Bundling failed:', err.message); process.exit(1); });
} else {
  console.log(`Prepared Android/PWA web bundle in ${output}`);
}

import { chromium } from 'playwright-core';
const NAMES = process.argv.slice(2)[0]?.split(',') || [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 220, height: 220 } });
await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
const rows = await page.evaluate(async (names) => {
  const m = await import('/src/core/svg.js');
  const out = [];
  for (const nm of names) {
    document.body.innerHTML = `<div id="w">${m.shape(nm)}</div>`;
    const s = document.querySelector('#w svg');
    s.setAttribute('width', '200'); s.setAttribute('height', '200');
    const xml = new XMLSerializer().serializeToString(s);
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml))); });
    const c = document.createElement('canvas'); c.width = 200; c.height = 200;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 200, 200);
    ctx.drawImage(img, 0, 0, 200, 200);
    const d = ctx.getImageData(0, 0, 200, 200).data;
    let ink = 0, minx = 200, miny = 200, maxx = 0, maxy = 0;
    const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const pal = new Set();
    for (let y = 0; y < 200; y++) for (let x = 0; x < 200; x++) {
      const i = (y * 200 + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2];
      pal.add(`${r >> 4},${g >> 4},${b >> 4}`);
      const L = lum(r, g, b);
      const dist = Math.abs(r - 255) + Math.abs(g - 255) + Math.abs(b - 255);
      if (dist > 60) {
        if (L < 200) ink++;
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
      }
    }
    out.push({ name: nm, inkPct: +(ink / 40000 * 100).toFixed(1), palette: pal.size,
      clipped: minx <= 1 || miny <= 1 || maxx >= 198 || maxy >= 198, bbox: [minx, miny, maxx, maxy] });
  }
  return out;
}, NAMES);
await browser.close();
for (const r of rows) console.log(`${r.name}: جوهر ${r.inkPct}٪ | رنگ ${r.palette} | بریدگی ${r.clipped ? '⚠️' : 'ندارد'} | bbox ${r.bbox.join(',')}`);

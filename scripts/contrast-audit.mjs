#!/usr/bin/env node
/**
 * Contrast audit for rendered text.
 * Usage: node scripts/contrast-audit.mjs [url] [width] [height] [setupExpression] [rootSelector]
 */
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2] || 'http://localhost:5183/case/db-cooper';
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);
const setup = process.argv[5] || '';
const rootSelector = process.argv[6] || '.ed';
const port = 9800 + Math.floor(Math.random() * 200);
const child = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--remote-debugging-port=' + port,
  '--user-data-dir=' + join(tmpdir(), `enigma-contrast-${process.pid}`), 'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getPage() {
  for (let i = 0; i < 80; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const p = list.find((t) => t.type === 'page');
      if (p) return p;
    } catch {}
    await sleep(150);
  }
  throw new Error('no page');
}
const page = await getPage();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true });
  ws.addEventListener('error', rej, { once: true });
});
let id = 0;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  }
});
function send(method, params = {}) {
  const messageId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(messageId, { resolve, reject });
    ws.send(JSON.stringify({ id: messageId, method, params }));
  });
}
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600, screenWidth: width, screenHeight: height });
await send('Page.navigate', { url });
await sleep(5000);
await send('Runtime.evaluate', { expression: "document.documentElement.style.scrollBehavior='auto'" });
// Trigger all lazy reveals so every section is measurable.
await send('Runtime.evaluate', { expression: `(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 400));
})()`, awaitPromise: true });
if (setup) {
  await send('Runtime.evaluate', { expression: setup, awaitPromise: true });
  await sleep(500);
}

const expression = `(() => {
  const lum = (rgb) => {
    const m = rgb.match(/[\\d.]+/g);
    if (!m || m.length < 3) return null;
    const c = m.slice(0, 3).map(Number).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const alpha = (rgb) => {
    const m = rgb.match(/[\\d.]+/g);
    return m && m.length > 3 ? Number(m[3]) : 1;
  };
  const rgbOf = (rgb) => {
    const m = rgb.match(/[\\d.]+/g);
    if (!m || m.length < 3) return null;
    return m.slice(0, 3).map(Number);
  };
  const over = (fg, bg) => {
    const f = rgbOf(fg);
    const b = rgbOf(bg);
    if (!f || !b) return bg;
    const a = alpha(fg);
    return 'rgb(' + f.map((v, i) => Math.round(v * a + b[i] * (1 - a))).join(', ') + ')';
  };
  const blend = (fg, bg) => {
    const f = rgbOf(fg);
    const b = rgbOf(bg);
    if (!f || !b) return fg;
    const a = alpha(fg);
    return 'rgb(' + f.map((v, i) => Math.round(v * a + b[i] * (1 - a))).join(', ') + ')';
  };
  const effectiveBg = (el) => {
    // Collect every painted layer from the element up to the root, then
    // composite from the outermost inward so semi-transparent tints resolve
    // against the real page background instead of being read as opaque.
    const layers = [];
    let node = el;
    while (node) {
      const c = getComputedStyle(node).backgroundColor;
      if (c && c !== 'transparent' && alpha(c) > 0) layers.push(c);
      node = node.parentElement;
    }
    let bg = 'rgb(255, 255, 255)';
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    return bg;
  };
  const ratio = (a, b) => {
    const x = lum(a), y = lum(b);
    if (x === null || y === null) return null;
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const out = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.querySelector(${JSON.stringify(rootSelector)}) || document.querySelector('.ed'), NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const text = (node.textContent || '').trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || seen.has(el)) continue;
    seen.add(el);
    if (el.closest('[aria-hidden="true"]')) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const fs = parseFloat(cs.fontSize);
    const fw = Number(cs.fontWeight) || 400;
    const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
    let color = cs.color;
    let bg = effectiveBg(el);
    if (alpha(color) < 0.95) color = blend(color, bg);
    const cr = ratio(color, bg);
    if (cr === null) continue;
    const need = large ? 3 : 4.5;
    if (cr < need) {
      out.push({
        text: text.slice(0, 44),
        cls: (typeof el.className === 'string' ? el.className : '').slice(0, 46),
        tag: el.tagName.toLowerCase(),
        fs: Math.round(fs * 10) / 10,
        fw,
        color: cs.color,
        bg,
        cr: Math.round(cr * 100) / 100,
        need,
      });
    }
  }
  const uniq = [];
  const key = new Set();
  for (const x of out) {
    const k = x.cls + '|' + x.color + '|' + x.bg;
    if (key.has(k)) continue;
    key.add(k);
    uniq.push(x);
  }
  return JSON.stringify({ count: out.length, unique: uniq.slice(0, 60) }, null, 2);
})()`;

const result = await send('Runtime.evaluate', { expression, returnByValue: true });
console.log(result.result.value);
try { ws.close(); } catch {}
child.kill();
process.exit(0);

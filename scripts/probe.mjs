#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2] || 'http://localhost:5183/case/db-cooper';
const stop = Number(process.argv[3] || 0.5);
const port = 9600 + Math.floor(Math.random() * 300);
const userDataDir = join(tmpdir(), `enigma-probe-${process.pid}`);
const child = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--remote-debugging-port=' + port,
  '--user-data-dir=' + userDataDir, 'about:blank',
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
await send('Network.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url });
await sleep(4000);
await send('Runtime.evaluate', { expression: "document.documentElement.style.scrollBehavior='auto'" });
const pageHeight = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.value;
await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${Math.round((pageHeight - 900) * stop)})` });
await sleep(4000);
const result = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    scrollY,
    pageHeight: document.documentElement.scrollHeight,
    images: Array.from(document.images).map(img => ({
      alt: img.alt.slice(0, 60),
      src: img.getAttribute('src'),
      currentSrc: img.currentSrc,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      rect: (() => { const r = img.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; })(),
      display: getComputedStyle(img).display,
      visibility: getComputedStyle(img).visibility,
      opacity: getComputedStyle(img).opacity,
    })),
    errors: window.__errors || [],
  }, null, 2)`,
  returnByValue: true,
});
console.log(result.result.value);
try { ws.close(); } catch {}
child.kill();
process.exit(0);

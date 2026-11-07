#!/usr/bin/env node
/**
 * Load a page, run an expression, then screenshot the viewport.
 * Usage: node scripts/flow-shot.mjs <url> <width> <height> <out.png> "<expression>"
 */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2];
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);
const out = resolve(process.argv[5] || '.enigma-tmp/flow.png');
const expression = process.argv[6] || 'null';
const mobile = width < 600;
const port = 9700 + Math.floor(Math.random() * 300);
const userDataDir = join(tmpdir(), `enigma-flow-${process.pid}`);
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
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile, screenWidth: width, screenHeight: height });
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url });
await sleep(3500);
await send('Runtime.evaluate', { expression: "document.documentElement.style.scrollBehavior='auto'" });
const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
if (result.exceptionDetails) console.error(result.exceptionDetails.text);
await sleep(1500);
mkdirSync(dirname(out), { recursive: true });
const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(JSON.stringify({ out, result: result.result?.value ?? null }));
try { ws.close(); } catch {}
child.kill();
process.exit(0);

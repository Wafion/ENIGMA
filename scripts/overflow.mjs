#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2] || 'http://localhost:5183/case/db-cooper';
const width = Number(process.argv[3] || 390);
const height = Number(process.argv[4] || 844);
const port = 9900 + Math.floor(Math.random() * 300);
const userDataDir = join(tmpdir(), `enigma-overflow-${process.pid}`);
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
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true, screenWidth: width, screenHeight: height });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url });
await sleep(5000);
const result = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    innerWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenders: Array.from(document.querySelectorAll('*')).map(el => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        cls: typeof el.className === 'string' ? el.className : '',
        text: (el.textContent || '').trim().slice(0, 40),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
      };
    }).filter(x => x.width > 0 && (x.right > innerWidth + 1 || x.left < -1))
      .sort((a, b) => Math.max(b.right - innerWidth, -b.left) - Math.max(a.right - innerWidth, -a.left))
      .slice(0, 40),
  }, null, 2)`,
  returnByValue: true,
});
console.log(result.result.value);
try { ws.close(); } catch {}
child.kill();
process.exit(0);

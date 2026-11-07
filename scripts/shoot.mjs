#!/usr/bin/env node
/**
 * Minimal CDP screenshot harness.
 *
 * Usage:
 *   node scripts/shoot.mjs --url <url> --out <dir> --name <prefix> [options]
 *
 * Options:
 *   --width 1440            viewport width
 *   --height 900            viewport height
 *   --dpr 1                 device pixel ratio
 *   --full                  capture full page (one tall image)
 *   --stops 0,0.25,0.5,1    scroll positions as fractions, captured individually
 *   --settle 1600           ms after load / after each scroll
 *   --mobile                emulate a mobile device (390x844, touch, mobile UA)
 *   --selector <css>        capture a specific element instead of the viewport
 *   --wait <ms>             extra wait before capturing
 *   --no-scroll             do not pre-scroll the page (disables lazy-load warmup)
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

const url = arg('url');
if (!url) {
  console.error('--url is required');
  process.exit(1);
}

const outDir = resolve(arg('out', '.enigma-tmp/shots'));
const name = arg('name', 'shot');
const width = Number(arg('width', 1440));
const height = Number(arg('height', 900));
const dpr = Number(arg('dpr', 1));
const mobile = Boolean(arg('mobile', false));
const settle = Number(arg('settle', 1600));
const extraWait = Number(arg('wait', 0));
const full = Boolean(arg('full', false));
const selector = arg('selector', null);
const stopsRaw = arg('stops', null);
const stops = stopsRaw && stopsRaw !== true
  ? String(stopsRaw).split(',').map((n) => Number(n)).filter((n) => Number.isFinite(n))
  : null;
const noScroll = Boolean(arg('no-scroll', false));

mkdirSync(outDir, { recursive: true });

const userDataDir = join(tmpdir(), `enigma-shot-${process.pid}`);
const port = 9300 + Math.floor(Math.random() * 400);

const child = spawn(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-features=Translate,MediaRouter',
  '--autoplay-policy=no-user-gesture-required',
  '--remote-debugging-port=' + port,
  '--user-data-dir=' + userDataDir,
  'about:blank',
], { stdio: ['ignore', 'pipe', 'pipe'] });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getPages() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page;
    } catch {
      // browser still starting
    }
    await sleep(150);
  }
  throw new Error('Could not reach Edge debugging endpoint');
}

const page = await getPages();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true });
  ws.addEventListener('error', rej, { once: true });
});

let id = 0;
const pending = new Map();
const listeners = new Map();

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve: resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
    return;
  }
  if (msg.method && listeners.has(msg.method)) {
    for (const fn of listeners.get(msg.method)) fn(msg.params);
  }
});

function send(method, params = {}) {
  id += 1;
  const messageId = id;
  return new Promise((resolve, reject) => {
    pending.set(messageId, { resolve, reject });
    ws.send(JSON.stringify({ id: messageId, method, params }));
  });
}

function once(method, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const set = listeners.get(method) ?? new Set();
    const fn = (params) => {
      set.delete(fn);
      clearTimeout(timer);
      resolve(params);
    };
    set.add(fn);
    listeners.set(method, set);
    const timer = setTimeout(() => {
      set.delete(fn);
      reject(new Error(`timeout waiting for ${method}`));
    }, timeout);
  });
}

await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
if (mobile) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: dpr, mobile: true,
    screenWidth: width, screenHeight: height,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setUserAgentOverride', {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  });
} else {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: dpr, mobile: false,
  });
}

const loaded = once('Page.loadEventFired', 45000).catch(() => null);
await send('Page.navigate', { url });
await loaded;
await send('Runtime.evaluate', {
  expression: "document.documentElement.style.scrollBehavior = 'auto';",
});
await sleep(settle + extraWait);

async function evalJs(expression, returnByValue = true) {
  const result = await send('Runtime.evaluate', { expression, returnByValue, awaitPromise: true });
  return result.result?.value;
}

const pageHeight = await evalJs('Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)');
const pageWidth = await evalJs('Math.max(document.body.scrollWidth, document.documentElement.scrollWidth)');
const title = await evalJs('document.title');

if (!noScroll && !stops) {
  // warm lazy assets and trigger scroll reveals
  const viewport = height;
  const total = Math.min(pageHeight, 40000);
  for (let y = 0; y < total; y += Math.round(viewport * 0.8)) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await sleep(180);
  }
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(400);
}

async function capture(path, captureFull = false, clip = null) {
  const params = { format: 'png', fromSurface: true, captureBeyondViewport: captureFull };
  if (clip) params.clip = clip;
  const result = await send('Page.captureScreenshot', params);
  writeFileSync(path, Buffer.from(result.data, 'base64'));
  return path;
}

const written = [];

if (selector) {
  const box = await evalJs(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    window.scrollTo(0, 0);
    const r = el.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
  })()`);
  if (!box) throw new Error(`selector not found: ${selector}`);
  await sleep(300);
  const path = join(outDir, `${name}--element.png`);
  await capture(path, true, { ...box, scale: 1 });
  written.push(path);
} else if (stops) {
  for (const stop of stops) {
    const y = Math.round(Math.max(0, pageHeight - height) * stop);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
    await sleep(settle);
    const label = String(stop).replace('.', '-');
    const path = join(outDir, `${name}--${label}.png`);
    await capture(path, false);
    written.push(path);
  }
} else {
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(500);
  if (full) {
    const path = join(outDir, `${name}--full.png`);
    await capture(path, true, { x: 0, y: 0, width: pageWidth, height: Math.min(pageHeight, 30000), scale: 1 });
    written.push(path);
  } else {
    const path = join(outDir, `${name}.png`);
    await capture(path, false);
    written.push(path);
  }
}

const meta = {
  url, title, width, height, pageHeight, pageWidth,
  files: written,
};
writeFileSync(join(outDir, `${name}--meta.json`), JSON.stringify(meta, null, 2));
console.log(JSON.stringify(meta, null, 2));

try { ws.close(); } catch {}
child.kill();
process.exit(0);

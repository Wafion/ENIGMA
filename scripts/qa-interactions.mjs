#!/usr/bin/env node
/**
 * Interaction QA for the DB Cooper edition.
 * Runs a fixed sequence of UI actions and reports state + screenshots.
 *
 * Usage: node scripts/qa-interactions.mjs [url] [width] [height] [outDir]
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2] || 'http://localhost:5183/case/db-cooper';
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);
const outDir = resolve(process.argv[5] || '.enigma-tmp/flows2');
const mobile = width < 600;
const port = 9200 + Math.floor(Math.random() * 400);
const userDataDir = join(tmpdir(), `enigma-qa-${process.pid}`);

mkdirSync(outDir, { recursive: true });

const child = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required',
  '--remote-debugging-port=' + port, '--user-data-dir=' + userDataDir, 'about:blank',
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
async function evalJs(expression) {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result?.value;
}
async function shot(name) {
  const r = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const path = join(outDir, `${name}.png`);
  writeFileSync(path, Buffer.from(r.data, 'base64'));
  return path;
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile, screenWidth: width, screenHeight: height });
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url });
await sleep(4500);
await evalJs("document.documentElement.style.scrollBehavior='auto'");

const results = {};

/* 1. Index overlay: focus, reduced-motion focus retention, Escape restore */
results.index = await evalJs(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nav = Array.from(document.querySelectorAll('.ed-mast__nav button'));
  const indexBtn = nav.find((b) => /index/i.test(b.textContent));
  indexBtn.focus();
  indexBtn.click();
  await sleep(250);
  const dialog = document.querySelector('[role="dialog"]');
  const opened = !!dialog;
  const initialFocus = document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim().slice(0, 30);
  const box = document.querySelector('.ed-switch input');
  box.focus();
  box.click();
  await sleep(350);
  const afterToggle = document.activeElement?.className || document.activeElement?.tagName;
  const reduced = document.querySelector('.ed')?.classList.contains('is-reduced');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await sleep(250);
  return {
    opened, initialFocus, afterToggle, reduced,
    closed: !document.querySelector('[role="dialog"]'),
    focusRestored: document.activeElement === indexBtn,
    bodyOverflow: getComputedStyle(document.body).overflow,
  };
})()`);
await shot('01-index-closed');

/* 2. Sources overlay: search + empty state + Escape */
results.sources = await evalJs(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nav = Array.from(document.querySelectorAll('.ed-mast__nav button'));
  nav.find((b) => /sources/i.test(b.textContent)).click();
  await sleep(300);
  const input = document.querySelector('.ed-source-panel__search input');
  const initialCount = document.querySelectorAll('.ed-source-panel__source').length;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'zzzz-no-match');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await sleep(250);
  const empty = document.querySelector('.ed-source-panel__empty')?.textContent?.trim();
  const afterCount = document.querySelectorAll('.ed-source-panel__source').length;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await sleep(200);
  return { initialCount, afterCount, empty, closed: !document.querySelector('[role="dialog"]') };
})()`);

/* 3. Theory tabs */
results.theories = await evalJs(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  document.getElementById('dbc-the-theories').scrollIntoView();
  await sleep(300);
  const tabs = Array.from(document.querySelectorAll('.ed-theories__tabs [role="tab"]'));
  const selectedBefore = tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.textContent?.trim();
  tabs[2].click();
  await sleep(250);
  const panel = document.querySelector('.ed-theory');
  return {
    selectedBefore,
    selectedNow: tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.textContent?.trim(),
    panelLabel: panel?.getAttribute('aria-labelledby'),
    heading: panel?.querySelector('h3')?.textContent,
    tabbable: tabs.map((t) => t.tabIndex),
  };
})()`);
await shot('02-theories-tab');

/* 4. Suspect filter empty state */
results.suspects = await evalJs(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  document.getElementById('dbc-the-suspects').scrollIntoView();
  await sleep(300);
  const filters = Array.from(document.querySelectorAll('.ed-named__filters button'));
  const physical = filters.find((b) => /physical/i.test(b.textContent));
  physical.click();
  await sleep(250);
  const empty = document.querySelector('.ed-named__empty');
  const rows = document.querySelectorAll('.ed-suspect').length;
  const pressed = filters.map((b) => b.getAttribute('aria-pressed'));
  return {
    rows,
    emptyVisible: !!empty && !empty.hidden,
    emptyHeading: empty?.querySelector('h3')?.textContent,
    pressed,
  };
})()`);
await shot('03-suspects-empty');

/* 5. Map place selection */
results.map = await evalJs(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  document.getElementById('dbc-the-search').scrollIntoView();
  await sleep(300);
  const place = Array.from(document.querySelectorAll('.ed-map__place')).find((g) => /Tina Bar/.test(g.textContent));
  place.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await sleep(250);
  const detail = document.querySelector('.ed-map__detail');
  return {
    active: place.classList.contains('is-active'),
    pressed: place.getAttribute('aria-pressed'),
    heading: detail?.querySelector('h3')?.textContent,
    stepActive: document.querySelector('.ed-map__steps .is-active')?.textContent?.trim(),
  };
})()`);
await shot('04-map-tina');

/* 6. Asset drawer + Escape */
results.asset = await evalJs(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  window.scrollTo(0, 0);
  await sleep(200);
  const frame = document.querySelector('.ed-figure__frame');
  frame.click();
  await sleep(300);
  const dialog = document.querySelector('[role="dialog"]');
  const heading = dialog?.querySelector('h2')?.textContent;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await sleep(200);
  return { opened: !!dialog, heading, closed: !document.querySelector('[role="dialog"]') };
})()`);

/* 7. Sound panel: Escape and outside click */
results.sound = await evalJs(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nav = Array.from(document.querySelectorAll('.ed-mast__nav button'));
  nav.find((b) => /sound/i.test(b.textContent)).click();
  await sleep(200);
  const panel = document.querySelector('.ed-sound');
  const opened = !!panel;
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await sleep(200);
  return { opened, closedByEscape: !document.querySelector('.ed-sound') };
})()`);

/* 8. Touch targets + heading clipping + tiny text */
results.metrics = await evalJs(`(() => {
  const small = Array.from(document.querySelectorAll('.ed button, .ed a[href]'))
    .map((el) => { const r = el.getBoundingClientRect(); return { t: (el.textContent || '').trim().slice(0, 28), w: Math.round(r.width), h: Math.round(r.height), cls: el.className }; })
    .filter((x) => x.h > 0 && x.w > 0 && (x.h < 32 || x.w < 32));
  const clipped = Array.from(document.querySelectorAll('.ed h1, .ed h2, .ed h3, .ed p, .ed li'))
    .filter((el) => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
    .slice(0, 10)
    .map((el) => ({ tag: el.tagName, cls: el.className, text: (el.textContent || '').trim().slice(0, 40), sw: el.scrollWidth, cw: el.clientWidth }));
  return { smallTargets: small.slice(0, 25), smallCount: small.length, clipped };
})()`);

console.log(JSON.stringify(results, null, 2));
try { ws.close(); } catch {}
child.kill();
process.exit(0);

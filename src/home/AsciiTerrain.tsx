import { useEffect, useRef } from 'react';

/**
 * A deterministic ASCII landscape drawn to canvas.
 *
 * The terrain, moon and stars are rendered once into an offscreen buffer. The
 * visible canvas then blits that buffer and animates only a handful of drifting
 * glyphs and a twinkle, so the hero stays cheap even at full viewport size.
 * `prefers-reduced-motion` keeps the still frame and never starts the loop.
 */

const GLYPHS = ' .,:;-=+*#%@';
const DRIFT_GLYPHS = ['.', '·', '+', '*', ':'];
const CELL_W = 8;
const CELL_H = 10;
const FONT = `11px "Geist Mono Variable", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace`;
const INK = '239, 232, 220';

type Star = { col: number; row: number; glyph: string; phase: number };
type Mote = { x: number; y: number; speed: number; glyph: string; alpha: number };

function hash2(x: number, y: number, seed: number) {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263 + seed * 2246822519;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function ridgeAt(t: number) {
  const sharp = (frequency: number, phase: number) =>
    1 - Math.abs(Math.sin(t * frequency + phase));
  return (sharp(7.4, 0.6) * 0.56 + sharp(13.1, 2.4) * 0.26 + sharp(23.7, 4.1) * 0.12) / 0.94;
}

/** Returns the first row (inclusive) of a ridge for a column. */
function ridgeRow(
  col: number,
  cols: number,
  horizon: number,
  amplitude: number,
  seed: number,
  notch?: { col: number; width: number; depth: number },
) {
  const t = col / Math.max(1, cols - 1);
  const wobble = (hash2(col, seed, 7) - 0.5) * 1.2;
  let shape = ridgeAt(t) + wobble;
  if (notch) {
    const falloff = (col - notch.col) / notch.width;
    shape -= Math.exp(-falloff * falloff) * notch.depth;
  }
  const height = Math.max(0, shape) * amplitude;
  return Math.round(horizon - height);
}

type Frame = {
  cols: number;
  rows: number;
  width: number;
  height: number;
  stars: Star[];
};

function paintStatic(width: number, height: number, dpr: number): { canvas: HTMLCanvasElement; frame: Frame } {
  const cols = Math.max(24, Math.ceil(width / CELL_W));
  const rows = Math.max(18, Math.ceil(height / CELL_H));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext('2d');
  const frame: Frame = { cols, rows, width, height, stars: [] };

  if (!ctx) return { canvas, frame };

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.font = FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const horizon = Math.round(rows * 0.5);
  const deep = Math.round(rows * 0.88);

  /* --- stars ------------------------------------------------------------- */
  const starCount = Math.round(cols * 0.62);
  for (let i = 0; i < starCount; i += 1) {
    const col = Math.floor(hash2(i, 1, 11) * cols);
    const row = Math.floor(hash2(i, 2, 13) * horizon * 0.92);
    const alpha = 0.12 + hash2(i, 3, 17) * 0.4;
    const glyph = hash2(i, 4, 19) > 0.82 ? '+' : '.';
    ctx.fillStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
    ctx.fillText(glyph, col * CELL_W + CELL_W / 2, row * CELL_H + CELL_H / 2);
    if (i % 3 === 0) frame.stars.push({ col, row, glyph, phase: hash2(i, 5, 23) });
  }

  /* --- dotted moon ------------------------------------------------------- */
  const moonRadius = Math.max(10, Math.round(Math.min(cols * 0.075, rows * 0.3)));
  const moonCol = Math.min(Math.round(cols * 0.8), cols - moonRadius - 3);
  const moonRow = Math.round(rows * 0.34);
  const notch = { col: moonCol, width: moonRadius * 1.6, depth: 0.86 };
  const crater = { x: moonCol - moonRadius * 0.28, y: moonRow - moonRadius * 0.22, r: moonRadius * 0.3 };

  for (let row = Math.floor(moonRow - moonRadius); row <= Math.ceil(moonRow + moonRadius); row += 1) {
    for (let col = Math.floor(moonCol - moonRadius); col <= Math.ceil(moonCol + moonRadius); col += 1) {
      const dx = col - moonCol;
      const dy = (row - moonRow) * 1.24;
      const distance = Math.hypot(dx, dy);
      if (distance > moonRadius) continue;

      const edge = distance > moonRadius - 1.4;
      const inCrater = Math.hypot(col - crater.x, (row - crater.y) * 1.24) < crater.r;
      const grain = hash2(col, row, 31);
      if (!edge && (grain > 0.7 || inCrater)) continue;

      const alpha = edge ? 0.72 : 0.28 + grain * 0.4;
      ctx.fillStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
      ctx.fillText(edge ? '·' : grain > 0.55 ? '.' : '·', col * CELL_W + CELL_W / 2, row * CELL_H + CELL_H / 2);
    }
  }

  /* --- far ridge --------------------------------------------------------- */
  for (let col = 0; col < cols; col += 1) {
    const top = ridgeRow(col, cols, horizon - Math.round(rows * 0.04), rows * 0.5, 41, notch);
    const limit = Math.min(deep, top + Math.round(rows * 0.55));
    for (let row = top; row < limit; row += 1) {
      const depth = row - top;
      if (depth > 2 && hash2(col, row, 43) > 0.38) continue;
      const level = depth === 0 ? 2 : Math.min(3, 1 + Math.floor(depth * 0.1 + hash2(col, row, 47) * 1.3));
      const alpha = Math.min(0.26, (depth === 0 ? 0.18 : 0.06) + depth * 0.008 + hash2(col, row, 53) * 0.05);
      ctx.fillStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
      ctx.fillText(GLYPHS[level], col * CELL_W + CELL_W / 2, row * CELL_H + CELL_H / 2);
    }
  }

  /* --- near ridge -------------------------------------------------------- */
  for (let col = 0; col < cols; col += 1) {
    const top = ridgeRow(col, cols, horizon + Math.round(rows * 0.14), rows * 0.46, 61, notch);
    for (let row = top; row < rows; row += 1) {
      const depth = row - top;
      const grain = hash2(col, row, 67);
      if (depth < 1 && grain > 0.4) continue;
      const level =
        depth === 0 ? 4 : Math.min(6, Math.max(1, Math.floor(1 + depth * 0.2 + grain * 2.1)));
      const edge = depth === 0 ? 0.26 : depth < 2 ? 0.12 : 0;
      const alpha = Math.min(0.44, 0.06 + depth * 0.012 + grain * 0.09 + edge);
      ctx.fillStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
      ctx.fillText(GLYPHS[level], col * CELL_W + CELL_W / 2, row * CELL_H + CELL_H / 2);
    }
  }

  /* --- horizon rule ------------------------------------------------------ */
  ctx.fillStyle = `rgba(${INK}, 0.14)`;
  for (let col = 0; col < cols; col += 1) {
    if (hash2(col, 99, 71) > 0.55) continue;
    ctx.fillText('_', col * CELL_W + CELL_W / 2, horizon * CELL_H + CELL_H / 2);
  }

  return { canvas, frame };
}

function makeMotes(cols: number, rows: number): Mote[] {
  return Array.from({ length: 26 }, (_, index) => ({
    x: hash2(index, 7, 83) * cols,
    y: rows * (0.32 + hash2(index, 8, 89) * 0.62),
    speed: 0.35 + hash2(index, 9, 97) * 0.9,
    glyph: DRIFT_GLYPHS[Math.floor(hash2(index, 10, 101) * DRIFT_GLYPHS.length)],
    alpha: 0.18 + hash2(index, 11, 103) * 0.35,
  }));
}

export function AsciiTerrain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const host = canvas.parentElement ?? canvas;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const view: {
      width: number;
      height: number;
      staticCanvas: HTMLCanvasElement | null;
      frame: Frame | null;
      motes: Mote[];
    } = { width: 0, height: 0, staticCanvas: null, frame: null, motes: [] };
    const loop = { raf: 0, last: 0, elapsed: 0 };

    const draw = () => {
      if (!view.staticCanvas || !view.frame) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, view.width, view.height);
      context.drawImage(view.staticCanvas, 0, 0, view.width, view.height);
      if (reduced.matches) return;

      const t = loop.elapsed;
      context.font = FONT;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (const mote of view.motes) {
        const x = (mote.x + t * 0.0016 * mote.speed) % view.frame.cols;
        const drift =
          ((mote.y - t * 0.0022 * mote.speed) % view.frame.rows + view.frame.rows) %
          view.frame.rows;
        const pulse = 0.55 + 0.45 * Math.sin(t * 0.001 + mote.x);
        context.fillStyle = `rgba(${INK}, ${(mote.alpha * pulse).toFixed(3)})`;
        context.fillText(mote.glyph, x * CELL_W + CELL_W / 2, drift * CELL_H + CELL_H / 2);
      }

      const bucket = Math.floor(t / 1100);
      for (let index = 0; index < view.frame.stars.length; index += 1) {
        const star = view.frame.stars[index];
        if (hash2(index, bucket, 107) > 0.12) continue;
        context.fillStyle = `rgba(${INK}, 0.62)`;
        context.fillText('+', star.col * CELL_W + CELL_W / 2, star.row * CELL_H + CELL_H / 2);
      }
    };

    const tick = (now: number) => {
      loop.raf = window.requestAnimationFrame(tick);
      if (!loop.last) loop.last = now;
      const delta = now - loop.last;
      if (delta < 55) return;
      loop.last = now;
      loop.elapsed += delta;
      draw();
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      if (nextWidth === view.width && nextHeight === view.height && view.staticCanvas) return;
      view.width = nextWidth;
      view.height = nextHeight;

      canvas.width = Math.round(view.width * dpr);
      canvas.height = Math.round(view.height * dpr);
      canvas.style.width = `${view.width}px`;
      canvas.style.height = `${view.height}px`;

      const painted = paintStatic(view.width, view.height, dpr);
      view.staticCanvas = painted.canvas;
      view.frame = painted.frame;
      view.motes = makeMotes(view.frame.cols, view.frame.rows);
      draw();
    };

    const start = () => {
      if (loop.raf) window.cancelAnimationFrame(loop.raf);
      loop.last = 0;
      loop.elapsed = 0;
      if (!reduced.matches) loop.raf = window.requestAnimationFrame(tick);
    };

    const resizeFrame = { id: 0 };
    const onResize = () => {
      if (resizeFrame.id) window.cancelAnimationFrame(resizeFrame.id);
      resizeFrame.id = window.requestAnimationFrame(() => {
        build();
        draw();
      });
    };

    const onMotionChange = () => {
      if (reduced.matches) {
        if (loop.raf) window.cancelAnimationFrame(loop.raf);
        loop.raf = 0;
        draw();
      } else {
        start();
      }
    };

    build();
    start();

    const observer = new ResizeObserver(onResize);
    observer.observe(host);
    reduced.addEventListener('change', onMotionChange);
    document.fonts?.ready.then(() => {
      build();
      draw();
    });

    return () => {
      observer.disconnect();
      if (loop.raf) window.cancelAnimationFrame(loop.raf);
      if (resizeFrame.id) window.cancelAnimationFrame(resizeFrame.id);
      reduced.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`home-terrain__canvas${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  );
}




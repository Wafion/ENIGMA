import type { ASCIIColorMode, ASCIIPaletteId } from '../types/enigma';

export const ASCII_PALETTES: Record<ASCIIPaletteId, { label: string; chars: string }> = {
  'archive-dense': {
    label: 'Dense Archival (68-Char Ramp)',
    chars: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
  },
  'minimal-mono': {
    label: 'Minimal Monochrome (10-Char)',
    chars: ' .:-=+*#%@'
  },
  'runic-twana': {
    label: 'Black Hills Twana / Runic Set',
    chars: ' ·∙:;!|/\\+×†‡¥±§¶∆∇◊◈█'
  },
  'technical-hex': {
    label: 'Technical Telemetry Hex',
    chars: ' .·:0123456789ABCDEF#'
  },
  'block-matrix': {
    label: 'Halftone Block Matrix',
    chars: ' ·░▒▓█'
  }
};

export const COLOR_MODES: Record<ASCIIColorMode, { label: string; fg: string; bg: string }> = {
  'phosphor-bone': {
    label: 'Archival Bone',
    fg: '#dcd6c8',
    bg: '#050605'
  },
  'forest-amber': {
    label: 'Seneca Lichen & Amber',
    fg: '#c8b888',
    bg: '#050806'
  },
  'sampled-color': {
    label: 'True Sampled Chromatic',
    fg: '#ffffff',
    bg: '#050605'
  },
  'oxide-red': {
    label: 'Dossier Oxide Warning',
    fg: '#d95343',
    bg: '#080505'
  },
  'night-vision': {
    label: 'Hi8 Infrared Phosphor',
    fg: '#78b888',
    bg: '#040705'
  }
};

// 4x4 Bayer Dithering Matrix normalized (0..1)
const BAYER_4X4 = [
  [0, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16]
];

export interface RenderAsciiOptions {
  ctx: CanvasRenderingContext2D;
  sampleData: Uint8ClampedArray;
  cols: number;
  rows: number;
  canvasWidth: number;
  canvasHeight: number;
  palette: ASCIIPaletteId;
  contrast: number;
  brightness: number;
  threshold: number;
  invert: boolean;
  colorMode: ASCIIColorMode;
  timeSec?: number;
  animateDistortion?: boolean;
  emergenceProgress?: number; // 0 = sparse black void, 1 = full image
  pointerNorm?: { x: number; y: number } | null;
  dithering?: boolean;
  scanlines?: boolean;
}

export function renderAsciiToCanvas(opts: RenderAsciiOptions) {
  const {
    ctx,
    sampleData,
    cols,
    rows,
    canvasWidth,
    canvasHeight,
    palette,
    contrast,
    brightness,
    threshold,
    invert,
    colorMode,
    timeSec = 0,
    animateDistortion = false,
    emergenceProgress = 1,
    pointerNorm = null,
    dithering = false,
    scanlines = false
  } = opts;

  const paletteChars = ASCII_PALETTES[palette]?.chars || ASCII_PALETTES['archive-dense'].chars;
  const numChars = paletteChars.length;
  const modeColors = COLOR_MODES[colorMode] || COLOR_MODES['phosphor-bone'];

  ctx.fillStyle = modeColors.bg;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const cellW = canvasWidth / cols;
  const cellH = canvasHeight / rows;
  const fontSize = Math.max(7, Math.floor(cellH * 1.08));

  ctx.font = `${fontSize}px "Geist Mono Variable", "Geist Mono", "IBM Plex Mono", monospace`;
  ctx.textBaseline = 'top';

  for (let r = 0; r < rows; r++) {
    // Optional wind distortion shift per row
    let windOffsetCols = 0;
    if (animateDistortion) {
      const wave =
        Math.sin(r * 0.19 + timeSec * 1.6) *
        Math.cos(r * 0.07 - timeSec * 0.9);
      if (wave > 0.65) {
        windOffsetCols = Math.round((wave - 0.65) * 4);
      }
    }

    const yPos = r * cellH;

    for (let c = 0; c < cols; c++) {
      const sampleCol = Math.min(cols - 1, Math.max(0, c + windOffsetCols));
      const idx = (r * cols + sampleCol) * 4;
      const red = sampleData[idx];
      const green = sampleData[idx + 1];
      const blue = sampleData[idx + 2];

      // Perceptual luminance (0..1)
      let lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

      // Apply brightness & contrast
      lum = (lum - 0.5) * contrast + 0.5 + brightness;

      if (invert) {
        lum = 1 - lum;
      }

      // Bayer ordered dithering
      if (dithering) {
        const ditherThreshold = BAYER_4X4[r % 4][c % 4] - 0.5;
        lum += ditherThreshold * 0.18;
      }

      // Pointer flashlight boost if active
      if (pointerNorm) {
        const dx = c / cols - pointerNorm.x;
        const dy = (r / rows - pointerNorm.y) * (canvasHeight / canvasWidth);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.22) {
          lum += (1 - dist / 0.22) * 0.28;
        }
      }

      // Emergence mask for opening prologue transition
      if (emergenceProgress < 0.999) {
        const radialDx = c / cols - 0.5;
        const radialDy = r / rows - 0.5;
        const radialDist = Math.sqrt(radialDx * radialDx + radialDy * radialDy) * 1.35;
        const cellGate = ((r * 31 + c * 17) % 100) / 100;
        const revealWeight = emergenceProgress * 1.35 - radialDist * 0.45;
        if (revealWeight < cellGate * 0.55) {
          continue;
        }
        lum *= Math.min(1, Math.max(0, revealWeight));
      }

      // Subtle temporal shimmer for unstable forest mode
      if (animateDistortion) {
        const flicker = Math.sin(c * 0.35 + r * 0.5 + timeSec * 2.4) * 0.045;
        lum += flicker;
      }

      lum = Math.max(0, Math.min(1, lum));

      if (lum <= threshold) {
        continue;
      }

      // Horizontal gradient detection for directional ASCII slash/pipe hints
      let char = paletteChars[Math.min(numChars - 1, Math.floor(lum * (numChars - 1)))];

      if (c > 0 && c < cols - 1 && r > 0 && r < rows - 1 && lum > 0.22 && lum < 0.72) {
        const leftLum = sampleData[(r * cols + (c - 1)) * 4] / 255;
        const rightLum = sampleData[(r * cols + (c + 1)) * 4] / 255;
        const topLum = sampleData[((r - 1) * cols + c) * 4] / 255;
        const botLum = sampleData[((r + 1) * cols + c) * 4] / 255;
        const gx = rightLum - leftLum;
        const gy = botLum - topLum;
        const mag = Math.sqrt(gx * gx + gy * gy);
        if (mag > 0.34 && palette !== 'block-matrix') {
          const angle = Math.atan2(gy, gx);
          const absAngle = Math.abs(angle);
          if (absAngle < 0.35 || absAngle > 2.79) {
            char = '|';
          } else if (absAngle > 1.22 && absAngle < 1.92) {
            char = '-';
          } else if (angle > 0) {
            char = '/';
          } else {
            char = '\\';
          }
        }
      }

      if (colorMode === 'sampled-color') {
        const boost = Math.min(255, Math.floor(40 + lum * 215));
        const rOut = Math.min(255, Math.floor((red * 0.75 + boost * 0.25) * contrast));
        const gOut = Math.min(255, Math.floor((green * 0.75 + boost * 0.25) * contrast));
        const bOut = Math.min(255, Math.floor((blue * 0.75 + boost * 0.25) * contrast));
        ctx.fillStyle = `rgb(${rOut}, ${gOut}, ${bOut})`;
      } else {
        // Modulate alpha with luminance so dark shadows recede naturally into the surface
        const alpha = Math.min(1, 0.22 + lum * 0.88);
        ctx.fillStyle = hexToRgba(modeColors.fg, alpha);
      }

      ctx.fillText(char, c * cellW, yPos);
    }
  }

  // Optional analog CRT scanlines overlay
  if (scanlines) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let y = 0; y < canvasHeight; y += 3) {
      ctx.fillRect(0, y, canvasWidth, 1);
    }
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

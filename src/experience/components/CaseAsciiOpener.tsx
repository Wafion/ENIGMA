import { useEffect, useRef, useState } from 'react';

const DENSE_GLYPHS = ['@', '%', '#', 'W', 'M', '8', '&', '$', '0'];
const MID_GLYPHS = ['*', '+', '=', '-', '~', 'X', 'Z', 'Y', '1', '7', '<', '>'];
const LIGHT_GLYPHS = [':', '.', '·', '/', '\\', '|', ';', '!', '^', "'", ','];
const ALL_GLYPHS = [...DENSE_GLYPHS, ...MID_GLYPHS, ...LIGHT_GLYPHS];

const TELEMETRY_SNIPPETS = [
  'CASE // 001',
  'BURKITTSVILLE // MD',
  'RECORD_RESTORED',
  'SENECA_CREEK_OCT94',
  '16MM_SYNC_STABLE',
  'DECODING_LAYER',
  'STATUS: VERIFIED',
];

interface VerticalLayer {
  x: number;
  width: number;
  streamLeadY: number;
  streamVy: number;
  streamDelay: number;
  decodeProgress: number; // 0 = fully ASCII, 1 = fully decoded back to real Case
  decodeDelay: number;
  active: boolean;
  chars: string[];
}

/**
 * Synthesizes an analogue telemetry reconstruction chord sweep via Web Audio API,
 * resolving from filtered noise into a clear resonant tone as ASCII converts to reality.
 */
function playDecodeSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // 1. Resonant harmonic sweep up (frequency resolving into clarity)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.95);

    const oscFilter = ctx.createBiquadFilter();
    oscFilter.type = 'bandpass';
    oscFilter.frequency.setValueAtTime(280, now);
    oscFilter.frequency.exponentialRampToValueAtTime(820, now + 0.9);
    oscFilter.Q.value = 4.0;

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.18, now + 0.3);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.15);

    // 2. High chime overtone resolving at the end of the decode
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(440, now + 0.45);
    chime.frequency.exponentialRampToValueAtTime(880, now + 0.9);

    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.setValueAtTime(0.001, now + 0.45);
    chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.65);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.45);
    chime.stop(now + 1.15);
  } catch {
    // Ignore audio restrictions
  }
}

export function CaseAsciiOpener() {
  const [active, setActive] = useState(() => {
    // Check if triggered by the melt transition or session flag
    const flag = sessionStorage.getItem('enigma:case-ascii-open');
    if (flag === 'true') {
      sessionStorage.removeItem('enigma:case-ascii-open');
      return true;
    }
    // Also check window history state
    if (typeof window !== 'undefined' && window.history.state?.fromMelt) {
      return true;
    }
    return false;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) {
      setActive(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    playDecodeSound();

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setActive(false);
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Offscreen luminance buffer for sampling Seneca Creek woods
    const sampleCols = 80;
    const sampleRows = 50;
    const offscreen = document.createElement('canvas');
    offscreen.width = sampleCols;
    offscreen.height = sampleRows;
    const offCtx = offscreen.getContext('2d');

    let luminanceData: Uint8ClampedArray | null = null;

    const sampleImg = new Image();
    sampleImg.crossOrigin = 'anonymous';
    sampleImg.onload = () => {
      if (offCtx) {
        offCtx.drawImage(sampleImg, 0, 0, sampleCols, sampleRows);
        try {
          luminanceData = offCtx.getImageData(0, 0, sampleCols, sampleRows).data;
        } catch {
          luminanceData = null;
        }
      }
    };
    sampleImg.src = '/assets/blair-witch/images/seneca-creek-woods.jpg';

    // Build vertical layers (columns)
    const numLayers = Math.min(32, Math.max(18, Math.round(width / 52)));
    const layerWidth = width / numLayers;
    const layers: VerticalLayer[] = [];

    for (let i = 0; i < numLayers; i++) {
      const x = i * layerWidth;
      // Stagger: center outwards wave
      const distFromCenter = Math.abs(i - numLayers / 2) / (numLayers / 2);
      const streamDelay = distFromCenter * 140 + Math.random() * 50;
      // Decode stagger: left-to-right / center weave starting around 420ms
      const decodeDelay = 420 + (i / numLayers) * 380 + Math.random() * 40;

      const chars: string[] = [];
      const charCount = 60;
      for (let j = 0; j < charCount; j++) {
        chars.push(ALL_GLYPHS[Math.floor(Math.random() * ALL_GLYPHS.length)]);
      }

      layers.push({
        x,
        width: layerWidth,
        streamLeadY: 0,
        streamVy: 0,
        streamDelay,
        decodeProgress: 0,
        decodeDelay,
        active: false,
        chars,
      });
    }

    const startTime = performance.now();
    const TOTAL_DURATION = 1400; // milliseconds
    const dt = 0.016;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / TOTAL_DURATION);

      ctx.clearRect(0, 0, width, height);

      // Base dark ground that recedes as the case decodes
      const groundAlpha = Math.max(0, 1 - Math.min(1, Math.max(0, (elapsed - 450) / 750)));
      if (groundAlpha > 0.01) {
        ctx.fillStyle = `rgba(8, 7, 6, ${groundAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.font = `600 12px "Geist Mono Variable", "Geist Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const rowH = 16;
      const colW = 12;

      let allDecoded = true;

      for (let l = 0; l < layers.length; l++) {
        const layer = layers[l];

        // 1. Vertical Stream Inflow Phase
        if (elapsed >= layer.streamDelay) {
          layer.active = true;
          layer.streamVy += 3600 * dt;
          layer.streamLeadY += layer.streamVy * dt;
        }

        // 2. Decode Phase: converting ASCII back to the real underlying Case
        if (elapsed >= layer.decodeDelay) {
          const decodeElapsed = elapsed - layer.decodeDelay;
          layer.decodeProgress = Math.min(1, decodeElapsed / 380);
        }

        if (layer.decodeProgress < 1) {
          allDecoded = false;
        }

        if (!layer.active) continue;

        // The decode boundary (scanline) sweeps downward
        const scanY = layer.decodeProgress * (height + 120);

        // A. Draw thin vertical strip separator rule
        const ruleAlpha = Math.max(0, (1 - layer.decodeProgress) * 0.22);
        if (ruleAlpha > 0.01) {
          ctx.strokeStyle = `rgba(239, 232, 220, ${ruleAlpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(layer.x + layer.width, 0);
          ctx.lineTo(layer.x + layer.width, Math.min(height, layer.streamLeadY));
          ctx.stroke();
        }

        // B. Render ASCII characters within this vertical layer
        const subCols = Math.max(1, Math.floor(layer.width / colW));

        for (let sc = 0; sc < subCols; sc++) {
          const charX = layer.x + sc * colW + colW / 2;
          const maxRows = Math.min(Math.ceil(height / rowH), Math.ceil(layer.streamLeadY / rowH));

          for (let r = 0; r < maxRows; r++) {
            const charY = r * rowH + rowH / 2;

            // If the decode sweep has passed this character:
            // It converts / dissolves back to original Case!
            if (charY < scanY) {
              const distAboveScan = scanY - charY;
              if (distAboveScan > 70) continue; // fully converted back to real Case
              // Near the decode front, it dissolves smoothly
              const fadeFrac = 1 - distAboveScan / 70;
              renderChar(ctx, charX, charY, fadeFrac * 0.5, l + sc + r, elapsed);
            } else {
              // Ahead of the decode scanline: full streaming ASCII layer
              const distFromLead = layer.streamLeadY - charY;
              if (distFromLead < 0) continue;
              const streamAlpha = Math.min(0.95, (distFromLead / 60) * 0.95);
              renderChar(ctx, charX, charY, streamAlpha, l + sc + r, elapsed);
            }
          }
        }

        // C. Glowing decode beam across the front of this vertical layer
        if (layer.decodeProgress > 0 && layer.decodeProgress < 1 && scanY < height + 80) {
          ctx.save();
          const beamWidth = layer.width;
          const beamGrad = ctx.createLinearGradient(layer.x, scanY, layer.x + beamWidth, scanY);
          beamGrad.addColorStop(0, 'rgba(239, 232, 220, 0.15)');
          beamGrad.addColorStop(0.5, 'rgba(239, 232, 220, 0.85)');
          beamGrad.addColorStop(1, 'rgba(239, 232, 220, 0.15)');

          ctx.fillStyle = beamGrad;
          ctx.shadowColor = 'rgba(239, 232, 220, 0.8)';
          ctx.shadowBlur = 10;
          ctx.fillRect(layer.x, scanY - 2, beamWidth, 4);

          // Stamped telemetry glyph at the decode scan front
          ctx.fillStyle = '#efe8dc';
          ctx.shadowBlur = 0;
          ctx.font = `700 10px "Geist Mono Variable", "Geist Mono", monospace`;
          const g = DENSE_GLYPHS[(l + Math.floor(elapsed * 0.04)) % DENSE_GLYPHS.length];
          ctx.fillText(g, layer.x + layer.width / 2, scanY);
          ctx.restore();
        }
      }

      // Helper function to render image-sampled or algorithmic ASCII glyphs
      function renderChar(
        targetCtx: CanvasRenderingContext2D,
        x: number,
        y: number,
        baseAlpha: number,
        seed: number,
        timeMs: number
      ) {
        if (baseAlpha <= 0.01) return;

        // Sample image luminance if loaded
        let lum = 0.5;
        if (luminanceData) {
          const u = Math.min(sampleCols - 1, Math.max(0, Math.floor((x / width) * sampleCols)));
          const v = Math.min(sampleRows - 1, Math.max(0, Math.floor((y / height) * sampleRows)));
          const idx = (v * sampleCols + u) * 4;
          const r = luminanceData[idx] || 0;
          const g = luminanceData[idx + 1] || 0;
          const b = luminanceData[idx + 2] || 0;
          lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        } else {
          // Algorithmic falloff resembling forest canopy & trunks
          const trunk = Math.abs(Math.sin((x / width) * 14 + seed * 0.2));
          lum = trunk > 0.75 ? 0.8 : 0.35 + (y / height) * 0.3;
        }

        let glyph = '.';
        if (lum > 0.68) {
          glyph = DENSE_GLYPHS[(seed + Math.floor(timeMs * 0.01)) % DENSE_GLYPHS.length];
          targetCtx.fillStyle = `rgba(239, 232, 220, ${(baseAlpha * 0.98).toFixed(3)})`;
        } else if (lum > 0.38) {
          glyph = MID_GLYPHS[(seed + Math.floor(timeMs * 0.008)) % MID_GLYPHS.length];
          targetCtx.fillStyle = `rgba(200, 184, 136, ${(baseAlpha * 0.82).toFixed(3)})`;
        } else {
          glyph = LIGHT_GLYPHS[(seed + Math.floor(timeMs * 0.006)) % LIGHT_GLYPHS.length];
          targetCtx.fillStyle = `rgba(138, 132, 120, ${(baseAlpha * 0.55).toFixed(3)})`;
        }

        targetCtx.fillText(glyph, x, y);
      }

      // 4. Decode status ribbon across bottom during reconstruction
      if (progress > 0.15 && progress < 0.78) {
        ctx.save();
        const snippetIdx = Math.floor((elapsed * 0.006) % TELEMETRY_SNIPPETS.length);
        const snippet = TELEMETRY_SNIPPETS[snippetIdx];
        ctx.font = `600 11px "Geist Mono Variable", "Geist Mono", monospace`;
        ctx.letterSpacing = '0.22em';
        const ribbonAlpha = Math.sin(progress * Math.PI) * 0.65;
        ctx.fillStyle = `rgba(239, 232, 220, ${ribbonAlpha.toFixed(3)})`;
        ctx.fillText(`+ [ DECODING RECORD // ${snippet} ] +`, width / 2, height - 36);
        ctx.restore();
      }

      // Check completion
      if (progress < 1 && !allDecoded) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        // Complete! Dissolve remaining canvas and unmount
        setActive(false);
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="case-ascii-opener"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

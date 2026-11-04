import { useEffect, useRef, useCallback } from 'react';

interface HeroAsciiLiquidMeltProps {
  heroRef: React.RefObject<HTMLElement | null>;
  onTriggerCase: () => void;
}

const DENSE_GLYPHS = ['@', '%', '#', 'W', 'M', '8', '&', '$', '0'];
const MID_GLYPHS = ['*', '+', '=', '-', '~', 'X', 'Z', 'Y', '1', '7', '<', '>'];
const LIGHT_GLYPHS = [':', '.', '·', '/', '\\', '|', ';', '!', '^', "'", ','];
const ALL_GLYPHS = [...DENSE_GLYPHS, ...MID_GLYPHS, ...LIGHT_GLYPHS];

const ARCHIVE_PHRASES = [
  '// FOLKLORE_DISSOLVE //',
  'CASE 001 // OPENING RECORD',
  'BURKITTSVILLE // MARYLAND // 1994',
  'CORRUPTED MEMORY TRACE',
  'SOLVENT PURGE MMXXVI',
  'ARCHIVE FRAGMENT DRAIN',
  '[ RECORDED FOOTAGE RECOVERED ]',
];

interface StreamColumn {
  x: number;
  tipY: number;
  vy: number;
  viscosity: number;
  delay: number;
  active: boolean;
  beadSize: number;
  trailLength: number;
  chars: string[];
  charTick: number;
  hasSplattered: boolean;
}

/**
 * Synthesizes an eerie, analogue sub-bass tape melt and solvent dissolution hiss
 * via the native Web Audio API — zero network requests, instant playback.
 */
function playMeltSound() {
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

    // 1. Deep sub-bass pitch drop (analogue tape winding down into dissolve)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(22, now + 1.25);

    // Warm low-pass on the oscillator so it's a rich, weighty hum
    const oscFilter = ctx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(220, now);
    oscFilter.frequency.exponentialRampToValueAtTime(60, now + 1.2);

    oscGain.gain.setValueAtTime(0.28, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.3);

    // 2. Solvent hiss / tape crinkle noise burst (resonant bandpass noise)
    const bufferSize = Math.floor(ctx.sampleRate * 1.25);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.45));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1600, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(260, now + 1.15);
    noiseFilter.Q.value = 3.2;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.16, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.25);
  } catch {
    // Ignore audio permission or context restrictions gracefully
  }
}

export function HeroAsciiLiquidMelt({ heroRef, onTriggerCase }: HeroAsciiLiquidMeltProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMeltingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const textNodesRef = useRef<Array<{ node: Text; original: string }>>([]);

  const triggerMelt = useCallback(
    (clientX: number, clientY: number) => {
      const hero = heroRef.current;
      const canvas = canvasRef.current;
      if (!hero || !canvas || isMeltingRef.current) return;

      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motion.matches) {
        onTriggerCase();
        return;
      }

      isMeltingRef.current = true;
      hero.dataset.melting = 'true';
      hero.dataset.cursor = 'hidden';

      const root = hero.closest<HTMLElement>('.home');
      if (root) {
        root.dataset.exit = 'true';
      }

      // Play analog dissolution audio cue
      playMeltSound();

      // Trigger the ink drain on the ENIGMA wordmark
      const word = hero.querySelector<HTMLElement>('.home-hero__wordmark');
      if (word) {
        word.dispatchEvent(new CustomEvent('ink:drain'));
      }

      // Collect all text nodes in the hero for real-time ASCII cipher scrambling
      const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
      const textRecords: Array<{ node: Text; original: string }> = [];
      let currentTextNode = walker.nextNode() as Text | null;
      while (currentTextNode) {
        const parent = currentTextNode.parentElement;
        if (
          parent &&
          parent.tagName !== 'STYLE' &&
          parent.tagName !== 'SCRIPT' &&
          !parent.closest('.home-hero__wordmark') &&
          !parent.closest('.home-terrain__canvas') &&
          !parent.closest('.hero-liquid-filter-svg') &&
          currentTextNode.nodeValue?.trim()
        ) {
          textRecords.push({ node: currentTextNode, original: currentTextNode.nodeValue });
        }
        currentTextNode = walker.nextNode() as Text | null;
      }
      textNodesRef.current = textRecords;

      // Prepare canvas dimensions
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = hero.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onTriggerCase();
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const originX = clientX - rect.left;
      const originY = clientY - rect.top;

      // Build liquid rivulet columns
      const colWidth = 13;
      const rowHeight = 15;
      const numCols = Math.ceil(width / colWidth);
      const columns: StreamColumn[] = [];

      const maxDist = Math.hypot(width, height);

      for (let i = 0; i < numCols; i++) {
        const x = i * colWidth + colWidth / 2;
        const dist = Math.hypot(x - originX, 0.45 * Math.abs(height * 0.4 - originY));
        const delay = (dist / maxDist) * 320 + Math.random() * 90;

        const trailLength = Math.floor(18 + Math.random() * 26);
        const chars: string[] = [];
        for (let j = 0; j < trailLength; j++) {
          chars.push(ALL_GLYPHS[Math.floor(Math.random() * ALL_GLYPHS.length)]);
        }

        columns.push({
          x,
          tipY: 0,
          vy: 0,
          viscosity: 0.8 + Math.random() * 0.4,
          delay,
          active: false,
          beadSize: 3.5 + Math.random() * 4.5,
          trailLength,
          chars,
          charTick: Math.floor(Math.random() * 4),
          hasSplattered: false,
        });
      }

      const startTime = performance.now();
      const DURATION = 1250; // milliseconds before case reveal
      let lastScrambleTime = 0;

      // Animate SVG displacement filter if present
      const displacement = document.getElementById('hero-liquid-displacement');

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / DURATION);

        // Update SVG turbulence displacement scale for real-time liquid wobble on DOM
        if (displacement) {
          const scaleVal = Math.sin(progress * Math.PI) * 58 + progress * 24;
          displacement.setAttribute('scale', scaleVal.toFixed(1));
        }

        // Scramble DOM text nodes
        if (now - lastScrambleTime > 36 && textRecords.length > 0) {
          lastScrambleTime = now;
          const corruptFraction = Math.min(1, elapsed / 540);
          textRecords.forEach(({ node, original }) => {
            if (progress > 0.85) {
              node.nodeValue = '';
            } else {
              let scrambled = '';
              for (let c = 0; c < original.length; c++) {
                const char = original[c];
                if (char === ' ' || char === '\n') {
                  scrambled += char;
                } else if (Math.random() < corruptFraction * 1.3) {
                  scrambled += ALL_GLYPHS[Math.floor(Math.random() * ALL_GLYPHS.length)];
                } else {
                  scrambled += char;
                }
              }
              node.nodeValue = scrambled;
            }
          });
        }

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // 1. Dark liquid wash creeping in as everything dissolves
        if (progress > 0.25) {
          const washAlpha = Math.min(0.96, (progress - 0.25) * 1.35);
          ctx.fillStyle = `rgba(8, 7, 6, ${washAlpha.toFixed(3)})`;
          ctx.fillRect(0, 0, width, height);
        }

        // 2. Expanding radial solvent shockwave rings
        const waveRadius = elapsed * 1.35;
        if (waveRadius < maxDist * 1.2) {
          ctx.save();
          ctx.font = `600 12px "Geist Mono Variable", "Geist Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const ringPoints = 36;
          for (let p = 0; p < ringPoints; p++) {
            const angle = (p / ringPoints) * Math.PI * 2;
            const r = waveRadius + (Math.sin(p * 4 + elapsed * 0.01) * 8);
            const px = originX + Math.cos(angle) * r;
            const py = originY + Math.sin(angle) * r;
            if (px >= 0 && px <= width && py >= 0 && py <= height) {
              const alpha = Math.max(0, 1 - waveRadius / (maxDist * 0.95)) * 0.75;
              ctx.fillStyle = `rgba(239, 232, 220, ${alpha.toFixed(3)})`;
              const g = MID_GLYPHS[(p + Math.floor(elapsed * 0.05)) % MID_GLYPHS.length];
              ctx.fillText(g, px, py);
            }
          }
          ctx.restore();
        }

        // 3. Falling liquid columns & ASCII rain
        ctx.font = `500 12px "Geist Mono Variable", "Geist Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const dt = 0.016; // approximate delta time

        for (let i = 0; i < columns.length; i++) {
          const col = columns[i];
          if (elapsed < col.delay) continue;

          col.active = true;
          // Gravitational acceleration with slight viscosity drag
          col.vy += 3200 * dt * col.viscosity;
          col.tipY += col.vy * dt;

          col.charTick++;
          if (col.charTick % 3 === 0) {
            // Roll top characters
            col.chars.unshift(ALL_GLYPHS[Math.floor(Math.random() * ALL_GLYPHS.length)]);
            col.chars.pop();
          }

          // A. Draw the leading liquid droplet bead
          if (col.tipY > 0 && col.tipY < height + 60) {
            ctx.save();
            ctx.fillStyle = '#efe8dc';
            ctx.shadowColor = 'rgba(239, 232, 220, 0.75)';
            ctx.shadowBlur = 9;

            // Liquid teardrop stretch
            ctx.beginPath();
            ctx.ellipse(col.x, col.tipY, col.beadSize * 0.75, col.beadSize * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Leading glyph stamped inside droplet
            ctx.fillStyle = '#080706';
            ctx.shadowBlur = 0;
            const headGlyph = DENSE_GLYPHS[i % DENSE_GLYPHS.length];
            ctx.fillText(headGlyph, col.x, col.tipY);
            ctx.restore();

            // B. Viscous liquid neck trailing the head
            ctx.strokeStyle = 'rgba(239, 232, 220, 0.28)';
            ctx.lineWidth = Math.max(1, col.beadSize * 0.45);
            ctx.beginPath();
            ctx.moveTo(col.x, col.tipY - col.beadSize * 1.2);
            ctx.lineTo(col.x, Math.max(0, col.tipY - 55));
            ctx.stroke();
          }

          // C. Trailing ASCII stream
          for (let j = 0; j < col.trailLength; j++) {
            const charY = col.tipY - (j + 1) * rowHeight;
            if (charY < -rowHeight || charY > height + 20) continue;

            const trailFrac = j / col.trailLength;
            let alpha = (1 - trailFrac) * 0.9;
            if (progress > 0.8) {
              alpha *= (1 - (progress - 0.8) / 0.2);
            }

            if (trailFrac < 0.25) {
              ctx.fillStyle = `rgba(239, 232, 220, ${alpha.toFixed(3)})`;
            } else if (trailFrac < 0.6) {
              ctx.fillStyle = `rgba(176, 169, 156, ${(alpha * 0.85).toFixed(3)})`;
            } else {
              ctx.fillStyle = `rgba(138, 132, 120, ${(alpha * 0.55).toFixed(3)})`;
            }

            const char = col.chars[j] || '.';
            ctx.fillText(char, col.x, charY);
          }
        }

        // 4. Corrupted archive telegraph ticker bands flashing across the dissolving screen
        if (progress > 0.35 && progress < 0.88) {
          ctx.save();
          const phraseIdx = Math.floor((elapsed * 0.005) % ARCHIVE_PHRASES.length);
          const phrase = ARCHIVE_PHRASES[phraseIdx];
          ctx.font = `600 11px "Geist Mono Variable", "Geist Mono", monospace`;
          ctx.letterSpacing = '0.24em';
          ctx.fillStyle = `rgba(239, 232, 220, ${((1 - Math.abs(progress - 0.6) * 3) * 0.65).toFixed(3)})`;
          const bandY = (height * 0.32) + Math.sin(elapsed * 0.008) * 45;
          ctx.fillText(`+ [ ${phrase} ] +`, width / 2, bandY);
          ctx.restore();
        }

        // 5. Check completion
        if (progress < 1) {
          rafRef.current = window.requestAnimationFrame(tick);
        } else {
          // Transition complete: trigger opening of the case
          onTriggerCase();
        }
      };

      rafRef.current = window.requestAnimationFrame(tick);
    },
    [heroRef, onTriggerCase]
  );

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onContextMenu = (event: MouseEvent) => {
      // Touch long-press can fire contextmenu; only react to pointer fine or explicit right-click
      event.preventDefault();
      triggerMelt(event.clientX, event.clientY);
    };

    hero.addEventListener('contextmenu', onContextMenu);

    return () => {
      hero.removeEventListener('contextmenu', onContextMenu);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      // Restore any text nodes if needed
      textNodesRef.current.forEach(({ node, original }) => {
        node.nodeValue = original;
      });
    };
  }, [heroRef, triggerMelt]);

  return (
    <>
      {/* SVG Liquid Displacement Filter */}
      <svg
        className="hero-liquid-filter-svg"
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id="hero-liquid-filter" x="-20%" y="-20%" width="140%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.05"
              numOctaves="3"
              result="liquidNoise"
              seed="19"
            />
            <feDisplacementMap
              id="hero-liquid-displacement"
              in="SourceGraphic"
              in2="liquidNoise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Canvas for the liquid dripping ASCII matrix simulation */}
      <canvas
        ref={canvasRef}
        className="home-hero__ascii-melt-canvas"
        aria-hidden="true"
      />
    </>
  );
}

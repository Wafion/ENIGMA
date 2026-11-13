import { useEffect, useRef, useState } from 'react';
import { dbcAudio } from '../audio';
import { useDbc } from '../context';

/**
 * The sound panel is an instrument, not a settings form: a live glyph spectrum
 * tapped from the audio graph, a typographic readout of the current cue, and
 * three physical-feeling faders. No album art, no chrome, no gradients.
 */

const GLYPHS = ['.', ':', ';', '-', '=', '+', '*', '#', '%', '@'];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  return `${String(minutes).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function Scope() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const view = { width: 0, height: 0 };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      view.width = rect.width;
      view.height = rect.height;
      canvas.width = Math.round(view.width * dpr);
      canvas.height = Math.round(view.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);

    const started = performance.now();
    const columns = 30;
    const rowHeight = 6.4;

    const draw = (now: number) => {
      rafRef.current = window.requestAnimationFrame(draw);
      const { width, height } = view;
      if (!width || !height) return;
      const levels = dbcAudio.getLevels(columns);
      const seconds = (now - started) / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.font = '600 8px "IBM Plex Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      const columnWidth = width / columns;

      for (let column = 0; column < columns; column += 1) {
        const level = clamp01(levels[column] ?? 0);
        const x = column * columnWidth + columnWidth / 2;
        const rows = Math.max(1, Math.round(level * (height / rowHeight)));
        for (let row = 0; row < rows; row += 1) {
          const y = height - 5 - row * rowHeight;
          const seed = (column * 7 + row * 13 + Math.floor(seconds * 8)) % GLYPHS.length;
          const glyph = row < rows * 0.55 ? GLYPHS[seed] : GLYPHS[(seed + 3) % GLYPHS.length];
          const alpha = (0.16 + (row / rows) * 0.62) * (0.45 + level);
          ctx.fillStyle =
            row >= rows - 2
              ? `rgba(214, 49, 24, ${Math.min(1, alpha).toFixed(3)})`
              : `rgba(237, 230, 214, ${Math.min(1, alpha).toFixed(3)})`;
          ctx.fillText(glyph, x, y);
        }
      }

      ctx.beginPath();
      for (let column = 0; column < columns; column += 1) {
        const level = clamp01(levels[column] ?? 0);
        const x = column * columnWidth + columnWidth / 2;
        const y = height - 4 - level * (height - 14);
        if (column === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(214, 49, 24, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    rafRef.current = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="sig__scope" aria-hidden="true" />;
}

function Fader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);

  const setFromPointer = (clientY: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    if (!rect.height) return;
    onChange(clamp01(1 - (clientY - rect.top) / rect.height));
  };

  return (
    <div className="sig-fader">
      <div
        ref={railRef}
        className="sig-fader__rail"
        role="slider"
        tabIndex={0}
        aria-label={`${label} level`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={`${Math.round(value * 100)} percent`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromPointer(event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) setFromPointer(event.clientY);
        }}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 0.01 : 0.05;
          let next: number | null = null;
          if (event.key === 'ArrowUp' || event.key === 'ArrowRight') next = value + step;
          if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') next = value - step;
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = 1;
          if (next === null) return;
          event.preventDefault();
          onChange(clamp01(next));
        }}
      >
        <span className="sig-fader__fill" style={{ transform: `scaleY(${value})` }} />
        <span className="sig-fader__thumb" style={{ bottom: `calc(${value * 100}% - 1px)` }} />
      </div>
      <span className="sig-fader__label">{label}</span>
      <span className="sig-fader__value">{String(Math.round(value * 100)).padStart(2, '0')}</span>
    </div>
  );
}

export function SoundPanel() {
  const {
    soundOpen,
    setSoundOpen,
    audio,
    enableAudio,
    toggleMuted,
    setMasterVolume,
    setScoreVolume,
    setAmbienceVolume,
  } = useDbc();
  const [time, setTime] = useState({ current: 0, duration: 0 });

  useEffect(() => {
    if (!soundOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setSoundOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [soundOpen, setSoundOpen]);

  useEffect(() => {
    if (!soundOpen || !audio.enabled) return;
    const read = () => setTime(dbcAudio.getTrackTime());
    read();
    const timer = window.setInterval(read, 500);
    return () => window.clearInterval(timer);
  }, [soundOpen, audio.enabled, audio.trackId]);

  if (!soundOpen) return null;

  const progress = time.duration > 0 ? clamp01(time.current / time.duration) : 0;

  return (
    <div className="sig" role="dialog" aria-label="Sound">
      <header className="sig__head">
        <span className="sig__tag">Signal</span>
        <span className="sig__id">002 · Norjak</span>
        <button type="button" className="sig__close" onClick={() => setSoundOpen(false)}>
          Close
        </button>
      </header>

      {!audio.enabled ? (
        <div className="sig__gate">
          <p className="sig__gate-kicker">Licensed score · procedural air</p>
          <p className="sig__gate-title" aria-label="The file has a sound.">
            The file has
            <br />
            <em>a sound.</em>
          </p>
          <p className="sig__gate-note">
            Opt-in. One continuous cue carries the movements and loops beneath the reading;
            the wind is synthesised live. Nothing plays until you open it.
          </p>
          <button type="button" className="sig__gate-btn" onClick={enableAudio}>
            <span>Open signal</span>
            <i aria-hidden="true">→</i>
          </button>
        </div>
      ) : (
        <>
          <Scope />
          <p className="sig__now">Now playing</p>
          <p className="sig__track">{audio.trackTitle ?? 'Procedural ambience'}</p>
          <p className="sig__byline">
            {audio.trackArtist ?? 'No music cue in this movement'} · {audio.themeLabel}
          </p>
          <p className="sig__intent">{audio.cueIntent}</p>

          <div className="sig__meta">
            <span>{audio.muted ? 'Signal cut' : 'Signal live'}</span>
            <span>
              {formatTime(time.current)} / {formatTime(time.duration)}
            </span>
            <span>Loop ×∞</span>
          </div>
          <div className="sig__timeline" aria-hidden="true">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>

          <div className="sig__faders">
            <Fader label="Master" value={audio.masterVolume} onChange={setMasterVolume} />
            <Fader label="Score" value={audio.scoreVolume} onChange={setScoreVolume} />
            <Fader label="Ambience" value={audio.ambienceVolume} onChange={setAmbienceVolume} />
          </div>

          <button
            type="button"
            className={`sig__mute ${audio.muted ? 'is-muted' : ''}`}
            onClick={toggleMuted}
            aria-pressed={audio.muted}
          >
            <span className="sig__mute-dot" aria-hidden="true" />
            {audio.muted ? 'Resume signal' : 'Cut signal'}
          </button>
        </>
      )}
    </div>
  );
}

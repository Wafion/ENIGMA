import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Play, Pause, Film, Video, Clock, SkipForward, SkipBack, Activity } from 'lucide-react';
import type { RecordingSegmentItem } from '../../types/enigma';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';
import { WaveformPlayer } from './WaveformPlayer';

interface ASCIIRecordingDeckProps {
  title: string;
  subtitle: string;
  cameraAssetId: string;
  segments: RecordingSegmentItem[];
}

export const ASCIIRecordingDeck: React.FC<ASCIIRecordingDeckProps> = ({
  title,
  subtitle,
  cameraAssetId,
  segments,
}) => {
  const { reducedMotion, setInspectedAsset } = useEnigma();
  const cameraAsset = ASSET_MAP[cameraAssetId];

  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [timecodeFrame, setTimecodeFrame] = useState(0);
  const [scanlinesActive, setScanlinesActive] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const currentSegment = segments[activeSegmentIndex] || segments[0];

  // Map each sequence to its authentic local audio recording
  const segmentAudioUrl = useMemo(() => {
    switch (currentSegment.proceduralScene) {
      case 'cemetery-slate':
        return '/assets/blair-witch/audio/historical-room-tone.wav';
      case 'creek-crossing':
        return '/assets/blair-witch/audio/stream-creek-flow.wav';
      case 'twana-grove':
        return '/assets/blair-witch/audio/branch-snap-woods.wav';
      case 'tent-apology':
        return '/assets/blair-witch/audio/radio-tape-interference.wav';
      case 'griggs-cellar':
      default:
        return '/assets/blair-witch/audio/wooden-cabin-creak.wav';
    }
  }, [currentSegment.proceduralScene]);

  // Observe visibility to save CPU when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const isEntryVisible = entries[0]?.isIntersecting ?? false;
        setIsVisible(isEntryVisible);
      },
      { rootMargin: '80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Timecode frame stepper (~24fps simulation)
  useEffect(() => {
    if (!isPlaying || !isVisible || reducedMotion) return;
    const interval = window.setInterval(() => {
      setTimecodeFrame((f) => f + 1);
    }, 41);

    return () => window.clearInterval(interval);
  }, [isPlaying, isVisible, reducedMotion]);

  // Synchronized transcript line progression
  useEffect(() => {
    if (!isPlaying || !isVisible || reducedMotion) return;
    const lineTimer = window.setInterval(() => {
      setActiveLineIndex((prev) => (prev + 1) % Math.max(1, currentSegment.transcript.length));
    }, 4500);

    return () => window.clearInterval(lineTimer);
  }, [isPlaying, isVisible, reducedMotion, currentSegment]);

  // Procedural ASCII Video Frame Generator based on the 5 sequence architectures
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 840;
    const height = 480;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const cols = 96;
    const rows = 48;
    const cellW = width / cols;
    const cellH = height / rows;
    const t = timecodeFrame * 0.04;

    const is16mm = currentSegment.gauge.includes('16mm');
    const isColorHi8 = currentSegment.gauge.includes('hi8');

    ctx.fillStyle = '#050705';
    ctx.fillRect(0, 0, width, height);

    ctx.font = '10px "Geist Mono Variable", "Geist Mono", monospace';
    ctx.textBaseline = 'top';

    const chars16mm = ' .:-=+*#%@';
    const charsColor = ' .,:;!|/\\+×†‡¥±§¶◈█';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = c / cols;
        const ny = r / rows;
        let lum = 0;
        let rColor = 220, gColor = 215, bColor = 200;

        switch (currentSegment.proceduralScene) {
          case 'cemetery-slate': {
            const horizon = 0.55 + Math.sin(nx * 3.14) * 0.05;
            if (ny > horizon) {
              lum = 0.25 + 0.15 * Math.sin(c * 0.4 + r * 0.3);
            }
            const stones = [0.22, 0.45, 0.68, 0.85];
            for (const sx of stones) {
              if (Math.abs(nx - sx) < 0.035 && ny > horizon - 0.22 && ny < horizon + 0.05) {
                lum = 0.75 + 0.15 * Math.cos((nx - sx) * 50);
              }
            }
            if (nx > 0.62 && nx < 0.88 && ny > 0.65 && ny < 0.88) {
              const stripe = (c + r + Math.floor(t * 4)) % 6 < 3;
              lum = stripe ? 0.95 : 0.1;
            }
            break;
          }

          case 'creek-crossing': {
            const creekY = 0.5 + Math.sin(nx * 4.5 + t * 3.5) * 0.12;
            const logY = 0.46 + (nx - 0.5) * 0.18;
            if (Math.abs(ny - creekY) < 0.16) {
              lum = 0.45 + 0.45 * Math.sin(c * 0.7 - t * 8.0);
              rColor = 80; gColor = 140; bColor = 170;
            } else if (ny > 0.65) {
              lum = 0.2 + 0.12 * Math.sin(c * 0.5);
              rColor = 140; gColor = 110; bColor = 70;
            } else {
              lum = 0.35 + 0.3 * Math.sin(nx * 8.0) * Math.sin(ny * 9.0);
              rColor = 60; gColor = 110; bColor = 75;
            }
            if (Math.abs(ny - logY) < 0.04) {
              lum = 0.85;
              rColor = 180; gColor = 150; bColor = 100;
            }
            break;
          }

          case 'twana-grove': {
            const trunkNear = Math.sin(nx * 12.0) > 0.75;
            if (trunkNear && ny > 0.15) {
              lum = 0.65;
            } else {
              lum = 0.18 + 0.1 * Math.sin(c * 0.2 + r * 0.3);
            }
            const dx = Math.abs(nx - 0.5);
            const effigyY = ny - 0.45;
            if (dx < 0.015 && effigyY > -0.2 && effigyY < 0.25) {
              lum = 0.95;
            } else if (Math.abs(effigyY) < 0.015 && dx < 0.12) {
              lum = 0.95;
            } else if (Math.abs(Math.abs(effigyY) - dx * 1.5) < 0.02 && dx < 0.09) {
              lum = 0.9;
            }
            lum += Math.sin(t * 3.0 + r * 0.2) * 0.05;
            break;
          }

          case 'tent-apology': {
            const faceCx = 0.58;
            const faceCy = 0.48;
            const dist = Math.sqrt((nx - faceCx) * (nx - faceCx) * 1.8 + (ny - faceCy) * (ny - faceCy));
            if (dist < 0.28) {
              lum = 0.85 - dist * 1.8 + Math.sin(ny * 35.0) * 0.06;
              rColor = 230; gColor = 180; bColor = 160;
              if (Math.abs(ny - 0.42) < 0.04 && Math.abs(nx - 0.52) < 0.05) lum = 0.15;
              if (Math.abs(ny - 0.42) < 0.04 && Math.abs(nx - 0.64) < 0.05) lum = 0.15;
              if (Math.abs(ny - 0.55) < 0.03 && Math.abs(nx - 0.58) < 0.04) lum = 0.3;
            } else {
              lum = 0.12 + Math.max(0, 0.4 - dist) * 0.4;
              rColor = 60; gColor = 80; bColor = 110;
            }
            break;
          }

          case 'griggs-cellar':
          default: {
            const wallAngle = Math.abs(nx - 0.5);
            lum = 0.25 + wallAngle * 0.35 + Math.sin(c * 0.3 + r * 0.6) * 0.1;
            if (ny < 0.18 && (c % 8 < 2)) lum = 0.7;
            if (nx > 0.18 && nx < 0.32 && ny > 0.28 && ny < 0.85) lum = 0.08;
            const beamDist = Math.sqrt(Math.pow(nx - 0.35, 2) + Math.pow(ny - 0.55, 2));
            if (beamDist < 0.35) lum += (0.35 - beamDist) * 1.4;
            break;
          }
        }

        lum += (Math.sin(r * 2.8 + t * 14.0) > 0.8 ? 0.12 : 0);
        lum = Math.max(0, Math.min(1, lum));

        const charSet = is16mm ? chars16mm : charsColor;
        const char = charSet[Math.floor(lum * (charSet.length - 1))];

        if (isColorHi8) {
          ctx.fillStyle = `rgb(${Math.floor(rColor * lum)}, ${Math.floor(gColor * lum)}, ${Math.floor(bColor * lum)})`;
        } else {
          const gray = Math.floor(lum * 240);
          ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        }

        ctx.fillText(char, c * cellW, r * cellH);
      }
    }

    // Top OSD Header
    ctx.fillStyle = 'rgba(5, 7, 5, 0.86)';
    ctx.fillRect(10, 10, width - 20, 26);

    ctx.font = '11px "Geist Mono Variable", "Geist Mono", monospace';
    ctx.fillStyle = is16mm ? '#dcd6c8' : '#e09f3e';
    ctx.fillText(`${currentSegment.reelCode} // ${currentSegment.proceduralScene.toUpperCase()}`, 18, 17);

    const tcSec = Math.floor(timecodeFrame / 24);
    const tcMin = Math.floor(tcSec / 60);
    const tcHour = Math.floor(tcMin / 60);
    const tcRemainder = timecodeFrame % 24;
    const formattedTC = `${String(tcHour).padStart(2, '0')}:${String(tcMin % 60).padStart(2, '0')}:${String(tcSec % 60).padStart(2, '0')}:${String(tcRemainder).padStart(2, '0')}`;

    ctx.fillStyle = '#f5efe4';
    ctx.fillText(`SMPTE: ${formattedTC}`, width - 180, 17);

    // Blinking REC dot
    if (Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = '#b83a2e';
      ctx.beginPath();
      ctx.arc(width - 205, 23, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [timecodeFrame, currentSegment, isVisible]);

  return (
    <section
      ref={containerRef}
      className="my-12 border border-[#232b21] bg-[#070907] shadow-2xl overflow-hidden"
    >
      {/* Tape Deck Forensic Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#0a0d0a] border-b border-[#1b2219]">
        <div>
          <div className="flex items-center gap-2.5">
            <Film className="w-4 h-4 text-[#c89446]" />
            <h4 className="font-display text-2xl text-[#f2ede4] font-normal tracking-wide">
              {title}
            </h4>
          </div>
          <p className="text-xs font-mono-tech text-[#888173] mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {cameraAsset && (
            <button
              type="button"
              onClick={() => setInspectedAsset(cameraAsset)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121612] hover:bg-[#1a2019] text-xs font-mono-tech text-[#dcd6c8] border border-[#252e22] transition cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-[#e09f3e]" />
              Camera Rig Hardware
            </button>
          )}

          <button
            type="button"
            onClick={() => setScanlinesActive((s) => !s)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono-tech border transition cursor-pointer ${
              scanlinesActive
                ? 'bg-[#141b14] border-[#2e4028] text-[#86bf97]'
                : 'bg-[#101310] border-[#1e241b] text-[#6d675b]'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">CRT Scanlines</span>
          </button>
        </div>
      </div>

      {/* Sequence Selector Ribbon */}
      <div className="flex overflow-x-auto border-b border-[#1a2118] bg-[#090b09] text-xs font-mono-tech">
        {segments.map((seg, idx) => {
          const active = idx === activeSegmentIndex;
          const is16mm = seg.gauge.includes('16mm');
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => {
                setActiveSegmentIndex(idx);
                setActiveLineIndex(0);
              }}
              className={`px-4 py-3 flex items-center gap-2.5 whitespace-nowrap border-r border-[#161d15] transition cursor-pointer ${
                active
                  ? 'bg-[#121612] text-[#f2ede4] border-b-2 border-b-[#c89446]'
                  : 'text-[#827c70] hover:text-[#dcd6c8] hover:bg-[#0d100d]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  is16mm ? 'bg-[#c8c4bc]' : 'bg-[#e09f3e]'
                }`}
              />
              <span className="tracking-wider">SEQ 0{idx + 1}: {seg.title.split(':')[1] || seg.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Viewport Stage: Procedural ASCII Canvas + Hi8 CRT Scanlines */}
      <div className="relative aspect-video bg-[#040504] border-b border-[#1a2118] overflow-hidden select-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          aria-label={`Procedural reconstruction of ${currentSegment.title}`}
        />
        {/* CRT Scanline Overlay */}
        {scanlinesActive && (
          <div className="absolute inset-0 hi8-scanlines pointer-events-none opacity-40" />
        )}

        {/* Play/Pause Overlay Control */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="p-2.5 bg-black/85 hover:bg-black text-[#f5efe4] border border-white/20 transition cursor-pointer active:scale-95"
            title={isPlaying ? 'Pause Synthesis' : 'Play Live Synthesis'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Embedded WaveSurfer Audio Waveform Player */}
      <div className="border-b border-[#1a2118]">
        <WaveformPlayer
          key={currentSegment.id}
          audioUrl={segmentAudioUrl}
          reelLabel={`${currentSegment.reelCode} · SYNC TRACK`}
          gaugeLabel={currentSegment.gauge.toUpperCase()}
          waveColor={currentSegment.gauge.includes('16mm') ? '#3b4339' : '#4d4029'}
          progressColor={currentSegment.gauge.includes('16mm') ? '#94ad8e' : '#c89446'}
        />
      </div>

      {/* Lower Deck: Metadata & Synchronized Transcript */}
      <div className="p-6 bg-[#0a0d0a] grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-mono-tech">
        {/* Left: Metadata & Location Verification */}
        <div className="lg:col-span-5 space-y-4 border-b lg:border-b-0 lg:border-r border-[#1a2118] pr-0 lg:pr-6">
          <div className="flex items-center justify-between text-[#8a8477]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c89446]" />
              TIMECODE WINDOW:
            </span>
            <span className="text-[#ece6d9] font-bold font-mono-tech">
              {currentSegment.timecodeStart} – {currentSegment.timecodeEnd}
            </span>
          </div>

          <div className="p-3.5 bg-[#0e120e] border border-[#1e261c] space-y-2">
            <div className="flex justify-between text-[#857f72]">
              <span>IN-UNIVERSE DATE:</span>
              <span className="text-[#f5a89f] font-bold">{currentSegment.fictionalDate}</span>
            </div>
            <div className="flex justify-between text-[#857f72]">
              <span>ACTUAL SHOOT DATE:</span>
              <span className="text-[#a8e0b8] font-bold">{currentSegment.realShootDate}</span>
            </div>
            <div className="flex justify-between text-[#857f72]">
              <span>VERIFIED LOCATION:</span>
              <span className="text-[#dcd6c8]">{currentSegment.realLocation}</span>
            </div>
          </div>

          <p className="text-xs text-[#a8a296] leading-relaxed">
            <strong className="text-[#ece6d9]">PRODUCTION TECHNIQUE:</strong> {currentSegment.productionNote}
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              disabled={activeSegmentIndex === 0}
              onClick={() => {
                setActiveSegmentIndex((i) => Math.max(0, i - 1));
                setActiveLineIndex(0);
              }}
              className="flex-1 py-2 bg-[#121612] hover:bg-[#1a2018] disabled:opacity-30 disabled:cursor-not-allowed border border-[#222a1f] flex items-center justify-center gap-1 text-[#dcd6c8] transition cursor-pointer"
            >
              <SkipBack className="w-3 h-3" /> Prev Sequence
            </button>
            <button
              type="button"
              disabled={activeSegmentIndex === segments.length - 1}
              onClick={() => {
                setActiveSegmentIndex((i) => Math.min(segments.length - 1, i + 1));
                setActiveLineIndex(0);
              }}
              className="flex-1 py-2 bg-[#121612] hover:bg-[#1a2018] disabled:opacity-30 disabled:cursor-not-allowed border border-[#222a1f] flex items-center justify-center gap-1 text-[#dcd6c8] transition cursor-pointer"
            >
              Next Sequence <SkipForward className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Synchronized Line-by-Line Transcript Player */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8a8477] border-b border-[#1a2118] pb-2.5 mb-3.5">
              <span className="font-bold tracking-wider text-[11px] text-[#c89446]">
                SYNCHRONIZED AUDIO / REEL TRANSCRIPT
              </span>
              <span>
                LINE {activeLineIndex + 1} OF {currentSegment.transcript.length}
              </span>
            </div>

            <div className="space-y-3">
              {currentSegment.transcript.map((lineItem, lIdx) => {
                const isActive = lIdx === activeLineIndex;
                return (
                  <div
                    key={lIdx}
                    onClick={() => setActiveLineIndex(lIdx)}
                    className={`p-3.5 border transition cursor-pointer ${
                      isActive
                        ? 'bg-[#141b14] border-[#c89446]/60 text-[#f5efe4] shadow-md'
                        : 'bg-[#0d100d] border-[#181f16] text-[#8f897d] hover:bg-[#121612] hover:text-[#c2bcb0]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="font-bold tracking-wider text-[#c89446]">
                        {lineItem.speaker}
                      </span>
                      <span className="font-mono-tech text-[#8e887b]">{lineItem.timecode}</span>
                    </div>
                    <p className="text-base font-body leading-relaxed text-[#ece6d9]">
                      "{lineItem.line}"
                    </p>
                    {lineItem.acousticNote && (
                      <div className="mt-1.5 text-[11px] text-[#88b896] italic">
                        [ACOUSTIC NOTE]: {lineItem.acousticNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#1a2118] text-[11px] text-[#7a7467] flex items-center justify-between font-mono-tech">
            <span>FORMAT: {currentSegment.gauge.toUpperCase()}</span>
            <span>SIMULATION FRAME: #{timecodeFrame}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Sliders, Eye, Sparkles, Info, RotateCcw, SplitSquareHorizontal } from 'lucide-react';
import type { ASCIIColorMode, ASCIIConfig, ASCIIPaletteId } from '../../types/enigma';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { ASCII_PALETTES, COLOR_MODES, renderAsciiToCanvas } from '../../utils/asciiRenderer';
import { useEnigma } from '../../context/EnigmaContext';

interface ASCIIImageProps {
  assetId: string;
  title: string;
  subtitle: string;
  narrativeContext: string;
  initialConfig: ASCIIConfig;
  storytellingMode: 'scroll-revelation' | 'unstable-forest' | 'artifact-scan';
}

export const ASCIIImage: React.FC<ASCIIImageProps> = ({
  assetId,
  title,
  subtitle,
  narrativeContext,
  initialConfig,
  storytellingMode,
}) => {
  const asset = ASSET_MAP[assetId];
  const { reducedMotion, setInspectedAsset } = useEnigma();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const sampleBufferRef = useRef<{
    cols: number;
    rows: number;
    data: Uint8ClampedArray;
  } | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  // Interactive ASCII parameters
  const [palette, setPalette] = useState<ASCIIPaletteId>(initialConfig.palette);
  const [cols, setCols] = useState<number>(initialConfig.cols);
  const [contrast, setContrast] = useState<number>(initialConfig.contrast);
  const [brightness, setBrightness] = useState<number>(initialConfig.brightness);
  const [threshold, setThreshold] = useState<number>(initialConfig.threshold);
  const [invert, setInvert] = useState<boolean>(initialConfig.invert);
  const [colorMode, setColorMode] = useState<ASCIIColorMode>(initialConfig.colorMode);
  const [animateDistortion, setAnimateDistortion] = useState<boolean>(
    Boolean(initialConfig.animateDistortion)
  );

  // Optical vs ASCII split position (0 = full ASCII, 100 = full Optical photo)
  const [opticalSplitPercent, setOpticalSplitPercent] = useState<number>(
    Math.round((initialConfig.initialRevealMix ?? 0.25) * 100)
  );
  const [userOverrodeSplit, setUserOverrodeSplit] = useState(false);
  const [pointerNorm, setPointerNorm] = useState<{ x: number; y: number } | null>(null);

  // Load underlying image
  useEffect(() => {
    if (!asset) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      sampleBufferRef.current = null;
      setImageLoaded(true);
    };
    img.src = asset.localPath;
  }, [asset]);

  // Observe visibility to pause work when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { rootMargin: '120px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll-driven photographic revelation when storytellingMode === 'scroll-revelation'
  useEffect(() => {
    if (storytellingMode !== 'scroll-revelation' || userOverrodeSplit || reducedMotion || !isVisible) {
      return;
    }
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress from 0 when entering bottom to 1 when leaving top
      const raw = 1 - (rect.top + rect.height * 0.35) / (vh * 0.95);
      const clamped = Math.max(0, Math.min(1, raw));
      // Smoothly transition from 68% Optical down to 12% Optical (88% ASCII revelation)
      const split = Math.round(68 - clamped * 56);
      setOpticalSplitPercent(split);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [storytellingMode, userOverrodeSplit, reducedMotion, isVisible]);

  // Render loop / static render
  useEffect(() => {
    if (!imageLoaded || !isVisible || !canvasRef.current || !imageObjRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageObjRef.current;
    const aspect = img.naturalHeight / Math.max(1, img.naturalWidth);
    // Cap cols on mobile screens for optimal performance
    const isMobile = window.innerWidth < 680;
    const effectiveCols = isMobile ? Math.min(cols, 84) : cols;
    // Characters are taller than wide (~1:1.85), so adjust rows
    const effectiveRows = Math.max(24, Math.round(effectiveCols * aspect * 0.54));

    // Re-sample offscreen buffer only when grid resolution changes
    if (
      !sampleBufferRef.current ||
      sampleBufferRef.current.cols !== effectiveCols ||
      sampleBufferRef.current.rows !== effectiveRows
    ) {
      const offscreen = document.createElement('canvas');
      offscreen.width = effectiveCols;
      offscreen.height = effectiveRows;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(img, 0, 0, effectiveCols, effectiveRows);
        const imgData = offCtx.getImageData(0, 0, effectiveCols, effectiveRows).data;
        sampleBufferRef.current = {
          cols: effectiveCols,
          rows: effectiveRows,
          data: imgData,
        };
      }
    }

    const sample = sampleBufferRef.current;
    if (!sample) return;

    const canvasWidth = 1040;
    const canvasHeight = Math.round(canvasWidth * aspect);
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    let lastDraw = 0;
    const shouldAnimate = animateDistortion && !reducedMotion;

    const drawFrame = (timestamp: number) => {
      if (shouldAnimate && timestamp - lastDraw < 48) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }
      lastDraw = timestamp;

      renderAsciiToCanvas({
        ctx,
        sampleData: sample.data,
        cols: sample.cols,
        rows: sample.rows,
        canvasWidth,
        canvasHeight,
        palette,
        contrast,
        brightness,
        threshold,
        invert,
        colorMode,
        timeSec: timestamp * 0.001,
        animateDistortion: shouldAnimate,
        emergenceProgress: 1,
        pointerNorm,
      });

      if (shouldAnimate) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
    };

    rafRef.current = requestAnimationFrame(drawFrame);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    imageLoaded,
    isVisible,
    palette,
    cols,
    contrast,
    brightness,
    threshold,
    invert,
    colorMode,
    animateDistortion,
    reducedMotion,
    pointerNorm,
  ]);

  if (!asset) return null;

  const resetDefaults = () => {
    setPalette(initialConfig.palette);
    setCols(initialConfig.cols);
    setContrast(initialConfig.contrast);
    setBrightness(initialConfig.brightness);
    setThreshold(initialConfig.threshold);
    setInvert(initialConfig.invert);
    setColorMode(initialConfig.colorMode);
    setAnimateDistortion(Boolean(initialConfig.animateDistortion));
    setOpticalSplitPercent(Math.round((initialConfig.initialRevealMix ?? 0.25) * 100));
    setUserOverrodeSplit(false);
  };

  return (
    <figure
      ref={containerRef}
      className="my-10 rounded-sm border border-[#2a2d28] bg-[#0b0d0b] overflow-hidden shadow-2xl"
    >
      {/* Top Archival Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#222520] bg-[#101210]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono-tech uppercase tracking-wider bg-[#1d241f] text-[#9ec4a9] border border-[#324236]">
            <Sparkles className="w-3 h-3" />
            ASCII Engine // {storytellingMode.replace('-', ' ')}
          </span>
          <span className="text-xs font-mono-tech text-[#8f897d] hidden sm:inline">
            [{asset.historicalStatus}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setUserOverrodeSplit(true);
              setOpticalSplitPercent((prev) => (prev > 50 ? 0 : 100));
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-tech text-[#dcd6c8] bg-[#181b18] hover:bg-[#242824] border border-[#2f342f] rounded-xs transition cursor-pointer"
            title="Toggle between pure ASCII matrix and original optical photograph"
          >
            <Eye className="w-3.5 h-3.5 text-[#c89446]" />
            {opticalSplitPercent > 50 ? 'Show Full ASCII' : 'Show Original Photo'}
          </button>

          <button
            type="button"
            onClick={() => setControlsOpen((o) => !o)}
            aria-expanded={controlsOpen}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-tech border rounded-xs transition cursor-pointer ${
              controlsOpen
                ? 'bg-[#8f241b]/25 border-[#b83a2e] text-[#f5efe4]'
                : 'bg-[#181b18] border-[#2f342f] text-[#dcd6c8] hover:bg-[#242824]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            ASCII Studio
          </button>

          <button
            type="button"
            onClick={() => setInspectedAsset(asset)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono-tech text-[#a8a296] hover:text-[#f5efe4] bg-[#141614] border border-[#2a2d28] rounded-xs transition cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            Provenance
          </button>
        </div>
      </div>

      {/* Title & Subtitle Banner */}
      <div className="px-5 pt-4 pb-3 border-b border-[#1c1f1b] bg-[#0c0e0c]">
        <h4 className="font-display text-xl sm:text-2xl text-[#ece6d9] tracking-wide">
          {title}
        </h4>
        <p className="text-xs sm:text-sm font-mono-tech text-[#969084] mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Interactive ASCII Parameter Studio Drawer */}
      {controlsOpen && (
        <div className="p-4 bg-[#121512] border-b border-[#262b26] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono-tech">
          <div>
            <label className="block text-[#969084] mb-1">CHARACTER PALETTE</label>
            <select
              value={palette}
              onChange={(e) => setPalette(e.target.value as ASCIIPaletteId)}
              className="w-full bg-[#090b09] border border-[#2f362f] text-[#dcd6c8] px-2.5 py-1.5 rounded-xs"
            >
              {Object.entries(ASCII_PALETTES).map(([id, info]) => (
                <option key={id} value={id}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#969084] mb-1">COLOR TREATMENT</label>
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value as ASCIIColorMode)}
              className="w-full bg-[#090b09] border border-[#2f362f] text-[#dcd6c8] px-2.5 py-1.5 rounded-xs"
            >
              {Object.entries(COLOR_MODES).map(([id, info]) => (
                <option key={id} value={id}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex justify-between text-[#969084] mb-1">
              <span>DENSITY (COLS)</span>
              <span className="text-[#dcd6c8]">{cols} cols</span>
            </label>
            <input
              type="range"
              min={55}
              max={155}
              step={5}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="w-full accent-[#b83a2e]"
            />
          </div>

          <div>
            <label className="flex justify-between text-[#969084] mb-1">
              <span>CONTRAST</span>
              <span className="text-[#dcd6c8]">{contrast.toFixed(2)}x</span>
            </label>
            <input
              type="range"
              min={0.6}
              max={2.4}
              step={0.05}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-[#b83a2e]"
            />
          </div>

          <div>
            <label className="flex justify-between text-[#969084] mb-1">
              <span>BRIGHTNESS</span>
              <span className="text-[#dcd6c8]">{brightness >= 0 ? `+${brightness.toFixed(2)}` : brightness.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={-0.35}
              max={0.35}
              step={0.02}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-[#b83a2e]"
            />
          </div>

          <div>
            <label className="flex justify-between text-[#969084] mb-1">
              <span>SHADOW THRESHOLD</span>
              <span className="text-[#dcd6c8]">{threshold.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0}
              max={0.45}
              step={0.02}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[#b83a2e]"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <label className="inline-flex items-center gap-2 cursor-pointer text-[#dcd6c8]">
              <input
                type="checkbox"
                checked={invert}
                onChange={(e) => setInvert(e.target.checked)}
                className="accent-[#b83a2e]"
              />
              Invert Luminance
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-[#dcd6c8]">
              <input
                type="checkbox"
                checked={animateDistortion}
                onChange={(e) => setAnimateDistortion(e.target.checked)}
                className="accent-[#b83a2e]"
              />
              Wind Interference
            </label>
          </div>

          <div className="flex items-center justify-end pt-3">
            <button
              type="button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1f1b] hover:bg-[#262c26] text-[#dcd6c8] border border-[#343b34] rounded-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Preset
            </button>
          </div>
        </div>
      )}

      {/* Viewport Stage: Layered ASCII Canvas + Optical Split Comparison */}
      <div
        className="relative w-full bg-[#070807] select-none overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPointerNorm({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
          });
        }}
        onMouseLeave={() => setPointerNorm(null)}
      >
        {/* Base Layer: Live ASCII Canvas */}
        <canvas
          ref={canvasRef}
          className="block w-full h-auto"
          aria-label={`ASCII rendering of ${asset.title}`}
        />

        {/* Optical Overlay Layer clipped by opticalSplitPercent */}
        {opticalSplitPercent > 0 && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - opticalSplitPercent}% 0 0)`,
            }}
          >
            <img
              src={asset.localPath}
              alt={asset.description}
              className="w-full h-full object-cover filter contrast-110 saturate-75"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/75 border border-white/20 text-[10px] font-mono-tech text-[#ece6d9] uppercase tracking-widest">
              Optical Archive Source ({opticalSplitPercent}%)
            </div>
          </div>
        )}

        {/* Vertical Split Divider Line */}
        {opticalSplitPercent > 1 && opticalSplitPercent < 99 && (
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#c89446]/80 pointer-events-none shadow-[0_0_12px_rgba(200,148,70,0.8)]"
            style={{ left: `${opticalSplitPercent}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-xs bg-[#14120e] border border-[#c89446] text-[10px] font-mono-tech text-[#f2e9d8] whitespace-nowrap">
              OPTICAL ◄► ASCII
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/75 border border-white/15 text-[10px] font-mono-tech text-[#9ec4a9] uppercase tracking-widest pointer-events-none">
          ASCII Matrix ({100 - opticalSplitPercent}%)
        </div>
      </div>

      {/* Interactive Optical / ASCII Scrub Bar & Narrative Caption */}
      <figcaption className="p-4 sm:p-5 bg-[#0e100e] border-t border-[#1f231f]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 mb-3 border-b border-[#1d211d]">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-[#a8a296]">
            <SplitSquareHorizontal className="w-4 h-4 text-[#c89446]" />
            <span>OPTICAL / ASCII REVELATION SCRUBBER:</span>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <span className="text-[11px] font-mono-tech text-[#9ec4a9]">100% ASCII</span>
            <input
              type="range"
              min={0}
              max={100}
              value={opticalSplitPercent}
              onChange={(e) => {
                setUserOverrodeSplit(true);
                setOpticalSplitPercent(Number(e.target.value));
              }}
              aria-label="Scrub between pure ASCII rendering and original photograph"
              className="flex-1 accent-[#c89446] cursor-pointer"
            />
            <span className="text-[11px] font-mono-tech text-[#c89446]">100% PHOTO</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#d2ccc0] leading-relaxed">
          {narrativeContext}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-[#857f74]">
          <span>
            SOURCE: {asset.title} — {asset.creator} ({asset.license})
          </span>
          {asset.coordinates && <span>COORDS: {asset.coordinates}</span>}
        </div>
      </figcaption>
    </figure>
  );
};

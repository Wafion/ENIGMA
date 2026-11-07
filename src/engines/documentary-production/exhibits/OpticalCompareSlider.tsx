import { useState, useRef, useCallback } from 'react';
import type { OpticalCompareConfig } from '../../../core/types/exhibits';

interface OpticalCompareSliderProps {
  config: OpticalCompareConfig;
  className?: string;
}

export function OpticalCompareSlider({ config, className = '' }: OpticalCompareSliderProps) {
  const [splitPercent, setSplitPercent] = useState<number>(config.initialSplitPercent || 50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateSplit = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSplitPercent(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSplit(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSplit(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <figure className={`optical-compare-slider my-16 rounded border border-[#2b3528] bg-[#0c100c] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#212b1e] bg-[#111610] flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase text-[#8c4a32] tracking-wider block mb-0.5">
            [ COMPARATIVE REVELATION · CURTAIN SPLIT SLIDER ]
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#ece7dc]">{config.title}</h3>
          <p className="font-serif text-xs text-[#9da897]">{config.subtitle}</p>
        </div>
      </div>

      {/* Slider Viewport */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-label={`${config.title} comparison slider`}
        aria-valuenow={splitPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setSplitPercent((p) => Math.max(0, p - 5));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setSplitPercent((p) => Math.min(100, p + 5));
          } else if (e.key === 'Home') {
            e.preventDefault();
            setSplitPercent(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            setSplitPercent(100);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] select-none cursor-ew-resize overflow-hidden bg-[#070907] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c4a32]"
      >
        {/* Right Side (Underlying / Forensic Reality) */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#0e130e]">
          {config.secondaryImageSrc ? (
            <img
              src={config.secondaryImageSrc}
              alt={config.rightLabel}
              className="w-full h-full object-cover grayscale contrast-125"
            />
          ) : (
            <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center font-mono text-xs text-[#8da087] bg-[radial-gradient(#1e281b_1px,transparent_1px)] [background-size:16px_16px]">
              <span className="text-[#8c4a32] text-sm font-bold mb-2">VERIFIED FORENSIC RECORD</span>
              <p className="max-w-md font-serif text-sm text-[#cbd6c6]">
                Physical evidence confirms the cuts were delivered from the inside out with an internal blade.
              </p>
            </div>
          )}
          <span className="absolute bottom-4 right-4 font-mono text-xs uppercase px-2 py-1 rounded bg-black/80 text-[#d8e2d4] border border-[#2e3c2a]">
            {config.rightLabel}
          </span>
        </div>

        {/* Left Side (Clipped / Foreground Lore or Optical Scan) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
        >
          {config.primaryImageSrc ? (
            <img
              src={config.primaryImageSrc}
              alt={config.leftLabel}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center font-mono text-xs text-[#e1dcd1] bg-[#161c14] bg-[radial-gradient(#2d3b2a_1px,transparent_1px)] [background-size:16px_16px]">
              <span className="text-amber-400 text-sm font-bold mb-2">POPULAR CLAIM / IN-UNIVERSE LORE</span>
              <p className="max-w-md font-serif text-sm text-[#e6ded1] italic">
                Contemporary rumors alleged an outside assailant or Mansi hunters attacked the shelter from the exterior.
              </p>
            </div>
          )}
          <span className="absolute bottom-4 left-4 font-mono text-xs uppercase px-2 py-1 rounded bg-black/80 text-[#8c4a32] border border-[#3c2a22]">
            {config.leftLabel}
          </span>
        </div>

        {/* Drag Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-[#8c4a32] shadow-[0_0_12px_#8c4a32]"
          style={{ left: `${splitPercent}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#121611] border-2 border-[#8c4a32] text-white flex items-center justify-center text-[10px] font-mono select-none shadow-xl">
            ◄►
          </div>
        </div>
      </div>

      <div className="p-3 bg-[#0e120c] border-t border-[#1e271a] text-center font-mono text-[11px] text-[#6e7e6a]">
        Drag or swipe divider to compare historical claim vs verified reality.
      </div>
    </figure>
  );
}

import { useState, useRef } from 'react';
import { Compass, ZoomIn, ZoomOut, Layers, RotateCcw } from 'lucide-react';
import type { ForensicMapPlateConfig, MapCoordinatePin } from '../../../core/types/exhibits';

interface ForensicMapPlateProps {
  config: ForensicMapPlateConfig;
  className?: string;
  baseMapUrl?: string;
  secondaryMapUrl?: string;
}

export function ForensicMapPlate({
  config,
  className = '',
  baseMapUrl,
  secondaryMapUrl,
}: ForensicMapPlateProps) {
  const [activePin, setActivePin] = useState<MapCoordinatePin | null>(config.pins[0] || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showSecondaryLayer, setShowSecondaryLayer] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeMapSrc = showSecondaryLayer
    ? secondaryMapUrl || baseMapUrl || '/assets/blair-witch/images/frederick-map-1861.jpg'
    : baseMapUrl || '/assets/blair-witch/images/frederick-map-1858.jpg';

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(1, Math.min(3.2, Number((prev + delta).toFixed(2)))));
  };

  const handleReset = () => {
    setZoomLevel(1);
  };

  return (
    <figure className={`forensic-map-plate my-16 rounded border border-[#2b3528] bg-[#0b0e0a] overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-[#20281c] bg-[#111610] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase text-[#8c4a32] tracking-wider block mb-0.5">
            [ CARTOGRAPHIC EVIDENCE PLATE · VERIFIED GEOGRAPHIC COORDINATES ]
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#ece7dc]">{config.title}</h3>
          <p className="font-serif text-xs text-[#9da897]">{config.subtitle}</p>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(config.secondaryMapAssetId || secondaryMapUrl) && (
            <button
              type="button"
              onClick={() => setShowSecondaryLayer(!showSecondaryLayer)}
              className={`px-2.5 py-1 rounded border flex items-center gap-1 transition-colors ${
                showSecondaryLayer
                  ? 'border-[#8c4a32] bg-[#221612] text-[#8c4a32]'
                  : 'border-[#293525] bg-[#151c13] text-[#8a9984]'
              }`}
            >
              <Layers size={13} />
              <span>{showSecondaryLayer ? 'Secondary Relief' : 'Primary Survey'}</span>
            </button>
          )}

          <div className="flex rounded border border-[#293525] bg-[#151c13]">
            <button
              type="button"
              onClick={() => handleZoom(0.3)}
              aria-label="Zoom in"
              className="px-2 py-1 hover:text-[#ece7dc] text-[#8a9984] border-r border-[#293525]"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.3)}
              aria-label="Zoom out"
              className="px-2 py-1 hover:text-[#ece7dc] text-[#8a9984] border-r border-[#293525]"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset zoom"
              className="px-2 py-1 hover:text-[#ece7dc] text-[#8a9984]"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Real Map Viewport Area */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#070907] overflow-hidden select-none cursor-crosshair"
      >
        <div
          className="w-full h-full transition-transform duration-300 origin-center relative"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Authentic High-Resolution Cartographic Basemap Image */}
          <img
            src={activeMapSrc}
            alt="Historical Cartographic Survey Plate"
            className="w-full h-full object-cover filter contrast-[1.08] brightness-[0.88] select-none pointer-events-none"
            loading="lazy"
            decoding="async"
          />

          {/* Coordinate Pins pinned to real coordinates */}
          {config.pins.map((pin) => {
            const isSelected = activePin?.id === pin.id;
            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => setActivePin(pin)}
                aria-pressed={isSelected}
                aria-label={`Pin: ${pin.label}, Coordinates: ${pin.coordinates}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c4a32] rounded-full z-10"
                style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
              >
                <div
                  className={`relative flex items-center justify-center transition-all ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  <span
                    className={`absolute w-8 h-8 rounded-full animate-ping opacity-30 ${
                      isSelected ? 'bg-[#8c4a32]' : 'bg-[#40543c]'
                    }`}
                  />
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-colors ${
                      isSelected
                        ? 'bg-[#8c4a32] text-white border-white shadow-lg shadow-[#8c4a32]/50'
                        : 'bg-[#121811] text-[#b5c7b0] border-[#364731] group-hover:border-[#8c4a32]'
                    }`}
                  >
                    {pin.code}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Compass & Datum Legend */}
        <div className="absolute bottom-4 left-4 p-2 rounded border border-[#212a1d] bg-[#0b0e0a]/90 font-mono text-[10px] text-[#71816e] flex items-center gap-2 pointer-events-none shadow-md">
          <Compass size={15} className="text-[#8c4a32]" />
          <span>REAL CARTOGRAPHIC SURVEY · WGS84</span>
        </div>
      </div>

      {/* Selected Location Dossier Drawer */}
      {activePin && (
        <div className="p-4 sm:p-5 border-t border-[#20281c] bg-[#0e120c] flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#8c4a32] font-semibold">{activePin.code}</span>
              <span className="text-[#72836f]">·</span>
              <span className="text-[#e6ded1] font-bold">{activePin.realLocationName}</span>
              {activePin.elevationMeters && (
                <span className="text-[#8c4a32]">({activePin.elevationMeters}m Elevation)</span>
              )}
            </div>
            <p className="font-serif text-sm text-[#c8d4c4] leading-relaxed">
              {activePin.description}
            </p>
          </div>

          <div className="text-right font-mono text-[11px] text-[#6d7e68] shrink-0">
            <div className="text-[#8c4a32] font-semibold uppercase text-[9px] tracking-wider">Verified Coordinates</div>
            <div className="text-[#e1dcd1] font-mono">{activePin.coordinates}</div>
          </div>
        </div>
      )}
    </figure>
  );
}

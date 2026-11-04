import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Navigation, Layers, Info, CheckCircle, ShieldAlert, Crosshair, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { MapMarkerItem } from '../../types/enigma';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

interface InteractiveMapProps {
  title: string;
  subtitle: string;
  baseMapAssetId: string;
  secondaryMapAssetId?: string;
  markers: MapMarkerItem[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  title,
  subtitle,
  baseMapAssetId,
  secondaryMapAssetId,
  markers,
}) => {
  const { setInspectedAsset } = useEnigma();
  const [activeMapId, setActiveMapId] = useState<string>(baseMapAssetId);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(markers[0]?.id || '');
  const [activeLayerFilter, setActiveLayerFilter] = useState<'all' | 'lore' | 'production'>('all');

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const mapAsset = ASSET_MAP[activeMapId] || ASSET_MAP[baseMapAssetId];
  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || markers[0];

  const handleZoomIn = () => setZoom((z) => Math.min(3.5, z + 0.4));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, z - 0.4);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || zoom <= 1) return;
      const maxPanX = (zoom - 1) * 280;
      const maxPanY = (zoom - 1) * 200;
      const nextX = Math.max(-maxPanX, Math.min(maxPanX, e.clientX - dragStartRef.current.x));
      const nextY = Math.max(-maxPanY, Math.min(maxPanY, e.clientY - dragStartRef.current.y));
      setPan({ x: nextX, y: nextY });
    },
    [isDragging, zoom]
  );

  const handleMouseUp = () => setIsDragging(false);

  // Keyboard navigation (+ / - to zoom, arrow keys to pan)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      } else if (zoom > 1) {
        if (e.key === 'ArrowLeft') setPan((p) => ({ ...p, x: p.x + 30 }));
        if (e.key === 'ArrowRight') setPan((p) => ({ ...p, x: p.x - 30 }));
        if (e.key === 'ArrowUp') setPan((p) => ({ ...p, y: p.y + 30 }));
        if (e.key === 'ArrowDown') setPan((p) => ({ ...p, y: p.y - 30 }));
      }
    };

    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, [zoom]);

  const filteredMarkers = markers.filter((m) => {
    if (activeLayerFilter === 'all') return true;
    if (activeLayerFilter === 'lore') return m.layer === 'fictional-lore' || m.layer === 'both';
    if (activeLayerFilter === 'production') return m.layer === 'real-production' || m.layer === 'both';
    return true;
  });

  return (
    <section className="my-14 border border-[#20271e] bg-[#070907] shadow-2xl overflow-hidden">
      {/* Cartographic Plate Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#0a0d0a] border-b border-[#1a2118]">
        <div>
          <div className="flex items-center gap-2.5">
            <Navigation className="w-4 h-4 text-[#c89446]" />
            <h4 className="font-display text-2xl text-[#f2ede4] font-normal tracking-wide">{title}</h4>
          </div>
          <p className="text-xs font-mono-tech text-[#8e887b] mt-1">{subtitle}</p>
        </div>

        {/* Map Variant & Provenance Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {secondaryMapAssetId && (
            <div className="flex items-center gap-1 p-1 bg-[#101410] border border-[#222a1f] text-xs font-mono-tech">
              <Layers className="w-3.5 h-3.5 text-[#868072] ml-1" />
              <button
                type="button"
                onClick={() => setActiveMapId(baseMapAssetId)}
                className={`px-2.5 py-1 transition cursor-pointer ${
                  activeMapId === baseMapAssetId
                    ? 'bg-[#1e261c] text-[#f2ede4] font-bold'
                    : 'text-[#8a8477] hover:text-[#dcd6c8]'
                }`}
              >
                1858 Bond Survey
              </button>
              <button
                type="button"
                onClick={() => setActiveMapId(secondaryMapAssetId)}
                className={`px-2.5 py-1 transition cursor-pointer ${
                  activeMapId === secondaryMapAssetId
                    ? 'bg-[#1e261c] text-[#f2ede4] font-bold'
                    : 'text-[#8a8477] hover:text-[#dcd6c8]'
                }`}
              >
                1861 Military Relief
              </button>
            </div>
          )}

          {mapAsset && (
            <button
              type="button"
              onClick={() => setInspectedAsset(mapAsset)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121612] hover:bg-[#1a2018] text-xs font-mono-tech text-[#dcd6c8] border border-[#222a1f] transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#c89446]" />
              LOC Provenance Record
            </button>
          )}
        </div>
      </div>

      {/* Layer Filter Ribbon */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#090b09] border-b border-[#181e16] text-[11px] font-mono-tech text-[#7a7467]">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider">FILTER SITES:</span>
          <button
            type="button"
            onClick={() => setActiveLayerFilter('all')}
            className={`px-2 py-0.5 border transition cursor-pointer ${
              activeLayerFilter === 'all'
                ? 'bg-[#182017] border-[#384833] text-[#dcd6c8]'
                : 'border-transparent text-[#6e685c] hover:text-[#dcd6c8]'
            }`}
          >
            All Waypoints ({markers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveLayerFilter('lore')}
            className={`px-2 py-0.5 border transition cursor-pointer ${
              activeLayerFilter === 'lore'
                ? 'bg-[#8f241b]/20 border-[#b83a2e]/60 text-[#f5a89f]'
                : 'border-transparent text-[#6e685c] hover:text-[#dcd6c8]'
            }`}
          >
            Fictional Lore Sites
          </button>
          <button
            type="button"
            onClick={() => setActiveLayerFilter('production')}
            className={`px-2 py-0.5 border transition cursor-pointer ${
              activeLayerFilter === 'production'
                ? 'bg-[#293d2e]/20 border-[#436e4f]/60 text-[#a8e0b8]'
                : 'border-transparent text-[#6e685c] hover:text-[#dcd6c8]'
            }`}
          >
            Real Production Sites
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span>ZOOM: {Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Cartographic Stage with Interactive Coordinate Crosshairs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Map Viewport */}
        <div
          ref={viewportRef}
          tabIndex={0}
          role="region"
          aria-label="Interactive historical map with pan and zoom"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`lg:col-span-7 relative aspect-[4/3] bg-[#050605] overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-[#1a2118] focus:outline-none ${
            zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-crosshair'
          }`}
        >
          {/* Zoomable Container */}
          <div
            className="w-full h-full relative transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
            }}
          >
            {mapAsset && (
              <img
                src={mapAsset.localPath}
                alt={mapAsset.description}
                className="w-full h-full object-cover filter contrast-115 sepia-[0.18] brightness-90 pointer-events-none"
                loading="lazy"
              />
            )}

            {/* Coordinate Hairline Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 border border-white/20">
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30" />
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30" />
            </div>

            {/* Location Markers */}
            {filteredMarkers.map((m) => {
              const isSelected = m.id === selectedMarkerId;
              const isLoreMarker = m.layer === 'fictional-lore';
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarkerId(m.id);
                  }}
                  style={{
                    left: `${m.xPercent}%`,
                    top: `${m.yPercent}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                  }`}
                  title={`${m.label} (${m.coordinates})`}
                >
                  <div
                    className={`p-1.5 border-2 shadow-2xl flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-[#c89446] border-[#f5efe4] text-black shadow-[0_0_16px_rgba(200,148,70,0.9)]'
                        : isLoreMarker
                        ? 'bg-[#181010] border-[#b83a2e] text-[#f5a89f] hover:bg-[#201414]'
                        : 'bg-[#101410] border-[#c89446] text-[#c89446] hover:bg-[#181f16]'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </div>
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 whitespace-nowrap text-[9px] font-mono-tech border transition ${
                      isSelected
                        ? 'bg-[#090b09] border-[#c89446] text-[#f2ede4] font-bold opacity-100 shadow-md'
                        : 'bg-black/90 border-white/20 text-[#c2bcb0] opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {m.code} · {m.label.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Zoom Controls HUD (bottom right) */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 z-30 bg-black/85 border border-white/20 p-1">
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Zoom in on map"
              className="p-1.5 hover:bg-white/10 text-[#dcd6c8] transition cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Zoom out on map"
              className="p-1.5 hover:bg-white/10 text-[#dcd6c8] transition cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Reset zoom and center map"
              className="p-1.5 hover:bg-white/10 text-[#dcd6c8] transition cursor-pointer"
              title="Reset Zoom (0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Attribution HUD (bottom left) */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/85 border border-white/15 text-[10px] font-mono-tech text-[#9e988b]">
            DATUM: {mapAsset?.title.slice(0, 42)}...
          </div>
        </div>

        {/* Selected Marker Geographic Dossier */}
        <div className="lg:col-span-5 p-6 bg-[#0a0c0a] flex flex-col justify-between">
          {selectedMarker ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1a2118] pb-3 text-xs font-mono-tech">
                <span className="font-bold text-[#c89446] tracking-wider">
                  SURVEY CODE: {selectedMarker.code}
                </span>
                <span className="text-[#888376] font-mono-tech">{selectedMarker.coordinates}</span>
              </div>

              <div>
                <h5 className="font-display text-2xl sm:text-3xl text-[#f2ede4] font-normal leading-tight">
                  {selectedMarker.label}
                </h5>
                <p className="mt-1 text-xs font-mono-tech text-[#888376]">
                  COORDINATES: {selectedMarker.coordinates}
                </p>
              </div>

              {/* Description */}
              <p className="text-base text-[#cac4b6] leading-relaxed font-body">
                {selectedMarker.description}
              </p>

              {/* Epistemic Split for this location */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-[#120e0d] border-l-2 border-[#b83a2e] border-y border-r border-[#221815] text-xs">
                  <div className="flex items-center gap-1.5 font-mono-tech text-[#e06d60] font-bold uppercase text-[10px] mb-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> IN-UNIVERSE MYTHOLOGY:
                  </div>
                  <p className="text-[#decbc7] leading-relaxed font-body">
                    {selectedMarker.fictionalLocationName}
                  </p>
                </div>

                <div className="p-3.5 bg-[#0d1410] border-l-2 border-[#436e4f] border-y border-r border-[#18261d] text-xs">
                  <div className="flex items-center gap-1.5 font-mono-tech text-[#60c07d] font-bold uppercase text-[10px] mb-1">
                    <CheckCircle className="w-3.5 h-3.5" /> VERIFIED GEOGRAPHIC / PRODUCTION RECORD:
                  </div>
                  <p className="text-[#cde2d3] leading-relaxed font-body">
                    {selectedMarker.realLocationName}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs font-mono-tech text-[#888376]">
              Select a cartographic marker on the survey map to inspect location dossier.
            </div>
          )}

          <div className="mt-6 pt-3 border-t border-[#1a2118] flex items-center justify-between text-[11px] font-mono-tech text-[#736e63]">
            <span>GEODETIC REF: MARYLAND STATE PLANE</span>
            <span>GRID: WGS84</span>
          </div>
        </div>
      </div>
    </section>
  );
};

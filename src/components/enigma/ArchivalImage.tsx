import React from 'react';
import { Info, Maximize2, Camera } from 'lucide-react';
import type { ArchivalImageTreatment } from '../../types/enigma';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

interface ArchivalImageProps {
  assetId: string;
  treatment: ArchivalImageTreatment;
  caption: string;
  archivalNote: string;
  aspectRatio?: string;
}

export const ArchivalImage: React.FC<ArchivalImageProps> = ({
  assetId,
  treatment,
  caption,
  archivalNote,
  aspectRatio,
}) => {
  const asset = ASSET_MAP[assetId];
  const { setInspectedAsset } = useEnigma();

  if (!asset) return null;

  const isFictional = asset.historicalStatus === 'Reconstructed fictional material';
  const isHistorical = asset.historicalStatus === 'Genuine historical material';
  const isProduction = asset.historicalStatus === 'Genuine production or promotional material';

  const badgeBorder = isFictional
    ? 'border-[#b83a2e]/60 text-[#f5a89f] bg-[#8f241b]/20'
    : isHistorical
    ? 'border-[#a89060]/60 text-[#fae1a8] bg-[#a89060]/20'
    : isProduction
    ? 'border-[#4a7a9e]/60 text-[#bad8f0] bg-[#3b5e7d]/20'
    : 'border-[#436e4f]/60 text-[#a8e0b8] bg-[#293d2e]/20';

  const renderContent = () => {
    switch (treatment) {
      case 'contact-sheet':
        // Authentic darkroom proofing contact sheet with frame numbers & grease-pencil crop marks
        return (
          <div className="relative bg-[#0a0c0a] p-3 border border-[#222720] shadow-2xl group">
            {/* Darkroom Contact Sheet Header */}
            <div className="flex items-center justify-between text-[9px] font-mono-tech text-[#736e63] mb-2 px-1 border-b border-[#1c201a] pb-1.5 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#c89446]">KODAK TRI-X 400</span>
                <span>PROOF ROLL #{asset.id.slice(-4).toUpperCase()}</span>
              </div>
              <span className="text-[#a8594e]">FRAME 16A [SELECTED]</span>
            </div>

            {/* Photographic Frame with Grease-Pencil Overlay */}
            <div className="relative overflow-hidden aspect-[4/5] bg-black border border-[#1a1e18]">
              <img
                src={asset.localPath}
                alt={asset.title}
                className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />

              {/* Grease-Pencil Editor Crop Marks (Angular Corners) */}
              <div className="absolute inset-3 border-2 border-[#d46535]/80 pointer-events-none opacity-85">
                <span className="absolute -top-3 left-2 bg-[#0a0c0a] px-1 text-[8px] font-mono-tech text-[#d46535] font-bold">
                  CROP 1:1.33
                </span>
              </div>

              {/* Inspect Button */}
              <button
                type="button"
                onClick={() => setInspectedAsset(asset)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-xs font-mono-tech text-[#f2ede4] transition-opacity cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 text-[#c89446]" />
                Inspect Negative &amp; Provenance
              </button>
            </div>

            {/* Bottom Edge Registration Numbers */}
            <div className="mt-2 flex items-center justify-between text-[8px] font-mono-tech text-[#585349] px-1">
              <span>▶ 16A</span>
              <span>SAFETY FILM 5063</span>
              <span>17 ◀</span>
            </div>
          </div>
        );

      case 'film-strip':
        // Real 16mm celluloid strip with perforated sprocket holes & optical track
        return (
          <div className="relative bg-[#060806] p-2 sm:p-3 border-y-2 border-[#1c221a]">
            {/* Top Sprocket Rail */}
            <div className="h-4 flex items-center justify-between px-2 mb-2 bg-[#0d100d] border border-[#1a2018]">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="w-2 h-2.5 rounded-xs bg-[#1f261e] border border-black/80" />
              ))}
            </div>

            {/* Main Visual Film Frame */}
            <div className="relative overflow-hidden aspect-video bg-black group border border-[#232920]">
              <img
                src={asset.localPath}
                alt={asset.title}
                className="w-full h-full object-cover contrast-110 brightness-95 group-hover:scale-[1.01] transition-transform duration-700"
                loading="lazy"
              />

              {/* Optical soundtrack strip along the left margin */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#0d100d]/90 border-r border-[#2a3428] pointer-events-none hidden sm:flex flex-col justify-around py-1">
                {[...Array(12)].map((_, i) => (
                  <span
                    key={i}
                    className="w-full h-[1px] bg-[#60705c]/60"
                    style={{ opacity: (i % 3) * 0.4 + 0.2 }}
                  />
                ))}
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 left-4 sm:left-6 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 text-[9px] font-mono-tech uppercase font-bold border rounded-xs backdrop-blur-md ${badgeBorder}`}>
                  16MM REVERSAL // {asset.historicalStatus}
                </span>
              </div>

              {/* Inspect Button */}
              <button
                type="button"
                onClick={() => setInspectedAsset(asset)}
                className="absolute bottom-2 right-2 p-1.5 bg-black/80 hover:bg-black text-[#f2ede4] rounded-xs border border-white/20 transition cursor-pointer"
                title="View Full Provenance"
              >
                <Maximize2 className="w-4 h-4 text-[#c89446]" />
              </button>
            </div>

            {/* Bottom Sprocket Rail */}
            <div className="h-4 flex items-center justify-between px-2 mt-2 bg-[#0d100d] border border-[#1a2018]">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="w-2 h-2.5 rounded-xs bg-[#1f261e] border border-black/80" />
              ))}
            </div>
          </div>
        );

      case 'scanned-dossier':
        // Declassified police exhibit folder style
        return (
          <div className="relative bg-[#111311] p-4 border border-[#2b3028] shadow-2xl">
            {/* Dossier Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-2.5 mb-3 border-b border-[#222720] text-xs font-mono-tech gap-2">
              <div className="flex items-center gap-2 text-[#9a9486]">
                <Camera className="w-3.5 h-3.5 text-[#c89446]" />
                <span className="font-bold text-[#ece6d9]">EXHIBIT #{asset.id.toUpperCase()}</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border rounded-xs ${badgeBorder}`}>
                {asset.historicalStatus}
              </span>
            </div>

            {/* Visual Plate */}
            <div className="relative overflow-hidden aspect-[4/3] bg-black group border border-[#1f241d]">
              <img
                src={asset.localPath}
                alt={asset.title}
                className="w-full h-full object-cover contrast-110 group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <button
                  type="button"
                  onClick={() => setInspectedAsset(asset)}
                  className="px-3 py-1.5 text-xs font-mono-tech bg-[#181d18] text-[#f2ede4] border border-[#3b4339] rounded-xs hover:bg-[#252c23] transition cursor-pointer"
                >
                  Inspect Archival Dossier Record →
                </button>
              </div>
            </div>
          </div>
        );

      case 'monochrome-plate':
        // Museum-grade fine art photographic plate
        return (
          <div className="relative bg-[#0d0f0d] p-4 sm:p-6 border border-[#222620] shadow-xl">
            <div className="relative overflow-hidden aspect-video bg-black group border border-[#1b1f1a]">
              <img
                src={asset.localPath}
                alt={asset.title}
                className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => setInspectedAsset(asset)}
                className="absolute bottom-3 right-3 p-2 bg-black/80 hover:bg-black text-[#f2ede4] rounded-xs border border-white/20 transition cursor-pointer"
                title="Inspect Archival Record"
              >
                <Maximize2 className="w-4 h-4 text-[#c89446]" />
              </button>
            </div>
          </div>
        );

      case 'editorial-large':
      default:
        // High-impact full-width editorial plate
        return (
          <div className="relative bg-[#0b0d0b] border-y border-[#20251f] overflow-hidden">
            <div className="relative overflow-hidden group bg-black" style={{ aspectRatio: aspectRatio || '16/9' }}>
              <img
                src={asset.localPath}
                alt={asset.title}
                className="w-full h-full object-cover contrast-110 brightness-95 group-hover:scale-[1.01] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 text-[10px] font-mono-tech uppercase font-bold border backdrop-blur-md rounded-xs ${badgeBorder}`}>
                  {asset.historicalStatus}
                </span>
                {asset.truthLayer && (
                  <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono-tech bg-black/85 text-[#9a9486] border border-white/10 uppercase rounded-xs">
                    {asset.truthLayer}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setInspectedAsset(asset)}
                className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-black text-[#dcd6c8] border border-white/15 rounded-xs transition cursor-pointer"
                title="View Full Provenance"
              >
                <Info className="w-4 h-4 text-[#c89446]" />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <figure className="my-8">
      {renderContent()}
      <figcaption className="mt-3 px-1">
        <p className="text-sm text-[#d4cec2] font-normal leading-relaxed">
          {caption}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-[#807a6f]">
          <span className="italic">{archivalNote}</span>
          <button
            type="button"
            onClick={() => setInspectedAsset(asset)}
            className="hover:text-[#c89446] underline decoration-dotted transition cursor-pointer"
          >
            Provenance &amp; Source Details →
          </button>
        </div>
      </figcaption>
    </figure>
  );
};

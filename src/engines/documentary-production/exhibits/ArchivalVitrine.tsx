import { useState } from 'react';
import { ZoomIn, Lock, Unlock } from 'lucide-react';
import type { ArchivalVitrineConfig } from '../../../core/types/exhibits';

interface ArchivalVitrineProps {
  config: ArchivalVitrineConfig;
  className?: string;
}

export function ArchivalVitrine({ config, className = '' }: ArchivalVitrineProps) {
  const [unredactedMap, setUnredactedMap] = useState<Record<string, boolean>>({});
  const [loupeActive, setLoupeActive] = useState(false);

  const toggleRedaction = (id: string) => {
    setUnredactedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <figure className={`archival-vitrine my-16 rounded border border-[#2d3829] bg-[#0c100c] overflow-hidden ${className}`}>
      {/* Vitrine Header */}
      <div className="p-4 sm:p-5 border-b border-[#212b1e] bg-[#111710] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase text-[#8c4a32] tracking-wider block mb-0.5">
            [ ARCHIVAL VITRINE · DECLASSIFIED RECORD {config.dossierCode} ]
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#ece7dc]">{config.title}</h3>
          <p className="font-serif text-xs text-[#9da897]">
            {config.institutionOrOrigin} · {config.dateStamp}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setLoupeActive(!loupeActive)}
            className={`px-3 py-1.5 rounded border flex items-center gap-1.5 transition-colors ${
              loupeActive
                ? 'border-[#8c4a32] bg-[#221612] text-[#8c4a32]'
                : 'border-[#283524] bg-[#141b12] text-[#8c9c86] hover:text-[#e1dcd1]'
            }`}
          >
            <ZoomIn size={13} />
            <span>{loupeActive ? 'Exit Loupe' : 'Magnify Loupe'}</span>
          </button>
        </div>
      </div>

      {/* Document Platter (Aged Parchment / Soviet Carbon Paper Surface) */}
      <div className="p-6 sm:p-10 bg-[#070907] flex justify-center items-center">
        <div
          className={`relative max-w-2xl w-full p-6 sm:p-8 rounded-sm border shadow-2xl transition-all duration-300 ${
            loupeActive
              ? 'scale-105 border-[#8c4a32] bg-[#e4ded3] text-[#131612]'
              : 'border-[#3c4a36] bg-[#dad4c5] text-[#161a14]'
          }`}
          style={{
            backgroundImage: 'radial-gradient(#d0c9b8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Declassified Stamp */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-red-800 text-red-900 font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rotate-6 pointer-events-none select-none opacity-85">
            DECLASSIFIED · GASO #659
          </div>

          {/* Document Header Text */}
          <div className="border-b border-[#988f7c] pb-4 mb-4 font-mono text-[11px] text-[#4b5545] space-y-0.5">
            <div>FILE DOCKET: {config.dossierCode}</div>
            <div>ORIGIN: {config.institutionOrOrigin}</div>
            <div>DATE: {config.dateStamp}</div>
          </div>

          {/* Transcript Lines with Interactive Redaction Blocks */}
          <div className="font-serif text-sm sm:text-base leading-relaxed space-y-3">
            {config.transcriptExcerpt.map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            {config.redactedSections && config.redactedSections.length > 0 && (
              <div className="pt-3 border-t border-[#b3ab98] space-y-2">
                <span className="font-mono text-[10px] uppercase text-[#695d4b] block">
                  Click black redaction blocks to inspect declassified text:
                </span>
                {config.redactedSections.map((sec) => {
                  const isRevealed = unredactedMap[sec.id];
                  return (
                    <button
                      type="button"
                      key={sec.id}
                      onClick={() => toggleRedaction(sec.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleRedaction(sec.id);
                        }
                      }}
                      aria-expanded={isRevealed}
                      aria-label={isRevealed ? `Declassified section ${sec.redactedLabel}` : `Classified section ${sec.redactedLabel}, click to declassify`}
                      className={`w-full text-left cursor-pointer p-2 rounded transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c4a32] ${
                        isRevealed
                          ? 'bg-[#c8bfac] border border-[#a89e8a] text-[#131612]'
                          : 'bg-black text-transparent hover:bg-[#1a1e17] border border-black'
                      }`}
                    >
                      {isRevealed ? (
                        <div className="flex items-start gap-2">
                          <Unlock size={14} className="text-[#8c4a32] shrink-0 mt-0.5" />
                          <div className="font-mono text-xs">
                            <span className="text-[#8c4a32] font-semibold">[{sec.redactedLabel}]: </span>
                            {sec.unredactedText}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-xs">
                          <Lock size={12} />
                          <span>[CLASSIFIED SECTION · CLICK TO DECLASSIFY]</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forensic Verdict Footer */}
      <div className="p-4 sm:p-5 border-t border-[#20281c] bg-[#0e120c] flex flex-col sm:flex-row items-start justify-between gap-3 font-mono text-xs text-[#8f9f8a]">
        <div>
          <span className="text-[#8c4a32] font-semibold">SUMMARY ANALYSIS: </span>
          <span>{config.summary}</span>
        </div>
        <span className="text-[#8c4a32] shrink-0 font-bold">{config.sourceCode}</span>
      </div>
    </figure>
  );
}

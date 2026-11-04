import React, { useState } from 'react';
import { FileText, Maximize2, ShieldAlert, CheckCircle, X, ZoomIn } from 'lucide-react';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

interface DocumentViewerProps {
  assetId: string;
  dossierCode: string;
  title: string;
  inUniverseDate: string;
  realCreationContext: string;
  summary: string;
  transcriptExcerpt: string[];
  factCheckVerdict: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  assetId,
  dossierCode,
  title,
  inUniverseDate,
  realCreationContext,
  summary,
  transcriptExcerpt,
  factCheckVerdict,
}) => {
  const asset = ASSET_MAP[assetId];
  const { setInspectedAsset } = useEnigma();
  const [modalOpen, setModalOpen] = useState(false);

  if (!asset) return null;

  const isFictionalVerdict =
    factCheckVerdict.includes('FICTIONAL') ||
    factCheckVerdict.includes('PROMOTIONAL') ||
    factCheckVerdict.includes('RECONSTRUCTED');

  return (
    <>
      <section className="my-10 border border-[#262c24] bg-[#090b09] shadow-2xl overflow-hidden">
        {/* Archival Reading Room Masthead */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#111411] border-b border-[#20251f] text-xs font-mono-tech">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#c89446]" />
            <span className="font-bold text-[#ece6d9] tracking-wider">{dossierCode}</span>
            <span className="text-[#8a8477]">| {title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#8f241b]/20 border border-[#b83a2e]/50 text-[#f5a89f] text-[10px] uppercase font-bold tracking-wider rounded-xs">
              RECONSTRUCTED ARTIFACT
            </span>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#181c17] hover:bg-[#232922] text-[#dcd6c8] border border-[#2d352b] rounded-xs transition cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#c89446]" />
              Examine Folio
            </button>
          </div>
        </div>

        {/* Dual-Column Archival Inspection Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Document Plate on Conservation Mat */}
          <div className="lg:col-span-5 bg-[#050605] p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#20251f] group relative">
            <div
              onClick={() => setModalOpen(true)}
              className="relative w-full max-w-sm aspect-[4/5] overflow-hidden border border-[#232920] shadow-[0_4px_24px_rgba(0,0,0,0.85)] cursor-pointer hover:border-[#c89446]/60 transition-all bg-[#0a0c0a]"
            >
              <img
                src={asset.localPath}
                alt={asset.title}
                className="w-full h-full object-contain filter contrast-105 group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono-tech text-[#f2ede4]">
                <ZoomIn className="w-4 h-4 text-[#c89446]" />
                Click to Inspect Folio
              </div>
            </div>

            {/* Accession Seal Note */}
            <div className="mt-3 text-[10px] font-mono-tech text-[#686357] text-center">
              PLATE CATALOG: {asset.id.toUpperCase()} // RESOLUTION: MASTER ARCHIVAL
            </div>
          </div>

          {/* Right: Forensic Epistemological Breakdown */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-[#0e100e]">
            <div>
              {/* Epistemic Temporal Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs font-mono-tech">
                <div className="p-3 bg-[#151210] border-l-2 border-[#b83a2e] border-y border-r border-[#281f1c]">
                  <span className="block text-[#e06d60] font-bold uppercase tracking-wider text-[10px]">
                    CLAIMED IN-UNIVERSE ERA
                  </span>
                  <span className="text-[#f5efe4] text-sm font-display mt-0.5 block">
                    {inUniverseDate}
                  </span>
                </div>

                <div className="p-3 bg-[#101512] border-l-2 border-[#436e4f] border-y border-r border-[#1e2a22]">
                  <span className="block text-[#60c07d] font-bold uppercase tracking-wider text-[10px]">
                    VERIFIED PRODUCTION ORIGIN
                  </span>
                  <span className="text-[#e2f0e6] text-xs font-mono-tech mt-0.5 block leading-relaxed">
                    {realCreationContext}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm sm:text-base text-[#d2ccc0] leading-relaxed mb-5 font-body">
                {summary}
              </p>

              {/* Transcript & Marginalia Transcription Block */}
              <div className="bg-[#060806] border border-[#1e231c] p-4 text-xs font-mono-tech space-y-2.5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8b8577] border-b border-[#181d16] pb-1.5 font-bold">
                  <span>TRANSCRIPTION &amp; MARGINALIA RECORD</span>
                  <span className="text-[#c89446]">AUTHENTICATED PROP EXCERPT</span>
                </div>
                {transcriptExcerpt.map((line, idx) => (
                  <p key={idx} className="text-[#beb8aa] leading-relaxed font-mono-tech pl-2 border-l border-[#2a3328]">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Fact-Check Verdict Bar */}
            <div className="mt-6 pt-4 border-t border-[#1c211b] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isFictionalVerdict ? (
                  <ShieldAlert className="w-4 h-4 text-[#e06d60]" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-[#60c07d]" />
                )}
                <span className="text-xs font-mono-tech font-bold text-[#ece6d9]">
                  FORENSIC VERDICT: {factCheckVerdict}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAsset(asset)}
                className="text-xs font-mono-tech text-[#c89446] hover:text-[#f2ece0] underline cursor-pointer"
              >
                Inspect Provenance Card →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Folio Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-[#0c0e0c] border border-[#2b3328] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#121612] border-b border-[#20251f] text-xs font-mono-tech">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c89446]" />
                <span className="font-bold text-[#ece6d9]">{title}</span>
                <span className="text-[#888376]">[{dossierCode}]</span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#888376] hover:text-[#f2ede4] transition cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 sm:p-8 overflow-auto flex items-center justify-center bg-[#050705]">
              <img
                src={asset.localPath}
                alt={asset.title}
                className="max-h-[70vh] w-auto object-contain border border-[#1f261d]"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-[#101310] border-t border-[#1e231d] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech text-[#8a8477]">
              <span>CREATION CONTEXT: {realCreationContext}</span>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setInspectedAsset(asset);
                }}
                className="text-[#c89446] hover:text-[#f5efe4] underline cursor-pointer"
              >
                View Full Provenance Dossier →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

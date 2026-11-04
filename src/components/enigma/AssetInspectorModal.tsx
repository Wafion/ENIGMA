import React from 'react';
import { X, ExternalLink, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { useEnigma } from '../../context/EnigmaContext';

export const AssetInspectorModal: React.FC = () => {
  const { inspectedAsset, setInspectedAsset } = useEnigma();

  if (!inspectedAsset) return null;

  const isFictional = inspectedAsset.historicalStatus === 'Reconstructed fictional material';
  const isHistorical = inspectedAsset.historicalStatus === 'Genuine historical material';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative max-w-3xl w-full max-h-[90vh] bg-[#0c0e0c] border border-[#373e33] rounded-sm overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#131613] border-b border-[#242b21]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#c89446]" />
            <h3 id="asset-modal-title" className="text-sm font-mono-tech font-bold text-[#ece6d9] tracking-wider uppercase">
              ASSET PROVENANCE DOSSIER // {inspectedAsset.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setInspectedAsset(null)}
            className="p-1.5 text-[#8c8679] hover:text-[#f5efe4] hover:bg-[#20271e] rounded-xs transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs font-mono-tech">
          {/* Classification Banner */}
          <div
            className={`p-3.5 rounded-xs border flex items-start gap-3 ${
              isFictional
                ? 'bg-[#181111] border-[#592622] text-[#f2b3ab]'
                : isHistorical
                ? 'bg-[#181611] border-[#5e4b2d] text-[#e8d7b3]'
                : 'bg-[#111713] border-[#294a34] text-[#bde3c7]'
            }`}
          >
            {isFictional ? (
              <ShieldAlert className="w-5 h-5 shrink-0 text-[#e06d60] mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 shrink-0 text-[#60c07d] mt-0.5" />
            )}
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">
                CLASSIFICATION: {inspectedAsset.historicalStatus}
              </div>
              <div className="mt-1 text-xs opacity-90 leading-relaxed font-body">
                {inspectedAsset.usageContext}
              </div>
            </div>
          </div>

          {/* Asset Preview Thumbnail if Image or Document */}
          {(inspectedAsset.assetType === 'image' || inspectedAsset.assetType === 'document') && (
            <div className="p-3 bg-[#070807] rounded-xs border border-[#21271f] flex items-center justify-center max-h-60 overflow-hidden">
              <img
                src={inspectedAsset.localPath}
                alt={inspectedAsset.title}
                className="max-h-56 w-auto object-contain"
              />
            </div>
          )}

          {/* Provenance Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xs bg-[#111411] border border-[#21271f]">
              <span className="text-[#837e72] block uppercase text-[10px]">ASSET TITLE</span>
              <span className="text-[#ece6d9] font-bold text-xs mt-0.5 block">
                {inspectedAsset.title}
              </span>
            </div>

            <div className="p-3 rounded-xs bg-[#111411] border border-[#21271f]">
              <span className="text-[#837e72] block uppercase text-[10px]">CREATOR / PUBLISHER</span>
              <span className="text-[#ece6d9] text-xs mt-0.5 block">
                {inspectedAsset.creator}
              </span>
            </div>

            <div className="p-3 rounded-xs bg-[#111411] border border-[#21271f]">
              <span className="text-[#837e72] block uppercase text-[10px]">CREATION DATE</span>
              <span className="text-[#ece6d9] text-xs mt-0.5 block">
                {inspectedAsset.date}
              </span>
            </div>

            <div className="p-3 rounded-xs bg-[#111411] border border-[#21271f]">
              <span className="text-[#837e72] block uppercase text-[10px]">LICENSE &amp; USAGE STATUS</span>
              <span className="text-[#c89446] font-bold text-xs mt-0.5 block">
                {inspectedAsset.license}
              </span>
            </div>

            <div className="p-3 rounded-xs bg-[#111411] border border-[#21271f]">
              <span className="text-[#837e72] block uppercase text-[10px]">TRUTH LAYER CATEGORY</span>
              <span className="text-[#ece6d9] text-xs mt-0.5 block">
                {inspectedAsset.truthLayer}
              </span>
            </div>

            <div className="p-3 rounded-xs bg-[#111411] border border-[#21271f]">
              <span className="text-[#837e72] block uppercase text-[10px]">LOCAL MANAGED STORAGE PATH</span>
              <span className="text-[#8cb89a] text-xs mt-0.5 block font-mono">
                {inspectedAsset.localPath}
              </span>
            </div>
          </div>

          {/* Full Attribution Statement */}
          <div className="p-3.5 rounded-xs bg-[#111411] border border-[#21271f] space-y-1">
            <span className="text-[#837e72] block uppercase text-[10px] font-bold">
              MANDATORY ATTRIBUTION &amp; CITATION TEXT
            </span>
            <p className="text-xs text-[#dcd6c8] leading-relaxed font-body">
              {inspectedAsset.attribution}
            </p>
          </div>

          {/* Original Source Link */}
          <div className="flex items-center justify-between pt-2">
            <a
              href={inspectedAsset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#181d17] hover:bg-[#252c23] border border-[#313a2e] text-xs font-mono-tech text-[#c89446] transition cursor-pointer"
            >
              <span>Visit Primary Source URL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setInspectedAsset(null)}
              className="px-4 py-1.5 rounded-xs bg-[#242b22] hover:bg-[#323c30] text-[#f2ede4] transition cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

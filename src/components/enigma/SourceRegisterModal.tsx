import React, { useState } from 'react';
import { X, ExternalLink, Database, Download, Filter } from 'lucide-react';
import { BLAIR_WITCH_ASSETS, BLAIR_WITCH_SOURCES } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

export const SourceRegisterModal: React.FC = () => {
  const { sourceRegisterOpen, setSourceRegisterOpen, highlightedSourceCode, setInspectedAsset } =
    useEnigma();
  const [tab, setTab] = useState<'sources' | 'assets'>('sources');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  if (!sourceRegisterOpen) return null;

  const downloadManifestJson = () => {
    const data = {
      project: 'ENIGMA // CASE 001',
      caseTitle: 'THE BLAIR WITCH INCIDENT',
      sourceCitations: BLAIR_WITCH_SOURCES,
      assetManifest: BLAIR_WITCH_ASSETS,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enigma-blair-witch-source-register.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAssets = BLAIR_WITCH_ASSETS.filter((a) => {
    if (categoryFilter === 'ALL') return true;
    return a.historicalStatus === categoryFilter;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-register-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative max-w-4xl w-full max-h-[92vh] bg-[#0c0e0c] border border-[#373e33] rounded-sm overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131613] border-b border-[#242b21]">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#c89446]" />
            <div>
              <h3 id="source-register-title" className="text-base font-mono-tech font-bold text-[#ece6d9] tracking-wider uppercase">
                ENIGMA SOURCE REGISTER &amp; ASSET MANIFEST
              </h3>
              <p className="text-xs font-mono-tech text-[#8a8477]">
                Case 001 // Complete Primary Source Provenance Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadManifestJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181d17] hover:bg-[#252c23] border border-[#313a2e] text-xs font-mono-tech text-[#dcd6c8] rounded-xs cursor-pointer"
              title="Download Full JSON Manifest"
            >
              <Download className="w-3.5 h-3.5 text-[#c89446]" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => setSourceRegisterOpen(false)}
              className="p-1.5 text-[#8c8679] hover:text-[#f5efe4] hover:bg-[#20271e] rounded-xs transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-[#22271f] bg-[#0f120f] px-6 text-xs font-mono-tech">
          <button
            type="button"
            onClick={() => setTab('sources')}
            className={`py-3 px-4 border-b-2 font-bold transition cursor-pointer ${
              tab === 'sources'
                ? 'border-b-[#c89446] text-[#f2ede4] bg-[#141814]'
                : 'border-b-transparent text-[#8a8477] hover:text-[#dcd6c8]'
            }`}
          >
            Primary Sources &amp; Archives ({BLAIR_WITCH_SOURCES.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('assets')}
            className={`py-3 px-4 border-b-2 font-bold transition cursor-pointer ${
              tab === 'assets'
                ? 'border-b-[#c89446] text-[#f2ede4] bg-[#141814]'
                : 'border-b-transparent text-[#8a8477] hover:text-[#dcd6c8]'
            }`}
          >
            Archival &amp; Audio Assets ({BLAIR_WITCH_ASSETS.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'sources' ? (
            <div className="space-y-4">
              {BLAIR_WITCH_SOURCES.map((src) => {
                const isHighlighted = highlightedSourceCode === src.code;
                return (
                  <div
                    key={src.id}
                    className={`p-4 rounded-xs border transition ${
                      isHighlighted
                        ? 'bg-[#1a2119] border-[#c89446] shadow-lg'
                        : 'bg-[#111411] border-[#22271f]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#c89446] px-2 py-0.5 bg-[#1f261d] rounded-xs">
                          [{src.code}]
                        </span>
                        <span className="text-[#888275]">{src.category}</span>
                      </div>
                      <span className="text-[#888275]">{src.publicationDate}</span>
                    </div>

                    <h4 className="font-display text-lg text-[#ece6d9] font-medium">
                      {src.title}
                    </h4>
                    <p className="text-xs font-mono-tech text-[#a8a296] mt-0.5">
                      Author/Publisher: {src.authorOrPublisher}
                    </p>

                    <div className="mt-2.5 p-2 rounded-xs bg-[#090b09] border border-[#1b201a] text-xs font-mono-tech text-[#c8c2b4]">
                      <strong className="text-[#c89446]">VERIFICATION NOTE:</strong>{' '}
                      {src.verificationNote}
                    </div>

                    <div className="mt-3 flex items-center justify-end">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#c89446] hover:text-[#f2ece0] underline cursor-pointer"
                      >
                        <span>Access Document Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2 pb-2 text-xs font-mono-tech">
                <span className="text-[#888275] flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter Category:
                </span>
                {[
                  'ALL',
                  'Genuine historical material',
                  'Genuine production or promotional material',
                  'Modern contextual photography',
                  'Reconstructed fictional material',
                  'Licensed stock imagery',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-xs transition cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[#283226] text-[#f2ede4] font-bold border border-[#41503e]'
                        : 'bg-[#121612] text-[#8a8477] hover:text-[#dcd6c8]'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Assets' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Asset Table / Cards */}
              <div className="space-y-3">
                {filteredAssets.map((asset) => {
                  const isFictional =
                    asset.historicalStatus === 'Reconstructed fictional material';
                  return (
                    <div
                      key={asset.id}
                      className="p-3.5 rounded-xs bg-[#111411] border border-[#22271f] flex flex-wrap sm:flex-nowrap items-start justify-between gap-4 text-xs font-mono-tech"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-[#c89446]">{asset.id}</span>
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold border rounded-xs ${
                              isFictional
                                ? 'bg-[#8f241b]/20 text-[#e8998d] border-[#b83a2e]/40'
                                : 'bg-[#293d2e]/20 text-[#9ed1ad] border-[#436e4f]/40'
                            }`}
                          >
                            {asset.historicalStatus}
                          </span>
                          <span className="text-[#837e72]">| {asset.assetType.toUpperCase()}</span>
                        </div>
                        <h5 className="font-display text-base text-[#ece6d9]">
                          {asset.title}
                        </h5>
                        <p className="text-xs text-[#a8a296] font-body line-clamp-2">
                          {asset.description}
                        </p>
                        <div className="text-[11px] text-[#787367]">
                          Creator: {asset.creator} | License: {asset.license}
                        </div>
                      </div>

                      <div className="shrink-0 flex sm:flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSourceRegisterOpen(false);
                            setInspectedAsset(asset);
                          }}
                          className="px-2.5 py-1 bg-[#1a2018] hover:bg-[#273224] text-[#dcd6c8] border border-[#2f3b2d] rounded-xs cursor-pointer whitespace-nowrap"
                        >
                          View Full Dossier
                        </button>
                        <a
                          href={asset.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#c89446] hover:underline flex items-center gap-1"
                        >
                          Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

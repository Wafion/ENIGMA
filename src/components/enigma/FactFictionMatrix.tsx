import React, { useState } from 'react';
import { Scale, ShieldAlert, CheckCircle, ExternalLink, Search } from 'lucide-react';
import type { FactFictionComparisonRow } from '../../types/enigma';
import { SOURCE_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

interface FactFictionMatrixProps {
  title: string;
  subtitle: string;
  rows: FactFictionComparisonRow[];
}

export const FactFictionMatrix: React.FC<FactFictionMatrixProps> = ({
  title,
  subtitle,
  rows,
}) => {
  const { openSourceCitation } = useEnigma();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter(
    (r) =>
      r.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.inUniverseClaim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.historicalReality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="my-12 border border-[#242b22] bg-[#070907] p-5 sm:p-8 shadow-2xl">
      {/* Forensic Ledger Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-8 border-b border-[#1c221a]">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#c89446]" />
            <h4 className="font-display text-2xl sm:text-3xl text-[#ece6d9] font-normal">{title}</h4>
          </div>
          <p className="text-xs font-mono-tech text-[#8e887b] mt-1">{subtitle}</p>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#868072] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search claims, names, dates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs font-mono-tech bg-[#101410] border border-[#232a20] text-[#dcd6c8] placeholder-[#666258] focus:outline-none focus:border-[#c89446]"
          />
        </div>
      </div>

      {/* Ledger Rows */}
      <div className="space-y-6">
        {filteredRows.map((row) => {
          const source = SOURCE_MAP[row.primarySourceCode];

          return (
            <div
              key={row.id}
              className="border border-[#1e241c] bg-[#0a0d0a] transition hover:border-[#313c2e]"
            >
              {/* Row Topic Title Bar */}
              <div className="px-5 py-2.5 bg-[#111611] border-b border-[#1b2119] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech">
                <span className="font-bold text-[#ece6d9] tracking-wider">
                  TOPIC INVESTIGATION: {row.topic}
                </span>
                {source && (
                  <button
                    type="button"
                    onClick={() => openSourceCitation(row.primarySourceCode)}
                    className="inline-flex items-center gap-1.5 text-[#c89446] hover:text-[#f2ece0] underline cursor-pointer"
                  >
                    <span>Primary Citation [{row.primarySourceCode}]</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Side-by-Side Dual-Track Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Fictional Lore Claim */}
                <div className="p-5 bg-[#120e0d]/80 border-b md:border-b-0 md:border-r border-[#241a18]">
                  <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#e06d60] font-bold uppercase tracking-wider mb-2.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    LAYER A // IN-UNIVERSE LORE CLAIM:
                  </div>
                  <p className="text-sm text-[#ded3d0] leading-relaxed font-body">
                    {row.inUniverseClaim}
                  </p>
                </div>

                {/* Right: Verified Historical Reality */}
                <div className="p-5 bg-[#0b120d]/80">
                  <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#60c07d] font-bold uppercase tracking-wider mb-2.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    LAYER B // VERIFIED PRODUCTION &amp; HISTORICAL REALITY:
                  </div>
                  <p className="text-sm text-[#d0ded5] leading-relaxed font-body">
                    {row.historicalReality}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

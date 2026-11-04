import React, { useState } from 'react';
import { Calendar, Filter, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import type { TimelineEventItem } from '../../types/enigma';
import { SOURCE_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

interface TimelineViewProps {
  title: string;
  subtitle: string;
  items: TimelineEventItem[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ title, subtitle, items }) => {
  const [filter, setFilter] = useState<'all' | 'fictional-lore' | 'real-history'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
  const { openSourceCitation } = useEnigma();

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.layer === filter;
  });

  return (
    <section className="my-12 border border-[#232921] bg-[#080a08] p-5 sm:p-8 shadow-2xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-8 border-b border-[#1c221a]">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c89446]" />
            <h4 className="font-display text-2xl sm:text-3xl text-[#ece6d9] font-normal">{title}</h4>
          </div>
          <p className="text-xs font-mono-tech text-[#8e887b] mt-1">{subtitle}</p>
        </div>

        {/* Forensic Track Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101410] border border-[#232a21] text-xs font-mono-tech">
          <Filter className="w-3.5 h-3.5 text-[#868072] ml-1.5" />
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 transition cursor-pointer ${
              filter === 'all'
                ? 'bg-[#1e261d] text-[#f2ede4] font-bold'
                : 'text-[#8a8477] hover:text-[#dcd6c8]'
            }`}
          >
            Dual-Track View ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('fictional-lore')}
            className={`px-3 py-1 transition cursor-pointer ${
              filter === 'fictional-lore'
                ? 'bg-[#8f241b]/40 text-[#f5bfb7] border border-[#b83a2e]/60 font-bold'
                : 'text-[#8a8477] hover:text-[#dcd6c8]'
            }`}
          >
            Layer A: Lore
          </button>
          <button
            type="button"
            onClick={() => setFilter('real-history')}
            className={`px-3 py-1 transition cursor-pointer ${
              filter === 'real-history'
                ? 'bg-[#293d2e] text-[#bde0c6] border border-[#436e4f] font-bold'
                : 'text-[#8a8477] hover:text-[#dcd6c8]'
            }`}
          >
            Layer B: Verified History
          </button>
        </div>
      </div>

      {/* Chronological Stream */}
      <div className="relative pl-6 sm:pl-10 border-l border-[#20271d] space-y-8">
        {filteredItems.map((item) => {
          const isLore = item.layer === 'fictional-lore';
          const isSelected = item.id === selectedId;
          const source = item.sourceCode ? SOURCE_MAP[item.sourceCode] : null;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`relative p-5 transition cursor-pointer border ${
                isSelected
                  ? 'bg-[#111611] border-[#c89446]/60 shadow-xl'
                  : 'bg-[#0b0e0b] border-[#1a2018] hover:bg-[#0f130f] hover:border-[#273023]'
              }`}
            >
              {/* Timeline Node Marker on Left Ruler */}
              <div
                className={`absolute -left-[31px] sm:-left-[47px] top-5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                  isLore
                    ? 'border-[#b83a2e] bg-[#080a08]'
                    : 'border-[#436e4f] bg-[#080a08]'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLore ? 'bg-[#b83a2e]' : 'bg-[#60c07d]'
                  }`}
                />
              </div>

              {/* Event Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold px-2.5 py-0.5 uppercase tracking-wider text-[11px] ${
                      isLore
                        ? 'bg-[#8f241b]/20 text-[#f5a89f] border border-[#b83a2e]/40'
                        : 'bg-[#293d2e]/20 text-[#a8e0b8] border border-[#436e4f]/40'
                    }`}
                  >
                    {item.date}
                  </span>
                  <span className="text-[#857f72]">| {item.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isLore ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#f5a89f]">
                      <ShieldAlert className="w-3 h-3 text-[#e06d60]" /> In-Universe Folklore
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#a8e0b8]">
                      <CheckCircle className="w-3 h-3 text-[#60c07d]" /> Verified Production Record
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Summary */}
              <h5 className="font-display text-xl text-[#ece6d9] font-medium tracking-wide">
                {item.title}
              </h5>
              <p className="mt-2 text-sm text-[#cac4b6] leading-relaxed font-body">
                {item.summary}
              </p>

              {/* Selected Expanded Detail */}
              {isSelected && item.verificationNote && (
                <div className="mt-4 pt-3 border-t border-[#1e241c] text-xs font-mono-tech">
                  <div className="text-[10px] text-[#857f72] uppercase tracking-wider mb-1">
                    EPISTEMIC VERIFICATION NOTE:
                  </div>
                  <p className="text-[#dcd6c8] leading-relaxed">
                    {item.verificationNote}
                  </p>
                </div>
              )}

              {/* Provenance Footnote */}
              {source && (
                <div className="mt-3 flex items-center justify-between text-xs font-mono-tech text-[#807a6f]">
                  <span>PRIMARY RECORD: [{item.sourceCode}]</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.sourceCode) openSourceCitation(item.sourceCode);
                    }}
                    className="inline-flex items-center gap-1 text-[#c89446] hover:text-[#f2ece0] underline cursor-pointer"
                  >
                    <span>View Citation</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

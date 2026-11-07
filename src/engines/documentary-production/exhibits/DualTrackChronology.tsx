import { useState } from 'react';

interface ChronologyItem {
  id: string;
  date: string;
  title: string;
  trackAEvent: string; // Official / Public
  trackBEvent: string; // Private / Forensic
  sourceCode: string;
}

interface DualTrackChronologyProps {
  title?: string;
  subtitle?: string;
  trackALabel?: string;
  trackBLabel?: string;
  items: ChronologyItem[];
  className?: string;
}

export function DualTrackChronology({
  title = 'Concurrent Multi-Track Chronology',
  subtitle = 'Synchronized comparison: Public Narrative vs Verified Archival Evidence',
  trackALabel = 'Track A: Public Narrative & Contemporary Press',
  trackBLabel = 'Track B: Verified Archival Evidence',
  items,
  className = '',
}: DualTrackChronologyProps) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const activeItem = items[activeItemIndex] || items[0];

  return (
    <div className={`dual-track-chronology my-16 rounded border border-[#2b3528] bg-[#0c100c] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#212b1e] bg-[#111610] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase text-[#8c4a32] tracking-wider block mb-0.5">
            [ DUAL-TRACK TIMELINE · CONCURRENT EVENT SCRUBBER ]
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#ece7dc]">{title}</h3>
          <p className="font-serif text-xs text-[#9da897]">{subtitle}</p>
        </div>
      </div>

      {/* Horizontal Milestone Rail */}
      <div className="p-4 bg-[#080b08] border-b border-[#1b2318] overflow-x-auto flex gap-3" role="tablist" aria-label="Chronology milestones">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeItemIndex === idx}
            aria-label={`Milestone: ${item.date} - ${item.title}`}
            onClick={() => setActiveItemIndex(idx)}
            className={`px-3 py-2 rounded text-left shrink-0 transition-all font-mono text-xs border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c4a32] ${
              activeItemIndex === idx
                ? 'bg-[#8c4a32] text-white border-white shadow-lg'
                : 'bg-[#121711] text-[#7d8f78] border-[#222c1e] hover:border-[#384832]'
            }`}
          >
            <div className="font-semibold">{item.date}</div>
            <div className="text-[10px] opacity-90 truncate max-w-[140px]">{item.title}</div>
          </button>
        ))}
      </div>

      {/* Synchronized Tracks Comparison */}
      <div className="p-6 sm:p-8 bg-[#0a0d09] grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Track A: Public / Official */}
        <div className="p-5 rounded border border-[#232d20] bg-[#111610] space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#8c4a32] font-semibold uppercase">{trackALabel}</span>
            <span className="text-[#6d7e68]">{activeItem?.date}</span>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#e6ded1] leading-relaxed">
            {activeItem?.trackAEvent}
          </p>
        </div>

        {/* Track B: Classified / Forensic Reality */}
        <div className="p-5 rounded border border-[#232d20] bg-[#111610] space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-emerald-400 font-semibold uppercase">{trackBLabel}</span>
            <span className="text-[#8c4a32] font-bold">{activeItem?.sourceCode}</span>
          </div>
          <p className="font-serif text-sm sm:text-base text-[#c4d1bf] leading-relaxed italic">
            "{activeItem?.trackBEvent}"
          </p>
        </div>
      </div>
    </div>
  );
}

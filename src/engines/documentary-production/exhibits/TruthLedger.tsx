import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { TruthLedgerRow } from '../../../core/types/exhibits';

interface TruthLedgerProps {
  title?: string;
  subtitle?: string;
  rows: TruthLedgerRow[];
  className?: string;
}

export function TruthLedger({
  title = 'Forensic Evidence Ledger',
  subtitle = 'Separating contemporary lore and hypotheses from physical evidence and court filings',
  rows,
  className = '',
}: TruthLedgerProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredRows = rows.filter((r) => {
    if (filter === 'all') return true;
    return r.verdict === filter;
  });

  const getVerdictBadge = (verdict: TruthLedgerRow['verdict']) => {
    switch (verdict) {
      case 'verified':
        return (
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-emerald-800 bg-emerald-950/40 text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={11} /> Verified Fact
          </span>
        );
      case 'refuted':
        return (
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-red-900 bg-red-950/40 text-red-400 flex items-center gap-1">
            <XCircle size={11} /> Refuted
          </span>
        );
      case 'disputed':
        return (
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-amber-800 bg-amber-950/40 text-amber-400 flex items-center gap-1">
            <AlertTriangle size={11} /> Disputed
          </span>
        );
      case 'unsubstantiated':
        return (
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-[#3b4737] bg-[#141b12] text-[#8ea088] flex items-center gap-1">
            <HelpCircle size={11} /> Lore Only
          </span>
        );
    }
  };

  return (
    <div 
      role="region" 
      aria-label={title}
      className={`truth-ledger my-16 rounded border border-[#2b3628] bg-[#0c100c] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-[#212b1e] bg-[#111610] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase text-[#8c4a32] tracking-wider block mb-0.5">
            [ EPISTEMIC TRUTH MATRIX · FORENSIC AUDIT ]
          </span>
          <h3 className="font-serif text-2xl text-[#ece7dc]">{title}</h3>
          <p className="font-serif text-xs text-[#9da897]">{subtitle}</p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 overflow-x-auto pb-1 font-mono text-xs" role="toolbar" aria-label="Filter evidence rows">
          {['all', 'verified', 'refuted', 'disputed'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-2.5 py-1 rounded capitalize transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8c4a32] ${
                filter === f
                  ? 'bg-[#8c4a32] text-white'
                  : 'bg-[#151c13] text-[#788873] hover:text-[#d1dcd0]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Rows Table */}
      <div className="divide-y divide-[#1e271a]">
        {filteredRows.map((row) => (
          <div
            key={row.id}
            className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start hover:bg-[#10140e] transition-colors"
          >
            {/* Topic & Verdict (3 cols) */}
            <div className="md:col-span-3 space-y-2">
              <h4 className="font-serif text-base text-[#ece7dc] font-semibold">
                {row.topic}
              </h4>
              <div>{getVerdictBadge(row.verdict)}</div>
            </div>

            {/* In-Universe Lore / Popular Claim (4 cols) */}
            <div className="md:col-span-4 p-3.5 rounded bg-[#131911] border border-[#1f291c] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#8c4a32] font-semibold block">
                Popular Hypothesis / In-Universe Claim
              </span>
              <p className="font-serif text-xs text-[#d8dfd3] leading-relaxed italic">
                "{row.claimOrLore}"
              </p>
            </div>

            {/* Documented Physical Reality (5 cols) */}
            <div className="md:col-span-5 p-3.5 rounded bg-[#0a0d09] border border-[#192216] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-emerald-400 font-semibold block">
                  Documented Forensic Record
                </span>
                <span className="font-mono text-[10px] text-[#8c4a32] font-bold">
                  {row.sourceCode}
                </span>
              </div>
              <p className="font-serif text-xs text-[#b8c6b3] leading-relaxed">
                {row.forensicRecord}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowUp, Database, ShieldAlert, Sparkles } from 'lucide-react';
import { useEnigma } from '../../context/EnigmaContext';
import { BLAIR_WITCH_CASE } from '../../data/blairWitchCase';

export const CaseFooter: React.FC = () => {
  const { setSourceRegisterOpen } = useEnigma();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#232822] bg-[#070807] py-16 px-4 sm:px-8 text-xs font-mono-tech text-[#8a8477]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Masthead */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[#1b201a]">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#ece6d9] font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-[#c89446]" />
              <span>ENIGMA // CASE 001 COMPLETED</span>
            </div>
            <p className="text-xs text-[#807a6e] mt-1 font-body">
              A browser-native documentary investigation into the Blair Witch incident, its folklore, and media phenomenon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSourceRegisterOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#141814] hover:bg-[#1f261e] text-[#dcd6c8] border border-[#2c372a] rounded-xs transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#c89446]" />
              Open Source Register (18 Assets)
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b221a] hover:bg-[#283327] text-[#f2ede4] border border-[#3b4938] rounded-xs transition cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Return to Top
            </button>
          </div>
        </div>

        {/* Epistemic Ledger Summary */}
        <div className="p-6 rounded-xs bg-[#0c0e0c] border border-[#20251f] space-y-3">
          <div className="flex items-center gap-2 text-[#c89446] font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>EDITORIAL INTEGRITY &amp; PROVENANCE DECLARATION</span>
          </div>
          <p className="text-sm font-body text-[#cac4b6] leading-relaxed">
            {BLAIR_WITCH_CASE.editorialDisclaimer}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#787265] border-t border-[#1a1f18]">
            <span>PUBLISHED: {BLAIR_WITCH_CASE.publicationDate}</span>
            <span>READING TIME: ~{BLAIR_WITCH_CASE.readingTimeMinutes} MINUTES</span>
            <span>VERIFIED ASSETS CATALOGED: {BLAIR_WITCH_CASE.assets.length} ITEMS</span>
          </div>
        </div>

        {/* Bottom System Brand */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#6d675b]">
          <div>
            <span>ENIGMA CINEMATIC ARCHIVE PLATFORM // PROTOTYPE FOUNDATION</span>
          </div>
          <div className="flex items-center gap-4">
            <span>BROWSER-NATIVE MYSTERY STORYTELLING</span>
            <span>BUILT WITH REACT + CANVAS 2D ASCII</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

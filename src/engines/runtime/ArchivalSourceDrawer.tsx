import { X, ExternalLink, ShieldCheck, Hash } from 'lucide-react';
import type { EnigmaSourceCitation } from '../../core/types/provenance';

interface ArchivalSourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  source?: EnigmaSourceCitation;
}

export function ArchivalSourceDrawer({ isOpen, onClose, source }: ArchivalSourceDrawerProps) {
  if (!isOpen || !source) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0e1217] border-l border-[#242e3b] text-[#dce2ea] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1f2835] mb-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#c47a47]/20 border border-[#c47a47]/40 text-[#c47a47] font-semibold">
                {source.code}
              </span>
              <span className="font-mono text-[11px] text-[#78889b] uppercase tracking-wider">
                Primary Archival Record
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#78889b] hover:text-white hover:bg-[#1a222e] transition-colors"
              aria-label="Close Source Drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Title & Metadata */}
          <h2 id="source-drawer-title" className="font-serif text-2xl text-white mb-2 leading-snug">
            {source.title}
          </h2>
          <p className="font-mono text-xs text-[#c47a47] mb-4">
            {source.category}
          </p>

          <div className="space-y-4 font-mono text-xs text-[#9aa8b8] bg-[#141b24] p-4 rounded border border-[#222c3a] mb-6">
            <div>
              <span className="text-[#64748b] block mb-0.5">Author / Publisher:</span>
              <span className="text-white font-medium">{source.authorOrPublisher}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#64748b] block mb-0.5">Date of Record:</span>
                <span className="text-white">{source.publicationDate}</span>
              </div>
              <div>
                <span className="text-[#64748b] block mb-0.5">Repository:</span>
                <span className="text-white">{source.repositoryName || 'Institutional Archive'}</span>
              </div>
            </div>
            {source.archivalCallNumber && (
              <div>
                <span className="text-[#64748b] block mb-0.5">Archival Call Number:</span>
                <span className="text-white font-semibold">{source.archivalCallNumber}</span>
              </div>
            )}
            <div>
              <span className="text-[#64748b] block mb-0.5">Rights & Clearance:</span>
              <span className="text-emerald-400 font-medium">{source.rightsStatus || 'Public Domain'}</span>
            </div>
          </div>

          {/* Provenance Note */}
          <div className="mb-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#78889b] mb-2 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#c47a47]" /> Evidentiary Provenance
            </h3>
            <p className="font-serif text-sm text-[#b8c4d1] leading-relaxed italic bg-[#10151c] p-3 rounded border border-[#1a232f]">
              "{source.verificationNote}"
            </p>
          </div>

          {/* SHA-256 Checksum */}
          {source.documentHash && (
            <div className="mb-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#78889b] mb-2 flex items-center gap-1.5">
                <Hash size={14} className="text-[#c47a47]" /> Cryptographic SHA-256 Checksum
              </h3>
              <div className="font-mono text-[11px] text-[#718294] bg-black/60 p-2.5 rounded border border-[#212933] break-all select-all">
                {source.documentHash}
              </div>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="pt-6 border-t border-[#1f2835] flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#637283]">
            Verified by ENIGMA Investigation Unit
          </span>
          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase text-[#c47a47] hover:text-white flex items-center gap-1 transition-colors"
            >
              Examine Holding <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

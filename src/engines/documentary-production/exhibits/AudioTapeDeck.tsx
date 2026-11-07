import { useState } from 'react';
import { Play, Pause, Radio } from 'lucide-react';
import type { AudioTapeSegment } from '../../../core/types/exhibits';

interface AudioTapeDeckProps {
  title?: string;
  subtitle?: string;
  segments: AudioTapeSegment[];
  className?: string;
}

export function AudioTapeDeck({
  title = 'A/V Field Tape Forensics Deck',
  subtitle = 'Recovered 16mm optical sound tracks and audio testimonies',
  segments,
  className = '',
}: AudioTapeDeckProps) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeSegment = segments[activeSegmentIndex] || segments[0];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <figure className={`audio-tape-deck my-16 rounded border border-[#2b3528] bg-[#0c100c] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#212b1e] bg-[#111610] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs uppercase text-[#8c4a32] tracking-wider block mb-0.5">
            [ A/V REEL DECK · TIME-CODE TRANSCRIPT SCRUBBER ]
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#ece7dc]">{title}</h3>
          <p className="font-serif text-xs text-[#9da897]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#7c8d77]">
          <Radio size={14} className="text-[#8c4a32] animate-pulse" />
          <span>ANALOG TAPE FREQ: 44.1kHz</span>
        </div>
      </div>

      {/* Main Reel Deck Interior */}
      <div className="p-6 sm:p-8 bg-[#080a08] space-y-6">
        {/* Segment Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#1b2319] font-mono text-xs" role="tablist" aria-label="Tape segments">
          {segments.map((seg, idx) => (
            <button
              key={seg.id}
              type="button"
              role="tab"
              aria-selected={activeSegmentIndex === idx}
              onClick={() => {
                setActiveSegmentIndex(idx);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded uppercase tracking-wider whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8c4a32] ${
                activeSegmentIndex === idx
                  ? 'bg-[#8c4a32] text-white font-semibold'
                  : 'bg-[#121711] text-[#788873] hover:text-[#e1dcd1]'
              }`}
            >
              {seg.reelCode} · {seg.title}
            </button>
          ))}
        </div>

        {/* Cassette / Reel Animation & Scrubber Area */}
        <div className="p-6 rounded border border-[#232d20] bg-[#0e120d] flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Reel Wheels */}
          <div className="flex items-center gap-6">
            <div
              className={`w-14 h-14 rounded-full border-4 border-[#3c4c37] flex items-center justify-center ${
                isPlaying ? 'animate-spin [animation-duration:3s]' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#8c4a32]" />
            </div>
            <div
              className={`w-14 h-14 rounded-full border-4 border-[#3c4c37] flex items-center justify-center ${
                isPlaying ? 'animate-spin [animation-duration:3s]' : ''
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#8c4a32]" />
            </div>
          </div>

          {/* Timecode & Play Control */}
          <div className="text-center font-mono">
            <div className="text-2xl sm:text-3xl font-bold text-[#ece7dc] tracking-widest mb-1">
              {activeSegment?.timecodeStart} <span className="text-[#8c4a32] font-normal">/</span> {activeSegment?.timecodeEnd}
            </div>
            <span className="text-[11px] text-[#71816e] uppercase">
              {activeSegment?.gaugeLabel} · {activeSegment?.recordedDate}
            </span>
          </div>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[#8c4a32] hover:bg-[#a3563b] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            aria-label={isPlaying ? 'Pause tape audio' : 'Play tape audio'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
          </button>
        </div>

        {/* Word-by-Word Synchronized Transcript */}
        <div className="p-5 rounded border border-[#20291d] bg-[#0c0f0a] space-y-3 font-mono text-xs">
          <div className="text-[11px] uppercase text-[#8c4a32] font-semibold flex items-center justify-between pb-2 border-b border-[#182015]">
            <span>Tape Dialogue Transcript</span>
            <span>Recorded: {activeSegment?.location}</span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {activeSegment?.transcript.map((line, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#647560] shrink-0">{line.timecode}</span>
                <span className="text-[#8c4a32] font-bold shrink-0">{line.speaker}:</span>
                <p className="font-serif text-sm text-[#e6ded1] leading-relaxed">
                  "{line.line}"
                  {line.acousticNote && (
                    <span className="font-mono text-[10px] text-[#758671] ml-2 italic">
                      [{line.acousticNote}]
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forensic Verdict Footer */}
      <div className="p-4 border-t border-[#1e271a] bg-[#0b0e09] font-mono text-xs text-[#8f9f8a]">
        <span className="text-[#8c4a32] font-semibold">FORENSIC NOTE: </span>
        <span>{activeSegment?.forensicNote}</span>
      </div>
    </figure>
  );
}

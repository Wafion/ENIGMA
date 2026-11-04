import React from 'react';
import { Volume2, VolumeX, Sparkles, FileAudio } from 'lucide-react';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

interface AudioCueCardProps {
  assetId: string;
  cueCode: string;
  title: string;
  narrativePurpose: string;
  durationLabel: string;
  transcriptOrDescription: string;
}

export const AudioCueCard: React.FC<AudioCueCardProps> = ({
  assetId,
  cueCode,
  title,
  narrativePurpose,
  durationLabel,
  transcriptOrDescription,
}) => {
  const { triggerAudioCue, activeCueId, setInspectedAsset } = useEnigma();
  const asset = ASSET_MAP[assetId];
  const isPlaying = activeCueId === assetId;

  return (
    <div className="my-8 border border-[#232921] bg-[#090c09] p-5 shadow-xl">
      {/* Sound Card Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#1c221a] text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <FileAudio className="w-4 h-4 text-[#c89446]" />
          <span className="font-bold text-[#ece6d9] tracking-wider">{cueCode}</span>
          <span className="text-[#888376]">| {title}</span>
        </div>
        <div className="flex items-center gap-3 text-[#857f73]">
          <span>DURATION: {durationLabel}</span>
          <span>44.1kHz 16-BIT PCM</span>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-5">
        <div className="space-y-1.5 flex-1">
          <p className="text-sm text-[#d4cec2] font-normal leading-relaxed font-body">
            {narrativePurpose}
          </p>
          <div className="text-xs font-mono-tech text-[#88b896] italic">
            [ACOUSTIC PROFILE]: {transcriptOrDescription}
          </div>
        </div>

        {/* Audition Trigger & Provenance Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => triggerAudioCue(assetId, 1000)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono-tech rounded-xs border transition cursor-pointer ${
              isPlaying
                ? 'bg-[#b83a2e] border-[#e06d60] text-[#f7f2e8] shadow-[0_0_12px_rgba(184,58,46,0.6)]'
                : 'bg-[#141813] hover:bg-[#1e251e] border-[#293226] text-[#dcd6c8]'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Cue</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#c89446]" />
                <span>Audition Foley Cue</span>
              </>
            )}
          </button>

          {asset && (
            <button
              type="button"
              onClick={() => setInspectedAsset(asset)}
              className="p-2 text-[#857f73] hover:text-[#f2ede4] bg-[#121512] border border-[#222820] rounded-xs transition cursor-pointer"
              title="Acoustic Provenance"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c89446]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface WaveformPlayerProps {
  audioUrl: string;
  reelLabel?: string;
  gaugeLabel?: string;
  onTimeUpdate?: (currentTimeSec: number) => void;
  height?: number;
  waveColor?: string;
  progressColor?: string;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioUrl,
  reelLabel = 'DAT TAPE / SYNC TRACK',
  gaugeLabel = 'AUDIO CASSETTE 44.1kHz PCM',
  onTimeUpdate,
  height = 56,
  waveColor = '#464035',
  progressColor = '#c89446',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00.00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    let ws: WaveSurfer | null = null;
    try {
      ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor,
        progressColor,
        cursorColor: '#f2ede4',
        cursorWidth: 1.5,
        barWidth: 2,
        barGap: 1.5,
        barRadius: 1,
        height,
        normalize: true,
        url: audioUrl,
      });

      wavesurferRef.current = ws;

      ws.on('ready', () => {
        setIsReady(true);
        setDuration(ws?.getDuration() || 0);
      });

      ws.on('play', () => setIsPlaying(true));
      ws.on('pause', () => setIsPlaying(false));
      ws.on('finish', () => setIsPlaying(false));

      ws.on('timeupdate', (time) => {
        setCurrentTime(time);
        if (onTimeUpdate) {
          onTimeUpdate(time);
        }
      });
    } catch (err) {
      console.warn('[WaveformPlayer] Error initializing WaveSurfer:', err);
    }

    return () => {
      try {
        if (ws) {
          ws.destroy();
        }
      } catch {}
      wavesurferRef.current = null;
    };
  }, [audioUrl, waveColor, progressColor, height, onTimeUpdate]);

  const togglePlay = useCallback(() => {
    if (!wavesurferRef.current || !isReady) return;
    wavesurferRef.current.playPause();
  }, [isReady]);

  const restartAudio = useCallback(() => {
    if (!wavesurferRef.current || !isReady) return;
    wavesurferRef.current.seekTo(0);
  }, [isReady]);

  const toggleMute = useCallback(() => {
    if (!wavesurferRef.current) return;
    const next = !isMuted;
    wavesurferRef.current.setMuted(next);
    setIsMuted(next);
  }, [isMuted]);

  return (
    <div className="bg-[#090b09] border border-[#222920] p-4 text-xs font-mono-tech select-none">
      {/* Tape Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#181e16] text-[10px] text-[#736c5f]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c89446] animate-pulse" />
          <span className="text-[#c89446] font-bold uppercase tracking-wider">{reelLabel}</span>
          <span className="text-[#3b4337]">|</span>
          <span className="text-[#8e8778]">{gaugeLabel}</span>
        </div>
        <div className="flex items-center gap-2 font-mono-tech">
          <span className="text-[#f2ede4] font-bold">{formatTime(currentTime)}</span>
          <span className="text-[#554f44]">/</span>
          <span className="text-[#888173]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Waveform Canvas Host */}
      <div
        ref={containerRef}
        className="w-full cursor-pointer my-2 bg-[#050605] border border-[#141813] rounded-xs overflow-hidden"
      />

      {/* Controls Bar */}
      <div className="flex items-center justify-between pt-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!isReady}
            aria-label={isPlaying ? 'Pause tape recording' : 'Play tape recording'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141a13] hover:bg-[#1d251c] text-[#f2ede4] border border-[#2a3528] transition cursor-pointer active:scale-95 disabled:opacity-40"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#c89446]" />
                <span className="tracking-wider">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#c89446]" />
                <span className="tracking-wider">AUDITION TAPE</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={restartAudio}
            disabled={!isReady}
            aria-label="Rewind to start"
            className="p-1.5 bg-[#101410] hover:bg-[#181e17] text-[#8e8778] hover:text-[#f2ede4] border border-[#1f261d] transition cursor-pointer disabled:opacity-40"
            title="Rewind to 00:00"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-[#736c5f] text-[11px]">
          <span className="hidden sm:inline">TIMELINE SCRUB ENABLED</span>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="p-1 hover:text-[#dcd6c8] transition cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-[#b83a2e]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#888173]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { audioManager, type AudioManagerSnapshot } from '../utils/AudioManager';
import type { EnigmaAsset } from '../types/enigma';

export type ExperienceViewMode = 'cinema' | 'broadside';

export interface ActMetadata {
  index: number;
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  truthLayer: 'IN-UNIVERSE MYTHOLOGY' | 'VERIFIED HISTORICAL / PRODUCTION RECORD' | 'DUAL-LAYER';
  accentHex: string;
  bgHex: string;
}

export const CASE_ACTS: ActMetadata[] = [
  {
    index: 0,
    id: 'prologue',
    number: '00',
    title: 'Prologue: The Black Hills',
    shortTitle: 'PROLOGUE',
    truthLayer: 'DUAL-LAYER',
    accentHex: '#c89446',
    bgHex: '#050605',
  },
  {
    index: 1,
    id: 'chapter-01-the-legend',
    number: '01',
    title: 'The Legend of the Black Hills',
    shortTitle: 'THE LEGEND',
    truthLayer: 'IN-UNIVERSE MYTHOLOGY',
    accentHex: '#b83a2e',
    bgHex: '#0b0a09',
  },
  {
    index: 2,
    id: 'chapter-02-burkittsville',
    number: '02',
    title: 'The Town Below South Mountain',
    shortTitle: 'BURKITTSVILLE',
    truthLayer: 'VERIFIED HISTORICAL / PRODUCTION RECORD',
    accentHex: '#436e4f',
    bgHex: '#080c09',
  },
  {
    index: 3,
    id: 'chapter-03-expedition',
    number: '03',
    title: 'The October Expedition',
    shortTitle: 'THE EXPEDITION',
    truthLayer: 'IN-UNIVERSE MYTHOLOGY',
    accentHex: '#c89446',
    bgHex: '#0d0b09',
  },
  {
    index: 4,
    id: 'chapter-04-labyrinth',
    number: '04',
    title: 'The Labyrinth in the Timber',
    shortTitle: 'SENECA CREEK',
    truthLayer: 'VERIFIED HISTORICAL / PRODUCTION RECORD',
    accentHex: '#5e8250',
    bgHex: '#060a07',
  },
  {
    index: 5,
    id: 'chapter-05-celluloid',
    number: '05',
    title: 'Celluloid and Hi8 Magnetic Tape',
    shortTitle: 'TAPE FORENSICS',
    truthLayer: 'VERIFIED HISTORICAL / PRODUCTION RECORD',
    accentHex: '#4a7a9e',
    bgHex: '#070a0e',
  },
  {
    index: 6,
    id: 'chapter-06-mirage',
    number: '06',
    title: 'The 1998–1999 Dial-Up Mirage',
    shortTitle: 'WEB 1.0 MIRAGE',
    truthLayer: 'VERIFIED HISTORICAL / PRODUCTION RECORD',
    accentHex: '#c89446',
    bgHex: '#0a0907',
  },
  {
    index: 7,
    id: 'chapter-07-quiet-archive',
    number: '07',
    title: 'The Quiet Archive',
    shortTitle: 'SYNTHESIS LEDGER',
    truthLayer: 'VERIFIED HISTORICAL / PRODUCTION RECORD',
    accentHex: '#9a9e94',
    bgHex: '#070808',
  },
];

interface EnigmaContextValue {
  // Experience view mode (Cinema Exhibition vs Editorial Broadside)
  viewMode: ExperienceViewMode;
  setViewMode: (mode: ExperienceViewMode) => void;
  toggleViewMode: () => void;

  // Active Act navigation (0 to 7)
  activeActIndex: number;
  setActiveActIndex: (index: number) => void;
  nextAct: () => void;
  prevAct: () => void;
  jumpToActById: (id: string) => void;

  // Audio state & centralized scene management
  audioEnabled: boolean;
  audioMuted: boolean;
  audioVolume: number;
  currentAmbientId: string;
  activeCueId: string | null;
  activeSceneId: string | null;

  enableAudio: (initialSceneId?: string, initialAmbientId?: string) => void;
  disableAudio: () => void;
  toggleAudio: (fallbackSceneId?: string, fallbackAmbientId?: string) => void;
  setAudioMuted: (muted: boolean) => void;
  setAudioVolume: (volume: number) => void;
  enterScene: (sceneId: string, ambienceId: string) => void;
  leaveScene: (sceneId: string) => void;
  triggerAudioCue: (cueId: string, cooldownMs?: number) => void;

  // Legacy Chapter ID synchronization
  activeChapterId: string;
  setActiveChapterId: (id: string) => void;
  readingProgress: number;

  // Accessibility & Visual Modes
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  globalAsciiInspector: boolean;
  setGlobalAsciiInspector: (val: boolean) => void;

  // Provenance & Source Register Drawers
  inspectedAsset: EnigmaAsset | null;
  setInspectedAsset: (asset: EnigmaAsset | null) => void;
  sourceRegisterOpen: boolean;
  setSourceRegisterOpen: (open: boolean) => void;
  highlightedSourceCode: string | null;
  openSourceCitation: (code: string) => void;
}

const EnigmaContext = createContext<EnigmaContextValue | null>(null);

export const EnigmaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioManagerSnapshot>(() => audioManager.getSnapshot());
  const [viewMode, setViewMode] = useState<ExperienceViewMode>('cinema');
  const [activeActIndex, setActiveActIndexState] = useState<number>(0);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [globalAsciiInspector, setGlobalAsciiInspector] = useState<boolean>(false);
  const [inspectedAsset, setInspectedAsset] = useState<EnigmaAsset | null>(null);
  const [sourceRegisterOpen, setSourceRegisterOpen] = useState<boolean>(false);
  const [highlightedSourceCode, setHighlightedSourceCode] = useState<string | null>(null);

  // Subscribe to audio manager updates
  useEffect(() => {
    return audioManager.subscribe((snapshot) => {
      setAudioState(snapshot);
    });
  }, []);

  // Update reading progress based on scroll position (for broadside mode)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setReadingProgress(0);
      } else {
        setReadingProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Synchronize audio scene when activeActIndex changes
  useEffect(() => {
    const act = CASE_ACTS[activeActIndex];
    if (!act) return;

    // Pick appropriate ambient track per act
    let ambientTrack = 'aud-forest-wind';
    if (act.index === 1) ambientTrack = 'aud-room-tone';
    else if (act.index === 2) ambientTrack = 'aud-stream-creek';
    else if (act.index === 3) ambientTrack = 'aud-nocturnal-insects';
    else if (act.index === 4) ambientTrack = 'aud-forest-wind';
    else if (act.index === 5) ambientTrack = 'aud-radio-interference';
    else if (act.index === 6) ambientTrack = 'aud-room-tone';
    else if (act.index === 7) ambientTrack = 'aud-room-tone';

    if (audioState.enabled) {
      audioManager.enterScene(act.id, ambientTrack);
    }
  }, [activeActIndex, audioState.enabled]);

  // Global keyboard shortcuts for cinematic navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setActiveActIndexState((cur) => Math.min(CASE_ACTS.length - 1, cur + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setActiveActIndexState((cur) => Math.max(0, cur - 1));
      } else if (e.key === 'c' || e.key === 'C') {
        setViewMode('cinema');
      } else if (e.key === 'b' || e.key === 'B') {
        setViewMode('broadside');
      } else if (e.key === 'm' || e.key === 'M') {
        audioManager.setMuted(!audioState.muted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioState.muted]);

  const setActiveActIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(CASE_ACTS.length - 1, index));
    setActiveActIndexState(clamped);
  }, []);

  const nextAct = useCallback(() => {
    setActiveActIndexState((cur) => Math.min(CASE_ACTS.length - 1, cur + 1));
  }, []);

  const prevAct = useCallback(() => {
    setActiveActIndexState((cur) => Math.max(0, cur - 1));
  }, []);

  const jumpToActById = useCallback((id: string) => {
    const found = CASE_ACTS.findIndex((a) => a.id === id);
    if (found !== -1) {
      setActiveActIndexState(found);
    }
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((cur) => (cur === 'cinema' ? 'broadside' : 'cinema'));
  }, []);

  const activeChapterId = useMemo(() => {
    return CASE_ACTS[activeActIndex]?.id || 'prologue';
  }, [activeActIndex]);

  const setActiveChapterId = useCallback((id: string) => {
    const found = CASE_ACTS.findIndex((a) => a.id === id);
    if (found !== -1) {
      setActiveActIndexState(found);
    }
  }, []);

  const enableAudio = useCallback((sceneId?: string, ambientId?: string) => {
    audioManager.enableAudio(sceneId, ambientId);
  }, []);

  const disableAudio = useCallback(() => {
    audioManager.disableAudio();
  }, []);

  const toggleAudio = useCallback((sceneId?: string, ambientId?: string) => {
    audioManager.toggleAudio(sceneId, ambientId);
  }, []);

  const setAudioMuted = useCallback((m: boolean) => {
    audioManager.setMuted(m);
  }, []);

  const setAudioVolume = useCallback((v: number) => {
    audioManager.setVolume(v);
  }, []);

  const enterScene = useCallback((sceneId: string, ambienceId: string) => {
    audioManager.enterScene(sceneId, ambienceId);
  }, []);

  const leaveScene = useCallback((sceneId: string) => {
    audioManager.leaveScene(sceneId);
  }, []);

  const triggerAudioCue = useCallback((id: string, cd?: number) => {
    audioManager.triggerCue(id, cd);
  }, []);

  const openSourceCitation = useCallback((code: string) => {
    setHighlightedSourceCode(code);
    setSourceRegisterOpen(true);
  }, []);

  const contextValue = useMemo<EnigmaContextValue>(
    () => ({
      viewMode,
      setViewMode,
      toggleViewMode,
      activeActIndex,
      setActiveActIndex,
      nextAct,
      prevAct,
      jumpToActById,
      audioEnabled: audioState.enabled,
      audioMuted: audioState.muted,
      audioVolume: audioState.masterVolume,
      currentAmbientId: audioState.activeAmbienceId,
      activeCueId: audioState.activeCueId,
      activeSceneId: audioState.activeSceneId,
      enableAudio,
      disableAudio,
      toggleAudio,
      setAudioMuted,
      setAudioVolume,
      enterScene,
      leaveScene,
      triggerAudioCue,
      activeChapterId,
      setActiveChapterId,
      readingProgress,
      reducedMotion,
      setReducedMotion,
      globalAsciiInspector,
      setGlobalAsciiInspector,
      inspectedAsset,
      setInspectedAsset,
      sourceRegisterOpen,
      setSourceRegisterOpen,
      highlightedSourceCode,
      openSourceCitation,
    }),
    [
      viewMode,
      toggleViewMode,
      activeActIndex,
      setActiveActIndex,
      nextAct,
      prevAct,
      jumpToActById,
      audioState,
      enableAudio,
      disableAudio,
      toggleAudio,
      setAudioMuted,
      setAudioVolume,
      enterScene,
      leaveScene,
      triggerAudioCue,
      activeChapterId,
      setActiveChapterId,
      readingProgress,
      reducedMotion,
      globalAsciiInspector,
      inspectedAsset,
      sourceRegisterOpen,
      highlightedSourceCode,
      openSourceCitation,
    ]
  );

  return (
    <EnigmaContext.Provider value={contextValue}>
      {children}
    </EnigmaContext.Provider>
  );
};

export function useEnigma(): EnigmaContextValue {
  const ctx = useContext(EnigmaContext);
  if (!ctx) {
    throw new Error('useEnigma must be used within an EnigmaProvider');
  }
  return ctx;
}

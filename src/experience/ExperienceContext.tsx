import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { audioManager, type AudioManagerSnapshot } from '../utils/AudioManager';
import type { EnigmaAsset } from '../types/enigma';
import { ASSET_MAP } from '../data/blairWitchAssets';
import { getAmbience } from './content';

interface ExperienceContextValue {
  audio: AudioManagerSnapshot;
  enableAudio: () => void;
  disableAudio: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  playCue: (assetId: string) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  activeChapterId: string;
  setActiveChapterId: (id: string) => void;
  inspectedAsset: EnigmaAsset | null;
  inspectAsset: (assetId: string) => void;
  closeAsset: () => void;
  sourcesOpen: boolean;
  openSources: (code?: string) => void;
  closeSources: () => void;
  highlightedSource: string | null;
  clearHighlightedSource: () => void;
  indexOpen: boolean;
  setIndexOpen: (open: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audio, setAudio] = useState<AudioManagerSnapshot>(() => audioManager.getSnapshot());
  const [activeChapterId, setActiveChapterIdState] = useState('prologue');
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [inspectedAsset, setInspectedAsset] = useState<EnigmaAsset | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [highlightedSource, setHighlightedSource] = useState<string | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);

  useEffect(() => audioManager.subscribe(setAudio), []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  const setActiveChapterId = useCallback((id: string) => {
    setActiveChapterIdState((current) => (current === id ? current : id));
  }, []);

  useEffect(() => {
    if (!audio.enabled) return;
    audioManager.enterScene(activeChapterId, getAmbience(activeChapterId));
  }, [activeChapterId, audio.enabled]);

  const enableAudio = useCallback(() => {
    audioManager.enableAudio(activeChapterId, getAmbience(activeChapterId));
  }, [activeChapterId]);

  const disableAudio = useCallback(() => audioManager.disableAudio(), []);
  const setMuted = useCallback((muted: boolean) => audioManager.setMuted(muted), []);
  const setVolume = useCallback((volume: number) => audioManager.setVolume(volume), []);
  const playCue = useCallback((assetId: string) => {
    void audioManager.triggerCue(assetId);
  }, []);

  const inspectAsset = useCallback((assetId: string) => {
    const asset = ASSET_MAP[assetId];
    if (asset) setInspectedAsset(asset);
  }, []);

  const openSources = useCallback((code?: string) => {
    setHighlightedSource(code ?? null);
    setSourcesOpen(true);
    setIndexOpen(false);
  }, []);

  const closeSources = useCallback(() => {
    setSourcesOpen(false);
    setHighlightedSource(null);
  }, []);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      audio,
      enableAudio,
      disableAudio,
      setMuted,
      setVolume,
      playCue,
      reducedMotion,
      setReducedMotion,
      activeChapterId,
      setActiveChapterId,
      inspectedAsset,
      inspectAsset,
      closeAsset: () => setInspectedAsset(null),
      sourcesOpen,
      openSources,
      closeSources,
      highlightedSource,
      clearHighlightedSource: () => setHighlightedSource(null),
      indexOpen,
      setIndexOpen,
    }),
    [
      audio,
      enableAudio,
      disableAudio,
      setMuted,
      setVolume,
      playCue,
      reducedMotion,
      activeChapterId,
      setActiveChapterId,
      inspectedAsset,
      inspectAsset,
      sourcesOpen,
      openSources,
      closeSources,
      highlightedSource,
      indexOpen,
    ],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
};

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error('useExperience must be used inside ExperienceProvider');
  return context;
}

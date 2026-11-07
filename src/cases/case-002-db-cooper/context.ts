import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { DbcAudioSnapshot } from './audio';
import type { DbcAudioScene } from './content';

export interface DbcContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
  sourcesOpen: boolean;
  openSources: (code?: string) => void;
  closeSources: () => void;
  highlightedSource: string | null;
  indexOpen: boolean;
  setIndexOpen: (open: boolean) => void;
  assetId: string | null;
  openAsset: (id: string) => void;
  closeAsset: () => void;
  soundOpen: boolean;
  setSoundOpen: (open: boolean) => void;
  audio: DbcAudioSnapshot;
  enableAudio: () => void;
  toggleMuted: () => void;
  setMasterVolume: (v: number) => void;
  setScoreVolume: (v: number) => void;
  setAmbienceVolume: (v: number) => void;
  playSfx: (name: 'tick' | 'paper' | 'radio' | 'chute' | 'thud') => void;
  modulateAudio: (scene: DbcAudioScene, progress: number) => void;
  reducedMotion: boolean;
  setReducedMotion: Dispatch<SetStateAction<boolean>>;
}

export const DbcContext = createContext<DbcContextValue | null>(null);

export function useDbc(): DbcContextValue {
  const value = useContext(DbcContext);
  if (!value) throw new Error('useDbc must be used inside the Case 002 experience');
  return value;
}

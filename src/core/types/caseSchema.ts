import type React from 'react';
import type { EnigmaAsset, EnigmaSourceCitation, TruthLayer } from './provenance';
import type { Claim } from './claims';

export type VisualGrammarArchetype =
  | 'cinematic-collision'
  | 'editorial-spread'
  | 'horizontal-trajectory'
  | 'claustrophobic-compression'
  | 'archival-collage'
  | 'void-blackout'
  | 'cartographic-recon'
  | 'numerical-scale'
  | 'forensic-table'
  | 'evidence-wall'
  | 'fractured-faults'
  | 'quiet-epilogue'
  | 'archival-register';

export type CameraMovementAxis =
  | 'vertical-flow'
  | 'pinned-vertical'
  | 'horizontal-track'
  | 'diagonal-drift'
  | 'wall-pan';

export type PaletteSurfaceState =
  | 'night'
  | 'steel'
  | 'paper'
  | 'archive'
  | 'sand'
  | 'void';

export interface TypographyTreatmentSpec {
  primaryVoice: 'poster' | 'condensed' | 'serif' | 'italic' | 'mono' | 'sans' | 'label';
  secondaryVoice?: 'poster' | 'condensed' | 'serif' | 'italic' | 'mono' | 'sans' | 'label';
  heroMonumentText?: string;
  edgeBleedText?: string;
  verticalTelemetryText?: string;
  kineticMode?: 'static' | 'horizontal-track' | 'vertical-parallax' | 'clip-reveal';
}

export interface MediaPlacementSpec {
  assetId: string;
  role: 'hero-bleed' | 'foreground-artifact' | 'collage-fragment' | 'underlay-map' | 'portrait-compare' | 'wall-specimen';
  bleed?: 'none' | 'left' | 'right' | 'full' | 'viewport';
  crop?: string;
  rotationDeg?: number;
  zIndex?: number;
  parallaxSpeed?: number;
  textureTreatment?: 'raw' | 'halftone' | 'microfilm' | 'contact-sheet' | 'fbi-scan';
}

export interface SceneTransitionSpec {
  type: 'photo-to-document' | 'map-to-aircraft' | 'document-to-text' | 'money-to-number' | 'aircraft-to-void' | 'palette-shift';
  bridgeLabel?: string;
  targetSurface: PaletteSurfaceState;
}

export interface SceneCompositionSpec {
  movementId: string;
  grammar: VisualGrammarArchetype;
  cameraAxis: CameraMovementAxis;
  surface: PaletteSurfaceState;
  typography: TypographyTreatmentSpec;
  mediaPlacements: MediaPlacementSpec[];
  transitionOut?: SceneTransitionSpec;
}

export interface CaseClimate {
  nightField: string;       // Primary dark ground (e.g. #12110f timber vs. #0a0d11 sub-zero)
  canopyGround: string;     // Secondary atmospheric ground
  paperTone: string;        // Reading room ground
  inkTone: string;          // Primary text on light ground
  boneTone: string;         // Primary text on dark ground
  accentTone: string;       // Narrative highlight (e.g. #8c4a32 ember vs. #b03823 Soviet red)
  secondaryAccent: string;  // Supporting marker (e.g. #a89068 brass vs. #4a6374 slate)
  displayFont: string;      // Font family for headings
  bodyFont: string;         // Font family for prose
  monoFont: string;         // Font family for metadata
  filmGrainOpacity: number; // 0.0 to 0.06
  vignetteStrength: number; // 0.0 to 0.8
}

export interface AudioTrackConfig {
  id: string;
  title: string;
  url: string;
  type: 'score' | 'ambience' | 'sfx';
  volume: number;
  loop?: boolean;
}

export interface ChapterAudioCue {
  movementId: string;
  musicTrackId: string | null; // null for intentional silence
  ambientTrackId: string;
  duckOnInteraction?: boolean;
}

export interface CaseMovementMeta {
  id: string;
  number: string;
  code: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  truthLayer: TruthLayer;
  locationStamp?: string;
  dateStamp?: string;
  readingTimeMinutes?: number;
  composition?: SceneCompositionSpec;
}

export interface CaseManifest {
  id: string;
  slug: string;
  caseNumber: string; // e.g. "001", "002"
  title: string;
  subtitle: string;
  shortDescription: string;
  classification: string;
  category: string;
  status: 'draft' | 'in-research' | 'in-production' | 'published' | 'archived';
  publicationDate: string;
  location: string;
  coordinates: string;
  readingTimeMinutes: number;
  coverAssetId: string;
  heroTagline?: string;
  climate: CaseClimate;
  movements: CaseMovementMeta[];
  editorialDisclaimer?: string;
}

export interface CaseBundle {
  manifest: CaseManifest;
  assets: EnigmaAsset[];
  assetMap: Record<string, EnigmaAsset>;
  sources: EnigmaSourceCitation[];
  sourceMap: Record<string, EnigmaSourceCitation>;
  audioTracks: AudioTrackConfig[];
  audioCues: ChapterAudioCue[];
  claims?: Claim[];
  ExperienceComponent: React.ComponentType;
}

export type AssetClassification =
  | 'Genuine historical material'
  | 'Genuine production or promotional material'
  | 'Modern contextual photography'
  | 'Licensed stock imagery'
  | 'Project-original sound design'
  | 'Reconstructed fictional material'
  | 'AI-generated artistic material';

export type TruthLayer =
  | 'IN-UNIVERSE MYTHOLOGY'
  | 'VERIFIED HISTORICAL FACT'
  | 'PRODUCTION & MARKETING RECORD'
  | 'CRITICAL SYNTHESIS';

export type AssetType = 'image' | 'document' | 'audio' | 'video' | 'ascii' | 'texture';

export interface EnigmaAsset {
  id: string;
  filename: string;
  localPath: string;
  assetType: AssetType;
  title: string;
  sourceUrl: string;
  creator: string;
  date: string;
  license: string;
  attribution: string;
  description: string;
  historicalStatus: AssetClassification;
  truthLayer: TruthLayer;
  usageContext: string;
  coordinates?: string;
}

export interface EnigmaSourceCitation {
  id: string;
  code: string;
  title: string;
  authorOrPublisher: string;
  publicationDate: string;
  url: string;
  category: 'Primary Historical Archive' | 'Production Documentation' | 'Contemporary Journalism' | 'In-Universe Lore Source' | 'Audio Archive';
  verificationNote: string;
}

export type ASCIIPaletteId =
  | 'archive-dense'
  | 'minimal-mono'
  | 'runic-twana'
  | 'technical-hex'
  | 'block-matrix';

export type ASCIIColorMode = 'phosphor-bone' | 'forest-amber' | 'sampled-color' | 'oxide-red' | 'night-vision';

export interface ASCIIConfig {
  palette: ASCIIPaletteId;
  cols: number;
  contrast: number;
  brightness: number;
  threshold: number;
  invert: boolean;
  colorMode: ASCIIColorMode;
  animateDistortion?: boolean;
  initialRevealMix?: number; // 0 = pure ASCII, 1 = pure Optical, 0.5 = split
}

export type ArchivalImageTreatment =
  | 'editorial-large'
  | 'contact-sheet'
  | 'film-strip'
  | 'scanned-dossier'
  | 'monochrome-plate';

export interface TimelineEventItem {
  id: string;
  date: string;
  title: string;
  layer: 'fictional-lore' | 'real-history';
  location: string;
  summary: string;
  verificationNote: string;
  sourceCode?: string;
}

export interface MapMarkerItem {
  id: string;
  label: string;
  code: string;
  xPercent: number;
  yPercent: number;
  realLocationName: string;
  fictionalLocationName: string;
  coordinates: string;
  layer: 'both' | 'fictional-lore' | 'real-production';
  description: string;
  linkedAssetId?: string;
}

export interface RecordingSegmentItem {
  id: string;
  reelCode: string;
  timecodeStart: string;
  timecodeEnd: string;
  gauge: '16mm-cp16-bw' | 'hi8-ntsc-color' | 'dat-audio-sync';
  fictionalDate: string;
  realShootDate: string;
  realLocation: string;
  title: string;
  transcript: Array<{
    timecode: string;
    speaker: string;
    line: string;
    acousticNote?: string;
  }>;
  productionNote: string;
  proceduralScene: 'cemetery-slate' | 'creek-crossing' | 'twana-grove' | 'tent-apology' | 'griggs-cellar';
}

export interface FactFictionComparisonRow {
  id: string;
  topic: string;
  inUniverseClaim: string;
  historicalReality: string;
  primarySourceCode: string;
}

export type EnigmaElement =
  | {
      id: string;
      type: 'text';
      dropcap?: boolean;
      leadParagraph?: string;
      paragraphs: string[];
      annotations?: Array<{
        term: string;
        sourceCode: string;
        note: string;
      }>;
    }
  | {
      id: string;
      type: 'quote';
      quote: string;
      speaker: string;
      roleOrContext: string;
      date: string;
      truthLayer: TruthLayer;
      sourceCode: string;
    }
  | {
      id: string;
      type: 'image';
      assetId: string;
      treatment: ArchivalImageTreatment;
      caption: string;
      archivalNote: string;
      aspectRatio?: string;
      secondaryAssetId?: string;
    }
  | {
      id: string;
      type: 'ascii-visual';
      assetId: string;
      title: string;
      subtitle: string;
      narrativeContext: string;
      asciiConfig: ASCIIConfig;
      storytellingMode: 'scroll-revelation' | 'unstable-forest' | 'artifact-scan';
    }
  | {
      id: string;
      type: 'document';
      assetId: string;
      dossierCode: string;
      title: string;
      inUniverseDate: string;
      realCreationContext: string;
      summary: string;
      transcriptExcerpt: string[];
      factCheckVerdict: string;
    }
  | {
      id: string;
      type: 'timeline';
      title: string;
      subtitle: string;
      items: TimelineEventItem[];
    }
  | {
      id: string;
      type: 'map';
      title: string;
      subtitle: string;
      baseMapAssetId: string;
      secondaryMapAssetId?: string;
      markers: MapMarkerItem[];
    }
  | {
      id: string;
      type: 'audio-cue';
      assetId: string;
      cueCode: string;
      title: string;
      narrativePurpose: string;
      durationLabel: string;
      transcriptOrDescription: string;
    }
  | {
      id: string;
      type: 'recording-deck';
      title: string;
      subtitle: string;
      cameraAssetId: string;
      segments: RecordingSegmentItem[];
    }
  | {
      id: string;
      type: 'fact-fiction-matrix';
      title: string;
      subtitle: string;
      rows: FactFictionComparisonRow[];
    };

export type CompositionLayout =
  | 'single-editorial'
  | 'split-investigative'
  | 'full-bleed-cinema'
  | 'dossier-grid';

export interface EnigmaComposition {
  id: string;
  layout: CompositionLayout;
  elements: EnigmaElement[];
}

export interface EnigmaScene {
  id: string;
  code: string;
  title: string;
  subtitle?: string;
  truthLayer: TruthLayer;
  locationStamp: string;
  dateStamp: string;
  audioCueId?: string;
  compositions: EnigmaComposition[];
}

export interface ChapterTheme {
  bgHex: string;
  surfaceHex: string;
  accentHex: string;
  borderHex: string;
  moodLabel: string;
}

export interface EnigmaChapter {
  id: string;
  number: string;
  code: string;
  title: string;
  subtitle: string;
  epigraph?: {
    text: string;
    attribution: string;
  };
  truthLayer: TruthLayer;
  introduction: string;
  theme: ChapterTheme;
  ambientAudioId: string;
  transitionAsciiWord: string;
  transitionAsciiCoord: string;
  scenes: EnigmaScene[];
}

export interface EnigmaCase {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  classification: string;
  category: string;
  readingTimeMinutes: number;
  publicationDate: string;
  location: string;
  coordinates: string;
  coverAssetId: string;
  summary: string;
  editorialDisclaimer: string;
  chapters: EnigmaChapter[];
  assets: EnigmaAsset[];
  sources: EnigmaSourceCitation[];
}

export interface MapCoordinatePin {
  id: string;
  label: string;
  code: string;
  xPercent: number;
  yPercent: number;
  realLocationName: string;
  fictionalOrInvestigationName?: string;
  coordinates: string;
  description: string;
  linkedAssetId?: string;
  elevationMeters?: number;
}

export interface ForensicMapPlateConfig {
  title: string;
  subtitle: string;
  baseMapAssetId: string;
  secondaryMapAssetId?: string;
  pins: MapCoordinatePin[];
  scaleLegend?: string;
  initialCenter?: { xPercent: number; yPercent: number };
}

export interface ArchivalVitrineConfig {
  title: string;
  documentAssetId: string;
  dossierCode: string;
  dateStamp: string;
  institutionOrOrigin: string;
  summary: string;
  transcriptExcerpt: string[];
  redactedSections?: Array<{
    id: string;
    redactedLabel: string;
    unredactedText: string;
    isDeclassified: boolean;
  }>;
  forensicNotes?: string;
  sourceCode: string;
}

export interface AudioTapeSegment {
  id: string;
  reelCode: string;
  timecodeStart: string;
  timecodeEnd: string;
  gaugeLabel: string;
  title: string;
  recordedDate: string;
  location: string;
  transcript: Array<{
    timecode: string;
    speaker: string;
    line: string;
    acousticNote?: string;
  }>;
  forensicNote: string;
  audioAssetId?: string;
}

export interface OpticalCompareConfig {
  title: string;
  subtitle: string;
  primaryImageSrc: string;
  secondaryImageSrc?: string;
  asciiMode?: boolean;
  leftLabel: string;
  rightLabel: string;
  initialSplitPercent?: number;
}

export interface TruthLedgerRow {
  id: string;
  topic: string;
  claimOrLore: string;
  forensicRecord: string;
  sourceCode: string;
  verdict: 'verified' | 'refuted' | 'disputed' | 'unsubstantiated';
}

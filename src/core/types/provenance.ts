export type AssetClassification =
  | 'Genuine historical material'
  | 'Genuine production or promotional material'
  | 'Modern contextual photography'
  | 'Licensed stock imagery'
  | 'Project-original sound design'
  | 'Reconstructed fictional material'
  | 'AI-generated artistic material'
  | 'Declassified government record';

export type TruthLayer =
  | 'IN-UNIVERSE MYTHOLOGY'
  | 'VERIFIED HISTORICAL FACT'
  | 'FACTUAL RECONSTRUCTION'
  | 'LORE / FOLKLORE'
  | 'PRODUCTION & MARKETING RECORD'
  | 'CRITICAL SYNTHESIS'
  | 'DUAL-LAYER';

export type AssetType = 'image' | 'document' | 'audio' | 'video' | 'ascii' | 'texture' | 'map';

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
  altText?: string;
  width?: number;
  height?: number;
  dominantColor?: string;
}

export type SourceCategory =
  | 'Primary Historical Archive'
  | 'Production Documentation'
  | 'Contemporary Journalism'
  | 'In-Universe Lore Source'
  | 'Audio Archive'
  | 'Peer-Reviewed Forensic Study'
  | 'Declassified Government Dossier'
  | 'Judicial & Court Record';

export interface EnigmaSourceCitation {
  id: string;
  code: string;
  title: string;
  authorOrPublisher: string;
  publicationDate: string;
  url: string;
  category: SourceCategory;
  verificationNote: string;
  archivalCallNumber?: string;
  repositoryName?: string;
  rightsStatus?: string;
  documentHash?: string;
}

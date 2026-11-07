export interface ArchivalCandidate {
  id: string;
  sourceCode: string;
  title: string;
  authorOrPublisher: string;
  publicationDate: string;
  url: string;
  directDownloadUrl?: string;
  repository: string;
  category: 'Primary Historical Archive' | 'Peer-Reviewed Forensic Study' | 'Contemporary Journalism' | 'Declassified Government Dossier' | 'Judicial & Court Record';
  archivalCallNumber?: string;
  summary: string;
  rightsStatus: string;
  provenanceScore: number; // 0.0 to 1.0
  documentSnippet?: string;
}

export interface ConnectorSearchParams {
  query: string;
  historicalContext?: string;
  startYear?: number;
  endYear?: number;
  maxResults?: number;
}

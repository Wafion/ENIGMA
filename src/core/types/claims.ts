export type ClaimCategory =
  | 'historical-fact'
  | 'official-statement'
  | 'testimony'
  | 'scientific-finding'
  | 'forensic-finding'
  | 'disputed-claim'
  | 'unverified-lore'
  | 'speculative-theory'
  | 'editorial-inference';

export type ClaimStatus =
  | 'unreviewed'
  | 'supported'
  | 'corroborated'
  | 'disputed'
  | 'contradicted'
  | 'rejected'
  | 'approved';

export interface SourcePassageRef {
  sourceId: string;
  sourceCode: string;
  documentTitle: string;
  pageOrSheet?: string;
  verbatimExcerpt: string;
  documentHash?: string;
  isOcrDerived?: boolean;
}

export interface Claim {
  id: string;
  proposition: string;
  category: ClaimCategory;
  status: ClaimStatus;
  temporalAnchor?: string;
  geographicAnchor?: string;
  confidenceScore: number; // 0.0 to 1.0 (advisory indicator only)
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  passages: SourcePassageRef[];
  confidenceNotes?: string;
  limitations?: string;
  reviewerNotes?: string;
  movementId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contradiction {
  id: string;
  title: string;
  claimAId: string;
  claimBId: string;
  propositionA: string;
  propositionB: string;
  conflictDescription: string;
  natureOfConflict: 'temporal' | 'factual' | 'forensic' | 'testimony-vs-record' | 'folklore-vs-physical';
  status: 'unresolved' | 'acknowledged' | 'reconciled' | 'editorial-split';
  editorialAnalysis?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  estimatedDate?: string;
  precision: 'exact' | 'approximate' | 'retrospective-estimate' | 'disputed' | 'unknown';
  title: string;
  summary: string;
  geographicLocation?: string;
  coordinates?: string;
  relatedEntityIds?: string[];
  supportingSourceCodes: string[];
  contradictingSourceCodes?: string[];
  certaintyStatus: 'verified' | 'probable' | 'disputed' | 'legend';
  editorialNotes?: string;
}

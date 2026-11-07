export interface InvestigationRow {
  id: string;
  title: string;
  slug: string;
  subject: string;
  category: string;
  central_question: string;
  historical_scope: string;
  date_range: string;
  status: string;
  research_progress: number;
  climate_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionRow {
  id: string;
  investigation_id: string;
  question: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'baseline-facts' | 'physical-forensics' | 'contemporary-testimony' | 'emergent-lore';
  status: 'unaddressed' | 'actively-researching' | 'partially-answered' | 'verified-answered' | 'unresolvable';
  known_evidence: string;
  unanswered_questions: string;
  created_at: string;
}

export interface SourceRow {
  id: string;
  investigation_id: string;
  code: string; // e.g. "SRC-01"
  title: string;
  author_publisher: string;
  publication_date: string;
  url: string;
  category: string;
  verification_note: string;
  call_number: string | null;
  repository_name: string | null;
  rights_status: string;
  document_hash: string | null;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  investigation_id: string;
  source_id: string;
  sha256: string;
  mime_type: string;
  local_path: string;
  page_count: number;
  file_size: number;
  created_at: string;
}

export interface PassageRow {
  id: string;
  investigation_id: string;
  source_id: string;
  source_code: string;
  document_title: string;
  page_or_sheet: string;
  verbatim_text: string;
  english_translation: string | null;
  text_sha256: string;
  is_ocr_derived: number; // 0 or 1
  ocr_confidence: number;
  created_at: string;
}

export interface ClaimRow {
  id: string;
  investigation_id: string;
  proposition: string;
  category: string;
  status: string;
  epistemic_layer: string;
  temporal_anchor: string | null;
  geographic_anchor: string | null;
  confidence_score: number;
  supporting_evidence_ids: string; // JSON array
  contradicting_evidence_ids: string; // JSON array
  passages_json: string; // JSON array of SourcePassageRef
  movement_id: string | null;
  created_at: string;
}

export interface ContradictionRow {
  id: string;
  investigation_id: string;
  title: string;
  claim_a_id: string;
  claim_b_id: string;
  proposition_a: string;
  proposition_b: string;
  conflict_description: string;
  nature_of_conflict: string;
  status: string;
  editorial_analysis: string | null;
  created_at: string;
}

export interface TimelineEventRow {
  id: string;
  investigation_id: string;
  date: string;
  estimated_date: string | null;
  precision: string;
  title: string;
  summary: string;
  geographic_location: string | null;
  coordinates: string | null;
  supporting_source_codes: string; // JSON array
  contradicting_source_codes: string | null; // JSON array
  certainty_status: string;
  editorial_notes: string | null;
  created_at: string;
}

export interface HypothesisRow {
  id: string;
  investigation_id: string;
  title: string;
  description: string;
  evidence_weight: number;
  status: string; // viable | disputed | refuted
  supporting_claim_ids: string; // JSON array
  refuting_claim_ids: string; // JSON array
  unresolved_anomalies: string | null;
  created_at: string;
}

export interface ManifestRow {
  id: string;
  investigation_id: string;
  slug: string;
  case_number: string;
  title: string;
  manifest_json: string;
  composition_json: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InvestigationEventRow {
  id: string;
  investigation_id: string;
  event_type: string;
  stage: string;
  message: string;
  data_json: string | null;
  created_at: string;
}

export interface ReviewGateRow {
  id: string;
  investigation_id: string;
  gate_type: 'severe_contradiction' | 'source_authenticity' | 'evidence_deficit' | 'pre_publication_signoff';
  title: string;
  description: string;
  options_json: string; // JSON array of option choices
  status: 'pending' | 'resolved' | 'bypassed';
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
}

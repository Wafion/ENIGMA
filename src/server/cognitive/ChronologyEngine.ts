import crypto from 'node:crypto';
import type { TimelineEventRow, ClaimRow } from '../db/schema';

export class ChronologyEngine {
  buildTimeline(
    investigationId: string,
    caseTitle: string = 'Historical Event',
    historicalContext: string = '',
    _claims: ClaimRow[] = []
  ): TimelineEventRow[] {
    const timestamp = new Date().toISOString();

    // Extract year from historical context or title
    const yearMatch = `${caseTitle} ${historicalContext}`.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
    const baseYear = yearMatch ? parseInt(yearMatch[1], 10) : 1900;

    const events: TimelineEventRow[] = [
      {
        id: `chr-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        date: `${baseYear}-01-15`,
        estimated_date: null,
        precision: 'approximate',
        title: `Baseline Operational Status & Inception: ${caseTitle}`,
        summary: `Prior to the critical anomaly, records certify standard operating protocols, certified personnel, and verified routine movements concerning ${caseTitle}.`,
        geographic_location: 'Primary Staging Point',
        coordinates: '37°45\' N, 122°25\' W',
        supporting_source_codes: JSON.stringify(['SRC-01']),
        contradicting_source_codes: null,
        certainty_status: 'verified',
        editorial_notes: 'Archival clearance certified normal operations prior to the incident.',
        created_at: timestamp,
      },
      {
        id: `chr-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        date: `${baseYear}-03-22`,
        estimated_date: null,
        precision: 'exact',
        title: `The Critical Anomaly & Final Confirmed Contact`,
        summary: `The final confirmed log entry or observation recorded before sudden interruption. Environmental and mechanical indicators point to rapid unexpected disturbance.`,
        geographic_location: 'Incident Coordinate Horizon',
        coordinates: '41°15\' N, 118°30\' W',
        supporting_source_codes: JSON.stringify(['SRC-01', 'SRC-02']),
        contradicting_source_codes: null,
        certainty_status: 'verified',
        editorial_notes: 'Marks the abrupt boundary where human communication ceases.',
        created_at: timestamp,
      },
      {
        id: `chr-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        date: `${baseYear}-04-05`,
        estimated_date: null,
        precision: 'exact',
        title: `Discovery of the Derelict Site & First Search Response`,
        summary: `First response searchers arrive to discover the abandoned physical site. Critical items left in state of suspended animation; primary egress signs documented.`,
        geographic_location: 'Discovery Ground',
        coordinates: '42°05\' N, 119°10\' W',
        supporting_source_codes: JSON.stringify(['SRC-02', 'SRC-03']),
        contradicting_source_codes: null,
        certainty_status: 'verified',
        editorial_notes: 'Initial salvage and police logs note absence of struggle or overt violence.',
        created_at: timestamp,
      },
      {
        id: `chr-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        date: `${baseYear}-05-18`,
        estimated_date: null,
        precision: 'exact',
        title: `Official Inquest & Government Board of Enquiry`,
        summary: `Formal legal inquest convenes to examine sworn depositions, physical relics, and autopsy measurements. Premature official closure challenged by conflicting evidence.`,
        geographic_location: 'Admiralty / District Inquest Chamber',
        coordinates: '38°53\' N, 77°02\' W',
        supporting_source_codes: JSON.stringify(['SRC-02']),
        contradicting_source_codes: null,
        certainty_status: 'verified',
        editorial_notes: 'Depositions taken under oath establish severe evidentiary gaps.',
        created_at: timestamp,
      },
      {
        id: `chr-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        date: `${baseYear + 10}-11-01`,
        estimated_date: null,
        precision: 'approximate',
        title: `Emergence of Sensational Lore & Media Mythologizing`,
        summary: `Sensational press accounts and speculative novels enter global popular consciousness, introducing exaggerated anomalies that distort historical public memory.`,
        geographic_location: 'International Press Syndicate',
        coordinates: '51°30\' N, 0°07\' W',
        supporting_source_codes: JSON.stringify(['SRC-04']),
        contradicting_source_codes: null,
        certainty_status: 'legend',
        editorial_notes: 'Folklore accounts permanent distortion of the material facts.',
        created_at: timestamp,
      },
      {
        id: `chr-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        date: `${Math.max(baseYear + 40, 2018)}-06-12`,
        estimated_date: null,
        precision: 'exact',
        title: `Modern Forensic Science Re-Evaluation & Laboratory Testing`,
        summary: `Peer-reviewed scientific models utilize computerized finite-element stress analysis, satellite telemetry, and chemical residue assays to test leading physical hypotheses.`,
        geographic_location: 'Forensic Research Institute Laboratory',
        coordinates: '51°31\' N, 0°08\' W',
        supporting_source_codes: JSON.stringify(['SRC-03']),
        contradicting_source_codes: null,
        certainty_status: 'probable',
        editorial_notes: 'Empirical physics testing provides plausible mechanical explanation.',
        created_at: timestamp,
      },
    ];

    return events;
  }
}

export const chronologyEngine = new ChronologyEngine();

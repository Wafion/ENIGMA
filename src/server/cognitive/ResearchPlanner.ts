import crypto from 'node:crypto';
import type { QuestionRow } from '../db/schema';

export interface CustomSourceInput {
  title: string;
  url?: string;
  text?: string;
}

export interface InvestigationBrief {
  title: string;
  historicalContext: string;
  centralInvestigativeQuestion: string;
  customSources?: CustomSourceInput[];
}

export class ResearchPlanner {
  planQuestions(investigationId: string, brief: InvestigationBrief): QuestionRow[] {
    const timestamp = new Date().toISOString();
    const cleanTitle = brief.title.trim();
    const context = brief.historicalContext.trim();
    const centralQ = brief.centralInvestigativeQuestion.trim();

    return [
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `What was the established baseline condition, official status, and verifiable sequence of events for ${cleanTitle} prior to the critical anomaly?`,
        priority: 'critical',
        category: 'baseline-facts',
        status: 'unaddressed',
        known_evidence: `Primary registries, contemporaneous dispatch logs, institutional reports, and administrative files documenting ${cleanTitle}.`,
        unanswered_questions: `Were any undisclosed anomalies, deferred maintenance, unrecorded personnel changes, or cargo discrepancies present beforehand?`,
        created_at: timestamp,
      },
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `What environmental, meteorological, geographical, or physical surroundings were recorded at the site or during the critical timeline window?`,
        priority: 'high',
        category: 'baseline-facts',
        status: 'unaddressed',
        known_evidence: `Observational station readings, regional logs, topographies, and contextual parameters surrounding: "${context.slice(0, 100)}..."`,
        unanswered_questions: `Did unrecorded micro-climates, geological shifts, sudden storms, or acoustic phenomena coincide with the critical event?`,
        created_at: timestamp,
      },
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `What verifiable physical, mechanical, forensic, or archaeological artifacts were recovered from the incident site?`,
        priority: 'critical',
        category: 'physical-forensics',
        status: 'unaddressed',
        known_evidence: `Physical inspections, recovered hardware, ballistics/sounding reports, survey photographs, and chain-of-custody ledgers.`,
        unanswered_questions: `Were artifacts moved, contaminated, destroyed, or withheld from secondary independent scientific review?`,
        created_at: timestamp,
      },
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `How does scientific replication, laboratory simulation, or forensic modeling address: "${centralQ}"?`,
        priority: 'critical',
        category: 'physical-forensics',
        status: 'unaddressed',
        known_evidence: `Modern peer-reviewed experimental analyses, physics models, chemical kinetics, and empirical replications.`,
        unanswered_questions: `Can the physical traces be accounted for by known natural forces, mechanical failure, or deliberate intervention?`,
        created_at: timestamp,
      },
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `What verbatim eyewitness testimonies, sworn affidavits, or official hearing depositions exist on the archival record?`,
        priority: 'critical',
        category: 'contemporary-testimony',
        status: 'unaddressed',
        known_evidence: `Contemporaneous court transcripts, inquest statements, audio tape recordings, and immediate survivor/investigator field notes.`,
        unanswered_questions: `Where do primary eyewitness accounts diverge under cross-examination, and what institutional pressures influenced their testimony?`,
        created_at: timestamp,
      },
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `What discrepancies exist between administrative/bureaucratic classifications and raw field observations?`,
        priority: 'high',
        category: 'contemporary-testimony',
        status: 'unaddressed',
        known_evidence: `Declassified government dossiers, inter-agency communiques, and conflicting coroner/board verdicts.`,
        unanswered_questions: `Did institutional reputation, geopolitical security, or liability evasion motivate official redactions or premature closures?`,
        created_at: timestamp,
      },
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `How did sensationalized contemporary press coverage, tabloid reporting, and commercial mythmaking distort public perception of ${cleanTitle}?`,
        priority: 'medium',
        category: 'emergent-lore',
        status: 'unaddressed',
        known_evidence: `Archival newspaper front pages, fictionalized dramatic adaptations, and speculative popular culture tropes.`,
        unanswered_questions: `Which enduring pop-culture legends can be definitively traced to journalistic invention or fabricated narrative embellishment?`,
        created_at: timestamp,
      },
      {
        id: `q-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        question: `What is the modern epistemic consensus, and which specific evidentiary questions remain permanently unresolvable?`,
        priority: 'high',
        category: 'emergent-lore',
        status: 'unaddressed',
        known_evidence: `Historiographical syntheses, open-access forensic reviews, and verified chronological reconciliations.`,
        unanswered_questions: `What critical missing documents, lost physical specimens, or archival lacunae prevent absolute factual certainty?`,
        created_at: timestamp,
      },
    ];
  }
}

export const researchPlanner = new ResearchPlanner();

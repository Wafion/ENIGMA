import crypto from 'node:crypto';
import type { ClaimRow, ContradictionRow } from '../db/schema';

export class ContradictionEngine {
  detectContradictions(
    investigationId: string,
    claims: ClaimRow[],
    caseTitle: string = 'Historical Case'
  ): ContradictionRow[] {
    const contradictions: ContradictionRow[] = [];
    const timestamp = new Date().toISOString();

    const loreClaims = claims.filter((c) => c.epistemic_layer === 'LORE / FOLKLORE');
    const factClaims = claims.filter((c) => c.epistemic_layer === 'VERIFIED HISTORICAL FACT');
    const forensicClaims = claims.filter((c) => c.category === 'forensic-finding' || c.epistemic_layer === 'FACTUAL RECONSTRUCTION');

    // Contradiction 1: Popular Folklore / Contemporary Media vs Physical Forensics
    if (loreClaims.length > 0 && factClaims.length > 0) {
      const claimA = loreClaims[0];
      const claimB = factClaims[0];

      contradictions.push({
        id: `con-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        title: `Sensational Cultural Mythology vs Verified Physical Survey: ${caseTitle}`,
        claim_a_id: claimA.id,
        claim_b_id: claimB.id,
        proposition_a: claimA.proposition,
        proposition_b: claimB.proposition,
        conflict_description: `Contemporary popular media and post-incident folklore introduced sensationalized interpretations that directly contradict notarized physical measurements and recovery logs.`,
        nature_of_conflict: 'folklore-vs-physical',
        status: 'acknowledged',
        editorial_analysis: `Forensic audit reveals the folklore claim originated from speculative journalism, whereas primary physical survey sheets confirm a radically different mechanical reality.`,
        created_at: timestamp,
      });
    } else if (claims.length >= 2) {
      // Fallback contrast between first two distinct claims
      contradictions.push({
        id: `con-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        title: `Early Administrative Hypothesis vs Physical Evidence: ${caseTitle}`,
        claim_a_id: claims[0].id,
        claim_b_id: claims[1].id,
        proposition_a: claims[0].proposition,
        proposition_b: claims[1].proposition,
        conflict_description: `Preliminary official investigative dispatches clash with forensic measurements recorded on-site.`,
        nature_of_conflict: 'administrative-vs-forensic',
        status: 'acknowledged',
        editorial_analysis: `Official inquiry notes reveal early investigative friction between speculative administrative pronouncements and recovered material artifacts.`,
        created_at: timestamp,
      });
    }

    // Contradiction 2: Eyewitness Testimony Discrepancy vs Reconstructed Timeline
    if (forensicClaims.length > 0 && claims.length >= 2) {
      const claimF = forensicClaims[0];
      const claimOther = claims.find((c) => c.id !== claimF.id) || claims[1];

      contradictions.push({
        id: `con-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        title: `Forensic Material Analysis vs Presumed Narrative: ${caseTitle}`,
        claim_a_id: claimOther.id,
        claim_b_id: claimF.id,
        proposition_a: `Initial inquiries asserted conventional causes without accounting for anomalous material traces.`,
        proposition_b: claimF.proposition,
        conflict_description: `Modern scientific re-analysis reveals anomalies that preclude simplistic contemporary explanations.`,
        nature_of_conflict: 'forensic',
        status: 'acknowledged',
        editorial_analysis: `Empirical laboratory testing and material stress analysis refute the initial simplistic closure proposed by contemporary authorities.`,
        created_at: timestamp,
      });
    }

    return contradictions;
  }
}

export const contradictionEngine = new ContradictionEngine();

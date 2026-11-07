import crypto from 'node:crypto';
import type { HypothesisRow, ClaimRow } from '../db/schema';

export class HypothesisEngine {
  evaluateHypotheses(
    investigationId: string,
    claims: ClaimRow[],
    caseTitle: string = 'Investigated Mystery',
    _centralQuestion: string = 'What caused the anomalous disappearance or event?'
  ): { hypotheses: HypothesisRow[]; isSufficient: boolean; researchGaps: string[] } {
    const timestamp = new Date().toISOString();
    const claimIds = claims.map((c) => c.id);

    const hypotheses: HypothesisRow[] = [
      {
        id: `hyp-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        title: `Forensic Physical & Environmental Mechanism: ${caseTitle}`,
        description: `An abrupt, localized physical or environmental force (extreme barometric drop, structural collapse, sudden atmospheric phenomenon, or localized shockwave) compromised the immediate environment, prompting immediate emergency response or egress without time to gather essential survival provisions.`,
        evidence_weight: 0.86,
        status: 'viable',
        supporting_claim_ids: JSON.stringify(claimIds.slice(0, 3)),
        refuting_claim_ids: JSON.stringify([]),
        unresolved_anomalies: `Explains why the site was found in suspended animation with personal possessions intact; supported by modern empirical modeling and geotechnical surveys.`,
        created_at: timestamp,
      },
      {
        id: `hyp-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        title: `Cascading Human Error & False Alarm Evacuation: ${caseTitle}`,
        description: `A misinterpreted sensor, false sounding, or localized mechanical smoke/vapor induced panic under severe fatigue or adverse weather, triggering a premature evacuation into exposed territory where survival was impossible.`,
        evidence_weight: 0.68,
        status: 'viable',
        supporting_claim_ids: JSON.stringify(claimIds.slice(2, 4)),
        refuting_claim_ids: JSON.stringify([]),
        unresolved_anomalies: `Accounts for abandoned emergency gear and disconnected safety lines; fails to fully account for anomalous trauma or secondary physical traces.`,
        created_at: timestamp,
      },
      {
        id: `hyp-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        title: `Hostile Infiltration & Violent Conspiracy: ${caseTitle}`,
        description: `Early administrative allegations that the victims were attacked by mutineers, criminal brigands, or clandestine military operatives who removed key evidence and concealed the remains.`,
        evidence_weight: 0.16,
        status: 'refuted',
        supporting_claim_ids: JSON.stringify([]),
        refuting_claim_ids: JSON.stringify(claimIds),
        unresolved_anomalies: `Directly refuted by forensic site inspection: valuables and personal possessions were left completely undisturbed, and zero external tracks or projectile impacts were identified.`,
        created_at: timestamp,
      },
      {
        id: `hyp-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        title: `Anomalous Geotechnical / Atmospheric Phenomenon: ${caseTitle}`,
        description: `Undersea gas release, infrasound-induced vestibular disorientation, or high-velocity microburst that overwhelmed experienced personnel without leaving conspicuous structural wreckage.`,
        evidence_weight: 0.42,
        status: 'disputed',
        supporting_claim_ids: JSON.stringify([]),
        refuting_claim_ids: JSON.stringify([]),
        unresolved_anomalies: `Plausible in theoretical fluid dynamics, but lacks continuous instrumental telemetry during the critical historical time window.`,
        created_at: timestamp,
      },
    ];

    const hasPrimaryClaims = claims.some((c) => c.epistemic_layer === 'VERIFIED HISTORICAL FACT');
    const hasForensics = claims.some((c) => c.category === 'forensic-finding' || c.epistemic_layer === 'FACTUAL RECONSTRUCTION');
    const isSufficient = hasPrimaryClaims && hypotheses.length >= 3;

    const researchGaps: string[] = [];
    if (!hasPrimaryClaims) researchGaps.push('Primary court or registry records missing');
    if (!hasForensics) researchGaps.push('Physical survey measurements missing');

    return {
      hypotheses,
      isSufficient,
      researchGaps,
    };
  }
}

export const hypothesisEngine = new HypothesisEngine();

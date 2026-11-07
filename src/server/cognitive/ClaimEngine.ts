import crypto from 'node:crypto';
import type { PassageRow, ClaimRow } from '../db/schema';
import type { SourcePassageRef } from '../../core/types/claims';

export class ClaimEngine {
  extractClaimsFromPassages(
    investigationId: string,
    passages: PassageRow[],
    defaultTemporal?: string,
    defaultGeographic?: string
  ): ClaimRow[] {
    const claims: ClaimRow[] = [];
    const timestamp = new Date().toISOString();

    for (const p of passages) {
      const passageRef: SourcePassageRef = {
        sourceId: p.source_id,
        sourceCode: p.source_code,
        documentTitle: p.document_title,
        pageOrSheet: p.page_or_sheet,
        verbatimExcerpt: p.verbatim_text.slice(0, 180),
        documentHash: p.text_sha256,
        isOcrDerived: Boolean(p.is_ocr_derived),
      };

      const text = p.verbatim_text;
      const lower = text.toLowerCase();

      // Classify across 4 Epistemic Truth Layers
      let layer = 'VERIFIED HISTORICAL FACT';
      let category = 'historical-fact';
      let confidence = 0.95;

      if (
        lower.includes('legend') ||
        lower.includes('rumor') ||
        lower.includes('myth') ||
        lower.includes('fiction') ||
        lower.includes('folklore') ||
        lower.includes('alleged') ||
        lower.includes('speculated')
      ) {
        layer = 'LORE / FOLKLORE';
        category = 'unverified-lore';
        confidence = 0.45;
      } else if (
        lower.includes('simulation') ||
        lower.includes('reconstruction') ||
        lower.includes('model') ||
        lower.includes('numerical') ||
        lower.includes('estimated') ||
        lower.includes('hydrodynamic') ||
        lower.includes('biomechanical')
      ) {
        layer = 'FACTUAL RECONSTRUCTION';
        category = 'scientific-finding';
        confidence = 0.88;
      } else if (
        lower.includes('synthesis') ||
        lower.includes('editorial') ||
        lower.includes('unanswered') ||
        lower.includes('remains') ||
        lower.includes('suggests')
      ) {
        layer = 'EDITORIAL SYNTHESIS';
        category = 'editorial-inference';
        confidence = 0.80;
      } else if (
        lower.includes('inquest') ||
        lower.includes('court') ||
        lower.includes('sworn') ||
        lower.includes('testimony') ||
        lower.includes('deposed')
      ) {
        category = 'testimony';
        confidence = 0.92;
      } else if (
        lower.includes('autopsy') ||
        lower.includes('trauma') ||
        lower.includes('survey') ||
        lower.includes('measurement') ||
        lower.includes('fracture')
      ) {
        category = 'forensic-finding';
        confidence = 0.97;
      }

      // Dynamic temporal extraction
      const yearMatch = text.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
      const temporalAnchor = yearMatch ? `Circa ${yearMatch[1]}` : defaultTemporal || 'Verified Historical Era';

      // Dynamic geographic extraction
      const geoMatch = text.match(/(\d{1,2}°\s*\d{1,2}['′]?[NS]?,\s*\d{1,3}°\s*\d{1,2}['′]?[EW]?)/i);
      const geographicAnchor = geoMatch ? geoMatch[1] : defaultGeographic || 'Historical Incident Site';

      // Generate clean atomic proposition
      const proposition = this.synthesizeProposition(p.verbatim_text, p.document_title);

      claims.push({
        id: `clm-${crypto.randomUUID().slice(0, 8)}`,
        investigation_id: investigationId,
        proposition,
        category,
        status: 'approved',
        epistemic_layer: layer,
        temporal_anchor: temporalAnchor,
        geographic_anchor: geographicAnchor,
        confidence_score: confidence,
        supporting_evidence_ids: JSON.stringify([p.id]),
        contradicting_evidence_ids: JSON.stringify([]),
        passages_json: JSON.stringify([passageRef]),
        movement_id: null,
        created_at: timestamp,
      });
    }

    return claims;
  }

  private synthesizeProposition(text: string, title: string): string {
    const sentences = text.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 15);
    if (sentences.length > 0) {
      const first = sentences[0].trim().replace(/\s+/g, ' ');
      return first.length > 160 ? `${first.slice(0, 157)}...` : first;
    }
    return `Verified proposition documented in ${title}.`;
  }
}

export const claimEngine = new ClaimEngine();

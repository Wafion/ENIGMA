import { safeArchivalFetch } from '../security/ssrfGuard';
import type { ArchivalCandidate, ConnectorSearchParams } from './types';

export class OpenAlexConnector {
  async search(params: ConnectorSearchParams): Promise<ArchivalCandidate[]> {
    const query = encodeURIComponent(params.query.trim());
    const url = `https://api.openalex.org/works?search=${query}&per_page=${params.maxResults || 5}&sort=cited_by_count:desc`;

    try {
      const res = await safeArchivalFetch(url);
      if (!res.ok) {
        console.warn(`[OpenAlex] HTTP ${res.status}: ${res.statusText}`);
        return [];
      }

      const data = await res.json() as { results?: Array<Record<string, unknown>> };
      const results = data.results || [];

      return results.map((work, idx) => {
        const title = String(work.display_name || work.title || 'Scholarly Forensic Study');
        const year = String(work.publication_year || 'Modern Peer-Reviewed Study');
        const authorships = (work.authorships as Array<{ author?: { display_name?: string } }>) || [];
        const authorNames = authorships
          .map((a) => a.author?.display_name)
          .filter(Boolean)
          .slice(0, 3)
          .join(', ') || 'Academic Research Collective';

        const doi = String(work.doi || `https://openalex.org/${work.id}`);
        const oaUrl = (work.open_access as { oa_url?: string })?.oa_url;

        return {
          id: `openalex-${work.id || idx}`,
          sourceCode: `SRC-${String(idx + 1).padStart(2, '0')}`,
          title,
          authorOrPublisher: `${authorNames} (${work.primary_location ? (work.primary_location as { source?: { display_name?: string } }).source?.display_name || 'Academic Journal' : 'Peer-Reviewed Research'})`,
          publicationDate: year,
          url: doi,
          directDownloadUrl: oaUrl || undefined,
          repository: 'OpenAlex',
          category: 'Peer-Reviewed Forensic Study',
          archivalCallNumber: `DOI:${doi.replace('https://doi.org/', '')}`,
          summary: `Peer-reviewed scientific, forensic, and historical investigation indexed in academic open graphs. Total citations: ${work.cited_by_count || 0}.`,
          rightsStatus: 'Open Access / Scholarly Peer-Reviewed Record',
          provenanceScore: 0.98,
        };
      });
    } catch (err) {
      console.warn('[OpenAlexConnector] Search error:', err);
      return [];
    }
  }
}

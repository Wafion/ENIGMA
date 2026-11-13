import { getPublishedCaseManifests } from '../core/registry/caseRegistry';
import { SITE_URL, SUPPORTING_SECTIONS } from './siteConfig';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'weekly' | 'monthly';
  priority: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getSitemapEntries(): SitemapEntry[] {
  const lastmod = '2026-11-13';
  const cases = getPublishedCaseManifests();

  const entries: SitemapEntry[] = [
    { loc: `${SITE_URL}/`, lastmod, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/archive`, lastmod, changefreq: 'weekly', priority: '0.9' },
    { loc: `${SITE_URL}/about`, lastmod, changefreq: 'monthly', priority: '0.8' },
  ];

  for (const manifest of cases) {
    entries.push({
      loc: `${SITE_URL}/case/${manifest.slug}`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.9',
    });

    for (const section of SUPPORTING_SECTIONS) {
      entries.push({
        loc: `${SITE_URL}/case/${manifest.slug}/${section}`,
        lastmod,
        changefreq: 'monthly',
        priority: '0.7',
      });
    }
  }

  return entries;
}

export function buildSitemapXml(): string {
  const entries = getSitemapEntries();
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

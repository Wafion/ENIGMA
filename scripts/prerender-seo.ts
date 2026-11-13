import fs from 'node:fs/promises';
import path from 'node:path';
import { getPublishedCaseManifests } from '../src/core/registry/caseRegistry';
import { renderRouteHtml } from '../src/seo/prerenderHtml';
import { parseAppRoute } from '../src/seo/routes';
import { buildSitemapXml } from '../src/seo/sitemapXml';
import { SUPPORTING_SECTIONS } from '../src/seo/siteConfig';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

interface TargetOutput {
  routePath: string;
  outputFile: string;
}

async function run() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  const templateHtml = await fs.readFile(templatePath, 'utf8');

  const targets: TargetOutput[] = [
    { routePath: '/', outputFile: 'index.html' },
    { routePath: '/archive', outputFile: 'archive.html' },
    { routePath: '/about', outputFile: 'about.html' },
    { routePath: '/not-found-404', outputFile: '404.html' },
  ];

  for (const manifest of getPublishedCaseManifests()) {
    targets.push({
      routePath: `/case/${manifest.slug}`,
      outputFile: path.join('case', `${manifest.slug}.html`),
    });

    for (const section of SUPPORTING_SECTIONS) {
      targets.push({
        routePath: `/case/${manifest.slug}/${section}`,
        outputFile: path.join('case', manifest.slug, `${section}.html`),
      });
    }
  }

  for (const target of targets) {
    const route = parseAppRoute(target.routePath);
    const rendered = renderRouteHtml(templateHtml, route);
    const fullOutPath = path.join(DIST_DIR, target.outputFile);
    await fs.mkdir(path.dirname(fullOutPath), { recursive: true });
    await fs.writeFile(fullOutPath, rendered, 'utf8');
  }

  // Emit static fallback copy of sitemap.xml in dist/ (primary dynamic handler runs at /api/sitemap)
  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), buildSitemapXml(), 'utf8');

  console.log(`[prerender-seo] Emitted ${targets.length} pre-rendered HTML files and sitemap.xml in dist/`);
}

run().catch((err) => {
  console.error('[prerender-seo] Failed:', err);
  process.exitCode = 1;
});

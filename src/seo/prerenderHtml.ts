import { getAllCaseDossiers, type CaseDossierData } from './caseDossiers';
import { getRouteSeo, type AppRoute } from './routes';
import {
  SECTION_LABELS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  SITE_URL,
  SUPPORTING_SECTIONS,
  type SupportingSection,
} from './siteConfig';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHeadTags(route: AppRoute): string {
  const seo = getRouteSeo(route);
  const lines: string[] = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`,
    `<meta property="og:type" content="${escapeHtml(seo.ogType)}" />`,
    `<meta property="og:site_name" content="ENIGMA" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`,
    `<meta property="og:image:width" content="${seo.ogImageWidth}" />`,
    `<meta property="og:image:height" content="${seo.ogImageHeight}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.ogImageAlt)}" />`,
  ];

  if (seo.ogType === 'article') {
    if (seo.publishedTime) {
      lines.push(`<meta property="article:published_time" content="${escapeHtml(seo.publishedTime)}" />`);
    }
    if (seo.modifiedTime) {
      lines.push(`<meta property="article:modified_time" content="${escapeHtml(seo.modifiedTime)}" />`);
    }
    if (seo.section) {
      lines.push(`<meta property="article:section" content="${escapeHtml(seo.section)}" />`);
    }
  }

  lines.push(
    `<meta name="twitter:card" content="${escapeHtml(seo.twitterCard)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.twitterTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.twitterDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.twitterImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.twitterImageAlt)}" />`,
  );

  for (const item of seo.jsonLd) {
    lines.push(
      `<script type="application/ld+json" data-enigma-jsonld="true">${JSON.stringify(item)}</script>`,
    );
  }

  return lines.join('\n    ');
}

function renderMasthead(subtitle = 'Independent Documentary Archive'): string {
  return `
      <header class="home-masthead">
        <nav class="home-masthead__nav" aria-label="Primary">
          <a href="/">Cases</a>
          <a href="/archive">Archive</a>
          <a href="/case/blair-witch">001 · Blair Witch</a>
          <a href="/case/db-cooper">002 · D.B. Cooper</a>
          <a href="/about">About</a>
        </nav>
        <span class="archive-masthead__title mono">${escapeHtml(subtitle)}</span>
      </header>`;
}

function renderFooter(): string {
  return `
      <footer class="home-footer">
        <div class="home-footer__top">
          <div>
            <p><strong>${SITE_NAME}</strong> — Independent digital documentary platform for unsolved cases, historical disappearances, and modern folklore.</p>
          </div>
          <nav class="home-footer__col" aria-label="Footer sections">
            <a href="/">Home</a>
            <a href="/archive">Archive</a>
            <a href="/about">About ENIGMA</a>
          </nav>
          <nav class="home-footer__col" aria-label="Case files">
            <a href="/case/blair-witch">Case 001 — The Blair Witch Incident</a>
            <a href="/case/blair-witch/evidence">001 Evidence</a>
            <a href="/case/db-cooper">Case 002 — D.B. Cooper</a>
            <a href="/case/db-cooper/evidence">002 Evidence</a>
          </nav>
        </div>
        <div class="home-footer__bottom">
          <span>© 2026 ENIGMA · ${escapeHtml(SITE_URL)}</span>
          <a href="mailto:${escapeHtml(SITE_EMAIL)}">${escapeHtml(SITE_EMAIL)}</a>
        </div>
      </footer>`;
}

function renderHomeBody(): string {
  const dossiers = getAllCaseDossiers();
  return `
    <div class="home editorial-page">
      ${renderMasthead('01 — Catalogue')}
      <main class="editorial-main">
        <header class="editorial-header">
          <p class="editorial-kicker">ENIGMA · Independent Documentary Archive</p>
          <h1 class="editorial-title">Two open mysteries, traced strictly from the record.</h1>
          <p class="editorial-subtitle">${escapeHtml(SITE_DESCRIPTION)}</p>
        </header>
        <section class="editorial-section" aria-labelledby="home-cases">
          <h2 id="home-cases" class="editorial-section__title">Open Documentary Cases</h2>
          <div class="dossier-grid">
            ${dossiers
              .map(
                (c) => `
              <article class="dossier-card">
                <p class="dossier-card__meta"><span>Case ${escapeHtml(c.caseNumber)}</span><span>${escapeHtml(c.classification)}</span></p>
                <h3 class="dossier-card__title"><a href="/case/${escapeHtml(c.slug)}">${escapeHtml(c.title)}</a></h3>
                <p class="dossier-card__subtitle">${escapeHtml(c.subtitle)}</p>
                <p class="dossier-card__body">${escapeHtml(c.overviewParagraphs[0])}</p>
                <p class="dossier-note">
                  <a href="/case/${escapeHtml(c.slug)}">Interactive Case</a> ·
                  <a href="/case/${escapeHtml(c.slug)}/timeline">Timeline</a> ·
                  <a href="/case/${escapeHtml(c.slug)}/evidence">Evidence</a> ·
                  <a href="/case/${escapeHtml(c.slug)}/transcript">Transcript</a> ·
                  <a href="/case/${escapeHtml(c.slug)}/sources">Sources</a>
                </p>
              </article>`,
              )
              .join('\n')}
          </div>
        </section>
        <section class="editorial-section editorial-section--last">
          <h2 class="editorial-section__title">Editorial Method &amp; Identity</h2>
          <p class="editorial-prose">Every ENIGMA dossier separates confirmed primary records, documented witness accounts, allegations, and unresolved gaps. Explore the complete <a href="/archive">Archive</a> or read our <a href="/about">About &amp; Sourcing Methodology</a>.</p>
        </section>
      </main>
      ${renderFooter()}
    </div>`;
}

function renderArchiveBody(): string {
  const dossiers = getAllCaseDossiers();
  return `
    <div class="home editorial-page">
      ${renderMasthead('Archive Index')}
      <main class="editorial-main">
        <nav class="editorial-breadcrumb" aria-label="Breadcrumb">
          <a href="/">ENIGMA</a> / <span aria-current="page">Archive</span>
        </nav>
        <header class="editorial-header">
          <p class="editorial-kicker">01 — Archive</p>
          <h1 class="editorial-title">Every case, in the order it was opened.</h1>
          <p class="editorial-subtitle">Two published documentary investigations and eight crawlable supporting dossiers built from primary archives.</p>
        </header>
        <section class="editorial-section editorial-section--last">
          <div class="dossier-grid">
            ${dossiers
              .map(
                (c) => `
              <article class="dossier-card">
                <p class="dossier-card__meta"><span>Case ${escapeHtml(c.caseNumber)}</span><span>${escapeHtml(c.timeframe)}</span></p>
                <h2 class="dossier-card__title"><a href="/case/${escapeHtml(c.slug)}">${escapeHtml(c.title)}</a></h2>
                <p class="dossier-card__subtitle">${escapeHtml(c.subtitle)}</p>
                <p class="dossier-card__body">${escapeHtml(c.overviewParagraphs.join(' '))}</p>
                <p class="dossier-note">
                  <a href="/case/${escapeHtml(c.slug)}/timeline">Timeline</a> ·
                  <a href="/case/${escapeHtml(c.slug)}/evidence">Evidence</a> ·
                  <a href="/case/${escapeHtml(c.slug)}/transcript">Transcript</a> ·
                  <a href="/case/${escapeHtml(c.slug)}/sources">Sources</a>
                </p>
              </article>`,
              )
              .join('\n')}
          </div>
        </section>
      </main>
      ${renderFooter()}
    </div>`;
}

function renderAboutBody(): string {
  const dossiers = getAllCaseDossiers();
  return `
    <div class="home editorial-page">
      ${renderMasthead('About ENIGMA')}
      <main class="editorial-main">
        <nav class="editorial-breadcrumb" aria-label="Breadcrumb">
          <a href="/">ENIGMA</a> / <span aria-current="page">About</span>
        </nav>
        <header class="editorial-header">
          <p class="editorial-kicker">Independent Documentary Platform · Est. 2026</p>
          <h1 class="editorial-title">Every open file, traced strictly from the record.</h1>
          <p class="editorial-subtitle">ENIGMA is an independent documentary archive investigating unsolved federal cases, historical disappearances, and modern cultural hoaxes through verifiable primary sources.</p>
        </header>
        <section class="editorial-section">
          <h2 class="editorial-section__title">What ENIGMA Investigates &amp; Editorial Philosophy</h2>
          <p class="editorial-prose">ENIGMA separates confirmed primary evidence, documented archive filings, uncorroborated allegations, and genuine unknowns while preserving cinema-grade visual storytelling.</p>
          <p class="editorial-prose">Each investigation pairs an interactive documentary edition with static, individually inspectable supporting dossiers for timelines, physical evidence, transcripts, and primary sources.</p>
        </section>
        <section class="editorial-section">
          <h2 class="editorial-section__title">Published Case Files</h2>
          <div class="dossier-grid">
            ${dossiers
              .map(
                (c) => `
              <article class="dossier-card">
                <h3 class="dossier-card__title"><a href="/case/${escapeHtml(c.slug)}">Case ${escapeHtml(c.caseNumber)}: ${escapeHtml(c.title)}</a></h3>
                <p class="dossier-card__body">${escapeHtml(c.overviewParagraphs[0])}</p>
              </article>`,
              )
              .join('\n')}
          </div>
        </section>
        <section class="editorial-section editorial-section--last">
          <h2 class="editorial-section__title">Credits &amp; Contact</h2>
          <p class="editorial-prose">Editorial inquiries and source corrections: <a href="mailto:${escapeHtml(SITE_EMAIL)}">${escapeHtml(SITE_EMAIL)}</a>. All case studies are independent reconstructions of the public historical record.</p>
        </section>
      </main>
      ${renderFooter()}
    </div>`;
}

function renderDossierSectionsHtml(dossier: CaseDossierData, sectionFilter?: SupportingSection): string {
  const showTimeline = !sectionFilter || sectionFilter === 'timeline';
  const showEvidence = !sectionFilter || sectionFilter === 'evidence';
  const showTranscript = !sectionFilter || sectionFilter === 'transcript';
  const showSources = !sectionFilter || sectionFilter === 'sources';

  const parts: string[] = [];

  if (showTimeline) {
    parts.push(`
      <section class="editorial-section" aria-labelledby="sec-timeline">
        <h2 id="sec-timeline" class="editorial-section__title">Timeline</h2>
        <p class="editorial-prose">${escapeHtml(dossier.timelineIntro)}</p>
        <div class="timeline-list">
          ${dossier.timeline
            .map(
              (item) => `
            <article class="timeline-row">
              <div><strong>${escapeHtml(item.dateOrTime)}</strong><div>${escapeHtml(item.trackLabel)}</div></div>
              <div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.location)}</p>
                <p>${escapeHtml(item.summary)}</p>
                <p>${escapeHtml(item.verificationNote)}</p>
              </div>
            </article>`,
            )
            .join('\n')}
        </div>
      </section>`);
  }

  if (showEvidence) {
    parts.push(`
      <section class="editorial-section" aria-labelledby="sec-evidence">
        <h2 id="sec-evidence" class="editorial-section__title">Physical &amp; Archival Evidence</h2>
        <p class="editorial-prose">${escapeHtml(dossier.evidenceIntro)}</p>
        <div class="dossier-grid">
          ${dossier.evidence
            .map(
              (ev) => `
            <article class="dossier-card">
              <p class="dossier-card__meta"><span>${escapeHtml(ev.code)}</span><span>${escapeHtml(ev.status)}</span></p>
              <h3 class="dossier-card__title">${escapeHtml(ev.title)}</h3>
              <p class="dossier-card__subtitle">${escapeHtml(ev.subtitle)}</p>
              <p class="dossier-card__body">${escapeHtml(ev.summary)}</p>
              <ul class="dossier-list">${ev.facts.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
              <p class="dossier-note">${escapeHtml(ev.limits.join(' '))} Sources: ${escapeHtml(ev.source)}</p>
            </article>`,
            )
            .join('\n')}
        </div>
      </section>
      <section class="editorial-section" aria-labelledby="sec-theories">
        <h2 id="sec-theories" class="editorial-section__title">Theories &amp; Suspects</h2>
        <p class="editorial-prose">${escapeHtml(dossier.theoriesIntro)}</p>
        <div class="dossier-grid">
          ${dossier.theories
            .map(
              (th) => `
            <article class="dossier-card">
              <p class="dossier-card__meta"><span>${escapeHtml(th.code)}</span><span>${escapeHtml(th.verdict)}</span></p>
              <h3 class="dossier-card__title">${escapeHtml(th.title)}</h3>
              <p class="dossier-card__subtitle">${escapeHtml(th.subtitle)}</p>
              <p class="dossier-card__body">${escapeHtml(th.summary)}</p>
            </article>`,
            )
            .join('\n')}
        </div>
      </section>`);
  }

  if (showTranscript) {
    parts.push(`
      <section class="editorial-section" aria-labelledby="sec-transcript">
        <h2 id="sec-transcript" class="editorial-section__title">Transcripts &amp; Primary Texts</h2>
        <p class="editorial-prose">${escapeHtml(dossier.transcriptIntro)}</p>
        <div class="dossier-grid">
          ${dossier.transcripts
            .map(
              (tr) => `
            <article class="dossier-card">
              <p class="dossier-card__meta"><span>${escapeHtml(tr.code)}</span><span>${escapeHtml(tr.dateLabel)}</span></p>
              <h3 class="dossier-card__title">${escapeHtml(tr.title)}</h3>
              <p class="dossier-card__subtitle">${escapeHtml(tr.provenance)}</p>
              ${tr.excerpts.map((ex) => `<blockquote class="transcript-quote">${escapeHtml(ex)}</blockquote>`).join('')}
              <p class="dossier-note">${escapeHtml(tr.verdict)}</p>
            </article>`,
            )
            .join('\n')}
        </div>
      </section>`);
  }

  if (showSources) {
    parts.push(`
      <section class="editorial-section" aria-labelledby="sec-sources">
        <h2 id="sec-sources" class="editorial-section__title">Sources, Further Reading &amp; Credits</h2>
        <p class="editorial-prose">${escapeHtml(dossier.sourcesIntro)}</p>
        <div class="dossier-grid">
          ${dossier.sources
            .map(
              (s) => `
            <article class="dossier-card">
              <p class="dossier-card__meta"><span>${escapeHtml(s.code)}</span><span>${escapeHtml(s.category)}</span></p>
              <h3 class="dossier-card__title"><a href="${escapeHtml(s.url)}">${escapeHtml(s.title)}</a></h3>
              <p class="dossier-card__subtitle">${escapeHtml(s.publisher)} · ${escapeHtml(s.date)}</p>
              <p class="dossier-card__body">${escapeHtml(s.note)}</p>
            </article>`,
            )
            .join('\n')}
        </div>
        <h3>Further Reading</h3>
        <ul class="dossier-list">
          ${dossier.furtherReading.map((fr) => `<li><strong>${escapeHtml(fr.title)}</strong> (${escapeHtml(fr.authorOrOrigin)}) — ${escapeHtml(fr.note)}</li>`).join('')}
        </ul>
        <h3>Credits</h3>
        <ul class="dossier-list">
          ${dossier.credits.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>
      </section>`);
  }

  return parts.join('\n');
}

function renderCaseBody(slug: string, section?: SupportingSection): string {
  const dossier = getAllCaseDossiers().find((d) => d.slug === slug);
  if (!dossier) return renderNotFoundBody(`/case/${slug}`);

  const heading = section ? `${dossier.title} — ${SECTION_LABELS[section]}` : dossier.title;

  return `
    <div class="home editorial-page">
      ${renderMasthead(`Case ${dossier.caseNumber}${section ? ` · ${SECTION_LABELS[section]}` : ''}`)}
      <main class="editorial-main">
        <nav class="editorial-breadcrumb" aria-label="Breadcrumb">
          <a href="/">ENIGMA</a> / <a href="/archive">Archive</a> /
          ${
            section
              ? `<a href="/case/${escapeHtml(dossier.slug)}">Case ${escapeHtml(dossier.caseNumber)}: ${escapeHtml(dossier.title)}</a> / <span aria-current="page">${escapeHtml(SECTION_LABELS[section])}</span>`
              : `<span aria-current="page">Case ${escapeHtml(dossier.caseNumber)}: ${escapeHtml(dossier.title)}</span>`
          }
        </nav>
        <header class="editorial-header">
          <p class="editorial-kicker">Case ${escapeHtml(dossier.caseNumber)} · ${escapeHtml(dossier.classification)}</p>
          <h1 class="editorial-title">${escapeHtml(heading)}</h1>
          <p class="editorial-subtitle">${escapeHtml(dossier.subtitle)}</p>
          <p class="editorial-prose">${escapeHtml(dossier.overviewParagraphs[0])}</p>
          <p class="editorial-prose">${escapeHtml(dossier.overviewParagraphs[1])}</p>
          <img src="${escapeHtml(dossier.heroImage)}" alt="${escapeHtml(dossier.heroAlt)}" width="1200" height="675" />
        </header>
        <nav class="dossier-subnav" aria-label="Case supporting dossiers">
          <a href="/case/${escapeHtml(dossier.slug)}">Documentary Edition</a>
          ${SUPPORTING_SECTIONS.map(
            (s) =>
              `<a href="/case/${escapeHtml(dossier.slug)}/${escapeHtml(s)}">${escapeHtml(SECTION_LABELS[s])}</a>`,
          ).join(' ')}
        </nav>
        ${renderDossierSectionsHtml(dossier, section)}
        <section class="editorial-section editorial-section--last">
          <h2>Related Case: ${escapeHtml(dossier.relatedCaseLabel)}</h2>
          <p>${escapeHtml(dossier.relatedCaseReason)} <a href="/case/${escapeHtml(dossier.relatedCaseSlug)}">Open ${escapeHtml(dossier.relatedCaseLabel)}</a>.</p>
        </section>
      </main>
      ${renderFooter()}
    </div>`;
}

function renderNotFoundBody(path: string): string {
  return `
    <div class="home editorial-page">
      ${renderMasthead('404 · Record Not Found')}
      <main class="editorial-main">
        <header class="editorial-header">
          <p class="editorial-kicker">HTTP 404</p>
          <h1 class="editorial-title">No file exists at this record address.</h1>
          <p class="editorial-subtitle">Path <code>${escapeHtml(path)}</code> is not in the ENIGMA archive.</p>
          <p><a href="/">Return Home</a> · <a href="/archive">Browse Archive</a> · <a href="/about">About ENIGMA</a></p>
        </header>
      </main>
      ${renderFooter()}
    </div>`;
}

export function renderRouteHtml(templateHtml: string, route: AppRoute): string {
  const headTags = renderHeadTags(route);

  let bodyHtml: string;
  if (route.kind === 'home') {
    bodyHtml = renderHomeBody();
  } else if (route.kind === 'archive') {
    bodyHtml = renderArchiveBody();
  } else if (route.kind === 'about') {
    bodyHtml = renderAboutBody();
  } else if (route.kind === 'case') {
    bodyHtml = renderCaseBody(route.slug);
  } else if (route.kind === 'case-supporting') {
    bodyHtml = renderCaseBody(route.slug, route.section);
  } else {
    bodyHtml = renderNotFoundBody(route.path);
  }

  let html = templateHtml;

  // Strip default head metadata tags emitted from base index.html so each page has unique tags without duplicates
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="(description|robots|twitter:[^"]+)"[\s\S]*?\/>/gi, '')
    .replace(/<meta\s+property="(og:[^"]+|article:[^"]+)"[\s\S]*?\/>/gi, '')
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/gi, '')
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, '');

  html = html.replace(
    /(<meta\s+name="viewport"[^>]*>)/i,
    `$1\n    ${headTags}`,
  );

  html = html.replace(
    /<div\s+id="root"\s*><\/div>/i,
    `<div id="root">${bodyHtml}</div>`,
  );

  return html;
}

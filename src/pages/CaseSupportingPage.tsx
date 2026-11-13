import { EnigmaLockup, EnigmaSymbol } from '../components/enigma/EnigmaBrand';
import { getCaseDossier, type CaseDossierData } from '../seo/caseDossiers';
import { SECTION_LABELS, SUPPORTING_SECTIONS, type SupportingSection } from '../seo/siteConfig';
import '../home/home.css';
import '../archive/archive.css';
import './pages.css';

interface CaseSupportingPageProps {
  slug: string;
  section: SupportingSection;
}

function TimelineView({ dossier }: { dossier: CaseDossierData }) {
  return (
    <section className="editorial-section" aria-labelledby="dossier-timeline-heading">
      <div className="editorial-section__head">
        <h2 id="dossier-timeline-heading" className="editorial-section__title">Chronology</h2>
        <p className="editorial-prose">{dossier.timelineIntro}</p>
      </div>
      <div className="timeline-list">
        {dossier.timeline.map((item) => (
          <article className="timeline-row" key={item.id}>
            <div>
              <div className="timeline-row__date">{item.dateOrTime}</div>
              <div className="timeline-row__track">{item.trackLabel}</div>
            </div>
            <div>
              <h3 className="dossier-card__title" style={{ marginTop: 0 }}>{item.title}</h3>
              <p className="dossier-card__subtitle">{item.location}</p>
              <p className="dossier-card__body">{item.summary}</p>
              <p className="dossier-note">
                {item.verificationNote}
                {item.sourceCode ? ` · Ref: ${item.sourceCode}` : ''}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidenceView({ dossier }: { dossier: CaseDossierData }) {
  return (
    <>
      <section className="editorial-section" aria-labelledby="dossier-evidence-heading">
        <div className="editorial-section__head">
          <h2 id="dossier-evidence-heading" className="editorial-section__title">Physical &amp; Archival Evidence</h2>
          <p className="editorial-prose">{dossier.evidenceIntro}</p>
        </div>
        <div className="dossier-grid">
          {dossier.evidence.map((ev) => (
            <article className="dossier-card" key={ev.id}>
              <p className="dossier-card__meta">
                <span>{ev.code}</span>
                <span>{ev.status}</span>
              </p>
              <h3 className="dossier-card__title">{ev.title}</h3>
              <p className="dossier-card__subtitle">{ev.subtitle}</p>
              <p className="dossier-card__body">{ev.summary}</p>
              <ul className="dossier-list">
                {ev.facts.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              {ev.limits.length > 0 && (
                <p className="dossier-note">Evidentiary limit: {ev.limits.join(' ')}</p>
              )}
              <p className="dossier-note">Sources: {ev.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="dossier-theories-heading">
        <div className="editorial-section__head">
          <h2 id="dossier-theories-heading" className="editorial-section__title">
            {dossier.slug === 'db-cooper' ? 'Theories & Named Suspects' : 'Interpretations & Production Analysis'}
          </h2>
          <p className="editorial-prose">{dossier.theoriesIntro}</p>
        </div>
        <div className="dossier-grid">
          {dossier.theories.map((th) => (
            <article className="dossier-card" key={th.id}>
              <p className="dossier-card__meta">
                <span>{th.code}</span>
                <span>{th.verdict}</span>
              </p>
              <h3 className="dossier-card__title">{th.title}</h3>
              <p className="dossier-card__subtitle">{th.subtitle}</p>
              <p className="dossier-card__body">{th.summary}</p>
              <ul className="dossier-list">
                {th.support.map((s, i) => (
                  <li key={i}>Supports: {s}</li>
                ))}
                {th.contradict.map((c, i) => (
                  <li key={i}>Limits: {c}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function TranscriptView({ dossier }: { dossier: CaseDossierData }) {
  return (
    <section className="editorial-section" aria-labelledby="dossier-transcript-heading">
      <div className="editorial-section__head">
        <h2 id="dossier-transcript-heading" className="editorial-section__title">Primary Texts &amp; Transcripts</h2>
        <p className="editorial-prose">{dossier.transcriptIntro}</p>
      </div>
      <div className="dossier-grid">
        {dossier.transcripts.map((tr) => (
          <article className="dossier-card" key={tr.id}>
            <p className="dossier-card__meta">
              <span>{tr.code}</span>
              <span>{tr.dateLabel}</span>
            </p>
            <h3 className="dossier-card__title">{tr.title}</h3>
            <p className="dossier-card__subtitle">{tr.provenance}</p>
            {tr.excerpts.map((line, i) => (
              <blockquote className="transcript-quote" key={i}>{line}</blockquote>
            ))}
            <p className="dossier-note">Verification status: {tr.verdict}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SourcesView({ dossier }: { dossier: CaseDossierData }) {
  return (
    <>
      <section className="editorial-section" aria-labelledby="dossier-sources-heading">
        <div className="editorial-section__head">
          <h2 id="dossier-sources-heading" className="editorial-section__title">Cited Primary Sources</h2>
          <p className="editorial-prose">{dossier.sourcesIntro}</p>
        </div>
        <div className="dossier-grid">
          {dossier.sources.map((src) => (
            <article className="dossier-card" key={src.code}>
              <p className="dossier-card__meta">
                <span>{src.code}</span>
                <span>{src.category}</span>
              </p>
              <h3 className="dossier-card__title">
                <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a>
              </h3>
              <p className="dossier-card__subtitle">{src.publisher} · {src.date}</p>
              <p className="dossier-card__body">{src.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="dossier-reading-heading">
        <div className="editorial-section__head">
          <h2 id="dossier-reading-heading" className="editorial-section__title">Further Reading &amp; Credits</h2>
          <div>
            <div className="dossier-grid">
              {dossier.furtherReading.map((fr, idx) => (
                <article className="dossier-card" key={idx}>
                  <p className="dossier-card__meta"><span>Reading 0{idx + 1}</span><span>{fr.authorOrOrigin}</span></p>
                  <h3 className="dossier-card__title">{fr.title}</h3>
                  <p className="dossier-card__body">{fr.note}</p>
                </article>
              ))}
            </div>
            <ul className="dossier-list" style={{ marginTop: '1.5rem' }}>
              {dossier.credits.map((credit, idx) => (
                <li key={idx}>{credit}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export function CaseSupportingPage({ slug, section }: CaseSupportingPageProps) {
  const dossier = getCaseDossier(slug);
  if (!dossier) return null;

  const sectionTitle = SECTION_LABELS[section];

  return (
    <div className="home editorial-page">
      <header className="home-masthead">
        <nav className="home-masthead__nav home-masthead__nav--start" aria-label="Primary">
          <a className="archive-brand" href="/" aria-label="ENIGMA, home">
            <EnigmaSymbol tone="light" className="enigma-nav-mark" />
          </a>
        </nav>

        <span className="archive-masthead__title mono">
          Case {dossier.caseNumber} · {sectionTitle}
        </span>

        <nav className="home-masthead__nav home-masthead__nav--end" aria-label="Secondary">
          <a href="/">Home</a>
          <a href="/archive">Archive</a>
          <a href={`/case/${dossier.slug}`}>Interactive Film</a>
          <a href="/about">About</a>
        </nav>
      </header>

      <main className="editorial-main">
        <nav className="editorial-breadcrumb" aria-label="Breadcrumb">
          <a href="/">ENIGMA</a>
          <span className="editorial-breadcrumb__sep" aria-hidden="true">/</span>
          <a href="/archive">Archive</a>
          <span className="editorial-breadcrumb__sep" aria-hidden="true">/</span>
          <a href={`/case/${dossier.slug}`}>Case {dossier.caseNumber}: {dossier.title}</a>
          <span className="editorial-breadcrumb__sep" aria-hidden="true">/</span>
          <span aria-current="page">{sectionTitle}</span>
        </nav>

        <header className="editorial-header">
          <p className="editorial-kicker">
            Case {dossier.caseNumber} Supporting Dossier · {dossier.classification}
          </p>
          <h1 className="editorial-title">
            {dossier.title} — {sectionTitle}
          </h1>
          <p className="editorial-subtitle">{dossier.overviewParagraphs[0]}</p>
          <p className="editorial-subtitle">{dossier.overviewParagraphs[1]}</p>

          <div className="editorial-meta-strip">
            <span>{dossier.location}</span>
            <span>{dossier.timeframe}</span>
          </div>

          <div className="editorial-actions">
            <a className="editorial-btn editorial-btn--primary" href={`/case/${dossier.slug}`}>
              Enter full interactive case →
            </a>
            <a className="editorial-btn editorial-btn--ghost" href="/archive">
              All cases
            </a>
          </div>
        </header>

        <nav className="dossier-subnav" aria-label="Case dossier sections">
          <a className="dossier-subnav__link" href={`/case/${dossier.slug}`}>
            Documentary Edition
          </a>
          {SUPPORTING_SECTIONS.map((sec) => (
            <a
              key={sec}
              className="dossier-subnav__link"
              href={`/case/${dossier.slug}/${sec}`}
              aria-current={sec === section ? 'page' : undefined}
            >
              {SECTION_LABELS[sec]}
            </a>
          ))}
        </nav>

        {section === 'timeline' && <TimelineView dossier={dossier} />}
        {section === 'evidence' && <EvidenceView dossier={dossier} />}
        {section === 'transcript' && <TranscriptView dossier={dossier} />}
        {section === 'sources' && <SourcesView dossier={dossier} />}

        <section className="editorial-section editorial-section--last" aria-labelledby="related-case-heading">
          <div className="related-case-banner">
            <div>
              <p className="editorial-kicker">Related Case in the Archive</p>
              <h2 id="related-case-heading" className="editorial-section__title" style={{ marginTop: '0.4rem' }}>
                {dossier.relatedCaseLabel}
              </h2>
              <p className="editorial-prose" style={{ marginTop: '0.45rem' }}>
                {dossier.relatedCaseReason}
              </p>
            </div>
            <div className="editorial-actions" style={{ marginTop: 0 }}>
              <a className="editorial-btn editorial-btn--primary" href={`/case/${dossier.relatedCaseSlug}`}>
                Open related case →
              </a>
              <a className="editorial-btn editorial-btn--ghost" href={`/case/${dossier.relatedCaseSlug}/evidence`}>
                Related evidence
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer__top">
          <div className="home-footer__brand">
            <EnigmaLockup className="enigma-closing-lockup" />
            <p className="home-footer__note">
              Supporting research file for ENIGMA Case {dossier.caseNumber} ({dossier.title}).
            </p>
          </div>
          <nav className="home-footer__col" aria-label="Footer navigation">
            <p className="home-footer__col-title mono">Case {dossier.caseNumber} Files</p>
            <a href={`/case/${dossier.slug}`}>Interactive Edition</a>
            <a href={`/case/${dossier.slug}/timeline`}>Timeline</a>
            <a href={`/case/${dossier.slug}/evidence`}>Evidence</a>
            <a href={`/case/${dossier.slug}/transcript`}>Transcript</a>
            <a href={`/case/${dossier.slug}/sources`}>Sources</a>
          </nav>
          <div className="home-footer__col">
            <p className="home-footer__col-title mono">ENIGMA Archive</p>
            <a href="/">Home</a>
            <a href="/archive">Archive Index</a>
            <a href="/about">About &amp; Method</a>
            <a href={`/case/${dossier.relatedCaseSlug}`}>{dossier.relatedCaseLabel}</a>
          </div>
        </div>
        <div className="home-footer__bottom">
          <span>© 2026 ENIGMA</span>
          <span>https://enigma.buzz/case/{dossier.slug}/{section}</span>
        </div>
      </footer>
    </div>
  );
}

export default CaseSupportingPage;

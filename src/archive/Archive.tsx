import { ArrowUpRight } from 'lucide-react';
import { EnigmaSymbol } from '../components/enigma/EnigmaBrand';
import { getPublishedCaseManifests } from '../core/registry/caseRegistry';
import '../home/home.css';
import './archive.css';

export function Archive() {
  const allCases = getPublishedCaseManifests();
  const query =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('q')?.trim() ?? ''
      : '';
  const needle = query.toLowerCase();
  const cases = needle
    ? allCases.filter((manifest) =>
        `${manifest.caseNumber} ${manifest.title} ${manifest.subtitle} ${manifest.classification} ${manifest.category} ${manifest.shortDescription}`
          .toLowerCase()
          .includes(needle),
      )
    : allCases;

  return (
    <div className="home archive">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="home-masthead archive-masthead">
        <nav className="home-masthead__nav home-masthead__nav--start" aria-label="Primary">
          <a className="archive-brand" href="/" aria-label="ENIGMA, home">
            <EnigmaSymbol tone="light" className="enigma-nav-mark" />
          </a>
        </nav>

        <p className="archive-masthead__title mono">Archive</p>

        <nav className="home-masthead__nav home-masthead__nav--end" aria-label="Secondary">
          <a href="/">Home</a>
          <a href="/#method">Method</a>
          <a href="/about">About</a>
        </nav>
      </header>

      <main id="main">
        <section className="home-catalogue archive-catalogue" aria-labelledby="archive-title">
          <div className="home-section-head archive-head">
            <p className="home-section-index mono">01 — Archive</p>
            <h1 id="archive-title" className="archive-title">
              Every case, in the order it was opened.
            </h1>
            <p className="home-section-lede">
              {allCases.length === 1 ? 'One case is open.' : `${allCases.length} cases are open.`} Each is
              built from primary records, reported claims and labelled reconstruction — never from a
              legend standing in for evidence.
            </p>
            {needle && (
              <p className="home-section-lede mono" style={{ marginTop: '0.75rem' }}>
                Filtered by “{query}” · {cases.length} match{cases.length === 1 ? '' : 'es'} ·{' '}
                <a href="/archive">Clear filter</a>
              </p>
            )}
          </div>

          <div className="home-cases">
            {cases.map((manifest) => (
              <article className="archive-entry" key={manifest.id}>
                <a
                  className="home-case archive-case"
                  href={`/case/${manifest.slug}`}
                >
                  <span className="home-case__no mono" aria-hidden="true">
                    {manifest.caseNumber}
                  </span>

                  <span className="home-case__body archive-case__body">
                    <span className="home-case__status">
                      <span className="home-case__status-dot" aria-hidden="true" />
                      Open
                    </span>
                    <span className="home-case__title">{manifest.title}</span>
                    <span className="home-case__desc">{manifest.subtitle}</span>
                    <span className="archive-case__classification mono">
                      {manifest.classification}
                    </span>
                    <span className="home-case__meta mono">
                      <span>{manifest.category}</span>
                      <span>{manifest.readingTimeMinutes} min</span>
                      <span>{manifest.publicationDate}</span>
                    </span>
                  </span>

                  <span className="home-case__enter" aria-hidden="true">
                    Open the case
                    <ArrowUpRight size={18} strokeWidth={1.3} />
                  </span>
                </a>

                <nav
                  className="archive-case__subnav mono"
                  aria-label={`Supporting dossiers for Case ${manifest.caseNumber}`}
                >
                  <a href={`/case/${manifest.slug}/timeline`}>Timeline</a>
                  <a href={`/case/${manifest.slug}/evidence`}>Evidence</a>
                  <a href={`/case/${manifest.slug}/transcript`}>Transcript</a>
                  <a href={`/case/${manifest.slug}/sources`}>Sources</a>
                </nav>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer archive-footer">
        <div className="home-footer__meta mono">
          <span>Archive</span>
          <span className="home-footer__meta-rule" aria-hidden="true" />
          <span>All cases</span>
        </div>

        <a className="home-footer__signature" href="/" aria-label="ENIGMA, home">
          <EnigmaSymbol tone="light" className="home-footer__outro-mark" />
        </a>

        <div className="home-footer__bottom mono">
          <span>© 2026 ENIGMA · Independent digital archive</span>
          <a href="/about">Editorial methodology</a>
          <a className="home-footer__top-link" href="/">
            Back to home
            <span className="home-footer__top-arrow" aria-hidden="true">
              ↑
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
}

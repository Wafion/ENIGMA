import { ArrowUpRight } from 'lucide-react';
import { getPublishedCaseManifests } from '../core/registry/caseRegistry';
import '../home/home.css';
import './archive.css';

export function Archive() {
  const cases = getPublishedCaseManifests();

  return (
    <div className="home archive">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="home-masthead archive-masthead">
        <nav className="home-masthead__nav home-masthead__nav--start" aria-label="Primary">
          <a href="/">ENIGMA</a>
        </nav>

        <p className="archive-masthead__title mono">Archive</p>

        <nav className="home-masthead__nav home-masthead__nav--end" aria-label="Secondary">
          <a href="/">Home</a>
          <a href="/#method">Method</a>
          <a href="/#about">About</a>
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
              {cases.length === 1 ? 'One case is open.' : `${cases.length} cases are open.`} Each is
              built from primary records, reported claims and labelled reconstruction — never from a
              legend standing in for evidence.
            </p>
          </div>

          <div className="home-cases">
            {cases.map((manifest) => (
              <a
                className="home-case archive-case"
                href={`/case/${manifest.slug}`}
                key={manifest.id}
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

        <div className="home-footer__bottom mono">
          <span>© 2026 ENIGMA · Independent digital archive</span>
          <span aria-hidden="true">All sources named</span>
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

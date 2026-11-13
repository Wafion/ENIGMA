import { EnigmaLockup, EnigmaSymbol } from '../components/enigma/EnigmaBrand';
import { getAllCaseDossiers } from '../seo/caseDossiers';
import { SITE_EMAIL } from '../seo/siteConfig';
import '../home/home.css';
import '../archive/archive.css';
import './pages.css';

export function AboutPage() {
  const dossiers = getAllCaseDossiers();

  return (
    <div className="home editorial-page">
      <header className="home-masthead">
        <nav className="home-masthead__nav home-masthead__nav--start" aria-label="Primary">
          <a className="archive-brand" href="/" aria-label="ENIGMA, home">
            <EnigmaSymbol tone="light" className="enigma-nav-mark" />
          </a>
        </nav>

        <span className="archive-masthead__title mono">About · Editorial Identity</span>

        <nav className="home-masthead__nav home-masthead__nav--end" aria-label="Secondary">
          <a href="/">Home</a>
          <a href="/archive">Archive</a>
          <a href="/case/blair-witch">001</a>
          <a href="/case/db-cooper">002</a>
        </nav>
      </header>

      <main className="editorial-main">
        <nav className="editorial-breadcrumb" aria-label="Breadcrumb">
          <a href="/">ENIGMA</a>
          <span className="editorial-breadcrumb__sep" aria-hidden="true">/</span>
          <span aria-current="page">About</span>
        </nav>

        <header className="editorial-header">
          <p className="editorial-kicker">Independent Documentary Platform · Est. 2026</p>
          <h1 className="editorial-title">Every open file, traced strictly from the record.</h1>
          <p className="editorial-subtitle">
            ENIGMA is an independent documentary archive investigating unsolved federal cases, historical disappearances,
            and modern cultural hoaxes through verifiable primary sources and interactive archival reading.
          </p>
          <div className="editorial-actions">
            <a className="editorial-btn editorial-btn--primary" href="/archive">Browse open archive</a>
            <a className="editorial-btn editorial-btn--ghost" href="/case/db-cooper">Open Case 002: D.B. Cooper</a>
            <a className="editorial-btn editorial-btn--ghost" href="/case/blair-witch">Open Case 001: Blair Witch</a>
          </div>
        </header>

        <section className="editorial-section" aria-labelledby="about-what-heading">
          <div className="editorial-section__head">
            <h2 id="about-what-heading" className="editorial-section__title">What ENIGMA is</h2>
            <div>
              <p className="editorial-prose">
                Most coverage of unsolved mysteries collapses facts, folklore, and speculation into a single dramatic
                narrative. ENIGMA exists to separate them cleanly while preserving the atmospheric pacing and focus of
                long-form documentary filmmaking.
              </p>
              <p className="editorial-prose">
                Each case file on enigma.buzz is built as a self-contained documentary edition supported by indexable
                timelines, physical evidence audits, witness and flight transcripts, and cited primary repositories.
              </p>
            </div>
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="about-focus-heading">
          <div className="editorial-section__head">
            <h2 id="about-focus-heading" className="editorial-section__title">What it investigates</h2>
            <div className="about-columns">
              <article className="dossier-card">
                <p className="dossier-card__meta"><span>01 / Active &amp; Suspended Investigations</span></p>
                <h3 className="dossier-card__title">Unsolved Case Files</h3>
                <p className="dossier-card__body">
                  Long-running federal investigations with incomplete physical records — beginning with Northwest Orient
                  Flight 305 and the 1971 D.B. Cooper hijacking (FBI NORJAK).
                </p>
              </article>
              <article className="dossier-card">
                <p className="dossier-card__meta"><span>02 / Documented Fabrications</span></p>
                <h3 className="dossier-card__title">Folklore &amp; Archival Hoaxes</h3>
                <p className="dossier-card__body">
                  Cultural legends designed to resemble historical fact — beginning with Case 001, auditing how Haxan Films’
                  1999 BlairWitch.com archive overlaid Maryland parkland.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="about-method-heading">
          <div className="editorial-section__head">
            <h2 id="about-method-heading" className="editorial-section__title">Editorial philosophy &amp; sourcing methodology</h2>
            <div className="about-columns">
              <article className="dossier-card">
                <p className="dossier-card__meta"><span>Rule I</span><span>Verified Source Traceability</span></p>
                <h3 className="dossier-card__title">Primary Records First</h3>
                <p className="dossier-card__body">
                  Every factual claim cites a numbered entry in the case source ledger — federal vault releases, National
                  Archives filings, county property records, or contemporaneous press reports.
                </p>
              </article>
              <article className="dossier-card">
                <p className="dossier-card__meta"><span>Rule II</span><span>Explicit Uncertainty</span></p>
                <h3 className="dossier-card__title">Four Epistemic Statuses</h3>
                <p className="dossier-card__body">
                  Details are labeled strictly as CONFIRMED, DOCUMENTED, ALLEGED, or UNKNOWN so an unproven suspect
                  claim or theory never silently impersonates physical evidence.
                </p>
              </article>
              <article className="dossier-card">
                <p className="dossier-card__meta"><span>Rule III</span><span>Preserved Visual Craft</span></p>
                <h3 className="dossier-card__title">Documentary Interface</h3>
                <p className="dossier-card__body">
                  Typography, archival audio beds, maps, and contact-sheet imagery serve close reading — backed by static
                  crawlable dossiers for research and verification.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="editorial-section" aria-labelledby="about-cases-heading">
          <div className="editorial-section__head">
            <h2 id="about-cases-heading" className="editorial-section__title">Open case dossiers</h2>
            <div className="dossier-grid">
              {dossiers.map((c) => (
                <article className="dossier-card" key={c.slug}>
                  <p className="dossier-card__meta">
                    <span>Case {c.caseNumber}</span>
                    <span>{c.classification}</span>
                  </p>
                  <h3 className="dossier-card__title">
                    <a href={`/case/${c.slug}`}>{c.title}</a>
                  </h3>
                  <p className="dossier-card__subtitle">{c.subtitle}</p>
                  <p className="dossier-card__body">{c.overviewParagraphs[0]}</p>
                  <div className="dossier-note">
                    <a href={`/case/${c.slug}/timeline`}>Timeline</a> ·{' '}
                    <a href={`/case/${c.slug}/evidence`}>Evidence</a> ·{' '}
                    <a href={`/case/${c.slug}/transcript`}>Transcript</a> ·{' '}
                    <a href={`/case/${c.slug}/sources`}>Sources</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-section editorial-section--last" aria-labelledby="about-credits-heading">
          <div className="editorial-section__head">
            <h2 id="about-credits-heading" className="editorial-section__title">Credits &amp; contact</h2>
            <div>
              <p className="editorial-prose">
                ENIGMA is produced as an independent editorial publication at{' '}
                <a href="https://enigma.buzz/">enigma.buzz</a>. Corrections, primary-source additions, and archival
                inquiries can be directed to <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.
              </p>
              <p className="editorial-prose">
                Documentary reconstructions presented in Case 001 and Case 002 are independent analyses of the public
                historical record and do not represent official findings by law enforcement or park authorities.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer__top">
          <div className="home-footer__brand">
            <EnigmaLockup className="enigma-closing-lockup" />
            <p className="home-footer__note">
              ENIGMA — independent digital documentary archive. Mysteries, folklore, and unsolved cases examined from the
              primary record.
            </p>
          </div>
          <nav className="home-footer__col" aria-label="Footer navigation">
            <p className="home-footer__col-title mono">Navigation</p>
            <a href="/">Home</a>
            <a href="/archive">Archive</a>
            <a href="/about" aria-current="page">About</a>
            <a href="/case/blair-witch">Case 001: Blair Witch</a>
            <a href="/case/db-cooper">Case 002: D.B. Cooper</a>
          </nav>
        </div>
        <div className="home-footer__bottom">
          <span>© 2026 ENIGMA</span>
          <span>https://enigma.buzz/about</span>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;

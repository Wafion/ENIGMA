import { EnigmaSymbol } from '../components/enigma/EnigmaBrand';
import '../home/home.css';
import '../archive/archive.css';
import './pages.css';

interface NotFoundPageProps {
  requestedPath: string;
}

export function NotFoundPage({ requestedPath }: NotFoundPageProps) {
  return (
    <div className="home editorial-page">
      <header className="home-masthead">
        <nav className="home-masthead__nav home-masthead__nav--start" aria-label="Primary">
          <a className="archive-brand" href="/" aria-label="ENIGMA, home">
            <EnigmaSymbol tone="light" className="enigma-nav-mark" />
          </a>
        </nav>

        <span className="archive-masthead__title mono">404 · Record Not Found</span>

        <nav className="home-masthead__nav home-masthead__nav--end" aria-label="Secondary">
          <a href="/">Home</a>
          <a href="/archive">Archive</a>
          <a href="/about">About</a>
        </nav>
      </header>

      <main className="editorial-main">
        <nav className="editorial-breadcrumb" aria-label="Breadcrumb">
          <a href="/">ENIGMA</a>
          <span className="editorial-breadcrumb__sep" aria-hidden="true">/</span>
          <span aria-current="page">404 Not Found</span>
        </nav>

        <header className="editorial-header" style={{ borderBottom: 0 }}>
          <p className="editorial-kicker">HTTP 404 · Unindexed Path</p>
          <h1 className="editorial-title">No file exists at this record address.</h1>
          <p className="editorial-subtitle">
            The requested location (<code>{requestedPath}</code>) is not an open case, supporting dossier, or editorial
            page in the ENIGMA archive.
          </p>
          <div className="editorial-actions">
            <a className="editorial-btn editorial-btn--primary" href="/">Return to ENIGMA Home</a>
            <a className="editorial-btn editorial-btn--ghost" href="/archive">Open Case Archive</a>
            <a className="editorial-btn editorial-btn--ghost" href="/case/blair-witch">Case 001: Blair Witch</a>
            <a className="editorial-btn editorial-btn--ghost" href="/case/db-cooper">Case 002: D.B. Cooper</a>
          </div>
        </header>
      </main>
    </div>
  );
}

export default NotFoundPage;

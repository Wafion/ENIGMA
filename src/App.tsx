import React, { useEffect, useState, Suspense } from 'react';
import { ExperienceProvider } from './experience/ExperienceContext';
import { Experience } from './experience/Experience';
import Case002Experience from './cases/case-002-db-cooper/Case002Experience';
import { Home } from './home/Home';
import { resolveCase, getCaseComponent } from './core/registry/caseRegistry';

function normalizePath(pathname: string) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function setMetaDescription(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = 'description';
    document.head.appendChild(tag);
  }
  tag.content = content;
}

interface DynamicCaseHostProps {
  slug: string;
}

function DynamicCaseHost({ slug }: DynamicCaseHostProps) {
  const TargetComponent = getCaseComponent(slug);
  if (!TargetComponent) return null;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0d11] flex items-center justify-center font-mono text-xs text-[#8c4a32] uppercase tracking-widest">
          Initializing Documentary Archive...
        </div>
      }
    >
      {React.createElement(TargetComponent, { slug })}
    </Suspense>
  );
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  const caseMatch = path.match(/^\/case\/([^/]+)/);
  const caseSlug = caseMatch ? caseMatch[1] : null;
  const caseEntry = caseSlug ? resolveCase(caseSlug) : null;
  const isCase = Boolean(caseEntry);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => {
      window.history.scrollRestoration = previous;
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const current = normalizePath(window.location.pathname);
      const next = normalizePath(url.pathname);

      if (current === next) {
        if (!url.hash && next === '/') {
          event.preventDefault();
          window.history.replaceState({}, '', '/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      event.preventDefault();
      if (next.startsWith('/case/') && !current.startsWith('/case/')) {
        sessionStorage.setItem('enigma:case-ascii-open', 'true');
      }
      window.history.pushState({}, '', `${url.pathname}${url.hash}`);
      setPath(next);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Path validity check & URL normalization
  useEffect(() => {
    if (!isCase && path !== '/' && path !== '') {
      window.history.replaceState({}, '', '/');
      setPath('/');
    }
  }, [path, isCase]);

  // Page title and meta description
  useEffect(() => {
    if (isCase && caseEntry) {
      document.title = `ENIGMA — ${caseEntry.manifest.title}, Case ${caseEntry.manifest.caseNumber}`;
      setMetaDescription(`ENIGMA Case ${caseEntry.manifest.caseNumber}: ${caseEntry.manifest.title}. ${caseEntry.manifest.shortDescription}`);
    } else {
      document.title = 'ENIGMA — Documentary cases, traced from the record';
      setMetaDescription('ENIGMA is an independent documentary exhibition. Case 001, The Blair Witch Incident, traces how a modern folklore was built, sold as a record, and filmed in real Maryland woods.');
    }
  }, [isCase, caseEntry]);

  // Handle hash scrolling for cases
  useEffect(() => {
    if (!isCase) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const hash = window.location.hash;
    const scrollToHash = () => {
      const target = document.querySelector(hash);
      target?.scrollIntoView({ block: 'start' });
    };
    const timers = [
      window.setTimeout(scrollToHash, 160),
      window.setTimeout(() => {
        if (window.scrollY < 4) scrollToHash();
      }, 1100),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isCase, path]);

  if (isCase && caseSlug) {
    const normalized = caseSlug.trim().toLowerCase();
    // Render Case 001 (Blair Witch) directly
    const isBlairWitch =
      normalized === '001' ||
      normalized === 'blair-witch' ||
      normalized === 'case-001' ||
      normalized === 'case-001-blair-witch';
    if (isBlairWitch) {
      return (
        <ExperienceProvider>
          <Experience />
        </ExperienceProvider>
      );
    }

    // Render Case 002 (D.B. Cooper) directly to guarantee zero-latency & exact DOM
    const isDbCooper =
      normalized === '002' ||
      normalized === 'case-002' ||
      normalized === 'db-cooper' ||
      normalized === 'dbcooper' ||
      normalized === 'cooper' ||
      normalized === 'case-002-db-cooper';
    if (isDbCooper) {
      return <Case002Experience />;
    }

    return <DynamicCaseHost slug={caseSlug} />;
  }

  return <Home />;
}

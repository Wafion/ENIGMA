import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ExperienceProvider } from './experience/ExperienceContext';
import { Experience } from './experience/Experience';
import Case002Experience from './cases/case-002-db-cooper/Case002Experience';
import { Home } from './home/Home';
import { Archive } from './archive/Archive';
import { resolveCase, getCaseComponent } from './core/registry/caseRegistry';
import { EnigmaLoader } from './components/enigma/EnigmaBrand';

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

/**
 * Route changes swap the whole document without a reload, and the page sets
 * `scroll-behavior: smooth` globally — so `scrollTo({ behavior: 'auto' })`
 * would still animate and can be interrupted by the incoming layout, leaving a
 * case opened from the catalogue parked where the catalogue was. Force an
 * instant jump by overriding the CSS behaviour for the duration of the call.
 */
function forceScrollTop() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}

function isCase002Slug(slug: string | null) {
  if (!slug) return false;
  const normalized = slug.trim().toLowerCase();
  return (
    normalized === '002' ||
    normalized === 'case-002' ||
    normalized === 'db-cooper' ||
    normalized === 'dbcooper' ||
    normalized === 'cooper' ||
    normalized === 'case-002-db-cooper'
  );
}

interface DynamicCaseHostProps {
  slug: string;
}

function DynamicCaseHost({ slug }: DynamicCaseHostProps) {
  const TargetComponent = getCaseComponent(slug);
  if (!TargetComponent) return null;
  return (
    <Suspense fallback={<EnigmaLoader />}>
      {React.createElement(TargetComponent, { slug })}
    </Suspense>
  );
}

function EnigmaBootCurtain({ initialTone }: { initialTone: 'dark' | 'light' }) {
  const [phase, setPhase] = useState<'active' | 'leaving' | 'done'>('active');

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minWait = reduced ? 200 : 1050;
    const maxWait = 1800;
    let leaveTimer = 0;
    let doneTimer = 0;
    let safetyTimer = 0;
    const started = performance.now();

    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();

    const safetyTimeout = new Promise<void>((resolve) => {
      safetyTimer = window.setTimeout(resolve, maxWait);
    });

    Promise.race([fontsReady, safetyTimeout]).then(() => {
      if (signal.aborted) return;
      const elapsed = performance.now() - started;
      const remaining = Math.max(0, minWait - elapsed);
      leaveTimer = window.setTimeout(() => {
        if (signal.aborted) return;
        setPhase('leaving');
        doneTimer = window.setTimeout(() => {
          if (!signal.aborted) setPhase('done');
        }, reduced ? 180 : 380);
      }, remaining);
    });

    return () => {
      controller.abort();
      window.clearTimeout(safetyTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') return null;

  return <EnigmaLoader tone={initialTone} overlay leaving={phase === 'leaving'} />;
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const wasCaseRef = useRef<boolean | null>(null);
  const [initialTone] = useState<'dark' | 'light'>(() =>
    isCase002Slug(normalizePath(window.location.pathname).match(/^\/case\/([^/]+)/)?.[1] ?? null)
      ? 'light'
      : 'dark',
  );

  const caseMatch = path.match(/^\/case\/([^/]+)/);
  const caseSlug = caseMatch ? caseMatch[1] : null;
  const caseEntry = caseSlug ? resolveCase(caseSlug) : null;
  const isCase = Boolean(caseEntry);
  const isArchive = path === '/archive';

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

  // Leaving a case must silence any case score, even if the browser restores
  // the previous document from bfcache or a component cleanup is skipped.
  useEffect(() => {
    if (wasCaseRef.current === true && !isCase) {
      window.dispatchEvent(new Event('enigma:leave-case'));
    }
    wasCaseRef.current = isCase;
  }, [isCase]);

  // Path validity check & URL normalization
  useEffect(() => {
    if (!isCase && !isArchive && path !== '/' && path !== '') {
      window.history.replaceState({}, '', '/');
      setPath('/');
    }
  }, [path, isCase, isArchive]);

  // Page title and meta description
  useEffect(() => {
    if (isCase && caseEntry) {
      document.title = `ENIGMA — ${caseEntry.manifest.title}, Case ${caseEntry.manifest.caseNumber}`;
      setMetaDescription(`ENIGMA Case ${caseEntry.manifest.caseNumber}: ${caseEntry.manifest.title}. ${caseEntry.manifest.shortDescription}`);
    } else if (isArchive) {
      document.title = 'ENIGMA — Archive';
      setMetaDescription('The complete ENIGMA archive: every open case, listed in the order it was opened.');
    } else {
      document.title = 'ENIGMA — Documentary cases, traced from the record';
      setMetaDescription('ENIGMA is an independent digital archive. Case 001, The Blair Witch Incident, traces how a modern folklore was built, sold as a record, and filmed in real Maryland woods.');
    }
  }, [isCase, caseEntry, isArchive]);

  // Entry scroll: cases open at the top unless a hash asks for a section.
  useEffect(() => {
    if (!isCase || !window.location.hash) {
      forceScrollTop();
      // One correction once the incoming case has laid out; a browser smooth
      // scroll or scroll anchoring can otherwise leave the document mid-page.
      const frame = window.requestAnimationFrame(forceScrollTop);
      const timer = window.setTimeout(forceScrollTop, 120);
      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
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

  let page: React.ReactNode;
  if (isArchive) {
    page = <Archive />;
  } else if (isCase && caseSlug) {
    const normalized = caseSlug.trim().toLowerCase();
    // Render Case 001 (Blair Witch) directly
    const isBlairWitch =
      normalized === '001' ||
      normalized === 'blair-witch' ||
      normalized === 'case-001' ||
      normalized === 'case-001-blair-witch';
    if (isBlairWitch) {
      page = (
        <ExperienceProvider>
          <Experience />
        </ExperienceProvider>
      );
    } else if (isCase002Slug(normalized)) {
      // Render Case 002 (D.B. Cooper) directly to guarantee zero-latency & exact DOM
      page = <Case002Experience />;
    } else {
      page = <DynamicCaseHost slug={caseSlug} />;
    }
  } else {
    page = <Home />;
  }

  return (
    <>
      <EnigmaBootCurtain initialTone={initialTone} />
      {page}
      <Analytics />
    </>
  );
}

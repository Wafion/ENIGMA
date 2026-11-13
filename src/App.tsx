import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ExperienceProvider } from './experience/ExperienceContext';
import { Home } from './home/Home';
import { getCaseComponent } from './core/registry/caseRegistry';
import { EnigmaLoader } from './components/enigma/EnigmaBrand';
import { applyDocumentHead } from './seo/headManager';
import { getRouteSeo, normalizePathname, parseAppRoute } from './seo/routes';

const Archive = lazy(() => import('./archive/Archive').then((m) => ({ default: m.Archive })));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CaseSupportingPage = lazy(() => import('./pages/CaseSupportingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Experience = lazy(() => import('./experience/Experience').then((m) => ({ default: m.Experience })));
const Case002Experience = lazy(() => import('./cases/case-002-db-cooper/Case002Experience'));

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
    const minWait = reduced ? 80 : 260;
    const maxWait = 850;
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
        }, reduced ? 120 : 280);
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
  const [path, setPath] = useState(() => normalizePathname(window.location.pathname));
  const wasCaseRef = useRef<boolean | null>(null);
  const [initialTone] = useState<'dark' | 'light'>(() => {
    const route = parseAppRoute(window.location.pathname);
    return route.kind === 'case' && isCase002Slug(route.slug) ? 'light' : 'dark';
  });

  const route = useMemo(() => parseAppRoute(path), [path]);
  const isCase = route.kind === 'case';

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const onPopState = () => setPath(normalizePathname(window.location.pathname));
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

      const current = normalizePathname(window.location.pathname);
      const next = normalizePathname(url.pathname);

      if (current === next && url.search === window.location.search) {
        if (!url.hash && next === '/') {
          event.preventDefault();
          window.history.replaceState({}, '', '/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      event.preventDefault();
      const targetRoute = parseAppRoute(next);
      if (targetRoute.kind === 'case' && !isCase) {
        sessionStorage.setItem('enigma:case-ascii-open', 'true');
      }
      window.history.pushState({}, '', `${targetRoute.path}${url.search}${url.hash}`);
      setPath(targetRoute.path);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [isCase]);

  // Leaving a case must silence any case score, even if the browser restores
  // the previous document from bfcache or a component cleanup is skipped.
  useEffect(() => {
    if (wasCaseRef.current === true && !isCase) {
      window.dispatchEvent(new Event('enigma:leave-case'));
    }
    wasCaseRef.current = isCase;
  }, [isCase]);

  // Canonicalize legacy alias slugs (e.g., /case/001 -> /case/blair-witch) in URL bar
  useEffect(() => {
    if ((route.kind === 'case' || route.kind === 'case-supporting') && route.path !== path) {
      window.history.replaceState(
        {},
        '',
        `${route.path}${window.location.search}${window.location.hash}`,
      );
    }
  }, [path, route]);

  // Synchronize per-route metadata, canonical link, Open Graph, Twitter, and JSON-LD
  useEffect(() => {
    applyDocumentHead(getRouteSeo(route));
  }, [route]);

  // Entry scroll: routes open at the top unless a hash asks for a section.
  useEffect(() => {
    if (!window.location.hash) {
      forceScrollTop();
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
  }, [isCase, route.path]);

  let page: React.ReactNode;
  if (route.kind === 'archive') {
    page = (
      <Suspense fallback={<EnigmaLoader tone="dark" />}>
        <Archive />
      </Suspense>
    );
  } else if (route.kind === 'about') {
    page = (
      <Suspense fallback={<EnigmaLoader tone="dark" />}>
        <AboutPage />
      </Suspense>
    );
  } else if (route.kind === 'case-supporting') {
    page = (
      <Suspense fallback={<EnigmaLoader tone="dark" />}>
        <CaseSupportingPage slug={route.slug} section={route.section} />
      </Suspense>
    );
  } else if (route.kind === 'case') {
    if (route.slug === 'blair-witch') {
      page = (
        <Suspense fallback={<EnigmaLoader tone="dark" />}>
          <ExperienceProvider>
            <Experience />
          </ExperienceProvider>
        </Suspense>
      );
    } else if (route.slug === 'db-cooper') {
      page = (
        <Suspense fallback={<EnigmaLoader tone="light" />}>
          <Case002Experience />
        </Suspense>
      );
    } else {
      page = <DynamicCaseHost slug={route.slug} />;
    }
  } else if (route.kind === 'not-found') {
    page = (
      <Suspense fallback={<EnigmaLoader tone="dark" />}>
        <NotFoundPage requestedPath={path} />
      </Suspense>
    );
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

import { useEffect, useState } from 'react';
import { ExperienceProvider } from './experience/ExperienceContext';
import { Experience } from './experience/Experience';
import { Home } from './home/Home';

const CASE_PATH = '/case/001';

const TITLES = {
  home: 'ENIGMA — Documentary cases, traced from the record',
  case: 'ENIGMA — The Blair Witch Incident, Case 001',
} as const;

const DESCRIPTIONS = {
  home: 'ENIGMA is an independent documentary exhibition. Case 001, The Blair Witch Incident, traces how a modern folklore was built, sold as a record, and filmed in real Maryland woods.',
  case: 'ENIGMA Case 001: The Blair Witch Incident. An editorial documentary in eight movements on how a folklore was built, sold as a record, and filmed in real Maryland woods.',
} as const;

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

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const isCase = path === CASE_PATH;

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
      if (next === CASE_PATH && current !== CASE_PATH) {
        sessionStorage.setItem('enigma:case-ascii-open', 'true');
      }
      window.history.pushState({}, '', `${url.pathname}${url.hash}`);
      setPath(next);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (path !== '/' && path !== CASE_PATH) {
      window.history.replaceState({}, '', '/');
    }
  }, [path]);

  useEffect(() => {
    document.title = isCase ? TITLES.case : TITLES.home;
    setMetaDescription(isCase ? DESCRIPTIONS.case : DESCRIPTIONS.home);
  }, [isCase]);

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

  if (isCase) {
    return (
      <ExperienceProvider>
        <Experience />
      </ExperienceProvider>
    );
  }

  return <Home />;
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { getPublishedCaseManifests } from '../core/registry/caseRegistry';

type Entry = {
  group: string;
  title: string;
  detail: string;
  href: string;
};

const ENTRIES: Entry[] = [
  ...getPublishedCaseManifests().flatMap((manifest) => [
    {
      group: `Case ${manifest.caseNumber}`,
      title: manifest.title,
      detail: manifest.subtitle,
      href: `/case/${manifest.slug}`,
    },
    {
      group: `Case ${manifest.caseNumber} · Dossier`,
      title: `${manifest.title} — Timeline`,
      detail: 'Chronology of documented events and key milestones.',
      href: `/case/${manifest.slug}/timeline`,
    },
    {
      group: `Case ${manifest.caseNumber} · Dossier`,
      title: `${manifest.title} — Evidence`,
      detail: 'Physical artefacts, records, theories, and evidentiary limits.',
      href: `/case/${manifest.slug}/evidence`,
    },
    {
      group: `Case ${manifest.caseNumber} · Dossier`,
      title: `${manifest.title} — Transcript`,
      detail: 'Primary document excerpts, logs, and recovered transcripts.',
      href: `/case/${manifest.slug}/transcript`,
    },
    {
      group: `Case ${manifest.caseNumber} · Dossier`,
      title: `${manifest.title} — Sources`,
      detail: 'Archival citations, primary repositories, and further reading.',
      href: `/case/${manifest.slug}/sources`,
    },
  ]),
  {
    group: 'Archive',
    title: 'All Open Cases',
    detail: 'Browse the complete ENIGMA documentary index.',
    href: '/archive',
  },
  {
    group: 'Editorial',
    title: 'About ENIGMA',
    detail: 'Editorial philosophy, sourcing methodology, and publication credits.',
    href: '/about',
  },
];

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return ENTRIES;
    return ENTRIES.filter((entry) =>
      `${entry.title} ${entry.detail} ${entry.group}`.toLowerCase().includes(needle),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const timers: number[] = [];
    const focusInput = (attempt: number) => {
      inputRef.current?.focus();
      if (document.activeElement !== inputRef.current && attempt < 3) {
        timers.push(window.setTimeout(() => focusInput(attempt + 1), 160));
      }
    };
    const frame = window.requestAnimationFrame(() => focusInput(0));

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, a[href], button:not([disabled])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      root.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <div
      className="home-search"
      data-open={open ? 'true' : 'false'}
      aria-hidden={open ? undefined : true}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="home-search__panel"
        id="home-search"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-search-title"
      >
        <div className="home-search__head">
          <h2 id="home-search-title" className="home-search__title mono">
            Search cases
          </h2>
          <button type="button" className="home-search__close" onClick={onClose}>
            <X size={15} strokeWidth={1.5} aria-hidden="true" />
            <span className="visually-hidden">Close search</span>
          </button>
        </div>

        <label className="home-search__field">
          <Search size={16} strokeWidth={1.4} aria-hidden="true" />
          <span className="visually-hidden">Search cases</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Case title, number, subject…"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <p className="home-search__count mono" aria-live="polite">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>

        {results.length > 0 ? (
          <ul className="home-search__results">
            {results.map((entry) => (
              <li key={`${entry.group}-${entry.title}`}>
                <a href={entry.href} onClick={onClose}>
                  <span className="home-search__group mono">{entry.group}</span>
                  <span className="home-search__entry">
                    <span className="home-search__entry-title">{entry.title}</span>
                    <span className="home-search__entry-detail">{entry.detail}</span>
                  </span>
                  <ArrowUpRight size={15} strokeWidth={1.4} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="home-search__empty">
            No case matches “{query.trim()}”. The archive only indexes the cases themselves.
          </p>
        )}
      </div>
    </div>
  );
}

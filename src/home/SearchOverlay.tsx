import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';

type Entry = {
  group: 'Case 001' | 'This site';
  title: string;
  detail: string;
  href: string;
};

const ENTRIES: Entry[] = [
  {
    group: 'Case 001',
    title: 'The Blair Witch Incident',
    detail: 'The complete case — prologue and seven chapters',
    href: '/case/001',
  },
  {
    group: 'Case 001',
    title: 'Prologue',
    detail: 'A documentary in eight movements',
    href: '/case/001',
  },
  {
    group: 'Case 001',
    title: 'The Legend of the Black Hills',
    detail: 'Chapter 01',
    href: '/case/001#chapter-01-the-legend',
  },
  {
    group: 'Case 001',
    title: 'The Town Below South Mountain',
    detail: 'Chapter 02',
    href: '/case/001#chapter-02-the-town',
  },
  {
    group: 'Case 001',
    title: 'October 1994: The Student Expedition',
    detail: 'Chapter 03',
    href: '/case/001#chapter-03-the-disappearance',
  },
  {
    group: 'Case 001',
    title: 'The Woods: An Unstable Geometry',
    detail: 'Chapter 04',
    href: '/case/001#chapter-04-the-woods',
  },
  {
    group: 'Case 001',
    title: 'The Recordings: 16mm Celluloid & Hi8 Magnetic Tape',
    detail: 'Chapter 05',
    href: '/case/001#chapter-05-the-recordings',
  },
  {
    group: 'Case 001',
    title: 'The Real Story: Method Filmmaking & The 1999 Internet Mirage',
    detail: 'Chapter 06',
    href: '/case/001#chapter-06-the-real-story',
  },
  {
    group: 'Case 001',
    title: 'What Remains: Aftermath in the Quiet Archive',
    detail: 'Chapter 07',
    href: '/case/001#chapter-07-what-remains',
  },
  {
    group: 'This site',
    title: 'Catalogue',
    detail: 'Cases, in the order they were opened',
    href: '/#catalogue',
  },
  {
    group: 'This site',
    title: 'Method',
    detail: 'How a myth is separated from its evidence',
    href: '/#method',
  },
  {
    group: 'This site',
    title: 'About',
    detail: 'What ENIGMA is, and what it refuses to do',
    href: '/#about',
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
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
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
            Search the archive
          </h2>
          <button type="button" className="home-search__close" onClick={onClose}>
            <X size={15} strokeWidth={1.5} aria-hidden="true" />
            <span className="visually-hidden">Close search</span>
          </button>
        </div>

        <label className="home-search__field">
          <Search size={16} strokeWidth={1.4} aria-hidden="true" />
          <span className="visually-hidden">Search cases and chapters</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Cases, chapters, sections…"
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
            Nothing in the open record matches “{query.trim()}”. Only Case 001 is published.
          </p>
        )}
      </div>
    </div>
  );
}

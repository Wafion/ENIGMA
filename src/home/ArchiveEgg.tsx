import { useEffect, useRef, type CSSProperties } from 'react';
import { X } from 'lucide-react';

const ASCII = String.raw`        .-""""""""-.
      .'            '.
     /   .--------.   \
    |   /  .-""-.  \   |
    |  |  /  ..  \  |  |
    |  | |  (  )  | |  |
    |  |  \  ''  /  |  |
    |   \  '-..-'  /   |
     \   '--------'   /
      '.            .'
        '-........-'

            0 0 0`;

const LINES = [
  { text: '> trace --subject enigma', tone: 'cmd' },
  { text: '  signature .............. 6/6', tone: 'dim' },
  { text: '  public index ............ none', tone: 'dim' },
  { text: '  sealed record ........... 1', tone: 'dim' },
  { text: '> open 000', tone: 'cmd' },
  { text: '  There is no Case 000.', tone: 'ink' },
  { text: '  There is only the name you typed.', tone: 'ink' },
];

type ArchiveEggProps = {
  open: boolean;
  onClose: () => void;
};

/** The archive terminal, reached by typing the name in full. It mirrors the
 * search overlay's dialog behaviour: focus trap, Escape, scroll lock. */
export function ArchiveEgg({ open, onClose }: ArchiveEggProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const timers: number[] = [];
    const focusClose = (attempt: number) => {
      closeRef.current?.focus();
      if (document.activeElement !== closeRef.current && attempt < 3) {
        timers.push(window.setTimeout(() => focusClose(attempt + 1), 160));
      }
    };
    const frame = window.requestAnimationFrame(() => focusClose(0));

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

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
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
      className="home-egg"
      data-open={open ? 'true' : 'false'}
      aria-hidden={open ? undefined : true}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="home-egg__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-egg-title"
      >
        <div className="home-egg__bar mono">
          <span className="home-egg__bar-title">Archive terminal</span>
          <span className="home-egg__bar-id">Case 000 · sealed</span>
          <button
            ref={closeRef}
            type="button"
            className="home-egg__close"
            onClick={onClose}
          >
            <X size={14} strokeWidth={1.5} aria-hidden="true" />
            <span className="visually-hidden">Close archive terminal</span>
          </button>
        </div>

        <h2 id="home-egg-title" className="visually-hidden">
          Archive terminal — Case 000
        </h2>

        <div className="home-egg__eye">
          <pre className="home-egg__ascii" aria-hidden="true">
            {ASCII}
          </pre>
          <span className="home-egg__scan" aria-hidden="true" />
        </div>

        <div className="home-egg__log">
          {LINES.map((line, index) => (
            <p
              key={line.text}
              className="home-egg__line mono"
              data-tone={line.tone}
              style={{ '--i': index } as CSSProperties}
            >
              {line.text}
            </p>
          ))}
        </div>

        <p className="home-egg__prompt mono" aria-hidden="true">
          <span>enigma@archive:~$</span>
          <span className="home-egg__caret" />
        </p>

        <button type="button" className="home-egg__return mono" onClick={onClose}>
          Return to the record <span aria-hidden="true">↵</span>
        </button>
      </div>
    </div>
  );
}

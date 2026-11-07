import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Maximize2, X } from 'lucide-react';
import { DBC_ASSET_MAP } from '../assets';
import { useDbc } from '../context';
import type { EvidenceStatus } from '../content';

/* -------------------------------------------------------------------------- */
/* Image delivery                                                             */
/* -------------------------------------------------------------------------- */

interface ImageMeta {
  w: number;
  h: number;
  optimized?: Array<900 | 1600>;
}

export const IMAGE_META: Record<string, ImageMeta> = {
  'northwest-727-n467us-1972.jpg': { w: 1747, h: 633 },
  'fbi-plane-ticket-1971.jpg': { w: 2400, h: 1369, optimized: [900, 1600] },
  'fbi-composite-a-1971.jpg': { w: 429, h: 297 },
  'fbi-composite-b-1973.jpg': { w: 506, h: 810 },
  'fbi-composite-b-sheet-1973.jpg': { w: 229, h: 297 },
  'fbi-composite-age-progressed.jpg': { w: 200, h: 132 },
  'fbi-wanted-poster.jpg': { w: 321, h: 563 },
  'flight-305-crew-cabin-1971.jpg': { w: 2526, h: 1300, optimized: [900, 1600] },
  'flight-305-crew-reno-1971.jpg': { w: 609, h: 471 },
  'northwest-727-airstair-1975.jpg': { w: 764, h: 482 },
  'fbi-tina-bar-money-1980.jpg': { w: 1400, h: 921, optimized: [900] },
  'lake-merwin-aerial.jpg': { w: 3697, h: 2772, optimized: [900, 1600] },
  'fbi-richard-mccoy-jr.jpg': { w: 176, h: 220 },
  'us-army-robert-rackstraw-1970.jpg': { w: 244, h: 269 },
  'cooper-vane-727.jpg': { w: 4288, h: 2848, optimized: [900, 1600] },
  'boeing-727-51-n838n.jpg': { w: 1024, h: 743, optimized: [900] },
};

export function imageSources(path: string) {
  const base = path.split('/').pop() ?? '';
  const meta = IMAGE_META[base];
  if (!meta) return { src: path, width: undefined, height: undefined };
  if (!meta.optimized?.length) {
    return { src: path, width: meta.w, height: meta.h };
  }
  const stem = base.replace(/\.jpg$/i, '');
  const optDir = '/assets/db-cooper/opt';
  const srcSet = meta.optimized
    .map((w) => `${optDir}/${stem}-${w}.jpg ${w}w`)
    .join(', ');
  return {
    src: `${optDir}/${stem}-${meta.optimized[meta.optimized.length - 1]}.jpg`,
    srcSet,
    width: meta.w,
    height: meta.h,
  };
}

/* -------------------------------------------------------------------------- */
/* Citation and status language                                               */
/* -------------------------------------------------------------------------- */

const CITATION = /(\[SRC-\d{2}(?:,\s*SRC-\d{2})*\])/g;

export function Cite({ code }: { code: string }) {
  const { openSources } = useDbc();
  return (
    <button
      type="button"
      className="ed-cite"
      onClick={() => openSources(code)}
      aria-label={`Open source ${code}`}
    >
      {code}
    </button>
  );
}

export function Cited({ text }: { text: string }) {
  return (
    <>
      {text.split(CITATION).map((part, index) => {
        if (!part) return null;
        if (/^\[SRC-/.test(part)) {
          const codes = part.replace(/[[\]]/g, '').split(/,\s*/);
          return (
            <span className="ed-cites" key={`${part}-${index}`}>
              {codes.map((code) => (
                <Cite code={code} key={code} />
              ))}
            </span>
          );
        }
        return <span key={`t-${index}`}>{part}</span>;
      })}
    </>
  );
}

const STATUS_STYLE: Record<EvidenceStatus, { short: string; mark: string }> = {
  CONFIRMED: { short: 'Confirmed', mark: '●' },
  DOCUMENTED: { short: 'Documented', mark: '◐' },
  REPORTED: { short: 'Reported', mark: '○' },
  ALLEGED: { short: 'Alleged', mark: '◇' },
  THEORY: { short: 'Theory', mark: '△' },
  SPECULATION: { short: 'Speculation', mark: '▽' },
  RECONSTRUCTION: { short: 'Reconstruction', mark: '▣' },
  UNKNOWN: { short: 'Unknown', mark: '□' },
};

export function Status({
  value,
  compact = false,
  className = '',
}: {
  value: EvidenceStatus;
  compact?: boolean;
  className?: string;
}) {
  const style = STATUS_STYLE[value];
  return (
    <span
      className={`ed-status ${compact ? 'is-compact' : ''} ${className}`}
      data-status={value}
      title={`${style.short} — status language is explained in What Remains`}
    >
      <span aria-hidden className="ed-status__mark">{style.mark}</span>
      {style.short}
    </span>
  );
}

export function StatusKey() {
  const order: EvidenceStatus[] = [
    'CONFIRMED',
    'DOCUMENTED',
    'REPORTED',
    'ALLEGED',
    'THEORY',
    'SPECULATION',
    'UNKNOWN',
  ];
  return (
    <div className="ed-status-key" aria-label="Status vocabulary">
      {order.map((status) => (
        <Status key={status} value={status} compact />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Chapter scaffolding                                                        */
/* -------------------------------------------------------------------------- */

export function Chapter({
  id,
  number,
  climate,
  className = '',
  children,
}: {
  id: string;
  number: string;
  climate: 'paper' | 'manila' | 'blue' | 'night' | 'bright' | 'green';
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-chapter
      data-chapter-id={id}
      data-climate={climate}
      className={`ed-chapter ed-climate--${climate} ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <span className="ed-chapter__folio" aria-hidden>
        {number}
      </span>
      {children}
    </section>
  );
}

export function ChapterHead({
  id,
  number,
  kicker,
  title,
  lede,
  aside,
  tight = false,
}: {
  id: string;
  number: string;
  kicker: string;
  title: string;
  lede?: ReactNode;
  aside?: ReactNode;
  tight?: boolean;
}) {
  return (
    <header className={`ed-head ${tight ? 'is-tight' : ''}`} data-reveal>
      <div className="ed-head__meta">
        <span className="ed-kicker">{kicker}</span>
        <span className="ed-head__num" aria-hidden>{number}</span>
      </div>
      <div className="ed-head__body">
        <h2 className="ed-head__title" id={`${id}-title`} aria-label={title}>
          <TitleWords text={title} />
        </h2>
        {lede && <div className="ed-head__lede">{lede}</div>}
      </div>
      {aside && <div className="ed-head__aside">{aside}</div>}
    </header>
  );
}

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`ed-kicker ${className}`}>{children}</p>;
}

/**
 * Keeps the written headline intact for assistive technology while giving the
 * motion layer word-level masks to work with. The visual line box is unchanged.
 */
export function TitleWords({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? ' ' : null}
          <span className="ed-word" aria-hidden="true">
            <span className="ed-word__in">{word}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

export function Prose({
  paragraphs,
  className = '',
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className={`ed-prose ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>
          <Cited text={paragraph} />
        </p>
      ))}
    </div>
  );
}

export function MarginNote({ children, label = 'Margin' }: { children: ReactNode; label?: string }) {
  return (
    <aside className="ed-margin">
      <span className="ed-margin__label">{label}</span>
      <p>{children}</p>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Figures                                                                    */
/* -------------------------------------------------------------------------- */

export function AssetFigure({
  assetId,
  caption,
  credit = true,
  className = '',
  priority = false,
  sizes = '100vw',
  ratio,
  bleed = false,
  alt,
  children,
}: {
  assetId: string;
  caption?: ReactNode;
  credit?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  ratio?: string;
  bleed?: boolean;
  alt?: string;
  children?: ReactNode;
}) {
  const { openAsset } = useDbc();
  const asset = DBC_ASSET_MAP[assetId];
  if (!asset) return null;
  const source = imageSources(asset.path);
  return (
    <figure
      className={`ed-figure ${bleed ? 'is-bleed' : ''} ${className}`}
      style={ratio ? ({ '--fig-ratio': ratio } as CSSProperties) : undefined}
    >
      <button
        type="button"
        className="ed-figure__frame"
        onClick={() => openAsset(assetId)}
        aria-label={`Inspect ${asset.title}`}
      >
        <img
          src={source.src}
          srcSet={'srcSet' in source ? source.srcSet : undefined}
          sizes={'srcSet' in source ? sizes : undefined}
          width={source.width}
          height={source.height}
          alt={alt ?? asset.description}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
        />
        <span className="ed-figure__inspect" aria-hidden>
          <Maximize2 size={13} strokeWidth={1.5} /> Inspect
        </span>
        {children}
      </button>
      {(caption || credit) && (
        <figcaption className="ed-figure__caption">
          {caption && <div className="ed-figure__caption-body">{caption}</div>}
          {credit && (
            <span className="ed-figure__credit">
              {asset.creator} · {asset.date} · {asset.license}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

export function DiagramFrame({
  label,
  caption,
  children,
  className = '',
}: {
  label: string;
  caption?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className={`ed-diagram ${className}`}>
      <span className="ed-diagram__label">{label}</span>
      {children}
      {caption && <figcaption className="ed-figure__caption">{caption}</figcaption>}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Diagrams — project originals, labelled as such                            */
/* -------------------------------------------------------------------------- */

export function AircraftDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 340"
      className={`ed-aircraft ${className}`}
      role="img"
      aria-label="Measured side-elevation diagram of a Boeing 727-51 with the ventral aft airstair lowered. Diagram, not a photograph."
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M36 180 C38 152 64 136 106 130 L708 120 C780 119 818 130 842 148 L898 124 L936 128 L923 166 L864 176 Z" />
        <path d="M36 180 C50 194 82 200 118 201 L846 189" />
        <path d="M106 130 C122 120 170 115 212 114" opacity="0.55" />
        <path d="M286 134 L352 134 M394 134 L436 134 M462 134 L470 134" opacity="0.5" />
        <path d="M120 168 L198 168 L198 190 L120 190 Z" opacity="0.5" />
        <path d="M510 170 L700 170 L680 242 L548 236 Z" />
        <path d="M690 154 L735 151 L752 194 L700 200" opacity="0.6" />
        <path d="M782 180 L842 179 L846 207 L790 210 Z" />
        <path d="M330 180 C370 210 430 228 500 230" opacity="0.5" />
        <circle cx="848" cy="146" r="4" />
        <circle cx="874" cy="144" r="4" />
        <g>
          <rect x="628" y="150" width="18" height="21" rx="2" />
          <rect x="647" y="154" width="5" height="17" rx="1" />
          <circle cx="637" cy="145" r="4.5" />
        </g>
        <g>
          <path d="M770 189 L852 189 L882 276 L808 276 Z" opacity="0.9" />
          <path d="M793 199 L864 199 M797 211 L870 211 M801 223 L876 223 M805 235 L882 235 M809 247 L888 247 M813 259 L894 259" opacity="0.55" />
          <path d="M809 276 L809 288 M882 276 L882 288" />
        </g>
      </g>
      <g className="ed-aircraft__callout" fill="currentColor">
        <line x1="638" y1="128" x2="638" y2="92" />
        <text x="596" y="82">SEAT 18C / AFT CABIN</text>
        <line x1="846" y1="286" x2="846" y2="312" />
        <text x="732" y="330">VENTRAL AIRSTAIR</text>
        <line x1="900" y1="122" x2="924" y2="96" />
        <text x="868" y="86">T-TAIL</text>
        <line x1="160" y1="168" x2="160" y2="136" />
        <text x="128" y="126">FORWARD DOOR</text>
      </g>
    </svg>
  );
}

export function BriefcaseDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 330"
      className={`ed-briefcase ${className}`}
      role="img"
      aria-label="Diagram reconstruction of the attaché case described by the flight attendant: a battery, wiring, and eight red cylinders."
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="62" y="92" width="396" height="196" rx="6" />
        <path d="M208 92 C208 64 312 64 312 92" />
        <rect x="80" y="110" width="360" height="160" opacity="0.45" />
        <rect x="98" y="198" width="74" height="52" rx="2" />
        <path d="M116 198 L116 186 M152 198 L152 186" />
        <path d="M172 224 C188 224 192 160 208 158 M172 224 C196 224 192 214 208 214" />
        <path d="M172 224 C196 236 202 238 214 238" stroke="var(--ed-red)" />
      </g>
      <g fill="var(--ed-red)">
        {Array.from({ length: 8 }, (_, n) => (
          <g key={n}>
            <rect x={220 + (n % 4) * 44} y={n < 4 ? 144 : 190} width="26" height="34" rx="4" />
            <rect x={220 + (n % 4) * 44} y={n < 4 ? 140 : 186} width="26" height="5" rx="2" fill="currentColor" opacity="0.45" />
          </g>
        ))}
      </g>
      <g className="ed-diagram__type" fill="currentColor">
        <text x="98" y="190">BATTERY</text>
        <text x="220" y="248">EIGHT RED CYLINDERS · WITNESS DESCRIPTION</text>
        <text x="220" y="132">BRIEFCASE INTERIOR · NOT TO SCALE</text>
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Drawer / overlay                                                           */
/* -------------------------------------------------------------------------- */

export function Overlay({
  open,
  onClose,
  title,
  children,
  className = '',
  variant = 'full',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  variant?: 'full' | 'drawer';
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  // Keep the latest handler without restarting the focus trap when the
  // parent re-renders (for example while a control inside the panel changes).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    returnRef.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
      returnRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`ed-overlay ed-overlay--${variant} ${className}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="ed-overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={panelRef}
      >
        <header className="ed-overlay__head">
          <p className="ed-overlay__title">{title}</p>
          <button
            type="button"
            className="ed-icon-btn"
            onClick={onClose}
            ref={closeRef}
            aria-label="Close panel"
          >
            <X size={19} strokeWidth={1.5} />
          </button>
        </header>
        <div className="ed-overlay__body">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small behaviour helpers                                                    */
/* -------------------------------------------------------------------------- */

export function throttleScroll(callback: () => void) {
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      callback();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  callback();
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (frame) window.cancelAnimationFrame(frame);
  };
}

export function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [query]);
  return match;
}

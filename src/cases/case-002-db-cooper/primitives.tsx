import type { CSSProperties, ReactNode } from 'react';
import { Maximize2, ArrowDownRight } from 'lucide-react';
import { DBC_ASSET_MAP } from './assets';
import { useDbc } from './context';
import type { EvidenceStatus } from './content';

const CITATION = /(\[SRC-\d{2}(?:,\s*SRC-\d{2})*\])/g;

export function Cite({ code }: { code: string }) {
  const { openSources } = useDbc();
  return (
    <button type="button" className="dbc-cite" onClick={() => openSources(code)} aria-label={`Open source ${code}`}>
      {code}
    </button>
  );
}

export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(CITATION).map((part, index) => {
        if (!part) return null;
        if (/^\[SRC-/.test(part)) {
          const codes = part.replace(/[[\]]/g, '').split(/,\s*/);
          return (
            <span className="dbc-cites" key={`${part}-${index}`}>
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

const STATUS_CLASS: Record<EvidenceStatus, string> = {
  CONFIRMED: 'is-confirmed',
  DOCUMENTED: 'is-documented',
  REPORTED: 'is-reported',
  ALLEGED: 'is-alleged',
  THEORY: 'is-theory',
  SPECULATION: 'is-speculation',
  RECONSTRUCTION: 'is-reconstruction',
  UNKNOWN: 'is-unknown',
};

export function Status({ value, className = '' }: { value: EvidenceStatus; className?: string }) {
  return <span className={`dbc-status ${STATUS_CLASS[value]} ${className}`}>{value}</span>;
}

export function AssetPlate({
  assetId,
  caption,
  className = '',
  priority = false,
  bare = false,
}: {
  assetId: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  bare?: boolean;
}) {
  const { openAsset } = useDbc();
  const asset = DBC_ASSET_MAP[assetId];
  if (!asset) return null;
  return (
    <figure className={`dbc-plate ${bare ? 'is-bare' : ''} ${className}`}>
      <button type="button" className="dbc-plate__frame" onClick={() => openAsset(assetId)} aria-label={`Inspect ${asset.title}`}>
        <img
          src={asset.path}
          alt={asset.description}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        <span className="dbc-plate__inspect" aria-hidden>
          <Maximize2 size={13} strokeWidth={1.4} /> Inspect
        </span>
      </button>
      {caption && (
        <figcaption className="dbc-plate__caption">
          <span>{caption}</span>
          <span className="dbc-plate__credit">{asset.creator} · {asset.date} · {asset.license}</span>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Physical Evidence Artifact primitive.
 * Treats real historical photographs, tickets, FBI flyers, and decaying ransom currency
 * as un-containerized tactile objects with subtle rotation, archival index stamps,
 * surface texture treatments, and direct inspection.
 */
export function EvidenceArtifact({
  assetId,
  code,
  stamp,
  caption,
  rotate = 0,
  treatment = 'raw',
  bleed = 'none',
  priority = false,
  className = '',
  children,
}: {
  assetId: string;
  code?: string;
  stamp?: string;
  caption?: string;
  rotate?: number;
  treatment?: 'raw' | 'halftone' | 'fbi-scan' | 'microfilm' | 'contact-sheet' | 'scan' | 'archival' | 'none';
  bleed?: 'none' | 'left' | 'right' | 'full';
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const { openAsset } = useDbc();
  const asset = DBC_ASSET_MAP[assetId];
  if (!asset) return null;

  return (
    <figure
      className={`dbc-artifact dbc-artifact--${treatment} ${bleed !== 'none' ? `dbc-artifact--bleed-${bleed}` : ''} ${className}`}
      style={{ '--artifact-rot': `${rotate}deg`, '--artifact-rotate': `${rotate}deg` } as CSSProperties}
    >
      <div className="dbc-artifact__stage">
        <button
          type="button"
          className="dbc-artifact__trigger dbc-artifact__surface"
          onClick={() => openAsset(assetId)}
          aria-label={`Inspect primary artifact: ${asset.title}`}
        >
          {(code || stamp) && (
            <span className="dbc-artifact__head">
              {code && <span className="dbc-artifact__code">{code}</span>}
              {stamp && <span className="dbc-artifact__stamp">{stamp}</span>}
            </span>
          )}
          <span className="dbc-artifact__media">
            <img
              src={asset.path}
              alt={asset.description}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          </span>
          <span className="dbc-artifact__grain" aria-hidden />
          <span className="dbc-artifact__inspect" aria-hidden>
            <Maximize2 size={12} strokeWidth={1.5} /> Inspect record
          </span>
        </button>
        {children}
      </div>
      {caption && (
        <figcaption className="dbc-artifact__meta dbc-artifact__caption">
          <span className="dbc-artifact__caption-text">{caption}</span>
          <span className="dbc-artifact__provenance dbc-artifact__credit">
            {asset.creator} · {asset.date} · {asset.license}
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Narrative Transition Bridge between movements.
 * Turns section boundaries into editorial/cinematic events (e.g. Ticket Zoom -> Paper Spread,
 * Ransom Find -> $200,000 Numeral, Aircraft -> 20:13 Void).
 */
export function NarrativeBridge({
  href,
  kicker,
  headline,
  line,
  meta,
  code,
  variant = 'dark-to-paper',
}: {
  href?: string;
  kicker: string;
  headline?: string;
  line?: string;
  meta?: string;
  code?: string;
  variant?: 'dark-to-paper' | 'paper-to-steel' | 'steel-to-dark' | 'dark-to-sand' | 'sand-to-dark' | 'void';
}) {
  const { playSfx } = useDbc();
  const displayHeadline = headline ?? line ?? '';
  const displayMeta = meta ?? code;
  return (
    <div className={`dbc-bridge dbc-bridge--${variant}`}>
      <div className="dbc-bridge__line" aria-hidden />
      <div className="dbc-bridge__inner">
        <div className="dbc-bridge__meta">
          <span className="dbc-kicker">{kicker}</span>
          {displayMeta && <span className="dbc-bridge__code">{displayMeta}</span>}
        </div>
        {href ? (
          <a
            href={href}
            className="dbc-bridge__link dbc-bridge__text"
            onClick={() => playSfx('paper')}
          >
            <span>{displayHeadline}</span>
            <ArrowDownRight size={18} strokeWidth={1.4} aria-hidden />
          </a>
        ) : (
          <p className="dbc-bridge__text">{displayHeadline}</p>
        )}
      </div>
    </div>
  );
}

export function ReconstructionLabel({ children = 'Reconstruction' }: { children?: ReactNode }) {
  return <span className="dbc-recon-label">{children}</span>;
}

/** Line-art side elevation of a Boeing 727-100, used as a diagram rather than a photograph. */
export function Aircraft({
  stairs = true,
  className = '',
  seat = true,
}: {
  stairs?: boolean;
  className?: string;
  seat?: boolean;
}) {
  return (
    <svg viewBox="0 0 1000 300" className={`dbc-aircraft ${className}`} role="img" aria-label="Side elevation diagram of a Boeing 727-100 with its ventral aft airstair lowered.">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M36 168 C38 143 62 128 104 122 L708 112 C780 111 818 122 842 140 L898 116 L934 120 L921 158 L862 168 Z" />
        <path d="M36 168 C50 181 82 187 118 188 L844 176" />
        <path d="M104 122 C120 112 168 107 210 106" opacity="0.55" />
        <path d="M286 126 L352 126 M394 126 L436 126 M462 126 L470 126" opacity="0.5" />
        <path d="M122 158 L196 158 L196 178 L122 178 Z" opacity="0.55" />
        <path d="M510 160 L700 160 L680 230 L548 224 Z" />
        <path d="M690 145 L735 142 L752 184 L700 190" opacity="0.6" />
        <path d="M782 169 L842 168 L846 196 L790 199 Z" />
        <path d="M330 168 C370 198 430 216 500 218" opacity="0.5" />
        <circle cx="846" cy="135" r="4" />
        <circle cx="872" cy="133" r="4" />
        {seat && (
          <g className="dbc-aircraft__seat">
            <rect x="630" y="140" width="17" height="20" rx="2" />
            <rect x="648" y="144" width="5" height="16" rx="1" />
            <circle cx="638" cy="136" r="4" />
          </g>
        )}
        {stairs && (
          <g className="dbc-aircraft__stairs">
            <path d="M770 177 L851 177 L880 262 L806 262 Z" opacity="0.9" />
            <path d="M792 187 L862 187 M796 199 L868 199 M800 211 L874 211 M804 223 L880 223 M808 235 L884 235 M812 247 L888 247" opacity="0.55" />
            <path d="M806 262 L806 272 M880 262 L880 272" />
          </g>
        )}
      </g>
      <g className="dbc-aircraft__labels" fill="currentColor">
        <text x="62" y="98" fontSize="9">NOSE</text>
        <text x="610" y="98" fontSize="9">SEAT 18C / AFT CABIN</text>
        <text x="806" y="290" fontSize="9">VENTRAL AIRSTAIR</text>
        <text x="756" y="103" fontSize="9">T-TAIL</text>
      </g>
    </svg>
  );
}

/** The attaché case, drawn from the witnesses' descriptions. */
export function BriefcaseDiagram() {
  return (
    <svg viewBox="0 0 420 300" className="dbc-briefcase" role="img" aria-label="Reconstruction diagram of an attaché case with a battery, wiring, and eight red cylinders.">
      <rect x="60" y="82" width="300" height="178" rx="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M176 82 C176 58 244 58 244 82" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="76" y="98" width="268" height="146" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <rect x="98" y="168" width="62" height="46" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="98" y="158" fontSize="9" fill="currentColor">BATTERY</text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
        <g key={n}>
          <rect x={186 + (n % 4) * 36} y={n < 4 ? 128 : 164} width="24" height="30" rx="3" fill="var(--dbc-ember)" opacity="0.9" />
          <rect x={186 + (n % 4) * 36} y={n < 4 ? 124 : 160} width="24" height="5" rx="2" fill="currentColor" opacity="0.5" />
        </g>
      ))}
      <path d="M160 190 C176 190 176 146 186 146 M160 190 C180 190 178 182 186 182" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M160 190 C176 198 182 198 190 198" fill="none" stroke="var(--dbc-ember)" strokeWidth="1.4" />
      <text x="186" y="222" fontSize="9" fill="currentColor">8 RED CYLINDERS · WITNESS DESCRIPTION</text>
    </svg>
  );
}

export function Beat({
  from,
  until,
  children,
  className = '',
}: {
  from: number;
  until?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`dbc-beat ${className}`}
      style={{ '--from': from, '--until': until ?? 1.2 } as CSSProperties}
    >
      {children}
    </div>
  );
}

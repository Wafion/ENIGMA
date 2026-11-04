import React, { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Pause, Play, Volume2, X } from 'lucide-react';
import { useExperience } from '../ExperienceContext';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import type { EnigmaAsset, EnigmaElement } from '../../types/enigma';

type DocElement = Extract<EnigmaElement, { type: 'document' }>;
type AudioElement = Extract<EnigmaElement, { type: 'audio-cue' }>;

/* -------------------------------------------------------------------------- */
/* Dialog                                                                      */
/* -------------------------------------------------------------------------- */

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  variant?: 'center' | 'right';
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  className = '',
  variant = 'center',
}: DialogProps) {
  const labelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((element) => element.offsetParent !== null)
        : [];

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      const target = restoreFocus.current;
      if (target?.isConnected) {
        window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={`dialog dialog--${variant} ${className}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        ref={panelRef}
      >
        <div className="dialog__top">
          <h2 id={labelId} className="dialog__title">
            {title}
          </h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={1.6} aria-hidden />
          </button>
        </div>
        <div className="dialog__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */
/* Sources in body copy                                                        */
/* -------------------------------------------------------------------------- */

const citationPattern = /(\[SRC-\d{2}(?:,\s*SRC-\d{2})*\])/g;

export function SourceRef({ code }: { code: string }) {
  const { openSources } = useExperience();
  return (
    <button
      type="button"
      className="source-ref"
      onClick={() => openSources(code)}
      aria-label={`Open source ${code}`}
    >
      {code}
    </button>
  );
}

export function RichText({ text }: { text: string }) {
  const parts = text.split(citationPattern);
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (/^\[SRC-/.test(part)) {
          const codes = part.replace(/[[\]]/g, '').split(/,\s*/);
          return (
            <span className="source-refs" key={`${part}-${index}`}>
              {codes.map((code, codeIndex) => (
                <React.Fragment key={code}>
                  {codeIndex > 0 && <span aria-hidden>, </span>}
                  <SourceRef code={code} />
                </React.Fragment>
              ))}
            </span>
          );
        }
        return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
}

interface ProseProps {
  text: Extract<EnigmaElement, { type: 'text' }>;
  className?: string;
}

export function Prose({ text, className = '' }: ProseProps) {
  return (
    <div className={`prose ${className}`}>
      {text.leadParagraph && (
        <p className={text.dropcap ? 'prose__lead prose__dropcap' : 'prose__lead'}>
          <RichText text={text.leadParagraph} />
        </p>
      )}
      {text.paragraphs.map((paragraph, index) => (
        <p key={index}>
          <RichText text={paragraph} />
        </p>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Figures                                                                     */
/* -------------------------------------------------------------------------- */

interface FigureProps {
  assetId: string;
  caption: string;
  note?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  position?: string;
}

export function Figure({
  assetId,
  caption,
  note,
  className = '',
  imageClassName = '',
  priority = false,
  position,
}: FigureProps) {
  const asset = ASSET_MAP[assetId];
  const { inspectAsset } = useExperience();
  if (!asset) return null;

  return (
    <figure className={`figure ${className}`}>
      <button
        type="button"
        className="figure__media"
        onClick={() => inspectAsset(assetId)}
        aria-label={`View provenance and larger image: ${asset.title}`}
      >
        <img
          src={asset.localPath}
          alt={asset.description}
          className={imageClassName}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          style={position ? { objectPosition: position } : undefined}
        />
        <span className="figure__inspect" aria-hidden>
          <Maximize2 size={14} strokeWidth={1.5} />
          Inspect
        </span>
      </button>
      <figcaption className="figure__caption">
        <span>{caption}</span>
        {note && <span className="figure__note">{note}</span>}
        <span className="figure__credit">
          {asset.creator} · {asset.date} · {asset.license}
        </span>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Reconstructed document object                                               */
/* -------------------------------------------------------------------------- */

export function DocumentObject({
  document,
  index = 'i',
  className = '',
}: {
  document: DocElement;
  index?: string;
  className?: string;
}) {
  const asset = ASSET_MAP[document.assetId];
  const { inspectAsset } = useExperience();
  if (!asset) return null;

  return (
    <article className={`document-object ${className}`}>
      <div className="document-object__object">
        <span className="document-object__index" aria-hidden>
          {index}
        </span>
        <button
          type="button"
          className="document-object__plate"
          onClick={() => inspectAsset(document.assetId)}
          aria-label={`Examine reconstruction: ${document.title}`}
        >
          <img
            src={asset.localPath}
            alt={asset.description}
            width={800}
            height={1040}
            loading="lazy"
            decoding="async"
          />
        </button>
        <p className="document-object__field">
          Reconstruction. A physical prop made for a 1999 television broadcast, not a historical
          document.
        </p>
      </div>
      <div className="document-object__copy">
        <p className="kicker">Constructed object</p>
        <h3>{document.title}</h3>
        <p className="document-object__claimed">
          Claimed date <span>{document.inUniverseDate}</span>
        </p>
        <p>{document.summary}</p>
        <p className="document-object__origin">{document.realCreationContext}</p>
        <details className="disclosure">
          <summary>Read the object’s text</summary>
          <div className="disclosure__body">
            {document.transcriptExcerpt.map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
          </div>
        </details>
        <div className="document-object__verdict">
          <span>Editorial finding</span>
          <p>{document.factCheckVerdict}</p>
        </div>
        <button
          type="button"
          className="text-link"
          onClick={() => inspectAsset(document.assetId)}
        >
          Open full record <span aria-hidden>↗</span>
        </button>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Audio cue                                                                   */
/* -------------------------------------------------------------------------- */

export function AudioCue({ cue, className = '' }: { cue: AudioElement; className?: string }) {
  const { audio, playCue } = useExperience();
  const asset = ASSET_MAP[cue.assetId];
  const isPlaying = audio.activeCueId === cue.assetId;
  if (!asset) return null;

  return (
    <div className={`audio-cue ${className}`}>
      <div className="audio-cue__icon" aria-hidden>
        <Volume2 size={18} strokeWidth={1.5} />
      </div>
      <div className="audio-cue__copy">
        <p className="kicker">Sound design · project original</p>
        <h3>{cue.title}</h3>
        <p>{cue.narrativePurpose}</p>
        <p className="audio-cue__description">{cue.transcriptOrDescription}</p>
      </div>
      <button
        type="button"
        className="audio-cue__button"
        aria-pressed={isPlaying}
        onClick={() => playCue(cue.assetId)}
      >
        {isPlaying ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
        {isPlaying ? 'Stop cue' : 'Play cue'}
        <span>{cue.durationLabel}</span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Asset dialog                                                                */
/* -------------------------------------------------------------------------- */

export function AssetDialog() {
  const { inspectedAsset, closeAsset } = useExperience();
  if (!inspectedAsset) return null;
  return (
    <Dialog open onClose={closeAsset} title={inspectedAsset.title} variant="center">
      <AssetRecord asset={inspectedAsset} />
    </Dialog>
  );
}

function AssetRecord({ asset }: { asset: EnigmaAsset }) {
  const isDocument = asset.assetType === 'document';
  const isAudio = asset.assetType === 'audio';
  return (
    <div className={`asset-record ${isDocument ? 'asset-record--document' : ''}`}>
      <div className="asset-record__media">
        {isAudio ? (
          <audio controls preload="metadata" src={asset.localPath}>
            Your browser does not support the audio element.
          </audio>
        ) : (
          <img src={asset.localPath} alt={asset.description} />
        )}
      </div>
      <div className="asset-record__meta">
        <p className="kicker">{asset.historicalStatus}</p>
        <dl>
          <div>
            <dt>Creator</dt>
            <dd>{asset.creator}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{asset.date}</dd>
          </div>
          <div>
            <dt>Licence</dt>
            <dd>{asset.license}</dd>
          </div>
          <div>
            <dt>Use in this essay</dt>
            <dd>{asset.usageContext}</dd>
          </div>
        </dl>
        <p>{asset.description}</p>
        {asset.sourceUrl && (
          <a className="text-link" href={asset.sourceUrl} target="_blank" rel="noreferrer">
            {isAudio
              ? 'Open audio file'
              : asset.historicalStatus === 'Reconstructed fictional material'
                ? 'Context reference'
                : 'Original record'}{' '}
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </div>
  );
}

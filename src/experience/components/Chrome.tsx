import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  List,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useExperience } from '../ExperienceContext';
import { CHAPTERS } from '../content';
import { BLAIR_WITCH_ASSETS, BLAIR_WITCH_SOURCES } from '../../data/blairWitchAssets';
import { Dialog } from './primitives';

/* -------------------------------------------------------------------------- */
/* Masthead                                                                    */
/* -------------------------------------------------------------------------- */

export function Masthead() {
  const { audio } = useExperience();
  const { activeChapterId, setIndexOpen, openSources, indexOpen } = useExperience();
  const [progress, setProgress] = useState(0);
  const [soundOpen, setSoundOpen] = useState(false);
  const soundRef = useRef<HTMLDivElement | null>(null);
  const soundButtonRef = useRef<HTMLButtonElement | null>(null);
  const active = CHAPTERS.find((chapter) => chapter.id === activeChapterId);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeSound = () => {
    setSoundOpen(false);
    window.requestAnimationFrame(() => soundButtonRef.current?.focus());
  };

  useEffect(() => {
    if (!soundOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!soundRef.current?.contains(event.target as Node)) setSoundOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSound();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [soundOpen]);

  const soundLabel = !audio.enabled
    ? 'Sound off'
    : audio.muted
      ? 'Sound muted'
      : 'Sound on';

  return (
    <header className="masthead">
      <div className="masthead__inner">
        <a className="wordmark" href="/" aria-label="ENIGMA, home">
          ENIGMA
        </a>
        <p className="masthead__case" aria-hidden={!active}>
          <span>Case 001</span>
          <span className="masthead__case-title">{active?.shortTitle ?? 'The Blair Witch Incident'}</span>
        </p>
        <nav className="masthead__nav" aria-label="Exhibition controls">
          <div className="sound-control" ref={soundRef}>
            <button
              type="button"
              ref={soundButtonRef}
              className={`masthead__button ${audio.enabled && !audio.muted ? 'is-on' : ''}`}
              onClick={() => setSoundOpen((open) => !open)}
              aria-expanded={soundOpen}
              aria-haspopup="dialog"
            >
              {audio.enabled && !audio.muted ? (
                <Volume2 size={15} strokeWidth={1.6} aria-hidden />
              ) : (
                <VolumeX size={15} strokeWidth={1.6} aria-hidden />
              )}
              <span>{soundLabel}</span>
            </button>
            {soundOpen && <SoundMenu onClose={() => setSoundOpen(false)} />}
          </div>
          <button
            type="button"
            className="masthead__button"
            onClick={() => setIndexOpen(!indexOpen)}
            aria-expanded={indexOpen}
          >
            <List size={15} strokeWidth={1.6} aria-hidden />
            <span>Index</span>
          </button>
          <button type="button" className="masthead__button" onClick={() => openSources()}>
            <BookOpen size={15} strokeWidth={1.6} aria-hidden />
            <span>Sources</span>
          </button>
        </nav>
      </div>
      <div className="read-progress" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Sound menu                                                                  */
/* -------------------------------------------------------------------------- */

function SoundMenu({ onClose }: { onClose: () => void }) {
  const { audio, enableAudio, disableAudio, setMuted, setVolume } = useExperience();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const first = menuRef.current?.querySelector<HTMLElement>('button, input, select, a[href]');
    first?.focus();
  }, []);

  return (
    <div className="sound-menu" role="dialog" aria-label="Sound settings" ref={menuRef}>
      <p className="kicker">Optional sound</p>
      <p className="sound-menu__lede">
        Sound design made for this essay. Nothing plays until you choose it.
      </p>
      {!audio.enabled ? (
        <button type="button" className="button button--solid sound-menu__action" onClick={enableAudio}>
          Turn sound on
        </button>
      ) : (
        <>
          <div className="sound-menu__row">
            <button
              type="button"
              className="button button--solid sound-menu__action"
              onClick={() => setMuted(!audio.muted)}
            >
              {audio.muted ? 'Unmute' : 'Mute'}
            </button>
            <button type="button" className="text-link" onClick={disableAudio}>
              Turn off
            </button>
          </div>
          <label className="sound-menu__volume">
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audio.masterVolume}
              onChange={(event) => setVolume(Number(event.target.value))}
            />
          </label>
        </>
      )}
      <p className="sound-menu__note">
        Audio pauses when the tab is hidden. It does not play automatically on load or on scroll.
      </p>
      <button type="button" className="sound-menu__close" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Chapter index                                                               */
/* -------------------------------------------------------------------------- */

export function ChapterIndex() {
  const { indexOpen, setIndexOpen, reducedMotion, setReducedMotion, openSources } = useExperience();
  return (
    <Dialog
      open={indexOpen}
      onClose={() => setIndexOpen(false)}
      title="Contents"
      variant="right"
      className="index-dialog"
    >
      <p className="dialog__intro">
        One essay in eight movements. There is no correct door; the scroll is linear.
      </p>
      <ol className="index-list">
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            <a href={chapter.href} onClick={() => setIndexOpen(false)}>
              <span className="index-list__number">{chapter.number}</span>
              <span className="index-list__body">
                <span className="index-list__title">{chapter.shortTitle}</span>
                <span className="index-list__truth">{chapter.truth}</span>
              </span>
              <ChevronRight size={15} strokeWidth={1.4} aria-hidden />
            </a>
          </li>
        ))}
      </ol>
      <div className="index-settings">
        <p className="kicker">Reading settings</p>
        <label className="switch-row">
          <span>
            <strong>Reduce motion</strong>
            <small>Still photographs and no pinned scenes.</small>
          </span>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />
          <span className="switch" aria-hidden />
        </label>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setIndexOpen(false);
            openSources();
          }}
        >
          Open the source and asset register
        </button>
      </div>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Sources and assets                                                          */
/* -------------------------------------------------------------------------- */

export function SourceDrawer() {
  const { sourcesOpen, closeSources, highlightedSource, clearHighlightedSource, inspectAsset } =
    useExperience();
  const [tab, setTab] = useState<'sources' | 'assets'>('sources');
  const [query, setQuery] = useState('');
  const highlightedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sourcesOpen) return;
    setTab('sources');
    setQuery('');
  }, [sourcesOpen]);

  useEffect(() => {
    if (!highlightedSource || !sourcesOpen) return;
    setTab('sources');
    const timer = window.setTimeout(() => {
      highlightedRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [highlightedSource, sourcesOpen]);

  const sources = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return BLAIR_WITCH_SOURCES;
    return BLAIR_WITCH_SOURCES.filter((source) =>
      [source.code, source.title, source.authorOrPublisher, source.verificationNote]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  const assets = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return BLAIR_WITCH_ASSETS;
    return BLAIR_WITCH_ASSETS.filter((asset) =>
      [asset.title, asset.creator, asset.date, asset.historicalStatus, asset.description]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  return (
    <Dialog
      open={sourcesOpen}
      onClose={closeSources}
      title="Register"
      variant="right"
      className="source-dialog"
    >
      <div className="register-tabs" role="tablist" aria-label="Register sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'sources'}
          onClick={() => {
            setTab('sources');
            clearHighlightedSource();
          }}
        >
          Sources <span>{BLAIR_WITCH_SOURCES.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'assets'}
          onClick={() => {
            setTab('assets');
            clearHighlightedSource();
          }}
        >
          Assets <span>{BLAIR_WITCH_ASSETS.length}</span>
        </button>
      </div>
      <label className="register-search">
        <Search size={15} strokeWidth={1.5} aria-hidden />
        <span className="visually-hidden">Search the register</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tab === 'sources' ? 'Search sources' : 'Search assets'}
        />
      </label>

      {tab === 'sources' ? (
        <div className="register-list" role="tabpanel">
          <p className="dialog__intro">
            Primary records, production documentation and contemporary reporting used in this
            essay. Links open the original publisher.
          </p>
          {sources.map((source) => {
            const highlighted = source.code === highlightedSource;
            return (
              <article
                key={source.id}
                id={`source-${source.code}`}
                ref={highlighted ? highlightedRef : undefined}
                className={`register-item ${highlighted ? 'is-highlighted' : ''}`}
              >
                <div className="register-item__top">
                  <span className="register-item__code">{source.code}</span>
                  <span className="register-item__category">{source.category}</span>
                </div>
                <h3>{source.title}</h3>
                <p className="register-item__byline">
                  {source.authorOrPublisher} · {source.publicationDate}
                </p>
                <p>{source.verificationNote}</p>
                <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                  Original record <span aria-hidden>↗</span>
                </a>
              </article>
            );
          })}
          {!sources.length && <p className="register-empty">No source matches that search.</p>}
        </div>
      ) : (
        <div className="register-list" role="tabpanel">
          <p className="dialog__intro">
            Every photograph and reconstructed object in the essay, with its licence and
            provenance. Reconstructions are project originals, not historical evidence.
          </p>
          {assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className="register-asset"
              onClick={() => {
                closeSources();
                inspectAsset(asset.id);
              }}
            >
              {asset.assetType === 'audio' ? (
                <span className="register-asset__audio" aria-hidden>
                  Audio
                </span>
              ) : (
                <img src={asset.localPath} alt="" loading="lazy" />
              )}
              <span>
                <span className="register-asset__status">{asset.historicalStatus}</span>
                <strong>{asset.title}</strong>
                <small>
                  {asset.creator} · {asset.date} · {asset.license}
                </small>
              </span>
            </button>
          ))}
          {!assets.length && <p className="register-empty">No asset matches that search.</p>}
        </div>
      )}
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop chapter rail                                                        */
/* -------------------------------------------------------------------------- */

export function ChapterRail() {
  const { activeChapterId } = useExperience();
  return (
    <nav className="chapter-rail" aria-label="Chapter progress">
      <ol>
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={chapter.href}
              className={chapter.id === activeChapterId ? 'is-active' : ''}
              aria-current={chapter.id === activeChapterId ? 'location' : undefined}
            >
              <span className="chapter-rail__num">{chapter.number}</span>
              <span className="chapter-rail__label">{chapter.shortTitle}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

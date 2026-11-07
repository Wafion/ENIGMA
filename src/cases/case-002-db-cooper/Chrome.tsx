import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  List,
  Search,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useDbc } from './context';
import { SCENES } from './content';
import { DBC_ASSETS, DBC_ASSET_MAP } from './assets';
import { DBC_SOURCES } from './sources';
import { DBC_MUSIC, DBC_MUSIC_MAP } from './music';

/* -------------------------------------------------------------------------- */
/* Overlay                                                                    */
/* -------------------------------------------------------------------------- */

function Overlay({
  open,
  onClose,
  title,
  children,
  className = '',
  variant = 'right',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  variant?: 'right' | 'full';
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
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
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`dbc-overlay dbc-overlay--${variant} ${className}`} onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="dbc-overlay__panel" role="dialog" aria-modal="true" aria-label={title} ref={panelRef}>
        <header className="dbc-overlay__head">
          <p className="dbc-overlay__title">{title}</p>
          <button type="button" className="dbc-icon-btn" onClick={onClose} ref={closeRef} aria-label="Close panel">
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>
        <div className="dbc-overlay__body">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Masthead                                                                   */
/* -------------------------------------------------------------------------- */

export function Masthead() {
  const {
    audio,
    enableAudio,
    setSoundOpen,
    soundOpen,
    setIndexOpen,
    indexOpen,
    sourcesOpen,
    openSources,
    activeId,
  } = useDbc();
  const [progress, setProgress] = useState(0);
  const active = SCENES.find((scene) => scene.id === activeId);

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
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const soundLabel = !audio.enabled ? 'Sound off' : audio.muted ? 'Muted' : 'Sound on';

  return (
    <header className="dbc-mast">
      <a className="dbc-mast__brand" href="/" aria-label="ENIGMA, home">
        ENIGMA
      </a>
      <p className="dbc-mast__case">
        <span>CASE 002</span>
        <span className="dbc-mast__title">{active?.short ?? 'The Cooper File'}</span>
      </p>
      <nav className="dbc-mast__nav" aria-label="Documentary controls">
        <button
          type="button"
          className={`dbc-mast__btn ${audio.enabled && !audio.muted ? 'is-on' : ''}`}
          onClick={() => {
            if (!audio.enabled) enableAudio();
            setSoundOpen(!soundOpen);
          }}
          aria-label={soundLabel}
          title={soundLabel}
          aria-expanded={soundOpen}
        >
          {audio.enabled && !audio.muted ? (
            <Volume2 size={15} strokeWidth={1.5} aria-hidden />
          ) : (
            <VolumeX size={15} strokeWidth={1.5} aria-hidden />
          )}
          <span className="dbc-mast__btn-label">{soundLabel}</span>
        </button>
        <button type="button" className="dbc-mast__btn" onClick={() => { setIndexOpen(!indexOpen); }} aria-expanded={indexOpen}>
          <List size={15} strokeWidth={1.5} aria-hidden />
          <span>Index</span>
        </button>
        <button type="button" className="dbc-mast__btn" onClick={() => openSources()} aria-expanded={sourcesOpen}>
          <BookOpen size={15} strokeWidth={1.5} aria-hidden />
          <span>Sources</span>
        </button>
      </nav>
      {soundOpen && <SoundPanel />}
      <div className="dbc-mast__progress" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Sound                                                                      */
/* -------------------------------------------------------------------------- */

function SoundPanel() {
  const {
    audio,
    enableAudio,
    toggleMuted,
    setMasterVolume,
    setScoreVolume,
    setAmbienceVolume,
    setSoundOpen,
  } = useDbc();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!ref.current?.contains(target) && !target.closest('.dbc-mast__btn')) setSoundOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [setSoundOpen]);

  return (
    <div className="dbc-sound" ref={ref}>
      <p className="dbc-kicker">Licensed score · sound design</p>
      {!audio.enabled ? (
        <>
          <p className="dbc-sound__copy">
            A licensed score and an environmental bed, cued by movement. Nothing plays until you ask
            for it.
          </p>
          <button type="button" className="dbc-btn dbc-btn--solid" onClick={enableAudio}>
            Enable sound
          </button>
        </>
      ) : (
        <>
          <p className="dbc-sound__scene">{audio.scene.replace(/-/g, ' ')} · {audio.muted ? 'muted' : 'running'}</p>
          <div className="dbc-sound__track">
            <strong>{audio.trackTitle ?? 'No music in this movement'}</strong>
            <span>
              {audio.trackTitle
                ? `${audio.trackArtist} · ${(audio.trackId && DBC_MUSIC_MAP[audio.trackId]?.license) || 'CC BY 4.0'}`
                : 'Ambience and field textures continue.'}
            </span>
          </div>
          <div className="dbc-sound__row">
            <button type="button" className="dbc-btn dbc-btn--solid" onClick={toggleMuted}>
              {audio.muted ? 'Unmute' : 'Mute'}
            </button>
            <button type="button" className="dbc-text-btn" onClick={() => setSoundOpen(false)}>
              Close
            </button>
          </div>
          <label className="dbc-slider">
            <span>Master <b>{Math.round(audio.masterVolume * 100)}</b></span>
            <input type="range" min="0" max="1" step="0.05" value={audio.masterVolume} onChange={(e) => setMasterVolume(Number(e.target.value))} />
          </label>
          <label className="dbc-slider">
            <span>Music <b>{Math.round(audio.scoreVolume * 100)}</b></span>
            <input type="range" min="0" max="1" step="0.05" value={audio.scoreVolume} onChange={(e) => setScoreVolume(Number(e.target.value))} />
          </label>
          <label className="dbc-slider">
            <span>Ambience <b>{Math.round(audio.ambienceVolume * 100)}</b></span>
            <input type="range" min="0" max="1" step="0.05" value={audio.ambienceVolume} onChange={(e) => setAmbienceVolume(Number(e.target.value))} />
          </label>
          <p className="dbc-sound__note">Score by LEMMiNO (CC BY-SA 4.0) and Scott Buckley (CC BY 4.0), crossfaded per movement. The bed suspends when the tab is hidden. Full credits are in the register.</p>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Scene rail                                                                 */
/* -------------------------------------------------------------------------- */

export function SceneRail() {
  const { activeId } = useDbc();
  return (
    <nav className="dbc-rail" aria-label="Movements">
      <ol>
        {SCENES.map((scene) => (
          <li key={scene.id}>
            <a href={`#${scene.id}`} className={scene.id === activeId ? 'is-active' : ''} aria-current={scene.id === activeId ? 'location' : undefined}>
              <span className="dbc-rail__num">{scene.number}</span>
              <span className="dbc-rail__label">{scene.short}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Index                                                                      */
/* -------------------------------------------------------------------------- */

export function IndexPanel() {
  const { indexOpen, setIndexOpen, reducedMotion, setReducedMotion, openSources } = useDbc();
  return (
    <Overlay open={indexOpen} onClose={() => setIndexOpen(false)} title="Case index" variant="full" className="dbc-index">
      <div className="dbc-index__intro">
        <p className="dbc-kicker">Sixteen movements · one unresolved file</p>
        <p>
          The documentary can be entered anywhere, but it is built to be moved through in order.
          Reconstructions are labelled. Sources open in the register.
        </p>
      </div>
      <ol className="dbc-index__list">
        {SCENES.map((scene) => (
          <li key={scene.id}>
            <a href={`#${scene.id}`} onClick={() => setIndexOpen(false)}>
              <span className="dbc-index__num">{scene.number}</span>
              <span className="dbc-index__title">{scene.title}</span>
              <span className="dbc-index__min">{scene.minutes} min</span>
              <ArrowUpRight size={15} strokeWidth={1.3} aria-hidden />
            </a>
          </li>
        ))}
      </ol>
      <div className="dbc-index__settings">
        <p className="dbc-kicker">Accessibility</p>
        <label className="dbc-switch">
          <span>
            <strong>Reduce motion</strong>
            <small>Stop camera movement and pinned sequences; read the scenes as documents.</small>
          </span>
          <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
          <i aria-hidden />
        </label>
        <button type="button" className="dbc-text-btn" onClick={() => { setIndexOpen(false); openSources(); }}>
          Open the source and asset register
        </button>
      </div>
    </Overlay>
  );
}

/* -------------------------------------------------------------------------- */
/* Register                                                                   */
/* -------------------------------------------------------------------------- */

export function SourcePanel() {
  const { sourcesOpen, closeSources, highlightedSource } = useDbc();
  const [tab, setTab] = useState<'sources' | 'assets' | 'music'>('sources');
  const [query, setQuery] = useState('');
  const highlightedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sourcesOpen) return;
    setTab('sources');
    setQuery('');
  }, [sourcesOpen]);

  useEffect(() => {
    if (!sourcesOpen || !highlightedSource) return;
    setTab('sources');
    const timer = window.setTimeout(() => highlightedRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 160);
    return () => window.clearTimeout(timer);
  }, [sourcesOpen, highlightedSource]);

  const term = query.trim().toLowerCase();
  const sources = DBC_SOURCES.filter((s) =>
    [s.code, s.title, s.publisher, s.author, s.obtained].join(' ').toLowerCase().includes(term),
  );
  const assets = DBC_ASSETS.filter((a) =>
    [a.title, a.creator, a.license, a.description].join(' ').toLowerCase().includes(term),
  );
  const music = DBC_MUSIC.filter((track) =>
    [track.title, track.artist, track.license, track.usage].join(' ').toLowerCase().includes(term),
  );

  return (
    <Overlay open={sourcesOpen} onClose={closeSources} title="Register" className="dbc-register">
      <div className="dbc-register__tabs" role="tablist" aria-label="Register sections">
        <button type="button" role="tab" aria-selected={tab === 'sources'} onClick={() => setTab('sources')}>
          Sources <span>{DBC_SOURCES.length}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === 'assets'} onClick={() => setTab('assets')}>
          Assets <span>{DBC_ASSETS.length}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === 'music'} onClick={() => setTab('music')}>
          Music <span>{DBC_MUSIC.length}</span>
        </button>
      </div>
      <label className="dbc-register__search">
        <Search size={15} strokeWidth={1.5} aria-hidden />
        <span className="dbc-visually-hidden">Search the register</span>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tab === 'sources' ? 'Search sources' : tab === 'assets' ? 'Search assets' : 'Search music'} />
      </label>

      {tab === 'sources' ? (
        <div className="dbc-register__list" role="tabpanel">
          <p className="dbc-register__intro">
            Primary records, official archives, aviation chronologies, forensic research, and
            contemporary reporting. Each entry states what it was used for and, where relevant, its
            limits.
          </p>
          {sources.map((source) => {
            const highlighted = source.code === highlightedSource;
            return (
              <article
                key={source.code}
                id={`dbc-source-${source.code}`}
                ref={highlighted ? highlightedRef : undefined}
                className={`dbc-source ${highlighted ? 'is-highlighted' : ''}`}
              >
                <div className="dbc-source__top">
                  <span className="dbc-source__code">{source.code}</span>
                  <span className="dbc-source__cat">{source.category}</span>
                </div>
                <h3>{source.title}</h3>
                <p className="dbc-source__byline">
                  {source.author ? `${source.author} · ` : ''}{source.publisher} · {source.date}
                </p>
                <p className="dbc-source__obtained"><strong>Used for:</strong> {source.obtained}</p>
                {source.caveat && <p className="dbc-source__caveat"><strong>Limit:</strong> {source.caveat}</p>}
                <a className="dbc-text-btn" href={source.url} target="_blank" rel="noreferrer">
                  Original source <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden />
                </a>
              </article>
            );
          })}
          {!sources.length && <p className="dbc-register__empty">No source matches that search.</p>}
        </div>
      ) : tab === 'music' ? (
        <div className="dbc-register__list" role="tabpanel">
          <p className="dbc-register__intro">
            The licensed score, cue by cue. Tracks by LEMMiNO (CC BY-SA 4.0) and Scott Buckley
            (CC BY 4.0) are looped and mixed under the documentary’s procedural ambience. Each credit
            line is the attribution requested by the composer.
          </p>
          {music.map((track) => (
            <article className="dbc-music-credit" key={track.id}>
              <div className="dbc-source__top">
                <span className="dbc-source__code">{track.id.toUpperCase()}</span>
                <span className="dbc-source__cat">{track.license}</span>
              </div>
              <h3>{track.title}</h3>
              <p className="dbc-source__byline">{track.artist} · {track.date}</p>
              <p className="dbc-source__obtained"><strong>Used in:</strong> {track.usage}</p>
              <p className="dbc-music-credit__attribution">{track.attributionText}</p>
              <p className="dbc-source__caveat"><strong>Delivery:</strong> {track.processing}</p>
              <div className="dbc-music-credit__links">
                <a className="dbc-text-btn" href={track.sourceUrl} target="_blank" rel="noreferrer">
                  Original track <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden />
                </a>
                <a className="dbc-text-btn" href={track.licenseUrl} target="_blank" rel="noreferrer">
                  Licence details <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden />
                </a>
              </div>
            </article>
          ))}
          {!music.length && <p className="dbc-register__empty">No music credit matches that search.</p>}
        </div>
      ) : (
        <div className="dbc-register__list" role="tabpanel">
          <p className="dbc-register__intro">
            Every image in this documentary, with its creator, date, licence, and what it actually
            shows. Reconstructions are project originals, not archival evidence.
          </p>
          <div className="dbc-assets">
            {assets.map((asset) => (
              <article className="dbc-asset" key={asset.id}>
                <div className="dbc-asset__media">
                  {asset.path.endsWith('.svg') ? (
                    <img src={asset.path} alt={asset.description} loading="lazy" />
                  ) : (
                    <img src={asset.path} alt={asset.description} loading="lazy" />
                  )}
                </div>
                <div className="dbc-asset__body">
                  <p className="dbc-asset__status">{asset.status}</p>
                  <h3>{asset.title}</h3>
                  <p>{asset.creator} · {asset.date}</p>
                  <p className="dbc-asset__license">{asset.license}</p>
                  <p>{asset.description}</p>
                  {asset.sourceUrl && (
                    <a className="dbc-text-btn" href={asset.sourceUrl} target="_blank" rel="noreferrer">
                      File record <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden />
                    </a>
                  )}
                  {asset.licenseUrl && (
                    <a className="dbc-text-btn" href={asset.licenseUrl} target="_blank" rel="noreferrer">
                      Licence <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!assets.length && <p className="dbc-register__empty">No asset matches that search.</p>}
        </div>
      )}
    </Overlay>
  );
}

/* -------------------------------------------------------------------------- */
/* Asset viewer                                                               */
/* -------------------------------------------------------------------------- */

export function AssetViewer() {
  const { assetId, closeAsset } = useDbc();
  const asset = assetId ? DBC_ASSET_MAP[assetId] : null;

  return (
    <Overlay open={Boolean(asset)} onClose={closeAsset} title={asset?.title ?? 'Asset'} variant="full" className="dbc-viewer">
      {asset && (
        <div className="dbc-viewer__grid">
          <div className="dbc-viewer__media">
            <img src={asset.path} alt={asset.description} />
          </div>
          <div className="dbc-viewer__meta">
            <p className="dbc-kicker">{asset.status}</p>
            <h2>{asset.title}</h2>
            <p className="dbc-viewer__desc">{asset.description}</p>
            <dl>
              <div><dt>Creator</dt><dd>{asset.creator}</dd></div>
              <div><dt>Date</dt><dd>{asset.date}</dd></div>
              <div><dt>Licence</dt><dd>{asset.license}</dd></div>
              <div><dt>Use here</dt><dd>{asset.usage}</dd></div>
            </dl>
            {asset.note && <p className="dbc-viewer__note">{asset.note}</p>}
            {asset.sourceUrl && (
              <a className="dbc-btn" href={asset.sourceUrl} target="_blank" rel="noreferrer">
                Source record <ArrowUpRight size={14} strokeWidth={1.4} aria-hidden />
              </a>
            )}
            {asset.licenseUrl && (
              <a className="dbc-text-btn" href={asset.licenseUrl} target="_blank" rel="noreferrer">
                Read the licence
              </a>
            )}
          </div>
        </div>
      )}
    </Overlay>
  );
}

/* -------------------------------------------------------------------------- */
/* Completion mark                                                            */
/* -------------------------------------------------------------------------- */

export function VisitedMark({ id }: { id: string }) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('enigma:case002:visited');
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      if (list.includes(id)) setSeen(true);
    } catch {
      // local storage may be unavailable; the mark is decorative
    }
  }, [id]);
  if (!seen) return null;
  return <Check size={12} strokeWidth={1.6} aria-label="Visited" className="dbc-visited" />;
}

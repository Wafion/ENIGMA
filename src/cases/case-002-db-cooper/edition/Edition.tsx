import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  List,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DbcContext, useDbc, type DbcContextValue } from '../context';
import { dbcAudio, type DbcAudioSnapshot } from '../audio';
import { DBC_ASSETS, DBC_ASSET_MAP } from '../assets';
import { DBC_SOURCES } from '../sources';
import { DBC_MUSIC } from '../music';
import type { DbcAudioScene } from '../content';
import { Cover } from './Cover';
import { TheMan } from './TheMan';
import { TheNote } from './TheNote';
import { Flight } from './Flight';
import { TheJump } from './TheJump';
import { TheSearch } from './TheSearch';
import { TheMoney } from './TheMoney';
import { Evidence } from './Evidence';
import { TheNamed } from './TheNamed';
import { Theories } from './Theories';
import { WhatRemains } from './WhatRemains';
import { Overlay, imageSources } from './ui';
import { useEditionMotion } from './motion';
import './edition.css';

interface ChapterMeta {
  id: string;
  number: string;
  title: string;
  short: string;
  climate: 'paper' | 'manila' | 'blue' | 'night' | 'bright' | 'green';
  rhythm: 'LOUD' | 'QUIET' | 'DENSE' | 'ATMOSPHERIC';
  audio: DbcAudioScene;
}

const CHAPTERS: ChapterMeta[] = [
  { id: 'dbc-prologue', number: '00', title: 'The Man Who Was Not There', short: 'Cover', climate: 'paper', rhythm: 'LOUD', audio: 'prologue' },
  { id: 'dbc-the-man', number: '01', title: 'The Man in Seat 18C', short: 'The man', climate: 'paper', rhythm: 'QUIET', audio: 'man' },
  { id: 'dbc-the-note', number: '02', title: 'The Note', short: 'The note', climate: 'manila', rhythm: 'LOUD', audio: 'note' },
  { id: 'dbc-flight-305', number: '03', title: 'Two Hours Over Puget Sound', short: 'Flight 305', climate: 'blue', rhythm: 'DENSE', audio: 'flight' },
  { id: 'dbc-the-jump', number: '04', title: 'The Aft Stairs', short: 'The jump', climate: 'night', rhythm: 'ATMOSPHERIC', audio: 'jump' },
  { id: 'dbc-the-search', number: '05', title: 'The Search', short: 'The search', climate: 'paper', rhythm: 'ATMOSPHERIC', audio: 'search' },
  { id: 'dbc-the-money', number: '06', title: 'The Money at Tina Bar', short: 'The money', climate: 'bright', rhythm: 'LOUD', audio: 'money' },
  { id: 'dbc-the-evidence', number: '07', title: 'What Came Back', short: 'Evidence', climate: 'manila', rhythm: 'DENSE', audio: 'evidence' },
  { id: 'dbc-the-suspects', number: '08', title: 'The Named', short: 'The named', climate: 'paper', rhythm: 'DENSE', audio: 'suspects' },
  { id: 'dbc-the-theories', number: '09', title: 'Four Ways to Disappear', short: 'Theories', climate: 'blue', rhythm: 'DENSE', audio: 'theories' },
  { id: 'dbc-the-unknowns', number: '10', title: 'What Remains', short: 'What remains', climate: 'paper', rhythm: 'QUIET', audio: 'unknowns' },
];

const REGISTER: ChapterMeta = {
  id: 'dbc-sources',
  number: '—',
  title: 'The Register',
  short: 'Register',
  climate: 'paper',
  rhythm: 'DENSE',
  audio: 'sources',
};

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Masthead({
  active,
  progressRef,
}: {
  active: ChapterMeta;
  progressRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const { setIndexOpen, openSources, soundOpen, setSoundOpen, audio } = useDbc();
  const soundLabel = !audio.enabled ? 'Sound off' : audio.muted ? 'Muted' : 'Sound on';

  return (
    <header className="ed-mast">
      <a className="ed-mast__brand" href="/" aria-label="ENIGMA, home">ENIGMA</a>
      <span className="ed-mast__case">CASE 002 · NORJAK</span>
      <span className="ed-mast__chapter" key={active.id}>
        <span>{active.number}</span>
        {active.short}
      </span>
      <nav className="ed-mast__nav" aria-label="Documentary controls">
        <button type="button" onClick={() => setIndexOpen(true)}>
          <List size={14} strokeWidth={1.6} aria-hidden />
          <span>Index</span>
        </button>
        <button type="button" onClick={() => openSources()}>
          <Search size={14} strokeWidth={1.6} aria-hidden />
          <span>Sources</span>
        </button>
        <button
          type="button"
          onClick={() => setSoundOpen(!soundOpen)}
          aria-expanded={soundOpen}
          className={audio.enabled && !audio.muted ? 'is-on' : ''}
        >
          {audio.enabled && !audio.muted
            ? <Volume2 size={14} strokeWidth={1.6} aria-hidden />
            : <VolumeX size={14} strokeWidth={1.6} aria-hidden />}
          <span>{soundLabel}</span>
        </button>
      </nav>
      <span className="ed-mast__progress" aria-hidden>
        <i ref={progressRef} />
      </span>
    </header>
  );
}

function IndexPanel() {
  const { indexOpen, setIndexOpen, openSources, reducedMotion, setReducedMotion } = useDbc();
  return (
    <Overlay open={indexOpen} onClose={() => setIndexOpen(false)} title="Index">
      <div className="ed-index">
        <header className="ed-index__head">
          <p className="ed-kicker">Case 002 · contents</p>
          <h2>The Cooper File</h2>
          <p>
            Eleven movements and a register. Each chapter changes the ground and the grammar.
            The file is read in order, but every entry is a destination.
          </p>
        </header>

        <ol className="ed-index__list">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                onClick={() => setIndexOpen(false)}
                data-climate={chapter.climate}
              >
                <span className="ed-index__num">{chapter.number}</span>
                <span className="ed-index__title">{chapter.title}</span>
                <span className="ed-index__climate">
                  <i aria-hidden />
                  {chapter.climate}
                </span>
                <span className="ed-index__rhythm">{chapter.rhythm}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#dbc-sources" onClick={() => setIndexOpen(false)} data-climate="paper">
              <span className="ed-index__num">—</span>
              <span className="ed-index__title">The Register</span>
              <span className="ed-index__climate"><i aria-hidden />paper</span>
              <span className="ed-index__rhythm">DENSE</span>
            </a>
          </li>
        </ol>

        <div className="ed-index__utility">
          <label className="ed-switch">
            <span>
              <strong>Reduce motion</strong>
              <small>Unpin the cover, the jump, and the search map. Reveals become instant.</small>
            </span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) => setReducedMotion(event.target.checked)}
            />
            <i aria-hidden />
          </label>
          <button type="button" className="ed-link" onClick={() => { setIndexOpen(false); openSources(); }}>
            Open the source and asset register <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function SourcePanel() {
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
    const timer = window.setTimeout(() => {
      highlightedRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [sourcesOpen, highlightedSource]);

  const term = query.trim().toLowerCase();
  const sources = DBC_SOURCES.filter((source) =>
    [source.code, source.title, source.publisher, source.author, source.obtained, source.caveat]
      .join(' ').toLowerCase().includes(term),
  );
  const assets = DBC_ASSETS.filter((asset) =>
    [asset.title, asset.creator, asset.license, asset.description, asset.status]
      .join(' ').toLowerCase().includes(term),
  );
  const music = DBC_MUSIC.filter((track) =>
    [track.title, track.artist, track.license, track.usage].join(' ').toLowerCase().includes(term),
  );

  return (
    <Overlay open={sourcesOpen} onClose={closeSources} title="Register" className="ed-register-overlay">
      <div className="ed-source-panel">
        <div className="ed-source-panel__tabs" role="tablist" aria-label="Register sections">
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

        <label className="ed-source-panel__search">
          <Search size={15} strokeWidth={1.5} aria-hidden />
          <span className="ed-visually-hidden">Search the register</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tab === 'sources' ? 'Search sources' : tab === 'assets' ? 'Search assets' : 'Search music'}
          />
        </label>

        {tab === 'sources' && (
          <div className="ed-source-panel__list">
            <p className="ed-source-panel__intro">
              Primary records, official archives, aviation chronologies, forensic research, and
              contemporary reporting. Each entry states what it was used for and, where relevant,
              its limits.
            </p>
            {sources.map((source) => {
              const highlighted = source.code === highlightedSource;
              return (
                <article
                  key={source.code}
                  id={`ed-source-${source.code}`}
                  ref={highlighted ? highlightedRef : undefined}
                  className={`ed-source-panel__source ${highlighted ? 'is-highlighted' : ''}`}
                >
                  <div className="ed-source-panel__source-top">
                    <span>{source.code}</span>
                    <span>{source.category}</span>
                  </div>
                  <h3>{source.title}</h3>
                  <p className="ed-source-panel__byline">
                    {source.author ? `${source.author} · ` : ''}{source.publisher} · {source.date}
                  </p>
                  <p><strong>Used for:</strong> {source.obtained}</p>
                  {source.caveat && <p className="ed-source-panel__caveat"><strong>Limit:</strong> {source.caveat}</p>}
                  <a className="ed-link" href={source.url} target="_blank" rel="noreferrer">
                    Original source <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden />
                  </a>
                </article>
              );
            })}
            {!sources.length && <p className="ed-source-panel__empty">No source matches that search.</p>}
          </div>
        )}

        {tab === 'assets' && (
          <div className="ed-source-panel__list">
            <p className="ed-source-panel__intro">
              Every image in this documentary, with creator, date, licence, and what it actually
              shows. The three diagrams are project originals, not archival evidence.
            </p>
            <div className="ed-source-panel__assets">
              {assets.map((asset) => {
                const source = imageSources(asset.path);
                return (
                  <article className="ed-source-panel__asset" key={asset.id}>
                    <div className="ed-source-panel__asset-media">
                      <img
                        src={source.src}
                        srcSet={'srcSet' in source ? source.srcSet : undefined}
                        width={source.width}
                        height={source.height}
                        alt={asset.description}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div>
                      <p className="ed-source-panel__status">{asset.status}</p>
                      <h3>{asset.title}</h3>
                      <p>{asset.creator} · {asset.date}</p>
                      <p className="ed-source-panel__license">{asset.license}</p>
                      <p>{asset.description}</p>
                      <div className="ed-source-panel__asset-links">
                        {asset.sourceUrl && (
                          <a className="ed-link" href={asset.sourceUrl} target="_blank" rel="noreferrer">File record ↗</a>
                        )}
                        {asset.licenseUrl && (
                          <a className="ed-link" href={asset.licenseUrl} target="_blank" rel="noreferrer">Licence ↗</a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {!assets.length && <p className="ed-source-panel__empty">No asset matches that search.</p>}
          </div>
        )}

        {tab === 'music' && (
          <div className="ed-source-panel__list">
            <p className="ed-source-panel__intro">
              Sound is opt-in. The licensed score is mixed under a procedural ambience; each credit
              line is the attribution requested by the composer.
            </p>
            {music.map((track) => (
              <article key={track.id} className="ed-source-panel__source">
                <div className="ed-source-panel__source-top">
                  <span>{track.id.toUpperCase()}</span>
                  <span>{track.license}</span>
                </div>
                <h3>{track.title}</h3>
                <p className="ed-source-panel__byline">{track.artist} · {track.date}</p>
                <p><strong>Used in:</strong> {track.usage}</p>
                <p className="ed-source-panel__caveat">{track.attributionText}</p>
                <p className="ed-source-panel__caveat"><strong>Delivery:</strong> {track.processing}</p>
                <div className="ed-source-panel__asset-links">
                  <a className="ed-link" href={track.sourceUrl} target="_blank" rel="noreferrer">Original track ↗</a>
                  <a className="ed-link" href={track.licenseUrl} target="_blank" rel="noreferrer">Licence ↗</a>
                </div>
              </article>
            ))}
            {!music.length && <p className="ed-source-panel__empty">No music credit matches that search.</p>}
          </div>
        )}
      </div>
    </Overlay>
  );
}

function AssetViewer() {
  const { assetId, closeAsset } = useDbc();
  const asset = assetId ? DBC_ASSET_MAP[assetId] : null;
  const source = asset ? imageSources(asset.path) : null;
  return (
    <Overlay open={Boolean(asset)} onClose={closeAsset} title={asset?.title ?? 'Asset'} variant="drawer">
      {asset && source && (
        <div className="ed-asset-viewer">
          <div className="ed-asset-viewer__media">
            <img
              src={source.src}
              srcSet={'srcSet' in source ? source.srcSet : undefined}
              sizes="(max-width: 700px) 100vw, 520px"
              width={source.width}
              height={source.height}
              alt={asset.description}
            />
          </div>
          <p className="ed-kicker">{asset.status}</p>
          <h2>{asset.title}</h2>
          <p className="ed-asset-viewer__desc">{asset.description}</p>
          <dl>
            <div><dt>Creator</dt><dd>{asset.creator}</dd></div>
            <div><dt>Date</dt><dd>{asset.date}</dd></div>
            <div><dt>Licence</dt><dd>{asset.license}</dd></div>
            <div><dt>Used in</dt><dd>{asset.usage}</dd></div>
          </dl>
          {asset.note && <p className="ed-asset-viewer__note">{asset.note}</p>}
          <div className="ed-asset-viewer__links">
            {asset.sourceUrl && (
              <a className="ed-link" href={asset.sourceUrl} target="_blank" rel="noreferrer">
                Source record <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
              </a>
            )}
            {asset.licenseUrl && (
              <a className="ed-link" href={asset.licenseUrl} target="_blank" rel="noreferrer">Read the licence</a>
            )}
          </div>
        </div>
      )}
    </Overlay>
  );
}

function SoundPanel() {
  const {
    soundOpen,
    setSoundOpen,
    audio,
    enableAudio,
    toggleMuted,
    setMasterVolume,
    setScoreVolume,
    setAmbienceVolume,
  } = useDbc();

  useEffect(() => {
    if (!soundOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSoundOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [soundOpen, setSoundOpen]);

  if (!soundOpen) return null;

  return (
    <div className="ed-sound" role="dialog" aria-label="Sound">
      <div className="ed-sound__head">
        <span>Sound</span>
        <button type="button" onClick={() => setSoundOpen(false)} aria-label="Close sound panel">Close</button>
      </div>
      {!audio.enabled ? (
        <>
          <p className="ed-sound__note">
            The score is opt-in and starts only when you ask. Motion and sound are independent.
          </p>
          <button type="button" className="ed-sound__enable" onClick={enableAudio}>
            <Volume2 size={15} strokeWidth={1.6} aria-hidden /> Enable sound
          </button>
        </>
      ) : (
        <>
          <p className="ed-sound__cue">
            <span>{audio.trackTitle ?? 'Procedural ambience'}</span>
            <small>{audio.trackArtist ?? 'No music cue in this movement'}</small>
          </p>
          <label>
            <span>Master <b>{Math.round(audio.masterVolume * 100)}</b></span>
            <input type="range" min="0" max="1" step="0.01" value={audio.masterVolume}
              onChange={(event) => setMasterVolume(Number(event.target.value))} />
          </label>
          <label>
            <span>Score <b>{Math.round(audio.scoreVolume * 100)}</b></span>
            <input type="range" min="0" max="1" step="0.01" value={audio.scoreVolume}
              onChange={(event) => setScoreVolume(Number(event.target.value))} />
          </label>
          <label>
            <span>Ambience <b>{Math.round(audio.ambienceVolume * 100)}</b></span>
            <input type="range" min="0" max="1" step="0.01" value={audio.ambienceVolume}
              onChange={(event) => setAmbienceVolume(Number(event.target.value))} />
          </label>
          <button type="button" className="ed-sound__mute" onClick={toggleMuted}>
            {audio.muted ? 'Unmute' : 'Mute'} <span aria-hidden>{audio.muted ? '○' : '●'}</span>
          </button>
        </>
      )}
    </div>
  );
}

export default function Edition() {
  const [activeId, setActiveId] = useState('dbc-prologue');
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [highlightedSource, setHighlightedSource] = useState<string | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [soundOpen, setSoundOpen] = useState(false);
  const [audio, setAudio] = useState<DbcAudioSnapshot>(() => dbcAudio.getSnapshot());
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const progressRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(activeId);
  const rootRef = useRef<HTMLDivElement>(null);

  useEditionMotion(rootRef, reducedMotion);

  useEffect(() => {
    const unsubscribe = dbcAudio.subscribe(setAudio);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => () => dbcAudio.stop(), []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    activeRef.current = activeId;
    const scene = [...CHAPTERS, REGISTER].find((chapter) => chapter.id === activeId);
    if (scene) dbcAudio.setScene(scene.audio);
  }, [activeId]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('enigma:case002:visited');
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      if (!list.includes(activeId)) {
        list.push(activeId);
        window.localStorage.setItem('enigma:case002:visited', JSON.stringify(list.slice(-24)));
      }
    } catch {
      // progress marking is optional
    }
  }, [activeId]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
      if (sections.length) {
        const line = window.innerHeight * 0.42;
        let current = sections[0];
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= line) current = section;
        }
        const id = current?.dataset.chapterId;
        if (id && id !== activeRef.current) {
          activeRef.current = id;
          setActiveId(id);
        }
      }

      const jump = document.getElementById('dbc-the-jump');
      if (jump && activeRef.current === 'dbc-the-jump') {
        const rect = jump.getBoundingClientRect();
        const span = Math.max(1, rect.height - window.innerHeight);
        dbcAudio.modulateSceneProgress('jump', Math.min(1, Math.max(0, -rect.top / span)));
      }
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

  useEffect(() => {
    if (indexOpen || sourcesOpen || assetId) setSoundOpen(false);
  }, [indexOpen, sourcesOpen, assetId]);

  const value = useMemo<DbcContextValue>(() => {
    const enableAudio = () => {
      const scene = [...CHAPTERS, REGISTER].find((chapter) => chapter.id === activeId);
      dbcAudio.enable(scene?.audio ?? 'prologue');
    };
    const openSources = (code?: string) => {
      setHighlightedSource(code ?? null);
      setSourcesOpen(true);
      setIndexOpen(false);
      dbcAudio.playSfx('paper');
    };
    return {
      activeId,
      setActiveId,
      sourcesOpen,
      openSources,
      closeSources: () => {
        setSourcesOpen(false);
        setHighlightedSource(null);
        dbcAudio.playSfx('paper');
      },
      highlightedSource,
      indexOpen,
      setIndexOpen: (open: boolean) => {
        setIndexOpen(open);
        if (open) {
          setSourcesOpen(false);
          setSoundOpen(false);
        }
      },
      assetId,
      openAsset: (id: string) => {
        setAssetId(id);
        setSoundOpen(false);
        dbcAudio.playSfx('tick');
      },
      closeAsset: () => setAssetId(null),
      soundOpen,
      setSoundOpen,
      audio,
      enableAudio,
      toggleMuted: () => dbcAudio.setMuted(!audio.muted),
      setMasterVolume: (volume: number) => dbcAudio.setMasterVolume(volume),
      setScoreVolume: (volume: number) => dbcAudio.setScoreVolume(volume),
      setAmbienceVolume: (volume: number) => dbcAudio.setAmbienceVolume(volume),
      playSfx: (name) => dbcAudio.playSfx(name),
      modulateAudio: (scene, progress) => dbcAudio.modulateSceneProgress(scene, progress),
      reducedMotion,
      setReducedMotion,
    };
  }, [activeId, sourcesOpen, highlightedSource, indexOpen, assetId, soundOpen, audio, reducedMotion]);

  const active = [...CHAPTERS, REGISTER].find((chapter) => chapter.id === activeId) ?? CHAPTERS[0];

  return (
    <DbcContext.Provider value={value}>
      <div
        id="dbc-top"
        ref={rootRef}
        className={`ed ${reducedMotion ? 'is-reduced' : 'is-motion'}`}
      >
        <a className="ed-skip" href="#ed-main">Skip to the documentary</a>
        <span className="ed-frame" aria-hidden />
        <Masthead active={active} progressRef={progressRef} />
        <main id="ed-main">
          <Cover />
          <TheMan />
          <TheNote />
          <Flight />
          <TheJump />
          <TheSearch />
          <TheMoney />
          <Evidence />
          <TheNamed />
          <Theories />
          <WhatRemains />
        </main>
        <IndexPanel />
        <SourcePanel />
        <AssetViewer />
        <SoundPanel />
      </div>
    </DbcContext.Provider>
  );
}

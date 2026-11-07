import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { DBC_ASSET_MAP } from '../assets';
import { SUSPECTS, SUSPECT_NOTE, type Suspect } from '../content';
import { useDbc } from '../context';
import { Status, TitleWords, imageSources } from './ui';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(Flip);

type Filter = 'all' | 'age' | 'physical' | 'official';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'age', label: 'Age match' },
  { id: 'physical', label: 'Physical evidence' },
  { id: 'official', label: 'Official' },
];

const OFFICIAL = new Set(['mccoy', 'weber', 'christiansen', 'rackstraw', 'catalano']);

function ageNumber(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function Portrait({ suspect }: { suspect: Suspect }) {
  const asset = suspect.portraitAssetId ? DBC_ASSET_MAP[suspect.portraitAssetId] : null;
  if (!asset) {
    return (
      <span className="ed-suspect__no-portrait" aria-hidden>
        {suspect.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}
      </span>
    );
  }
  const source = imageSources(asset.path);
  return (
    <img
      src={source.src}
      width={source.width}
      height={source.height}
      alt={`${suspect.name}, ${asset.date}. ${asset.description}`}
      loading="lazy"
      decoding="async"
    />
  );
}

export function TheNamed() {
  const { reducedMotion } = useDbc();
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<string | null>('mccoy');
  const tableRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const flipTween = useRef<gsap.core.Timeline | null>(null);

  const applyFilter = (next: Filter) => {
    if (next === filter) return;
    if (!reducedMotion && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('.ed-suspect');
      if (rows.length) flipState.current = Flip.getState(rows, { props: 'opacity' });
    }
    setFilter(next);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    const table = tableRef.current;
    if (!state || !table) return;

    flipTween.current?.kill();
    flipTween.current = Flip.from(state, {
      duration: 0.55,
      ease: 'power2.inOut',
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' },
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, y: -14, duration: 0.28, ease: 'power2.in' }),
    });

    const empty = table.querySelector('.ed-named__empty');
    if (empty) {
      gsap.fromTo(
        empty,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.14, ease: 'power3.out' },
      );
    }
  }, [filter]);

  useLayoutEffect(() => {
    if (!open || reducedMotion) return;
    const detail = document.getElementById(`suspect-${open}`);
    if (!detail) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        detail,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.45, ease: 'expo.out' },
      );
      gsap.from(detail.querySelectorAll('.ed-suspect__badge, .ed-suspect__columns section'), {
        opacity: 0,
        y: 12,
        duration: 0.45,
        stagger: 0.06,
        delay: 0.1,
        ease: 'power3.out',
      });
    }, detail);
    return () => context.revert();
  }, [open, reducedMotion]);

  useEffect(() => () => {
    flipTween.current?.kill();
  }, []);

  const list = useMemo(() => {
    if (filter === 'age') {
      return SUSPECTS.filter((suspect) => {
        const age = ageNumber(suspect.ageIn1971);
        return age !== null && age >= 40 && age <= 50;
      });
    }
    if (filter === 'physical') return [];
    if (filter === 'official') return SUSPECTS.filter((suspect) => OFFICIAL.has(suspect.id));
    return SUSPECTS;
  }, [filter]);

  const counts: Record<Filter, number> = {
    all: SUSPECTS.length,
    age: SUSPECTS.filter((s) => {
      const age = ageNumber(s.ageIn1971);
      return age !== null && age >= 40 && age <= 50;
    }).length,
    physical: 0,
    official: SUSPECTS.filter((s) => OFFICIAL.has(s.id)).length,
  };

  return (
    <section
      id="dbc-the-suspects"
      data-chapter
      data-chapter-id="dbc-the-suspects"
      data-climate="paper"
      className="ed-chapter ed-climate--paper ed-named"
      aria-labelledby="dbc-the-suspects-title"
    >
      <span className="ed-chapter__folio" aria-hidden>08</span>
      <div className="ed-wrap">
        <header className="ed-head" data-reveal>
          <div className="ed-head__meta">
            <span className="ed-kicker">The named · six files</span>
            <span className="ed-head__num" aria-hidden>08</span>
          </div>
          <div className="ed-head__body">
            <h2 className="ed-head__title" id="dbc-the-suspects-title" aria-label="The Named">
              <TitleWords text="The Named" />
            </h2>
            <p className="ed-head__lede">{SUSPECT_NOTE}</p>
          </div>
          <div className="ed-head__aside">
            <p className="ed-named__count">{SUSPECTS.length} names<br /><span>0 identifications</span></p>
          </div>
        </header>

        <div className="ed-named__filters" role="group" aria-label="Filter suspects">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? 'is-active' : ''}
              aria-pressed={filter === item.id}
              onClick={() => applyFilter(item.id)}
            >
              {item.label}
              <span>{counts[item.id]}</span>
            </button>
          ))}
        </div>

        <div className="ed-named__table" ref={tableRef}>
          <div className="ed-named__head" aria-hidden>
            <span>Name</span>
            <span>Age in 1971</span>
            <span>Status</span>
            <span>Why named</span>
            <span>Outcome</span>
            <span />
          </div>

          {list.map((suspect) => {
            const expanded = open === suspect.id;
            return (
              <article key={suspect.id} className={`ed-suspect ${expanded ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="ed-suspect__row"
                  onClick={() => setOpen(expanded ? null : suspect.id)}
                  aria-expanded={expanded}
                  aria-controls={`suspect-${suspect.id}`}
                >
                  <span className="ed-suspect__name">
                    <Portrait suspect={suspect} />
                    <span>
                      <strong>{suspect.name}</strong>
                      <small>{suspect.life} · {suspect.role}</small>
                    </span>
                  </span>
                  <span className="ed-suspect__age">{suspect.ageIn1971}</span>
                  <span><Status value={suspect.status} compact /></span>
                  <span className="ed-suspect__why">{suspect.why}</span>
                  <span className="ed-suspect__outcome">{suspect.outcome}</span>
                  <span className="ed-suspect__chevron" aria-hidden>
                    <ChevronDown size={17} strokeWidth={1.5} />
                  </span>
                </button>

                <div className="ed-suspect__detail" id={`suspect-${suspect.id}`} hidden={!expanded}>
                  <div className="ed-suspect__badge">
                    <span>{suspect.badge}</span>
                    <span>{suspect.source}</span>
                  </div>
                  <div className="ed-suspect__columns">
                    <section>
                      <h3>Support</h3>
                      <ul>
                        {suspect.support.map((point) => <li key={point}>{point}</li>)}
                      </ul>
                    </section>
                    <section>
                      <h3>Contradiction</h3>
                      <ul>
                        {suspect.contradict.map((point) => <li key={point}>{point}</li>)}
                      </ul>
                    </section>
                  </div>
                </div>
              </article>
            );
          })}

          {!list.length && (
            <div className="ed-named__empty">
              <p className="ed-kicker">No suspect in this file</p>
              <h3>No one is tied to the aircraft, the parachute, or the ransom by physical evidence.</h3>
              <p>
                The filter is empty because the case is empty at this point. A named suspect is a
                lead, an allegation, or a family claim. None has produced a match to the tie, the
                prints, or the recovered bills.
              </p>
            </div>
          )}
        </div>

        <p className="ed-named__caution">
          A suspect is not a solution. Inclusion here means the person was investigated, named, or
          publicly claimed — not that any of them has been established as the hijacker.
        </p>
      </div>
    </section>
  );
}

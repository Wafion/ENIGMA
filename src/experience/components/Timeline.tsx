import { useMemo, useState } from 'react';
import type { TimelineEventItem } from '../../types/enigma';
import { SourceRef } from './primitives';
import { useExperience } from '../ExperienceContext';

export function DualTimeline({ items }: { items: TimelineEventItem[] }) {
  const { triggerSfx } = useExperience();
  const [filter, setFilter] = useState<'both' | 'lore' | 'real-history'>('both');
  const visible = useMemo(
    () => (filter === 'both' ? items : items.filter((item) => item.layer === filter)),
    [filter, items],
  );
  const lore = visible.filter((item) => item.layer === 'fictional-lore');
  const real = visible.filter((item) => item.layer === 'real-history');

  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <header className="timeline__head">
        <div>
          <p className="kicker">Two chronologies, one case</p>
          <h3 id="timeline-title">The story and the record</h3>
          <p>
            The dates on the left were invented between 1998 and 1999. The dates on the right can
            be checked against maps, newspapers and production records.
          </p>
        </div>
        <div className="timeline__filter" role="group" aria-label="Filter chronology">
          <button
            type="button"
            className={filter === 'both' ? 'is-active' : ''}
            onClick={() => {
              setFilter('both');
              triggerSfx('sfx-typewriter');
            }}
          >
            Both
          </button>
          <button
            type="button"
            className={filter === 'lore' ? 'is-active' : ''}
            onClick={() => {
              setFilter('lore');
              triggerSfx('sfx-typewriter');
            }}
          >
            Invented
          </button>
          <button
            type="button"
            className={filter === 'real-history' ? 'is-active' : ''}
            onClick={() => {
              setFilter('real-history');
              triggerSfx('sfx-typewriter');
            }}
          >
            Documented
          </button>
        </div>
      </header>

      <div className={`timeline__body timeline__body--${filter}`}>
        {lore.length > 0 && (
          <div className="timeline__track">
            <h4>
              <span>Invented chronology</span>
              <small>Story world</small>
            </h4>
            <ol>
              {lore.map((item) => (
                <li key={item.id}>
                  <time>{item.date}</time>
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.summary}</p>
                    <p className="timeline__verify">{item.verificationNote}</p>
                    {item.sourceCode && <SourceRef code={item.sourceCode} />}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        {real.length > 0 && (
          <div className="timeline__track timeline__track--record">
            <h4>
              <span>Documented chronology</span>
              <small>Source record</small>
            </h4>
            <ol>
              {real.map((item) => (
                <li key={item.id}>
                  <time>{item.date}</time>
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.summary}</p>
                    <p className="timeline__verify">{item.verificationNote}</p>
                    {item.sourceCode && <SourceRef code={item.sourceCode} />}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

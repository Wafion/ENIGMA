import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { THEORIES } from '../content';
import { useDbc } from '../context';
import { Chapter, ChapterHead, Status } from './ui';

type Mark = 'supports' | 'conflicts' | 'unknown';

const TESTS = [
  { id: 'age', label: 'Age estimate' },
  { id: 'parachute', label: 'Parachute & exit' },
  { id: 'money', label: 'Money trail' },
  { id: 'body', label: 'Body or remains' },
  { id: 'sighting', label: 'Sightings' },
  { id: 'ground', label: 'Ground support' },
] as const;

const MATRIX: Record<string, Record<(typeof TESTS)[number]['id'], { mark: Mark; note: string }>> = {
  died: {
    age: { mark: 'unknown', note: 'The description fits a man, not an outcome.' },
    parachute: { mark: 'supports', note: 'Dummy reserve, no steerable canopy, night, rain, street clothes.' },
    money: { mark: 'unknown', note: 'The 1980 find says some money reached the ground. It does not say how.' },
    body: { mark: 'conflicts', note: 'No body, harness, or canopy was ever found.' },
    sighting: { mark: 'unknown', note: 'No confirmed sighting either way.' },
    ground: { mark: 'unknown', note: 'No evidence of an accomplice; no need for one if he died.' },
  },
  survived: {
    age: { mark: 'unknown', note: 'No theory is helped by the age estimate.' },
    parachute: { mark: 'unknown', note: 'Other jumpers survived comparable exits. The canopy is unknown.' },
    money: { mark: 'conflicts', note: 'No ransom bill beyond the 1980 find entered circulation.' },
    body: { mark: 'supports', note: 'No body was found because, on this account, there was none to find.' },
    sighting: { mark: 'conflicts', note: 'No confirmed later identity or credible sighting.' },
    ground: { mark: 'conflicts', note: 'No known vehicle, boat, or accomplice.' },
  },
  accomplice: {
    age: { mark: 'unknown', note: 'Not addressed by the theory.' },
    parachute: { mark: 'unknown', note: 'A helper does not explain whether the canopy opened.' },
    money: { mark: 'unknown', note: 'Could explain a second handler, but there is no direct record.' },
    body: { mark: 'supports', note: 'A vehicle or boat would explain the absence of a body and canopy.' },
    sighting: { mark: 'conflicts', note: 'No witness, vehicle, or boat was tied to the case.' },
    ground: { mark: 'supports', note: 'Ground support is the theory’s premise.' },
  },
  money: {
    age: { mark: 'unknown', note: 'Not addressed by the theory.' },
    parachute: { mark: 'unknown', note: 'The money’s journey need not be the parachute’s journey.' },
    money: { mark: 'supports', note: 'Diatoms point to a later, spring entry into the water.' },
    body: { mark: 'unknown', note: 'Silent on whether Cooper survived.' },
    sighting: { mark: 'unknown', note: 'Silent on later identity.' },
    ground: { mark: 'unknown', note: 'Dredging is documented; a handler is not.' },
  },
};

const RELATED: Record<string, string[]> = {
  died: ['E-02 · The parachutes', 'E-06 · The missing'],
  survived: ['E-01 · The tie', 'E-05 · The fingerprints'],
  accomplice: ['E-04 · The ticket & note', 'E-06 · The missing'],
  money: ['E-03 · The money', 'E-06 · The missing'],
};

function MatrixMark({ mark }: { mark: Mark }) {
  const label = mark === 'supports' ? 'Supports' : mark === 'conflicts' ? 'Conflicts' : 'Unknown';
  return (
    <span className={`ed-matrix__mark is-${mark}`}>
      <i aria-hidden>{mark === 'supports' ? '●' : mark === 'conflicts' ? '✕' : '○'}</i>
      {label}
    </span>
  );
}

export function Theories() {
  const { reducedMotion } = useDbc();
  const [selected, setSelected] = useState(THEORIES[0].id);
  const theory = THEORIES.find((item) => item.id === selected) ?? THEORIES[0];
  const panelRef = useRef<HTMLElement>(null);
  const mounted = useRef(false);

  useGSAP(
    () => {
      if (!mounted.current) {
        mounted.current = true;
        return;
      }
      if (reducedMotion) return;
      const panel = panelRef.current;
      if (!panel) return;

      gsap
        .timeline()
        .fromTo(
          panel,
          { clipPath: 'inset(0 0 100% 0)', y: 14 },
          { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.5, ease: 'expo.out' },
        )
        .from(
          panel.querySelectorAll(
            '.ed-theory__num, .ed-theory__lead h3, .ed-theory__claim, .ed-theory__why, .ed-theory__verdict',
          ),
          { opacity: 0, y: 12, duration: 0.4, stagger: 0.05, ease: 'power3.out' },
          0.06,
        )
        .from(
          panel.querySelectorAll('.ed-theory__columns section, .ed-theory__related'),
          { opacity: 0, y: 14, duration: 0.45, stagger: 0.06, ease: 'power3.out' },
          0.16,
        );
    },
    { scope: panelRef, dependencies: [theory.id, reducedMotion], revertOnUpdate: true },
  );

  return (
    <Chapter id="dbc-the-theories" number="09" climate="blue" className="ed-theories">
      <div className="ed-wrap">
        <ChapterHead
          id="dbc-the-theories"
          number="09"
          kicker="Theories · four ways to disappear"
          title="Four Ways to Disappear"
          lede={
            <p>
              None of these is a solution. Each is a way of organising the same unresolved facts.
              Select one to read its case, then compare all four below. No confidence percentages
              are shown because none exist.
            </p>
          }
          aside={<p className="ed-theories__count">4 theories<br /><span>0 proven</span></p>}
        />

        <div className="ed-theories__tabs" role="tablist" aria-label="Theories">
          {THEORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`theory-tab-${item.id}`}
              aria-selected={selected === item.id}
              aria-controls={`theory-panel-${item.id}`}
              tabIndex={selected === item.id ? 0 : -1}
              onClick={() => setSelected(item.id)}
              onKeyDown={(event) => {
                const index = THEORIES.findIndex((entry) => entry.id === selected);
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  const next = event.key === 'ArrowRight'
                    ? (index + 1) % THEORIES.length
                    : (index - 1 + THEORIES.length) % THEORIES.length;
                  setSelected(THEORIES[next].id);
                  document.getElementById(`theory-tab-${THEORIES[next].id}`)?.focus();
                }
              }}
            >
              <span>{item.number}</span>
              {item.title}
            </button>
          ))}
        </div>

        <article
          ref={panelRef}
          className="ed-theory"
          role="tabpanel"
          id={`theory-panel-${theory.id}`}
          aria-labelledby={`theory-tab-${theory.id}`}
          aria-live="polite"
        >
          <div className="ed-theory__lead">
            <span className="ed-theory__num" aria-hidden>{theory.number}</span>
            <div>
              <h3>{theory.title}</h3>
              <p className="ed-theory__claim">{theory.claim}</p>
              <p className="ed-theory__why">{theory.why}</p>
            </div>
            <div className="ed-theory__verdict">
              <span className="ed-kicker">Verdict</span>
              <p>{theory.verdict}</p>
            </div>
          </div>

          <div className="ed-theory__columns">
            <section>
              <h4>Support</h4>
              <ul>{theory.support.map((point) => <li key={point}>{point}</li>)}</ul>
            </section>
            <section>
              <h4>Contradiction</h4>
              <ul>{theory.contradict.map((point) => <li key={point}>{point}</li>)}</ul>
            </section>
            <section>
              <h4>Unknown</h4>
              <ul>{theory.unknown.map((point) => <li key={point}>{point}</li>)}</ul>
            </section>
          </div>

          <div className="ed-theory__related">
            <span className="ed-kicker">Related evidence</span>
            {RELATED[theory.id].map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>

        <div className="ed-matrix-wrap">
          <div className="ed-matrix__head">
            <p className="ed-kicker">Comparison matrix · supports / conflicts / unknown</p>
            <p>
              Cells record whether a theory is consistent with, contradicted by, or silent on each
              test. They are not probabilities.
            </p>
            <p className="ed-matrix__scan" data-matrix-readout aria-hidden>TEST 01 · AGE ESTIMATE</p>
          </div>
          <table className="ed-matrix" data-matrix>
            <thead>
              <tr>
                <th scope="col">Theory</th>
                {TESTS.map((test, index) => (
                  <th scope="col" key={test.id} data-col={index}>{test.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {THEORIES.map((item) => (
                <tr key={item.id} className={selected === item.id ? 'is-selected' : ''}>
                  <th scope="row">
                    <span>{item.number}</span>
                    <strong>{item.title}</strong>
                  </th>
                  {TESTS.map((test, index) => {
                    const cell = MATRIX[item.id][test.id];
                    return (
                      <td key={test.id} data-label={test.label} data-col={index}>
                        <MatrixMark mark={cell.mark} />
                        <span>{cell.note}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ed-matrix__legend">
            <Status value="CONFIRMED" compact /> the test is documented ·
            <Status value="THEORY" compact /> the cell is an interpretation ·
            <Status value="UNKNOWN" compact /> the record is silent
          </p>
        </div>
      </div>
    </Chapter>
  );
}

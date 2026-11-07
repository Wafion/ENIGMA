import { SECOND_FLIGHT_PROSE } from '../content';
import {
  AssetFigure,
  Chapter,
  Cited,
  MarginNote,
  Prose,
} from './ui';

const MARKS = [
  { at: '20:00', label: 'Aft airstair warning light', detail: 'The cockpit offers help. He declines.' },
  { at: '20:11', label: 'Cabin oscillation reported', detail: 'The crew feels something change behind them.' },
  { at: '20:13', label: 'Pitch down · re-trim', detail: 'The jump is inferred from this moment.' },
];

export function TheJump() {
  return (
    <Chapter id="dbc-the-jump" number="04" climate="night" className="ed-jump">
      <div className="ed-jump__pin">
        <div className="ed-jump__sticky">
          <div className="ed-jump__head">
            <p className="ed-kicker">04 · The jump · 20:00–20:13</p>
            <h2 id="dbc-the-jump-title">The Aft Stairs</h2>
            <p className="ed-jump__lede">
              <Cited text={SECOND_FLIGHT_PROSE.lede} />
            </p>
          </div>

          <div className="ed-jump__stage">
            <span className="ed-jump__when" data-jump-when aria-hidden>20:13</span>
            <div className="ed-jump__scale" aria-hidden>
              <div className="ed-jump__scale-labels">
                <span>10,000 ft</span>
                <span>8,000</span>
                <span>6,000</span>
                <span>4,000</span>
                <span>2,000</span>
                <span>GROUND</span>
              </div>
              <div className="ed-jump__scale-line">
                {Array.from({ length: 21 }, (_, i) => (
                  <i key={i} style={{ top: `${(i / 20) * 100}%` }} className={i % 5 === 0 ? 'is-major' : ''} />
                ))}
                <b className="ed-jump__marker" style={{ top: 'calc(var(--jump-p, 0) * 100%)' }} />
              </div>
            </div>

            <div className="ed-jump__marks">
              {MARKS.map((mark) => (
                <article key={mark.at}>
                  <span className="ed-jump__time">{mark.at}</span>
                  <h3>{mark.label}</h3>
                  <p>{mark.detail}</p>
                </article>
              ))}
              <p className="ed-jump__silence">No human being watched Cooper jump.</p>
            </div>

            <div className="ed-jump__visual">
              <AssetFigure
                assetId="dbc-airstair-1975"
                credit={false}
                sizes="(max-width: 900px) 100vw, 30vw"
                caption={
                  <>
                    <strong>THE STAIRWELL</strong>
                    <span>
                      The deployed ventral airstair of a 727, 1975. A narrow metal tunnel opening
                      into a 200-knot slipstream.
                    </span>
                  </>
                }
              />
              <figure className="ed-jump__profile">
                <figcaption>
                  <span>Flight profile · 19:40–22:15</span>
                  <span>Altitude, diagrammatic</span>
                </figcaption>
                <svg viewBox="0 0 420 180" role="img" aria-label="Diagram of the second flight: the aircraft holds about 10,000 feet from 19:40 to 22:15. Cooper's altitude after 20:13 is unknown.">
                  <g className="ed-jump__grid">
                    <path d="M34 24 H400 M34 70 H400 M34 116 H400 M34 162 H400" />
                    <path d="M34 18 V162 M150 18 V162 M266 18 V162 M382 18 V162" />
                  </g>
                  <path className="ed-jump__aircraft-line" d="M40 64 L376 64" />
                  <path className="ed-jump__drop-line" d="M190 64 L210 150" />
                  <g className="ed-jump__plot-labels">
                    <text x="34" y="12">10,000 FT</text>
                    <text x="34" y="176">GROUND</text>
                    <text x="36" y="58">19:40</text>
                    <text x="180" y="58">20:13</text>
                    <text x="360" y="58">22:15</text>
                    <text x="218" y="146">UNKNOWN</text>
                  </g>
                </svg>
              </figure>
            </div>
          </div>

          <p className="ed-jump__scroll" aria-hidden>scroll · the descent is inferred</p>
        </div>
      </div>

      <div className="ed-wrap ed-jump__record">
        <div className="ed-jump__record-grid">
          <Prose paragraphs={[SECOND_FLIGHT_PROSE.paragraphs[0], SECOND_FLIGHT_PROSE.paragraphs[1]]} />
          <Prose paragraphs={[SECOND_FLIGHT_PROSE.paragraphs[2], SECOND_FLIGHT_PROSE.paragraphs[3]]} />
        </div>

        <div className="ed-jump__instruments">
          {SECOND_FLIGHT_PROSE.instruments.map((instrument) => (
            <div key={instrument.label}>
              <span>{instrument.label}</span>
              <strong>{instrument.value}</strong>
              <small>{instrument.note}</small>
            </div>
          ))}
        </div>

        <div className="ed-margins is-inline is-night">
          <MarginNote label="The estimate">
            The 8:11–8:13 oscillation locates the exit within minutes and miles. It does not put a
            point on the ground.
          </MarginNote>
          <MarginNote label="The silence">
            The F-106 pilots saw nothing leave the aircraft. No crew member went back to look.
          </MarginNote>
        </div>
      </div>
    </Chapter>
  );
}

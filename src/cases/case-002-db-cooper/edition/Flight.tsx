import {
  AIRCRAFT_FACTS,
  CREW,
  FLIGHT_PROSE,
  GROUND_PROSE,
  TIMELINE,
} from '../content';
import {
  AircraftDiagram,
  AssetFigure,
  Chapter,
  ChapterHead,
  Cited,
  DiagramFrame,
  MarginNote,
  Prose,
  Status,
} from './ui';

const GROUND_TIMELINE = TIMELINE.filter((entry) =>
  ['15:00–17:30', '17:39–17:46', '≈19:40'].includes(entry.time),
);

function FlightTrajectory() {
  return (
    <section
      className="ed-trajectory"
      data-flight-scene
      aria-label="Diagram of the Flight 305 route and the inferred exit"
    >
      <div className="ed-trajectory__top">
        <div>
          <p className="ed-kicker">Route reconstruction · Portland → Seattle → southbound</p>
          <p className="ed-trajectory__phase" data-flight-phase aria-hidden>01 · Departure · PDX</p>
        </div>
        <p className="ed-trajectory__clock" data-flight-clock aria-live="off">14:50</p>
      </div>

      <div className="ed-trajectory__plot">
        <svg
          className="ed-trajectory__svg"
          viewBox="0 0 1000 460"
          role="img"
          aria-label="Flight 305 departs Portland at 14:50, lands at Seattle for the ransom exchange, takes off again at 19:40 on airway V-23, and reaches the calculated drop zone at 20:13. The route is diagrammatic."
        >
          <g data-flight-world>
          <g className="ed-trajectory__grid" aria-hidden>
            <path d="M60 80 H940 M60 180 H940 M60 280 H940 M60 380 H940" />
            <path d="M60 60 V420 M280 60 V420 M500 60 V420 M720 60 V420 M940 60 V420" />
          </g>

          <path
            className="ed-trajectory__terrain"
            d="M50 406 C 190 378, 318 410, 462 390 S 742 370, 962 402"
          />

          <path d="M62 332 H938" className="ed-trajectory__route-dash" aria-hidden />
          <text x="430" y="316" className="ed-trajectory__labels" fill="#bcc8e3">
            10,000 FT · AIRWAY V-23
          </text>

          <path
            className="ed-trajectory__route"
            data-flight-route
            d="M96 332 C 240 300, 390 220, 548 166 C 600 148, 626 172, 632 216 C 642 276, 678 322, 724 354"
          />

          <g className="ed-trajectory__field" data-flight-field aria-hidden>
            <ellipse cx="740" cy="394" rx="38" ry="21" transform="rotate(-14 740 394)" />
            <ellipse cx="740" cy="394" rx="19" ry="10" transform="rotate(-14 740 394)" />
          </g>

          <path
            className="ed-trajectory__jump"
            data-flight-jump
            d="M724 354 C 730 368, 735 380, 740 388"
            aria-hidden
          />

          <g className="ed-trajectory__events">
            <g className="ed-trajectory__event" data-flight-event>
              <circle cx="96" cy="332" r="4.5" />
              <text x="110" y="354">PDX · 14:50</text>
              <text x="110" y="368" className="is-quiet">Thirty-six aboard</text>
            </g>
            <g className="ed-trajectory__event" data-flight-event>
              <circle cx="548" cy="166" r="4.5" />
              <text x="562" y="160">SEA · 15:00–17:30</text>
              <text x="562" y="174" className="is-quiet">Ransom exchanged</text>
            </g>
            <g className="ed-trajectory__event" data-flight-event>
              <circle cx="632" cy="226" r="4.5" />
              <text x="646" y="228">V-23 · 19:40</text>
              <text x="646" y="242" className="is-quiet">Second flight south</text>
            </g>
            <g className="ed-trajectory__event" data-flight-event>
              <circle cx="724" cy="354" r="4.5" />
              <text x="738" y="348">DROP · 20:13</text>
              <text x="738" y="362" className="is-quiet">Exit inferred</text>
            </g>
          </g>

          <g className="ed-trajectory__plane" data-flight-plane aria-hidden>
            <path d="M-13 -5 L14 0 L-13 5 L-6 0 Z" />
          </g>
          </g>
        </svg>

        <ol className="ed-trajectory__log" aria-label="Route log">
          <li><b>14:50</b><span>Portland. Flight 305 departs with thirty-six passengers.</span></li>
          <li><b>15:00</b><span>Seattle. The ransom is assembled; passengers are released.</span></li>
          <li><b>19:40</b><span>Second flight south on V-23 at 10,000 feet.</span></li>
          <li><b>20:13</b><span>Trim change. The exit is inferred from this moment.</span></li>
        </ol>
      </div>

      <p className="ed-trajectory__foot">
        Diagram · route and timing reconstructed from the record. The drop zone is a field, not a pin.
      </p>
    </section>
  );
}

export function Flight() {
  return (
    <Chapter id="dbc-flight-305" number="03" climate="blue" className="ed-flight">
      <div className="ed-wrap">
        <ChapterHead
          id="dbc-flight-305"
          number="03"
          kicker="Flight 305 · the aircraft"
          title="Two Hours Over Puget Sound"
          lede={<Cited text={FLIGHT_PROSE.lede} />}
          aside={
            <div className="ed-flight__route">
              <span>PDX</span>
              <i aria-hidden />
              <span>SEA</span>
              <small>24 NOV 1971 · 14:50</small>
            </div>
          }
        />

        <div className="ed-flight__tech">
          <DiagramFrame
            label="Diagram · project original · aircraft geometry, not the night"
            caption="Boeing 727-51, ventral aft airstair lowered. The cabin, the seat, and the stairwell are shown to scale against published geometry."
            className="ed-flight__diagram"
          >
            <AircraftDiagram />
          </DiagramFrame>

          <aside className="ed-flight__facts">
            <p className="ed-kicker">Aircraft record</p>
            <dl>
              {AIRCRAFT_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <FlightTrajectory />

        <div className="ed-flight__figures">
          <div>
            <span className="ed-flight__figure">10,000<small>ft ordered</small></span>
          </div>
          <div>
            <span className="ed-flight__figure">≈200<small>knots</small></span>
          </div>
          <div>
            <span className="ed-flight__figure">15°<small>flaps</small></span>
          </div>
          <div>
            <span className="ed-flight__figure">36<small>passengers released</small></span>
          </div>
        </div>
      </div>

      <div className="ed-flight__paper ed-paper-block">
        <div className="ed-wrap">
          <div className="ed-flight__lede-row">
            <div>
              <p className="ed-kicker">The ground · 15:00–19:40</p>
              <h3 className="ed-flight__subtitle">
                A bank, an airline, a police department, and a parachute loft assembled a ransom.
              </h3>
              <Prose paragraphs={[GROUND_PROSE.paragraphs[0], GROUND_PROSE.paragraphs[1]]} />
            </div>
            <div className="ed-stat-ledger">
              {GROUND_PROSE.stats.map((stat) => (
                <div key={stat.label}>
                  <span className="ed-stat-ledger__value">{stat.value}</span>
                  <span className="ed-stat-ledger__label">{stat.label}</span>
                  <span className="ed-stat-ledger__note">{stat.note}</span>
                </div>
              ))}
            </div>
          </div>

          <AssetFigure
            assetId="dbc-crew-cabin"
            className="ed-flight__crew"
            bleed
            sizes="100vw"
            caption={
              <>
                <strong>THE REAR CABIN</strong>
                <span>
                  Captain William Scott, First Officer William Rataczak, Second Officer Harold
                  Anderson, and flight attendant Tina Mucklow inside the narrow aft aisle near the
                  ventral stairwell. The photograph shows the confinement Cooper sat in.
                </span>
              </>
            }
          />

          <div className="ed-flight__roster">
            <div>
              <p className="ed-kicker">Crew of Flight 305</p>
              <ul>
                {CREW.map((member) => (
                  <li key={member.name}>
                    <div>
                      <strong>{member.name}</strong>
                      <span>{member.role}</span>
                    </div>
                    <Status value={member.status} compact />
                  </li>
                ))}
              </ul>
            </div>
            <p className="ed-pull">
              Then the aircraft took off again, with five people aboard: Cooper, Mucklow, Scott,
              Rataczak, and Anderson.
            </p>
          </div>

          <div className="ed-timeline" aria-label="Ground exchange timeline">
            {GROUND_TIMELINE.map((entry) => (
              <article key={entry.time} className="ed-timeline__item">
                <span className="ed-timeline__time">{entry.time}</span>
                <h4>{entry.title}</h4>
                <p>{entry.detail}</p>
                <Status value={entry.status} compact />
              </article>
            ))}
          </div>

          <div className="ed-flight__close">
            <Prose paragraphs={[GROUND_PROSE.paragraphs[2], GROUND_PROSE.paragraphs[3]]} />
            <div className="ed-margins is-inline">
              {GROUND_PROSE.margin.map((note, index) => (
                <MarginNote key={note} label={index === 0 ? 'Serial numbers' : 'The dummy'}>
                  {note}
                </MarginNote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

import { useState } from 'react';
import { ScrollScene } from './useSceneProgress';
import { TypeField, TypeLayer } from './typography';
import {
  Aircraft,
  Beat,
  BriefcaseDiagram,
  EvidenceArtifact,
  NarrativeBridge,
  ReconstructionLabel,
  RichText,
  Status,
} from './primitives';
import {
  DEMANDS,
  GROUND_PROSE,
  NOTE_PROSE,
  NOTE_TEXT,
  SECOND_FLIGHT_PROSE,
  TIMELINE,
} from './content';
import { useDbc } from './context';

/* -------------------------------------------------------------------------- */
/* 03 — The note                                                              */
/* -------------------------------------------------------------------------- */

export function TheNote() {
  return (
    <>
      <ScrollScene id="dbc-the-note" className="dbc-scene--note" label="The note, the briefcase, and the demands">
        <div className="dbc-note">
          <div className="dbc-note__grain" aria-hidden />

          <TypeField>
            <TypeLayer
              voice="poster"
              size="clamp(7rem, 18vw, 21rem)"
              bottom="6%"
              right="-3vw"
              opacity={0.08}
              animation="sweep"
              bleed
              strokeOnly
              className="dbc-type--outline dbc-type--wide-only"
            >
              $200,000
            </TypeLayer>
            <TypeLayer
              voice="condensed"
              size="0.86rem"
              tracking="0.32em"
              top="18%"
              left="var(--dbc-pad)"
              opacity={0.48}
              animation="track"
              className="dbc-type--vertical dbc-type--steel dbc-type--wide-only"
            >
              DEMAND · AIRCRAFT · FUEL · FOUR PARACHUTES
            </TypeLayer>
          </TypeField>

          <div className="dbc-note__paper" aria-label="Reconstruction of the hijacking note">
            <div className="dbc-note__paper-head">
              <span>RECONSTRUCTION · FELT-TIP CAPITAL LETTERS</span>
              <span>N.W. ORIENT · FLIGHT 305 · SEAT 18C</span>
            </div>
            <p className="dbc-note__hand">{NOTE_TEXT}</p>
            <p className="dbc-note__hand-sign">— DAN COOPER (RECLAIMED THE NOTE)</p>
            <div className="dbc-note__paper-foot">
              <span>Ink on paper · 24 Nov 1971</span>
              <span>Reconstructed from witness interviews [SRC-01]</span>
            </div>
          </div>

          <div className="dbc-note__copy">
            <p className="dbc-kicker">Movement 03 · The note</p>
            <h2>“Miss —”</h2>
            <p className="dbc-lede">{NOTE_PROSE.lede}</p>
            {NOTE_PROSE.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>

          <div className="dbc-note__case">
            <BriefcaseDiagram />
            <p className="dbc-note__case-caption">
              The device was glimpsed briefly by Florence Schaffner and Tina Mucklow and never
              recovered. Whether the eight red cylinders were dynamite or flares remains unknown.
            </p>
          </div>

          <div className="dbc-note__demands">
            <div className="dbc-note__demands-head">
              <p className="dbc-kicker">Teleprinter transmission · Demands 01–06</p>
              <span>Transcribed from the cockpit relay</span>
            </div>
            <ol>
              {DEMANDS.map((demand, index) => (
                <li key={demand.n} style={{ ['--i' as string]: index }}>
                  <span className="dbc-note__demand-no">{demand.n}</span>
                  <div>
                    <p>{demand.text}</p>
                    <small>{demand.note}</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <blockquote className="dbc-note__quote">
            <p>“{NOTE_PROSE.quote.text}”</p>
            <footer>{NOTE_PROSE.quote.attribution} · {NOTE_PROSE.quote.source}</footer>
          </blockquote>

          <div className="dbc-corner">
            <span>MOV 03 · THE NOTE</span>
            <ReconstructionLabel>Reconstructed document &amp; briefcase schematic</ReconstructionLabel>
          </div>
        </div>
      </ScrollScene>

      <NarrativeBridge
        kicker="15:05 → 17:39 PST · HOLDING OVER PUGET SOUND"
        line="While Flight 305 burned fuel in slow circles above the cloud deck, Seattle First National Bank photographed ten thousand twenty-dollar bills."
        code="MOV 03 → MOV 04 · SEATTLE-TACOMA"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 — The ground                                                            */
/* -------------------------------------------------------------------------- */

export function TheGround() {
  return (
    <ScrollScene id="dbc-the-ground" className="dbc-scene--ground" label="The ransom assembled on the ground at Seattle">
      <div className="dbc-ground">
        <div className="dbc-ground__grid" aria-hidden />

        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(7rem, 19vw, 23rem)"
            top="8%"
            right="-3vw"
            opacity={0.08}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            SEA
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="clamp(1rem, 1.5vw, 1.4rem)"
            tracking="0.24em"
            bottom="11%"
            left="var(--dbc-pad)"
            opacity={0.5}
            animation="track"
            className="dbc-type--amber dbc-type--wide-only"
          >
            $200,000 · 10,000 BILLS · 21 POUNDS OF PAPER
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.56rem"
            tracking="0.18em"
            top="26%"
            left="var(--dbc-pad)"
            opacity={0.42}
            animation="rise"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            SEATTLE FIRST NATIONAL BANK · ISSAQUAH SKYPORT
          </TypeLayer>
        </TypeField>

        <div className="dbc-ground__copy">
          <p className="dbc-kicker">Movement 04 · The ground</p>
          <h2>Two hours over Puget Sound</h2>
          <p className="dbc-lede">{GROUND_PROSE.lede}</p>
          {GROUND_PROSE.paragraphs.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        <div className="dbc-ground__clock" aria-hidden>
          <div className="dbc-ground__time">
            <span className="dbc-ground__t1">15:00</span>
            <span className="dbc-ground__t2">16:12</span>
            <span className="dbc-ground__t3">17:39</span>
          </div>
          <p className="dbc-ground__clock-label">PACIFIC STANDARD TIME · 24 NOV 1971</p>
          <div className="dbc-ground__ticks">
            {Array.from({ length: 36 }).map((_, index) => (
              <i key={index} style={{ ['--i' as string]: index }} />
            ))}
          </div>
        </div>

        <div className="dbc-ground__ledger">
          <p className="dbc-kicker">Ground log · reconstructed</p>
          <ul>
            {TIMELINE.slice(0, 5).map((item) => (
              <li key={item.time}>
                <span className="dbc-ground__ledger-time">{item.time}</span>
                <span>{item.title}</span>
                <span className={`dbc-ground__ledger-status ${item.status === 'CONFIRMED' ? 'is-c' : ''}`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
          <p className="dbc-ground__ledger-note">
            Times differ by minutes between the airline record, the FBI summary, and later
            chronologies. The sequence is stable; the clock is not exact.
          </p>
        </div>

        <div className="dbc-ground__manifest">
          <p className="dbc-kicker">The parachute manifest · 4 civilian packs</p>
          <div className="dbc-ground__chute">
            <span>01</span>
            <div>
              <strong>NB-6 Main Back Pack</strong>
              <small>Norman Hayden · Pioneer 26-ft Steerable / Navy Conical</small>
            </div>
          </div>
          <div className="dbc-ground__chute">
            <span>02</span>
            <div>
              <strong>NB-8 Main Back Pack</strong>
              <small>Norman Hayden · Standard 28-ft flat circular canopy</small>
            </div>
          </div>
          <div className="dbc-ground__chute">
            <span>03</span>
            <div>
              <strong>24-ft Chest Reserve</strong>
              <small>Issaquah Skyport · Functional reserve canopy</small>
            </div>
          </div>
          <div className="dbc-ground__chute is-warning">
            <span>04</span>
            <div>
              <strong>Chest Reserve · Training Dummy</strong>
              <small>Canopy sewn shut · non-opening classroom pack</small>
            </div>
          </div>
          <p className="dbc-ground__manifest-note">
            The back-pack harnesses lacked the chest D-rings needed to clip on a reserve. Cooper
            took the sewn-shut dummy pack into the rear cabin anyway. [SRC-08]
          </p>
        </div>

        <div className="dbc-ground__stats">
          {GROUND_PROSE.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.note}</small>
            </div>
          ))}
        </div>

        <div className="dbc-ground__crew">
          <EvidenceArtifact
            assetId="dbc-crew-reno"
            rotate={-1.2}
            treatment="archival"
            stamp="36 PASSENGERS RELEASED · 4 CREW DETAINED"
            code="EXH · CREW-RENO"
            caption="Captain William Scott, First Officer Bob Rataczak, Tina Mucklow, and Flight Engineer H.E. Anderson photographed after landing at Reno."
          />
        </div>

        <div className="dbc-corner">
          <span>MOV 04 · THE GROUND</span>
          <span>Archival photograph · FBI Vault (public domain)</span>
        </div>
      </div>
    </ScrollScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 05 — The second flight                                                     */
/* -------------------------------------------------------------------------- */

export function SecondFlight() {
  const { modulateAudio } = useDbc();

  return (
    <ScrollScene
      id="dbc-second-flight"
      className="dbc-scene--second"
      label="The second takeoff and the flight south"
      onProgress={(p) => modulateAudio('second-flight', p)}
    >
      <div className="dbc-second">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(8rem, 20vw, 24rem)"
            top="10%"
            right="-2vw"
            opacity={0.07}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            10,000
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="0.78rem"
            tracking="0.28em"
            bottom="9%"
            left="var(--dbc-pad)"
            opacity={0.46}
            animation="track"
            className="dbc-type--steel dbc-type--wide-only"
          >
            FIVE ABOARD · UNPRESSURISED · DIRTY CONFIGURATION
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.55rem"
            tracking="0.16em"
            top="29%"
            left="var(--dbc-pad)"
            opacity={0.4}
            animation="rise"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            19:36 PST · V-23 SOUTHBOUND · 200 KNOTS
          </TypeLayer>
        </TypeField>

        <div className="dbc-second__instrument" aria-hidden>
          <div className="dbc-second__alt">
            <span className="dbc-second__alt-label">ALTITUDE CEILING</span>
            <strong>10,000</strong>
            <span className="dbc-second__alt-unit">FT MSL</span>
          </div>
          <div className="dbc-second__tape">
            {Array.from({ length: 14 }).map((_, index) => (
              <i key={index} style={{ ['--i' as string]: index }} />
            ))}
          </div>
          <div className="dbc-second__speed">
            <span>INDICATED AIRSPEED</span>
            <strong>≈ 200</strong>
            <span>KNOTS · 15° FLAPS</span>
          </div>
          <div className="dbc-second__route">
            <svg viewBox="0 0 520 160">
              <path
                d="M30 40 C150 40 210 90 300 96 C390 102 430 120 500 150"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <circle cx="30" cy="40" r="3.5" />
              <circle cx="300" cy="96" r="4" />
              <text x="30" y="28">SEA · 19:36</text>
              <text x="276" y="84">V-23 · ARIEL</text>
              <text x="415" y="142">RENO · 22:15</text>
            </svg>
          </div>
        </div>

        <div className="dbc-second__copy">
          <p className="dbc-kicker">Movement 05 · The second takeoff</p>
          <h2>Five people, one empty cabin</h2>
          <p className="dbc-lede">{SECOND_FLIGHT_PROSE.lede}</p>
          {SECOND_FLIGHT_PROSE.paragraphs.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>

        <div className="dbc-second__beats">
          {SECOND_FLIGHT_PROSE.instruments.map((item, index) => (
            <div className="dbc-second__readout" key={item.label} style={{ ['--i' as string]: index }}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          ))}
        </div>

        <div className="dbc-second__quote">
          <p>“Cooper put on his parachute as though he did so every day.”</p>
          <footer>Tina Mucklow, later interview · reported recollection</footer>
        </div>

        <div className="dbc-corner">
          <span>MOV 05 · THE SECOND TAKEOFF</span>
          <span>Instrument reconstruction · V-23 airway</span>
        </div>
      </div>
    </ScrollScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 06 — The jump                                                              */
/* -------------------------------------------------------------------------- */

export function TheJump() {
  const { modulateAudio } = useDbc();
  const [isBlackout, setIsBlackout] = useState(false);

  return (
    <ScrollScene
      id="dbc-the-jump"
      className={`dbc-scene--jump ${isBlackout ? 'is-jump-blackout' : ''}`}
      label="The jump: a reconstruction of the aft airstair sequence"
      onProgress={(p) => {
        setIsBlackout(p >= 0.68);
        modulateAudio('jump', p);
      }}
    >
      <div className={`dbc-jump ${isBlackout ? 'is-blackout' : ''}`}>
        <div className="dbc-jump__stars" aria-hidden />

        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(9rem, 23vw, 28rem)"
            top="12%"
            right="-3vw"
            opacity={0.09}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            20:13
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.56rem"
            tracking="0.2em"
            leading="2.1"
            bottom="8%"
            left="var(--dbc-pad)"
            opacity={0.42}
            animation="rise"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            WIND · RAIN · −7°C · NO GROUND LIGHTS
          </TypeLayer>
        </TypeField>
        <div className="dbc-jump__cloud dbc-jump__cloud--one" aria-hidden />
        <div className="dbc-jump__cloud dbc-jump__cloud--two" aria-hidden />
        <div className="dbc-jump__cloud dbc-jump__cloud--three" aria-hidden />

        <div className="dbc-jump__aircraft" aria-hidden>
          <Aircraft stairs seat={false} />
          <div className="dbc-jump__figure">
            <span className="dbc-jump__body" />
            <span className="dbc-jump__chute" />
            <span className="dbc-jump__line" />
          </div>
        </div>

        <div className="dbc-jump__copy">
          <p className="dbc-kicker">Movement 06 · The aft stairs</p>
          <h2>Eight o’clock</h2>
          <Beat from={0.02} until={0.3} className="dbc-jump__beat">
            <p className="dbc-jump__time">20:00</p>
            <p>
              A red warning light illuminates on the flight engineer’s panel. The aft airstair has
              been unlatched. Over the intercom, the crew ask whether Cooper needs assistance. His
              last recorded word is: “No!”
            </p>
          </Beat>
          <Beat from={0.3} until={0.58} className="dbc-jump__beat">
            <p className="dbc-jump__time">20:11</p>
            <p>
              Cabin pressure surges as the ventral stair drops into the 200-knot slipstream.
              Rataczak logs the oscillation by radio. Below the Boeing 727 lies a solid cloud deck
              over the Lewis River valley in freezing rain.
            </p>
          </Beat>
          <Beat from={0.58} until={0.82} className="dbc-jump__beat">
            <p className="dbc-jump__time">20:13</p>
            <p>
              The tail kicks upward; the nose pitches down as the aft stairs rebound off the weight
              of a person stepping off the bottom tread. First Officer Rataczak re-trims the
              elevators.
            </p>
          </Beat>
        </div>

        <div className="dbc-jump__question">
          <p className="dbc-kicker">20:13 PST · The limit of observation</p>
          <h2>No human being watched Cooper jump.</h2>
          <p>
            The cockpit door was closed. The two Air National Guard F-106 interceptors trailing the
            727 in the clouds saw nothing visually and tracked no parachute on radar. The only proof
            that he left the aircraft is the upward rebound of the tail at 20:13 and the empty cabin
            at Reno.
          </p>
        </div>

        <div className="dbc-jump__blackout" aria-hidden />

        <div className="dbc-jump__label">
          <span className="dbc-recon-label">Reconstruction</span>
          <span>The figure and the parachute are visual hypotheses, not recorded images.</span>
        </div>

        <div className="dbc-jump__sound">
          <span>{isBlackout ? 'Sound: silence (20:13 blackout)' : 'Sound: slipstream wind → silence'}</span>
          <span>22:15 · Landed Reno, stairs dragging</span>
        </div>

        <div className="dbc-jump__credits">
          <Status value="RECONSTRUCTION" />
          <span>Sequence built from flight-deck timing logs [SRC-01, SRC-04].</span>
        </div>
      </div>
    </ScrollScene>
  );
}

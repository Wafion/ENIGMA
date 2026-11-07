import { useState } from 'react';
import { ScrollScene, FlowScene, HorizontalTrackScene } from './useSceneProgress';
import { TypeField, TypeLayer } from './typography';
import {
  Aircraft,
  EvidenceArtifact,
  NarrativeBridge,
  RichText,
  Status,
} from './primitives';
import {
  AIRCRAFT_FACTS,
  CLOTHING,
  FLIGHT_PROSE,
  MAN_FACTS,
  MAN_PROSE,
  PROLOGUE,
} from './content';
import { DBC_WITNESS_HOTSPOTS } from './composition';
import { useDbc } from './context';

/* -------------------------------------------------------------------------- */
/* 00 — Prologue                                                              */
/* -------------------------------------------------------------------------- */

export function Prologue() {
  return (
    <>
      <ScrollScene id="dbc-prologue" className="dbc-scene--hero" label="Prologue: the man who was not there">
        <div className="dbc-hero">
          <div className="dbc-hero__photo" aria-hidden>
            <img
              src="/assets/db-cooper/images/northwest-727-n467us-1972.jpg"
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="dbc-hero__veil" aria-hidden />
          <div className="dbc-hero__grain" aria-hidden />
          <p className="dbc-hero__year" aria-hidden>1971</p>

          <TypeField className="dbc-tf-hero">
            <TypeLayer
              voice="poster"
              size="clamp(10rem, 28vw, 32rem)"
              top="11%"
              right="-5vw"
              rotate={-6}
              opacity={0.18}
              animation="sweep"
              bleed
              strokeOnly
              parallaxX={90}
              className="dbc-type--outline dbc-type--wide-only"
            >
              305
            </TypeLayer>
            <TypeLayer
              voice="poster"
              size="clamp(4.5rem, 11vw, 13rem)"
              bottom="14%"
              left="-2vw"
              opacity={0.07}
              animation="drift"
              bleed
              parallaxX={-60}
              className="dbc-type--wide-only"
            >
              DAN COOPER
            </TypeLayer>
            <TypeLayer
              voice="condensed"
              size="clamp(0.72rem, 0.95vw, 0.9rem)"
              tracking="0.34em"
              top="22%"
              left="var(--dbc-pad)"
              opacity={0.58}
              animation="track"
              className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
            >
              NOVEMBER 24 · 1971 · THANKSGIVING EVE
            </TypeLayer>
            <TypeLayer
              voice="mono"
              size="0.53rem"
              tracking="0.16em"
              top="calc(3.55rem + 3.4rem)"
              right="var(--dbc-pad)"
              opacity={0.72}
              animation="rise"
              className="dbc-type--wide-only"
            >
              NW 305 · PDX–SEA · FILE NORJAK
            </TypeLayer>
          </TypeField>

          <div className="dbc-hero__top">
            <p className="dbc-hero__case">ENIGMA · CASE 002</p>
            <p className="dbc-hero__class">Declassified federal investigation · NORJAK</p>
            <p className="dbc-hero__coord">45.95° N · 122.57° W</p>
          </div>

          <div className="dbc-hero__collision">
            <div className="dbc-hero__body">
              <p className="dbc-kicker">An interactive documentary in sixteen movements</p>
              <h1 className="dbc-hero__title">
                The Cooper
                <em>File</em>
              </h1>
              <p className="dbc-hero__dek">
                Flight 305, the ransom, and the man who stepped into the dark.
              </p>
              <p className="dbc-hero__text">{PROLOGUE.opening}</p>
              <p className="dbc-hero__text dbc-hero__text--dim">{PROLOGUE.second}</p>
              <div className="dbc-hero__actions">
                <a className="dbc-btn dbc-btn--solid" href="#dbc-the-man">
                  Enter the case
                </a>
                <span className="dbc-hero__note">{PROLOGUE.note}</span>
              </div>
            </div>

            <div className="dbc-hero__artifact">
              <EvidenceArtifact
                assetId="dbc-plane-ticket-1971"
                rotate={-3.2}
                treatment="scan"
                stamp="PDX GATE · $20.00 CASH"
                code="EXH · NW-305-TKT"
                caption="Archival passenger coupon issued to 'Dan Cooper' at Portland International Airport, 24 November 1971."
                priority
              />
            </div>
          </div>

          <div className="dbc-hero__bottom">
            <p>N467US, the Boeing 727-51 of Flight 305 · Miami, December 1972</p>
            <p>Photograph: Clint Groves (GFDL 1.2) · Ticket: FBI Vault (Public Domain)</p>
          </div>

          <a className="dbc-hero__scroll" href="#dbc-the-man">
            <span>Scroll to enter</span>
            <i aria-hidden />
          </a>
        </div>
      </ScrollScene>

      <NarrativeBridge
        kicker="24 NOVEMBER 1971 · 14:35 PST · PORTLAND"
        line="He paid with a twenty-dollar bill at the Northwest Orient counter, carried a black briefcase and a brown paper bag, and walked to Seat 18C."
        code="MOV 00 → MOV 01 · WITNESS COMPOSITE"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 01 — The man                                                               */
/* -------------------------------------------------------------------------- */

export function TheMan() {
  const [activeHotspotId, setActiveHotspotId] = useState<string>(DBC_WITNESS_HOTSPOTS[0].id);
  const { playSfx, openSources } = useDbc();
  const activeHotspot =
    DBC_WITNESS_HOTSPOTS.find((spot) => spot.id === activeHotspotId) ?? DBC_WITNESS_HOTSPOTS[0];

  return (
    <FlowScene id="dbc-the-man" className="dbc-flow--man" label="The man in seat 18C">
      <div className="dbc-wrap dbc-wrap--composed">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(8rem, 19vw, 22rem)"
            top="22rem"
            right="-2rem"
            opacity={0.08}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline-ink dbc-type--wide-only"
          >
            18C
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.59rem"
            tracking="0.17em"
            leading="1.9"
            top="7rem"
            left="-0.4rem"
            opacity={0.62}
            animation="track"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            NO PHOTOGRAPH · NO FINGERPRINTS MATCHED · NO CONFIRMED NAME
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="0.8rem"
            tracking="0.2em"
            bottom="4.5rem"
            right="var(--dbc-pad)"
            opacity={0.45}
            animation="rise"
            className="dbc-type--steel dbc-type--wide-only"
          >
            45.95° N / 122.57° W · SEAT 18C · COMPOSITE RECORD
          </TypeLayer>
        </TypeField>

        <header className="dbc-scene-head dbc-scene-head--ink">
          <p className="dbc-scene-head__num" aria-hidden>01</p>
          <div className="dbc-scene-head__main">
            <p className="dbc-kicker">Movement 01 · The man</p>
            <h2>The Man in Seat 18C</h2>
            <p className="dbc-scene-head__dek">
              What two flight attendants saw, and what a composite sketch cannot hold.
            </p>
          </div>
          <p className="dbc-scene-head__meta">
            Portland, Oregon
            <br />
            24 November 1971
            <br />≈ 2 min
          </p>
        </header>

        <div className="dbc-man">
          <div className="dbc-man__copy">
            <p className="dbc-lede">{MAN_PROSE.lede}</p>
            {MAN_PROSE.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
            <blockquote className="dbc-pull">
              <p>“{MAN_PROSE.quote.text}”</p>
              <footer>
                {MAN_PROSE.quote.attribution}
                <span>{MAN_PROSE.quote.source}</span>
              </footer>
            </blockquote>

            <div className="dbc-man__margins">
              {MAN_PROSE.margin.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>

          <aside className="dbc-man__aside">
            <div className="dbc-man__hotspot-stage">
              <div className="dbc-man__hotspot-head">
                <span>FORENSIC COMPOSITE A · NOV 1971</span>
                <span>SELECT A WITNESS CALLOUT</span>
              </div>
              <div className="dbc-man__hotspot-canvas">
                <img
                  src="/assets/db-cooper/fbi/fbi-composite-a-1971.jpg"
                  alt="FBI composite sketch A of the Flight 305 hijacker, drawn November 1971."
                  loading="eager"
                  decoding="async"
                />
                {DBC_WITNESS_HOTSPOTS.map((spot, idx) => {
                  const isActive = spot.id === activeHotspot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      className={`dbc-hotspot-pin ${isActive ? 'is-active' : ''}`}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      aria-label={`Witness observation: ${spot.label}`}
                      aria-pressed={isActive}
                      onClick={() => {
                        setActiveHotspotId(spot.id);
                        playSfx('tick');
                      }}
                    >
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                    </button>
                  );
                })}
                <p className="dbc-man__stamp" aria-hidden>NO PHOTOGRAPH EXISTS</p>
              </div>

              <div className="dbc-man__hotspot-readout" aria-live="polite">
                <div className="dbc-man__hotspot-meta">
                  <span className="dbc-kicker">{activeHotspot.witness}</span>
                  <button
                    type="button"
                    className="dbc-cite"
                    onClick={() => openSources(activeHotspot.source.split(',')[0].trim())}
                  >
                    [{activeHotspot.source}]
                  </button>
                </div>
                <h3>{activeHotspot.label}</h3>
                <p>{activeHotspot.quote}</p>
              </div>
            </div>

            <div className="dbc-man__sketch-wall">
              <EvidenceArtifact
                assetId="dbc-composite-b-sheet"
                rotate={-1.8}
                treatment="scan"
                stamp="REV. COMPOSITE · 1973"
                code="FBI · SHEET B"
                caption="Complete 1973 FBI Composite B sheet with physical narrative block."
              />
              <EvidenceArtifact
                assetId="dbc-composite-age"
                rotate={2.1}
                treatment="archival"
                stamp="AGE PROGRESSION"
                code="FBI · LAB STUDY"
                caption="Later FBI age-progressed study attempting to project the 1971 composite forward in time."
              />
            </div>

            <p className="dbc-man__note">
              A composite is a memory drawn by a hand. The sketches were produced years apart and
              from witnesses who observed him at different moments. They are evidence of a
              description, not of a face.
            </p>
          </aside>
        </div>

        <div className="dbc-man__data">
          <div className="dbc-man__facts">
            <p className="dbc-kicker">The description on the record</p>
            <dl className="dbc-factgrid">
              {MAN_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                  <Status value={fact.status} />
                </div>
              ))}
            </dl>
            <p className="dbc-man__source-note">
              Source basis: {MAN_FACTS[0].source}. The witnesses did not compare notes before their
              first interviews.
            </p>
          </div>
          <div className="dbc-man__clothing">
            <p className="dbc-kicker">What he wore into the rain</p>
            <ul>
              {CLOTHING.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              The clothes matter because they became part of the forensic puzzle: the clip-on tie
              stayed behind on Seat 18C, and with it microscopic industrial particles and a partial
              DNA profile. The loafers became an argument about whether a man dressed for a city
              street could survive a winter forest landing.
            </p>
          </div>
        </div>

        <div className="dbc-man__next">
          <p className="dbc-kicker">Next · 02</p>
          <a href="#dbc-flight-305">Board Flight 305 →</a>
        </div>
      </div>
    </FlowScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 — Flight 305 (Horizontal Camera Corridor)                               */
/* -------------------------------------------------------------------------- */

export function Flight305() {
  const { modulateAudio } = useDbc();

  return (
    <HorizontalTrackScene
      id="dbc-flight-305"
      className="dbc-scene--flight"
      label="Flight 305: horizontal flight corridor from Portland to Seattle"
      panels={2.7}
      onProgress={(p) => modulateAudio('flight', p)}
    >
      {/* Background atmospheric layer shared across the horizontal corridor */}
      <div className="dbc-flight-corridor">
        <div className="dbc-flight__sky" aria-hidden>
          <span className="dbc-flight__stars" />
          <span className="dbc-flight__aurora" />
        </div>
        <div className="dbc-flight__horizon" aria-hidden />

        {/* Panel 1: Portland Departure & The Machine */}
        <section className="dbc-hpanel dbc-hpanel--machine" aria-label="Panel 1: The Boeing 727-51">
          <TypeField>
            <TypeLayer
              voice="poster"
              size="clamp(8rem, 20vw, 24rem)"
              bottom="4%"
              left="2vw"
              opacity={0.07}
              strokeOnly
              className="dbc-type--outline dbc-type--wide-only"
            >
              727-51
            </TypeLayer>
          </TypeField>

          <div className="dbc-hpanel__top-bar">
            <span>MOVEMENT 02 · FLIGHT 305</span>
            <span>CORRIDOR PANEL 01 / 03 · PORTLAND DEPARTURE (14:50 PST)</span>
            <span>SCROLL TO TRAVEL EAST →</span>
          </div>

          <div className="dbc-hpanel__grid">
            <div className="dbc-hpanel__copy">
              <p className="dbc-kicker">Boeing 727-51 · Registration N467US</p>
              <h2>A thirty-minute hop</h2>
              <p className="dbc-lede">{FLIGHT_PROSE.lede}</p>
              <p>
                <RichText text={FLIGHT_PROSE.paragraphs[0]} />
              </p>
              <dl className="dbc-flight__specs">
                {AIRCRAFT_FACTS.slice(0, 6).map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="dbc-hpanel__visual">
              <div className="dbc-flight__route">
                <svg viewBox="0 0 1200 240" preserveAspectRatio="none">
                  <path
                    d="M20 190 C240 150 420 160 620 120 C820 82 1000 96 1180 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeDasharray="4 7"
                    opacity="0.78"
                  />
                  <circle cx="20" cy="190" r="4" />
                  <circle cx="620" cy="120" r="4.5" />
                  <circle cx="1180" cy="60" r="4" />
                </svg>
                <span className="dbc-flight__place dbc-flight__place--pdx">PDX · 14:50</span>
                <span className="dbc-flight__place dbc-flight__place--sea">SEA · 17:39</span>
              </div>
              <div className="dbc-flight__plane-stage">
                <Aircraft stairs={false} />
              </div>
              <p className="dbc-mono-note">
                Three Pratt &amp; Whitney JT8D turbofans mounted at the tail left the underside of
                the rear fuselage unobstructed.
              </p>
            </div>
          </div>
        </section>

        {/* Panel 2: The Aft Cabin & Seat 18C */}
        <section className="dbc-hpanel dbc-hpanel--cabin" aria-label="Panel 2: Seat 18C and the aft cabin">
          <div className="dbc-hpanel__top-bar">
            <span>VICTOR 23 AIRWAY · 14:55 PST</span>
            <span>CORRIDOR PANEL 02 / 03 · SEAT 18C &amp; AFT CABIN</span>
            <span>36 PASSENGERS · 6 CREW</span>
          </div>

          <div className="dbc-hpanel__grid">
            <div className="dbc-hpanel__visual">
              <div className="dbc-flight__cabin-art">
                <Aircraft stairs seat />
                <div className="dbc-flight__callouts">
                  <span>FLIGHT DECK</span>
                  <span>OVERWING EXIT</span>
                  <span className="is-accent">SEAT 18C · AFT AISLE</span>
                  <span>JUMP SEAT · SCHAFFNER</span>
                </div>
              </div>
              <div className="dbc-hpanel__artifact-row">
                <EvidenceArtifact
                  assetId="dbc-crew-cabin"
                  rotate={-1.5}
                  treatment="halftone"
                  stamp="FBI FILE PHOTO · CABIN"
                  code="EXH · N467US-INT"
                  caption="FBI photograph inside the passenger cabin of the Flight 305 Boeing 727 looking toward the aft section."
                />
              </div>
            </div>

            <div className="dbc-hpanel__copy">
              <p className="dbc-kicker">The rear of the fuselage</p>
              <h2>Six rows from the tail</h2>
              <p>
                Cooper chose Seat 18C, on the aisle near the rear lavatory and galley. Florence
                Schaffner occupied the fold-down flight-attendant jump seat directly behind him.
              </p>
              <p>
                <RichText text={FLIGHT_PROSE.paragraphs[1]} />
              </p>
              <div className="dbc-hpanel__callout-box">
                <span className="dbc-kicker">Margin note</span>
                <p>{FLIGHT_PROSE.margin[0]}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Panel 3: The Ventral Airstair */}
        <section className="dbc-hpanel dbc-hpanel--airstair" aria-label="Panel 3: The ventral airstair">
          <div className="dbc-hpanel__top-bar">
            <span>STRUCTURAL ANOMALY · BOEING 727</span>
            <span>CORRIDOR PANEL 03 / 03 · THE VENTRAL STAIRCASE</span>
            <span>NEXT: THE NOTE ↓</span>
          </div>

          <div className="dbc-hpanel__grid">
            <div className="dbc-hpanel__copy">
              <p className="dbc-kicker">Why it had to be a 727</p>
              <h2>A door in the floor</h2>
              <p>
                Built for regional airports without jetways, the Boeing 727 carried its own ventral
                staircase beneath the tail cone. Because the three engines sat above and around the
                rear fuselage, a person descending those steps in flight would drop clear of the
                jet blast.
              </p>
              <p>{FLIGHT_PROSE.margin[1]}</p>
              <dl className="dbc-flight__specs">
                {AIRCRAFT_FACTS.slice(6).map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="dbc-hpanel__visual">
              <EvidenceArtifact
                assetId="dbc-airstair-1975"
                rotate={1.4}
                treatment="archival"
                stamp="AFT AIRSTAIR DEPLOYED"
                code="EXH · B727-STAIR"
                caption="A Northwest Orient Boeing 727 photographed in 1975 with its rear ventral airstair lowered on the ramp."
              />
            </div>
          </div>
        </section>
      </div>
    </HorizontalTrackScene>
  );
}

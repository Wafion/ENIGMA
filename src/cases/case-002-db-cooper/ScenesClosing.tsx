import { useState } from 'react';
import { FlowScene, ScrollScene } from './useSceneProgress';
import { TypeField, TypeLayer } from './typography';
import {
  EvidenceArtifact,
  NarrativeBridge,
  ReconstructionLabel,
  RichText,
  Status,
} from './primitives';
import { DBMap } from './DBMap';
import { DBC_ASSETS, DBC_ASSET_MAP } from './assets';
import { DBC_SOURCES } from './sources';
import { DBC_MUSIC } from './music';
import {
  EPILOGUE_PROSE,
  LANDSCAPE_PLACES,
  LANDSCAPE_PROSE,
  SUSPECTS,
  SUSPECT_NOTE,
  THEORIES,
  UNKNOWNS,
} from './content';
import { DBC_THEORY_STRESS_MATRIX } from './composition';
import { useDbc } from './context';
import { EnigmaLockup } from '../../components/enigma/EnigmaBrand';

/* -------------------------------------------------------------------------- */
/* 11 — The suspects                                                          */
/* -------------------------------------------------------------------------- */

export function TheSuspects() {
  const [activeId, setActiveId] = useState(SUSPECTS[0].id);
  const { playSfx, openAsset } = useDbc();
  const suspect = SUSPECTS.find((entry) => entry.id === activeId) ?? SUSPECTS[0];
  const portraitAsset = suspect.portraitAssetId ? DBC_ASSET_MAP[suspect.portraitAssetId] : null;

  return (
    <FlowScene id="dbc-the-suspects" className="dbc-flow--suspects" label="The named suspects">
      <div className="dbc-wrap dbc-wrap--composed">
        <TypeField>
          <TypeLayer
            key={suspect.id}
            voice="poster"
            size="clamp(4rem, 11vw, 14rem)"
            top="18rem"
            right="-2rem"
            opacity={0.07}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline-ink dbc-type--wide-only"
          >
            {suspect.name}
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.56rem"
            tracking="0.2em"
            top="6rem"
            left="-0.3rem"
            opacity={0.55}
            animation="track"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            NAMED · ALLEGED · NEVER CHARGED FOR FLIGHT 305
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="0.76rem"
            tracking="0.2em"
            bottom="4rem"
            right="var(--dbc-pad)"
            opacity={0.4}
            animation="rise"
            className="dbc-type--steel dbc-type--wide-only"
          >
            01—06 · THE DISTANCE BETWEEN RESEMBLANCE AND A CASE
          </TypeLayer>
        </TypeField>

        <header className="dbc-scene-head dbc-scene-head--ink">
          <p className="dbc-scene-head__num" aria-hidden>11</p>
          <div className="dbc-scene-head__main">
            <p className="dbc-kicker">Movement 11 · The named</p>
            <h2>The Named</h2>
            <p className="dbc-scene-head__dek">
              Six men, and the distance between a resemblance and a case.
            </p>
          </div>
          <p className="dbc-scene-head__meta">1972–2024<br />Various jurisdictions<br />≈ 3 min</p>
        </header>

        <p className="dbc-suspects__note">{SUSPECT_NOTE}</p>

        <div className="dbc-suspects">
          <ol className="dbc-suspects__index" aria-label="Suspects">
            {SUSPECTS.map((entry, index) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className={entry.id === activeId ? 'is-active' : ''}
                  aria-pressed={entry.id === activeId}
                  onClick={() => {
                    setActiveId(entry.id);
                    playSfx('paper');
                  }}
                >
                  <span className="dbc-suspects__index-no">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <strong>{entry.name}</strong>
                    <small>{entry.badge}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <article className="dbc-suspects__file" aria-live="polite">
            <div className="dbc-suspects__file-top">
              <div>
                <p className="dbc-kicker">{suspect.role}</p>
                <h3>{suspect.name}</h3>
                <p className="dbc-suspects__life">{suspect.life}</p>
              </div>
              <div className="dbc-suspects__badge">
                <Status value={suspect.status} />
                <span>{suspect.badge}</span>
              </div>
            </div>

            {/* Side-by-Side Optical Comparator: 1971 FBI Composite vs Suspect Dossier */}
            <div className="dbc-suspects__comparator" aria-label="Optical comparison with 1971 witness composite">
              <div className="dbc-suspects__comp-card">
                <div className="dbc-suspects__comp-head">
                  <span>1971 WITNESS COMPOSITE</span>
                  <span>TARGET: AGE 45–50</span>
                </div>
                <div className="dbc-suspects__comp-img">
                  <img
                    src="/assets/db-cooper/fbi/fbi-composite-a-1971.jpg"
                    alt="1971 FBI Composite A"
                    loading="lazy"
                  />
                </div>
                <p className="dbc-suspects__comp-meta">
                  5′10″–6′0″ · 170–180 lb · Dark eyes · Olive/swarthy complexion
                </p>
              </div>

              <div className="dbc-suspects__comp-card">
                <div className="dbc-suspects__comp-head">
                  <span>SUBJECT RECORD</span>
                  <span>{suspect.ageIn1971 ?? 'NOV 1971'}</span>
                </div>
                {portraitAsset ? (
                  <div className="dbc-suspects__comp-img">
                    <img
                      src={portraitAsset.path}
                      alt={portraitAsset.description}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="dbc-suspects__comp-inspect"
                      onClick={() => openAsset(portraitAsset.id)}
                    >
                      Inspect archival print ↗
                    </button>
                  </div>
                ) : (
                  <div className="dbc-suspects__comp-placeholder">
                    <span className="dbc-suspects__comp-stamp">NO PUBLIC-DOMAIN PORTRAIT IN FILE</span>
                    <strong>{suspect.name}</strong>
                    <small>{suspect.life}</small>
                    <small>{suspect.ageIn1971}</small>
                  </div>
                )}
                <p className="dbc-suspects__comp-meta">
                  {portraitAsset
                    ? `${portraitAsset.creator} · ${portraitAsset.date} (${portraitAsset.license})`
                    : 'Evaluated from FBI 302 witness comparisons, flight logs, and forensic exclusions.'}
                </p>
              </div>
            </div>

            <div className="dbc-suspects__why">
              <p className="dbc-kicker">Why he became a suspect</p>
              <p>{suspect.why}</p>
            </div>

            <div className="dbc-suspects__grid">
              <div>
                <p className="dbc-kicker">What supports it</p>
                <ul>{suspect.support.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <p className="dbc-kicker">What contradicts it</p>
                <ul>{suspect.contradict.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>

            <div className="dbc-suspects__outcome">
              <p className="dbc-kicker">Outcome</p>
              <p>{suspect.outcome}</p>
            </div>

            <p className="dbc-suspects__source">Source basis: {suspect.source}</p>
          </article>
        </div>

        <div className="dbc-suspects__legend">
          <Status value="REPORTED" /> <span>What a newspaper or researcher reported.</span>
          <Status value="ALLEGED" /> <span>What a person claimed, without physical corroboration.</span>
          <Status value="DOCUMENTED" /> <span>What an official record establishes.</span>
        </div>

        <div className="dbc-next">
          <span>Next · 12</span>
          <a href="#dbc-the-theories">Weigh the explanations →</a>
        </div>
      </div>
    </FlowScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 12 — The theories (Fractured Hypothesis Field + Stress-Test Filter)        */
/* -------------------------------------------------------------------------- */

const STRESS_LABELS: Record<'holds' | 'strained' | 'fractures', string> = {
  holds: 'SURVIVES CONSTRAINT',
  strained: 'STRAINED BY CONSTRAINT',
  fractures: 'FRACTURES UNDER CONSTRAINT',
};

export function TheTheories() {
  const [stressId, setStressId] = useState<string | null>(DBC_THEORY_STRESS_MATRIX[0].id);
  const { playSfx } = useDbc();
  const activeStress = DBC_THEORY_STRESS_MATRIX.find((item) => item.id === stressId) ?? null;

  const getImpact = (theoryId: string): 'holds' | 'strained' | 'fractures' | null => {
    if (!activeStress) return null;
    if (activeStress.survives.includes(theoryId)) return 'holds';
    if (activeStress.strained.includes(theoryId)) return 'strained';
    if (activeStress.fractured.includes(theoryId)) return 'fractures';
    return null;
  };

  return (
    <FlowScene id="dbc-the-theories" className="dbc-flow--theories" label="Competing theories about the disappearance">
      <div className="dbc-wrap dbc-wrap--composed">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(7rem, 18vw, 22rem)"
            top="16rem"
            right="-2rem"
            opacity={0.055}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            THEORY
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="0.72rem"
            tracking="0.3em"
            leading="2.2"
            top="7rem"
            left="-0.3rem"
            opacity={0.5}
            animation="track"
            className="dbc-type--vertical dbc-type--steel dbc-type--wide-only"
          >
            01 SURVIVED · 02 DIED · 03 COVER-UP · 04 UNRESOLVED
          </TypeLayer>
        </TypeField>

        <header className="dbc-scene-head">
          <p className="dbc-scene-head__num" aria-hidden>12</p>
          <div className="dbc-scene-head__main">
            <p className="dbc-kicker">Movement 12 · The theories</p>
            <h2>Four Ways to Disappear</h2>
            <p className="dbc-scene-head__dek">
              What people believe, what supports it, and what the evidence will not carry.
            </p>
          </div>
          <p className="dbc-scene-head__meta">1971–present<br />The case file<br />≈ 3 min</p>
        </header>

        <p className="dbc-theories__intro">
          The theories below are not ranked. A theory is a way of organising the gaps. Test each
          hypothesis against the four physical constraints of the case file below.
        </p>

        {/* Interactive Evidentiary Stress-Test Filter */}
        <div className="dbc-stress" role="region" aria-label="Evidentiary stress-test filter">
          <div className="dbc-stress__bar">
            <span className="dbc-kicker">Stress-test against physical constraint:</span>
            <div className="dbc-stress__buttons">
              {DBC_THEORY_STRESS_MATRIX.map((constraint) => {
                const isOn = constraint.id === stressId;
                return (
                  <button
                    key={constraint.id}
                    type="button"
                    className={`dbc-stress__btn ${isOn ? 'is-active' : ''}`}
                    aria-pressed={isOn}
                    onClick={() => {
                      setStressId(isOn ? null : constraint.id);
                      playSfx('tick');
                    }}
                  >
                    {constraint.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeStress && (
            <div className="dbc-stress__summary" aria-live="polite">
              <div>
                <strong>{activeStress.label}:</strong> {activeStress.fact}
              </div>
              <p>Source basis: {activeStress.source}</p>
            </div>
          )}
        </div>

        <div className="dbc-theories">
          {THEORIES.map((theory) => {
            const impact = getImpact(theory.id);
            return (
              <article
                className={`dbc-theory ${impact ? `is-stress-${impact}` : ''}`}
                key={theory.id}
              >
                {impact && (
                  <div className={`dbc-theory__stress-badge is-${impact}`}>
                    <span>{STRESS_LABELS[impact]}</span>
                  </div>
                )}
                <div className="dbc-theory__head">
                  <span className="dbc-theory__no">{theory.number}</span>
                  <div>
                    <h3>{theory.title}</h3>
                    <p className="dbc-theory__claim">{theory.claim}</p>
                  </div>
                </div>
                <div className="dbc-theory__why">
                  <p className="dbc-kicker">Why people believe it</p>
                  <p>{theory.why}</p>
                </div>
                <div className="dbc-theory__grid">
                  <div>
                    <p className="dbc-kicker">Supports</p>
                    <ul>{theory.support.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <p className="dbc-kicker">Contradicts</p>
                    <ul>{theory.contradict.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <p className="dbc-kicker">Remains unknown</p>
                    <ul>{theory.unknown.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
                <p className="dbc-theory__verdict">
                  <span>Editorial assessment</span>
                  {theory.verdict}
                </p>
              </article>
            );
          })}
        </div>

        <div className="dbc-next">
          <span>Next · 13</span>
          <a href="#dbc-the-landscape">Walk the ground →</a>
        </div>
      </div>
    </FlowScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 13 — The landscape (Full-Bleed Single-Image Moment + Cartography)          */
/* -------------------------------------------------------------------------- */

export function TheLandscape() {
  return (
    <FlowScene id="dbc-the-landscape" className="dbc-flow--landscape" label="The landscape of the drop zone">
      {/* Full-Bleed Single-Image Moment (Section 16 Archetype) */}
      <div className="dbc-landscape-bleed">
        <div className="dbc-landscape-bleed__media">
          <img
            src="/assets/db-cooper/images/lake-merwin-aerial.jpg"
            alt="Aerial view across Lake Merwin and the forested ridges of the Lewis River valley in southwestern Washington."
            loading="lazy"
            decoding="async"
          />
          <div className="dbc-landscape-bleed__veil" aria-hidden />
        </div>
        <div className="dbc-landscape-bleed__overlay">
          <p className="dbc-kicker">Movement 13 · Full-Bleed Reconnaissance</p>
          <h2>Lake Merwin &amp; the Lewis River Drainage</h2>
          <p>
            45.95° N · 122.57° W — Steep Douglas-fir ridges, logging cuts, and three hydroelectric
            reservoirs along the Clark–Cowlitz county line. Under low cloud at 20:13 PST on
            24 November 1971, there were no town lights below the aircraft.
          </p>
          <span className="dbc-landscape-bleed__credit">
            Photograph: Lake Merwin aerial view · Public domain (U.S. Army Corps of Engineers / Wikimedia Commons)
          </span>
        </div>
      </div>

      <div className="dbc-wrap dbc-wrap--composed">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(6rem, 17vw, 20rem)"
            top="12rem"
            left="-2rem"
            opacity={0.06}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            WASHOUGAL
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.56rem"
            tracking="0.18em"
            top="6rem"
            right="0.2rem"
            opacity={0.48}
            animation="track"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            45.95° N · 122.57° W · LEWIS RIVER DRAINAGE
          </TypeLayer>
        </TypeField>

        <header className="dbc-scene-head">
          <p className="dbc-scene-head__num" aria-hidden>13</p>
          <div className="dbc-scene-head__main">
            <p className="dbc-kicker">Movement 13 · The landscape</p>
            <h2>The Ground Below</h2>
            <p className="dbc-scene-head__dek">
              A drop zone, a drainage, and twenty miles of river.
            </p>
          </div>
          <p className="dbc-scene-head__meta">45.95° N · 122.57° W<br />Lewis River country<br />≈ 2 min</p>
        </header>

        <div className="dbc-landscape__body">
          <p className="dbc-lede">{LANDSCAPE_PROSE.lede}</p>
          <div className="dbc-landscape__prose">
            {LANDSCAPE_PROSE.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        </div>

        <DBMap mode="landscape" />

        <div className="dbc-landscape__places">
          <p className="dbc-kicker">Places in the file</p>
          <ul>
            {LANDSCAPE_PLACES.map((place) => (
              <li key={place.id}>
                <span className="dbc-landscape__code">{place.code}</span>
                <strong>{place.name}</strong>
                <span>{place.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="dbc-landscape__section">
          <p className="dbc-kicker">Cross-section · schematic</p>
          <h3>From ocean to ridge</h3>
          <svg viewBox="0 0 1000 260" role="img" aria-label="Schematic cross-section from the Pacific coast across the Coast Range, the Columbia River, and toward the Cascade Range.">
            <path d="M0 180 C90 176 130 120 200 110 C270 100 300 150 360 156 C430 162 470 150 520 158 C570 166 610 120 690 96 C770 72 830 110 900 70 C940 48 970 52 1000 44" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M0 180 C90 176 130 120 200 110 C270 100 300 150 360 156 C430 162 470 150 520 158 C570 166 610 120 690 96 C770 72 830 110 900 70 C940 48 970 52 1000 44 L1000 260 L0 260 Z" fill="currentColor" opacity="0.07" />
            <line x1="480" y1="60" x2="480" y2="230" stroke="var(--dbc-amber)" strokeWidth="1" strokeDasharray="4 5" />
            <circle cx="480" cy="156" r="5" fill="var(--dbc-amber)" />
            <text x="492" y="150" fontSize="11">ESTIMATED DROP ZONE</text>
            <text x="24" y="206" fontSize="10">PACIFIC OCEAN</text>
            <text x="180" y="92" fontSize="10">COAST RANGE</text>
            <text x="510" y="186" fontSize="10">COLUMBIA / LEWIS</text>
            <text x="854" y="56" fontSize="10">CASCADES</text>
            <text x="24" y="238" fontSize="9" opacity="0.6">WEST</text>
            <text x="944" y="238" fontSize="9" opacity="0.6">EAST</text>
          </svg>
          <p className="dbc-landscape__note">
            Vertical scale exaggerated. The point is not elevation; it is how many kinds of ground
            a person could land in within a few miles.
          </p>
        </div>

        <div className="dbc-next">
          <span>Next · 14</span>
          <a href="#dbc-the-unknowns">Reach the limit →</a>
        </div>
      </div>
    </FlowScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 14 — The unknowns                                                          */
/* -------------------------------------------------------------------------- */

export function TheUnknowns() {
  return (
    <ScrollScene id="dbc-the-unknowns" className="dbc-scene--unknowns" label="What remains unknown">
      <div className="dbc-unknowns">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(12rem, 30vw, 38rem)"
            top="8%"
            right="-1vw"
            opacity={0.06}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            ?
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.56rem"
            tracking="0.22em"
            bottom="7%"
            left="var(--dbc-pad)"
            opacity={0.4}
            animation="rise"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            UNRESOLVED · SIX QUESTIONS · NO SEVENTH ANSWER
          </TypeLayer>
        </TypeField>
        <div className="dbc-unknowns__head">
          <p className="dbc-kicker">Movement 14 · The unknowns</p>
          <p className="dbc-unknowns__note">Sparse by design. One question at a time.</p>
        </div>

        {UNKNOWNS.map((item, index) => (
          <article
            className="dbc-unknown"
            key={item.n}
            style={{
              ['--from' as string]: 0.03 + index * 0.152,
              ['--to' as string]: 0.03 + index * 0.152 + 0.16,
              ['--i' as string]: index,
            }}
          >
            <span className="dbc-unknown__n">{item.n}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}

        <div className="dbc-unknowns__end">
          <p>Six questions. No seventh answer.</p>
          <span>Scroll to the epilogue</span>
        </div>

        <div className="dbc-unknowns__rule" aria-hidden />
      </div>
    </ScrollScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 15 — Epilogue                                                              */
/* -------------------------------------------------------------------------- */

export function TheEpilogue() {
  return (
    <>
      <NarrativeBridge
        kicker="1972 FAA AIRWORTHINESS DIRECTIVE · THE MECHANICAL LEGACY"
        line="The man vanished without leaving a name. Instead, his alias was bolted onto the underside of every Boeing 727 in commercial service."
        code="MOV 14 → MOV 15 · THE COOPER VANE"
      />

      <FlowScene id="dbc-epilogue" className="dbc-flow--epilogue" label="Epilogue">
        <div className="dbc-wrap dbc-wrap--narrow dbc-wrap--composed">
          <TypeField>
            <TypeLayer
              voice="poster"
              size="clamp(7rem, 18vw, 21rem)"
              top="4rem"
              right="-2rem"
              opacity={0.05}
              animation="sweep"
              bleed
              strokeOnly
              className="dbc-type--outline dbc-type--wide-only"
            >
              1971
            </TypeLayer>
            <TypeLayer
              voice="condensed"
              size="0.72rem"
              tracking="0.28em"
              bottom="8rem"
              left="-0.2rem"
              opacity={0.4}
              animation="track"
              className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
            >
              THE FILE REMAINS OPEN
            </TypeLayer>
          </TypeField>

          <header className="dbc-epilogue__head">
            <p className="dbc-kicker">Movement 15 · Epilogue</p>
            <h2>The case that stayed open</h2>
            <p className="dbc-epilogue__lede">{EPILOGUE_PROSE.lede}</p>
          </header>

          <div className="dbc-epilogue__body">
            {EPILOGUE_PROSE.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="dbc-epilogue__line">The case file has a page missing.</p>

          <div className="dbc-epilogue__objects">
            <EvidenceArtifact
              assetId="dbc-cooper-vane"
              rotate={-1.3}
              treatment="archival"
              stamp="FAA MANDATE · 1972"
              code="EXH · COOPER-VANE"
              caption="The 'Cooper vane' mounted beside a Boeing 727 ventral airstair. Aerodynamic airflow turns the wedge in flight, physically blocking the door from lowering."
            />
            <EvidenceArtifact
              assetId="dbc-boeing-727-n467us"
              rotate={1.1}
              treatment="archival"
              stamp="N467US · MIAMI 1972"
              code="EXH · N467US"
              caption="N467US photographed at Miami in December 1972. The aircraft survived; the passenger in Seat 18C did not become a person."
            />
          </div>

          <div className="dbc-epilogue__credits">
            <div>
              <p className="dbc-kicker">Case 002</p>
              <p>The Cooper File</p>
              <p className="dbc-epilogue__small">
                An ENIGMA investigative documentary. Research, writing, spatial composition, and
                forensic reconstruction by ENIGMA. All archival material and music are attributed in
                the register.
              </p>
            </div>
            <div>
              <p className="dbc-kicker">Editorial position</p>
              <p className="dbc-epilogue__small">
                This documentary does not identify the hijacker. It treats the absence of a
                definitive answer as the finding, not as a failure of nerve.
              </p>
            </div>
            <div>
              <p className="dbc-kicker">Continue</p>
              <a href="#dbc-sources">Open the register →</a>
              <a href="#dbc-prologue">Return to the beginning →</a>
              <a href="/#catalogue">All cases →</a>
            </div>
          </div>

          <footer className="dbc-epilogue__footer">
            <a href="/" aria-label="ENIGMA, home">
              <EnigmaLockup className="enigma-closing-lockup" />
            </a>
            <span>ENIGMA · MMXXVI</span>
            <span>Sound optional · Reconstructions labelled · Sources traceable</span>
          </footer>
        </div>
      </FlowScene>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 16 — Sources                                                               */
/* -------------------------------------------------------------------------- */

export function TheSources() {
  return (
    <FlowScene id="dbc-sources" className="dbc-flow--sources" label="Sources and asset register">
      <div className="dbc-wrap dbc-wrap--composed">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(7rem, 19vw, 23rem)"
            top="10rem"
            right="-2rem"
            opacity={0.05}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline-ink dbc-type--wide-only"
          >
            REGISTER
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.55rem"
            tracking="0.2em"
            top="5rem"
            left="-0.3rem"
            opacity={0.5}
            animation="track"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            SOURCES · ASSETS · MUSIC · METHOD
          </TypeLayer>
        </TypeField>
        <header className="dbc-scene-head dbc-scene-head--ink">
          <p className="dbc-scene-head__num" aria-hidden>16</p>
          <div className="dbc-scene-head__main">
            <p className="dbc-kicker">Movement 16 · The register</p>
            <h2>Sources</h2>
            <p className="dbc-scene-head__dek">
              Every record, report, musical cue, and archival image used in this documentary, with
              its limits stated.
            </p>
          </div>
          <p className="dbc-scene-head__meta">Research register<br />Accessed 2026<br />≈ 2 min</p>
        </header>

        <p className="dbc-sources__method">
          Primary records were preferred. Secondary sources are used for orientation or to report a
          claim that is attributed in the text. Where sources disagree — the number of passengers,
          the exact minute of the jump, the total recovered in 1980 — the disagreement is preserved
          rather than resolved by assertion.
        </p>

        <ol className="dbc-sources__list">
          {DBC_SOURCES.map((source) => (
            <li key={source.code}>
              <div className="dbc-sources__top">
                <span className="dbc-sources__code">{source.code}</span>
                <span>{source.category}</span>
              </div>
              <h3>{source.title}</h3>
              <p className="dbc-sources__byline">
                {source.author ? `${source.author} · ` : ''}{source.publisher} · {source.date}
              </p>
              <p><strong>Used for:</strong> {source.obtained}</p>
              {source.caveat && <p><strong>Limit:</strong> {source.caveat}</p>}
              <a className="dbc-text-btn" href={source.url} target="_blank" rel="noreferrer">
                Open original source ↗
              </a>
            </li>
          ))}
        </ol>

        <div className="dbc-sources__music">
          <p className="dbc-kicker">Music · licensed documentary score</p>
          <p className="dbc-sources__music-intro">
            Documentary score by LEMMiNO (licensed under Creative Commons Attribution-ShareAlike 4.0
            International, CC BY-SA 4.0) and Scott Buckley (licensed under Creative Commons
            Attribution 4.0 International, CC BY 4.0). The score is carried across movements rather
            than restarted at every chapter; tracks are looped, crossfaded, and mixed beneath the
            procedural wind and cabin drone. Entries marked Reserve are licensed material held
            outside the current cut. Each entry provides the full credit and link to the original
            release and licence.
          </p>
          <ol>
            {DBC_MUSIC.map((track) => (
              <li key={track.id}>
                <div className="dbc-sources__music-head">
                  <h3>{track.title}</h3>
                  <span>{track.license}</span>
                </div>
                <p className="dbc-sources__byline">{track.artist} · {track.date} · {track.usage}</p>
                <p className="dbc-sources__music-credit">{track.attributionText}</p>
                <div className="dbc-sources__music-links">
                  <a className="dbc-text-btn" href={track.sourceUrl} target="_blank" rel="noreferrer">
                    Original track ↗
                  </a>
                  <a className="dbc-text-btn" href={track.licenseUrl} target="_blank" rel="noreferrer">
                    Licence ↗
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="dbc-sources__assets">
          <p className="dbc-kicker">Asset provenance ({DBC_ASSETS.length} verified items)</p>
          <div>
            {DBC_ASSETS.map((asset) => (
              <article key={asset.id}>
                <div className="dbc-sources__asset-media">
                  <img src={asset.path} alt={asset.description} loading="lazy" />
                </div>
                <div>
                  <p className="dbc-sources__asset-status">{asset.status}</p>
                  <h3>{asset.title}</h3>
                  <p>{asset.creator} · {asset.date} · {asset.license}</p>
                  {asset.sourceUrl && (
                    <a className="dbc-text-btn" href={asset.sourceUrl} target="_blank" rel="noreferrer">
                      File record ↗
                    </a>
                  )}
                  {asset.licenseUrl && (
                    <a className="dbc-text-btn" href={asset.licenseUrl} target="_blank" rel="noreferrer">
                      Licence ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="dbc-sources__colophon">
          <ReconstructionLabel>Method note</ReconstructionLabel>
          <p>
            All diagrams, aircraft elevations, maps, and reconstructed objects are project originals.
            They are drawn to convey documented relationships, not to imitate archival photographs.
            Every use is labelled at the point of display.
          </p>
        </div>
      </div>
    </FlowScene>
  );
}

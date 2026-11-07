import { useState } from 'react';
import { FlowScene } from './useSceneProgress';
import { TypeField, TypeLayer } from './typography';
import {
  EvidenceArtifact,
  NarrativeBridge,
  RichText,
  Status,
} from './primitives';
import { DBMap } from './DBMap';
import {
  EVIDENCE,
  MONEY_PROSE,
  SEARCH_PROSE,
  ARCHIVE_PROSE,
} from './content';
import type { EvidenceItem } from './content';
import { DBC_ASSET_MAP } from './assets';
import { useDbc } from './context';

/* -------------------------------------------------------------------------- */
/* 07 — The search                                                            */
/* -------------------------------------------------------------------------- */

const SEARCH_LOG = [
  { date: 'NOV 1971', title: 'First ground search', body: 'Agents and local deputies work logging roads and clearings beneath the calculated flight path in freezing rain. No trace.' },
  { date: 'MAR 1972', title: '18 days · Clark and Cowlitz', body: 'About 200 soldiers from Fort Lewis join FBI agents, Air Force personnel, National Guardsmen, and civilian volunteers.' },
  { date: 'APR 1972', title: '18 more days after thaw', body: 'A second line-abreast sweep across the Lewis River watershed after snowmelt. The forest yields no parachute, body, or ransom.' },
  { date: 'FEB 1980', title: 'Tina Bar discovery', body: 'Eight-year-old Brian Ingram uncovers three rotting bundles of ransom twenties in Columbia River sand nine miles downstream of Vancouver.' },
  { date: 'JUL 2016', title: 'Active investigation suspended', body: 'After 45 years and 60 volumes of case files, the FBI redirects investigative resources while preserving physical exhibits.' },
];

export function TheSearch() {
  return (
    <>
      <FlowScene id="dbc-the-search" className="dbc-flow--search" label="The search of the Lewis River country">
        <div className="dbc-wrap dbc-wrap--composed">
          <TypeField>
            <TypeLayer
              voice="poster"
              size="clamp(8rem, 22vw, 26rem)"
              top="14rem"
              right="-2rem"
              opacity={0.07}
              animation="sweep"
              bleed
              strokeOnly
              className="dbc-type--outline dbc-type--wide-only"
            >
              SEARCH
            </TypeLayer>
            <TypeLayer
              voice="mono"
              size="0.56rem"
              tracking="0.18em"
              top="6rem"
              left="-0.3rem"
              opacity={0.6}
              animation="track"
              className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
            >
              CLARK COUNTY · COWLITZ COUNTY · LEWIS RIVER DRAINAGE
            </TypeLayer>
            <TypeLayer
              voice="condensed"
              size="0.78rem"
              tracking="0.2em"
              bottom="4rem"
              right="var(--dbc-pad)"
              opacity={0.42}
              animation="rise"
              className="dbc-type--steel dbc-type--wide-only"
            >
              36 DAYS · 200 SOLDIERS · ZERO TRACE IN THE DROP ZONE
            </TypeLayer>
          </TypeField>

          <header className="dbc-scene-head">
            <p className="dbc-scene-head__num" aria-hidden>07</p>
            <div className="dbc-scene-head__main">
              <p className="dbc-kicker">Movement 07 · The search</p>
              <h2>The Search</h2>
              <p className="dbc-scene-head__dek">
                Two hundred soldiers, thirty-six days, and a forest that kept its evidence.
              </p>
            </div>
            <p className="dbc-scene-head__meta">Clark &amp; Cowlitz Counties<br />1971–1972<br />≈ 3 min</p>
          </header>

          <div className="dbc-search__lede">
            <p className="dbc-lede">{SEARCH_PROSE.lede}</p>
            <div className="dbc-search__stats">
              {SEARCH_PROSE.stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <small>{stat.note}</small>
                </div>
              ))}
            </div>
          </div>

          <DBMap mode="search" />

          <div className="dbc-search__body">
            <div className="dbc-search__prose">
              {SEARCH_PROSE.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
            <aside className="dbc-search__aside">
              <p className="dbc-kicker">Why the map is a shape, not a pin</p>
              <p>
                The drop zone was calculated after the fact from heading, speed, wind vectors, and
                the 20:13 elevator trim change. It describes a probability ellipse over rugged timber
                and reservoirs, not a confirmed landing point.
              </p>
              {SEARCH_PROSE.margin.map((note) => (
                <p key={note}>{note}</p>
              ))}
              <p className="dbc-mono-note">
                <Status value="RECONSTRUCTION" /> Map geometry from public boundary data.
              </p>
            </aside>
          </div>

          <ol className="dbc-search__log">
            {SEARCH_LOG.map((item) => (
              <li key={item.date}>
                <span className="dbc-search__log-date">{item.date}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="dbc-next">
            <span>Next · 08</span>
            <a href="#dbc-the-money">Follow the money →</a>
          </div>
        </div>
      </FlowScene>

      <NarrativeBridge
        kicker="10 FEBRUARY 1980 · NINE YEARS AFTER FLIGHT 305"
        line="Nothing from the aircraft was found in the drop zone. Then an eight-year-old boy scraping a fire pit in the sand at Tina Bar uncovered three bundles of twenty-dollar bills."
        code="MOV 07 → MOV 08 · COLUMBIA RIVER MILE 96"
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 08 — The money                                                             */
/* -------------------------------------------------------------------------- */

const SERIALS = [
  'L #### #### A · SERIES 1969',
  'L #### #### B · SERIES 1963A',
  'L #### #### C · FEDERAL RESERVE SAN FRANCISCO',
  'L #### #### D · MICROFILMED BY SEATTLE-FIRST NATL',
  'L #### #### E · MATCHED AT TINA BAR (1980)',
  'L #### #### F · 9,710 BILLS NEVER CIRCULATED',
];

export function TheMoney() {
  return (
    <FlowScene id="dbc-the-money" className="dbc-flow--money" label="The money at Tina Bar">
      <div className="dbc-wrap dbc-wrap--composed">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(8rem, 18vw, 22rem)"
            top="18rem"
            right="-2rem"
            opacity={0.07}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline-ink dbc-type--wide-only"
          >
            $5,800
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="0.82rem"
            tracking="0.3em"
            top="7rem"
            left="-0.3rem"
            opacity={0.55}
            animation="track"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            SERIAL NUMBERS · TINA BAR · COLUMBIA RIVER
          </TypeLayer>
        </TypeField>

        <header className="dbc-scene-head dbc-scene-head--ink">
          <p className="dbc-scene-head__num" aria-hidden>08</p>
          <div className="dbc-scene-head__main">
            <p className="dbc-kicker">Movement 08 · The money</p>
            <h2>The Money at Tina Bar</h2>
            <p className="dbc-scene-head__dek">
              Ten thousand twenties, three rotting packets, one river.
            </p>
          </div>
          <p className="dbc-scene-head__meta">Columbia River<br />10 February 1980<br />≈ 3 min</p>
        </header>

        {/* Visual Proportion Scale contrasting 2.9% recovered vs 97.1% vanished */}
        <div className="dbc-money__scale-bar" aria-label="Proportion of ransom recovered versus unrecovered">
          <div className="dbc-money__scale-head">
            <span>RECOVERED AT TINA BAR: $5,800 (290 BILLS · 2.9%)</span>
            <span>NEVER FOUND IN CIRCULATION: $194,200 (9,710 BILLS · 97.1%)</span>
          </div>
          <div className="dbc-money__scale-track" aria-hidden>
            <span className="dbc-money__scale-found" style={{ width: '2.9%' }} />
            <span className="dbc-money__scale-missing" />
          </div>
        </div>

        <div className="dbc-money__hero">
          <div className="dbc-money__figure">
            <p className="dbc-money__label">PHYSICAL EVIDENCE · RECOVERED 10 FEB 1980</p>
            <p className="dbc-money__amount">$5,800</p>
            <p className="dbc-money__sub">290 twenty-dollar bills · fused in three rubber-banded packets</p>
            <div className="dbc-money__artifacts-pair">
              <EvidenceArtifact
                assetId="dbc-tina-bar-money-1980"
                rotate={-1.4}
                treatment="archival"
                stamp="FBI LAB · TINA BAR"
                code="EXH · E-05-PHOTO"
                caption="FBI evidence photograph of the fragmented $20 ransom bills recovered by Brian Ingram at Tina Bar in February 1980."
              />
              <EvidenceArtifact
                assetId="dbc-recon-money"
                rotate={1.5}
                treatment="none"
                stamp="PACKET GEOMETRY"
                code="DIAG · 3 BUNDLES"
                caption="Structural diagram showing how the outer edges eroded in sand while the interior bill faces remained legible."
              />
            </div>
          </div>

          <div className="dbc-money__serial">
            <p className="dbc-kicker">Microfilmed serial registry · 34 pages</p>
            <ul aria-label="Serial number registry protocol">
              {SERIALS.map((serial) => (
                <li key={serial}>{serial}</li>
              ))}
            </ul>
            <p>
              Seattle First National Bank microfilmed every note before the canvas bag was driven to
              Sea-Tac. Nine years later, FBI laboratory technicians peeled apart the fused fragments
              from Tina Bar and matched every legible serial number to the Flight 305 ransom list.
            </p>
            <p className="dbc-mono-note">
              Not a single one of the remaining 9,710 bills has ever surfaced at a Federal Reserve
              bank, casino, or commercial teller anywhere in the world. [SRC-03]
            </p>
          </div>
        </div>

        <div className="dbc-money__body">
          <div className="dbc-money__prose">
            <p className="dbc-lede">{MONEY_PROSE.lede}</p>
            {MONEY_PROSE.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          <div className="dbc-money__stats">
            {MONEY_PROSE.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <small>{stat.note}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="dbc-money__river">
          <p className="dbc-kicker">Watershed paradox · Drop zone to Tina Bar</p>
          <svg viewBox="0 0 1000 220" role="img" aria-label="Diagram of the Columbia River and Lewis River, showing Ariel about twenty miles from Tina Bar.">
            <path d="M40 120 C220 100 320 150 470 140 C620 130 760 100 960 118" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M470 140 C480 100 500 70 520 44" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 4" />
            <circle cx="520" cy="44" r="5" fill="var(--dbc-amber)" />
            <text x="530" y="38" fontSize="12">ARIEL / DROP ZONE</text>
            <circle cx="620" cy="132" r="4" fill="currentColor" />
            <text x="632" y="126" fontSize="12">LEWIS RIVER CONFLUENCE</text>
            <circle cx="760" cy="112" r="5" fill="var(--dbc-amber)" />
            <text x="772" y="106" fontSize="12">TINA BAR (UPSTREAM OF CONFLUENCE)</text>
            <path d="M790 150 L900 150" stroke="currentColor" strokeWidth="0.8" />
            <text x="790" y="168" fontSize="10">≈ 20 MILES FROM ARIEL</text>
            <text x="44" y="148" fontSize="10">COLUMBIA RIVER · FLOWS WEST ←</text>
          </svg>
          <p className="dbc-money__river-note">
            The Lewis River enters the Columbia downstream of Tina Bar. For natural river transport
            alone to carry the bundles from the Ariel drop zone to Tina Bar, the money would have
            had to enter a tributary upstream of Vancouver — such as the Washougal watershed — or
            be moved by Dredge spoil / human action.
          </p>
        </div>

        <div className="dbc-money__interpretations">
          <p className="dbc-kicker">Three readings of the same find</p>
          <div>
            {MONEY_PROSE.interpretations.map((item) => (
              <article key={item.title}>
                <Status value={item.status} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <p className="dbc-mono-note">
            The 2020 spring-diatom study narrows when the bills were submerged (May–June), not how
            they reached the beach. [SRC-10]
          </p>
        </div>

        <div className="dbc-next">
          <span>Next · 09</span>
          <a href="#dbc-the-evidence">Examine what came back →</a>
        </div>
      </div>
    </FlowScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 09 — The evidence                                                          */
/* -------------------------------------------------------------------------- */

export function TheEvidence() {
  const [selected, setSelected] = useState<EvidenceItem['id']>('tie');
  const { openAsset, playSfx } = useDbc();
  const item = EVIDENCE.find((entry) => entry.id === selected) ?? EVIDENCE[0];
  const activeAsset = item.assetId ? DBC_ASSET_MAP[item.assetId] : DBC_ASSET_MAP['dbc-recon-tie'];

  return (
    <FlowScene id="dbc-the-evidence" className="dbc-flow--evidence" label="The evidence field">
      <div className="dbc-wrap dbc-wrap--composed">
        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(7rem, 16vw, 19rem)"
            top="17rem"
            left="-1.5rem"
            opacity={0.06}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            FOUND
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="0.8rem"
            tracking="0.28em"
            bottom="5rem"
            right="var(--dbc-pad)"
            opacity={0.42}
            animation="track"
            className="dbc-type--steel dbc-type--wide-only"
          >
            E-01 → E-06 · PHYSICAL CUSTODY CHAIN
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.54rem"
            tracking="0.16em"
            top="7rem"
            right="0.4rem"
            opacity={0.45}
            animation="rise"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            FBI LABORATORY · QUANTICO / WASHINGTON D.C.
          </TypeLayer>
        </TypeField>

        <header className="dbc-scene-head">
          <p className="dbc-scene-head__num" aria-hidden>09</p>
          <div className="dbc-scene-head__main">
            <p className="dbc-kicker">Movement 09 · The evidence</p>
            <h2>What Came Back</h2>
            <p className="dbc-scene-head__dek">
              A clip-on tie, a reserve canopy, sixty-six latent prints, a boarding coupon, and three
              packets of wet twenties. Select an exhibit.
            </p>
          </div>
          <p className="dbc-scene-head__meta">FBI Laboratory<br />1971–2020<br />≈ 3 min</p>
        </header>

        <div className="dbc-evidence">
          <div className="dbc-evidence__field" role="group" aria-label="Select an item of evidence">
            <svg className="dbc-evidence__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {EVIDENCE.map((entry) => (
                <line
                  key={entry.id}
                  x1="50"
                  y1="42"
                  x2={entry.x}
                  y2={entry.y}
                  className={entry.id === selected ? 'is-active' : ''}
                />
              ))}
            </svg>

            <div className="dbc-evidence__centre">
              <p className="dbc-kicker">Selected Exhibit · {item.number}</p>
              <div className="dbc-evidence__tie">
                {activeAsset ? (
                  <img
                    src={activeAsset.path}
                    alt={activeAsset.description}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <img
                    src="/assets/db-cooper/reconstructions/tie.svg"
                    alt="Reconstruction of the black clip-on tie worn by the hijacker."
                    loading="lazy"
                  />
                )}
              </div>
              <p className="dbc-evidence__centre-label">{item.title.toUpperCase()} · {item.number}</p>
              {activeAsset && (
                <button
                  type="button"
                  className="dbc-text-btn"
                  onClick={() => openAsset(activeAsset.id)}
                >
                  Inspect full exhibit ↗
                </button>
              )}
            </div>

            {EVIDENCE.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`dbc-evidence__node ${entry.id === selected ? 'is-active' : ''}`}
                style={{ ['--x' as string]: `${entry.x}%`, ['--y' as string]: `${entry.y}%` }}
                aria-pressed={entry.id === selected}
                onClick={() => {
                  setSelected(entry.id);
                  playSfx('tick');
                }}
              >
                <span className="dbc-evidence__node-no">{entry.number}</span>
                <span className="dbc-evidence__node-title">{entry.title}</span>
                <span className="dbc-evidence__node-sub">{entry.subtitle}</span>
              </button>
            ))}
            <p className="dbc-evidence__hint">
              Select any forensic node (`E-01` through `E-06`) to load its laboratory custody record
              and limitations.
            </p>
          </div>

          <article className="dbc-evidence__detail" aria-live="polite">
            <div className="dbc-evidence__detail-top">
              <span>{item.number}</span>
              <Status value={item.status} />
            </div>
            <h3>{item.title}</h3>
            <p className="dbc-evidence__detail-sub">{item.subtitle}</p>
            <p className="dbc-evidence__detail-summary">{item.summary}</p>
            <div className="dbc-evidence__detail-grid">
              <div>
                <p className="dbc-kicker">What the record shows</p>
                <ul>{item.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              </div>
              <div>
                <p className="dbc-kicker">What it cannot tell us</p>
                <ul>{item.limits.map((limit) => <li key={limit}>{limit}</li>)}</ul>
              </div>
            </div>
            <p className="dbc-evidence__source">Source basis: {item.source}</p>
          </article>
        </div>

        <div className="dbc-next">
          <span>Next · 10</span>
          <a href="#dbc-the-archive">Enter the NORJAK archive →</a>
        </div>
      </div>
    </FlowScene>
  );
}

/* -------------------------------------------------------------------------- */
/* 10 — The archive (Wall Composition)                                        */
/* -------------------------------------------------------------------------- */

const WALL_EXHIBITS = [
  { assetId: 'dbc-wanted-poster', rotate: -2.2, stamp: 'WANTED FLYER · 1971', code: 'NORJAK · VOL 01', treatment: 'scan' as const },
  { assetId: 'dbc-plane-ticket-1971', rotate: 1.8, stamp: 'GATE RECEIPT · PDX', code: 'NORJAK · EXH 04', treatment: 'scan' as const },
  { assetId: 'dbc-composite-b-sheet', rotate: -1.1, stamp: 'REV. COMPOSITE · 1973', code: 'NORJAK · VOL 14', treatment: 'scan' as const },
  { assetId: 'dbc-crew-cabin', rotate: 2.0, stamp: '727 CABIN INTERIOR', code: 'NORJAK · PHOTO 09', treatment: 'halftone' as const },
  { assetId: 'dbc-crew-reno', rotate: -1.6, stamp: 'FLIGHT 305 CREW · RENO', code: 'NORJAK · PHOTO 12', treatment: 'archival' as const },
  { assetId: 'dbc-tina-bar-money-1980', rotate: 1.4, stamp: 'TINA BAR FIND · 1980', code: 'NORJAK · LAB 80', treatment: 'archival' as const },
  { assetId: 'dbc-composite-age', rotate: -2.0, stamp: 'AGE PROGRESSION', code: 'NORJAK · LAB STUDY', treatment: 'archival' as const },
  { assetId: 'dbc-airstair-1975', rotate: 1.2, stamp: '727 VENTRAL STAIR', code: 'NORJAK · TECH FILE', treatment: 'archival' as const },
];

export function TheArchive() {
  return (
    <FlowScene id="dbc-the-archive" className="dbc-flow--archive" label="The FBI archive and the NORJAK investigation">
      <div className="dbc-archive">
        <div className="dbc-archive__stamp" aria-hidden>NORJAK</div>
        <div className="dbc-archive__grid" aria-hidden />

        <TypeField>
          <TypeLayer
            voice="poster"
            size="clamp(6rem, 15vw, 18rem)"
            top="7%"
            right="-2vw"
            opacity={0.055}
            animation="sweep"
            bleed
            strokeOnly
            className="dbc-type--outline dbc-type--wide-only"
          >
            302
          </TypeLayer>
          <TypeLayer
            voice="mono"
            size="0.55rem"
            tracking="0.2em"
            top="19%"
            left="var(--dbc-pad)"
            opacity={0.5}
            animation="track"
            className="dbc-type--vertical dbc-type--mist dbc-type--wide-only"
          >
            FEDERAL BUREAU OF INVESTIGATION · SEATTLE FIELD OFFICE
          </TypeLayer>
          <TypeLayer
            voice="condensed"
            size="0.82rem"
            tracking="0.22em"
            bottom="9%"
            right="var(--dbc-pad)"
            opacity={0.38}
            animation="rise"
            className="dbc-type--steel dbc-type--wide-only"
          >
            60 VOLUMES · 800+ NAMES · 45 YEARS BEFORE SUSPENSION
          </TypeLayer>
        </TypeField>

        <div className="dbc-archive__head">
          <p className="dbc-kicker">Movement 10 · The archive</p>
          <h2>NORJAK</h2>
          <p className="dbc-archive__sub">
            A case file of sixty volumes, built around a man no one could name.
          </p>
        </div>

        <div className="dbc-archive__body">
          <div className="dbc-archive__prose">
            <p className="dbc-lede">{ARCHIVE_PROSE.lede}</p>
            {ARCHIVE_PROSE.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>

          <dl className="dbc-archive__stats">
            <div><dd>800+</dd><dt>suspects considered by 1976</dt></div>
            <div><dd>≈24</dd><dt>not eliminated at that point</dt></div>
            <div><dd>66</dd><dt>latent fingerprints</dt></div>
            <div><dd>45</dd><dt>years before suspension</dt></div>
          </dl>
        </div>

        {/* Wall Composition — Dense Archival Evidence Mosaic */}
        <div className="dbc-archive__shelf" aria-label="NORJAK Evidence Wall">
          <div className="dbc-archive__shelf-head">
            <p className="dbc-kicker">NORJAK Evidence Wall · Declassified Vault Exhibits (Click any plate to inspect)</p>
            <span>Provenance verified in register</span>
          </div>
          <div className="dbc-archive__wall">
            {WALL_EXHIBITS.map((exhibit) => (
              <EvidenceArtifact
                key={exhibit.assetId}
                assetId={exhibit.assetId}
                rotate={exhibit.rotate}
                treatment={exhibit.treatment}
                stamp={exhibit.stamp}
                code={exhibit.code}
              />
            ))}
          </div>
        </div>

        <blockquote className="dbc-archive__quote">
          <p>“The file is not the answer. It is the record of how many ways we tried to find one.”</p>
          <footer>Editorial note</footer>
        </blockquote>

        <div className="dbc-archive__method">
          <div>
            <p className="dbc-kicker">What the archive contains</p>
            <p>
              FD-302 interview reports, teletypes, serial-number microfilms, laboratory submissions,
              composite sketches, photographs of recovered objects, and public tip correspondence across
              more than 100 released Vault parts.
            </p>
          </div>
          <div>
            <p className="dbc-kicker">What it does not contain</p>
            <p>
              A name. A body. A main canopy. A briefcase bomb. A confirmed sighting after 20:05 PST.
              The absence is the case.
            </p>
          </div>
          <div>
            <p className="dbc-kicker">Official status</p>
            <p>
              On 8 July 2016 the FBI suspended active investigation to redirect resources, stating
              that only new physical evidence—specifically the parachutes or the ransom money—would
              reopen the file. [SRC-02]
            </p>
          </div>
        </div>

        <div className="dbc-next">
          <span>Next · 11</span>
          <a href="#dbc-the-suspects">Read the names →</a>
        </div>
      </div>
    </FlowScene>
  );
}

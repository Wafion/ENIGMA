import { useId, useState } from 'react';
import { DBC_MAP } from './mapGeometry';
import type { DbcMapPlace } from './mapGeometry';

const { width, height, land, rivers, places } = DBC_MAP;

const place = (id: DbcMapPlace) => places[id];

const ROUTE = `M${place('portland')[0]},${place('portland')[1]} L${place('seattle')[0]},${place('seattle')[1]}`;

const SOUTHBOUND = `M${place('seattle')[0]},${place('seattle')[1]} C${place('seattle')[0] - 20},${place('seattle')[1] + 70} ${place('ariel')[0] + 26},${place('ariel')[1] - 55} ${place('ariel')[0]},${place('ariel')[1]} C${place('ariel')[0] - 14},${place('ariel')[1] + 85} ${place('ariel')[0] - 52},${place('ariel')[1] + 150} 520,${height + 10}`;

const CONTOURS = [
  'M470,250 C520,220 585,236 620,282 C650,322 640,372 604,402 C566,434 508,430 474,396 C440,362 434,292 470,250Z',
  'M492,268 C532,246 580,258 604,294 C626,326 618,364 590,386 C562,410 520,406 496,380 C470,352 464,294 492,268Z',
  'M512,288 C540,272 572,280 588,306 C602,330 594,358 574,372 C552,388 526,382 510,362 C492,340 490,304 512,288Z',
];

export function DBMap({
  mode = 'search',
  compact = false,
}: {
  mode?: 'search' | 'landscape';
  compact?: boolean;
}) {
  const [layers, setLayers] = useState({
    route: true,
    search: true,
    river: true,
    zone: true,
    aerial: mode === 'landscape',
  });
  const uid = useId().replace(/:/g, '');
  const gridId = `dbc-grid-${uid}`;
  const zoneId = `dbc-zone-${uid}`;
  const toggle = (key: keyof typeof layers) =>
    setLayers((current) => ({ ...current, [key]: !current[key] }));

  return (
    <figure className={`dbc-map dbc-map--${mode} ${compact ? 'is-compact' : ''}`}>
      <div className="dbc-map__toolbar" role="group" aria-label="Map layers">
        <span className="dbc-map__title">Northwest Orient 305 · Lewis River &amp; Columbia sector</span>
        <div className="dbc-map__toggles">
          {(
            [
              ['route', 'V-23 Route'],
              ['zone', 'Drop zone'],
              ['search', 'Search grid'],
              ['river', 'Rivers'],
              ['aerial', 'Aerial terrain'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={layers[key] ? 'is-on' : ''}
              aria-pressed={layers[key]}
              onClick={() => toggle(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="dbc-map__canvas"
        role="img"
        aria-label="Diagram of Washington and Oregon showing the Flight 305 route, the estimated drop zone near Ariel, and the location of the 1980 money find at Tina Bar."
      >
        <defs>
          <pattern id={gridId} width="62" height="62" patternUnits="userSpaceOnUse">
            <path d="M62 0H0V62" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
          </pattern>
          <radialGradient id={zoneId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--dbc-amber)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--dbc-amber)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={width} height={height} fill="var(--dbc-map-water)" />
        <g className="dbc-map__land">
          {land.map((ring, index) => (
            <path key={index} d={ring.d} fill="var(--dbc-map-land)" stroke="var(--dbc-map-edge)" strokeWidth="0.9" />
          ))}
        </g>

        {layers.aerial && (
          <image
            href="/assets/db-cooper/images/lake-merwin-aerial.jpg"
            x="0"
            y="0"
            width={width}
            height={height}
            preserveAspectRatio="xMidYMid slice"
            opacity="0.22"
            style={{ mixBlendMode: 'luminosity' }}
          />
        )}

        <rect width={width} height={height} fill={`url(#${gridId})`} color="var(--dbc-map-line)" />

        {layers.river && (
          <g className="dbc-map__rivers">
            <path d={rivers.columbia} fill="none" stroke="var(--dbc-map-waterline)" strokeWidth="3.2" strokeLinecap="round" />
            <path d={rivers.columbia} fill="none" stroke="var(--dbc-map-water)" strokeWidth="1.4" strokeLinecap="round" />
            <path d={rivers.lewis} fill="none" stroke="var(--dbc-map-waterline)" strokeWidth="2.2" strokeLinecap="round" />
            <path d={rivers.willamette} fill="none" stroke="var(--dbc-map-waterline)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}

        {layers.zone && (
          <g className="dbc-map__zone">
            <ellipse cx={place('ariel')[0]} cy={place('ariel')[1]} rx="86" ry="58" fill={`url(#${zoneId})`} />
            <ellipse
              cx={place('ariel')[0]}
              cy={place('ariel')[1]}
              rx="86"
              ry="58"
              fill="none"
              stroke="var(--dbc-amber)"
              strokeWidth="1"
              strokeDasharray="5 7"
              opacity="0.85"
            />
            <text x={place('ariel')[0] + 92} y={place('ariel')[1] - 34} className="dbc-map__label dbc-map__label--amber">
              ESTIMATED DROP ZONE
            </text>
            <text x={place('ariel')[0] + 92} y={place('ariel')[1] - 20} className="dbc-map__label dbc-map__label--quiet">
              not observed · calculated
            </text>
          </g>
        )}

        {layers.route && (
          <g className="dbc-map__route">
            <path d={ROUTE} fill="none" stroke="var(--dbc-map-route)" strokeWidth="1.6" strokeDasharray="3 5" />
            <path d={SOUTHBOUND} fill="none" stroke="var(--dbc-map-route)" strokeWidth="2" />
            <path d={SOUTHBOUND} fill="none" stroke="var(--dbc-map-route-glow)" strokeWidth="7" opacity="0.16" />
            <text x="568" y={height - 24} className="dbc-map__label dbc-map__label--quiet">
              V-23 · CONTINUES SOUTH / TO RENO
            </text>
          </g>
        )}

        {layers.search && (
          <g className="dbc-map__search">
            {[
              [place('ariel')[0] - 130, place('ariel')[1] - 90],
              [place('ariel')[0] - 50, place('ariel')[1] - 90],
              [place('ariel')[0] + 30, place('ariel')[1] - 90],
              [place('ariel')[0] - 130, place('ariel')[1] - 10],
              [place('ariel')[0] + 30, place('ariel')[1] - 10],
              [place('ariel')[0] - 130, place('ariel')[1] + 70],
              [place('ariel')[0] - 50, place('ariel')[1] + 70],
            ].map(([x, y], index) => (
              <rect key={index} x={x} y={y} width="80" height="80" fill="none" stroke="var(--dbc-map-grid)" strokeWidth="0.7" />
            ))}
            <text x={place('ariel')[0] - 130} y={place('ariel')[1] - 100} className="dbc-map__label dbc-map__label--quiet">
              SEARCH SECTORS · CLARK / COWLITZ
            </text>
          </g>
        )}

        {CONTOURS.map((d, index) => (
          <path key={index} d={d} fill="none" stroke="var(--dbc-map-contour)" strokeWidth="0.7" opacity="0.5" />
        ))}

        <g className="dbc-map__places">
          {(
            [
              ['portland', 'PORTLAND', 'PDX'],
              ['seattle', 'SEATTLE–TACOMA', 'SEA'],
              ['vancouver', 'VANCOUVER', 'VAN'],
              ['woodland', 'WOODLAND', 'WDL'],
              ['ariel', 'ARIEL', 'ARL'],
              ['lakeMerwin', 'LAKE MERWIN', 'MRW'],
              ['tinaBar', 'TINA BAR', 'TNB'],
              ['heisson', 'HEISSON', 'HEI'],
            ] as const
          ).map(([id, name, code]) => {
            const [x, y] = place(id);
            const isKey = id === 'ariel' || id === 'tinaBar';
            return (
              <g key={id} className={`dbc-map__pin ${isKey ? 'is-key' : ''}`} transform={`translate(${x} ${y})`}>
                <circle r={isKey ? 5 : 3} fill={isKey ? 'var(--dbc-amber)' : 'var(--dbc-bone)'} />
                {isKey && <circle r="13" fill="none" stroke="var(--dbc-amber)" strokeWidth="0.8" opacity="0.6" />}
                <text x="10" y="-7" className="dbc-map__label">
                  {name}
                </text>
                <text x="10" y="7" className="dbc-map__label dbc-map__label--code">
                  {code}
                </text>
              </g>
            );
          })}
        </g>

        <g className="dbc-map__graticule">
          <text x="18" y="26" className="dbc-map__label dbc-map__label--quiet">
            49°00′ N
          </text>
          <text x="18" y={height - 16} className="dbc-map__label dbc-map__label--quiet">
            45°00′ N
          </text>
          <text x={width - 84} y={height - 16} className="dbc-map__label dbc-map__label--quiet">
            117°00′ W
          </text>
          <text x="18" y={height / 2} className="dbc-map__label dbc-map__label--quiet">
            PACIFIC OCEAN
          </text>
          <text x={width - 250} y="26" className="dbc-map__label dbc-map__label--quiet">
            BRITISH COLUMBIA
          </text>
        </g>

        <g className="dbc-map__scale">
          <line x1="20" y1={height - 42} x2="120" y2={height - 42} stroke="var(--dbc-map-edge)" strokeWidth="1" />
          <line x1="20" y1={height - 46} x2="20" y2={height - 38} stroke="var(--dbc-map-edge)" strokeWidth="1" />
          <line x1="120" y1={height - 46} x2="120" y2={height - 38} stroke="var(--dbc-map-edge)" strokeWidth="1" />
          <text x="20" y={height - 50} className="dbc-map__label dbc-map__label--quiet">
            ≈ 100 km
          </text>
        </g>
      </svg>

      <figcaption className="dbc-map__caption">
        <span>Diagrammatic reconstruction</span>
        <span>
          Boundaries from public-domain U.S. state geometry; route and drop zone reconstructed from
          documented flight-path and search descriptions. Not a navigation chart.
        </span>
      </figcaption>
    </figure>
  );
}

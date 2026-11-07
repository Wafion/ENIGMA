import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { DBC_MAP } from '../mapGeometry';
import { LANDSCAPE_PLACES } from '../content';
import { useDbc } from '../context';
import { MapJourney } from './motionPrimitives';

const STEPS = [
  {
    place: 'woodland' as const,
    label: 'The route',
    body:
      'The second flight headed south on airway V-23 at 10,000 feet and about 200 knots, flaps at 15 degrees, the cabin unpressurised. The ground below was under cloud.',
  },
  {
    place: 'ariel' as const,
    label: 'The field',
    body:
      'The drop zone is a probability field drawn from heading, speed, wind, and the 8:13 trim change. It centres near Ariel and Lake Merwin. It is not a pin, and no one saw him leave.',
  },
  {
    place: 'tinaBar' as const,
    label: 'The river',
    body:
      'Tina Bar lies on the Columbia, about twenty miles from the centre of the field. In 1980 it returned 290 of the ransom bills. The map is a diagram, not a navigation chart.',
  },
];

const PLACE_LABEL: Record<string, { x: number; y: number; anchor: 'start' | 'end'; line: [number, number, number, number] }> = {
  // The plate crops at x=245. Keep right-aligned labels inside the crop so
  // names such as Woodland and Vancouver do not lose their first letters.
  woodland: { x: 282, y: 566, anchor: 'end', line: [292, 574, 282, 566] },
  ariel: { x: 404, y: 537, anchor: 'start', line: [318, 566, 390, 543] },
  lakeMerwin: { x: 404, y: 562, anchor: 'start', line: [322, 563, 390, 562] },
  heisson: { x: 404, y: 592, anchor: 'start', line: [330, 587, 390, 592] },
  tinaBar: { x: 364, y: 638, anchor: 'start', line: [302, 610, 352, 635] },
  vancouver: { x: 282, y: 614, anchor: 'end', line: [301, 620, 282, 618] },
  portland: { x: 282, y: 638, anchor: 'end', line: [309, 627, 282, 636] },
  seattle: { x: 0, y: 0, anchor: 'start', line: [0, 0, 0, 0] },
};

const PLACE_NAME: Record<string, string> = {
  woodland: 'Woodland',
  ariel: 'Ariel · drop zone',
  lakeMerwin: 'Lake Merwin',
  heisson: 'Heisson',
  tinaBar: 'Tina Bar',
  vancouver: 'Vancouver',
  portland: 'Portland',
  seattle: 'Seattle',
};

export function SearchMap() {
  const { reducedMotion } = useDbc();
  const [active, setActive] = useState<string>('ariel');
  const selected = LANDSCAPE_PLACES.find((place) => place.id === active) ?? LANDSCAPE_PLACES[3];
  const activeStep = STEPS.find((step) => step.place === active);

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const focusRef = useRef<SVGRectElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const fieldRef = useRef<SVGGElement>(null);
  const findRef = useRef<SVGGElement>(null);
  const lockRef = useRef(0);
  const choose = (id: string) => {
    if (performance.now() < lockRef.current) return;
    setActive((current) => (current === id ? current : id));
  };
  const select = (id: string) => {
    lockRef.current = performance.now() + 1600;
    setActive(id);
  };

  useGSAP(
    () => {
      if (reducedMotion) return;
      const svg = svgRef.current;
      if (!svg) return;

      const initialViewBox = svg.getAttribute('viewBox');
      const initialClip = clipRef.current
        ? { x: clipRef.current.getAttribute('x'), y: clipRef.current.getAttribute('y'), w: clipRef.current.getAttribute('width'), h: clipRef.current.getAttribute('height') }
        : null;
      const initialFocus = focusRef.current
        ? { x: focusRef.current.getAttribute('x'), y: focusRef.current.getAttribute('y'), w: focusRef.current.getAttribute('width'), h: focusRef.current.getAttribute('height') }
        : null;

      const aspect = 270 / 175;
      const stops = [
        { x: 245, y: 490, w: 270 },
        { x: 218, y: 481, w: 196 },
        { x: 244, y: 520, w: 142 },
        { x: 241, y: 570, w: 112 },
        { x: 241, y: 570, w: 112 },
        { x: 185, y: 445, w: 500 },
      ].map((stop) => ({ ...stop, h: stop.w / aspect }));

      const stage = svg.closest('.ed-search__stage') ?? svg;
      MapJourney({
        trigger: stage,
        svg,
        clip: clipRef.current,
        focus: focusRef.current,
        stops,
        route: routeRef.current,
        field: fieldRef.current,
        find: findRef.current,
        stepAt: [0.26, 0.54],
        onStep: (index) => choose(STEPS[index]?.place ?? 'woodland'),
      });

      return () => {
        if (initialViewBox) svg.setAttribute('viewBox', initialViewBox);
        if (clipRef.current && initialClip) {
          clipRef.current.setAttribute('x', initialClip.x ?? '');
          clipRef.current.setAttribute('y', initialClip.y ?? '');
          clipRef.current.setAttribute('width', initialClip.w ?? '');
          clipRef.current.setAttribute('height', initialClip.h ?? '');
        }
        if (focusRef.current && initialFocus) {
          focusRef.current.setAttribute('x', initialFocus.x ?? '');
          focusRef.current.setAttribute('y', initialFocus.y ?? '');
          focusRef.current.setAttribute('width', initialFocus.w ?? '');
          focusRef.current.setAttribute('height', initialFocus.h ?? '');
        }
      };
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div className="ed-map" ref={rootRef}>
      <div className="ed-map__bar">
        <span>Survey plate 05 · Lewis River country</span>
        <span>45°54′N 122°34′W · diagram</span>
      </div>

      <div className="ed-map__stage">
        <svg
          ref={svgRef}
          viewBox="245 490 270 175"
          className="ed-map__svg"
          role="group"
          aria-label="Diagram map of the Lewis River drop zone. Places are selectable."
        >
          <defs>
            <clipPath id="ed-map-clip">
              <rect ref={clipRef} x="245" y="490" width="270" height="175" />
            </clipPath>
          </defs>

          <g clipPath="url(#ed-map-clip)">
            <rect x="245" y="490" width="270" height="175" className="ed-map__ground" />
            {DBC_MAP.land.map((shape, index) => (
              <path key={index} d={shape.d} className={shape.state === 'Washington' ? 'ed-map__state is-wa' : 'ed-map__state is-or'} />
            ))}

            <g className="ed-map__rivers">
              <path d={DBC_MAP.rivers.columbia} />
              <path d={DBC_MAP.rivers.lewis} />
              <path d={DBC_MAP.rivers.willamette} />
            </g>

            <g className="ed-map__contours" aria-hidden>
              <path d="M250 508 C300 496 350 520 398 506 S460 500 504 518" />
              <path d="M250 532 C300 520 344 540 390 528 S458 522 500 540" />
              <path d="M250 552 C294 544 330 558 372 548 S448 542 500 558" />
              <path d="M250 650 C300 638 344 654 388 644 S458 640 500 654" />
              <path d="M250 668 C300 656 344 672 388 662 S458 658 500 672" />
            </g>

            <path
              ref={routeRef}
              data-map-route
              className={`ed-map__route ${active === 'woodland' ? 'is-active' : ''}`}
              d="M334 490 C330 516 326 536 320 556 C316 572 314 588 313 610 C312 626 311 638 310 652"
            />
            <path className="ed-map__route-dash" d="M334 490 C330 516 326 536 320 556 C316 572 314 588 313 610 C312 626 311 638 310 652" />

            <g ref={fieldRef} data-map-field className={`ed-map__field ${['ariel', 'lakeMerwin', 'heisson'].includes(active) ? 'is-active' : ''}`}>
              <ellipse cx="318" cy="568" rx="26" ry="17" transform="rotate(-18 318 568)" />
              <ellipse cx="318" cy="568" rx="13" ry="9" transform="rotate(-18 318 568)" />
            </g>

            <g ref={findRef} data-map-find className={`ed-map__river-find ${active === 'tinaBar' ? 'is-active' : ''}`}>
              <circle cx="299" cy="609" r="12" />
            </g>

            <g className="ed-map__route-label" aria-hidden>
              <text x="334" y="506">V-23</text>
              <text x="340" y="517">FROM SEATTLE</text>
            </g>
            <g className="ed-map__river-label" aria-hidden>
              <text x="336" y="624">COLUMBIA RIVER</text>
              <text x="326" y="552">LEWIS R.</text>
            </g>

            {Object.entries(PLACE_LABEL)
              .filter(([id]) => id !== 'seattle')
              .map(([id, label]) => {
                const point = DBC_MAP.places[id as keyof typeof DBC_MAP.places];
                const isActive = active === id;
                return (
                  <g
                    key={id}
                    className={`ed-map__place ${isActive ? 'is-active' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${PLACE_NAME[id]}. Show this place.`}
                    aria-pressed={isActive}
                    onClick={() => select(id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        select(id);
                      }
                    }}
                  >
                    <line x1={label.line[0]} y1={label.line[1]} x2={label.line[2]} y2={label.line[3]} />
                    <circle cx={point[0]} cy={point[1]} r={isActive ? 5 : 3.4} />
                    <rect
                      x={label.anchor === 'start' ? label.x - 3 : Math.max(245, label.x - 70)}
                      y={label.y - 10}
                      width={label.anchor === 'start' ? 74 : label.x + 4 - Math.max(245, label.x - 70)}
                      height="14"
                      className="ed-map__label-bg"
                    />
                    <text x={label.x} y={label.y} textAnchor={label.anchor}>
                      {PLACE_NAME[id]}
                    </text>
                  </g>
                );
              })}
          </g>
        </svg>

        <div className="ed-map__overview" aria-hidden>
          <svg viewBox="0 0 1000 751">
            {DBC_MAP.land.map((shape, index) => (
              <path key={index} d={shape.d} />
            ))}
            <rect ref={focusRef} x="245" y="490" width="270" height="175" className="ed-map__overview-focus" />
          </svg>
          <span>WASHINGTON · OREGON</span>
        </div>

        <div className="ed-map__scale" aria-hidden>
          <span>0</span>
          <i />
          <span>10 mi</span>
        </div>
      </div>

      <div className="ed-map__steps" role="group" aria-label="Map narrative steps">
        {STEPS.map((step, index) => (
          <button
            key={step.label}
            type="button"
            className={active === step.place ? 'is-active' : ''}
            aria-pressed={active === step.place}
            onClick={() => select(step.place)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {step.label}
          </button>
        ))}
      </div>

      <div className="ed-map__detail" aria-live="polite">
        <p className="ed-map__code">{selected.code}</p>
        <h3>{selected.name}</h3>
        <p>{selected.note}</p>
        {activeStep && <p className="ed-map__step-body">{activeStep.body}</p>}
      </div>

      <div className="ed-map__legend">
        <span><i className="is-route" /> Airway V-23</span>
        <span><i className="is-field" /> Calculated field</span>
        <span><i className="is-find" /> 1980 money find</span>
      </div>
    </div>
  );
}

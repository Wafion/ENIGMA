import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MONEY_PROSE } from '../content';
import {
  AssetFigure,
  Chapter,
  ChapterHead,
  Cited,
  DiagramFrame,
  Prose,
  Status,
} from './ui';

const BILLS = (() => {
  const cells: Array<{ x: number; y: number; packet: number }> = [];
  const block = (startX: number, startY: number, count: number, packet: number) => {
    for (let i = 0; i < count; i += 1) {
      cells.push({ x: startX + (i % 10), y: startY + Math.floor(i / 10), packet });
    }
  };
  block(12, 20, 100, 1);
  block(30, 20, 100, 2);
  block(21, 38, 90, 3);
  return cells;
})();

const STRIP = [
  {
    year: '1971',
    code: 'RANSOM',
    title: 'Ten thousand twenties',
    body:
      'The FBI photographed the serial numbers onto microfilm before the bag left Seattle First National Bank. That administrative act is why the 1980 find could be identified.',
    status: 'DOCUMENTED' as const,
  },
  {
    year: '1974',
    code: 'DREDGE',
    title: 'Sand pumped onto the bar',
    body:
      'The Corps of Engineers dredged the Columbia near Tina Bar and deposited spoil on the beach. No record directly ties the ransom bundles to that operation.',
    status: 'DOCUMENTED' as const,
  },
  {
    year: '1980',
    code: 'FIND',
    title: '290 bills in the sand',
    body:
      'Brian Ingram, eight years old, dug a fire pit and uncovered three packets: 100, 100, and 90 bills. The serial numbers matched the ransom list.',
    status: 'CONFIRMED' as const,
  },
  {
    year: '2020',
    code: 'STUDY',
    title: 'Diatoms out of season',
    body:
      'A forensic study found spring-bloom species on the bills, not the November assemblage expected from a 1971 immersion. It constrains the timeline, not the handler.',
    status: 'DOCUMENTED' as const,
  },
];

function EvidenceStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * 0.72, 620), behavior: 'smooth' });
  };

  return (
    <div className="ed-strip">
      <div className="ed-strip__head">
        <p className="ed-kicker">Evidence strip · the money’s documented journey</p>
        <span className="ed-strip__live" data-strip-live aria-hidden>1971</span>
        <div className="ed-strip__readout" aria-hidden>
          <span data-strip-count>01 / 04</span>
          <i><b data-strip-progress /></i>
        </div>
        <div className="ed-strip__buttons">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous money evidence">
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next money evidence">
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="ed-strip__track" ref={trackRef} tabIndex={0} aria-label="Horizontal evidence strip" data-strip-track>
        {STRIP.map((item, index) => (
          <article key={item.year} className="ed-strip__item" data-strip-item>
            <div className="ed-strip__top">
              <span className="ed-strip__year">{item.year}</span>
              <span className="ed-strip__code">{String(index + 1).padStart(2, '0')} / {item.code}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <Status value={item.status} compact />
          </article>
        ))}
      </div>
    </div>
  );
}

export function TheMoney() {
  return (
    <Chapter id="dbc-the-money" number="06" climate="bright" className="ed-money">
      <div className="ed-wrap">
        <ChapterHead
          id="dbc-the-money"
          number="06"
          kicker="The money · 10 February 1980"
          title="The Money at Tina Bar"
          lede={<Cited text={MONEY_PROSE.lede} />}
        />
      </div>

      <AssetFigure
        assetId="dbc-tina-bar-money-1980"
        className="ed-money__scan"
        bleed
        sizes="100vw"
        caption={
          <>
            <strong>FBI LABORATORY PHOTOGRAPH · FEBRUARY 1980</strong>
            <span>
              Sand-caked, rotted twenty-dollar bills recovered by eight-year-old Brian Ingram at
              Tina Bar on the Columbia River. The rubber bands were still in place.
            </span>
          </>
        }
      />

      <div className="ed-wrap">
        <div className="ed-money__field-row">
          <div className="ed-bill-field">
            <div className="ed-bill-field__label">
              <span className="ed-kicker">290 of 10,000 bills · 2.9%</span>
              <strong>What came back</strong>
            </div>
            <div
              className="ed-bill-field__grid"
              role="img"
              aria-label="Schematic field of ten thousand twenty-dollar bills. Two hundred and ninety are marked as recovered, in three packets of one hundred, one hundred, and ninety."
            >
              {BILLS.map((bill, index) => (
                <i
                  key={index}
                  className={`ed-bill-field__bill is-packet-${bill.packet}`}
                  style={{ left: `${bill.x}%`, top: `${bill.y}%` }}
                />
              ))}
            </div>
            <div className="ed-bill-field__packets">
              <span><i className="is-packet-1" /> Packet A · 100</span>
              <span><i className="is-packet-2" /> Packet B · 100</span>
              <span><i className="is-packet-3" /> Packet C · 90</span>
              <span className="ed-bill-field__not">Not recovered · 9,710</span>
            </div>
          </div>

          <div className="ed-money__body">
            <Prose paragraphs={[MONEY_PROSE.paragraphs[0], MONEY_PROSE.paragraphs[1]]} />

            <div className="ed-money__stats">
              {MONEY_PROSE.stats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.value}</span>
                  <strong>{stat.label}</strong>
                  <small>{stat.note}</small>
                </div>
              ))}
            </div>

            <Prose paragraphs={[MONEY_PROSE.paragraphs[2], MONEY_PROSE.paragraphs[3]]} />

            <DiagramFrame
              label="Diagram · project original · not recovered currency"
              caption="The three bundles as reported: two packets of one hundred bills and a third of ninety. This is a measured diagram, not the evidence itself."
              className="ed-money__bundle"
            >
              <img
                src="/assets/db-cooper/reconstructions/money-bundles.svg"
                alt="Diagram of three ransom packets: one hundred, one hundred, and ninety twenty-dollar bills."
                width={520}
                height={250}
                loading="lazy"
                decoding="async"
              />
            </DiagramFrame>
          </div>
        </div>

        <div className="ed-money__interpretations">
          <div className="ed-money__interp-head">
            <p className="ed-kicker">Three readings of the same find</p>
            <h3>How did the money reach the bar?</h3>
            <p>Comparison, not a carousel. Each explanation has a status and a limit.</p>
          </div>
          {MONEY_PROSE.interpretations.map((item, index) => (
            <article key={item.title} className="ed-money__interp">
              <span className="ed-money__interp-num" aria-hidden>{String(index + 1).padStart(2, '0')}</span>
              <Status value={item.status} compact />
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <EvidenceStrip />
      </div>
    </Chapter>
  );
}

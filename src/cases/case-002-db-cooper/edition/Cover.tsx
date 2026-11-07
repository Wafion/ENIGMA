import { PROLOGUE } from '../content';
import { AssetFigure, Chapter, TitleWords } from './ui';

export function Cover() {
  return (
    <Chapter id="dbc-prologue" number="00" climate="paper" className="ed-cover">
      <div className="ed-cover__top">
        <div className="ed-cover__marks">
          <span className="ed-cover__case">CASE 002 / NORJAK</span>
          <span className="ed-cover__meta">D.B. COOPER · 24 NOVEMBER 1971</span>
        </div>
        <p className="ed-cover__date" aria-hidden>24 NOV 1971</p>
        <h1 className="ed-cover__title" id="dbc-prologue-title" aria-label="D.B. Cooper">
          <TitleWords text="D.B. Cooper" />
        </h1>
        <div className="ed-cover__subrow">
          <p className="ed-cover__subtitle">The case that stayed open</p>
          <p className="ed-cover__line">A case file with one page missing.</p>
        </div>
        <p className="ed-cover__opening">{PROLOGUE.opening}</p>
      </div>

      <div className="ed-cover__media">
        <AssetFigure
          assetId="dbc-boeing-727-n467us"
          className="ed-cover__figure"
          priority
          credit={false}
          sizes="100vw"
          caption={
            <>
              <span className="ed-cover__photo-label">PLATE 00 · THE AIRCRAFT</span>
              <span>
                N467US, the Boeing 727-51 of Flight 305, photographed at Miami in December 1972.
                The aft airstair is visible beneath the tail. This is the airframe, not the night.
              </span>
              <span className="ed-figure__credit">Clint Groves · 29 December 1972 · GFDL 1.2</span>
            </>
          }
        />
      </div>

      <div className="ed-cover__foot">
        <dl>
          <div><dt>Flight</dt><dd>Northwest Orient 305</dd></div>
          <div><dt>Route</dt><dd>Portland → Seattle</dd></div>
          <div><dt>Ransom</dt><dd>$200,000</dd></div>
          <div><dt>Status</dt><dd>Suspended, not closed</dd></div>
        </dl>
        <a className="ed-cover__enter" href="#dbc-the-man">
          <span>Read the file</span>
          <i aria-hidden />
        </a>
      </div>
    </Chapter>
  );
}

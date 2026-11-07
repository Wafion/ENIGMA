import { CLOTHING, MAN_FACTS, MAN_PROSE } from '../content';
import { AssetFigure, Chapter, ChapterHead, Cited, MarginNote, Prose, Status } from './ui';

export function TheMan() {
  return (
    <Chapter id="dbc-the-man" number="01" climate="paper">
      <div className="ed-wrap">
        <ChapterHead
          id="dbc-the-man"
          number="01"
          kicker="The man · Seat 18C"
          title="The Man in Seat 18C"
          lede={<Cited text={MAN_PROSE.lede} />}
        />

        <div className="ed-man">
          <div className="ed-man__plate">
            <div className="ed-man__finder" data-man-finder aria-hidden>
              <span className="ed-man__finder-label" data-man-finder-label>
                COMPOSITE A · 1971
              </span>
              <i /><i /><i /><i />
            </div>
            <div className="ed-man__sketches">
              <AssetFigure
                assetId="dbc-composite-a"
                className="ed-man__sketch is-a"
                credit={false}
                caption={
                  <>
                    <strong>COMPOSITE A</strong>
                    <span>FBI circulation drawing, late November 1971.</span>
                  </>
                }
              />
              <AssetFigure
                assetId="dbc-composite-b"
                className="ed-man__sketch is-b"
                credit={false}
                caption={
                  <>
                    <strong>COMPOSITE B</strong>
                    <span>Drawn by Roy Rose, 1973, from a different recollection.</span>
                  </>
                }
              />
            </div>
            <div className="ed-man__age">
              <AssetFigure
                assetId="dbc-composite-age"
                credit={false}
                caption={
                  <>
                    <strong>AGE PROGRESSION · c. 2007</strong>
                    <span>A projection, not a photograph.</span>
                  </>
                }
              />
            </div>
            <p className="ed-man__plate-note">
              Two memory drawings made years apart, and one later projection. None is a portrait.
              The resemblance is a family resemblance, not an identification.
            </p>
          </div>

          <div className="ed-man__body">
            <p className="ed-statement">There is no<br />photograph.</p>

            <div className="ed-ledger ed-man__ledger" role="table" aria-label="Witness description of the hijacker">
              <div className="ed-ledger__head" role="row">
                <span role="columnheader">Descriptor</span>
                <span role="columnheader">Account</span>
                <span role="columnheader">Status</span>
              </div>
              {MAN_FACTS.map((fact) => (
                <div className="ed-ledger__row" role="row" key={fact.label}>
                  <span role="cell" className="ed-ledger__label">{fact.label}</span>
                  <span role="cell">{fact.value}</span>
                  <span role="cell"><Status value={fact.status} compact /></span>
                </div>
              ))}
            </div>

            <div className="ed-clothing">
              <p className="ed-kicker">Clothing described by witnesses</p>
              <ul>
                {CLOTHING.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            <Prose paragraphs={[MAN_PROSE.paragraphs[0], MAN_PROSE.paragraphs[1]]} />

            <div className="ed-correction">
              <p className="ed-kicker">A correction · the name</p>
              <p>
                <Cited text={MAN_PROSE.paragraphs[2]} />
              </p>
            </div>

            <blockquote className="ed-quote">
              <p>“{MAN_PROSE.quote.text}”</p>
              <footer>
                {MAN_PROSE.quote.attribution}
                <span>{MAN_PROSE.quote.source}</span>
              </footer>
            </blockquote>

            <Prose paragraphs={[MAN_PROSE.paragraphs[3]]} />
          </div>
        </div>

        <div className="ed-margins ed-man__margins">
          {MAN_PROSE.margin.map((note, index) => (
            <MarginNote key={note} label={index === 0 ? 'On agreement' : 'On memory'}>
              {note}
            </MarginNote>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

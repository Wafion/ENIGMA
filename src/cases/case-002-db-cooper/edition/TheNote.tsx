import { DEMANDS, NOTE_PROSE } from '../content';
import {
  AssetFigure,
  BriefcaseDiagram,
  Chapter,
  ChapterHead,
  Cited,
  DiagramFrame,
  MarginNote,
  Prose,
} from './ui';

function NoteSheet() {
  return (
    <div className="ed-note__sheet">
      <div className="ed-note__stamp">
        <span>Reconstruction</span>
        <span>Wording quoted from the record</span>
      </div>
      <span className="ed-note__focus" data-note-focus aria-hidden>
        <i /><i /><i /><i />
      </span>
      <p className="ed-note__text">
        Miss — I have a <mark>bomb</mark> in my briefcase and want you to{' '}
        <mark>sit by me.</mark>
      </p>
      <div className="ed-note__annotations">
        <p><span aria-hidden>1</span> The only words Schaffner remembered verbatim after reading it.</p>
        <p><span aria-hidden>2</span> The physical note was taken back by Cooper. The paper and hand are not evidence.</p>
      </div>
    </div>
  );
}

export function TheNote() {
  return (
    <Chapter id="dbc-the-note" number="02" climate="manila" className="ed-note">
      <div className="ed-wrap">
        <ChapterHead
          id="dbc-the-note"
          number="02"
          kicker="The note · 14:50–15:00"
          title="The Note"
          lede={<Cited text={NOTE_PROSE.lede} />}
        />

        <div className="ed-note__stage">
          <div className="ed-note__left">
            <NoteSheet />
            <AssetFigure
              assetId="dbc-plane-ticket-1971"
              className="ed-note__ticket"
              sizes="(max-width: 860px) 100vw, 42vw"
              caption={
                <>
                  <strong>THE TICKET</strong>
                  <span>
                    One-way coupon issued at Portland for $20 cash under the name “Dan Cooper.”
                    The initials D.B. were a press error, not the alias.
                  </span>
                </>
              }
            />
          </div>

          <div className="ed-note__right">
            <div className="ed-note__demands">
              <p className="ed-kicker">What he asked for</p>
              <ol>
                {DEMANDS.map((demand) => (
                  <li key={demand.n}>
                    <span className="ed-note__n" aria-hidden>{demand.n}</span>
                    <div>
                      <p>{demand.text}</p>
                      <small>{demand.note}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <DiagramFrame
              label="Diagram · project original · not a photograph"
              caption="The attaché case as described by Florence Schaffner: a battery, wiring, and eight red cylinders. No device was ever recovered."
              className="ed-note__case"
            >
              <BriefcaseDiagram />
            </DiagramFrame>
          </div>
        </div>

        <div className="ed-note__prose">
          <Prose paragraphs={[NOTE_PROSE.paragraphs[0], NOTE_PROSE.paragraphs[1]]} />
          <blockquote className="ed-quote">
            <p>“{NOTE_PROSE.quote.text}”</p>
            <footer>
              {NOTE_PROSE.quote.attribution}
              <span>{NOTE_PROSE.quote.source}</span>
            </footer>
          </blockquote>
          <Prose paragraphs={[NOTE_PROSE.paragraphs[2], NOTE_PROSE.paragraphs[3]]} />
        </div>

        <div className="ed-margins">
          {NOTE_PROSE.margin.map((note, index) => (
            <MarginNote key={note} label={index === 0 ? 'On the sheet' : 'On the bomb'}>
              {note}
            </MarginNote>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

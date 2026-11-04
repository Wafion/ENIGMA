import { findElement, getChapter, EXPEDITION_DAYS } from '../content';
import { AudioCue, DocumentObject, Figure, Prose } from './primitives';

export function ChapterThree() {
  const chapter = getChapter('chapter-03-the-disappearance');
  if (!chapter) return null;
  const text = findElement(chapter, 'text', 'el-03-text-1');
  const missing = findElement(chapter, 'document', 'el-03-doc-missing');
  const cue = findElement(chapter, 'audio-cue', 'el-03-cue-footsteps');

  return (
    <section
      id={chapter.id}
      className="chapter chapter--dusk"
      data-chapter={chapter.id}
      aria-labelledby="chapter-03-title"
    >
      <div className="chapter-opening chapter-opening--quote" data-reveal>
        <div className="chapter-opening__index" aria-hidden>
          03
        </div>
        <div className="chapter-opening__title">
          <p className="kicker">In-universe chronology · October 1994</p>
          <h2 id="chapter-03-title">{chapter.title}</h2>
          <p className="chapter-opening__dek">{chapter.subtitle}</p>
        </div>
        <blockquote className="opening-quote">
          <p>“{chapter.epigraph?.text}”</p>
          <footer>{chapter.epigraph?.attribution}</footer>
        </blockquote>
      </div>

      <div className="reading-layout reading-layout--narrow" data-reveal>
        <div className="reading-layout__main">{text && <Prose text={text} />}</div>
      </div>

      <section className="cast" aria-labelledby="cast-title">
        <header className="cast__head" data-reveal>
          <p className="kicker">Three actors, their real names</p>
          <h3 id="cast-title">The people who were not missing</h3>
          <p>
            The film’s most durable illusion was a casting decision: Heather Donahue, Joshua
            Leonard and Michael C. Williams appear under their own names, in a story that declares
            them dead. These are contemporary portraits, not film stills.
          </p>
        </header>
        <div className="cast__grid">
          <Figure
            assetId="img-heather-donahue"
            className="figure--portrait"
            caption="Heather Donahue"
            note="Actor and improviser. In the fiction, the director who carries the Hi8 camera."
            position="center 28%"
          />
          <Figure
            assetId="img-joshua-leonard"
            className="figure--portrait figure--portrait-offset"
            caption="Joshua Leonard"
            note="Actor. In the fiction, the cinematographer behind the 16mm CP-16."
            position="center 22%"
          />
          <Figure
            assetId="img-michael-williams"
            className="figure--portrait"
            caption="Michael C. Williams"
            note="Actor. In the fiction, the sound recordist carrying the DAT deck."
            position="center 24%"
          />
        </div>
      </section>

      <section className="expedition" aria-labelledby="expedition-title">
        <header className="expedition__head" data-reveal>
          <p className="kicker">The fictional field log</p>
          <h3 id="expedition-title">Seven days in a circle</h3>
          <p>
            The dates below belong to the story world. The real shoot happened three years later,
            over eight days in October 1997.
          </p>
        </header>
        <ol className="expedition__list">
          {EXPEDITION_DAYS.map((day) => (
            <li key={day.day} data-reveal>
              <span className="expedition__number">{day.day}</span>
              <span className="expedition__date">{day.date}</span>
              <div className="expedition__body">
                <h4>{day.title}</h4>
                <p>{day.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {missing && (
        <DocumentObject document={missing} index="iv" className="document-object--reverse" />
      )}

      {cue && <AudioCue cue={cue} />}
    </section>
  );
}

import { useRef } from 'react';
import { useExperience } from '../ExperienceContext';
import { findElement, getChapter } from '../content';
import { useHorizontalChronology } from '../motion';
import { DocumentObject, Prose } from './primitives';

const DATES = [
  {
    year: '1785',
    title: 'The banishment',
    body: 'Elly Kedward is accused of drawing blood from children and left bound in the Black Hills winter. The following year, her accusers vanish and the settlement of Blair is abandoned.',
  },
  {
    year: '1825',
    title: 'Tappy East Creek',
    body: 'Ten-year-old Eileen Treacle is pulled beneath ankle-deep water. Eleven witnesses describe a pale hand. For thirteen days the creek is choked with oily bundles of sticks.',
  },
  {
    year: '1886',
    title: 'Coffin Rock',
    body: 'A search party is found bound and disembowelled on a flat outcrop. When the sheriff returns with the posse, the bodies have disappeared. The rock keeps the story.',
  },
  {
    year: '1941',
    title: 'Rustin Parr',
    body: 'Seven children are abducted. A hermit confesses to murdering them in his cellar while forcing one child to face the corner. The town burns his house down.',
  },
];

export function ChapterOne() {
  const chapter = getChapter('chapter-01-the-legend');
  const { reducedMotion } = useExperience();
  const chronologyRef = useRef<HTMLElement | null>(null);
  useHorizontalChronology(chronologyRef, reducedMotion);

  if (!chapter) return null;
  const textOne = findElement(chapter, 'text', 'el-01-text-1');
  const textTwo = findElement(chapter, 'text', 'el-01-text-2');
  const quote = findElement(chapter, 'quote', 'el-01-quote-parr');
  const chapbook = findElement(chapter, 'document', 'el-01-doc-1809');
  const coffin = findElement(chapter, 'document', 'el-01-doc-coffin');
  const parr = findElement(chapter, 'document', 'el-01-doc-parr');

  return (
    <section
      id={chapter.id}
      className="chapter chapter--lore"
      data-chapter={chapter.id}
      aria-labelledby="chapter-01-title"
    >
      <div className="chapter-opening chapter-opening--split" data-reveal>
        <div className="chapter-opening__index" aria-hidden>
          01
        </div>
        <div className="chapter-opening__title">
          <p className="kicker">In-universe mythology · constructed 1998–1999</p>
          <h2 id="chapter-01-title">{chapter.title}</h2>
          <p className="chapter-opening__dek">{chapter.subtitle}</p>
        </div>
        <div className="chapter-opening__aside">
          <p>{chapter.introduction}</p>
          {chapter.epigraph && (
            <blockquote className="epigraph">
              <p>“{chapter.epigraph.text}”</p>
              <footer>{chapter.epigraph.attribution}</footer>
            </blockquote>
          )}
        </div>
      </div>

      <div className="reading-layout">
        <div className="reading-layout__main" data-reveal>
          {textOne && <Prose text={textOne} />}
        </div>
        <aside className="reading-layout__margin" data-reveal>
          <p className="kicker">How this chapter is labelled</p>
          <p>
            Every event on this page belongs to the story world. None of it happened in
            Burkittsville. The dates are designed to feel older than the film that invented them.
          </p>
        </aside>
      </div>

      <section
        ref={chronologyRef}
        className="chronology"
        aria-labelledby="chronology-title"
      >
        <div className="chronology__viewport" data-chronology-viewport>
          <div className="chronology__head">
            <p className="kicker">A legend in four dates</p>
            <h3 id="chronology-title">The recurrence cycle</h3>
            <p>Scroll sideways through the invented chronology.</p>
          </div>
          <div className="chronology__track" data-chronology-track>
            {DATES.map((date, index) => (
              <article className="chronology__panel" key={date.year}>
                <span className="chronology__ordinal">{String(index + 1).padStart(2, '0')}</span>
                <p className="chronology__year">{date.year}</p>
                <h4>{date.title}</h4>
                <p>{date.body}</p>
                <span className="chronology__label">In-universe chronology</span>
              </article>
            ))}
            <article className="chronology__panel chronology__panel--end">
              <p className="kicker">The pattern</p>
              <p className="chronology__year chronology__year--small">≈ 55</p>
              <h4>years between each return</h4>
              <p>
                The interval gives the fiction the shape of a regional pathology. It is a
                narrative engine, not a historical record.
              </p>
            </article>
          </div>
        </div>
      </section>

      {chapbook && <DocumentObject document={chapbook} index="i" />}

      {quote && (
        <figure className="standalone-quote" data-reveal>
          <blockquote>
            <p>“{quote.quote}”</p>
          </blockquote>
          <figcaption>
            <span>{quote.speaker}</span>
            <span>{quote.roleOrContext}</span>
            <span>{quote.date} · in-universe mythology</span>
          </figcaption>
        </figure>
      )}

      <div className="reading-layout reading-layout--wide">
        <div className="reading-layout__main" data-reveal>
          {textTwo && <Prose text={textTwo} />}
        </div>
        <aside className="reading-layout__margin reading-layout__margin--note" data-reveal>
          <p className="kicker">What the records show</p>
          <p>
            No colonial township called Blair appears in the Maryland records. Burkittsville was
            laid out in 1824. The 1858 survey map in the next chapter is the real ground beneath
            the story.
          </p>
        </aside>
      </div>

      {coffin && <DocumentObject document={coffin} index="ii" className="document-object--reverse" />}
      {parr && <DocumentObject document={parr} index="iii" />}
    </section>
  );
}

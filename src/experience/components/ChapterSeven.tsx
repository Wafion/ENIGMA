import { findElement, getChapter } from '../content';
import { useExperience } from '../ExperienceContext';
import { FactLedger } from './FactLedger';
import { Figure, Prose } from './primitives';

export function ChapterSeven() {
  const chapter = getChapter('chapter-07-what-remains');
  const { openSources, reducedMotion, setReducedMotion } = useExperience();
  if (!chapter) return null;
  const text = findElement(chapter, 'text', 'el-07-text-1');
  const matrix = findElement(chapter, 'fact-fiction-matrix', 'el-07-matrix');
  const patapsco = findElement(chapter, 'image', 'el-07-img-patapsco');

  return (
    <section
      id={chapter.id}
      className="chapter chapter--remains"
      data-chapter={chapter.id}
      aria-labelledby="chapter-07-title"
    >
      <div className="remains-opening" data-reveal>
        <p className="kicker">Epilogue · critical synthesis</p>
        <h2 id="chapter-07-title">{chapter.title}</h2>
        <p className="remains-opening__dek">{chapter.subtitle}</p>
        <blockquote>
          <p>{chapter.epigraph?.text}</p>
          <footer>Curatorial conclusion · ENIGMA</footer>
        </blockquote>
      </div>

      <div className="reading-layout reading-layout--wide" data-reveal>
        <div className="reading-layout__main">{text && <Prose text={text} />}</div>
        <aside className="reading-layout__margin">
          <p className="kicker">What the archive cannot hold</p>
          <p>
            The Griggs House is gone. The town remains. The film remains. The myth now belongs to
            the people who keep retelling it.
          </p>
        </aside>
      </div>

      {patapsco && (
        <Figure
          assetId={patapsco.assetId}
          className="figure--bleed figure--patapsco"
          caption={patapsco.caption}
          note={patapsco.archivalNote}
          position="center 48%"
        />
      )}

      {matrix && <FactLedger rows={matrix.rows} />}

      <section className="remains-close" aria-labelledby="remains-close-title">
        <div className="remains-close__media" aria-hidden>
          <img
            src="/assets/blair-witch/images/seneca-creek-lake.jpg"
            alt=""
            width={1280}
            height={960}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="remains-close__copy" data-reveal>
          <p className="kicker">Seneca Creek, after the story</p>
          <h3 id="remains-close-title">The woods are still there.</h3>
          <p>
            They do not know the names. They do not close in. The fear was made by people with a
            camera, a schedule and a very good understanding of what an archive looks like.
          </p>
          <button type="button" className="button button--ink" onClick={() => openSources()}>
            Open the source and asset register
          </button>
        </div>
      </section>

      <div className="reading-settings" data-reveal>
        <div>
          <p className="kicker">Reading settings</p>
          <p>
            This essay respects your system’s reduced-motion preference. You can also turn off
            pinned scenes here.
          </p>
        </div>
        <label className="switch-row">
          <span>
            <strong>Reduce motion</strong>
            <small>{reducedMotion ? 'On — still frames' : 'Off — scroll camera enabled'}</small>
          </span>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />
          <span className="switch" aria-hidden />
        </label>
      </div>
    </section>
  );
}

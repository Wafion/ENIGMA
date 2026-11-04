import { findElement, getChapter, PRODUCTION_FIGURES } from '../content';
import { DualTimeline } from './Timeline';
import { Figure, Prose } from './primitives';

export function ChapterSix() {
  const chapter = getChapter('chapter-06-the-real-story');
  if (!chapter) return null;
  const text = findElement(chapter, 'text', 'el-06-text-1');
  const myrick = findElement(chapter, 'image', 'el-06-img-myrick');
  const timeline = findElement(chapter, 'timeline', 'el-06-timeline-dual');

  return (
    <section
      id={chapter.id}
      className="chapter chapter--production"
      data-chapter={chapter.id}
      aria-labelledby="chapter-06-title"
    >
      <div className="production-opening" data-reveal>
        <div className="production-opening__number" aria-hidden>
          06
        </div>
        <div className="production-opening__title">
          <p className="kicker">Production and media history</p>
          <h2 id="chapter-06-title">{chapter.title}</h2>
          <p>{chapter.introduction}</p>
        </div>
        <blockquote className="opening-quote">
          <p>{chapter.epigraph?.text}</p>
          <footer>{chapter.epigraph?.attribution}</footer>
        </blockquote>
      </div>

      <section className="production-figures" aria-label="Production figures">
        {PRODUCTION_FIGURES.map((figure) => (
          <div key={figure.label} data-reveal>
            <strong>{figure.value}</strong>
            <span>{figure.label}</span>
            <small>{figure.note}</small>
          </div>
        ))}
      </section>

      <div className="production-story">
        <div className="production-story__text" data-reveal>
          {text && <Prose text={text} />}
        </div>
        {myrick && (
          <Figure
            assetId={myrick.assetId}
            className="figure--production-portrait"
            caption={myrick.caption}
            note={myrick.archivalNote}
            position="center 25%"
          />
        )}
      </div>

      <section className="method" aria-labelledby="method-title">
        <header data-reveal>
          <p className="kicker">How the shoot worked</p>
          <h3 id="method-title">A route, a crate, a note</h3>
          <p>
            The actors were not given a script. They were given a direction and a destination.
          </p>
        </header>
        <div className="method__diagram" data-reveal>
          <svg viewBox="0 0 900 280" role="img" aria-label="Diagram of the GPS drop-box method: a route of waypoints, a milk crate and a sealed note.">
            <path d="M50 210 C180 60 270 245 390 120 S610 80 720 155 S820 190 860 115" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 7" opacity="0.6" />
            {[['50', '210'], ['235', '150'], ['390', '120'], ['560', '105'], ['720', '155'], ['860', '115']].map(([x, y], index) => (
              <g key={`${x}-${y}`}>
                <circle cx={x} cy={y} r="5" fill="currentColor" opacity={index === 2 ? 1 : 0.5} />
                <text x={Number(x) + 12} y={Number(y) - 12} fontFamily="Geist Mono Variable, monospace" fontSize="10" fill="currentColor" opacity="0.6">
                  {`WP-${String(index + 1).padStart(2, '0')}`}
                </text>
              </g>
            ))}
            <g transform="translate(325 148)">
              <rect x="0" y="0" width="70" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 0 V-22 M58 0 V-22 M12 -22 H58" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M28 10 H42 V34 H28Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            </g>
            <text x="415" y="197" fontFamily="Instrument Sans Variable, sans-serif" fontSize="13" fill="currentColor" opacity="0.75">
              milk crate · bicycle flag · sealed 35mm canister
            </text>
          </svg>
        </div>
        <div className="method__steps">
          <p><span>01</span> A GPS waypoint is left in the woods.</p>
          <p><span>02</span> A note inside a film canister assigns the next beat.</p>
          <p><span>03</span> The crew watches from a distance and changes the weather.</p>
        </div>
      </section>

      <section className="web-artifact-section" aria-labelledby="web-title">
        <div className="web-artifact-section__copy" data-reveal>
          <p className="kicker">A reconstructed marketing artifact</p>
          <h3 id="web-title">The website that behaved like evidence</h3>
          <p>
            In June 1998, BlairWitch.com presented the timeline, “recovered” reels and police
            interviews without once saying that a film was being sold. This is a reconstruction of
            its editorial framing, not a screenshot of the original site.
          </p>
          <p className="web-artifact-section__note">
            Archive captures of the original are held by the Internet Archive. The visual
            treatment below is an ENIGMA reconstruction.
          </p>
        </div>
        <div className="web-artifact" role="img" aria-label="Reconstruction of a 1998 BlairWitch.com page showing a case-file headline and excerpted evidence.">
          <div className="web-artifact__bar">
            <span />
            <span />
            <span />
            <code>http://www.blairwitch.com/evidence/</code>
          </div>
          <div className="web-artifact__page">
            <p className="web-artifact__small">BURKITTSVILLE, MARYLAND · OCTOBER 1994</p>
            <h4>The Blair Witch Project</h4>
            <p className="web-artifact__dek">An investigation into the disappearance of three student filmmakers.</p>
            <div className="web-artifact__rule" />
            <p>
              The following materials were recovered from a duffel bag buried beneath the
              foundation of the Westerfield cabin. The case remains open.
            </p>
            <ul>
              <li>Timeline: 1785–1994</li>
              <li>Recovered reels: 11 cans, 10 tapes</li>
              <li>Interview: Chief of Police, Burkittsville</li>
            </ul>
            <span className="web-artifact__stamp">CASE FILE // NOT A FILM</span>
          </div>
        </div>
      </section>

      {timeline && <DualTimeline items={timeline.items} />}

      <div className="production-close" data-reveal>
        <p className="kicker">The unrepeatable window</p>
        <p>
          The web of 1999 could still feel like a library. It had authority, but not yet a hundred
          million fact-checkers. The Blair Witch Project was built for that exact threshold—and it
          closed behind it.
        </p>
      </div>
    </section>
  );
}

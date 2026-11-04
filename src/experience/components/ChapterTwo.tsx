import { findElement, getChapter } from '../content';
import { Figure, Prose } from './primitives';
import { MapPlate } from './MapPlate';

export function ChapterTwo() {
  const chapter = getChapter('chapter-02-the-town');
  if (!chapter) return null;
  const text = findElement(chapter, 'text', 'el-02-text-1');
  const map = findElement(chapter, 'map', 'el-02-map-1');

  return (
    <section
      id={chapter.id}
      className="chapter chapter--town"
      data-chapter={chapter.id}
      aria-labelledby="chapter-02-title"
    >
      <div className="chapter-opening chapter-opening--right" data-reveal>
        <div className="chapter-opening__index" aria-hidden>
          02
        </div>
        <div className="chapter-opening__title">
          <p className="kicker">Verified history · Frederick County, Maryland</p>
          <h2 id="chapter-02-title">{chapter.title}</h2>
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

      <Figure
        assetId="img-burkittsville-main"
        className="figure--bleed figure--town-hero"
        caption="Main Street and the former Resurrection Reformed Church, Burkittsville."
        note="After the Battle of Crampton’s Gap in September 1862, the church was used as a field hospital. The town has no colonial witch-trial history."
        position="center 38%"
      />

      <div className="reading-layout reading-layout--wide" data-reveal>
        <div className="reading-layout__main">{text && <Prose text={text} />}</div>
        <aside className="reading-layout__margin">
          <p className="kicker">The real ground</p>
          <p>
            Burkittsville is roughly 150 people, a church spire, brick houses, a cemetery and a
            mountain. The film needed the name; it did not need the place.
          </p>
        </aside>
      </div>

      {map && (
        <MapPlate
          title={map.title}
          subtitle={map.subtitle}
          baseMapAssetId={map.baseMapAssetId}
          secondaryMapAssetId={map.secondaryMapAssetId}
          markers={map.markers}
        />
      )}

      <section className="town-pair" aria-label="Two views of Burkittsville">
        <Figure
          assetId="img-burkittsville-cemetery"
          className="figure--pair"
          caption="Burkittsville Union Cemetery, looking toward the fields below South Mountain."
          note="Used in the film’s opening sequence. In 1999, visitors damaged graves while searching for a fictional murderer."
          position="center 55%"
        />
        <Figure
          assetId="img-burkittsville-center"
          className="figure--pair figure--pair-offset"
          caption="The centre of the Burkittsville Historic District."
          note="Listed in its entirety on the National Register of Historic Places in 1975."
          position="center 52%"
        />
      </section>

      <div className="town-statement" data-reveal>
        <p className="kicker">A different history</p>
        <p>
          The village’s defining violence was not supernatural. It was the September 1862 battle at
          the mountain gap above it, and the wounded men carried into its churches.
        </p>
      </div>
    </section>
  );
}

import { findElement, getChapter } from '../content';
import { DocumentObject, Figure } from './primitives';
import { RecordingStudy } from './RecordingStudy';

export function ChapterFive() {
  const chapter = getChapter('chapter-05-the-recordings');
  if (!chapter) return null;
  const deck = findElement(chapter, 'recording-deck', 'el-05-recording-deck');
  const excavation = findElement(chapter, 'document', 'el-05-doc-excavation');
  const camera = findElement(chapter, 'image', 'el-05-img-camcorder');

  return (
    <section
      id={chapter.id}
      className="chapter chapter--tape"
      data-chapter={chapter.id}
      aria-labelledby="chapter-05-title"
    >
      <div className="tape-opening" data-reveal>
        <div className="tape-opening__titles">
          <p className="kicker">Production record · October 1997</p>
          <h2 id="chapter-05-title">{chapter.title}</h2>
          <p>{chapter.introduction}</p>
        </div>
        <div className="tape-opening__gauges" aria-hidden>
          <span>16mm</span>
          <span>Hi8</span>
        </div>
        <blockquote className="opening-quote opening-quote--narrow">
          <p>{chapter.epigraph?.text}</p>
          <footer>{chapter.epigraph?.attribution}</footer>
        </blockquote>
      </div>

      {deck && <RecordingStudy segments={deck.segments} />}

      {camera && (
        <div className="camera-object">
          <Figure
            assetId={camera.assetId}
            className="figure--object"
            caption={camera.caption}
            note={camera.archivalNote}
            position="center 54%"
          />
          <div className="camera-object__copy" data-reveal>
            <p className="kicker">The object that made the other gaze</p>
            <h3>A consumer camera, returned after the shoot</h3>
            <p>
              The production bought a Hi8 camcorder at a Maryland Circuit City for roughly $400,
              used it to record the actors’ unravelling, then returned it for a refund. The
              behind-the-scenes format became the film’s intimate voice.
            </p>
            <p className="camera-object__note">
              The camera shown is a representative 1990s Sony Hi8 model, not the exact unit used
              in production.
            </p>
          </div>
        </div>
      )}

      {excavation && (
        <DocumentObject
          document={excavation}
          index="v"
          className="document-object--reverse"
        />
      )}

      <div className="tape-close" data-reveal>
        <p className="kicker">The unresolved frame</p>
        <p>
          A dropped camera cannot establish what it did not see. The final image is not evidence of
          a witch. It is evidence of a production that knew exactly where to stop.
        </p>
      </div>
    </section>
  );
}

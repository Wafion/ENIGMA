import { useRef } from 'react';
import { useExperience } from '../ExperienceContext';
import { findElement, getChapter } from '../content';
import { useWoodsCamera } from '../motion';
import { AudioCue, Figure, Prose } from './primitives';

export function ChapterFour() {
  const chapter = getChapter('chapter-04-the-woods');
  const { reducedMotion } = useExperience();
  const sectionRef = useRef<HTMLElement | null>(null);
  useWoodsCamera(sectionRef, reducedMotion);

  if (!chapter) return null;
  const text = findElement(chapter, 'text', 'el-04-text-1');
  const mill = findElement(chapter, 'image', 'el-04-img-mill');
  const rock = findElement(chapter, 'image', 'el-04-img-rock-trail');
  const cue = findElement(chapter, 'audio-cue', 'el-04-cue-branch');
  const ascii = findElement(chapter, 'ascii-visual', 'el-04-ascii-forest');

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      className="chapter chapter--woods"
      data-chapter={chapter.id}
      aria-labelledby="chapter-04-title"
    >
      <div className="woods-camera" data-woods-stage>
        <div className="woods-camera__media" data-woods-media>
          <img
            src="/assets/blair-witch/images/seneca-creek-canopy.jpg"
            alt="A dense late-autumn canopy in Seneca Creek State Park, Maryland, with bare trunks rising into a pale sky."
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="woods-camera__veil" aria-hidden />
        <div className="woods-camera__content" data-woods-title>
          <p className="kicker">Production landscape · Seneca Creek State Park</p>
          <h2 id="chapter-04-title">{chapter.title}</h2>
          <p>{chapter.subtitle}</p>
        </div>
        <p className="woods-camera__caption">
          Contemporary photograph, 2022. Not a production still. The film’s forest was staged in
          this park, not in the fictional Black Hills.
        </p>
      </div>

      <div className="reading-layout reading-layout--wide woods-intro" data-reveal>
        <div className="reading-layout__main">{text && <Prose text={text} />}</div>
        <aside className="reading-layout__margin">
          <p className="kicker">The physical set</p>
          <p>
            Six thousand three hundred acres of Maryland state park, a GPS receiver, a milk crate
            and a camera. The labyrinth was administered, not supernatural.
          </p>
        </aside>
      </div>

      {ascii && (
        <section className="ascii-section" aria-labelledby="ascii-title" data-reveal>
          <header>
            <p className="kicker">Production landscape · Seneca Creek</p>
            <h3 id="ascii-title">Tree line</h3>
            <p>{ascii.narrativeContext}</p>
          </header>
          <Figure
            assetId="img-seneca-creek-woods"
            className="figure--woods-compare"
            caption="Late-October hardwood forest in Seneca Creek State Park, Maryland. The film’s forest expedition was staged in this park, where bare canopy and camera grain blurred the distinction between trees and stick effigies."
            note="Seneca Creek State Park, Montgomery County, MD. Photograph by randomduck, CC BY-SA 2.0."
          />
        </section>
      )}

      {mill && (
        <div className="mill-feature">
          <Figure
            assetId={mill.assetId}
            className="figure--mill"
            caption={mill.caption}
            note={mill.archivalNote}
            position="center 45%"
          />
          <div className="mill-feature__copy" data-reveal>
            <p className="kicker">A real ruin in the set</p>
            <h3>Black Rock Mill</h3>
            <p>
              The stone mill was built in 1815. In October 1997 it became a crossing, a marker and
              a place for the crew to disappear behind. The camera was not looking at a haunted
              forest. It was looking at a working landscape with a long history of its own.
            </p>
            <p className="mill-feature__note">
              Black Rock Mill, Seneca Creek State Park. Photograph by Aneta Kaluzna, 2006, CC
              BY-SA 2.5.
            </p>
          </div>
        </div>
      )}

      <section className="night-field" aria-label="The perimeter at night">
        <div className="night-field__copy" data-reveal>
          <p className="kicker">The method</p>
          <p>
            At night the directors moved within thirty yards of the tent: snapping deadwood,
            shaking the canvas, playing recordings of children through concealed speakers. The
            actors’ fear was real. The cause was a production schedule.
          </p>
        </div>
        {cue && <AudioCue cue={cue} className="audio-cue--dark" />}
      </section>

      {rock && (
        <Figure
          assetId={rock.assetId}
          className="figure--bleed figure--forest-footer"
          caption={rock.caption}
          note={rock.archivalNote}
          position="center 58%"
        />
      )}
    </section>
  );
}

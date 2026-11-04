import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { useExperience } from '../ExperienceContext';
import { usePrologueMotion } from '../motion';

export function Prologue() {
  const { reducedMotion } = useExperience();
  const sectionRef = useRef<HTMLElement | null>(null);
  usePrologueMotion(sectionRef, reducedMotion);

  return (
    <section
      id="prologue"
      ref={sectionRef}
      className="prologue"
      data-chapter="prologue"
      aria-labelledby="prologue-title"
    >
      <div className="prologue__stage" data-prologue-stage>
        <div className="prologue__media" data-prologue-media>
          <img
            src="/assets/blair-witch/images/seneca-creek-woods.jpg"
            alt="A late-October hardwood forest in Seneca Creek State Park, Maryland, with pale trunks and a muted canopy."
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="prologue__veil" aria-hidden />
        <div className="prologue__grain" aria-hidden />

        <p className="prologue__location" data-prologue-location>
          <span>Seneca Creek State Park</span>
          <span>Montgomery County, Maryland</span>
          <span className="prologue__location-note">Contemporary location photograph, 2022</span>
        </p>

        <div className="prologue__content">
          <div className="prologue__title" data-prologue-title>
            <p className="kicker">Case 001 · A documentary in eight movements</p>
            <h1 id="prologue-title">
              The Blair Witch
              <em>Incident</em>
            </h1>
            <p className="prologue__dek">
              How a folklore was built, sold as a record, and filmed in real Maryland woods.
            </p>
          </div>

          <blockquote className="prologue__quote" data-prologue-quote>
            <p>
              “In October of 1994, three student filmmakers disappeared in the woods near
              Burkittsville, Maryland while shooting a documentary. A year later their footage was
              found.”
            </p>
            <footer>
              Opening title card, <cite>The Blair Witch Project</cite> (Haxan Films, 1999).
              Film text, not a historical record.
            </footer>
          </blockquote>

          <div className="prologue__end" data-prologue-end>
            <p>
              Begin with the legend the filmmakers invented. Then leave it behind for the town,
              the woods, and the people who were really there.
            </p>
            <a className="button button--paper" href="#chapter-01-the-legend">
              Enter the case
            </a>
            <span className="prologue__end-note">18 min · sound optional · no autoplay</span>
          </div>
        </div>

        <a className="scroll-cue" href="#chapter-01-the-legend" data-scroll-cue>
          <span>Scroll into the case</span>
          <ArrowDown size={15} strokeWidth={1.4} aria-hidden />
        </a>
      </div>
    </section>
  );
}

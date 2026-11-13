import { ArrowUp } from 'lucide-react';
import { useExperience } from '../ExperienceContext';

export function Footer() {
  const { openSources } = useExperience();
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <a className="wordmark wordmark--footer" href="/" aria-label="ENIGMA, home">
          ENIGMA
        </a>
        <p className="site-footer__case">Case 001 · The Blair Witch Incident</p>
        <a className="footer-top" href="#top">
          Back to the beginning <ArrowUp size={14} aria-hidden />
        </a>
      </div>
      <div className="site-footer__grid">
        <div>
          <p className="kicker">About this essay</p>
          <p>
            An independent digital documentary about the construction, marketing and afterlife of
            a modern folklore. Built from licensed photography, public-domain maps, published
            production accounts and project-made reconstructions.
          </p>
        </div>
        <div>
          <p className="kicker">Editorial separation</p>
          <p>
            In-universe mythology is labelled as constructed. Reconstructed documents are project
            originals, not historical evidence. No frame in this essay is presented as a
            copyrighted film still.
          </p>
        </div>
        <div>
          <p className="kicker">Credits and corrections</p>
          <p>
            Photography by Acroterion, randomduck, Aneta Kaluzna, Nabukodinosaure and others is
            used under the licences recorded in the register. ENIGMA is not affiliated with Haxan
            Films, Artisan Entertainment, Lionsgate, the town of Burkittsville or the makers of
            <cite> The Blair Witch Project</cite>.
          </p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <a className="text-link" href="/">
          All cases
        </a>
        <button type="button" className="text-link" onClick={() => openSources()}>
          Sources and assets
        </button>
        <span>Set in Instrument Serif, Newsreader, Instrument Sans and Geist Mono.</span>
        <span>© 2026 ENIGMA · Independent digital archive</span>
      </div>
    </footer>
  );
}

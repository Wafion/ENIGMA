import { ArrowUpRight, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AsciiTerrain } from './AsciiTerrain';
import { InkWordmark } from './InkWordmark';
import { SearchOverlay } from './SearchOverlay';
import { HeroAsciiLiquidMelt } from './HeroAsciiLiquidMelt';
import './home.css';

const TAXONOMY = ['Folklore', 'Media History', 'Place & Memory', 'The Unexplained', 'And More…'];

const TICKER = [
  'Case 001 — The Blair Witch Incident',
  'Prologue + seven chapters',
  'Burkittsville, Maryland',
  'Published MMXXVI',
  'Next subject in research',
];

const clampValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** The circular badge is the hero's pointer: it starts at its anchor beneath
 * the wordmark, then tracks the cursor, and eases home when the pointer leaves
 * the hero. It is decorative for the mouse (so it never intercepts the ink
 * pass or a click) and still reachable with the keyboard.
 */
function CircularBadge() {
  const badgeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const badge = badgeRef.current;
    const hero = badge?.closest<HTMLElement>('.home-hero');
    const frame = badge?.parentElement;
    const root = badge?.closest<HTMLElement>('.home');
    const word = hero?.querySelector<HTMLElement>('.home-hero__wordmark');
    if (!badge || !hero || !frame || !root || !word) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const interactive = fine.matches && !motion.matches;

    /* The anchor is a fixed layout box, so its untransformed centre is a
       stable origin for the offset — no containing-block guesswork. */
    const base = { x: 0, y: 0 };

    const measure = () => {
      const box = badge.getBoundingClientRect();
      base.x = box.left + box.width / 2;
      base.y = box.top + box.height / 2;
    };

    const place = (event: PointerEvent) => {
      if (root.dataset.exit === 'true') return;
      const box = frame.getBoundingClientRect();
      const limit = 8 + badge.offsetWidth / 2;
      const x = clampValue(event.clientX, box.left + limit, box.right - limit) - base.x;
      const y = clampValue(event.clientY, box.top + limit, box.bottom - limit) - base.y;
      badge.style.setProperty('--badge-x', `${x.toFixed(2)}px`);
      badge.style.setProperty('--badge-y', `${y.toFixed(2)}px`);
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || root.dataset.exit === 'true') return;
      measure();
      place(event);
      hero.dataset.cursor = 'hidden';
      badge.dataset.following = 'true';
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (hero.dataset.cursor !== 'hidden') onEnter(event);
      else place(event);
    };

    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || root.dataset.exit === 'true') return;
      delete hero.dataset.cursor;
      badge.dataset.following = 'false';
      badge.style.setProperty('--badge-x', '0px');
      badge.style.setProperty('--badge-y', '0px');
    };

    const onScroll = () => {
      /* When the user scrolls away from the hero, the badge resets to its
         anchor position and cursor is restored — this prevents the badge from
         staying stuck at the bottom of the viewport when scrolling back up. */
      if (root.dataset.exit === 'true') return;
      delete hero.dataset.cursor;
      badge.dataset.following = 'false';
      badge.style.setProperty('--badge-x', '0px');
      badge.style.setProperty('--badge-y', '0px');
    };

    if (interactive) {
      hero.addEventListener('pointerenter', onEnter, { passive: true });
      hero.addEventListener('pointermove', onMove, { passive: true });
      hero.addEventListener('pointerleave', onLeave, { passive: true });
      hero.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', measure, { passive: true });
      measure();
    }

    return () => {
      hero.removeEventListener('pointerenter', onEnter);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      delete hero.dataset.cursor;
      badge.style.removeProperty('--badge-x');
      badge.style.removeProperty('--badge-y');
    };
  }, []);

  return (
    <a
      ref={badgeRef}
      className="home-badge"
      href="/case/001"
      aria-label="Enter Case 001 · The Blair Witch Incident"
    >
      <span className="home-badge__follow" aria-hidden="true">
        <svg className="home-badge__ring" viewBox="0 0 160 160" aria-hidden="true">
          <defs>
            <path
              id="home-badge-path"
              d="M80,80 m-59,0 a59,59 0 1,1 118,0 a59,59 0 1,1 -118,0"
            />
          </defs>
          <text>
            <textPath href="#home-badge-path" startOffset="0">
              Enter Case 001 · The Blair Witch Incident
            </textPath>
          </text>
        </svg>
        <span className="home-badge__disc" aria-hidden="true">
          <ArrowUpRight size={20} strokeWidth={1.3} />
        </span>
      </span>
    </a>
  );
}

function TickerRun({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="home-ticker__run" aria-hidden={hidden || undefined}>
      {TICKER.map((item) => (
        <li key={item} className="mono">
          <span aria-hidden="true">+</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    window.setTimeout(() => searchButtonRef.current?.focus(), 0);
  }, []);

  const handleTriggerCase = useCallback(() => {
    const veil = document.createElement('div');
    veil.className = 'case-veil case-veil--liquid';
    veil.setAttribute('aria-hidden', 'true');
    veil.innerHTML = `
      <div class="case-veil__mist"></div>
      <div class="case-veil__curtain"></div>
    `;
    document.body.appendChild(veil);
    window.setTimeout(() => veil.remove(), 900);
    window.history.pushState({}, '', '/case/001');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  useEffect(() => {
    if (searchOpen) return;
    const onOpenKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      event.preventDefault();
      setSearchOpen(true);
    };
    document.addEventListener('keydown', onOpenKey);
    return () => document.removeEventListener('keydown', onOpenKey);
  }, [searchOpen]);

  return (
    <div className="home">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="home-masthead">
        <nav className="home-masthead__nav home-masthead__nav--start" aria-label="Primary">
          <a href="#catalogue">Discover</a>
          <a href="/case/001">Archive</a>
        </nav>

        <p className="home-masthead__issue mono" aria-hidden="true">
          MMXXVI
        </p>

        <nav className="home-masthead__nav home-masthead__nav--end" aria-label="Secondary">
          <a href="#method">Method</a>
          <a href="#about">About</a>
          <button
            ref={searchButtonRef}
            type="button"
            className="home-masthead__search"
            aria-expanded={searchOpen}
            aria-controls="home-search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={15} strokeWidth={1.5} aria-hidden="true" />
            <span className="visually-hidden">Search the archive</span>
          </button>
        </nav>
      </header>

      <main id="main">
        <section ref={heroRef} className="home-hero" aria-labelledby="home-title">
          <HeroAsciiLiquidMelt heroRef={heroRef} onTriggerCase={handleTriggerCase} />
          <div className="home-hero__frame">
            <span className="home-hero__corner home-hero__corner--tl" aria-hidden="true" />
            <span className="home-hero__corner home-hero__corner--tr" aria-hidden="true" />
            <span className="home-hero__corner home-hero__corner--bl" aria-hidden="true" />
            <span className="home-hero__corner home-hero__corner--br" aria-hidden="true" />

            <span className="home-hero__plus" aria-hidden="true">
              +
            </span>

            <p className="home-hero__tagline mono">
              <span className="home-hero__bracket" aria-hidden="true">
                [
              </span>
              An independent digital archive of myths, records, and the stories we mistake for
              history.
              <span className="home-hero__bracket" aria-hidden="true">
                ]
              </span>
            </p>

            <h1 className="home-hero__wordmark" id="home-title" aria-label="ENIGMA">
              <span className="home-hero__wordmark-glyph" aria-hidden="true">ENIGMA</span>
              <InkWordmark />
            </h1>

            <p className="home-hero__status mono">
              <span className="home-hero__status-dot" aria-hidden="true" />
              <span>Case 001 — The Blair Witch Incident — now showing</span>
            </p>

            <ul className="home-hero__taxonomy" aria-label="Archive scope">
              {TAXONOMY.map((item) => (
                <li key={item}>
                  <span className="home-hero__taxonomy-item mono" data-glyph="+">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="home-hero__landscape">
              <AsciiTerrain />
            </div>

            <CircularBadge />
          </div>

          <div className="home-hero__ticker" aria-label="Latest from the archive">
            <p className="home-hero__ticker-label mono">Latest</p>
            <div className="home-hero__ticker-viewport">
              <div className="home-hero__ticker-track">
                <TickerRun />
                <TickerRun hidden />
              </div>
            </div>
          </div>
        </section>

        <section className="home-catalogue" id="catalogue" aria-labelledby="catalogue-title">
          <div className="home-section-head">
            <p className="home-section-index mono">01 — Catalogue</p>
            <h2 id="catalogue-title">Cases, in the order they were opened.</h2>
            <p className="home-section-lede">
              One case is published. The next slot stays open until a subject and its sources can
              carry the weight of a case.
            </p>
          </div>

          <div className="home-cases">
            <a className="home-case" href="/case/001">
              <span className="home-case__no mono">001</span>

              <span className="home-case__media">
                <img
                  src="/assets/blair-witch/images/seneca-creek-woods.jpg"
                  alt="Late-October hardwood forest in Seneca Creek State Park, Maryland"
                  loading="lazy"
                  decoding="async"
                />
                <span className="home-case__credit mono">Photo: randomduck · CC BY-SA 2.0</span>
              </span>

              <span className="home-case__body">
                <span className="home-case__status">
                  <span className="home-case__status-dot" aria-hidden="true" />Now showing
                </span>
                <span className="home-case__title">The Blair Witch Incident</span>
                <span className="home-case__desc">
                  How a folklore was built, sold as a record, and filmed in the real woods of
                  Maryland.
                </span>
              </span>

              <span className="home-case__meta mono">
                <span>Prologue + seven chapters</span>
                <span>18 min</span>
                <span>2026</span>
              </span>

              <span className="home-case__enter" aria-hidden="true">
                Enter the case
                <ArrowUpRight size={18} strokeWidth={1.3} />
              </span>
            </a>

            <div className="home-case home-case--research">
              <span className="home-case__no mono">002</span>

              <span className="home-case__media home-case__media--empty" aria-hidden="true">
                <span className="mono">NOT YET PUBLISHED</span>
              </span>

              <span className="home-case__body">
                <span className="home-case__status home-case__status--quiet">In research</span>
                <span className="home-case__title">Subject not yet announced</span>
                <span className="home-case__desc">
                  No next case is announced. This slot is reserved until a subject, a place and its
                  sources can be verified.
                </span>
              </span>

              <span className="home-case__meta mono">
                <span>Provenance review</span>
                <span>Open</span>
              </span>

              <span className="home-case__enter home-case__enter--quiet" aria-hidden="true">
                Not yet published
              </span>
            </div>
          </div>
        </section>

        <section className="home-method" id="method" aria-labelledby="method-title">
          <div className="home-section-head home-section-head--method">
            <p className="home-section-index mono">02 — Method</p>
            <h2 id="method-title">We show you where the story was made.</h2>
            <p className="home-section-lede">
              A myth is evidence of belief, not proof of an event. ENIGMA keeps the two in view at
              once — and labels the join.
            </p>
          </div>

          <div className="home-method__grid">
            <article className="home-principle">
              <span className="home-principle__no mono">01</span>
              <h3>Record, reconstruction, invention</h3>
              <p>
                Every image and document carries its status. A prop is never allowed to pass as an
                archive, and a legend is never allowed to pass as fact.
              </p>
            </article>
            <article className="home-principle">
              <span className="home-principle__no mono">02</span>
              <h3>The source stays visible</h3>
              <p>
                Citations open into a register of documents, photographs and licences. The limits
                of each source are stated as plainly as its use.
              </p>
            </article>
            <article className="home-principle">
              <span className="home-principle__no mono">03</span>
              <h3>Sound and motion are offered</h3>
              <p>
                Nothing plays on load. Sound waits for consent, and reduced motion replaces pinned
                sequences with the still frame.
              </p>
            </article>
          </div>
        </section>

        <section className="home-about" id="about" aria-labelledby="about-title">
          <div className="home-section-head home-section-head--about">
            <p className="home-section-index mono">03 — About</p>
            <h2 id="about-title">The stories we mistake for history.</h2>
            <p className="home-section-lede">
              ENIGMA is a documentary exhibition. Each case follows one narrative from its first
              telling to the evidence it left behind, and stops wherever the record stops.
            </p>
          </div>

          <div className="home-about__body">
            <p>
              A case is not a verdict. It is a reconstruction: the documents that survive, the
              people who repeated them, and the place that still carries the story. Where a source
              cannot be verified, the case says so rather than filling the gap.
            </p>
            <p>
              Case 001, <em>The Blair Witch Incident</em>, is the only published case. The next slot
              remains open until a subject and its sources can carry the weight of a case.
            </p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer__top">
          <a className="home-wordmark home-wordmark--footer" href="/" aria-label="ENIGMA, home">
            ENIGMA
          </a>
          <p className="home-footer__line">
            An independent documentary exhibition. Case 001 is open now.
          </p>
          <nav className="home-footer__nav" aria-label="Footer">
            <a href="#catalogue">Cases</a>
            <a href="#method">Method</a>
            <a href="#about">About</a>
            <a href="/case/001">
              Case 001 <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </nav>
        </div>
        <div className="home-footer__bottom mono">
          <span>© 2026 ENIGMA · editorial project</span>
          <span>Instrument Serif · Newsreader · Instrument Sans · Geist Mono</span>
        </div>
      </footer>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
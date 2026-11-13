import { ArrowUpRight, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArchiveEgg } from './ArchiveEgg';
import { AsciiTerrain } from './AsciiTerrain';
import { EnigmaSymbol } from '../components/enigma/EnigmaBrand';
import { InkWordmark } from './InkWordmark';
import { SearchOverlay } from './SearchOverlay';
import { HeroAsciiLiquidMelt } from './HeroAsciiLiquidMelt';
import { useHomeFx } from './homeFx';
import './home.css';

const TAXONOMY = ['Folklore', 'Media History', 'Place & Memory', 'The Unexplained', 'And More…'];

const TICKER = [
  'Case 001 — The Blair Witch Incident',
  'Case 002 — The Cooper File',
  'Published MMXXVI',
  'Two cases open',
];

const FOOTER_FACES = [
  { key: 'serif', name: 'Instrument Serif', sample: 'Aa' },
  { key: 'body', name: 'Newsreader', sample: 'Ag' },
  { key: 'ui', name: 'Instrument Sans', sample: 'Rg' },
  { key: 'mono', name: 'Geist Mono', sample: '01' },
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

function TickerRun({ hidden = false, repeat = 1 }: { hidden?: boolean; repeat?: number }) {
  const items = Array.from({ length: repeat }, () => TICKER).flat();
  return (
    <ul className="home-ticker__run" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="mono">
          <span aria-hidden="true">+</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [eggOpen, setEggOpen] = useState(false);
  const [yearPinned, setYearPinned] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const issueTaps = useRef({ count: 0, at: 0 });

  useHomeFx(rootRef);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    window.setTimeout(() => searchButtonRef.current?.focus(), 0);
  }, []);

  const closeEgg = useCallback(() => setEggOpen(false), []);

  const handleIssue = () => {
    const now = performance.now();
    const taps = issueTaps.current;
    taps.count = now - taps.at < 900 ? taps.count + 1 : 1;
    taps.at = now;
    setYearPinned((pinned) => !pinned);
    if (taps.count >= 5) {
      taps.count = 0;
      setEggOpen(true);
    }
  };

  const handleTriggerCase = useCallback(() => {
    sessionStorage.setItem('enigma:case-ascii-open', 'true');
    window.history.pushState({ fromMelt: true }, '', '/case/001');
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

  useEffect(() => {
    if (searchOpen || eggOpen) return;

    let buffer = '';
    const onSecretKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }
      if (event.key.length !== 1) {
        buffer = '';
        return;
      }
      buffer = `${buffer}${event.key.toLowerCase()}`.slice(-6);
      if (buffer === 'enigma') {
        buffer = '';
        setEggOpen(true);
      }
    };

    window.addEventListener('keydown', onSecretKey);
    return () => window.removeEventListener('keydown', onSecretKey);
  }, [searchOpen, eggOpen]);

  return (
    <div className="home" ref={rootRef}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="home-masthead">
        <nav className="home-masthead__nav home-masthead__nav--start" aria-label="Primary">
          <a href="#catalogue">Discover</a>
          <a href="/archive">Archive</a>
        </nav>

        <button
          type="button"
          className="home-masthead__issue mono"
          data-year={yearPinned ? 'true' : 'false'}
          aria-pressed={yearPinned}
          aria-label={
            yearPinned
              ? 'Issue year: 2026. Activate to show MMXXVI.'
              : 'Issue year: MMXXVI. Activate to show 2026.'
          }
          onClick={handleIssue}
        >
          <span aria-hidden="true">MMXXVI</span>
          <span aria-hidden="true">2026</span>
        </button>

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
              <span>Case 001 — The Blair Witch Incident — open</span>
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
                <TickerRun repeat={4} />
                <TickerRun hidden repeat={4} />
              </div>
            </div>
          </div>
        </section>

        <section className="home-catalogue" id="catalogue" aria-labelledby="catalogue-title">
          <div className="home-section-head" data-reveal="out">
            <p className="home-section-index mono" data-decode>
              01 — Catalogue
            </p>
            <h2 id="catalogue-title">Cases, in the order they were opened.</h2>
            <p className="home-section-lede">
              Two cases are open. Each is built from primary records, reported claims and labelled
              reconstruction — never from a legend standing in for evidence.
            </p>
          </div>

          <div className="home-cases">
            <a
              className="home-case"
              href="/case/001"
              data-reveal="out"
              data-hover-scramble=""
            >
              <span className="home-case__no mono" data-scramble="" aria-hidden="true">
                001
              </span>

              <span className="home-case__media">
                <span className="home-case__frame">
                  <img
                    src="/assets/blair-witch/images/seneca-creek-woods.jpg"
                    alt="Late-October hardwood forest in Seneca Creek State Park, Maryland"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home-case__scan" aria-hidden="true" />
                  <span className="home-case__readout mono" aria-hidden="true">
                    <span>Frame 001</span>
                    <span>Seneca Creek · 39°17′N</span>
                  </span>
                </span>
                <span className="home-case__credit mono">
                  Photo: randomduck ·{' '}
                  <span className="home-case__license">CC BY-SA 2.0</span>
                </span>
              </span>

              <span className="home-case__body">
                <span className="home-case__status">
                  <span className="home-case__status-dot" aria-hidden="true" />Open
                </span>
                <span className="home-case__title">The Blair Witch Incident</span>
                <span className="home-case__desc">
                  How a folklore was built, sold as a record, and filmed in the real woods of
                  Maryland.
                </span>
                <span className="home-case__meta mono">
                  <span>Prologue + seven chapters</span>
                  <span>18 min</span>
                  <span>2026</span>
                </span>
              </span>

              <span className="home-case__enter" aria-hidden="true">
                Enter the case
                <ArrowUpRight size={18} strokeWidth={1.3} />
              </span>
            </a>

            <a
              className="home-case"
              href="/case/002"
              data-reveal="out"
              data-hover-scramble=""
            >
              <span className="home-case__no mono" data-scramble="" aria-hidden="true">
                002
              </span>

              <span className="home-case__media">
                <span className="home-case__frame">
                  <img
                    src="/assets/db-cooper/images/northwest-727-n467us-1972.jpg"
                    alt="Northwest Orient Boeing 727-51, registration N467US, photographed in 1972"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="home-case__scan" aria-hidden="true" />
                  <span className="home-case__readout mono" aria-hidden="true">
                    <span>Frame 002</span>
                    <span>Flight 305 · 45°57′N</span>
                  </span>
                </span>
                <span className="home-case__credit mono">
                  Photo: Clint Groves ·{' '}
                  <span className="home-case__license">GFDL 1.2</span>
                </span>
              </span>

              <span className="home-case__body">
                <span className="home-case__status">
                  <span className="home-case__status-dot" aria-hidden="true" />Open
                </span>
                <span className="home-case__title">The Cooper File</span>
                <span className="home-case__desc">
                  A ticket under a false name, a Boeing 727 into the dark, and fifty years of
                  looking for a man who may not have survived the jump.
                </span>
                <span className="home-case__meta mono">
                  <span>Sixteen movements</span>
                  <span>28 min</span>
                  <span>2026</span>
                </span>
              </span>

              <span className="home-case__enter" aria-hidden="true">
                Enter the case
                <ArrowUpRight size={18} strokeWidth={1.3} />
              </span>
            </a>
          </div>
        </section>

        <section className="home-method" id="method" aria-labelledby="method-title">
          <div className="home-method__meta mono" data-reveal="out">
            <span data-decode>02 — Method</span>
            <span className="home-method__meta-rule" aria-hidden="true" />
            <span>Protocol · applied to every case</span>
          </div>

          <div className="home-method__head" data-reveal="out">
            <h2 id="method-title">We show you where the story was made.</h2>
            <p className="home-method__lede">
              A myth is evidence of belief, not proof of an event. ENIGMA keeps the two in view at
              once — and labels the join.
            </p>
          </div>

          <ol className="home-method__ledger">
            <li className="home-method__item" data-reveal="out" data-hover-scramble="">
              <span className="home-method__no" aria-hidden="true" data-scramble="">
                01
              </span>
              <div className="home-method__item-body">
                <h3>Record, reconstruction, invention</h3>
                <p>
                  Every image and document carries its status. A prop is never allowed to pass as an
                  archive, and a legend is never allowed to pass as fact.
                </p>
              </div>
              <span className="home-method__tag mono" data-scramble="">
                Status · labelled
              </span>
            </li>

            <li className="home-method__item" data-reveal="out" data-hover-scramble="">
              <span className="home-method__no" aria-hidden="true" data-scramble="">
                02
              </span>
              <div className="home-method__item-body">
                <h3>The source stays visible</h3>
                <p>
                  Citations open into a register of documents, photographs and licences. The limits
                  of each source are stated as plainly as its use.
                </p>
              </div>
              <span className="home-method__tag mono" data-scramble="">
                Origin · cited
              </span>
            </li>

            <li className="home-method__item" data-reveal="out" data-hover-scramble="">
              <span className="home-method__no" aria-hidden="true" data-scramble="">
                03
              </span>
              <div className="home-method__item-body">
                <h3>Sound and motion are offered</h3>
                <p>
                  Nothing plays on load. Sound waits for consent, and reduced motion replaces
                  pinned sequences with the still frame.
                </p>
              </div>
              <span className="home-method__tag mono" data-scramble="">
                Access · optional
              </span>
            </li>
          </ol>

          <p className="home-method__note mono" data-reveal="out">
            <span>Applied in full to Case 001 — The Blair Witch Incident.</span>
            <a href="/case/001">
              Open the case
              <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </p>
        </section>

        <section className="home-about" id="about" aria-labelledby="about-title">
          <div className="home-section-head home-section-head--about" data-reveal="out">
            <p className="home-section-index mono" data-decode>
              03 — About
            </p>
            <h2 id="about-title">The stories we mistake for history.</h2>
            <p className="home-section-lede">
              ENIGMA is an independent digital archive. Each case follows one narrative from its
              first telling to the evidence it left behind, and stops wherever the record stops.
            </p>
          </div>

          <div className="home-about__body" data-reveal="out">
            <p>
              A case is not a verdict. It is a reconstruction: the documents that survive, the
              people who repeated them, and the place that still carries the story. Where a source
              cannot be verified, the case says so rather than filling the gap.
            </p>
            <p>
              Two cases are open: <em>The Blair Witch Incident</em> and <em>The Cooper File</em>.
              Both are published in full — sources, licences, contradictions and all — and the
              archive grows only when a subject and its evidence can carry the weight of a case.
            </p>

            <div className="home-about__trace mono" aria-hidden="true">
              <span className="home-about__trace-label">Record · 001</span>
              <pre className="home-about__trace-box">
                {`+---------------------------+
|  [x]  source  . verified  |
|  [ ]  claim  . unverified |
|  [~]  gap     . kept open |
+---------------------------+`}
              </pre>
              <span className="home-about__trace-note">
                Status · stopping where the record stops
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-footer__meta mono" data-reveal="out">
          <span data-decode>04 — End matter</span>
          <span className="home-footer__meta-rule" aria-hidden="true" />
          <span aria-hidden="true">Independent digital archive · MMXXVI</span>
        </div>

        <div className="home-footer__grid" data-reveal="out">
          <div className="home-footer__brand">
            <p className="home-footer__line">
              An independent digital archive. Each case follows one story from its first telling to
              the evidence it left behind.
            </p>
            <a className="home-footer__cta" href="/case/001">
              Enter Case 001
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <p className="home-footer__status mono">
              <span className="home-footer__status-dot" aria-hidden="true" />
              Case 001 open · Case 002 open
            </p>
          </div>

          <nav className="home-footer__col" aria-label="Footer">
            <p className="home-footer__col-title mono">Sections</p>
            <a href="#catalogue">Cases</a>
            <a href="/archive">Archive</a>
            <a href="#method">Method</a>
            <a href="#about">About</a>
          </nav>

          <div className="home-footer__col">
            <p className="home-footer__col-title mono">Case files</p>
            <a href="/case/001">001 — Blair Witch</a>
            <a href="/case/002">002 — The Cooper File</a>
          </div>

          <div className="home-footer__col home-footer__col--faces">
            <p className="home-footer__col-title mono">Colophon</p>
            {FOOTER_FACES.map((face) => (
              <span className="home-footer__face" data-face={face.key} key={face.name}>
                <span className="home-footer__face-name">{face.name}</span>
                <span className="home-footer__face-sample" aria-hidden="true">
                  {face.sample}
                </span>
              </span>
            ))}
          </div>
        </div>

        <a
          className="home-footer__signature"
          href="/"
          aria-label="ENIGMA, home"
          data-reveal="out"
        >
          <EnigmaSymbol tone="light" className="home-footer__outro-mark" />
        </a>

        <div className="home-footer__bottom mono" data-reveal="out">
          <span>© 2026 ENIGMA · Independent digital archive</span>
          <span aria-hidden="true">All sources named</span>
          <a className="home-footer__top-link" href="#home-title">
            Back to top
            <span className="home-footer__top-arrow" aria-hidden="true">
              ↑
            </span>
          </a>
        </div>
      </footer>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <ArchiveEgg open={eggOpen} onClose={closeEgg} />
    </div>
  );
}
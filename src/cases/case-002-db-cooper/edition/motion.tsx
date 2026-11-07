import { type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import {
  DESKTOP,
  WIDE,
  EXPO,
  all,
  one,
  prefersReducedMotion,
  ScrollScene,
  PinnedScene,
  CameraReveal,
  DepthLayer,
  EvidenceReveal,
  DocumentFocus,
  TimelineScrub,
  KineticHeadline,
  ChapterTransition,
  drawPaths,
  maskReveal,
} from './motionPrimitives';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin, Flip);

export { prefersReducedMotion };

/* -------------------------------------------------------------------------- */
/* 00 · Cover — the camera pulls back from the airframe                       */
/* -------------------------------------------------------------------------- */

function coverScene(root: ParentNode) {
  const cover = one(root, '#dbc-prologue');
  if (!cover) return;

  const title = one(cover, '.ed-cover__title');
  const media = one(cover, '.ed-cover__media');
  const frame = one(cover, '.ed-cover__figure .ed-figure__frame');
  const plate = one(cover, '.ed-cover__figure img');
  const date = one(cover, '.ed-cover__date');
  const top = one(cover, '.ed-cover__top');

  // A re-run of this scene (dev hot reload, restored page) can leave inline
  // transforms and clips from the previous run on the cover children. They
  // would sit on top of the CSS headline animation, so start from the
  // authored styles.
  gsap.set(
    all(
      cover,
      '.ed-cover__marks > *, .ed-cover__subrow > *, .ed-cover__opening, .ed-cover__foot, .ed-cover__date, .ed-cover__media, .ed-cover__figure .ed-figure__frame, .ed-cover__figure img, .ed-cover__title .ed-word__in',
    ),
    { clearProps: 'all' },
  );

  const intro = gsap.timeline({ defaults: { ease: EXPO }, delay: 0.1 });

  intro.fromTo(
    all(cover, '.ed-cover__marks > *'),
    { y: -12, clipPath: 'inset(0 0 100% 0)' },
    { y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.7, stagger: 0.08 },
    0,
  );

  // The headline's rise is a CSS animation (motion.css), not a tween: it owns
  // its own start state, so an interrupted scene can never leave the cover
  // title parked below its mask with only the letter tops showing.

  if (media) {
    intro.fromTo(
      media,
      { clipPath: 'inset(0 0 0 100%)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power4.inOut' },
      0.42,
    );
  }

  intro.fromTo(
    all(cover, '.ed-cover__subrow > *'),
    { y: 18, clipPath: 'inset(0 0 100% 0)' },
    { y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.8, stagger: 0.1 },
    0.55,
  );

  intro.fromTo(
    one(cover, '.ed-cover__opening'),
    { y: 14, clipPath: 'inset(0 100% 0 0)' },
    { y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.8 },
    0.74,
  );

  if (date) intro.fromTo(date, { opacity: 0 }, { opacity: 1, duration: 0.9 }, 0.82);

  const foot = one(cover, '.ed-cover__foot');
  if (foot) {
    intro.fromTo(
      foot,
      { y: 18, clipPath: 'inset(0 0 100% 0)' },
      { y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.75, ease: EXPO },
      0.95,
    );
  }

  // A throttled tab pauses the ticker mid-scene and leaves the headline parked
  // below its mask. Timers still fire when rAF does not, so the cover is
  // allowed to settle instead of waiting for a frame that never comes.
  const release = window.setTimeout(() => {
    if (intro.parent && intro.progress() < 1) intro.progress(1);
  }, 4000);
  intro.eventCallback('onComplete', () => window.clearTimeout(release));

  // The opening shot: start tight on the aft stair, then let the crop widen
  // until the full airframe occupies the plate. The scroll then continues the
  // pull-back while the title and date move on separate depth planes.
  if (plate) {
    intro.fromTo(
      plate,
      { scale: 1.42, xPercent: 5, yPercent: 3, transformOrigin: '76% 60%' },
      { scale: 1, xPercent: 0, yPercent: 0, duration: 1.85, ease: 'expo.out' },
      0.42,
    );
  }

  // The camera moves the frame, never the plate itself: scaling the media also
  // scaled the caption printed inside the image and pushed it off the page.
  if (frame) {
    CameraReveal(cover, frame, {
      fromScale: 1.045,
      toY: -1.2,
      origin: '70% 55%',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.7,
    });
  }

  if (title) {
    all(title, '.ed-word').forEach((word, index) => {
      DepthLayer(cover, word, {
        toX: index === 0 ? -3 : 3,
        start: 'top top',
        end: 'bottom top',
      });
    });
  }

  if (top) DepthLayer(cover, top, { toY: -2.4, start: 'top top', end: 'bottom top' });
  if (date) DepthLayer(cover, date, { toY: -6, start: 'top top', end: 'bottom top' });
}

/* -------------------------------------------------------------------------- */
/* Shared chapter head                                                        */
/* -------------------------------------------------------------------------- */

function headScene(head: HTMLElement) {
  const title = one(head, '.ed-head__title');
  const lede = one(head, '.ed-head__lede');

  if (title) KineticHeadline(head, title, { start: 'top 83%', stagger: 0.07 });

  // The title is the gesture. Kickers, folios, asides and body copy stay put:
  // a chapter should feel like a cut, not a stack of UI entrances.
  if (!lede) return;

  ScrollScene(
    head,
    (timeline) => {
      timeline.fromTo(
        lede,
        { y: 18, clipPath: 'inset(0 0 100% 0)' },
        { y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: EXPO },
        0,
      );
    },
    { start: 'top 82%' },
  );
}

/* -------------------------------------------------------------------------- */
/* 01 · The Man — the viewfinder keeps tracking                               */
/* -------------------------------------------------------------------------- */

function manScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-man');
  if (!chapter) return;

  const sketches = all(chapter, '.ed-man__sketch');
  if (sketches.length) {
    EvidenceReveal(one(chapter, '.ed-man__sketches'), sketches, {
      start: 'top 84%',
      x: 18,
      stagger: 0.12,
    });
  }

  const age = one(chapter, '.ed-man__age');
  if (age) EvidenceReveal(age, [age], { start: 'top 88%', x: 24 });

  const statement = one(chapter, '.ed-statement');
  if (statement) maskReveal(statement, statement, { start: 'top 86%', from: 'left' });

  const quote = one(chapter, '.ed-quote');
  if (quote) maskReveal(quote, quote, { start: 'top 86%', from: 'up' });
}

function manViewfinder(root: ParentNode) {
  const plate = one(root, '.ed-man__plate');
  const finder = one<HTMLElement>(root, '[data-man-finder]');
  const label = one(root, '[data-man-finder-label]');
  if (!plate || !finder) return;

  const shots = [
    one(root, '.ed-man__sketch.is-a'),
    one(root, '.ed-man__sketch.is-b'),
    one(root, '.ed-man__age'),
  ].filter((shot): shot is HTMLElement => Boolean(shot));

  if (shots.length < 2) return;

  const labels = ['COMPOSITE A · 1971', 'COMPOSITE B · 1973', 'AGE PROJECTION · c.2007'];

  const rectAt = (index: number) => {
    const shot = shots[Math.min(index, shots.length - 1)];
    let x = 0;
    let y = 0;
    let current: HTMLElement | null = shot;
    while (current && current !== plate) {
      x += current.offsetLeft;
      y += current.offsetTop;
      current = current.offsetParent as HTMLElement | null;
    }
    return {
      x,
      y,
      width: shot.offsetWidth,
      height: shot.offsetHeight,
    };
  };

  gsap.set(finder, { ...rectAt(0), opacity: 0, visibility: 'visible' });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: one(root, '#dbc-the-man'),
      start: 'top 58%',
      end: 'bottom 82%',
      scrub: 0.55,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (!label) return;
        const index = self.progress < 0.35 ? 0 : self.progress < 0.75 ? 1 : 2;
        const text = labels[Math.min(index, shots.length - 1)];
        if (label.textContent !== text) label.textContent = text;
      },
    },
  });

  timeline.fromTo(
    finder,
    {
      x: () => rectAt(0).x,
      y: () => rectAt(0).y,
      width: () => rectAt(0).width,
      height: () => rectAt(0).height,
      opacity: 0,
    },
    {
      x: () => rectAt(0).x,
      y: () => rectAt(0).y,
      width: () => rectAt(0).width,
      height: () => rectAt(0).height,
      opacity: 1,
      duration: 0.1,
      ease: 'none',
    },
    0,
  );

  if (shots[1]) {
    timeline.to(
      finder,
      {
        x: () => rectAt(1).x,
        y: () => rectAt(1).y,
        width: () => rectAt(1).width,
        height: () => rectAt(1).height,
        duration: 0.14,
        ease: 'power2.inOut',
      },
      0.28,
    );
  }

  if (shots[2]) {
    timeline.to(
      finder,
      {
        x: () => rectAt(2).x,
        y: () => rectAt(2).y,
        width: () => rectAt(2).width,
        height: () => rectAt(2).height,
        duration: 0.14,
        ease: 'power2.inOut',
      },
      0.68,
    );
  }

  timeline.to({}, { duration: 0.18 }, 0.82);
}

/* -------------------------------------------------------------------------- */
/* 02 · The Note — document focus                                             */
/* -------------------------------------------------------------------------- */

function noteScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-note');
  if (!chapter) return;

  const stage = one(chapter, '.ed-note__stage');
  const sheet = one(chapter, '.ed-note__sheet');
  const marks = all<HTMLElement>(chapter, '.ed-note__text mark');
  const focus = one<HTMLElement>(chapter, '[data-note-focus]');
  const annotations = all(chapter, '.ed-note__annotations p');

  DocumentFocus(stage, sheet, marks, focus, annotations, {
    start: 'top 68%',
    end: 'top 8%',
    scrub: 0.55,
  });

  const ticket = one(chapter, '.ed-note__ticket');
  if (ticket) EvidenceReveal(ticket, [ticket], { start: 'top 88%', x: 20, y: 12 });

  const caseFigure = one(chapter, '.ed-note__case');
  if (caseFigure) {
    drawPaths(all(caseFigure, '.ed-briefcase path'), {
      duration: 1.25,
      stagger: 0.04,
      scrollTrigger: { trigger: caseFigure, start: 'top 84%', once: true },
    });
  }

  const quote = one(chapter, '.ed-note__prose .ed-quote');
  if (quote) maskReveal(quote, quote, { start: 'top 86%', from: 'up' });
}

/* -------------------------------------------------------------------------- */
/* 03 · Flight — the aircraft camera and the trajectory camera                */
/* -------------------------------------------------------------------------- */

const CLOCK_STOPS: Array<[number, number]> = [
  [14 * 60 + 50, 0],
  [15 * 60, 0.22],
  [17 * 60 + 30, 0.48],
  [19 * 60 + 40, 0.74],
  [20 * 60 + 13, 1],
];

function clockAt(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  for (let index = 1; index < CLOCK_STOPS.length; index += 1) {
    const [previousMinutes, previousAt] = CLOCK_STOPS[index - 1];
    const [minutes, at] = CLOCK_STOPS[index];
    if (t <= at) {
      const local = (t - previousAt) / Math.max(0.0001, at - previousAt);
      const value = Math.round(previousMinutes + (minutes - previousMinutes) * local);
      return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
    }
  }
  return '20:13';
}

function flightScene(root: ParentNode) {
  const chapter = one(root, '#dbc-flight-305');
  if (!chapter) return;

  const diagram = one(chapter, '.ed-flight__diagram');
  if (diagram) {
    drawPaths(all(diagram, '.ed-aircraft path'), {
      duration: 1.8,
      stagger: 0.015,
      scrollTrigger: { trigger: diagram, start: 'top 80%', once: true },
    });

    const callouts = all(diagram, '.ed-aircraft__callout text');
    if (callouts.length) {
      ScrollScene(
        diagram,
        (timeline) => {
          timeline.fromTo(
            callouts,
            { opacity: 0, x: -5 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.05 },
            0.4,
          );
        },
        { start: 'top 80%' },
      );
    }
  }

  const subtitle = one(chapter, '.ed-flight__subtitle');
  if (subtitle) maskReveal(subtitle, subtitle, { start: 'top 86%', from: 'up' });

  const crew = one(chapter, '.ed-flight__crew');
  if (crew) {
    CameraReveal(crew, one(crew, 'img'), {
      fromScale: 1.12,
      origin: '55% 45%',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
    });
  }

  const paper = one(chapter, '.ed-flight__paper');
  if (paper) {
    ChapterTransition(paper, paper, {
      from: 'inset(100% 0 0 0)',
      start: 'top 96%',
      end: 'top 46%',
      scrub: 0.7,
      scale: 1.015,
      y: 24,
    });
  }
}

function flightCamera(root: ParentNode) {
  const chapter = one(root, '#dbc-flight-305');
  if (!chapter) return;
  const diagram = one(chapter, '.ed-flight__diagram');
  if (!diagram) return;
  const aircraft = one(diagram, '.ed-aircraft');
  if (!aircraft) return;

  CameraReveal(diagram, aircraft, {
    fromScale: 1.35,
    fromX: 6,
    fromY: 4,
    origin: '82% 70%',
    start: 'top 82%',
    end: 'top 28%',
    scrub: 0.7,
  });
}

const FLIGHT_PHASES = [
  { at: 0, label: '01 · Departure · PDX' },
  { at: 0.22, label: '02 · Exchange · SEA' },
  { at: 0.58, label: '03 · Southbound · V-23' },
  { at: 0.88, label: '04 · Inferred exit · 20:13' },
];

function trajectoryTimeline(scene: HTMLElement, scrubbed: boolean) {
  const route = one<SVGPathElement>(scene, '[data-flight-route]');
  if (!route) return null;

  const plane = one(scene, '[data-flight-plane]');
  const world = one(scene, '[data-flight-world]');
  const clock = one(scene, '[data-flight-clock]');
  const phase = one(scene, '[data-flight-phase]');
  const events = all(scene, '[data-flight-event]');
  const log = all(scene, '.ed-trajectory__log li');
  const jump = one<SVGPathElement>(scene, '[data-flight-jump]');
  const field = one(scene, '[data-flight-field]');

  const length = route.getTotalLength();
  gsap.set(route, { strokeDasharray: length, strokeDashoffset: length * 0.96 });

  if (jump) {
    const jumpLength = jump.getTotalLength();
    gsap.set(jump, { strokeDasharray: jumpLength, strokeDashoffset: jumpLength });
  }

  if (plane) gsap.set(plane, { opacity: 0 });
  if (events.length) {
    gsap.set(events, { opacity: 0, y: 6 });
    gsap.set(events[0], { opacity: 1, y: 0 });
  }
  if (log.length) gsap.set(log, { opacity: 0.28 });
  if (field) gsap.set(field, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });

  // The camera is not a decoration on the diagram: it follows the same route
  // the aircraft flies. Close on Portland, track the turn south, then release
  // to the full reconstruction once the exit is inferred.
  const closeScale = scrubbed ? 1.38 : 1.08;
  const cruiseScale = scrubbed ? 1.14 : 1;
  let lastPhase = -1;

  const applyCamera = (progress: number) => {
    if (!world) return;
    const p = Math.min(1, Math.max(0, progress));
    const point = route.getPointAtLength(length * p);
    const base = closeScale + (cruiseScale - closeScale) * Math.min(1, p / 0.86);
    const pull = p > 0.88 ? (p - 0.88) / 0.12 : 0;
    const scale = base + (1 - base) * pull;
    const x = (500 - point.x * scale) * (1 - pull);
    const y = (226 - point.y * scale) * (1 - pull);
    world.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})`);
  };

  const applyMoment = (progress: number) => {
    let index = 0;
    FLIGHT_PHASES.forEach((moment, momentIndex) => {
      if (progress >= moment.at) index = momentIndex;
    });
    if (index === lastPhase) return;
    lastPhase = index;
    if (phase) phase.textContent = FLIGHT_PHASES[index].label;
  };

  const update = (progress: number) => {
    applyMoment(progress);
    if (clock) clock.textContent = clockAt(progress);
  };

  applyCamera(0);
  applyMoment(0);
  if (clock) clock.textContent = clockAt(0);

  const build = (timeline: gsap.core.Timeline) => {
    const travel = { p: 0 };

    timeline.to(
      travel,
      { p: 1, duration: 1.2, ease: 'none', onUpdate: () => applyCamera(travel.p) },
      0,
    );
    timeline.to(route, { strokeDashoffset: 0, duration: 1.2, ease: 'none' }, 0);

    if (plane) {
      timeline.to(
        plane,
        {
          opacity: 1,
          motionPath: {
            path: route,
            align: route,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0,
            end: 1,
          },
          duration: 1.2,
          ease: 'none',
        },
        0,
      );
    }

    events.forEach((event, index) => {
      timeline.to(event, { opacity: 1, y: 0, duration: 0.14 }, 0.04 + index * 0.29);
    });

    log.forEach((item, index) => {
      timeline.to(item, { opacity: 1, duration: 0.12 }, 0.04 + index * 0.29);
    });

    if (jump) {
      timeline.to(jump, { strokeDashoffset: 0, duration: 0.24, ease: 'power2.out' }, 1.02);
    }
    if (field) {
      timeline.to(field, { opacity: 1, scale: 1, duration: 0.2 }, 1.04);
    }

    // A deliberate hold at the released wide shot.
    timeline.to({}, { duration: 0.18 }, 1.2);
  };

  if (!scrubbed) {
    return ScrollScene(scene, build, { start: 'top 78%', onUpdate: update });
  }

  return PinnedScene(
    scene,
    {
      start: 'top 64px',
      end: '+=145%',
      pin: true,
      scrub: 0.6,
      cssVar: '--flight-p',
      onProgress: update,
    },
    build,
  );
}

/* -------------------------------------------------------------------------- */
/* 04 · The Jump — the inferred descent                                      */
/* -------------------------------------------------------------------------- */

function jumpScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-jump');
  if (!chapter) return;

  const pin = one(chapter, '.ed-jump__pin');
  if (!pin) return;

  const head = one(pin, '.ed-jump__head');
  if (head) maskReveal(head, head, { start: 'top 74%', from: 'up' });

  const marks = all(pin, '.ed-jump__marks article');
  const silence = one(pin, '.ed-jump__silence');
  const photo = one(pin, '.ed-jump__visual .ed-figure__frame');
  const stage = one(pin, '.ed-jump__stage');
  const when = one(pin, '[data-jump-when]');
  const scale = one(pin, '.ed-jump__scale-line');
  const profileAircraft = one<SVGPathElement>(pin, '.ed-jump__aircraft-line');
  const profileDrop = one<SVGPathElement>(pin, '.ed-jump__drop-line');

  if (marks.length) gsap.set(marks, { opacity: 0.24, clipPath: 'inset(0 0 100% 0)', y: 14 });
  if (stage) gsap.set(stage, { scale: 1.055, y: 16, transformOrigin: '60% 36%' });
  if (when) gsap.set(when, { opacity: 0, scale: 1.16, y: 24, transformOrigin: '50% 50%' });
  if (scale) gsap.set(scale, { scaleY: 0, transformOrigin: 'top center' });

  if (photo) {
    gsap.set(photo, {
      clipPath: 'inset(9% 14% 16% 14%)',
      scale: 1.24,
      transformOrigin: '56% 42%',
    });
  }

  if (profileAircraft) {
    const length = profileAircraft.getTotalLength();
    gsap.set(profileAircraft, { strokeDasharray: length, strokeDashoffset: length });
  }
  if (profileDrop) {
    const length = profileDrop.getTotalLength();
    gsap.set(profileDrop, { strokeDasharray: length, strokeDashoffset: length });
  }

  const timeline = ScrollScene(
    pin,
    (tl) => {
      if (stage) tl.to(stage, { scale: 1, y: 0, duration: 1, ease: 'none' }, 0);
      if (scale) tl.to(scale, { scaleY: 1, duration: 0.8, ease: 'power2.out' }, 0);

      marks.forEach((mark, index) => {
        tl.to(
          mark,
          { opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.24, ease: 'power2.out' },
          0.1 + index * 0.24,
        );
      });

      if (profileAircraft) {
        tl.to(profileAircraft, { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, 0);
      }

      if (photo) {
        tl.to(
          photo,
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.72, ease: 'power2.inOut' },
          0.02,
        );
        tl.to(photo, { scale: 1.03, y: -4, duration: 0.24, ease: 'none' }, 0.76);
      }

      if (when) {
        tl.to(when, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.38);
        tl.to(when, { opacity: 0.15, y: -24, duration: 0.22, ease: 'none' }, 0.86);
      }

      if (profileDrop) {
        tl.to(profileDrop, { strokeDashoffset: 0, duration: 0.24, ease: 'power2.out' }, 0.68);
      }
      if (silence) {
        tl.fromTo(
          silence,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.24 },
          0.84,
        );
      }
    },
    {
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (progress) => {
        pin.style.setProperty('--jump-p', progress.toFixed(4));
      },
    },
  );

  return timeline;
}

/* -------------------------------------------------------------------------- */
/* 05 · The Search — map journey and the photograph below                     */
/* -------------------------------------------------------------------------- */

function searchScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-search');
  if (!chapter) return;

  const aerial = one(chapter, '.ed-search__aerial');
  if (aerial) {
    const image = one(aerial, '.ed-figure__frame img');
    if (image) {
      ChapterTransition(aerial, image, {
        from: 'inset(0 0 100% 0)',
        start: 'top 92%',
        end: 'top 32%',
        scrub: 0.7,
        scale: 1.12,
      });
    }
  }

}

/* -------------------------------------------------------------------------- */
/* 06 · The Money — the horizontal evidence strip                             */
/* -------------------------------------------------------------------------- */

function moneyScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-money');
  if (!chapter) return;

  const scan = one(chapter, '.ed-money__scan');
  if (scan) {
    CameraReveal(scan, one(scan, 'img'), {
      fromScale: 1.3,
      fromX: 3,
      fromY: 2,
      origin: '58% 42%',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
    });
  }

  const field = one(chapter, '.ed-bill-field__grid');
  const bills = all(chapter, '.ed-bill-field__bill');
  if (field && bills.length) {
    ScrollScene(
      field,
      (timeline) => {
        timeline.fromTo(
          bills,
          { opacity: 0, scale: 0.15, transformOrigin: '50% 50%' },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: { each: 0.002, from: 'center' },
          },
          0,
        );
      },
      { start: 'top 84%', end: 'bottom 58%', scrub: 0.6 },
    );
  }

  const bundle = one(chapter, '.ed-money__bundle');
  if (bundle) maskReveal(bundle, bundle, { start: 'top 90%', from: 'up' });

  const interpHead = one(chapter, '.ed-money__interp-head');
  if (interpHead) maskReveal(interpHead, interpHead, { start: 'top 88%', from: 'up' });

}

function moneyStrip(root: ParentNode) {
  const strip = one<HTMLElement>(root, '.ed-strip');
  if (!strip) return;
  const track = one<HTMLElement>(strip, '.ed-strip__track');
  if (!track) return;

  strip.classList.add('is-horizontal-pin');
  const distance = Math.max(0, track.scrollWidth - strip.clientWidth);
  if (distance < 80) {
    strip.classList.remove('is-horizontal-pin');
    return;
  }

  const live = one(strip, '[data-strip-live]');
  const fill = one<HTMLElement>(strip, '[data-strip-progress]');
  const count = one(strip, '[data-strip-count]');
  const items = all<HTMLElement>(track, '[data-strip-item]');
  const years = all(track, '.ed-strip__year').map((element) => (element.textContent ?? '').trim());
  const targetFor = (index: number) => {
    if (index === items.length - 1) return -distance;
    const item = items[index];
    const center = item.offsetLeft + item.offsetWidth / 2;
    return -Math.min(distance, Math.max(0, center - strip.clientWidth / 2));
  };
  let lastIndex = -1;

  const focusAt = (progress: number) => {
    const viewportCenter = strip.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Infinity;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const gap = Math.abs(center - viewportCenter);
      const focus = Math.max(0, 1 - gap / (strip.clientWidth * 0.56));
      item.style.setProperty('--focus', focus.toFixed(3));
      item.style.setProperty('--offset', index % 2 === 0 ? '0px' : '6px');
      if (gap < nearestDistance) {
        nearestDistance = gap;
        nearest = index;
      }
    });

    if (fill) fill.style.transform = `scaleX(${progress})`;
    if (nearest !== lastIndex) {
      lastIndex = nearest;
      if (live) live.textContent = years[nearest] ?? '';
      if (count) {
        count.textContent = `${String(nearest + 1).padStart(2, '0')} / ${String(years.length).padStart(2, '0')}`;
      }
    }
  };

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: strip,
      start: 'top 18%',
      end: () => `+=${distance + window.innerHeight * 0.55}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => focusAt(self.progress),
    },
  });

  // Travel card to card instead of dragging a strip at constant speed. The
  // short holds let the year, the packet and the caption settle before the
  // camera moves again.
  for (let index = 1; index < items.length; index += 1) {
    const last = index === items.length - 1;
    timeline.to(track, {
      x: () => targetFor(index),
      duration: last ? 0.38 : 0.3,
      ease: 'power2.inOut',
    });
    if (!last) timeline.to({}, { duration: 0.08 });
  }

  focusAt(0);

  return () => {
    strip.classList.remove('is-horizontal-pin');
    items.forEach((item) => {
      item.style.removeProperty('--focus');
      item.style.removeProperty('--offset');
    });
    gsap.set(track, { x: 0 });
    timeline.kill();
  };
}

/* -------------------------------------------------------------------------- */
/* 07 · Evidence — the index assembles while pinned                           */
/* -------------------------------------------------------------------------- */

function evidenceScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-evidence');
  if (!chapter) return;

  const chain = one(chapter, '.ed-chain');
  const articles = all(chapter, '.ed-chain__row article');
  const arrows = all(chapter, '.ed-chain__arrow');

  if (chain && articles.length) {
    gsap.set(articles, { opacity: 0.32 });
    gsap.set(arrows, { opacity: 0.2, x: -6 });

    ScrollScene(
      chain,
      (timeline) => {
        articles.forEach((article, index) => {
          timeline.to(article, { opacity: 1, duration: 0.18 }, index * 0.3);
          if (arrows[index]) {
            timeline.to(arrows[index], { opacity: 1, x: 0, duration: 0.14 }, index * 0.3 + 0.18);
          }
        });
      },
      { start: 'top 74%', end: 'bottom 58%', scrub: 0.5 },
    );
  }

  const note = one(chapter, '.ed-evidence__note');
  if (note) maskReveal(note, note, { start: 'top 90%', from: 'up' });
}

function evidencePin(root: ParentNode) {
  const chapter = one(root, '#dbc-the-evidence');
  if (!chapter) return;
  const index = one<HTMLElement>(chapter, '[data-evidence-index]');
  if (!index) return;

  const thread = one(index, '[data-evidence-thread]');
  const rows = all<HTMLElement>(index, '[data-evidence-row]');
  if (!rows.length) return;

  index.classList.add('is-assembled');
  if (thread) gsap.set(thread, { scaleY: 0, transformOrigin: 'top center' });
  gsap.set(rows, {
    clipPath: 'inset(0 0 100% 0)',
    x: (rowIndex) => (rowIndex % 2 === 0 ? -30 : 30),
    z: -36,
    rotateY: (rowIndex) => (rowIndex % 2 === 0 ? -1.4 : 1.4),
    transformPerspective: 1000,
  });

  PinnedScene(
    index,
    {
      start: 'top 16%',
      end: '+=85%',
      pin: true,
      scrub: 0.55,
      cssVar: '--evidence-p',
      anticipatePin: 1,
    },
    (timeline) => {
      if (thread) timeline.to(thread, { scaleY: 1, duration: 0.9, ease: 'none' }, 0);
      rows.forEach((row, rowIndex) => {
        timeline.to(
          row,
          {
            clipPath: 'inset(0 0 0% 0)',
            x: 0,
            z: 0,
            rotateY: 0,
            duration: 0.36,
            ease: EXPO,
          },
          0.06 + rowIndex * 0.1,
        );
      });
    },
  );

  return () => {
    index.classList.remove('is-assembled');
  };
}

/* -------------------------------------------------------------------------- */
/* 08 · The Named — file rows, then a Flip comparison                         */
/* -------------------------------------------------------------------------- */

function namedScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-suspects');
  if (!chapter) return;

  const caution = one(chapter, '.ed-named__caution');
  if (caution) maskReveal(caution, caution, { start: 'top 90%', from: 'left' });
}

/* -------------------------------------------------------------------------- */
/* 09 · Theories — the comparison matrix scans one test at a time             */
/* -------------------------------------------------------------------------- */

function theoriesScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-theories');
  if (!chapter) return;

  const panel = one(chapter, '.ed-theory');
  if (panel) maskReveal(panel, panel, { start: 'top 86%', from: 'up' });

  const table = one(chapter, '.ed-matrix');
  const readout = one(chapter, '[data-matrix-readout]');
  if (!table) return;

  const cells = all(table, '[data-col]');
  const headers = all(table, 'thead th[data-col]');
  const labels = headers.map((header) => (header.textContent ?? '').trim());

  const scan = (index: number) => {
    cells.forEach((cell) => {
      cell.classList.toggle('is-scanning', cell.getAttribute('data-col') === String(index));
    });
    if (readout) {
      readout.textContent = `TEST ${String(index + 1).padStart(2, '0')} · ${(labels[index] ?? '').toUpperCase()}`;
    }
  };

  scan(0);
  TimelineScrub(table, {
    start: 'top 78%',
    end: 'bottom 58%',
    steps: labels.map((_, index) => ({
      at: index / Math.max(1, labels.length),
      apply: () => scan(index),
    })),
  });

  return () => {
    cells.forEach((cell) => cell.classList.remove('is-scanning'));
  };
}

/* -------------------------------------------------------------------------- */
/* 10 · What Remains — slower, with a night hand-off                          */
/* -------------------------------------------------------------------------- */

function remainsScene(root: ParentNode) {
  const chapter = one(root, '#dbc-the-unknowns');
  if (!chapter) return;

  const countElements = all<HTMLElement>(chapter, '[data-remains-count]');
  countElements.forEach((element) => {
    const target = Number(element.getAttribute('data-remains-count') ?? '');
    if (!Number.isFinite(target) || target <= 0) return;
    ScrollTrigger.create({
      trigger: element,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const proxy = { value: 0 };
        gsap.to(proxy, {
          value: target,
          duration: Math.min(1.4, 0.5 + target * 0.05),
          ease: 'power2.out',
          snap: { value: 1 },
          onUpdate: () => {
            element.textContent = String(Math.round(proxy.value));
          },
        });
      },
    });
  });

  const nightTitle = one(chapter, '.ed-remains__night h2');
  if (nightTitle) maskReveal(nightTitle, nightTitle, { start: 'top 86%', from: 'up' });

  const epilogue = one(chapter, '.ed-remains__epilogue');
  if (epilogue) maskReveal(epilogue, epilogue, { start: 'top 86%', from: 'up' });

  const stamp = one(chapter, '.ed-remains__stamp');
  if (stamp) {
    gsap.fromTo(
      stamp,
      { opacity: 0, scale: 1.7, rotate: -8, y: -26 },
      {
        opacity: 1,
        scale: 1,
        rotate: -1.5,
        y: 0,
        duration: 0.65,
        ease: 'power4.in',
        scrollTrigger: { trigger: stamp, start: 'top 88%', once: true },
      },
    );
  }

  const vane = one(chapter, '.ed-remains__vane');
  if (vane) {
    CameraReveal(vane, one(vane, 'img'), {
      fromScale: 1.3,
      origin: '50% 46%',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.7,
    });
  }

  const night = one(chapter, '.ed-remains__night');
  if (night) {
    if (epilogue) {
      ScrollScene(
        night,
        (timeline) => {
          timeline.to(
            epilogue,
            { scale: 0.985, opacity: 0.86, transformOrigin: '50% 0%', duration: 1, ease: 'none' },
            0,
          );
        },
        { start: 'top 76%', end: 'bottom bottom', scrub: 0.7 },
      );
    }

      ChapterTransition(night, night, {
        from: 'inset(0 0 100% 0)',
        start: 'top 94%',
        end: 'top 52%',
        scrub: 0.7,
        scale: 1.015,
        y: 22,
      });
    }

  return () => {
    countElements.forEach((element) => {
      const target = element.getAttribute('data-remains-count');
      if (target !== null) element.textContent = target;
    });
  };
}

/* -------------------------------------------------------------------------- */
/* Register                                                                   */
/* -------------------------------------------------------------------------- */

function registerScene(root: ParentNode) {
  const register = one(root, '.ed-register');
  if (!register) return;

  const head = one(register, '.ed-register__head');
  if (head) maskReveal(head, head, { start: 'top 90%', from: 'up' });

}

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

export function useEditionMotion(
  rootRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      let disposed = false;

      // The chapter grammar is shared by every viewport.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        all(root, '.ed-head').forEach(headScene);

        all(root, '.ed-chapter__folio').forEach((folio) => {
          const chapter = folio.closest('.ed-chapter');
          if (!chapter) return;
          gsap.fromTo(
            folio,
            { y: 10 },
            {
              y: -36,
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            },
          );
        });

        coverScene(root);
        manScene(root);
        noteScene(root);
        flightScene(root);
        jumpScene(root);
        searchScene(root);
        moneyScene(root);
        evidenceScene(root);
        namedScene(root);
        const theoryCleanup = theoriesScene(root);
        const remainsCleanup = remainsScene(root);
        registerScene(root);

        return () => {
          theoryCleanup?.();
          remainsCleanup?.();
        };
      });

      // Desktop-only spatial scenes.
      mm.add(`${DESKTOP} and (prefers-reduced-motion: no-preference)`, () => {
        manViewfinder(root);
        flightCamera(root);
        const trajectory = one<HTMLElement>(root, '.ed-trajectory');
        if (trajectory) trajectoryTimeline(trajectory, true);
      });

      mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
        const trajectory = one<HTMLElement>(root, '.ed-trajectory');
        if (trajectory) trajectoryTimeline(trajectory, false);
      });

      mm.add(`${WIDE} and (prefers-reduced-motion: no-preference)`, () => {
        const stripCleanup = moneyStrip(root);
        const evidenceCleanup = evidencePin(root);
        return () => {
          stripCleanup?.();
          evidenceCleanup?.();
        };
      });

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const index = one(root, '#dbc-the-evidence [data-evidence-index]');
        if (!index) return;
        const rows = all(index, '[data-evidence-row]');
        if (rows.length) {
          EvidenceReveal(index, rows, { start: 'top 90%', x: 14, y: 6, stagger: 0.05 });
        }
      });

      const refresh = () => {
        if (!disposed) {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        }
      };
      refresh();
      const onLoad = () => refresh();
      window.addEventListener('load', onLoad);
      document.fonts?.ready.then(refresh).catch(() => undefined);

      const images = all<HTMLImageElement>(root, 'img').filter((image) => !image.complete);
      images.forEach((image) => image.addEventListener('load', onLoad, { once: true }));

      const settle = window.setTimeout(refresh, 700);

      return () => {
        disposed = true;
        window.removeEventListener('load', onLoad);
        window.clearTimeout(settle);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* Shared motion vocabulary                                                   */
/* -------------------------------------------------------------------------- */

export const EASE = 'power3.out';
export const EXPO = 'expo.out';
export const DESKTOP = '(min-width: 900px)';
export const WIDE = '(min-width: 1024px)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

export const all = <T extends Element = HTMLElement>(root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll<T>(selector));

export const one = <T extends Element = HTMLElement>(root: ParentNode, selector: string) =>
  root.querySelector<T>(selector);

interface SceneOptions {
  start?: string;
  end?: string;
  scrub?: number | boolean;
  once?: boolean;
  onUpdate?: (progress: number, self: ScrollTrigger) => void;
}

/**
 * A one-shot or scrubbed scene. This is the base primitive: the scene owns its
 * timeline, and ScrollTrigger owns the cue. Nothing animates from a global
 * preset or a per-section observer.
 */
export function ScrollScene(
  trigger: Element | null | undefined,
  build: (timeline: gsap.core.Timeline) => void,
  options: SceneOptions = {},
) {
  if (!trigger || !trigger.isConnected) return null;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start ?? 'top 86%',
      end: options.end,
      scrub: options.scrub,
      once: options.scrub ? false : options.once ?? true,
      onUpdate: options.onUpdate
        ? (self) => options.onUpdate?.(self.progress, self)
        : undefined,
    },
  });

  build(timeline);
  return timeline;
}

interface PinnedSceneOptions extends SceneOptions {
  pin?: boolean | Element | string;
  pinSpacing?: boolean;
  anticipatePin?: number;
  cssVar?: string;
  onProgress?: (progress: number) => void;
}

/**
 * A pinned scene. Scroll becomes the timeline slider while the composition
 * holds still. `cssVar` exposes progress to CSS for layers that need numeric
 * values (tick marks, counters, crop guides).
 */
export function PinnedScene(
  trigger: Element | null | undefined,
  options: PinnedSceneOptions,
  build: (timeline: gsap.core.Timeline) => void,
) {
  if (!trigger || !trigger.isConnected) return null;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start ?? 'top top',
      end: options.end ?? '+=140%',
      pin: options.pin ?? true,
      pinSpacing: options.pinSpacing,
      scrub: options.scrub ?? 0.6,
      anticipatePin: options.anticipatePin ?? 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (options.cssVar && trigger instanceof HTMLElement) {
          trigger.style.setProperty(options.cssVar, self.progress.toFixed(4));
        }
        options.onProgress?.(self.progress);
        options.onUpdate?.(self.progress, self);
      },
    },
  });

  build(timeline);
  return timeline;
}

/* -------------------------------------------------------------------------- */
/* Camera                                                                     */
/* -------------------------------------------------------------------------- */

interface CameraRevealOptions {
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  fromY?: number;
  toX?: number;
  toY?: number;
  fromRotate?: number;
  origin?: string;
  start?: string;
  end?: string;
  scrub?: number;
  clip?: 'up' | 'down' | 'left' | 'right' | false;
}

/**
 * A scroll-scrubbed camera move on a single piece of media. The move must
 * reveal something: a crop, a wider context, a detail entering frame.
 */
export function CameraReveal(
  trigger: Element | null,
  media: Element | null,
  options: CameraRevealOptions = {},
) {
  if (!trigger || !media) return null;

  const clipFrom =
    options.clip === 'up'
      ? 'inset(0 0 100% 0)'
      : options.clip === 'down'
        ? 'inset(100% 0 0 0)'
        : options.clip === 'left'
          ? 'inset(0 0 0 100%)'
          : options.clip === 'right'
            ? 'inset(0 100% 0 0)'
            : undefined;

  return gsap.fromTo(
    media,
    {
      scale: options.fromScale ?? 1.16,
      xPercent: options.fromX ?? 0,
      yPercent: options.fromY ?? 0,
      rotate: options.fromRotate ?? 0,
      transformOrigin: options.origin ?? '50% 45%',
      ...(clipFrom ? { clipPath: clipFrom } : {}),
    },
    {
      scale: options.toScale ?? 1,
      xPercent: options.toX ?? 0,
      yPercent: options.toY ?? 0,
      rotate: 0,
      ...(clipFrom ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}),
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top bottom',
        end: options.end ?? 'bottom top',
        scrub: options.scrub ?? 0.6,
      },
    },
  );
}

interface DepthLayerOptions {
  fromY?: number;
  toY?: number;
  fromX?: number;
  toX?: number;
  fromScale?: number;
  toScale?: number;
  start?: string;
  end?: string;
  scrub?: number;
}

/**
 * A single 2.5D layer. Use it on foreground, typography, or atmosphere, never
 * on the same element as a camera move.
 */
export function DepthLayer(
  trigger: Element | null,
  layer: Element | null,
  options: DepthLayerOptions = {},
) {
  if (!trigger || !layer) return null;

  return gsap.fromTo(
    layer,
    {
      x: 0,
      y: 0,
      rotate: 0,
      yPercent: options.fromY ?? 0,
      xPercent: options.fromX ?? 0,
      scale: options.fromScale ?? 1,
    },
    {
      x: 0,
      y: 0,
      rotate: 0,
      yPercent: options.toY ?? 0,
      xPercent: options.toX ?? 0,
      scale: options.toScale ?? 1,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top bottom',
        end: options.end ?? 'bottom top',
        scrub: options.scrub ?? 0.6,
      },
    },
  );
}

interface PerspectiveShiftOptions {
  fromRotateY?: number;
  fromRotateX?: number;
  fromZ?: number;
  perspective?: number;
  start?: string;
  end?: string;
  scrub?: number;
}

/**
 * A restrained 2.5D shift. Reserve it for a scene where the change in plane
 * communicates continuity, not for decoration.
 */
export function PerspectiveShift(
  trigger: Element | null,
  layer: Element | null,
  options: PerspectiveShiftOptions = {},
) {
  if (!trigger || !layer) return null;

  return gsap.fromTo(
    layer,
    {
      rotateY: options.fromRotateY ?? -4,
      rotateX: options.fromRotateX ?? 0,
      z: options.fromZ ?? -40,
      transformPerspective: options.perspective ?? 1200,
      transformOrigin: '50% 50%',
    },
    {
      rotateY: 0,
      rotateX: 0,
      z: 0,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top bottom',
        end: options.end ?? 'bottom top',
        scrub: options.scrub ?? 0.6,
      },
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Evidence                                                                   */
/* -------------------------------------------------------------------------- */

interface EvidenceRevealOptions {
  start?: string;
  end?: string;
  stagger?: number;
  x?: number;
  y?: number;
  duration?: number;
  scrub?: number | boolean;
}

/**
 * Spatial evidence entrance. Each item is cropped into the composition from a
 * direction rather than faded in. Alternating directions read as material
 * being placed on a board.
 */
export function EvidenceReveal(
  trigger: Element | null,
  targets: Element[],
  options: EvidenceRevealOptions = {},
) {
  if (!trigger || !targets.length) return null;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start ?? 'top 88%',
      end: options.end,
      scrub: options.scrub,
      once: options.scrub ? false : true,
    },
  });

  targets.forEach((target, index) => {
    const direction = index % 2 === 0 ? -1 : 1;
    timeline.fromTo(
      target,
      {
        clipPath: 'inset(0 0 100% 0)',
        x: options.x ?? direction * 22,
        y: options.y ?? 8,
        rotate: direction * 0.25,
      },
      {
        clipPath: 'inset(0 0 0% 0)',
        x: 0,
        y: 0,
        rotate: 0,
        duration: options.duration ?? 0.7,
        ease: EXPO,
      },
      index * (options.stagger ?? 0.06),
    );
  });

  return timeline;
}

interface DocumentFocusOptions {
  start?: string;
  end?: string;
  scrub?: number;
}

/**
 * Document focus: the camera starts on the first marked phrase, moves to the
 * second, then pulls back to reveal the sheet and its annotations.
 */
export function DocumentFocus(
  trigger: Element | null,
  sheet: HTMLElement | null,
  marks: HTMLElement[],
  focus: HTMLElement | null,
  annotations: Element[],
  options: DocumentFocusOptions = {},
) {
  if (!trigger || !sheet || !marks.length) return null;

  const positionOf = (element: HTMLElement) => {
    let x = 0;
    let y = 0;
    let node: HTMLElement | null = element;
    while (node && node !== sheet) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return {
      x: x - 6,
      y: y - 4,
      width: element.offsetWidth + 12,
      height: element.offsetHeight + 8,
    };
  };

  const firstMark = marks[0];
  const secondMark = marks[1] ?? firstMark;

  if (focus) {
    const initial = positionOf(firstMark);
    gsap.set(focus, {
      ...initial,
      opacity: 0,
      visibility: 'visible',
    });
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start ?? 'top 70%',
      end: options.end ?? 'top 8%',
      scrub: options.scrub ?? 0.55,
      invalidateOnRefresh: true,
    },
  });

  timeline.fromTo(
    sheet,
    { y: 12 },
    {
      y: 0,
      ease: 'none',
      duration: 1,
    },
    0,
  );

  if (focus) {
    timeline.fromTo(
      focus,
      {
        x: () => positionOf(firstMark).x,
        y: () => positionOf(firstMark).y,
        width: () => positionOf(firstMark).width,
        height: () => positionOf(firstMark).height,
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.08,
      },
      0.02,
    );
    timeline.to(
      focus,
      {
        x: () => positionOf(secondMark).x,
        y: () => positionOf(secondMark).y,
        width: () => positionOf(secondMark).width,
        height: () => positionOf(secondMark).height,
        duration: 0.36,
        ease: 'power2.inOut',
      },
      0.3,
    );
    timeline.to(focus, { opacity: 0, duration: 0.12 }, 0.78);
  }

  annotations.forEach((annotation, index) => {
    timeline.fromTo(
      annotation,
      { clipPath: 'inset(0 100% 0 0)', x: 9 },
      { clipPath: 'inset(0 0% 0 0)', x: 0, duration: 0.16, ease: EXPO },
      0.64 + index * 0.06,
    );
  });

  return timeline;
}

/* -------------------------------------------------------------------------- */
/* Map                                                                        */
/* -------------------------------------------------------------------------- */

export interface MapStop {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MapJourneyOptions {
  trigger: Element;
  svg: SVGSVGElement;
  clip?: SVGRectElement | null;
  focus?: SVGRectElement | null;
  stops: MapStop[];
  route?: SVGPathElement | null;
  field?: Element | null;
  find?: Element | null;
  start?: string;
  end?: string;
  scrub?: number;
  stepAt?: number[];
  onStep?: (index: number, progress: number) => void;
}

/**
 * A camera journey across a survey plate. The viewBox is the camera; the
 * camera stops are keyframes, and the route/field/find layers arrive on the
 * same scroll timeline.
 */
export function MapJourney(options: MapJourneyOptions) {
  const { trigger, svg, clip, focus, stops } = options;
  if (!stops.length) return null;

  const camera = { ...stops[0] };
  const apply = () => {
    svg.setAttribute('viewBox', `${camera.x} ${camera.y} ${camera.w} ${camera.h}`);
    if (clip) {
      clip.setAttribute('x', String(camera.x));
      clip.setAttribute('y', String(camera.y));
      clip.setAttribute('width', String(camera.w));
      clip.setAttribute('height', String(camera.h));
    }
    if (focus) {
      focus.setAttribute('x', String(camera.x));
      focus.setAttribute('y', String(camera.y));
      focus.setAttribute('width', String(camera.w));
      focus.setAttribute('height', String(camera.h));
    }
  };
  apply();

  if (options.route) {
    const length = options.route.getTotalLength();
    gsap.set(options.route, { strokeDasharray: length, strokeDashoffset: length });
  }
  if (options.field) {
    gsap.set(options.field, { opacity: 0, scale: 0.55, transformOrigin: '50% 50%' });
  }
  if (options.find) {
    gsap.set(options.find, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: options.start ?? 'top 68%',
      end: options.end ?? 'bottom 78%',
      scrub: options.scrub ?? 0.7,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = options.stepAt
          ? options.stepAt.reduce((step, at) => (progress >= at ? step + 1 : step), 0)
          : progress < 0.3
            ? 0
            : progress < 0.66
              ? 1
              : 2;
        options.onStep?.(index, progress);
      },
    },
  });

  for (let index = 1; index < stops.length; index += 1) {
    timeline.to(
      camera,
      {
        ...stops[index],
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: apply,
      },
      index - 1,
    );
  }

  if (options.route) {
    timeline.to(
      options.route,
      { strokeDashoffset: 0, duration: 2.5, ease: 'none' },
      0.1,
    );
  }
  if (options.field) {
    timeline.to(
      options.field,
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
      1.8,
    );
  }
  if (options.find) {
    timeline.to(
      options.find,
      { opacity: 1, scale: 1, duration: 0.26, ease: 'power2.out' },
      2.9,
    );
  }

  return timeline;
}

/* -------------------------------------------------------------------------- */
/* Horizontal sequence                                                        */
/* -------------------------------------------------------------------------- */

interface HorizontalSequenceOptions {
  viewport: HTMLElement;
  track: HTMLElement;
  start?: string;
  endPadding?: number;
  scrub?: number;
  onProgress?: (progress: number) => void;
}

/**
 * Vertical scroll drives horizontal travel inside one chapter. The viewport is
 * pinned only for the length of the sequence, then returns to the document.
 */
export function HorizontalSequence(options: HorizontalSequenceOptions) {
  const distance = () => Math.max(0, options.track.scrollWidth - options.viewport.clientWidth);
  if (distance() < 80) return null;

  return gsap.timeline({
    scrollTrigger: {
      trigger: options.viewport,
      start: options.start ?? 'top 18%',
      end: () =>
        `+=${distance() + window.innerHeight * (options.endPadding ?? 0.45)}`,
      pin: true,
      scrub: options.scrub ?? 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => options.onProgress?.(self.progress),
    },
  }).to(options.track, {
    x: () => -distance(),
    ease: 'none',
    duration: 1,
  });
}

/* -------------------------------------------------------------------------- */
/* Timeline scrub                                                             */
/* -------------------------------------------------------------------------- */

interface TimelineScrubOptions {
  steps: Array<{ at: number; apply: () => void }>;
  start?: string;
  end?: string;
}

/**
 * Progress readout for a sequence that changes state rather than position.
 * Used by the comparison matrix: each test column is called in turn.
 */
export function TimelineScrub(
  trigger: Element | null,
  options: TimelineScrubOptions,
) {
  if (!trigger || !options.steps.length) return null;

  let active = -1;
  return ScrollTrigger.create({
    trigger,
    start: options.start ?? 'top 78%',
    end: options.end ?? 'bottom 55%',
    onUpdate: (self) => {
      let index = 0;
      for (let step = 0; step < options.steps.length; step += 1) {
        if (self.progress >= options.steps[step].at) index = step;
      }
      if (index !== active) {
        active = index;
        options.steps[index].apply();
      }
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

interface KineticHeadlineOptions {
  start?: string;
  stagger?: number;
  duration?: number;
  once?: boolean;
}

/**
 * Word-masked headline. The words live inside `.ed-word` masks in the markup,
 * so the line box and reading order never change.
 */
export function KineticHeadline(
  trigger: Element | null,
  headline: Element | null,
  options: KineticHeadlineOptions = {},
) {
  if (!trigger || !headline) return null;

  const words = all<HTMLElement>(headline, '.ed-word__in');
  if (!words.length) return null;

  return ScrollScene(
    trigger,
    (timeline) => {
      timeline.fromTo(
        words,
        {
          yPercent: 118,
          xPercent: (index) => (index % 2 === 0 ? -6 : 6),
          rotate: (index) => (index % 2 === 0 ? -1.2 : 1.2),
        },
        {
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          duration: options.duration ?? 1.05,
          ease: EXPO,
          stagger: options.stagger ?? 0.07,
        },
        0,
      );
    },
    { start: options.start ?? 'top 84%', once: options.once ?? true },
  );
}

/* -------------------------------------------------------------------------- */
/* Chapter transition                                                         */
/* -------------------------------------------------------------------------- */

interface ChapterTransitionOptions {
  from?: string;
  start?: string;
  end?: string;
  scrub?: number;
  scale?: number;
  y?: number;
}

/**
 * A spatial hand-off between chapters: a paper ground rising, an image opening
 * from a plate, a night scene closing. The target keeps its own composition.
 */
export function ChapterTransition(
  trigger: Element | null,
  target: Element | null,
  options: ChapterTransitionOptions = {},
) {
  if (!trigger || !target) return null;

  return gsap.fromTo(
    target,
    {
      clipPath: options.from ?? 'inset(100% 0 0 0)',
      y: options.y ?? 0,
      scale: options.scale ?? 1,
    },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top 96%',
        end: options.end ?? 'top 46%',
        scrub: options.scrub ?? 0.7,
      },
    },
  );
}

/* -------------------------------------------------------------------------- */
/* SVG and masks                                                              */
/* -------------------------------------------------------------------------- */

/** Draw SVG paths as strokes. Only paths are included: getTotalLength is not
 * available on every geometry element in every browser. */
export function drawPaths(paths: Element[], vars: gsap.TweenVars = {}) {
  const svgPaths = paths.filter((element): element is SVGPathElement => element instanceof SVGPathElement);
  if (!svgPaths.length) return null;

  gsap.set(svgPaths, {
    strokeDasharray: (_index, target) => (target as SVGPathElement).getTotalLength(),
    strokeDashoffset: (_index, target) => (target as SVGPathElement).getTotalLength(),
  });

  return gsap.to(svgPaths, {
    strokeDashoffset: 0,
    duration: 1.4,
    ease: 'power2.inOut',
    stagger: 0.05,
    ...vars,
  });
}

interface MaskRevealOptions {
  start?: string;
  from?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
}

/** A clipped entrance for a single block of type or a small figure. */
export function maskReveal(
  trigger: Element | null,
  target: Element | null,
  options: MaskRevealOptions = {},
) {
  if (!trigger || !target) return null;

  const from = options.from ?? 'up';
  const clip =
    from === 'up'
      ? 'inset(0 0 100% 0)'
      : from === 'down'
        ? 'inset(100% 0 0 0)'
        : from === 'left'
          ? 'inset(0 100% 0 0)'
          : 'inset(0 0 0 100%)';
  const axis =
    from === 'left' || from === 'right'
      ? { x: from === 'left' ? -18 : 18 }
      : { y: options.distance ?? 14 };

  return ScrollScene(
    trigger,
    (timeline) => {
      timeline.fromTo(
        target,
        { clipPath: clip, ...axis },
        {
          clipPath: 'inset(-8% -4% -16% -4%)',
          x: 0,
          y: 0,
          duration: options.duration ?? 0.8,
          ease: EXPO,
          onComplete: () => {
            gsap.set(target, { clearProps: 'clipPath' });
          },
        },
        0,
      );
    },
    { start: options.start ?? 'top 88%' },
  );
}

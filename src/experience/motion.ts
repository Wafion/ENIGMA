import { useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const desktopCamera = '(min-width: 900px)';

export function usePrologueMotion(
  scope: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  const media = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = scope.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>('[data-prologue-stage]');
      const image = root.querySelector<HTMLElement>('[data-prologue-media]');
      const location = root.querySelector<HTMLElement>('[data-prologue-location]');
      const title = root.querySelector<HTMLElement>('[data-prologue-title]');
      const quote = root.querySelector<HTMLElement>('[data-prologue-quote]');
      const end = root.querySelector<HTMLElement>('[data-prologue-end]');
      const cue = root.querySelector<HTMLElement>('[data-scroll-cue]');
      if (!stage || !image || !title || !quote || !end) return;

      const mm = gsap.matchMedia();
      mm.add(desktopCamera, () => {
        gsap.set(quote, { autoAlpha: 0, y: 24 });
        gsap.set(end, { autoAlpha: 0, y: 22 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=175%',
            pin: stage,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            image,
            { scale: 1.13, yPercent: -1.2 },
            { scale: 1.015, yPercent: 1.2, ease: 'none', duration: 1 },
            0,
          )
          .to(location, { autoAlpha: 0, duration: 0.14 }, 0.1)
          .fromTo(cue, { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 0.1 }, 0.02)
          .to(title, { yPercent: -7, autoAlpha: 0, duration: 0.24, ease: 'power1.in' }, 0.26)
          .to(quote, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.34)
          .to(quote, { autoAlpha: 0, y: -18, duration: 0.18, ease: 'power1.in' }, 0.64)
          .to(end, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' }, 0.69);
      });

      return () => mm.revert();
    },
    { scope, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return media;
}

export function useHorizontalChronology(
  scope: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = scope.current;
      if (!root) return;
      const viewport = root.querySelector<HTMLElement>('[data-chronology-viewport]');
      const track = root.querySelector<HTMLElement>('[data-chronology-track]');
      if (!viewport || !track) return;

      const mm = gsap.matchMedia();
      mm.add(desktopCamera, () => {
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${Math.max(1, distance()) * 1.12}`,
            pin: viewport,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope, dependencies: [reducedMotion], revertOnUpdate: true },
  );
}

export function useWoodsCamera(
  scope: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = scope.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>('[data-woods-stage]');
      const image = root.querySelector<HTMLElement>('[data-woods-media]');
      const title = root.querySelector<HTMLElement>('[data-woods-title]');
      if (!stage || !image) return;

      const mm = gsap.matchMedia();
      mm.add(desktopCamera, () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=125%',
            pin: stage,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .fromTo(image, { scale: 1.12, yPercent: -1 }, { scale: 1.01, yPercent: 1, ease: 'none' }, 0)
          .to(title, { autoAlpha: 0, yPercent: -8, duration: 0.18 }, 0.55);
      });

      return () => mm.revert();
    },
    { scope, dependencies: [reducedMotion], revertOnUpdate: true },
  );
}

export function useReveals(
  scope: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  useGSAP(
    () => {
      if (reducedMotion) return;
      const root = scope.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
      items.forEach((item) => {
        gsap.from(item, {
          autoAlpha: 0,
          y: 26,
          duration: 0.9,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: item,
            start: 'top 91%',
            once: true,
          },
        });
      });
    },
    { scope, dependencies: [reducedMotion], revertOnUpdate: true },
  );
}

export function refreshMotion() {
  const refresh = () => ScrollTrigger.refresh();
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    void document.fonts.ready.then(refresh);
  }
  window.addEventListener('load', refresh, { once: true });
  const timer = window.setTimeout(refresh, 500);
  return () => {
    window.clearTimeout(timer);
    window.removeEventListener('load', refresh);
  };
}

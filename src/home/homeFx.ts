import { useEffect, type RefObject } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+-/<>[]{}=_';
const frames = new WeakMap<HTMLElement, number>();
const origins = new WeakMap<HTMLElement, string>();

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Replace an element's text with drifting ASCII glyphs, then settle it back
 * left-to-right. DOM-only, so no React render runs per frame. */
export function scramble(el: HTMLElement, duration = 520) {
  if (prefersReducedMotion()) return;

  const target = origins.get(el) ?? el.textContent ?? '';
  if (!target.trim()) return;
  origins.set(el, target);

  const previous = frames.get(el);
  if (previous) window.cancelAnimationFrame(previous);

  const characters = [...target];
  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const settled = Math.floor(progress * characters.length * 1.08);
    let out = '';

    for (let i = 0; i < characters.length; i += 1) {
      const char = characters[i];
      if (char === ' ' || i < settled) out += char;
      else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }

    el.textContent = out;

    if (progress < 1) {
      frames.set(el, window.requestAnimationFrame(tick));
    } else {
      el.textContent = target;
      frames.delete(el);
    }
  };

  frames.set(el, window.requestAnimationFrame(tick));
}

/** One observer for entrance reveals, one for one-shot ASCII decodes, plus a
 * delegated hover/focus scramble. Everything is cleaned up on unmount and all
 * of it degrades to the static page when motion is reduced. */
export function useHomeFx(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const decodes = Array.from(root.querySelectorAll<HTMLElement>('[data-decode]'));

    root.dataset.fx = 'on';

    let revealObserver: IntersectionObserver | null = null;
    let decodeObserver: IntersectionObserver | null = null;
    const decodeTimers: number[] = [];

    if (motion.matches || typeof IntersectionObserver === 'undefined') {
      reveals.forEach((el) => {
        el.dataset.reveal = 'in';
      });
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            el.dataset.reveal = 'in';
            revealObserver?.unobserve(el);
          });
        },
        { threshold: 0.05 },
      );
      reveals.forEach((el) => revealObserver?.observe(el));

      decodeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            decodeObserver?.unobserve(el);
            decodeTimers.push(window.setTimeout(() => scramble(el, 760), 140));
          });
        },
        { threshold: 0.45 },
      );
      decodes.forEach((el) => decodeObserver?.observe(el));
    }

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target as Element | null;
      const host = target?.closest<HTMLElement>('[data-hover-scramble]');
      if (!host) return;
      const from = event.relatedTarget as Node | null;
      if (from && host.contains(from)) return;
      host.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => scramble(el));
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Element | null;
      const host = target?.closest<HTMLElement>('[data-hover-scramble]');
      if (!host) return;
      host.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => scramble(el));
    };

    if (!motion.matches) {
      root.addEventListener('pointerover', onPointerOver, { passive: true });
      root.addEventListener('focusin', onFocusIn);
    }

    return () => {
      root.removeEventListener('pointerover', onPointerOver);
      root.removeEventListener('focusin', onFocusIn);
      revealObserver?.disconnect();
      decodeObserver?.disconnect();
      decodeTimers.forEach((timer) => window.clearTimeout(timer));
      delete root.dataset.fx;
    };
  }, [rootRef]);
}

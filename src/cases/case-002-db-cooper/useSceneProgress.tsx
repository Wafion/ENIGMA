import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { DBC_SCENE_COMPOSITIONS } from './composition';

/** Writes scroll progress into the DOM without re-rendering React, with optional continuous callback for audio/camera modulation. */
export function useSceneProgress<T extends HTMLElement>(onProgress?: (progress: number, approach: number) => void) {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onProgress);

  useEffect(() => {
    callbackRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const approach = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight * 0.85)));
      element.style.setProperty('--sp', progress.toFixed(4));
      element.style.setProperty('--approach', approach.toFixed(4));
      if (callbackRef.current) {
        callbackRef.current(progress, approach);
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

interface ScrollSceneProps {
  id: string;
  className?: string;
  children: ReactNode;
  label?: string;
  onProgress?: (progress: number, approach: number) => void;
}

/** A pinned, scroll-driven camera scene. */
export function ScrollScene({ id, className = '', children, label, onProgress }: ScrollSceneProps) {
  const ref = useSceneProgress<HTMLElement>(onProgress);
  const spec = DBC_SCENE_COMPOSITIONS[id];
  return (
    <section
      id={id}
      ref={ref}
      data-dbc-scene={id}
      data-dbc-grammar={spec?.grammar}
      data-dbc-surface={spec?.surface}
      data-dbc-axis={spec?.cameraAxis}
      className={`dbc-scene ${className}`}
      aria-label={label}
      style={{ '--sp': 0, '--approach': 0 } as CSSProperties}
    >
      <div className="dbc-stage">{children}</div>
    </section>
  );
}

/**
 * A pinned horizontal camera trajectory scene (LEFT -> RIGHT).
 * Translates the spatial rail across the viewport as the user scrolls,
 * allowing aircraft, coordinates, maps, and archival photographs to travel geographically.
 */
export function HorizontalTrackScene({
  id,
  className = '',
  children,
  hud,
  background,
  label,
  panels = 3,
  onProgress,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  hud?: ReactNode;
  background?: ReactNode;
  label?: string;
  panels?: number;
  onProgress?: (progress: number, approach: number) => void;
}) {
  const ref = useSceneProgress<HTMLElement>(onProgress);
  const spec = DBC_SCENE_COMPOSITIONS[id];
  return (
    <section
      id={id}
      ref={ref}
      data-dbc-scene={id}
      data-dbc-grammar={spec?.grammar ?? 'horizontal-trajectory'}
      data-dbc-surface={spec?.surface ?? 'steel'}
      data-dbc-axis="horizontal-track"
      className={`dbc-scene dbc-htrack ${className}`}
      aria-label={label}
      style={
        {
          '--sp': 0,
          '--approach': 0,
          '--htrack-panels': panels,
        } as CSSProperties
      }
    >
      <div className="dbc-stage dbc-htrack__stage">
        {background && <div className="dbc-htrack__bg" aria-hidden>{background}</div>}
        {hud && <div className="dbc-htrack__hud">{hud}</div>}
        <div className="dbc-htrack__viewport">
          <div className="dbc-htrack__rail">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** A normal-flow scene with scroll progress variables for multi-plane depth & parallax. */
export function FlowScene({
  id,
  className = '',
  children,
  label,
  onProgress,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  label?: string;
  onProgress?: (progress: number, approach: number) => void;
}) {
  const ref = useSceneProgress<HTMLElement>(onProgress);
  const spec = DBC_SCENE_COMPOSITIONS[id];
  return (
    <section
      id={id}
      ref={ref}
      data-dbc-scene={id}
      data-dbc-grammar={spec?.grammar}
      data-dbc-surface={spec?.surface}
      data-dbc-axis={spec?.cameraAxis}
      className={`dbc-flow ${className}`}
      aria-label={label}
      style={{ '--sp': 0, '--approach': 0 } as CSSProperties}
    >
      {children}
    </section>
  );
}

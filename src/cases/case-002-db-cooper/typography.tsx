import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export type TypeVoice = 'poster' | 'condensed' | 'serif' | 'italic' | 'mono' | 'sans' | 'label';
export type TypeAnimation = 'none' | 'rise' | 'track' | 'sweep' | 'drift' | 'kinetic-x' | 'clip';
export type TypeElement = 'div' | 'p' | 'span' | 'h2' | 'h3' | 'figcaption';

export interface TypeLayerProps {
  children: ReactNode;
  voice?: TypeVoice;
  as?: TypeElement;
  size?: string;
  weight?: number | string;
  tracking?: string;
  leading?: string;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
  rotate?: number;
  scale?: number;
  depth?: number;
  x?: string;
  y?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  bleed?: boolean | 'none' | 'left' | 'right' | 'top' | 'bottom';
  parallaxX?: number;
  parallaxY?: number;
  strokeOnly?: boolean;
  zIndex?: number;
  animation?: TypeAnimation;
  delay?: number;
  className?: string;
  ariaHidden?: boolean;
  style?: CSSProperties;
}

const DEFAULTS: Record<TypeVoice, { size: string; family: string; weight: number; leading: string; tracking: string }> = {
  poster: {
    size: 'clamp(5.4rem, 22vw, 24rem)',
    family: 'var(--dbc-font-poster)',
    weight: 400,
    leading: '0.78',
    tracking: '-0.015em',
  },
  condensed: {
    size: 'clamp(2.4rem, 5.4vw, 5.6rem)',
    family: 'var(--dbc-font-condensed)',
    weight: 500,
    leading: '0.9',
    tracking: '0.01em',
  },
  serif: {
    size: 'clamp(2.1rem, 5vw, 5.2rem)',
    family: 'var(--dbc-font-display)',
    weight: 400,
    leading: '0.94',
    tracking: '-0.025em',
  },
  italic: {
    size: 'clamp(1.4rem, 2.5vw, 2.5rem)',
    family: 'var(--dbc-font-body)',
    weight: 300,
    leading: '1.14',
    tracking: '-0.01em',
  },
  mono: {
    size: 'clamp(0.62rem, 0.8vw, 0.78rem)',
    family: 'var(--dbc-font-archive)',
    weight: 400,
    leading: '1.5',
    tracking: '0.06em',
  },
  sans: {
    size: 'clamp(0.7rem, 0.9vw, 0.88rem)',
    family: 'var(--dbc-font-ui)',
    weight: 500,
    leading: '1.35',
    tracking: '0.04em',
  },
  label: {
    size: '0.59rem',
    family: 'var(--dbc-font-archive)',
    weight: 400,
    leading: '1.2',
    tracking: '0.2em',
  },
};

function useInView() {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSeen(true);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, seen };
}

/**
 * A single typographic layer. Scenes choose the voice, scale, placement,
 * parallax velocity, viewport bleed, and animation; the layer supplies
 * composition primitives so typography acts as spatial scenery.
 */
export function TypeLayer({
  children,
  voice = 'mono',
  as = 'div',
  size,
  weight,
  tracking,
  leading,
  align = 'left',
  opacity = 1,
  rotate = 0,
  scale = 1,
  depth = 0,
  x,
  y,
  top,
  right,
  bottom,
  left,
  bleed = 'none',
  parallaxX = 0,
  parallaxY = 0,
  strokeOnly = false,
  zIndex,
  animation = 'rise',
  delay = 0,
  className = '',
  ariaHidden = true,
  style,
}: TypeLayerProps) {
  const defaults = DEFAULTS[voice];
  const { ref, seen } = useInView();
  const vars = {
    '--type-size': size ?? defaults.size,
    '--type-family': defaults.family,
    '--type-weight': weight ?? defaults.weight,
    '--type-leading': leading ?? defaults.leading,
    '--type-tracking': tracking ?? defaults.tracking,
    '--type-align': align,
    '--type-opacity': opacity,
    '--type-rotate': `${rotate}deg`,
    '--type-scale': scale,
    '--type-depth': `${depth}px`,
    '--type-x': x ?? '0px',
    '--type-y': y ?? '0px',
    '--type-px': `${parallaxX}px`,
    '--type-py': `${parallaxY}px`,
    '--type-top': top ?? 'auto',
    '--type-right': right ?? 'auto',
    '--type-bottom': bottom ?? 'auto',
    '--type-left': left ?? 'auto',
    '--type-delay': `${delay}ms`,
    ...(zIndex !== undefined ? { zIndex } : {}),
    ...style,
  } as CSSProperties & Record<string, string | number>;

  return createElement(
    as,
    {
      ref,
      className: `dbc-type dbc-type--${voice} ${strokeOnly ? 'dbc-type--outline dbc-type--stroke-only' : ''} ${bleed && bleed !== 'none' ? `dbc-type--bleed ${typeof bleed === 'string' ? `dbc-type--bleed-${bleed}` : ''}` : ''} ${seen ? 'is-visible' : ''} ${className}`,
      style: vars,
      'data-anim': animation,
      'aria-hidden': ariaHidden || undefined,
    },
    children,
  );
}

export function TypeField({
  children,
  className = '',
  front = false,
}: {
  children: ReactNode;
  className?: string;
  front?: boolean;
}) {
  return (
    <div className={`dbc-type-field ${front ? 'is-front' : ''} ${className}`} aria-hidden>
      {children}
    </div>
  );
}

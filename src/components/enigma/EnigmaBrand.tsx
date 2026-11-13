import { useId } from 'react';
import './enigmaBrand.css';

export interface EnigmaSymbolProps {
  tone?: 'light' | 'dark';
  alt?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Primary ENIGMA Symbol (`logo 1`).
 * Use in small, functional, minimal navigation, transition, and loading contexts.
 * Scales strictly proportionally and preserves the exact geometry of the mark.
 */
export function EnigmaSymbol({
  tone = 'light',
  alt = '',
  className = '',
  priority = false,
}: EnigmaSymbolProps) {
  const src =
    tone === 'dark' ? '/assets/home/logo-1-dark.png' : '/assets/home/logo-1-light.png';

  return (
    <img
      src={src}
      alt={alt}
      width={760}
      height={760}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      draggable={false}
      className={`enigma-symbol ${className}`.trim()}
    />
  );
}

export interface EnigmaLockupProps {
  alt?: string;
  className?: string;
  priority?: boolean;
}

/**
 * ENIGMA Wordmark / Editorial Lockup (`logo 2`).
 * Use for declarative brand identity moments: homepage hero, opening/closing
 * title cards, exhibition panels, and large editorial compositions.
 */
export function EnigmaLockup({
  alt = 'ENIGMA',
  className = '',
  priority = false,
}: EnigmaLockupProps) {
  return (
    <img
      src="/assets/home/logo-2-lockup.png"
      alt={alt}
      width={766}
      height={766}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      draggable={false}
      className={`enigma-lockup ${className}`.trim()}
    />
  );
}

export interface EnigmaLoaderProps {
  tone?: 'dark' | 'light';
  overlay?: boolean;
  leaving?: boolean;
  label?: string;
  className?: string;
}

/**
 * ENIGMA Loading State.
 * Centers the standalone `logo 1` monogram in generous negative space and
 * animates its existing orbital arc in a restrained, seamless loop modeled
 * after the reference loading animation.
 */
export function EnigmaLoader({
  tone = 'dark',
  overlay = false,
  leaving = false,
  label = 'Loading ENIGMA',
  className = '',
}: EnigmaLoaderProps) {
  const maskId = useId();
  const suffix = tone === 'light' ? 'dark' : 'light';
  const coreSrc = `/assets/home/logo-1-core-${suffix}.png`;
  const orbitSrc = `/assets/home/logo-1-orbit-${suffix}.png`;

  return (
    <div
      className={[
        'enigma-loader',
        tone === 'light' ? 'enigma-loader--light' : '',
        overlay ? 'enigma-loader--overlay' : '',
        leaving ? 'enigma-loader--leaving' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="enigma-loader__stage" aria-hidden="true">
        <svg
          className="enigma-loader__svg"
          viewBox="0 0 760 760"
          width="760"
          height="760"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="760" height="760">
              <rect x="0" y="0" width="760" height="760" fill="black" />
              <path
                className="enigma-loader__orbit-stroke"
                d="M 536 276 Q 715 245 712 292 C 708 360 520 440 340 495 C 165 548 52 552 46 502 C 42 465 95 435 152 422"
                fill="none"
                stroke="white"
                strokeWidth="96"
                strokeLinecap="round"
                pathLength={100}
              />
            </mask>
          </defs>
          <image href={coreSrc} x="0" y="0" width="760" height="760" />
          <image
            href={orbitSrc}
            x="0"
            y="0"
            width="760"
            height="760"
            mask={`url(#${maskId})`}
          />
        </svg>
      </div>
    </div>
  );
}

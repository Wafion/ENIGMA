import React, { useEffect, useRef, useState } from 'react';
import type { TruthLayer } from '../../types/enigma';
import { useEnigma } from '../../context/EnigmaContext';

interface ASCIITransitionProps {
  chapterNumber: string;
  word: string;
  coordLabel: string;
  truthLayer: TruthLayer;
  accentHex: string;
}

const GLYPHS = '.:-+*#%@/|\\~^;!=0123456789ABCDEF';

export const ASCIITransition: React.FC<ASCIITransitionProps> = ({
  chapterNumber,
  word,
  coordLabel,
  truthLayer,
  accentHex,
}) => {
  const { reducedMotion } = useEnigma();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setVisible(entries[0].isIntersecting);
      },
      { rootMargin: '80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 140);
    return () => window.clearInterval(id);
  }, [visible, reducedMotion]);

  // Build a deterministic 3-row character dissolve strip with the chapter word emerging in the center
  const buildRow = (rowIdx: number) => {
    const width = 76;
    const centerText =
      rowIdx === 1 ? ` [ CH.${chapterNumber} // ${word} ] ` : '';
    const startCol = Math.floor((width - centerText.length) / 2);
    let out = '';
    for (let c = 0; c < width; c++) {
      if (
        rowIdx === 1 &&
        c >= startCol &&
        c < startCol + centerText.length
      ) {
        out += centerText[c - startCol];
      } else {
        const hash = (c * 19 + rowIdx * 37 + tick * 7) % GLYPHS.length;
        const distFromCenter = Math.abs(c - width / 2) / (width / 2);
        if (distFromCenter > 0.78 && (c + rowIdx + tick) % 3 !== 0) {
          out += ' ';
        } else {
          out += GLYPHS[hash];
        }
      }
    }
    return out;
  };

  const isLore = truthLayer === 'IN-UNIVERSE MYTHOLOGY';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="py-8 px-4 border-y border-[#1e211e] bg-[#060706] overflow-hidden select-none"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="mb-2 flex items-center gap-3 text-[11px] font-mono-tech uppercase tracking-[0.2em]">
          <span
            className="px-2 py-0.5 border"
            style={{
              borderColor: accentHex,
              color: accentHex,
            }}
          >
            {isLore ? 'LAYER A // IN-UNIVERSE MYTHOLOGY' : 'LAYER B // VERIFIED HISTORICAL & PRODUCTION RECORD'}
          </span>
          <span className="text-[#7c776d] hidden sm:inline">{coordLabel}</span>
        </div>

        <pre className="font-mono-tech text-[11px] sm:text-xs leading-tight text-[#6d746b] tracking-widest overflow-x-hidden max-w-full">
          <div>{buildRow(0)}</div>
          <div className="text-[#ece6d9] font-semibold">{buildRow(1)}</div>
          <div>{buildRow(2)}</div>
        </pre>
      </div>
    </div>
  );
};

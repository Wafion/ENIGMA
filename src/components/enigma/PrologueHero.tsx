import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Eye, ArrowDown, Compass, Radio } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { renderAsciiToCanvas } from '../../utils/asciiRenderer';
import { useEnigma } from '../../context/EnigmaContext';
import { BLAIR_WITCH_CASE } from '../../data/blairWitchCase';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface PrologueHeroProps {
  onJumpToChapter: (chapterId: string) => void;
}

export const PrologueHero: React.FC<PrologueHeroProps> = ({ onJumpToChapter }) => {
  const {
    audioEnabled,
    enableAudio,
    disableAudio,
    enterScene,
    leaveScene,
    reducedMotion,
    setInspectedAsset,
    setSourceRegisterOpen,
  } = useEnigma();

  const heroAsset = ASSET_MAP['img-seneca-creek-woods'];
  const heroRootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const sampleRef = useRef<{ cols: number; rows: number; data: Uint8ClampedArray } | null>(null);

  const [showPhotoOverlay, setShowPhotoOverlay] = useState<boolean>(false);
  const [pointerNorm, setPointerNorm] = useState<{ x: number; y: number } | null>(null);

  const drawHeroCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const sample = sampleRef.current;
    if (!canvas || !sample) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1280;
    const h = 720;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    renderAsciiToCanvas({
      ctx,
      sampleData: sample.data,
      cols: sample.cols,
      rows: sample.rows,
      canvasWidth: w,
      canvasHeight: h,
      palette: 'archive-dense',
      contrast: 1.45,
      brightness: -0.06,
      threshold: 0.08,
      invert: false,
      colorMode: 'phosphor-bone',
      emergenceProgress: 1,
      pointerNorm,
      dithering: true,
    });
  }, [pointerNorm]);

  // Audio ownership registration
  useGSAP(
    () => {
      const el = heroRootRef.current;
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom top',
        onEnter: () => enterScene('prologue', 'aud-forest-wind'),
        onLeave: () => leaveScene('prologue'),
        onEnterBack: () => enterScene('prologue', 'aud-forest-wind'),
        onLeaveBack: () => leaveScene('prologue'),
      });

      // Subtle parallax on the monumental headline
      if (!reducedMotion && titleRef.current) {
        gsap.to(titleRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      return () => {
        trigger.kill();
      };
    },
    { scope: heroRootRef, dependencies: [reducedMotion] }
  );

  // Load Seneca Creek woodland image into offscreen pixel sampling buffer
  useEffect(() => {
    if (!heroAsset) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const isMobile = window.innerWidth < 680;
      const cols = isMobile ? 84 : 140;
      const rows = Math.round(cols * 0.52);
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const offCtx = off.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(img, 0, 0, cols, rows);
        sampleRef.current = {
          cols,
          rows,
          data: offCtx.getImageData(0, 0, cols, rows).data,
        };
      }
      drawHeroCanvas();
    };
    img.src = heroAsset.localPath;
  }, [heroAsset, drawHeroCanvas]);

  useEffect(() => {
    drawHeroCanvas();
  }, [drawHeroCanvas]);

  return (
    <section
      ref={heroRootRef}
      id="prologue"
      aria-label="Prologue: The Forest"
      className="relative min-h-screen flex flex-col justify-between bg-[#050605] border-b border-[#181f16] overflow-hidden select-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPointerNorm({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }}
      onMouseLeave={() => setPointerNorm(null)}
    >
      {/* Background Living ASCII Forest Canopy with Subtle Radial Vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-35 transition-opacity duration-1000"
        />
        {showPhotoOverlay && heroAsset && (
          <img
            src={heroAsset.localPath}
            alt={heroAsset.description}
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen transition-opacity duration-500"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(5,6,5,0.4) 0%, rgba(5,6,5,0.85) 65%, rgba(5,6,5,0.99) 100%)',
          }}
        />
      </div>

      {/* Top Special Collections Folio Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech text-[#888173] border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#c89446] tracking-[0.25em]">ENIGMA</span>
          <span className="text-white/20">/</span>
          <span className="tracking-widest uppercase text-[#a8a295]">SPECIAL COLLECTIONS · CASE 001</span>
          <span className="text-white/20 hidden md:inline">/</span>
          <span className="text-[#656054] hidden md:inline font-mono-tech">LOC REF: 2002624018</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <button
            type="button"
            onClick={() => setShowPhotoOverlay((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#101410] hover:bg-[#181f16] text-[#b8b2a5] border border-white/10 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#c89446]" />
            {showPhotoOverlay ? 'Pure ASCII Canvas' : 'Overlay Optical Negative'}
          </button>
          {heroAsset && (
            <button
              type="button"
              onClick={() => setInspectedAsset(heroAsset)}
              className="text-[#888173] hover:text-[#c89446] transition cursor-pointer underline decoration-dotted"
            >
              Seneca Creek Plate (1997)
            </button>
          )}
        </div>
      </header>

      {/* Main Dramatic Sequence */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-12 md:py-20 flex-1 flex flex-col justify-center">
        {/* The 39 Words on Black */}
        <div className="max-w-3xl mb-8 md:mb-12">
          <div className="flex items-center gap-2.5 text-[10px] font-mono-tech text-[#c89446] uppercase tracking-[0.3em] mb-4">
            <Radio className="w-3.5 h-3.5" />
            <span>ORIGINAL 1999 SUNDANCE OPENING TEXT CARD</span>
          </div>
          <blockquote className="font-display italic text-2xl sm:text-3xl md:text-4xl text-[#ede7dc] font-normal leading-[1.3] tracking-wide">
            "In October of 1994, three student filmmakers disappeared in the woods near Burkittsville,
            Maryland while shooting a documentary. A year later their footage was found."
          </blockquote>
          <p className="mt-3 text-xs font-mono-tech text-[#736c5f] uppercase tracking-wider">
            — Haxan Films Opening Title Card · Thirty-Nine Words That Redefined Cinema
          </p>
        </div>

        {/* Monumental Case Title Headline */}
        <div className="relative my-4">
          <h1
            ref={titleRef}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-normal tracking-[-0.01em] text-[#fbf8f1] leading-[0.88] select-none"
          >
            THE BLAIR WITCH
            <span className="block text-[#c89446] font-display italic text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] mt-1 font-normal">
              Incident
            </span>
          </h1>
        </div>

        {/* Subtitle & Core Epistemic Proposition */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-white/[0.08]">
          <div className="lg:col-span-7 space-y-4">
            <p className="font-body text-xl sm:text-2xl text-[#dcd6c8] leading-relaxed font-normal">
              Anatomy of a Modern Digital Mythology: Separating two centuries of fabricated folklore
              from the verified 1997 guerrilla film production and the 1999 internet phenomenon that fooled the world.
            </p>
            <p className="font-body text-base text-[#9a9486] leading-relaxed max-w-2xl">
              ENIGMA maintains an absolute, unbroken boundary throughout this document. Layer A presents the
              fictional mythology constructed by Haxan Films; Layer B documents the real 19th-century history of
              Burkittsville and the eight-day GPS-tracked shoot across Maryland state parklands.
            </p>
          </div>

          {/* Action & Acoustic Consent Vitrine */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-[#0a0d0a]/90 backdrop-blur-md p-6 border border-[#20271d]">
            <div className="text-[10px] font-mono-tech text-[#c89446] uppercase tracking-[0.25em]">
              EXPERIENCE ARCHITECTURE
            </div>

            {/* Non-Autoplay Audio Consent */}
            <div className="space-y-2">
              {!audioEnabled ? (
                <button
                  type="button"
                  onClick={() => enableAudio('prologue', 'aud-forest-wind')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#131812] hover:bg-[#1c241a] text-[#f2ede4] border border-[#2f3d2b] transition cursor-pointer text-xs font-mono-tech group"
                >
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#c89446] group-hover:scale-110 transition-transform" />
                    <span>ENGAGE ACOUSTIC SOUNDSCAPE</span>
                  </span>
                  <span className="text-[10px] text-[#888173]">55Hz DRONE</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => disableAudio()}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#131b13] text-[#86bf97] border border-[#2d4734] transition cursor-pointer text-xs font-mono-tech"
                >
                  <span className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-[#86bf97]" />
                    <span>SOUNDSCAPE ACTIVE · CLICK TO MUTE</span>
                  </span>
                  <span className="text-[10px] text-[#60c07d]">ONLINE</span>
                </button>
              )}
            </div>

            {/* Navigation Jump Button */}
            <button
              type="button"
              onClick={() => onJumpToChapter('chapter-01-the-legend')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#f2ede4] hover:bg-[#ffffff] text-black font-mono-tech text-xs uppercase font-bold tracking-wider transition cursor-pointer active:scale-98"
            >
              <span>BEGIN CHAPTER 01: THE LEGEND</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            {/* Source Register Disclosure */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono-tech text-[#736e63]">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#c89446]" />
                18 VERIFIED ASSETS
              </span>
              <button
                type="button"
                onClick={() => setSourceRegisterOpen(true)}
                className="text-[#c89446] hover:underline cursor-pointer"
              >
                Inspect Sources Register →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Narrative Movement Bar */}
      <footer className="relative z-10 w-full border-t border-white/[0.08] bg-[#070907]/95 px-6 sm:px-10 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-tech text-[#7a7467]">
          <span className="tracking-[0.2em] uppercase font-bold text-[#a8a295]">
            CASE 001 NARRATIVE MOVEMENTS:
          </span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {BLAIR_WITCH_CASE.chapters.map((ch) => {
              const isLore = ch.truthLayer === 'IN-UNIVERSE MYTHOLOGY';
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onJumpToChapter(ch.id)}
                  className="hover:text-[#f2ede4] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#c89446] font-bold">{ch.number}.</span>
                  <span className="hidden md:inline">{ch.title.split(':')[0]}</span>
                  <span
                    className={`text-[8px] uppercase px-1 border ${
                      isLore
                        ? 'text-[#f5a89f] border-[#b83a2e]/50'
                        : 'text-[#a8e0b8] border-[#436e4f]/50'
                    }`}
                  >
                    {isLore ? 'Myth' : 'Fact'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </section>
  );
};

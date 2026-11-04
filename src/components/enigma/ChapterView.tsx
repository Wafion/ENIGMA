import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { EnigmaChapter } from '../../types/enigma';
import { SceneRenderer } from './SceneRenderer';
import { ASCIITransition } from './ASCIITransition';
import { ShieldAlert, CheckCircle, Compass, Film, Radio, FileText, Database, MapPin } from 'lucide-react';
import { useEnigma } from '../../context/EnigmaContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ChapterViewProps {
  chapter: EnigmaChapter;
}

export const ChapterView: React.FC<ChapterViewProps> = ({ chapter }) => {
  const { setActiveChapterId, enterScene, leaveScene } = useEnigma();
  const sectionRef = useRef<HTMLElement | null>(null);

  const isLore = chapter.truthLayer === 'IN-UNIVERSE MYTHOLOGY';
  const ambientTrack = chapter.ambientAudioId || 'NONE';

  // Context-aware scene audio registration with ScrollTrigger
  // Ensures audio begins ONLY when chapter enters viewport and strictly leaves when scrolling away
  useGSAP(
    () => {
      const el = sectionRef.current;
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          setActiveChapterId(chapter.id);
          enterScene(chapter.id, ambientTrack);
        },
        onLeave: () => {
          leaveScene(chapter.id);
        },
        onEnterBack: () => {
          setActiveChapterId(chapter.id);
          enterScene(chapter.id, ambientTrack);
        },
        onLeaveBack: () => {
          leaveScene(chapter.id);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: sectionRef, dependencies: [chapter.id, ambientTrack] }
  );

  // Render bespoke chapter masthead based on chapter personality
  const renderPersonalityMasthead = () => {
    switch (chapter.number) {
      case '01':
        // CH 01: Archival Folklore Folio
        return (
          <div className="border-b border-[#28201a] pb-4 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#a87460] uppercase tracking-[0.2em] mb-2">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#b83a2e]" />
                ARCHIVAL FOLKLORE DOSSIER // RECONSTRUCTED 1809 FOLIO
              </span>
              <span>CATALOG: MD-HIST-COLL-1785</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#b83a2e] via-[#4a1813] to-transparent" />
          </div>
        );

      case '02':
        // CH 02: Historical Cartography & Field Survey
        return (
          <div className="border-b border-[#202d24] pb-4 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#6fa37f] uppercase tracking-[0.2em] mb-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#436e4f]" />
                GEOGRAPHIC FIELD SURVEY // 1858 BOND CARTOGRAPHIC RECORD
              </span>
              <span>DATUM: NAD83 // 39°23′30″N 77°37′37″W</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#436e4f] via-[#1d3324] to-transparent" />
          </div>
        );

      case '03':
        // CH 03: Field Contact Strip & Expedition Log
        return (
          <div className="border-b border-[#2d2218] pb-4 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#d48b59] uppercase tracking-[0.2em] mb-2">
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#c89446]" />
                EXPEDITION CONTACT STRIP // OCTOBER 1994 LOGS
              </span>
              <span>16MM REVERSAL / FRAME GAUGE: 7266 TRI-X</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#c89446] via-[#3d2c18] to-transparent" />
          </div>
        );

      case '04':
        // CH 04: Spatial Canopy & Topographic Distortion
        return (
          <div className="border-b border-[#242b22] pb-4 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#8fa882] uppercase tracking-[0.2em] mb-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#5e8250]" />
                SPATIAL GEOMETRY // SENECA CREEK CANOPY SECTOR 4
              </span>
              <span>CANOPY OBSCURATION: 87.4% // GPS MULTIPATH FAULT</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#5e8250] via-[#212f1c] to-transparent" />
          </div>
        );

      case '05':
        // CH 05: Magnetic Tape & Celluloid Deck
        return (
          <div className="border-b border-[#22252a] pb-4 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#7a9bb5] uppercase tracking-[0.2em] mb-2">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#4a7a9e]" />
                MAGNETIC TAPE &amp; CELLULOID FORENSIC DECK
              </span>
              <span>NTSC 29.97 FPS // AF-HI8 TIME CODE SYNC</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#4a7a9e] via-[#1d2b38] to-transparent" />
          </div>
        );

      case '06':
        // CH 06: Production Archive & Media History
        return (
          <div className="border-b border-[#26241e] pb-4 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#b09e75] uppercase tracking-[0.2em] mb-2">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#c89446]" />
                HAXAN FILMS PRODUCTION ARCHIVE // 1999 INTERNET MIRAGE
              </span>
              <span>SUNDANCE ARCHIVE // DIAL-UP PROTOCOL 1998</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#c89446] via-[#383020] to-transparent" />
          </div>
        );

      case '07':
      default:
        // CH 07: The Quiet Archive & Critical Synthesis
        return (
          <div className="border-b border-[#212320] pb-4 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#8a8e85] uppercase tracking-[0.2em] mb-2">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#9a9e94]" />
                FORENSIC SYNTHESIS // THE QUIET ARCHIVE
              </span>
              <span>PROVENANCE REGISTRY: 18 ASSETS VERIFIED</span>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-[#9a9e94] via-[#242623] to-transparent" />
          </div>
        );
    }
  };

  return (
    <>
      {/* Chapter Transition Dissolve Strip */}
      <ASCIITransition
        chapterNumber={chapter.number}
        word={chapter.transitionAsciiWord}
        coordLabel={chapter.transitionAsciiCoord}
        truthLayer={chapter.truthLayer}
        accentHex={chapter.theme.accentHex}
      />

      <section
        ref={sectionRef}
        id={chapter.id}
        aria-labelledby={`ch-heading-${chapter.id}`}
        className="py-20 px-4 sm:px-8 border-b border-[#1b1f1a] relative"
        style={{ backgroundColor: chapter.theme.bgHex }}
      >
        {/* Subtle Archival Margin Rules */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-[1px] bg-[#1a1e19]/60 pointer-events-none hidden md:block" />
        <div className="absolute right-4 sm:right-8 top-0 bottom-0 w-[1px] bg-[#1a1e19]/60 pointer-events-none hidden md:block" />

        <div className="max-w-5xl mx-auto">
          {/* Chapter Dossier Masthead */}
          <header className="mb-16 pb-10 border-b border-[#232822]">
            {renderPersonalityMasthead()}

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#c89446] px-2 py-0.5 bg-[#141814] border border-[#2a3429] rounded-xs tracking-wider">
                  {chapter.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 border rounded-xs uppercase font-bold text-[10px] flex items-center gap-1.5 tracking-wider ${
                    isLore
                      ? 'bg-[#8f241b]/20 border-[#b83a2e]/60 text-[#f5a89f]'
                      : 'bg-[#293d2e]/20 border-[#436e4f]/60 text-[#a8e0b8]'
                  }`}
                >
                  {isLore ? <ShieldAlert className="w-3.5 h-3.5 text-[#e06d60]" /> : <CheckCircle className="w-3.5 h-3.5 text-[#60c07d]" />}
                  {chapter.truthLayer}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#888275] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chapter.theme.accentHex }} />
                <span className="uppercase tracking-widest">{chapter.theme.moodLabel}</span>
              </div>
            </div>

            <h2
              id={`ch-heading-${chapter.id}`}
              className="font-display text-4xl sm:text-6xl text-[#f2ede4] font-normal tracking-wide leading-[1.15]"
            >
              {chapter.title}
            </h2>

            <p className="mt-4 text-base sm:text-xl font-body text-[#c8c2b4] max-w-3xl leading-relaxed">
              {chapter.subtitle}
            </p>

            {/* Epigraph Block */}
            {chapter.epigraph && (
              <figure className="mt-8 p-6 rounded-xs border-l-2 border-[#b83a2e] bg-[#101310]/80 border-y border-r border-[#1e231d] max-w-2xl">
                <blockquote className="font-display text-lg sm:text-xl text-[#ded8cb] italic leading-relaxed">
                  "{chapter.epigraph.text}"
                </blockquote>
                <figcaption className="mt-3 text-xs font-mono-tech text-[#888275]">
                  — {chapter.epigraph.attribution}
                </figcaption>
              </figure>
            )}

            {/* Editorial Introduction */}
            <div className="mt-8 max-w-3xl text-base sm:text-lg text-[#dcd6c8] leading-relaxed font-body">
              <p className="first-letter:text-5xl first-letter:font-display first-letter:text-[#ece6d9] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                {chapter.introduction}
              </p>
            </div>
          </header>

          {/* Scenes Collection */}
          <div className="space-y-20">
            {chapter.scenes.map((scene) => (
              <SceneRenderer key={scene.id} scene={scene} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

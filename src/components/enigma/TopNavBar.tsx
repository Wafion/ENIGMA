import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  ChevronDown,
  EyeOff,
  Eye,
  Compass,
  FileSpreadsheet,
  Sliders,
  X,
  Menu,
  Film,
  BookOpen,
} from 'lucide-react';
import { useEnigma, CASE_ACTS } from '../../context/EnigmaContext';

interface TopNavBarProps {
  onJumpToChapter: (chapterId: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ onJumpToChapter }) => {
  const {
    viewMode,
    setViewMode,
    activeActIndex,
    setActiveActIndex,
    audioEnabled,
    audioMuted,
    audioVolume,
    currentAmbientId,
    activeCueId,
    toggleAudio,
    setAudioMuted,
    setAudioVolume,
    readingProgress,
    reducedMotion,
    setReducedMotion,
    setSourceRegisterOpen,
  } = useEnigma();

  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setChapterMenuOpen(false);
        setAudioMenuOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentAct = CASE_ACTS[activeActIndex] || CASE_ACTS[0];

  const handleActSelect = (actIndex: number, actId: string) => {
    setActiveActIndex(actIndex);
    if (viewMode === 'broadside') {
      onJumpToChapter(actId);
    }
    setChapterMenuOpen(false);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-40 w-full bg-[#070907]/95 backdrop-blur-md border-b border-[#1b2018] select-none transition-colors"
      >
        {/* Reading Progress Line with Amber Foil Accent (Active in Broadside mode) */}
        {viewMode === 'broadside' && (
          <div
            className="w-full h-[2px] bg-[#121612] overflow-hidden"
            role="progressbar"
            aria-valuenow={readingProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
          >
            <div
              className="h-full bg-gradient-to-r from-[#b83a2e] via-[#c89446] to-[#436e4f] transition-all duration-150 ease-out"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 text-xs font-mono-tech">
          {/* Left: ENIGMA Masthead & Case Pill */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleActSelect(0, 'prologue')}
              className="flex items-baseline gap-2.5 text-[#ece6d9] hover:text-[#c89446] transition cursor-pointer group"
              title="Return to Prologue (Act 00)"
            >
              <span className="font-display text-xl sm:text-2xl font-normal tracking-wider text-[#ece6d9] group-hover:text-[#c89446] transition-colors leading-none">
                ENIGMA
              </span>
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#787265] uppercase hidden sm:inline">
                EXHIBITION
              </span>
            </button>

            <span className="text-[#252c23] hidden sm:inline">|</span>

            <div className="hidden md:flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#121612] border border-[#242c21] text-[#9a9486] text-[10px] tracking-widest uppercase">
                CASE 001
              </span>
              <span className="text-[#706a5e] text-[11px] truncate max-w-[200px]">
                The Blair Witch Incident
              </span>
            </div>
          </div>

          {/* Center: View Mode Switcher (Cinema Exhibition vs Editorial Broadside) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101410] border border-[#242c21]">
            <button
              type="button"
              onClick={() => setViewMode('cinema')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 transition cursor-pointer text-[11px] ${
                viewMode === 'cinema'
                  ? 'bg-[#1b251b] border border-[#3e5641] text-[#a8e0b8] font-bold shadow-xs'
                  : 'text-[#8a8477] hover:text-[#dcd6c8]'
              }`}
              title="Switch to Cinematic Fullscreen Exhibition Mode [C]"
            >
              <Film className="w-3.5 h-3.5 text-[#c89446]" />
              <span className="tracking-wide">CINEMA</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('broadside')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 transition cursor-pointer text-[11px] ${
                viewMode === 'broadside'
                  ? 'bg-[#1b251b] border border-[#3e5641] text-[#a8e0b8] font-bold shadow-xs'
                  : 'text-[#8a8477] hover:text-[#dcd6c8]'
              }`}
              title="Switch to Editorial Broadside Long-Form Reading Mode [B]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#c89446]" />
              <span className="tracking-wide">BROADSIDE</span>
            </button>
          </div>

          {/* Right Controls: Chapter Menu, Audio Mixer, Reduced Motion, Sources, Mobile Trigger */}
          <div className="flex items-center gap-2">
            {/* Chapter Jump Selector Dropdown */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                aria-expanded={chapterMenuOpen}
                aria-haspopup="true"
                onClick={() => {
                  setChapterMenuOpen((o) => !o);
                  setAudioMenuOpen(false);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#101410] hover:bg-[#161c16] text-[#ece6d9] border border-[#262f23] transition cursor-pointer hover:border-[#384534]"
              >
                <Compass className="w-3.5 h-3.5 text-[#c89446]" />
                <span className="font-medium tracking-wide truncate max-w-[160px] text-[11px]">
                  {currentAct.number}. {currentAct.shortTitle}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-[#706a5e] transition-transform duration-200 ${
                    chapterMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Chapter Menu Dropdown */}
              {chapterMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-[#090b09] border border-[#2b3528] shadow-2xl p-2 z-50 animate-in fade-in duration-150"
                  onMouseLeave={() => setChapterMenuOpen(false)}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#787265] px-3 py-1.5 border-b border-[#1a2118]">
                    <span>TABLE OF ACTS</span>
                    <span className="text-[#c89446]">8 ACTS</span>
                  </div>

                  <div className="py-1 max-h-96 overflow-y-auto space-y-1">
                    {CASE_ACTS.map((act) => {
                      const isCur = act.index === activeActIndex;
                      const isLore = act.truthLayer === 'IN-UNIVERSE MYTHOLOGY';

                      return (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => handleActSelect(act.index, act.id)}
                          className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition cursor-pointer border ${
                            isCur
                              ? 'bg-[#161c15] text-[#f2ede4] border-[#384534]'
                              : 'border-transparent text-[#969083] hover:bg-[#121612] hover:text-[#ece6d9]'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="text-[#c89446] mr-2 text-[10px]">{act.number}.</span>
                            <span className="tracking-wide font-medium">{act.title}</span>
                          </div>
                          {act.index !== 0 && (
                            <span
                              className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border shrink-0 ${
                                isLore
                                  ? 'text-[#f5a89f] border-[#b83a2e]/50 bg-[#8f241b]/20'
                                  : 'text-[#a8e0b8] border-[#436e4f]/50 bg-[#293d2e]/20'
                              }`}
                            >
                              {isLore ? 'Lore' : 'Fact'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Toggle & Tactile Mixer Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (!audioEnabled) {
                    toggleAudio();
                  } else {
                    setAudioMenuOpen((o) => !o);
                    setChapterMenuOpen(false);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border transition cursor-pointer text-[11px] ${
                  audioEnabled && !audioMuted
                    ? 'bg-[#141d14] border-[#3e5641] text-[#9ed1ad]'
                    : 'bg-[#101210] border-[#222820] text-[#736d62] hover:text-[#dcd6c8]'
                }`}
                title={audioEnabled ? 'Audio Environment Controls [M]' : 'Enable Acoustic Ambience [M]'}
              >
                {audioEnabled && !audioMuted ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#9ed1ad]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#736d62]" />
                )}
                <span className="hidden sm:inline tracking-wider uppercase font-medium">
                  {audioEnabled && !audioMuted ? 'AUDIO ON' : 'AUDIO OFF'}
                </span>
              </button>

              {/* Audio Mixer Popover */}
              {audioMenuOpen && audioEnabled && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-[#090b09] border border-[#2b3528] shadow-2xl p-4 z-50 space-y-3.5 animate-in fade-in duration-150"
                  onMouseLeave={() => setAudioMenuOpen(false)}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#1c241a] text-[10px] text-[#787265] uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-[#c89446]" />
                      <span>ACOUSTIC ENVIRONMENT</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAudioMuted(!audioMuted)}
                      className="text-[#c89446] hover:underline cursor-pointer tracking-wider text-[10px]"
                    >
                      {audioMuted ? 'UNMUTE' : 'MUTE'}
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-[#9a9486] mb-1.5 font-mono-tech">
                      <span>MASTER GAIN</span>
                      <span className="text-[#c89446] font-bold">{Math.round(audioVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                      className="w-full accent-[#c89446] cursor-pointer"
                      aria-label="Master gain volume slider"
                    />
                  </div>

                  <div className="text-[10px] font-mono-tech text-[#787265] bg-[#0f130f] p-2 border border-[#1b2218] space-y-1">
                    <div className="flex justify-between">
                      <span>ACTIVE LAYER:</span>
                      <span className="text-[#ece6d9] font-bold">{currentAmbientId}</span>
                    </div>
                    {activeCueId && (
                      <div className="flex justify-between text-[#e06d60]">
                        <span>CUE FIRED:</span>
                        <span className="font-bold">{activeCueId}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      toggleAudio();
                      setAudioMenuOpen(false);
                    }}
                    className="w-full py-1.5 text-center bg-[#131813] hover:bg-[#1a2219] border border-[#283526] text-xs text-[#c2bcb0] transition cursor-pointer uppercase tracking-wider"
                  >
                    Shut Down Sound Engine
                  </button>
                </div>
              )}
            </div>

            {/* Reduced Motion Toggle Button */}
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`p-1.5 border transition cursor-pointer hidden md:inline-flex ${
                reducedMotion
                  ? 'bg-[#1b261b] border-[#436e4f] text-[#a8e0b8]'
                  : 'bg-[#101210] border-[#222820] text-[#736d62] hover:text-[#dcd6c8]'
              }`}
              title={
                reducedMotion
                  ? 'Reduced Motion Active (Minimal transitions & animations)'
                  : 'Cinematic Motion Active'
              }
              aria-label="Toggle reduced motion preference"
            >
              {reducedMotion ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>

            {/* Source Register Drawer Trigger */}
            <button
              type="button"
              onClick={() => setSourceRegisterOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#121612] hover:bg-[#1a2218] border border-[#263124] text-[#c2bcb0] hover:text-[#f2ede4] transition cursor-pointer text-[11px]"
              title="Open Archival Source Register (18 Verified Assets)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#c89446]" />
              <span className="hidden sm:inline tracking-wider uppercase">SOURCES</span>
              <span className="text-[10px] text-[#c89446] font-bold bg-[#1d1912] px-1 border border-[#3b301c]">
                18
              </span>
            </button>

            {/* Mobile Navigation Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-1.5 bg-[#101310] border border-[#242c22] text-[#dcd6c8] hover:text-[#c89446] transition cursor-pointer"
              aria-label="Open Chapter Dispatches Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end md:hidden animate-in fade-in duration-200">
          <div className="w-4/5 max-w-sm bg-[#090b09] border-l border-[#252f22] h-full p-5 flex flex-col justify-between font-mono-tech">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1b2218] mb-4">
                <div>
                  <span className="font-display text-2xl text-[#ece6d9]">ENIGMA</span>
                  <div className="text-[10px] text-[#787265] uppercase tracking-wider">
                    CASE 001 · DISPATCHES
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-[#787265] hover:text-[#ece6d9] cursor-pointer"
                  aria-label="Close chapter menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* View Mode Switcher in Mobile Drawer */}
              <div className="mb-4 p-2 bg-[#101410] border border-[#242c21] flex justify-between items-center text-xs">
                <span className="text-[#8a8477]">VIEW MODE:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('cinema');
                      setMobileDrawerOpen(false);
                    }}
                    className={`px-2 py-0.5 border ${
                      viewMode === 'cinema'
                        ? 'bg-[#1b251b] border-[#3e5641] text-[#a8e0b8]'
                        : 'text-[#8a8477] border-transparent'
                    }`}
                  >
                    CINEMA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('broadside');
                      setMobileDrawerOpen(false);
                    }}
                    className={`px-2 py-0.5 border ${
                      viewMode === 'broadside'
                        ? 'bg-[#1b251b] border-[#3e5641] text-[#a8e0b8]'
                        : 'text-[#8a8477] border-transparent'
                    }`}
                  >
                    BROADSIDE
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[55vh]">
                {CASE_ACTS.map((act) => {
                  const isCur = act.index === activeActIndex;
                  const isLore = act.truthLayer === 'IN-UNIVERSE MYTHOLOGY';

                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleActSelect(act.index, act.id)}
                      className={`w-full text-left p-2.5 flex items-center justify-between text-xs border ${
                        isCur
                          ? 'bg-[#151c14] text-[#f2ede4] border-[#384534]'
                          : 'border-transparent text-[#969083]'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="text-[#c89446] mr-1.5">{act.number}.</span>
                        <span>{act.title}</span>
                      </div>
                      {act.index !== 0 && (
                        <span
                          className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border shrink-0 ${
                            isLore
                              ? 'text-[#f5a89f] border-[#b83a2e]/50 bg-[#8f241b]/20'
                              : 'text-[#a8e0b8] border-[#436e4f]/50 bg-[#293d2e]/20'
                          }`}
                        >
                          {isLore ? 'Lore' : 'Fact'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1b2218] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#787265]">REDUCED MOTION:</span>
                <button
                  type="button"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`px-2.5 py-1 text-[11px] border ${
                    reducedMotion
                      ? 'bg-[#1b261b] text-[#a8e0b8] border-[#436e4f]'
                      : 'bg-[#101210] text-[#736d62] border-[#222820]'
                  }`}
                >
                  {reducedMotion ? 'ON' : 'OFF'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSourceRegisterOpen(true);
                  setMobileDrawerOpen(false);
                }}
                className="w-full py-2 bg-[#121612] border border-[#263124] text-xs text-[#c2bcb0] text-center"
              >
                Open Source Register (18 Assets)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

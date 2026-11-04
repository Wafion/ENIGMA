import React from 'react';
import { useEnigma } from '../../context/EnigmaContext';
import { BLAIR_WITCH_CASE } from '../../data/blairWitchCase';

interface DesktopChapterRailProps {
  onJumpToChapter: (chapterId: string) => void;
}

export const DesktopChapterRail: React.FC<DesktopChapterRailProps> = ({ onJumpToChapter }) => {
  const { activeChapterId, readingProgress } = useEnigma();

  const chapters = [
    { id: 'prologue', number: '00', title: 'Prologue: The Forest', isLore: false },
    ...BLAIR_WITCH_CASE.chapters.map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title,
      isLore: ch.truthLayer === 'IN-UNIVERSE MYTHOLOGY',
    })),
  ];

  return (
    <nav
      aria-label="Chapter navigation rail"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-3 select-none"
    >
      {/* Background Track Line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-[#1a2118] -z-10">
        <div
          className="w-full bg-[#c89446] transition-all duration-150"
          style={{ height: `${readingProgress}%` }}
        />
      </div>

      {chapters.map((ch) => {
        const isActive = activeChapterId === ch.id;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onJumpToChapter(ch.id)}
            className="group relative flex items-center cursor-pointer py-1"
            aria-current={isActive ? 'step' : undefined}
          >
            {/* Visual Dot / Tick */}
            <div
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-[#c89446] border-[#f2ede4] scale-125 shadow-[0_0_10px_rgba(200,148,70,0.8)]'
                  : ch.isLore
                  ? 'bg-[#0f0d0c] border-[#8f3a32] group-hover:border-[#d95343] group-hover:scale-110'
                  : 'bg-[#0a0d0a] border-[#2b3528] group-hover:border-[#c89446] group-hover:scale-110'
              }`}
            >
              {isActive && <span className="w-1 h-1 rounded-full bg-black" />}
            </div>

            {/* Hover Tooltip / Floating Chapter Label */}
            <div className="absolute left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-[#0b0e0b]/95 backdrop-blur-md border border-[#263124] px-2.5 py-1 text-xs font-mono-tech text-[#f2ede4] shadow-xl flex items-center gap-2">
              <span className="text-[#c89446] font-bold">{ch.number}</span>
              <span>{ch.title}</span>
              <span
                className={`text-[9px] uppercase px-1 border ${
                  ch.isLore
                    ? 'text-[#f5a89f] border-[#b83a2e]/60'
                    : 'text-[#a8e0b8] border-[#436e4f]/60'
                }`}
              >
                {ch.isLore ? 'Myth' : 'Fact'}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};

import { useEffect, useRef } from 'react';
import { useExperience } from './ExperienceContext';
import { refreshMotion, useReveals } from './motion';
import {
  ChapterIndex,
  ChapterRail,
  Masthead,
  SourceDrawer,
} from './components/Chrome';
import { AssetDialog } from './components/primitives';
import { CaseAsciiOpener } from './components/CaseAsciiOpener';
import { Prologue } from './components/Prologue';
import { ChapterOne } from './components/ChapterOne';
import { ChapterTwo } from './components/ChapterTwo';
import { ChapterThree } from './components/ChapterThree';
import { ChapterFour } from './components/ChapterFour';
import { ChapterFive } from './components/ChapterFive';
import { ChapterSix } from './components/ChapterSix';
import { ChapterSeven } from './components/ChapterSeven';
import { Footer } from './components/Footer';

export function Experience() {
  const { reducedMotion, setActiveChapterId } = useExperience();
  const mainRef = useRef<HTMLElement | null>(null);
  useReveals(mainRef, reducedMotion);

  useEffect(() => refreshMotion(), []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
      if (!sections.length) return;
      const line = window.innerHeight * 0.38;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section;
      }
      if (current) setActiveChapterId(current.dataset.chapter || current.id);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [setActiveChapterId]);

  return (
    <div id="top" className={`experience ${reducedMotion ? 'is-reduced-motion' : ''}`}>
      <CaseAsciiOpener />
      <a className="skip-link" href="#main">
        Skip to the essay
      </a>
      <Masthead />
      <ChapterRail />
      <main id="main" ref={mainRef}>
        <Prologue />
        <ChapterOne />
        <ChapterTwo />
        <ChapterThree />
        <ChapterFour />
        <ChapterFive />
        <ChapterSix />
        <ChapterSeven />
      </main>
      <Footer />
      <ChapterIndex />
      <SourceDrawer />
      <AssetDialog />
    </div>
  );
}

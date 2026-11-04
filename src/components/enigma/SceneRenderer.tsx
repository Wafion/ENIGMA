import React from 'react';
import type { EnigmaElement, EnigmaScene } from '../../types/enigma';
import { ArchivalImage } from './ArchivalImage';
import { ASCIIImage } from './ASCIIImage';
import { DocumentViewer } from './DocumentViewer';
import { TimelineView } from './TimelineView';
import { InteractiveMap } from './InteractiveMap';
import { ASCIIRecordingDeck } from './ASCIIRecordingDeck';
import { FactFictionMatrix } from './FactFictionMatrix';
import { AudioCueCard } from './AudioCueCard';
import { SourceAnnotation } from './SourceAnnotation';
import { MapPin, Calendar, ShieldAlert, CheckCircle, Quote } from 'lucide-react';

interface SceneRendererProps {
  scene: EnigmaScene;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene }) => {
  const isLore = scene.truthLayer === 'IN-UNIVERSE MYTHOLOGY';

  // Helper to parse [SRC-XX] tags in text paragraphs into clickable SourceAnnotation components
  const renderParagraphWithAnnotations = (text: string, pIdx: number, isDropcap = false) => {
    const parts = text.split(/(\[SRC-\d{2}\])/g);

    return (
      <p
        key={pIdx}
        className={`text-[#d4cec2] font-body text-base sm:text-lg leading-[1.85] my-4 font-normal ${
          isDropcap
            ? 'first-letter:text-5xl first-letter:font-display first-letter:text-[#ece6d9] first-letter:float-left first-letter:mr-3 first-letter:leading-none'
            : ''
        }`}
      >
        {parts.map((part, idx) => {
          const match = part.match(/\[(SRC-\d{2})\]/);
          if (match) {
            return <SourceAnnotation key={idx} sourceCode={match[1]} />;
          }
          return part;
        })}
      </p>
    );
  };

  const renderElement = (el: EnigmaElement) => {
    switch (el.type) {
      case 'text':
        return (
          <div key={el.id} className="prose-enigma my-4">
            {el.leadParagraph && (
              <p className="font-display text-xl sm:text-2xl text-[#ece6d9] italic leading-relaxed mb-4">
                {el.leadParagraph}
              </p>
            )}
            {el.paragraphs.map((p, pIdx) =>
              renderParagraphWithAnnotations(p, pIdx, el.dropcap && pIdx === 0 && !el.leadParagraph)
            )}
          </div>
        );

      case 'quote':
        return (
          <figure
            key={el.id}
            className="my-10 p-6 sm:p-8 border-l-2 border-[#c89446] bg-[#0c0e0c] border-y border-r border-[#1e231c]"
          >
            <div className="flex items-center gap-2 text-[#c89446] mb-3">
              <Quote className="w-4 h-4 opacity-75" />
              <span className="text-[10px] font-mono-tech tracking-widest uppercase">
                TESTIMONY &amp; INTERVIEW DEPOSITION
              </span>
            </div>
            <blockquote className="font-display text-xl sm:text-2xl text-[#f2ede4] italic leading-relaxed">
              "{el.quote}"
            </blockquote>
            <figcaption className="mt-4 pt-3 border-t border-[#1a1f18] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech text-[#8a8477]">
              <div>
                <span className="font-bold text-[#c89446]">{el.speaker}</span>
                {el.roleOrContext && <span> — {el.roleOrContext}</span>}
              </div>
              <div className="flex items-center gap-3">
                <span>{el.date}</span>
                <SourceAnnotation sourceCode={el.sourceCode} />
              </div>
            </figcaption>
          </figure>
        );

      case 'image':
        return (
          <ArchivalImage
            key={el.id}
            assetId={el.assetId}
            treatment={el.treatment}
            caption={el.caption}
            archivalNote={el.archivalNote}
            aspectRatio={el.aspectRatio}
          />
        );

      case 'ascii-visual':
        return (
          <ASCIIImage
            key={el.id}
            assetId={el.assetId}
            title={el.title}
            subtitle={el.subtitle}
            narrativeContext={el.narrativeContext}
            initialConfig={el.asciiConfig}
            storytellingMode={el.storytellingMode}
          />
        );

      case 'document':
        return (
          <DocumentViewer
            key={el.id}
            assetId={el.assetId}
            dossierCode={el.dossierCode}
            title={el.title}
            inUniverseDate={el.inUniverseDate}
            realCreationContext={el.realCreationContext}
            summary={el.summary}
            transcriptExcerpt={el.transcriptExcerpt}
            factCheckVerdict={el.factCheckVerdict}
          />
        );

      case 'timeline':
        return (
          <TimelineView
            key={el.id}
            title={el.title}
            subtitle={el.subtitle}
            items={el.items}
          />
        );

      case 'map':
        return (
          <InteractiveMap
            key={el.id}
            title={el.title}
            subtitle={el.subtitle}
            baseMapAssetId={el.baseMapAssetId}
            secondaryMapAssetId={el.secondaryMapAssetId}
            markers={el.markers}
          />
        );

      case 'audio-cue':
        return (
          <AudioCueCard
            key={el.id}
            assetId={el.assetId}
            cueCode={el.cueCode}
            title={el.title}
            narrativePurpose={el.narrativePurpose}
            durationLabel={el.durationLabel}
            transcriptOrDescription={el.transcriptOrDescription}
          />
        );

      case 'recording-deck':
        return (
          <ASCIIRecordingDeck
            key={el.id}
            title={el.title}
            subtitle={el.subtitle}
            cameraAssetId={el.cameraAssetId}
            segments={el.segments}
          />
        );

      case 'fact-fiction-matrix':
        return (
          <FactFictionMatrix
            key={el.id}
            title={el.title}
            subtitle={el.subtitle}
            rows={el.rows}
          />
        );

      default:
        return null;
    }
  };

  return (
    <article className="my-16 border-t border-[#1c211a] pt-12">
      {/* Scene Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#c89446] px-2 py-0.5 bg-[#141813] border border-[#262f23] rounded-xs tracking-wider">
              {scene.code}
            </span>
            <span
              className={`px-2.5 py-0.5 border rounded-xs uppercase font-bold text-[10px] flex items-center gap-1.5 tracking-wider ${
                isLore
                  ? 'bg-[#8f241b]/20 border-[#b83a2e]/50 text-[#f5a89f]'
                  : 'bg-[#293d2e]/20 border-[#436e4f]/50 text-[#a8e0b8]'
              }`}
            >
              {isLore ? <ShieldAlert className="w-3 h-3 text-[#e06d60]" /> : <CheckCircle className="w-3 h-3 text-[#60c07d]" />}
              {scene.truthLayer}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#8a8477]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c89446]" />
              {scene.locationStamp}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c89446]" />
              {scene.dateStamp}
            </span>
          </div>
        </div>

        <h3 className="font-display text-3xl sm:text-4xl text-[#ece6d9] font-normal tracking-wide leading-tight">
          {scene.title}
        </h3>
        {scene.subtitle && (
          <p className="mt-1.5 text-sm font-mono-tech text-[#8e887b]">{scene.subtitle}</p>
        )}
      </header>

      {/* Compositions Stack */}
      <div className="space-y-10">
        {scene.compositions.map((comp) => {
          switch (comp.layout) {
            case 'split-investigative':
              return (
                <div
                  key={comp.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start my-8"
                >
                  {comp.elements.map((el) => (
                    <div key={el.id}>{renderElement(el)}</div>
                  ))}
                </div>
              );

            case 'dossier-grid':
              return (
                <div
                  key={comp.id}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start my-8"
                >
                  {comp.elements.map((el) => (
                    <div key={el.id}>{renderElement(el)}</div>
                  ))}
                </div>
              );

            case 'full-bleed-cinema':
              return (
                <div key={comp.id} className="w-full my-10">
                  {comp.elements.map((el) => renderElement(el))}
                </div>
              );

            case 'single-editorial':
            default:
              return (
                <div key={comp.id} className="max-w-3xl mx-auto my-8 space-y-5">
                  {comp.elements.map((el) => renderElement(el))}
                </div>
              );
          }
        })}
      </div>
    </article>
  );
};

import React from 'react';
import { SOURCE_MAP } from '../../data/blairWitchAssets';
import { useEnigma } from '../../context/EnigmaContext';

interface SourceAnnotationProps {
  sourceCode: string;
}

export const SourceAnnotation: React.FC<SourceAnnotationProps> = ({ sourceCode }) => {
  const { openSourceCitation } = useEnigma();
  const source = SOURCE_MAP[sourceCode];

  if (!source) {
    return <span className="text-[#888275]">[{sourceCode}]</span>;
  }

  return (
    <button
      type="button"
      onClick={() => openSourceCitation(sourceCode)}
      className="inline-flex items-center px-1.5 py-0.2 mx-0.5 text-[11px] font-mono-tech text-[#c89446] hover:text-[#f7f2e8] bg-[#1a1e19] hover:bg-[#283226] border border-[#333c30] rounded-xs transition cursor-pointer"
      title={`Source Citation [${sourceCode}]: ${source.title}`}
    >
      [{sourceCode}]
    </button>
  );
};

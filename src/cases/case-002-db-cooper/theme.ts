import type { CaseClimate } from '../../core/types/caseSchema';

/**
 * Case 002 climate: a Pacific Northwest night in late November.
 * Cold aluminium, wet evergreen, runway amber, and the warm paper of a case file.
 */
export const dbCooperClimate: CaseClimate = {
  nightField: '#090c0f',
  canopyGround: '#0e1417',
  paperTone: '#e4ded0',
  inkTone: '#15181a',
  boneTone: '#e7e2d6',
  accentTone: '#c08a4a',
  secondaryAccent: '#71878e',
  displayFont: 'Instrument Serif, serif',
  bodyFont: 'Newsreader Variable, Georgia, serif',
  monoFont: 'Geist Mono Variable, monospace',
  filmGrainOpacity: 0.03,
  vignetteStrength: 0.5,
};

export const DBC = {
  night: '#090c0f',
  deeper: '#05080a',
  panel: '#0d1215',
  fog: '#c9c5ba',
  bone: '#e7e2d6',
  paper: '#e4ded0',
  ink: '#15181a',
  mist: '#949086',
  steel: '#71878e',
  amber: '#c08a4a',
  ember: '#a8482f',
  signal: '#b4402f',
  ice: '#cfd7d6',
} as const;

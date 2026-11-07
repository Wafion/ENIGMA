import {
  ForensicMapPlate,
  ArchivalVitrine,
  TruthLedger,
  OpticalCompareSlider,
  AudioTapeDeck,
  DualTrackChronology,
} from '../documentary-production/exhibits';
import type {
  ForensicMapPlateConfig,
  ArchivalVitrineConfig,
  TruthLedgerRow,
  OpticalCompareConfig,
  AudioTapeSegment,
} from '../../core/types/exhibits';

interface ChronologyItem {
  id: string;
  date: string;
  title: string;
  trackAEvent: string;
  trackBEvent: string;
  sourceCode: string;
}

interface DynamicExhibitRendererProps {
  type: string;
  config: Record<string, unknown>;
  onOpenSource?: (code: string) => void;
}

export function DynamicExhibitRenderer({ type, config, onOpenSource: _onOpenSource }: DynamicExhibitRendererProps) {
  if (!type || !config) return null;

  const norm = type.toLowerCase().replace(/[^a-z]/g, '');

  if (norm.includes('map')) {
    return (
      <div className="my-12">
        <ForensicMapPlate config={config as unknown as ForensicMapPlateConfig} />
      </div>
    );
  }

  if (norm.includes('vitrine')) {
    return (
      <div className="my-12">
        <ArchivalVitrine config={config as unknown as ArchivalVitrineConfig} />
      </div>
    );
  }

  if (norm.includes('ledger') || norm.includes('truth')) {
    const rows = (config.rows as TruthLedgerRow[]) || (Array.isArray(config) ? config : []);
    return (
      <div className="my-12">
        <TruthLedger rows={rows as TruthLedgerRow[]} />
      </div>
    );
  }

  if (norm.includes('compare') || norm.includes('optical')) {
    return (
      <div className="my-12">
        <OpticalCompareSlider config={config as unknown as OpticalCompareConfig} />
      </div>
    );
  }

  if (norm.includes('tape') || norm.includes('audio')) {
    const segments = (config.segments as AudioTapeSegment[]) || (Array.isArray(config) ? config : []);
    return (
      <div className="my-12">
        <AudioTapeDeck segments={segments as AudioTapeSegment[]} />
      </div>
    );
  }

  if (norm.includes('chronology')) {
    const items = (config.items as ChronologyItem[]) || (Array.isArray(config) ? config : []);
    return (
      <div className="my-12">
        <DualTrackChronology items={items as ChronologyItem[]} />
      </div>
    );
  }

  return null;
}

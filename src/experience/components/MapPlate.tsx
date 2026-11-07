import { useState, type CSSProperties } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { MapMarkerItem } from '../../types/enigma';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { useExperience } from '../ExperienceContext';

interface MapPlateProps {
  title: string;
  subtitle: string;
  baseMapAssetId: string;
  secondaryMapAssetId?: string;
  markers: MapMarkerItem[];
}

export function MapPlate({
  title,
  subtitle,
  baseMapAssetId,
  secondaryMapAssetId,
  markers,
}: MapPlateProps) {
  const { inspectAsset, triggerSfx } = useExperience();
  const [mapId, setMapId] = useState(baseMapAssetId);
  const [selectedId, setSelectedId] = useState(markers[0]?.id ?? '');
  const [zoom, setZoom] = useState(1);
  const map = ASSET_MAP[mapId] ?? ASSET_MAP[baseMapAssetId];
  const selected = markers.find((marker) => marker.id === selectedId) ?? markers[0];

  if (!map) return null;

  return (
    <section className="map-plate" aria-labelledby="map-title">
      <header className="map-plate__head">
        <div>
          <p className="kicker">Library of Congress · cartography as ground</p>
          <h3 id="map-title">{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="map-plate__switcher" role="group" aria-label="Map edition">
          <button
            type="button"
            className={mapId === baseMapAssetId ? 'is-active' : ''}
            onClick={() => {
              setMapId(baseMapAssetId);
              triggerSfx('sfx-paper-turn');
            }}
          >
            1858 survey
          </button>
          {secondaryMapAssetId && (
            <button
              type="button"
              className={mapId === secondaryMapAssetId ? 'is-active' : ''}
              onClick={() => {
                setMapId(secondaryMapAssetId);
                triggerSfx('sfx-paper-turn');
              }}
            >
              1861 relief
            </button>
          )}
        </div>
      </header>

      <div className="map-plate__layout">
        <div
          className="map-plate__stage"
          style={{ '--zoom': zoom } as CSSProperties}
          role="region"
          aria-label="Map with selected locations. Use the list below for the accessible version."
        >
          <div className="map-plate__canvas">
            <img src={map.localPath} alt={map.description} loading="lazy" decoding="async" />
            {markers.map((marker) => (
              <button
                key={marker.id}
                type="button"
                className={`map-marker ${marker.id === selectedId ? 'is-active' : ''} ${
                  marker.layer === 'real-production' ? 'is-production' : ''
                }`}
                style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
                onClick={() => {
                  setSelectedId(marker.id);
                  triggerSfx('sfx-camera-shutter');
                }}
                aria-label={`Show ${marker.label}`}
                aria-pressed={marker.id === selectedId}
              >
                <span className="map-marker__dot" />
                <span className="map-marker__name">{marker.label}</span>
              </button>
            ))}
          </div>
          <div className="map-plate__tools">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(1, Number((value - 0.2).toFixed(1))))}
              aria-label="Zoom out"
            >
              <Minus size={15} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(2, Number((value + 0.2).toFixed(1))))}
              aria-label="Zoom in"
            >
              <Plus size={15} aria-hidden />
            </button>
            <button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom">
              <RotateCcw size={14} aria-hidden />
            </button>
          </div>
        </div>

        <div className="map-plate__detail">
          <p className="kicker">Selected place</p>
          <h4>{selected?.label}</h4>
          {selected && (
            <>
              <dl>
                <div>
                  <dt>In the story</dt>
                  <dd>{selected.fictionalLocationName}</dd>
                </div>
                <div>
                  <dt>On the ground</dt>
                  <dd>{selected.realLocationName}</dd>
                </div>
                <div>
                  <dt>Coordinates</dt>
                  <dd className="mono">{selected.coordinates}</dd>
                </div>
              </dl>
              <p>{selected.description}</p>
            </>
          )}
          <div className="map-plate__list" aria-label="All mapped locations">
            {markers.map((marker) => (
              <button
                key={marker.id}
                type="button"
                className={marker.id === selectedId ? 'is-active' : ''}
                onClick={() => setSelectedId(marker.id)}
              >
                <span>{marker.code}</span>
                {marker.label}
              </button>
            ))}
          </div>
          <button type="button" className="text-link" onClick={() => inspectAsset(mapId)}>
            Inspect the map record <span aria-hidden>↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}

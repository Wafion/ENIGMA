import { useEffect, useRef, useState } from 'react';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { renderAsciiToCanvas } from '../../utils/asciiRenderer';

export function AsciiCompare({ assetId }: { assetId: string }) {
  const asset = ASSET_MAP[assetId];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [split, setSplit] = useState(46);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!asset) return;
    let cancelled = false;
    const canvas = canvasRef.current;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (cancelled || !canvas) return;
      const aspect = image.naturalHeight / Math.max(1, image.naturalWidth);
      const cols = 148;
      const rows = Math.max(34, Math.round(cols * aspect * 0.54));
      const offscreen = document.createElement('canvas');
      offscreen.width = cols;
      offscreen.height = rows;
      const offscreenContext = offscreen.getContext('2d');
      if (!offscreenContext) return;
      offscreenContext.drawImage(image, 0, 0, cols, rows);
      const sample = offscreenContext.getImageData(0, 0, cols, rows).data;

      const width = 1280;
      const height = Math.round(width * aspect);
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return;
      renderAsciiToCanvas({
        ctx: context,
        sampleData: sample,
        cols,
        rows,
        canvasWidth: width,
        canvasHeight: height,
        palette: 'minimal-mono',
        contrast: 1.34,
        brightness: 0.06,
        threshold: 0.055,
        invert: false,
        colorMode: 'phosphor-bone',
        dithering: true,
      });
      setReady(true);
    };
    image.src = asset.localPath;
    return () => {
      cancelled = true;
    };
  }, [asset]);

  if (!asset) return null;

  return (
    <div className="ascii-compare">
      <div className="ascii-compare__stage">
        <img src={asset.localPath} alt={asset.description} loading="lazy" decoding="async" />
        <div
          className="ascii-compare__canvas"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          aria-hidden
        >
          <canvas ref={canvasRef} />
        </div>
        <span
          className="ascii-compare__divider"
          style={{ left: `${split}%` }}
          aria-hidden
        >
          <span />
        </span>
        <span className="ascii-compare__tag ascii-compare__tag--left">Photograph</span>
        <span className="ascii-compare__tag ascii-compare__tag--right">
          {ready ? 'Character field' : 'Rendering…'}
        </span>
      </div>
      <div className="ascii-compare__controls">
        <label htmlFor="ascii-split">
          <span>Optical</span>
          <input
            id="ascii-split"
            type="range"
            min="8"
            max="92"
            value={split}
            onChange={(event) => setSplit(Number(event.target.value))}
          />
          <span>Symbolic</span>
        </label>
        <p>
          A single comparison, not a filter for the whole film. The character field translates
          luminance; it does not recover detail the photograph does not contain.
        </p>
      </div>
    </div>
  );
}

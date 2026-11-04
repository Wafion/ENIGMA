import { useMemo, useState } from 'react';
import type { RecordingSegmentItem } from '../../types/enigma';

function ProceduralFrame({ scene, gauge }: { scene: RecordingSegmentItem['proceduralScene']; gauge: RecordingSegmentItem['gauge'] }) {
  const isHi8 = gauge === 'hi8-ntsc-color';
  const ink = isHi8 ? '#d8cfb6' : '#e1e5dc';
  const dim = isHi8 ? '#8f8a76' : '#7f8880';
  const ground = isHi8 ? '#2d2b22' : '#171a17';

  return (
    <svg viewBox="0 0 800 450" role="img" aria-label={`Procedural reconstruction of the ${scene.replace('-', ' ')}`}>
      <rect width="800" height="450" fill={ground} />
      {scene === 'cemetery-slate' && (
        <>
          <rect width="800" height="200" fill={isHi8 ? '#68675a' : '#3d433d'} />
          <path d="M0 200 Q180 172 340 198 T800 188 V450 H0Z" fill={isHi8 ? '#4a493c' : '#2c312b'} />
          {[90, 165, 245, 330, 435, 520, 620, 710].map((x, index) => (
            <g key={x} fill="none" stroke={ink} strokeWidth="2" opacity={0.7 + (index % 3) * 0.1}>
              <path d={`M${x} 390 V${285 + (index % 4) * 16} Q${x + 18} ${268 + (index % 4) * 16} ${x + 36} ${285 + (index % 4) * 16} V390`} />
              <path d={`M${x + 10} ${310 + (index % 4) * 16} H${x + 26}`} opacity="0.5" />
            </g>
          ))}
          <path d="M680 250 V95 M680 145 L630 110 M680 170 L735 120" stroke={ink} strokeWidth="3" fill="none" opacity="0.6" />
          <path d="M40 450 L160 220 L250 450" fill="none" stroke={dim} strokeWidth="1" opacity="0.35" />
        </>
      )}
      {scene === 'creek-crossing' && (
        <>
          <rect width="800" height="250" fill={isHi8 ? '#5a5947' : '#343a34'} />
          <path d="M0 250 L170 190 L360 235 L570 185 L800 245 V450 H0Z" fill={isHi8 ? '#3f3f31' : '#20251f'} />
          <g stroke={isHi8 ? '#a7a58e' : '#a8b0a5'} strokeWidth="2" opacity="0.65" fill="none">
            <path d="M0 338 Q180 318 330 344 T800 328" />
            <path d="M0 372 Q160 355 340 376 T800 360" />
            <path d="M0 405 Q220 385 370 410 T800 394" />
          </g>
          <path d="M215 310 L630 355" stroke={isHi8 ? '#77745e' : '#a3aa9c'} strokeWidth="22" strokeLinecap="round" />
          <path d="M215 310 L630 355" stroke={ground} strokeWidth="13" strokeLinecap="round" />
          <path d="M90 250 L70 75 M110 250 L130 90 M90 150 L55 110 M110 160 L145 118" stroke={ink} strokeWidth="3" opacity="0.6" />
          <path d="M700 255 L690 80 M720 255 L738 96 M700 150 L660 104 M720 165 L760 116" stroke={ink} strokeWidth="3" opacity="0.55" />
        </>
      )}
      {scene === 'twana-grove' && (
        <>
          <rect width="800" height="450" fill={isHi8 ? '#26251d' : '#101410'} />
          {[80, 190, 310, 440, 570, 700].map((x, index) => (
            <g key={x} stroke={isHi8 ? '#88846f' : '#8e978b'} strokeWidth={index % 2 ? 4 : 6} opacity="0.55">
              <path d={`M${x} 450 V${20 + (index % 3) * 20}`} />
              <path d={`M${x} ${80 + index * 35} L${x - 40} ${45 + index * 30} M${x} ${120 + index * 25} L${x + 52} ${72 + index * 30}`} />
            </g>
          ))}
          {[165, 285, 390, 515, 635].map((x, index) => (
            <g key={x} stroke={ink} strokeWidth="3" strokeLinecap="round" opacity={0.7 + (index % 2) * 0.15}>
              <path d={`M${x} ${165 + (index % 3) * 45} v100`} />
              <path d={`M${x - 28} ${195 + (index % 3) * 45} H${x + 28}`} />
              <path d={`M${x} ${225 + (index % 3) * 45} L${x - 18} ${266 + (index % 3) * 45} M${x} ${225 + (index % 3) * 45} L${x + 18} ${266 + (index % 3) * 45}`} />
              <circle cx={x} cy={188 + (index % 3) * 45} r={5} fill={ink} stroke="none" />
            </g>
          ))}
          <path d="M0 390 Q220 350 420 392 T800 380 V450 H0Z" fill={isHi8 ? '#3d3a2d' : '#1b211b'} />
        </>
      )}
      {scene === 'tent-apology' && (
        <>
          <rect width="800" height="450" fill={isHi8 ? '#1f1d18' : '#0d100e'} />
          <path d="M120 450 L320 60 L690 450Z" fill={isHi8 ? '#4a4538' : '#252a24'} stroke={isHi8 ? '#8b826d' : '#667066'} strokeWidth="2" opacity="0.8" />
          <path d="M320 60 L360 450" stroke={isHi8 ? '#2f2c23' : '#131713'} strokeWidth="20" />
          <ellipse cx="410" cy="320" rx="92" ry="120" fill={isHi8 ? '#1a1814' : '#090b09'} />
          <path d="M355 300 Q405 260 455 300" stroke={isHi8 ? '#b1a58d' : '#bac2b8'} strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M350 360 Q410 345 470 360" stroke={isHi8 ? '#b1a58d' : '#bac2b8'} strokeWidth="2" fill="none" opacity="0.4" />
          <path d="M0 450 Q190 410 330 445 T800 430 V450Z" fill={ground} opacity="0.9" />
        </>
      )}
      {scene === 'griggs-cellar' && (
        <>
          <rect width="800" height="450" fill={isHi8 ? '#25241d' : '#111411'} />
          <path d="M0 450 V130 L240 60 L510 130 L800 65 V450Z" fill={isHi8 ? '#4b483b' : '#242924'} opacity="0.85" />
          <g stroke={isHi8 ? '#817b67' : '#687166'} strokeWidth="1.2" opacity="0.5">
            {[0, 1, 2, 3, 4].map((row) =>
              [0, 1, 2, 3, 4].map((col) => (
                <rect key={`${row}-${col}`} x={30 + col * 120 + (row % 2) * 34} y={180 + row * 50} width={110} height={44} fill="none" />
              )),
            )}
          </g>
          <path d="M500 450 V205 H760 V450" fill={isHi8 ? '#161712' : '#070907'} stroke={dim} strokeWidth="2" />
          <path d="M560 200 L660 95 L760 200" fill="none" stroke={dim} strokeWidth="4" />
          <path d="M560 200 L610 95 L660 200" fill="none" stroke={dim} strokeWidth="2" opacity="0.5" />
          <path d="M480 450 V245" stroke={isHi8 ? '#b5ab91' : '#d6dcd2'} strokeWidth="4" opacity="0.6" />
          <circle cx="480" cy="245" r="6" fill={isHi8 ? '#d9cfb4' : '#e0e6dc'} opacity="0.8" />
        </>
      )}
      <g fontFamily="Geist Mono Variable, monospace" fill={ink}>
        <text x="28" y="36" fontSize="13" letterSpacing="2" opacity="0.8">
          {isHi8 ? 'HI8 / NTSC / COLOUR' : 'CP-16 / 16MM / B&W'}
        </text>
        <text x="28" y="418" fontSize="11" letterSpacing="1.8" opacity="0.65">
          PROCEDURAL RECONSTRUCTION — NOT A FILM FRAME
        </text>
        <text x="640" y="36" fontSize="11" letterSpacing="1.5" opacity="0.65">
          {isHi8 ? 'TAPE A' : 'REEL'}
        </text>
      </g>
    </svg>
  );
}

export function RecordingStudy({ segments }: { segments: RecordingSegmentItem[] }) {
  const [selectedId, setSelectedId] = useState(segments[0]?.id ?? '');
  const selected = useMemo(
    () => segments.find((segment) => segment.id === selectedId) ?? segments[0],
    [segments, selectedId],
  );
  if (!selected) return null;
  const isHi8 = selected.gauge === 'hi8-ntsc-color';

  return (
    <section className="recording-study" aria-labelledby="recording-title">
      <header className="recording-study__head">
        <div>
          <p className="kicker">Procedural study · not recovered footage</p>
          <h3 id="recording-title">Two gauges, one room</h3>
          <p>
            The film alternates black-and-white 16mm with colour Hi8 tape. The frame below is an
            original diagram of each sequence—built from geometry, not film stills.
          </p>
        </div>
        <span className="recording-study__format">{isHi8 ? 'Hi8 / colour' : '16mm / black & white'}</span>
      </header>

      <div className="recording-study__body">
        <nav className="recording-list" aria-label="Recorded sequences">
          {segments.map((segment) => (
            <button
              key={segment.id}
              type="button"
              className={segment.id === selectedId ? 'is-active' : ''}
              onClick={() => setSelectedId(segment.id)}
              aria-pressed={segment.id === selectedId}
            >
              <span className="recording-list__code">{segment.reelCode}</span>
              <span className="recording-list__title">{segment.title}</span>
              <span className="recording-list__date">{segment.realShootDate}</span>
            </button>
          ))}
        </nav>

        <div className="recording-study__viewer">
          <div className={`recording-frame ${isHi8 ? 'recording-frame--hi8' : 'recording-frame--film'}`}>
            <ProceduralFrame scene={selected.proceduralScene} gauge={selected.gauge} />
            <div className="recording-frame__scan" aria-hidden />
            <div className="recording-frame__timecode">
              <span>{selected.timecodeStart}</span>
              <span>{selected.timecodeEnd}</span>
            </div>
          </div>
          <div className="recording-study__meta">
            <div>
              <p className="kicker">Production record</p>
              <p>{selected.productionNote}</p>
            </div>
            <div>
              <p className="kicker">Actual shoot</p>
              <p>{selected.realShootDate}</p>
              <p className="mono">{selected.realLocation}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="transcript">
        <div className="transcript__head">
          <p className="kicker">Reconstructed transcript</p>
          <p>{selected.fictionalDate} · in-universe timecode</p>
        </div>
        <p className="transcript__disclaimer">
          These lines are an editorial reconstruction of each scene’s beats, written for this
          essay. They are not verbatim subtitles, recovered audio, or a substitute for the film.
        </p>
        {selected.transcript.map((line) => (
          <div className="transcript__line" key={line.timecode}>
            <span className="mono">{line.timecode}</span>
            <div>
              <p className="transcript__speaker">{line.speaker}</p>
              <p>{line.line}</p>
              {line.acousticNote && <p className="transcript__note">{line.acousticNote}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

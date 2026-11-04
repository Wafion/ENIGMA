import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  CheckCircle,
  Camera,
  Sparkles,
  ZoomIn,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { useEnigma, CASE_ACTS } from '../../context/EnigmaContext';
import { ASSET_MAP } from '../../data/blairWitchAssets';
import { renderAsciiToCanvas } from '../../utils/asciiRenderer';
import { WaveformPlayer } from './WaveformPlayer';
import { InteractiveMap } from './InteractiveMap';

export const CinematicExhibitionView: React.FC = () => {
  const {
    activeActIndex,
    setActiveActIndex,
    nextAct,
    prevAct,
    audioEnabled,
    audioMuted,
    enableAudio,
    toggleAudio,
    setInspectedAsset,
    setSourceRegisterOpen,
    openSourceCitation,
  } = useEnigma();

  // =========================================================================
  // ACT 0 STATE & REFS (Prologue)
  // =========================================================================
  const heroAsset = ASSET_MAP['img-seneca-creek-woods'];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sampleRef = useRef<{ cols: number; rows: number; data: Uint8ClampedArray } | null>(null);
  const [pointerNorm, setPointerNorm] = useState<{ x: number; y: number } | null>(null);

  const drawHeroCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const sample = sampleRef.current;
    if (!canvas || !sample) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1280;
    const h = 720;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    renderAsciiToCanvas({
      ctx,
      sampleData: sample.data,
      cols: sample.cols,
      rows: sample.rows,
      canvasWidth: w,
      canvasHeight: h,
      palette: 'archive-dense',
      contrast: 1.45,
      brightness: -0.06,
      threshold: 0.08,
      invert: false,
      colorMode: 'phosphor-bone',
      emergenceProgress: 1,
      pointerNorm,
      dithering: true,
    });
  }, [pointerNorm]);

  useEffect(() => {
    if (activeActIndex !== 0 || !heroAsset) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const isMobile = window.innerWidth < 680;
      const cols = isMobile ? 84 : 140;
      const rows = Math.round(cols * 0.52);
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const offCtx = off.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(img, 0, 0, cols, rows);
        sampleRef.current = {
          cols,
          rows,
          data: offCtx.getImageData(0, 0, cols, rows).data,
        };
      }
      drawHeroCanvas();
    };
    img.src = heroAsset.localPath;
  }, [activeActIndex, heroAsset, drawHeroCanvas]);

  useEffect(() => {
    if (activeActIndex === 0) {
      drawHeroCanvas();
    }
  }, [activeActIndex, drawHeroCanvas]);

  // =========================================================================
  // ACT 1 STATE (The Legend 4-Node Chain)
  // =========================================================================
  const [selectedMythNode, setSelectedMythNode] = useState<number>(0);
  const mythNodes = [
    {
      year: '1785',
      name: 'Elly Kedward Banishment',
      location: 'Blair Township, Western MD',
      summary:
        'Accused by several children of drawing blood from their arms. Kedward was convicted of witchcraft, tied to a cart, and banished into the timber during a harsh winter. Presumed dead by exposure.',
      reality:
        'Completely fictional. No town named "Blair" ever existed in Maryland. Burkittsville was founded in 1824. No colonial records mention Elly Kedward.',
      source: 'SRC-05',
    },
    {
      year: '1825',
      name: 'Eileen Treacle Disappearance',
      location: 'Tappy East Creek',
      summary:
        'Ten-year-old girl pulled into shallow creek waters by a purported spectral white hand rising from the mud. Her body was never recovered.',
      reality:
        'Fictional waterway and incident invented for the 1999 website to establish a 60-year cyclical pathology mirroring classic American folklore.',
      source: 'SRC-04',
    },
    {
      year: '1886',
      name: 'Coffin Rock Search Party',
      location: 'Black Hills Forest',
      summary:
        'Eight-year-old Robin Weaver disappears. A search party of five town deputies is found on Coffin Rock, tied together at arms and legs, disemboweled with ritual carvings.',
      reality:
        'Staged in Seneca Creek State Park. "Coffin Rock" is an unexceptional riverside boulder 25 miles southeast of Burkittsville.',
      source: 'SRC-04',
    },
    {
      year: '1941',
      name: 'Rustin Parr Confession',
      location: 'South Mountain Hermitage',
      summary:
        'Hermit Rustin Parr abducted eight local children, bringing them into his cellar in pairs and forcing one to face the wall corner while murdering the other.',
      reality:
        'The house depicted was the abandoned 1850 Griggs House in Granite, MD, completely demolished by Maryland park authorities in late 1999.',
      source: 'SRC-06',
    },
  ];

  // =========================================================================
  // ACT 2 STATE (Burkittsville Optical/ASCII Slider)
  // =========================================================================
  const [cemeterySplit, setCemeterySplit] = useState<number>(50);

  // =========================================================================
  // ACT 3 STATE (Darkroom Contact Sheet Frame Selection)
  // =========================================================================
  const [selectedFrameId, setSelectedFrameId] = useState<string>('frame-16a');
  const contactFrames = [
    {
      id: 'frame-16a',
      frameNum: '16A',
      title: 'Arrival in Burkittsville',
      camera: 'CP-16 16mm Reversal (Tri-X 7266)',
      assetId: 'img-burkittsville-main-street',
      caption: 'Heather, Josh, and Michael filming opening street interviews on Main Street.',
      timecode: '00:04:12:18',
    },
    {
      id: 'frame-18b',
      frameNum: '18B',
      title: 'Base Camp at Seneca Creek',
      camera: 'Sony Hi8 XR Handycam (Color NTSC)',
      assetId: 'img-seneca-creek-lake',
      caption: 'The student crew pitching their nylon dome tent before entering the deeper forest canopy.',
      timecode: '00:19:44:02',
    },
    {
      id: 'frame-22c',
      frameNum: '22C',
      title: 'Stick Effigies ("Twana")',
      camera: 'CP-16 16mm Reversal (Tri-X 7266)',
      assetId: 'img-seneca-creek-canopy',
      caption: 'Discovery of five ritual stick figures suspended from overhead oak branches directly above camp.',
      timecode: '00:48:30:11',
    },
    {
      id: 'frame-29d',
      frameNum: '29D',
      title: 'The Abandoned House Ruins',
      camera: 'Sony Hi8 XR Handycam (Color NTSC)',
      assetId: 'img-patapsco-rock-trail',
      caption: 'Final sequence approach to the decaying two-story residence in the darkness.',
      timecode: '01:14:02:29',
    },
  ];
  const activeContactFrame = contactFrames.find((f) => f.id === selectedFrameId) || contactFrames[0];

  // =========================================================================
  // ACT 5 STATE (Audio Waveform Deck Sequence Selection)
  // =========================================================================
  const [selectedAudioSeqIndex, setSelectedAudioSeqIndex] = useState<number>(0);
  const audioSequences = [
    {
      id: 'seq-1',
      title: 'Night 1: Snapping Branches',
      timecode: '00:27:14:02',
      audioSrc: '/assets/blair-witch/audio/branch-snap-woods.wav',
      transcript:
        'HEATHER: "Did you hear that?" / JOSH: "It was just a deer." / HEATHER: "Deer don’t snap three-inch branches in rhythm."',
      verdict: 'Actors were deprived of sleep; directors shook trees and snapped limbs from darkness.',
    },
    {
      id: 'seq-2',
      title: 'Night 2: Infant Cries in the Brush',
      timecode: '00:41:09:18',
      audioSrc: '/assets/blair-witch/audio/nocturnal-insects.wav',
      transcript:
        'MICHAEL: "What the hell is that?" / (Distant high-frequency crying echoed through timber canopy) / JOSH: "It’s outside the rainfly."',
      verdict: 'Directors played pre-recorded infant sounds through a boombox hidden in the underbrush 100 yards away.',
    },
    {
      id: 'seq-3',
      title: 'Night 3: Ritual Effigy Discovery',
      timecode: '00:54:22:07',
      audioSrc: '/assets/blair-witch/audio/footsteps-dry-leaves.wav',
      transcript:
        'HEATHER: "They weren’t here last night. They were tied with strips of my flannel shirt." / MICHAEL: "We need to turn back right now."',
      verdict: 'Crew prepared stick bundles off-site and hung them while actors slept under GPS surveillance.',
    },
    {
      id: 'seq-4',
      title: 'Night 4: Josh Disappears',
      timecode: '01:06:50:24',
      audioSrc: '/assets/blair-witch/audio/forest-wind-canopy.wav',
      transcript:
        'HEATHER: "Josh! Where are you? Josh!" / (Sound of howling wind through bare branches) / MICHAEL: "His pack is gone. All of his boots are gone."',
      verdict: 'Joshua Leonard was quietly extracted by the directors to simulate sudden abandonment for the remaining two actors.',
    },
    {
      id: 'seq-5',
      title: 'Night 5: The Basement Corner',
      timecode: '01:18:33:12',
      audioSrc: '/assets/blair-witch/audio/radio-tape-interference.wav',
      transcript:
        'HEATHER: "Mike! Mike! Turn around! Look at me!" / (Camera crashes to dirt floor, frame spins, Mike stands facing corner wall) / (Silence)',
      verdict: 'Climax filmed at the abandoned Griggs House in Granite, MD. Camera dropped by Heather Donahue as planned in private direction note.',
    },
  ];
  const activeAudioSeq = audioSequences[selectedAudioSeqIndex];

  // =========================================================================
  // ACT 7 STATE (Fact/Fiction Filter)
  // =========================================================================
  const [factFilter, setFactFilter] = useState<string>('all');
  const factRows = [
    {
      topic: 'Elly Kedward & 1785 Witchcraft Trial',
      myth: 'Convicted of witchcraft and banished into winter woods; accusers vanished the following year.',
      fact: 'Completely fabricated by Haxan Films. No such person or trial exists in any Maryland colonial record.',
      status: 'FICTIONAL',
    },
    {
      topic: 'Township of Blair',
      myth: 'Colonial town established in 1785, abandoned after mass child disappearances, re-established as Burkittsville in 1824.',
      fact: 'Burkittsville was founded in 1824 by Henry Burkitt; it was never previously called "Blair".',
      status: 'FICTIONAL',
    },
    {
      topic: 'The 1994 Student Disappearance',
      myth: 'Heather Donahue, Joshua Leonard, and Michael Williams went missing in October 1994 while shooting a documentary.',
      fact: 'The three actors are living professionals. The disappearance was a marketing invention staged in October 1997.',
      status: 'FICTIONAL',
    },
    {
      topic: 'Seneca Creek State Park & Patapsco Valley',
      myth: 'All events occurred within the cursed Black Hills wilderness surrounding Burkittsville.',
      fact: '80% of the film was shot in Seneca Creek State Park in Gaithersburg, MD, with additional scenes in Patapsco Valley.',
      status: 'REAL PRODUCTION',
    },
    {
      topic: 'The 1998–1999 Dial-Up Website',
      myth: 'A genuine declassified police database documenting the ongoing search for the missing students.',
      fact: 'Constructed by Haxan Films for under $15,000, creating the modern prototype for viral transmedia storytelling.',
      status: 'REAL PHENOMENON',
    },
  ];
  const filteredFactRows =
    factFilter === 'all'
      ? factRows
      : factRows.filter((r) => (factFilter === 'myth' ? r.status === 'FICTIONAL' : r.status === 'REAL PRODUCTION' || r.status === 'REAL PHENOMENON'));

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] flex flex-col justify-between bg-[#050605] text-[#dcd6c8] overflow-hidden select-none">
      {/* =====================================================================
          MAIN EXHIBITION STAGE (Acts 0 to 7)
      ====================================================================== */}
      <div className="relative flex-1 w-full overflow-y-auto lg:overflow-hidden p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {/* ===================================================================
            ACT 0: PROLOGUE — THE FOREST VOID & 39 WORDS
        ==================================================================== */}
        {activeActIndex === 0 && (
          <div className="relative w-full max-w-6xl h-full flex flex-col justify-between py-2 sm:py-6">
            {/* ASCII Woodland Canvas Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover filter contrast-125"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPointerNorm({
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height,
                  });
                }}
              />
            </div>

            {/* Top Telemetry Stamp */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#1f271d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c89446] animate-pulse" />
                <span className="font-bold text-[#ece6d9] tracking-widest uppercase">
                  CASE 001 // PROLOGUE
                </span>
                <span className="text-[#686255] hidden sm:inline">|</span>
                <span className="text-[#888376] hidden sm:inline">
                  39.3905° N, 77.6242° W · SENECA CREEK STATE PARK
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-[10px] font-mono-tech border border-[#c89446]/40 text-[#c89446] bg-[#c89446]/10 uppercase">
                  DUAL-LAYER PROTOCOL
                </span>
              </div>
            </div>

            {/* Monumental Center Spread */}
            <div className="relative z-10 my-auto max-w-4xl space-y-6">
              {/* Thirty-Nine Words Card */}
              <div className="border-l-2 border-[#c89446] pl-5 sm:pl-8 py-2 bg-black/40 backdrop-blur-sm">
                <div className="text-[10px] font-mono-tech tracking-[0.25em] text-[#c89446] uppercase mb-2">
                  HAXAN FILMS · THIRTY-NINE WORDS THAT REDEFINED CINEMA (1999)
                </div>
                <blockquote className="font-body text-xl sm:text-3xl text-[#f2ede4] italic leading-relaxed">
                  "In October of 1994, three student filmmakers disappeared in the woods near
                  Burkittsville, Maryland while shooting a documentary. A year later their footage was
                  found."
                </blockquote>
              </div>

              {/* Massive Instrument Serif Title */}
              <div className="pt-2">
                <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-[#f2ede4] font-normal tracking-wide leading-none">
                  THE BLAIR WITCH <span className="italic text-[#c89446]">Incident</span>
                </h1>
                <p className="mt-3 text-base sm:text-xl font-body text-[#c8c2b4] max-w-2xl leading-relaxed">
                  Anatomy of a Modern Digital Mythology: Separating two centuries of fabricated
                  folklore from the verified 1997 guerrilla film production.
                </p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="relative z-10 pt-4 border-t border-[#1f271d] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  if (!audioEnabled) enableAudio('prologue', 'aud-forest-wind');
                  else toggleAudio();
                }}
                className={`inline-flex items-center gap-2.5 px-4 py-2 text-xs font-mono-tech border transition cursor-pointer ${
                  audioEnabled && !audioMuted
                    ? 'bg-[#1a261a] border-[#436e4f] text-[#a8e0b8]'
                    : 'bg-[#121612] border-[#293226] text-[#c89446] hover:bg-[#1a2018]'
                }`}
              >
                {audioEnabled && !audioMuted ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#a8e0b8]" />
                    <span>55Hz WOODLAND AMBIENCE ACTIVE</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-[#c89446]" />
                    <span>ENGAGE ACOUSTIC SOUNDSCAPE</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => nextAct()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c89446] text-[#050605] font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-[#e6b464] transition cursor-pointer shadow-lg"
              >
                <span>Enter Act I: The Legend</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ACT 1: THE LEGEND OF THE BLACK HILLS (1785–1941)
        ==================================================================== */}
        {activeActIndex === 1 && (
          <div className="w-full max-w-6xl h-full flex flex-col justify-between py-2">
            {/* Act Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#2b211a]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#b83a2e] px-2 py-0.5 bg-[#171210] border border-[#3b2420]">
                  ACT 01 // CH.01
                </span>
                <span className="font-display text-lg text-[#ece6d9]">The Legend of the Black Hills</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#8f241b]/20 border border-[#b83a2e]/50 text-[#f5a89f] text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#e06d60]" />
                  LAYER A // IN-UNIVERSE MYTHOLOGY
                </span>
              </div>
            </div>

            {/* Main Interactive Dossier Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch">
              {/* Left Column: Reconstructed 1809 Chapbook Folio */}
              <div className="lg:col-span-5 bg-[#0e0c0b] border border-[#2b211a] p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#211915] text-[10px] font-mono-tech text-[#8a766a] uppercase">
                    <span>PROP EXHIBIT // MD-HIST-1809</span>
                    <span className="text-[#b83a2e]">RECONSTRUCTED ARTIFACT</span>
                  </div>

                  <div
                    onClick={() => {
                      const asset = ASSET_MAP['doc-blair-witch-cult-1809'];
                      if (asset) setInspectedAsset(asset);
                    }}
                    className="relative aspect-[4/3] bg-black border border-[#2e201a] overflow-hidden cursor-pointer group flex items-center justify-center p-4"
                  >
                    <img
                      src="/assets/blair-witch/documents/blair-witch-cult-1809-reconstruction.svg"
                      alt="The Blair Witch Cult 1809"
                      className="max-h-full max-w-full object-contain filter contrast-125 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono-tech text-[#f2ede4]">
                      <ZoomIn className="w-4 h-4 text-[#c89446]" />
                      Examine Reconstructed Folio
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs font-mono-tech text-[#c2bcb0]">
                    <div className="text-[#e06d60] font-bold">"The Blair Witch Cult" (1809 Chapbook)</div>
                    <p className="font-body text-sm text-[#beb8aa] leading-relaxed">
                      Authored by Haxan Films prop designers in 1998 using antiquarian typography and
                      hand-distressed woodblock cuts to simulate an early 19th-century religious tract.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#211915] flex items-center justify-between text-xs font-mono-tech text-[#8a766a]">
                  <span>CATALOG: MD-FOLK-001</span>
                  <button
                    type="button"
                    onClick={() => openSourceCitation('SRC-05')}
                    className="text-[#c89446] hover:underline cursor-pointer"
                  >
                    View Citation [SRC-05] →
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive 4-Node Chronology Chain */}
              <div className="lg:col-span-7 bg-[#0b0a09] border border-[#2b211a] p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#211915] text-[10px] font-mono-tech text-[#8a766a] uppercase">
                    <span>THE 200-YEAR STRATIGRAPHIC FOLKLORE CYCLE</span>
                    <span>CLICK NODE TO AUDIT</span>
                  </div>

                  {/* Node Selector Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {mythNodes.map((n, idx) => (
                      <button
                        key={n.year}
                        type="button"
                        onClick={() => setSelectedMythNode(idx)}
                        className={`p-2.5 text-left border transition cursor-pointer font-mono-tech ${
                          selectedMythNode === idx
                            ? 'bg-[#211412] border-[#b83a2e] text-[#f5a89f]'
                            : 'bg-[#0f0d0b] border-[#241a16] text-[#8a766a] hover:bg-[#161210]'
                        }`}
                      >
                        <div className="text-xs font-bold">{n.year}</div>
                        <div className="text-[10px] truncate">{n.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Node Detail Card */}
                  <div className="p-4 bg-[#140e0c] border border-[#3b2420] space-y-3">
                    <div className="flex flex-wrap items-center justify-between text-xs font-mono-tech gap-2">
                      <span className="font-bold text-[#f5a89f] text-sm">
                        {mythNodes[selectedMythNode].year} · {mythNodes[selectedMythNode].name}
                      </span>
                      <span className="text-[#8a766a]">
                        LOC: {mythNodes[selectedMythNode].location}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono-tech text-[#e06d60] uppercase tracking-wider font-bold">
                        IN-UNIVERSE CLAIM (LAYER A):
                      </div>
                      <p className="font-body text-sm text-[#ded3d0] leading-relaxed">
                        {mythNodes[selectedMythNode].summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#2e1c18] space-y-1.5">
                      <div className="text-[10px] font-mono-tech text-[#60c07d] uppercase tracking-wider font-bold">
                        HISTORICAL &amp; PRODUCTION REALITY (LAYER B):
                      </div>
                      <p className="font-body text-sm text-[#c0d4c7] leading-relaxed">
                        {mythNodes[selectedMythNode].reality}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono-tech text-[#8a766a]">
                  <span>EPISTEMIC AUDIT: 100% FABRICATED BY HAXAN FILMS (1998)</span>
                  <button
                    type="button"
                    onClick={() => openSourceCitation(mythNodes[selectedMythNode].source)}
                    className="text-[#c89446] hover:underline cursor-pointer"
                  >
                    Examine [{mythNodes[selectedMythNode].source}] →
                  </button>
                </div>
              </div>
            </div>

            {/* Act Bottom Nav */}
            <div className="pt-3 border-t border-[#2b211a] flex items-center justify-between text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => prevAct()}
                className="inline-flex items-center gap-1.5 text-[#8a766a] hover:text-[#dcd6c8] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Prologue</span>
              </button>
              <button
                type="button"
                onClick={() => nextAct()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#b83a2e] text-[#f7f2e8] font-bold hover:bg-[#d4483a] transition cursor-pointer"
              >
                <span>Proceed to Act II: Burkittsville</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ACT 2: THE TOWN BELOW SOUTH MOUNTAIN (Burkittsville 1858–1994)
        ==================================================================== */}
        {activeActIndex === 2 && (
          <div className="w-full max-w-6xl h-full flex flex-col justify-between py-2">
            {/* Act Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#1b2b20]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#436e4f] px-2 py-0.5 bg-[#0f1712] border border-[#243d2b]">
                  ACT 02 // CH.02
                </span>
                <span className="font-display text-lg text-[#ece6d9]">
                  The Town Below South Mountain
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#293d2e]/20 border border-[#436e4f]/50 text-[#a8e0b8] text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#60c07d]" />
                  LAYER B // VERIFIED HISTORICAL GEOGRAPHY
                </span>
              </div>
            </div>

            {/* Split Stage: 1858 Map vs Cemetery Optical/ASCII Comparator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch">
              {/* Left Column: Isaac Bond 1858 Instrumental Survey */}
              <div className="lg:col-span-6 bg-[#080d09] border border-[#1d2d22] p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#18261c] text-[10px] font-mono-tech text-[#6c8a74] uppercase">
                    <span>LIBRARY OF CONGRESS // CONTROL NO. 2002624018</span>
                    <span className="text-[#436e4f]">ISAAC BOND SURVEY (1858)</span>
                  </div>

                  <div
                    onClick={() => {
                      const asset = ASSET_MAP['img-loc-frederick-1858'];
                      if (asset) setInspectedAsset(asset);
                    }}
                    className="relative aspect-video bg-black border border-[#213527] overflow-hidden cursor-pointer group"
                  >
                    <img
                      src="/assets/blair-witch/images/frederick-map-1858.jpg"
                      alt="1858 Map of Frederick County"
                      className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono-tech text-[#f2ede4]">
                      <ZoomIn className="w-4 h-4 text-[#c89446]" />
                      Examine 1858 Geodetic Survey
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs font-mono-tech text-[#c2bcb0]">
                    <div className="text-[#a8e0b8] font-bold">
                      Historical Reality: Burkittsville, Maryland (1824)
                    </div>
                    <p className="font-body text-sm text-[#b6c7bc] leading-relaxed">
                      Founded in 1824 along the South Mountain corridor by Henry Burkitt. The town was
                      heavily impacted by the 1862 Civil War Battle of South Mountain (Crampton’s Gap).
                      Zero historical documents mention witchcraft or banishments.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#18261c] flex items-center justify-between text-xs font-mono-tech text-[#6c8a74]">
                  <span>GEOGRAPHIC DATUM: NAD83 · 39.3918° N</span>
                  <button
                    type="button"
                    onClick={() => openSourceCitation('SRC-01')}
                    className="text-[#c89446] hover:underline cursor-pointer"
                  >
                    Library of Congress Record [SRC-01] →
                  </button>
                </div>
              </div>

              {/* Right Column: Burkittsville Cemetery Optical/ASCII Slider */}
              <div className="lg:col-span-6 bg-[#080d09] border border-[#1d2d22] p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#18261c] text-[10px] font-mono-tech text-[#6c8a74] uppercase">
                    <span>FILMING LOCATION 01 // BURKITTSVILLE CEMETERY</span>
                    <span className="text-[#c89446]">OPTICAL / ASCII REVELATION</span>
                  </div>

                  {/* Split Visual Container */}
                  <div className="relative aspect-video bg-black border border-[#213527] overflow-hidden">
                    <img
                      src="/assets/blair-witch/images/burkittsville-cemetery.jpg"
                      alt="Burkittsville Union Cemetery"
                      className="w-full h-full object-cover filter contrast-115"
                      style={{ clipPath: `inset(0 ${100 - cemeterySplit}% 0 0)` }}
                    />
                    <div
                      className="absolute inset-0 bg-[#060806] flex items-center justify-center p-4 font-mono-tech text-[10px] text-[#60c07d] overflow-hidden pointer-events-none"
                      style={{ clipPath: `inset(0 0 0 ${cemeterySplit}%)` }}
                    >
                      <div className="leading-tight opacity-75">
                        {`:::::::::::::::::::::::::::::::::::::::::::
::++====+**###%%%%@@@@@@@@@@@@@@@@@@@@@#*=:
::+*###%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
::+*###%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
::+*###%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
::+*###%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
::+*###%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`}
                      </div>
                    </div>

                    {/* Divider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#c89446] pointer-events-none shadow-[0_0_8px_#c89446]"
                      style={{ left: `${cemeterySplit}%` }}
                    />
                  </div>

                  {/* Scrubber Range Slider */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-mono-tech text-[#8a8477] mb-1">
                      <span>OPTICAL PHOTOGRAPHY ({cemeterySplit}%)</span>
                      <span>ASCII MATRIX ({100 - cemeterySplit}%)</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={cemeterySplit}
                      onChange={(e) => setCemeterySplit(Number(e.target.value))}
                      className="w-full accent-[#c89446] cursor-pointer"
                    />
                  </div>

                  <p className="mt-3 font-body text-sm text-[#b6c7bc] leading-relaxed">
                    Heather Donahue delivered the opening monologue among these 1840s gravestones on
                    October 24, 1997. Tourists in 1999 repeatedly stole cemetery gateposts and headstones.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#18261c] flex items-center justify-between text-xs font-mono-tech text-[#6c8a74]">
                  <span>CC BY-SA 4.0 · ACROTERION (2013)</span>
                  <button
                    type="button"
                    onClick={() => openSourceCitation('SRC-08')}
                    className="text-[#c89446] hover:underline cursor-pointer"
                  >
                    View Citation [SRC-08] →
                  </button>
                </div>
              </div>
            </div>

            {/* Act Bottom Nav */}
            <div className="pt-3 border-t border-[#1b2b20] flex items-center justify-between text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => prevAct()}
                className="inline-flex items-center gap-1.5 text-[#6c8a74] hover:text-[#dcd6c8] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Act I: The Legend</span>
              </button>
              <button
                type="button"
                onClick={() => nextAct()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#436e4f] text-[#f2ede4] font-bold hover:bg-[#538761] transition cursor-pointer"
              >
                <span>Proceed to Act III: Expedition</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ACT 3: THE OCTOBER EXPEDITION (16mm Contact Sheet Light Table)
        ==================================================================== */}
        {activeActIndex === 3 && (
          <div className="w-full max-w-6xl h-full flex flex-col justify-between py-2">
            {/* Act Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#2b2218]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#c89446] px-2 py-0.5 bg-[#17130e] border border-[#3b2d1c]">
                  ACT 03 // CH.03
                </span>
                <span className="font-display text-lg text-[#ece6d9]">The October Expedition</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#8f241b]/20 border border-[#b83a2e]/50 text-[#f5a89f] text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#e06d60]" />
                  LAYER A // IN-UNIVERSE EXPEDITION CHRONICLE
                </span>
              </div>
            </div>

            {/* 16mm Darkroom Light Table Interface */}
            <div className="bg-[#0b0907] border border-[#261f18] p-5 shadow-2xl my-auto space-y-4">
              {/* Light Table Header */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono-tech pb-2 border-b border-[#1f1913] gap-2">
                <div className="flex items-center gap-2 text-[#9a8d7d]">
                  <Camera className="w-4 h-4 text-[#c89446]" />
                  <span className="font-bold text-[#ece6d9]">DARKROOM LIGHT TABLE // PROOF ROLL #7266</span>
                </div>
                <div className="text-[10px] text-[#c89446] uppercase tracking-wider">
                  CP-16R 16MM REVERSAL + SONY CCD-TRV65 HI8
                </div>
              </div>

              {/* Film Sprocket Frame Selector Strip */}
              <div className="bg-[#050403] p-3 border border-[#1a140f] overflow-x-auto">
                <div className="flex items-center gap-4 min-w-[600px]">
                  {contactFrames.map((f) => {
                    const isSelected = f.id === selectedFrameId;
                    const frameAsset = ASSET_MAP[f.assetId];

                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFrameId(f.id)}
                        className={`group relative p-2 border transition cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#18130d] border-[#c89446] shadow-[0_0_12px_rgba(200,148,70,0.4)]'
                            : 'bg-[#0d0a07] border-[#221a13] hover:border-[#382b1f]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[8px] font-mono-tech text-[#8a7a6a] mb-1">
                          <span>KODAK TRI-X</span>
                          <span className={isSelected ? 'text-[#c89446] font-bold' : ''}>
                            ▶ {f.frameNum}
                          </span>
                        </div>

                        <div className="w-36 h-24 bg-black overflow-hidden border border-black relative">
                          {frameAsset && (
                            <img
                              src={frameAsset.localPath}
                              alt={f.title}
                              className="w-full h-full object-cover grayscale contrast-125"
                            />
                          )}
                          {isSelected && (
                            <div className="absolute inset-1 border border-[#d46535] pointer-events-none" />
                          )}
                        </div>

                        <div className="mt-1 text-[9px] font-mono-tech text-[#dcd6c8] truncate max-w-[144px]">
                          {f.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Frame Master Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
                <div className="lg:col-span-7 bg-black p-3 border border-[#211a13] flex items-center justify-center relative">
                  {ASSET_MAP[activeContactFrame.assetId] && (
                    <img
                      src={ASSET_MAP[activeContactFrame.assetId]?.localPath}
                      alt={activeContactFrame.title}
                      className="max-h-60 w-auto object-contain grayscale contrast-125"
                    />
                  )}
                  <div className="absolute top-2 left-2 text-[9px] font-mono-tech bg-black/85 text-[#c89446] px-1.5 py-0.5 border border-white/10">
                    TIMECODE: {activeContactFrame.timecode}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3 font-mono-tech text-xs">
                  <div>
                    <span className="text-[10px] text-[#8a7a6a] uppercase">FRAME GAUGE RECORD:</span>
                    <div className="font-display text-xl text-[#ece6d9] mt-0.5">
                      {activeContactFrame.title}
                    </div>
                    <div className="text-[#c89446] text-[11px] mt-0.5">{activeContactFrame.camera}</div>
                  </div>

                  <p className="font-body text-sm text-[#cac4b6] leading-relaxed">
                    {activeContactFrame.caption}
                  </p>

                  <div className="pt-2 border-t border-[#1f1913] flex items-center justify-between text-[#8a7a6a]">
                    <span>STATUS: IN-UNIVERSE DISPATCH</span>
                    <button
                      type="button"
                      onClick={() => {
                        const a = ASSET_MAP[activeContactFrame.assetId];
                        if (a) setInspectedAsset(a);
                      }}
                      className="text-[#c89446] hover:underline cursor-pointer"
                    >
                      Inspect Negative →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Act Bottom Nav */}
            <div className="pt-3 border-t border-[#2b2218] flex items-center justify-between text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => prevAct()}
                className="inline-flex items-center gap-1.5 text-[#8a7a6a] hover:text-[#dcd6c8] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Act II: Burkittsville</span>
              </button>
              <button
                type="button"
                onClick={() => nextAct()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#c89446] text-[#050605] font-bold hover:bg-[#e6b464] transition cursor-pointer"
              >
                <span>Proceed to Act IV: Seneca Creek</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ACT 4: THE LABYRINTH IN THE TIMBER (Seneca Creek Spatial Map)
        ==================================================================== */}
        {activeActIndex === 4 && (
          <div className="w-full max-w-6xl h-full flex flex-col justify-between py-2">
            {/* Act Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#1b2b1d]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#5e8250] px-2 py-0.5 bg-[#0f1710] border border-[#243d26]">
                  ACT 04 // CH.04
                </span>
                <span className="font-display text-lg text-[#ece6d9]">The Labyrinth in the Timber</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#293d2e]/20 border border-[#436e4f]/50 text-[#a8e0b8] text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#60c07d]" />
                  LAYER B // SENECA CREEK SPATIAL CARTOGRAPHY
                </span>
              </div>
            </div>

            {/* Interactive Topological Map Embed */}
            <div className="my-auto">
              <InteractiveMap
                title="Seneca Creek & Patapsco Field Cartography"
                subtitle="Drag to pan, zoom with mousewheel. Compare fictional lore locations with verified 1997 Maryland production sectors."
                baseMapAssetId="img-loc-frederick-1858"
                secondaryMapAssetId="img-loc-frederick-1861"
                markers={[
                  {
                    id: 'm1',
                    code: 'LOC-01',
                    label: 'Burkittsville Cemetery',
                    realLocationName: 'Burkittsville Union Cemetery, MD',
                    fictionalLocationName: 'Burkittsville Cemetery',
                    xPercent: 32,
                    yPercent: 44,
                    coordinates: '39.3905° N, 77.6242° W',
                    layer: 'both',
                    description: 'Opening graveyard interviews filmed October 24, 1997.',
                  },
                  {
                    id: 'm2',
                    code: 'LOC-02',
                    label: 'Black Rock Mill (Ruins)',
                    realLocationName: 'Black Rock Mill, Seneca Creek State Park',
                    fictionalLocationName: 'The Old Grist Mill',
                    xPercent: 58,
                    yPercent: 62,
                    coordinates: '39.1417° N, 77.2942° W',
                    layer: 'real-production',
                    description: 'Historic 1815 mill ruins in Seneca Creek State Park.',
                  },
                  {
                    id: 'm3',
                    code: 'LOC-03',
                    label: 'Coffin Rock Staging Area',
                    realLocationName: 'Seneca Creek State Park River Trail',
                    fictionalLocationName: 'Coffin Rock (Black Hills Forest)',
                    xPercent: 66,
                    yPercent: 52,
                    coordinates: '39.1482° N, 77.3015° W',
                    layer: 'fictional-lore',
                    description: 'Staged on Seneca Creek trail, 25 miles from Burkittsville.',
                  },
                  {
                    id: 'm4',
                    code: 'LOC-04',
                    label: 'Griggs House (Basement Climax)',
                    realLocationName: 'Historic Griggs House, Granite, MD (Demolished 1999)',
                    fictionalLocationName: 'Rustin Parr House',
                    xPercent: 82,
                    yPercent: 35,
                    coordinates: '39.3621° N, 76.8745° W',
                    layer: 'both',
                    description: 'Historic 1850 structure in Granite, MD (demolished 1999).',
                  },
                ]}
              />
            </div>

            {/* Act Bottom Nav */}
            <div className="pt-3 border-t border-[#1b2b1d] flex items-center justify-between text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => prevAct()}
                className="inline-flex items-center gap-1.5 text-[#6c8a74] hover:text-[#dcd6c8] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Act III: Expedition</span>
              </button>
              <button
                type="button"
                onClick={() => nextAct()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#5e8250] text-[#f2ede4] font-bold hover:bg-[#729e62] transition cursor-pointer"
              >
                <span>Proceed to Act V: Tape Deck</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ACT 5: CELLULOID & HI8 MAGNETIC TAPE (WaveSurfer Audio Console)
        ==================================================================== */}
        {activeActIndex === 5 && (
          <div className="w-full max-w-6xl h-full flex flex-col justify-between py-2">
            {/* Act Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#1f2833]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#4a7a9e] px-2 py-0.5 bg-[#0f151c] border border-[#233547]">
                  ACT 05 // CH.05
                </span>
                <span className="font-display text-lg text-[#ece6d9]">
                  Celluloid and Hi8 Magnetic Tape
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#293d4f]/20 border border-[#4a7a9e]/50 text-[#bad8f0] text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#60a0c0]" />
                  LAYER B // FORENSIC REEL &amp; TIME-CODE SYNCHRONIZATION
                </span>
              </div>
            </div>

            {/* Master Forensic Deck: WaveSurfer Player + Multi-Reel Selector */}
            <div className="bg-[#080b0f] border border-[#1d2733] p-5 shadow-2xl my-auto space-y-4">
              {/* Top Reel Selector Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#18202b] text-xs font-mono-tech">
                <div className="flex items-center gap-2 text-[#7a9bb5]">
                  <Radio className="w-4 h-4 text-[#4a7a9e]" />
                  <span className="font-bold text-[#ece6d9]">NTSC 29.97 FPS // AUDIO/VIDEO SYNC DECK</span>
                </div>
                <div className="text-[10px] text-[#7a9bb5]">
                  ACTIVE SEQUENCE: {activeAudioSeq.title} [{activeAudioSeq.timecode}]
                </div>
              </div>

              {/* Sequence Reel Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {audioSequences.map((seq, idx) => (
                  <button
                    key={seq.id}
                    type="button"
                    onClick={() => setSelectedAudioSeqIndex(idx)}
                    className={`p-2 text-left border transition cursor-pointer font-mono-tech ${
                      selectedAudioSeqIndex === idx
                        ? 'bg-[#121c29] border-[#4a7a9e] text-[#bad8f0]'
                        : 'bg-[#0b0e14] border-[#1a232e] text-[#6d7e8f] hover:bg-[#0f141c]'
                    }`}
                  >
                    <div className="text-[10px] font-bold">REEL 0{idx + 1}</div>
                    <div className="text-[10px] truncate">{seq.title.split(':')[0]}</div>
                  </button>
                ))}
              </div>

              {/* Integrated WaveSurfer.js Player */}
              <div className="bg-[#05070a] p-4 border border-[#151e29]">
                <WaveformPlayer
                  audioUrl={activeAudioSeq.audioSrc}
                  reelLabel={activeAudioSeq.title}
                  gaugeLabel={activeAudioSeq.timecode}
                  waveColor="#2b3d52"
                  progressColor="#4a7a9e"
                />
              </div>

              {/* Synchronized Verbatim Transcript & Direction Verdict */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs font-mono-tech">
                <div className="lg:col-span-7 bg-[#05070a] p-3 border border-[#151e29] space-y-1.5">
                  <div className="text-[10px] text-[#7a9bb5] uppercase tracking-wider font-bold">
                    VERBATIM AUDIO TRANSCRIPT EXCERPT:
                  </div>
                  <p className="font-body text-sm text-[#d4dbe0] leading-relaxed">
                    {activeAudioSeq.transcript}
                  </p>
                </div>

                <div className="lg:col-span-5 bg-[#05070a] p-3 border border-[#151e29] space-y-1.5">
                  <div className="text-[10px] text-[#60c07d] uppercase tracking-wider font-bold">
                    DIRECTORIAL METHODOLOGY (VERIFIED):
                  </div>
                  <p className="font-body text-sm text-[#b2c7bc] leading-relaxed">
                    {activeAudioSeq.verdict}
                  </p>
                </div>
              </div>
            </div>

            {/* Act Bottom Nav */}
            <div className="pt-3 border-t border-[#1f2833] flex items-center justify-between text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => prevAct()}
                className="inline-flex items-center gap-1.5 text-[#7a9bb5] hover:text-[#dcd6c8] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Act IV: Seneca Creek</span>
              </button>
              <button
                type="button"
                onClick={() => nextAct()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#4a7a9e] text-[#f2ede4] font-bold hover:bg-[#5b95c0] transition cursor-pointer"
              >
                <span>Proceed to Act VI: 1999 Web Mirage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ACT 6: THE 1998–1999 DIAL-UP MIRAGE (Web 1.0 Retro Console)
        ==================================================================== */}
        {activeActIndex === 6 && (
          <div className="w-full max-w-6xl h-full flex flex-col justify-between py-2">
            {/* Act Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#2b2419]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#c89446] px-2 py-0.5 bg-[#17130e] border border-[#3b2d1c]">
                  ACT 06 // CH.06
                </span>
                <span className="font-display text-lg text-[#ece6d9]">The 1998–1999 Dial-Up Mirage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#293d2e]/20 border border-[#436e4f]/50 text-[#a8e0b8] text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#60c07d]" />
                  LAYER B // DIGITAL MARKETING &amp; SUNDANCE PHENOMENON
                </span>
              </div>
            </div>

            {/* Retro Web 1.0 Terminal & Sundance Ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch">
              {/* Left Column: Authentic Netscape 4 Recreation */}
              <div className="lg:col-span-6 bg-[#0a0907] border border-[#2b2419] p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#211a12] text-[10px] font-mono-tech text-[#8a7a6a] uppercase">
                    <span>NETSCAPE COMMUNICATOR 4.08 // ARCHIVE 1998</span>
                    <span className="text-[#c89446]">WWW.BLAIRWITCH.COM</span>
                  </div>

                  <div className="p-4 bg-[#050403] border border-[#211a12] font-mono-tech text-xs space-y-3">
                    <div className="text-[#c89446] font-bold text-sm">
                      CASE #94-1029: BLAIR WITCH MISSING PERSONS REPOSITORY
                    </div>
                    <div className="text-[11px] text-[#8a7a6a] border-b border-[#1a140f] pb-2">
                      HOST: APACHE/1.3.1 · DIAL-UP BITRATE: 28.8 KBPS · SERVER: ORLANDO, FL
                    </div>
                    <p className="font-body text-sm text-[#cac4b6] leading-relaxed">
                      "On October 21, 1994, Montgomery College students Heather Donahue, Joshua Leonard,
                      and Michael Williams entered the Black Hills woods to record folklore regarding the
                      Blair Witch. They were never seen again. Their equipment was unearthed one year
                      later under the foundation of a 100-year-old cabin."
                    </p>
                    <div className="p-2 bg-[#120f0a] border border-[#292014] text-[10px] text-[#a89580]">
                      NOTE: Over 75 million visitors accessed this page between January and August 1999,
                      believing the investigation was an active federal missing persons case.
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#211a12] flex items-center justify-between text-xs font-mono-tech text-[#8a7a6a]">
                  <span>CAMPAIGN BUDGET: $15,000</span>
                  <button
                    type="button"
                    onClick={() => openSourceCitation('SRC-10')}
                    className="text-[#c89446] hover:underline cursor-pointer"
                  >
                    View Wired Archive [SRC-10] →
                  </button>
                </div>
              </div>

              {/* Right Column: Sundance Premiere & Box Office Metrics */}
              <div className="lg:col-span-6 bg-[#0a0907] border border-[#2b2419] p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#211a12] text-[10px] font-mono-tech text-[#8a7a6a] uppercase">
                    <span>PRODUCTION RECORD // SUNDANCE 1999</span>
                    <span className="text-[#60c07d]">COMMERCIAL MILESTONES</span>
                  </div>

                  <div className="space-y-3 text-xs font-mono-tech">
                    <div className="p-3 bg-[#120f0a] border border-[#292014] flex items-center justify-between">
                      <span className="text-[#8a7a6a]">INITIAL PRODUCTION BUDGET:</span>
                      <span className="font-bold text-[#f2ede4] text-sm">$35,000 (16mm + Hi8)</span>
                    </div>

                    <div className="p-3 bg-[#120f0a] border border-[#292014] flex items-center justify-between">
                      <span className="text-[#8a7a6a]">SUNDANCE ACQUISITION (ARTISAN):</span>
                      <span className="font-bold text-[#c89446] text-sm">$1,100,000 (Jan 1999)</span>
                    </div>

                    <div className="p-3 bg-[#120f0a] border border-[#292014] flex items-center justify-between">
                      <span className="text-[#8a7a6a]">WORLDWIDE BOX OFFICE:</span>
                      <span className="font-bold text-[#60c07d] text-sm">$248,639,099</span>
                    </div>

                    <p className="font-body text-sm text-[#cac4b6] leading-relaxed pt-2">
                      The Blair Witch Project stands as the most profitable independent film in motion
                      picture history relative to its production budget, demonstrating that manufactured
                      documentary authenticity is the most potent narrative currency in digital culture.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#211a12] flex items-center justify-between text-xs font-mono-tech text-[#8a7a6a]">
                  <span>ROI RATIO: 7,100x MULTIPLE</span>
                  <button
                    type="button"
                    onClick={() => openSourceCitation('SRC-03')}
                    className="text-[#c89446] hover:underline cursor-pointer"
                  >
                    View Citation [SRC-03] →
                  </button>
                </div>
              </div>
            </div>

            {/* Act Bottom Nav */}
            <div className="pt-3 border-t border-[#2b2419] flex items-center justify-between text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => prevAct()}
                className="inline-flex items-center gap-1.5 text-[#8a7a6a] hover:text-[#dcd6c8] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Act V: Tape Deck</span>
              </button>
              <button
                type="button"
                onClick={() => nextAct()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#c89446] text-[#050605] font-bold hover:bg-[#e6b464] transition cursor-pointer"
              >
                <span>Proceed to Act VII: The Archive</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ACT 7: THE QUIET ARCHIVE (Fact vs Fiction Matrix & Synthesis)
        ==================================================================== */}
        {activeActIndex === 7 && (
          <div className="w-full max-w-6xl h-full flex flex-col justify-between py-2">
            {/* Act Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech pb-3 border-b border-[#212622]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#9a9e94] px-2 py-0.5 bg-[#121513] border border-[#262c27]">
                  ACT 07 // CH.07
                </span>
                <span className="font-display text-lg text-[#ece6d9]">The Quiet Archive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#293d2e]/20 border border-[#436e4f]/50 text-[#a8e0b8] text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#60c07d]" />
                  CRITICAL SYNTHESIS // EPISTEMIC LEDGER
                </span>
              </div>
            </div>

            {/* Fact vs. Fiction Matrix & Source Register Hub */}
            <div className="bg-[#090b09] border border-[#212622] p-5 shadow-2xl my-auto space-y-4">
              {/* Matrix Filter Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1b201c] text-xs font-mono-tech">
                <div className="flex items-center gap-2 text-[#9a9e94]">
                  <Sparkles className="w-4 h-4 text-[#c89446]" />
                  <span className="font-bold text-[#ece6d9]">
                    FORENSIC VERIFICATION MATRIX // 5 AUDITED CLAIMS
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#121612] p-1 border border-[#212720]">
                  <button
                    type="button"
                    onClick={() => setFactFilter('all')}
                    className={`px-2 py-0.5 transition cursor-pointer ${
                      factFilter === 'all'
                        ? 'bg-[#1e251e] text-[#f2ede4] font-bold'
                        : 'text-[#8a8477] hover:text-[#dcd6c8]'
                    }`}
                  >
                    All Claims ({factRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFactFilter('myth')}
                    className={`px-2 py-0.5 transition cursor-pointer ${
                      factFilter === 'myth'
                        ? 'bg-[#8f241b]/40 text-[#f5bfb7] border border-[#b83a2e]/60 font-bold'
                        : 'text-[#8a8477] hover:text-[#dcd6c8]'
                    }`}
                  >
                    Layer A Lore (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFactFilter('fact')}
                    className={`px-2 py-0.5 transition cursor-pointer ${
                      factFilter === 'fact'
                        ? 'bg-[#293d2e] text-[#bde0c6] border border-[#436e4f] font-bold'
                        : 'text-[#8a8477] hover:text-[#dcd6c8]'
                    }`}
                  >
                    Layer B Reality (2)
                  </button>
                </div>
              </div>

              {/* Rows List */}
              <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
                {filteredFactRows.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#0d100d] border border-[#1b221a] grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs font-mono-tech"
                  >
                    <div className="md:col-span-4">
                      <div className="font-bold text-[#ece6d9]">{r.topic}</div>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 border rounded-xs inline-block mt-1 ${
                          r.status === 'FICTIONAL'
                            ? 'text-[#f5a89f] border-[#b83a2e]/60 bg-[#8f241b]/20'
                            : 'text-[#a8e0b8] border-[#436e4f]/60 bg-[#293d2e]/20'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="md:col-span-4 text-[#ded3d0] font-body text-xs">
                      <span className="font-mono-tech text-[9px] text-[#e06d60] block font-bold">
                        IN-UNIVERSE MYTH:
                      </span>
                      {r.myth}
                    </div>

                    <div className="md:col-span-4 text-[#c0d4c7] font-body text-xs">
                      <span className="font-mono-tech text-[9px] text-[#60c07d] block font-bold">
                        HISTORICAL FACT:
                      </span>
                      {r.fact}
                    </div>
                  </div>
                ))}
              </div>

              {/* Source Register Trigger Callout */}
              <div className="p-3 bg-[#111511] border border-[#212920] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
                <div>
                  <span className="text-[#ece6d9] font-bold">COMPLETE CASE PROVENANCE REGISTRY</span>
                  <div className="text-[#8a8477] text-[11px]">
                    18 verified primary records: Library of Congress, Maryland State Archives, Sundance Film Festival records.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSourceRegisterOpen(true)}
                  className="px-4 py-2 bg-[#c89446] text-[#050605] font-bold hover:bg-[#e6b464] transition cursor-pointer flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Open 18-Asset Sources Register</span>
                </button>
              </div>
            </div>

            {/* Act Bottom Nav */}
            <div className="pt-3 border-t border-[#212622] flex items-center justify-between text-xs font-mono-tech">
              <button
                type="button"
                onClick={() => prevAct()}
                className="inline-flex items-center gap-1.5 text-[#9a9e94] hover:text-[#dcd6c8] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Act VI: 1999 Web Mirage</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveActIndex(0)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1b221a] hover:bg-[#283327] text-[#f2ede4] border border-[#3b4938] transition cursor-pointer"
              >
                <span>Restart Case Investigation (Act 00)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          BOTTOM CINEMA NAVIGATION RIBBON (Tactile HUD Timeline)
      ====================================================================== */}
      <footer className="w-full bg-[#080a08]/96 backdrop-blur-md border-t border-[#1f261d] px-4 py-2 select-none z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-mono-tech">
          {/* Previous Act Arrow */}
          <button
            type="button"
            onClick={() => prevAct()}
            disabled={activeActIndex === 0}
            className={`p-1.5 border transition cursor-pointer ${
              activeActIndex === 0
                ? 'opacity-30 border-transparent cursor-not-allowed'
                : 'border-[#263124] text-[#c2bcb0] hover:bg-[#141a14] hover:text-[#f2ede4]'
            }`}
            title="Previous Act [Left Arrow]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* 8 Act Indicator Buttons Strip */}
          <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {CASE_ACTS.map((act) => {
              const isCur = act.index === activeActIndex;
              const isLore = act.truthLayer === 'IN-UNIVERSE MYTHOLOGY';

              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActiveActIndex(act.index)}
                  className={`group px-2 sm:px-3 py-1.5 border transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isCur
                      ? 'bg-[#161d15] text-[#f2ede4] border-[#c89446] shadow-[0_0_10px_rgba(200,148,70,0.3)]'
                      : 'bg-[#0d100d] border-[#1f261d] text-[#7a7467] hover:bg-[#141814] hover:text-[#dcd6c8]'
                  }`}
                >
                  <span
                    className={`font-bold text-[10px] ${
                      isCur ? 'text-[#c89446]' : 'text-[#8a8477]'
                    }`}
                  >
                    {act.number}
                  </span>
                  <span className="hidden md:inline font-medium text-[11px] tracking-wide">
                    {act.shortTitle}
                  </span>
                  {act.index !== 0 && (
                    <span
                      className={`text-[8px] uppercase px-1 border rounded-xs hidden sm:inline ${
                        isLore
                          ? 'text-[#f5a89f] border-[#b83a2e]/50'
                          : 'text-[#a8e0b8] border-[#436e4f]/50'
                      }`}
                    >
                      {isLore ? 'L' : 'F'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Act Arrow */}
          <button
            type="button"
            onClick={() => nextAct()}
            disabled={activeActIndex === CASE_ACTS.length - 1}
            className={`p-1.5 border transition cursor-pointer ${
              activeActIndex === CASE_ACTS.length - 1
                ? 'opacity-30 border-transparent cursor-not-allowed'
                : 'border-[#263124] text-[#c2bcb0] hover:bg-[#141a14] hover:text-[#f2ede4]'
            }`}
            title="Next Act [Right Arrow]"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

import type { AudioTrackConfig, ChapterAudioCue } from '../../core/types/caseSchema';

export const BLAIR_WITCH_AUDIO_TRACKS: AudioTrackConfig[] = [
  // =========================================================================
  // Musical Score Tracks (Sourced from Kai Engel & Kevin MacLeod via Archive.org)
  // =========================================================================
  {
    id: 'aud-score-strings',
    title: 'Touch the Darkness (Kai Engel: Chamber Strings, Cello & Piano)',
    url: '/assets/blair-witch/audio/aud-score-strings.mp3',
    type: 'score',
    volume: 0.65,
    loop: true,
  },
  {
    id: 'aud-score-dread',
    title: 'Echoes of Time (Kevin MacLeod: Dark Ambient Cinematic Drone & Bowed Strings)',
    url: '/assets/blair-witch/audio/aud-score-dread.mp3',
    type: 'score',
    volume: 0.6,
    loop: true,
  },
  {
    id: 'aud-score-investigation',
    title: 'Aftermath (Kevin MacLeod: Documentary Investigation Score & Horns)',
    url: '/assets/blair-witch/audio/aud-score-investigation.mp3',
    type: 'score',
    volume: 0.6,
    loop: true,
  },
  {
    id: 'aud-score-suspense',
    title: 'After Midnight (Kai Engel: Nocturnal Violin Harmonics & Suspense)',
    url: '/assets/blair-witch/audio/aud-score-suspense.mp3',
    type: 'score',
    volume: 0.6,
    loop: true,
  },
  {
    id: 'aud-score-melancholy',
    title: 'Behind Your Window (Kai Engel: Reflective Piano & Archival Atmosphere)',
    url: '/assets/blair-witch/audio/aud-score-melancholy.mp3',
    type: 'score',
    volume: 0.6,
    loop: true,
  },

  // =========================================================================
  // Ambience Bus (Sourced from Radio Aporee Field Archive on Archive.org)
  // =========================================================================
  {
    id: 'aud-forest-wind',
    title: 'Nida Soft Forest Canopy & Wind (Acoustic Field Recording)',
    url: '/assets/blair-witch/audio/forest-wind-canopy.mp3',
    type: 'ambience',
    volume: 0.55,
    loop: true,
  },
  {
    id: 'aud-room-tone',
    title: 'Archival Vault & Concrete Reading Room Hum (45Hz)',
    url: '/assets/blair-witch/audio/historical-room-tone.wav',
    type: 'ambience',
    volume: 0.45,
    loop: true,
  },
  {
    id: 'aud-creek-flow',
    title: 'Kiefer Creek Water Stream Flow (Natural Water Recording)',
    url: '/assets/blair-witch/audio/stream-creek-flow.mp3',
    type: 'ambience',
    volume: 0.5,
    loop: true,
  },
  {
    id: 'aud-nocturnal-insects',
    title: 'Trees Swaying in Autumn Wind & Nocturnal Crickets',
    url: '/assets/blair-witch/audio/nocturnal-insects.mp3',
    type: 'ambience',
    volume: 0.5,
    loop: true,
  },
  {
    id: 'aud-tape-static',
    title: 'Hi8 Video Tape Transport Static & Hiss',
    url: '/assets/blair-witch/audio/radio-tape-interference.wav',
    type: 'sfx',
    volume: 0.45,
    loop: true,
  },
];

export const BLAIR_WITCH_CHAPTER_CUES: ChapterAudioCue[] = [
  {
    movementId: 'prologue',
    musicTrackId: 'aud-score-dread',
    ambientTrackId: 'aud-forest-wind',
    duckOnInteraction: true,
  },
  {
    movementId: 'chapter-01-the-legend',
    musicTrackId: 'aud-score-investigation',
    ambientTrackId: 'aud-room-tone',
    duckOnInteraction: true,
  },
  {
    movementId: 'chapter-02-the-town',
    musicTrackId: 'aud-score-investigation',
    ambientTrackId: 'aud-creek-flow',
    duckOnInteraction: true,
  },
  {
    movementId: 'chapter-03-the-disappearance',
    musicTrackId: 'aud-score-suspense',
    ambientTrackId: 'aud-nocturnal-insects',
    duckOnInteraction: true,
  },
  {
    movementId: 'chapter-04-the-woods',
    musicTrackId: 'aud-score-dread',
    ambientTrackId: 'aud-forest-wind',
    duckOnInteraction: true,
  },
  {
    movementId: 'chapter-05-the-recordings',
    musicTrackId: 'aud-score-strings',
    ambientTrackId: 'aud-tape-static',
    duckOnInteraction: true,
  },
  {
    movementId: 'chapter-06-the-real-story',
    musicTrackId: 'aud-score-investigation',
    ambientTrackId: 'aud-room-tone',
    duckOnInteraction: true,
  },
  {
    movementId: 'chapter-07-what-remains',
    musicTrackId: 'aud-score-melancholy',
    ambientTrackId: 'aud-room-tone',
    duckOnInteraction: true,
  },
];

import { ASSET_MAP } from '../data/blairWitchAssets';

export interface AudioSceneConfig {
  id: string;
  ambienceId: string;
  scoreId?: string;
  volumeMultiplier?: number;
}

export interface AudioManagerSubscriber {
  (state: AudioManagerSnapshot): void;
}

export interface AudioManagerSnapshot {
  enabled: boolean;
  muted: boolean;
  masterVolume: number;
  scoreVolume: number;
  ambienceVolume: number;
  sfxVolume: number;
  activeSceneId: string | null;
  activeAmbienceId: string;
  activeScoreId: string | null;
  activeCueId: string | null;
  isAudioContextRunning: boolean;
  isDucked: boolean;
}

// Fallback asset path resolver when not found in ASSET_MAP
const AUDIO_FALLBACK_PATHS: Record<string, string> = {
  // Musical Score Tracks (Sourced from Kai Engel & Kevin MacLeod via Internet Archive)
  'aud-score-strings': '/assets/blair-witch/audio/aud-score-strings.mp3',
  'aud-score-dread': '/assets/blair-witch/audio/aud-score-dread.mp3',
  'aud-score-investigation': '/assets/blair-witch/audio/aud-score-investigation.mp3',
  'aud-score-suspense': '/assets/blair-witch/audio/aud-score-suspense.mp3',
  'aud-score-melancholy': '/assets/blair-witch/audio/aud-score-melancholy.mp3',
  // Atmospheric Ambiences (Sourced from Radio Aporee natural acoustic field recordings)
  'aud-forest-wind': '/assets/blair-witch/audio/forest-wind-canopy.mp3',
  'aud-room-tone': '/assets/blair-witch/audio/historical-room-tone.wav',
  'aud-nocturnal-insects': '/assets/blair-witch/audio/nocturnal-insects.mp3',
  'aud-creek-flow': '/assets/blair-witch/audio/stream-creek-flow.mp3',
  'aud-tape-static': '/assets/blair-witch/audio/radio-tape-interference.wav',
  'aud-cabin-creak': '/assets/blair-witch/audio/wooden-cabin-creak.wav',
  // Tactile Sound Effects (SFX)
  'sfx-typewriter': '/assets/blair-witch/audio/sfx-typewriter.mp3',
  'sfx-paper-turn': '/assets/blair-witch/audio/sfx-paper-turn.mp3',
  'sfx-camera-shutter': '/assets/blair-witch/audio/sfx-camera-shutter.mp3',
  'sfx-branch-snap': '/assets/blair-witch/audio/sfx-branch-snap.wav',
  'sfx-footsteps': '/assets/blair-witch/audio/sfx-footsteps.wav',
  'sfx-tape-latch': '/assets/blair-witch/audio/sfx-tape-latch.wav',
  'cue-branch-snap': '/assets/blair-witch/audio/sfx-branch-snap.wav',
  'cue-dry-leaves': '/assets/blair-witch/audio/sfx-footsteps.wav',
  'cue-cabin-creak': '/assets/blair-witch/audio/wooden-cabin-creak.wav',
};

class EnigmaAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private scoreGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Buffer cache to eliminate decode delays
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  private bufferLoadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

  // Active Score Layer
  private currentScoreSource: AudioBufferSourceNode | null = null;
  private currentScoreGainNode: GainNode | null = null;
  private currentScoreId: string | null = null;

  // Active Ambience Layer
  private currentAmbienceSource: AudioBufferSourceNode | null = null;
  private currentAmbienceGainNode: GainNode | null = null;
  private currentAmbienceId: string = 'NONE';
  private currentSceneId: string | null = null;

  // Fade timers & transitions
  private transitionTimeout: number | null = null;
  private pendingAmbienceId: string | null = null;
  private pendingScoreId: string | null = null;

  // One-shot cue state
  private activeCueSource: AudioBufferSourceNode | null = null;
  private activeCueId: string | null = null;
  private cueCooldowns: Map<string, number> = new Map();

  // Global Volume & Bus States
  private enabled: boolean = false;
  private muted: boolean = false;
  private masterVolume: number = 0.70;
  private scoreVolume: number = 0.65;
  private ambienceVolume: number = 0.60;
  private sfxVolume: number = 0.85;
  private isDucked: boolean = false;

  // Subscribers
  private subscribers: Set<AudioManagerSubscriber> = new Set();

  constructor() {
    // Handle tab visibility changes to avoid background audio runaway
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend().catch(() => {});
          }
        } else {
          if (this.enabled && !this.muted && this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
          }
        }
      });
    }
  }

  public subscribe(cb: AudioManagerSubscriber): () => void {
    this.subscribers.add(cb);
    cb(this.getSnapshot());
    return () => this.subscribers.delete(cb);
  }

  private notify() {
    const snap = this.getSnapshot();
    this.subscribers.forEach((cb) => cb(snap));
  }

  public getSnapshot(): AudioManagerSnapshot {
    return {
      enabled: this.enabled,
      muted: this.muted,
      masterVolume: this.masterVolume,
      scoreVolume: this.scoreVolume,
      ambienceVolume: this.ambienceVolume,
      sfxVolume: this.sfxVolume,
      activeSceneId: this.currentSceneId,
      activeAmbienceId: this.currentAmbienceId,
      activeScoreId: this.currentScoreId,
      activeCueId: this.activeCueId,
      isAudioContextRunning: Boolean(this.ctx && this.ctx.state === 'running'),
      isDucked: this.isDucked,
    };
  }

  private ensureAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master output bus with limiter protection
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Score / Musical Score bus
      this.scoreGain = this.ctx.createGain();
      this.scoreGain.gain.setValueAtTime(this.scoreVolume, this.ctx.currentTime);
      this.scoreGain.connect(this.masterGain);

      // Ambience bus
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      // SFX / Foley bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // Preload and decode an audio buffer into Web Audio memory
  public async loadBuffer(assetId: string, directUrl?: string): Promise<AudioBuffer | null> {
    if (this.audioBufferCache.has(assetId)) {
      return this.audioBufferCache.get(assetId)!;
    }
    if (this.bufferLoadingPromises.has(assetId)) {
      return this.bufferLoadingPromises.get(assetId)!;
    }

    const asset = ASSET_MAP[assetId];
    const candidateUrls = [
      directUrl,
      asset?.localPath,
      AUDIO_FALLBACK_PATHS[assetId],
      `/assets/blair-witch/audio/${assetId}.mp3`,
      `/assets/blair-witch/audio/${assetId}.wav`,
    ].filter(Boolean) as string[];

    const promise = (async () => {
      const ctx = this.ensureAudioContext();
      for (const targetUrl of candidateUrls) {
        try {
          const res = await fetch(targetUrl);
          if (!res.ok) continue;
          const arrayBuf = await res.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrayBuf);
          this.audioBufferCache.set(assetId, decoded);
          return decoded;
        } catch {
          // continue to next format candidate
        }
      }
      console.warn(`[AudioManager] Failed to load/decode audio asset "${assetId}" across candidates:`, candidateUrls);
      return null;
    })().finally(() => {
      this.bufferLoadingPromises.delete(assetId);
    });

    this.bufferLoadingPromises.set(assetId, promise);
    return promise;
  }

  // User consent toggle
  public enableAudio(initialSceneId?: string, initialAmbienceId = 'aud-forest-wind', initialScoreId = 'aud-score-dread') {
    this.enabled = true;
    this.muted = false;
    this.ensureAudioContext();
    this.syncMasterGain(0.05);

    if (initialSceneId) {
      this.enterScene(initialSceneId, initialAmbienceId, initialScoreId);
    } else {
      this.crossfadeAmbience(initialAmbienceId, 1.6);
      if (initialScoreId) this.playScore(initialScoreId, 2.0);
    }
    this.notify();
  }

  public disableAudio() {
    this.enabled = false;
    this.stopAll(0.3);
    this.notify();
  }

  public toggleAudio(fallbackSceneId?: string, fallbackAmbienceId = 'aud-forest-wind', fallbackScoreId = 'aud-score-dread') {
    if (this.enabled) {
      this.disableAudio();
    } else {
      this.enableAudio(fallbackSceneId, fallbackAmbienceId, fallbackScoreId);
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    this.syncMasterGain(0.05);
    this.notify();
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.syncMasterGain(0.05);
    this.notify();
  }

  public setScoreVolume(volume: number) {
    this.scoreVolume = Math.max(0, Math.min(1, volume));
    if (this.scoreGain && this.ctx) {
      this.scoreGain.gain.setValueAtTime(this.scoreVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  public setAmbienceVolume(volume: number) {
    this.ambienceVolume = Math.max(0, Math.min(1, volume));
    if (this.ambienceGain && this.ctx) {
      this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  private syncMasterGain(rampTimeSec = 0.05) {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const target = this.enabled && !this.muted ? this.masterVolume : 0;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(target, now, rampTimeSec);
  }

  // Audio Ducking: smoothly lowers score & ambience when speech, vitrine, or inspection plays
  public applyDucking(duckDb = -8, durationMs = 250) {
    if (!this.scoreGain || !this.ambienceGain || !this.ctx) return;
    this.isDucked = true;
    const linearGain = Math.pow(10, duckDb / 20);
    const targetTime = this.ctx.currentTime + durationMs / 1000;
    this.scoreGain.gain.setTargetAtTime(linearGain * this.scoreVolume, this.ctx.currentTime, targetTime);
    this.ambienceGain.gain.setTargetAtTime(linearGain * this.ambienceVolume, this.ctx.currentTime, targetTime);
    this.notify();
  }

  public releaseDucking(durationMs = 450) {
    if (!this.scoreGain || !this.ambienceGain || !this.ctx) return;
    this.isDucked = false;
    const targetTime = this.ctx.currentTime + durationMs / 1000;
    this.scoreGain.gain.setTargetAtTime(this.scoreVolume, this.ctx.currentTime, targetTime);
    this.ambienceGain.gain.setTargetAtTime(this.ambienceVolume, this.ctx.currentTime, targetTime);
    this.notify();
  }

  // ===========================================================================
  // MUSICAL SCORE BUS
  // ===========================================================================

  public async playScore(scoreId: string, fadeDurationSec = 2.4) {
    if (!this.enabled || scoreId === this.currentScoreId) return;

    if (scoreId === 'NONE' || !scoreId) {
      if (this.currentScoreGainNode && this.ctx) {
        const now = this.ctx.currentTime;
        this.currentScoreGainNode.gain.cancelScheduledValues(now);
        this.currentScoreGainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDurationSec);
        const oldSrc = this.currentScoreSource;
        setTimeout(() => {
          try { oldSrc?.stop(); oldSrc?.disconnect(); } catch {}
        }, fadeDurationSec * 1000 + 80);
      }
      this.currentScoreSource = null;
      this.currentScoreGainNode = null;
      this.currentScoreId = null;
      this.notify();
      return;
    }

    const ctx = this.ensureAudioContext();
    const buffer = await this.loadBuffer(scoreId);
    if (!buffer || !this.enabled) return;

    // Create a dedicated GainNode for this new score instance
    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    trackGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + fadeDurationSec);
    trackGain.connect(this.scoreGain!);

    const newSource = ctx.createBufferSource();
    newSource.buffer = buffer;
    newSource.loop = true;
    newSource.connect(trackGain);
    newSource.start(ctx.currentTime);

    // Fade out previous score instance cleanly
    if (this.currentScoreGainNode && this.currentScoreSource) {
      const now = ctx.currentTime;
      const oldGain = this.currentScoreGainNode;
      const oldSource = this.currentScoreSource;
      oldGain.gain.cancelScheduledValues(now);
      oldGain.gain.setValueAtTime(oldGain.gain.value, now);
      oldGain.gain.linearRampToValueAtTime(0.0001, now + fadeDurationSec);
      setTimeout(() => {
        try { oldSource.stop(); oldSource.disconnect(); oldGain.disconnect(); } catch {}
      }, fadeDurationSec * 1000 + 100);
    }

    this.currentScoreSource = newSource;
    this.currentScoreGainNode = trackGain;
    this.currentScoreId = scoreId;
    this.notify();
  }

  // ===========================================================================
  // SCENE OWNERSHIP & CONTEXT-AWARE AMBIENCE MANAGEMENT
  // ===========================================================================

  public enterScene(sceneId: string, ambienceId: string, scoreId?: string) {
    this.currentSceneId = sceneId;

    if (!this.enabled) {
      this.currentAmbienceId = ambienceId;
      if (scoreId) this.currentScoreId = scoreId;
      this.notify();
      return;
    }

    // Debounce rapid scroll triggers by 100ms
    if (this.transitionTimeout !== null) {
      window.clearTimeout(this.transitionTimeout);
    }

    this.pendingAmbienceId = ambienceId;
    this.pendingScoreId = scoreId ?? null;

    this.transitionTimeout = window.setTimeout(() => {
      this.transitionTimeout = null;
      if (this.pendingAmbienceId) {
        this.crossfadeAmbience(this.pendingAmbienceId, 1.8);
        this.pendingAmbienceId = null;
      }
      if (this.pendingScoreId) {
        this.playScore(this.pendingScoreId, 2.2);
        this.pendingScoreId = null;
      }
    }, 100);

    this.notify();
  }

  public leaveScene(sceneId: string) {
    if (this.currentSceneId === sceneId) {
      this.currentSceneId = null;
      if (this.activeCueSource) {
        this.stopActiveCue(0.3);
      }
      this.crossfadeAmbience('NONE', 1.4);
      this.notify();
    }
  }

  public async crossfadeAmbience(targetAmbienceId: string, fadeDurationSec = 1.8) {
    if (targetAmbienceId === this.currentAmbienceId) return;

    if (targetAmbienceId === 'NONE' || !this.enabled) {
      if (this.currentAmbienceGainNode && this.ctx) {
        const now = this.ctx.currentTime;
        this.currentAmbienceGainNode.gain.cancelScheduledValues(now);
        this.currentAmbienceGainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDurationSec);
        const oldSrc = this.currentAmbienceSource;
        setTimeout(() => {
          try { oldSrc?.stop(); oldSrc?.disconnect(); } catch {}
        }, fadeDurationSec * 1000 + 80);
      }
      this.currentAmbienceSource = null;
      this.currentAmbienceGainNode = null;
      this.currentAmbienceId = 'NONE';
      this.notify();
      return;
    }

    const ctx = this.ensureAudioContext();
    const buffer = await this.loadBuffer(targetAmbienceId);
    if (!buffer || !this.enabled) return;

    // Create a dedicated GainNode for this new ambience instance
    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    trackGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + fadeDurationSec);
    trackGain.connect(this.ambienceGain!);

    const newSource = ctx.createBufferSource();
    newSource.buffer = buffer;
    newSource.loop = true;
    newSource.connect(trackGain);
    newSource.start(ctx.currentTime);

    // Fade out previous ambience instance cleanly
    if (this.currentAmbienceGainNode && this.currentAmbienceSource) {
      const now = ctx.currentTime;
      const oldGain = this.currentAmbienceGainNode;
      const oldSource = this.currentAmbienceSource;
      oldGain.gain.cancelScheduledValues(now);
      oldGain.gain.setValueAtTime(oldGain.gain.value, now);
      oldGain.gain.linearRampToValueAtTime(0.0001, now + fadeDurationSec);
      setTimeout(() => {
        try { oldSource.stop(); oldSource.disconnect(); oldGain.disconnect(); } catch {}
      }, fadeDurationSec * 1000 + 100);
    }

    this.currentAmbienceSource = newSource;
    this.currentAmbienceGainNode = trackGain;
    this.currentAmbienceId = targetAmbienceId;
    this.notify();
  }

  // ===========================================================================
  // TACTILE SFX & FOLEY CUE SYSTEM
  // ===========================================================================

  public async triggerCue(cueAssetId: string, cooldownMs = 300, directUrl?: string) {
    if (!this.enabled || this.muted) return;

    const now = Date.now();
    const lastPlayed = this.cueCooldowns.get(cueAssetId) || 0;
    if (now - lastPlayed < cooldownMs) return;
    this.cueCooldowns.set(cueAssetId, now);

    const ctx = this.ensureAudioContext();
    const buffer = await this.loadBuffer(cueAssetId, directUrl);
    if (!buffer) return;

    // Brief subtle ducking of music and ambience for tactile punch
    this.applyDucking(-4, 150);

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Organic micro-detuning (±3% pitch variation) so repeated interactions sound human
    const detuneCents = (Math.random() - 0.5) * 60; // -30 to +30 cents
    if (source.detune) {
      source.detune.setValueAtTime(detuneCents, ctx.currentTime);
    }

    // Per-cue gain with subtle random dynamic variation
    const cueVol = ctx.createGain();
    const randomVolumeOffset = (Math.random() - 0.5) * 0.1;
    cueVol.gain.setValueAtTime(Math.max(0.2, 0.9 + randomVolumeOffset), ctx.currentTime);

    source.connect(cueVol);
    cueVol.connect(this.sfxGain!);

    source.onended = () => {
      this.releaseDucking(300);
      if (this.activeCueId === cueAssetId) {
        this.activeCueId = null;
        this.activeCueSource = null;
      }
      this.notify();
    };

    this.activeCueSource = source;
    this.activeCueId = cueAssetId;
    source.start(0);
    this.notify();
  }

  public stopActiveCue(fadeSec = 0.2) {
    if (this.activeCueSource && this.ctx) {
      try {
        this.activeCueSource.stop(this.ctx.currentTime + fadeSec);
      } catch {}
      this.activeCueSource = null;
      this.activeCueId = null;
      this.notify();
    }
  }

  public stopAll(fadeDurationSec = 0.4) {
    if (this.currentAmbienceGainNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.currentAmbienceGainNode.gain.cancelScheduledValues(now);
      this.currentAmbienceGainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDurationSec);
    }
    if (this.currentScoreGainNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.currentScoreGainNode.gain.cancelScheduledValues(now);
      this.currentScoreGainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDurationSec);
    }

    setTimeout(() => {
      try { this.currentAmbienceSource?.stop(); this.currentAmbienceSource?.disconnect(); } catch {}
      try { this.currentScoreSource?.stop(); this.currentScoreSource?.disconnect(); } catch {}
      this.currentAmbienceSource = null;
      this.currentAmbienceGainNode = null;
      this.currentScoreSource = null;
      this.currentScoreGainNode = null;
      this.currentAmbienceId = 'NONE';
      this.currentScoreId = null;
      this.currentSceneId = null;
    }, fadeDurationSec * 1000 + 50);

    this.stopActiveCue(fadeDurationSec);
  }
}

export const audioManager = new EnigmaAudioManager();

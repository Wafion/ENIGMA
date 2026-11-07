export interface AudioSceneConfig {
  id: string;
  ambienceId: string;
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

export type AssetPathResolver = (assetId: string) => string | undefined;

export class EnigmaMultiBusAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private scoreGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Buffer cache
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  private bufferLoadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

  // Active sources
  private currentScoreSource: AudioBufferSourceNode | null = null;
  private currentAmbienceSource: AudioBufferSourceNode | null = null;
  private activeCueSource: AudioBufferSourceNode | null = null;

  // Active track identifiers
  private currentScoreId: string | null = null;
  private currentAmbienceId: string = 'NONE';
  private currentSceneId: string | null = null;
  private activeCueId: string | null = null;

  // Global settings
  private enabled: boolean = false;
  private muted: boolean = false;
  private masterVolume: number = 0.65;
  private scoreVolume: number = 0.7;
  private ambienceVolume: number = 0.8;
  private sfxVolume: number = 0.85;
  private isDucked: boolean = false;

  // Custom asset path resolver per case
  private assetResolver: AssetPathResolver | null = null;

  // Subscribers
  private subscribers: Set<AudioManagerSubscriber> = new Set();

  constructor() {
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

  public setAssetResolver(resolver: AssetPathResolver) {
    this.assetResolver = resolver;
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

      // Master output bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Score submix bus
      this.scoreGain = this.ctx.createGain();
      this.scoreGain.gain.setValueAtTime(this.scoreVolume, this.ctx.currentTime);
      this.scoreGain.connect(this.masterGain);

      // Ambience submix bus
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      // SFX submix bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // Load buffer either via custom resolver or fallback URL
  public async loadBuffer(assetId: string, directUrl?: string): Promise<AudioBuffer | null> {
    if (this.audioBufferCache.has(assetId)) {
      return this.audioBufferCache.get(assetId)!;
    }
    if (this.bufferLoadingPromises.has(assetId)) {
      return this.bufferLoadingPromises.get(assetId)!;
    }

    const path = directUrl || (this.assetResolver ? this.assetResolver(assetId) : `/assets/blair-witch/audio/${assetId}.wav`);
    if (!path) return null;

    const promise = (async () => {
      try {
        const ctx = this.ensureAudioContext();
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
        const arrayBuf = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        this.audioBufferCache.set(assetId, decoded);
        return decoded;
      } catch (err) {
        console.warn(`[AudioManager] Failed to decode audio asset "${assetId}":`, err);
        return null;
      } finally {
        this.bufferLoadingPromises.delete(assetId);
      }
    })();

    this.bufferLoadingPromises.set(assetId, promise);
    return promise;
  }

  // User consent toggle
  public enableAudio(initialSceneId?: string, initialAmbienceId = 'aud-forest-wind') {
    this.enabled = true;
    this.muted = false;
    this.ensureAudioContext();
    this.syncMasterGain(0.05);

    if (initialSceneId && initialAmbienceId) {
      this.enterScene(initialSceneId, initialAmbienceId);
    } else {
      this.crossfadeAmbience(initialAmbienceId);
    }
    this.notify();
  }

  public disableAudio() {
    this.enabled = false;
    this.stopAll(0.4);
    this.notify();
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

  private syncMasterGain(rampTimeSec = 0.05) {
    if (!this.masterGain || !this.ctx) return;
    const target = this.muted ? 0 : this.masterVolume;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + rampTimeSec);
  }

  // Audio Ducking: lowers music and ambience when speech or exhibits play
  public applyDucking(duckDb = -9, durationMs = 300) {
    if (!this.scoreGain || !this.ambienceGain || !this.ctx) return;
    this.isDucked = true;
    const linearGain = Math.pow(10, duckDb / 20);
    const targetTime = this.ctx.currentTime + durationMs / 1000;
    this.scoreGain.gain.setTargetAtTime(linearGain * this.scoreVolume, this.ctx.currentTime, targetTime);
    this.notify();
  }

  public releaseDucking(durationMs = 600) {
    if (!this.scoreGain || !this.ambienceGain || !this.ctx) return;
    this.isDucked = false;
    const targetTime = this.ctx.currentTime + durationMs / 1000;
    this.scoreGain.gain.setTargetAtTime(this.scoreVolume, this.ctx.currentTime, targetTime);
    this.notify();
  }

  // Crossfade Ambience Track
  public async crossfadeAmbience(nextAmbienceId: string, fadeSeconds = 2.0) {
    if (!this.enabled || nextAmbienceId === this.currentAmbienceId) return;
    const ctx = this.ensureAudioContext();

    if (nextAmbienceId === 'NONE') {
      this.currentAmbienceId = 'NONE';
      if (this.currentAmbienceSource) {
        this.stopSource(this.currentAmbienceSource, fadeSeconds);
        this.currentAmbienceSource = null;
      }
      this.notify();
      return;
    }

    const buffer = await this.loadBuffer(nextAmbienceId);
    if (!buffer) return;

    // Create new looping source
    const newSource = ctx.createBufferSource();
    newSource.buffer = buffer;
    newSource.loop = true;

    const sourceGain = ctx.createGain();
    sourceGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    sourceGain.gain.exponentialRampToValueAtTime(this.ambienceVolume, ctx.currentTime + fadeSeconds);

    newSource.connect(sourceGain);
    sourceGain.connect(this.ambienceGain!);

    newSource.start(0);

    // Fade out previous source
    if (this.currentAmbienceSource) {
      this.stopSource(this.currentAmbienceSource, fadeSeconds);
    }

    this.currentAmbienceSource = newSource;
    this.currentAmbienceId = nextAmbienceId;
    this.notify();
  }

  // Scene transition
  public enterScene(sceneId: string, ambienceId: string) {
    this.currentSceneId = sceneId;
    if (this.enabled) {
      this.crossfadeAmbience(ambienceId);
    }
    this.notify();
  }

  // Trigger one-shot SFX cue
  public async triggerCue(assetId: string, directUrl?: string) {
    if (!this.enabled || this.muted) return;
    const ctx = this.ensureAudioContext();
    const buffer = await this.loadBuffer(assetId, directUrl);
    if (!buffer) return;

    this.applyDucking(-6, 200);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sfxGain!);

    source.onended = () => {
      this.releaseDucking(400);
      this.activeCueId = null;
      this.notify();
    };

    this.activeCueSource = source;
    this.activeCueId = assetId;
    source.start(0);
    this.notify();
  }

  private stopSource(source: AudioBufferSourceNode, fadeSeconds = 0.5) {
    if (!this.ctx) return;
    try {
      source.stop(this.ctx.currentTime + fadeSeconds);
    } catch {
      // already stopped
    }
  }

  public stopAll(fadeSeconds = 0.5) {
    if (this.currentAmbienceSource) {
      this.stopSource(this.currentAmbienceSource, fadeSeconds);
      this.currentAmbienceSource = null;
    }
    if (this.currentScoreSource) {
      this.stopSource(this.currentScoreSource, fadeSeconds);
      this.currentScoreSource = null;
    }
    if (this.activeCueSource) {
      this.stopSource(this.activeCueSource, fadeSeconds);
      this.activeCueSource = null;
    }
    this.currentAmbienceId = 'NONE';
    this.currentScoreId = null;
    this.currentSceneId = null;
  }
}

export const enigmaAudioManager = new EnigmaMultiBusAudioManager();

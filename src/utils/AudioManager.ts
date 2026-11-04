import { ASSET_MAP } from '../data/blairWitchAssets';

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
  activeSceneId: string | null;
  activeAmbienceId: string;
  activeCueId: string | null;
  isAudioContextRunning: boolean;
}

class EnigmaAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private cueGain: GainNode | null = null;

  // Buffer cache to eliminate decode delays
  private audioBufferCache: Map<string, AudioBuffer> = new Map();
  private bufferLoadingPromises: Map<string, Promise<AudioBuffer | null>> = new Map();

  // Active Ambience Layer
  private currentSource: AudioBufferSourceNode | null = null;
  private currentAmbienceId: string = 'NONE';
  private currentSceneId: string | null = null;

  // Fade timers & transitions
  private transitionTimeout: number | null = null;
  private pendingAmbienceId: string | null = null;

  // One-shot cue state
  private activeCueSource: AudioBufferSourceNode | null = null;
  private activeCueId: string | null = null;
  private cueCooldowns: Map<string, number> = new Map();

  // Global state
  private enabled: boolean = false;
  private muted: boolean = false;
  private masterVolume: number = 0.65;

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
      activeSceneId: this.currentSceneId,
      activeAmbienceId: this.currentAmbienceId,
      activeCueId: this.activeCueId,
      isAudioContextRunning: Boolean(this.ctx && this.ctx.state === 'running'),
    };
  }

  private ensureAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambience bus with subtle soft-knee dynamics
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      // Cue bus
      this.cueGain = this.ctx.createGain();
      this.cueGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.cueGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // Preload and decode an audio buffer into Web Audio memory
  public async loadBuffer(assetId: string): Promise<AudioBuffer | null> {
    if (this.audioBufferCache.has(assetId)) {
      return this.audioBufferCache.get(assetId)!;
    }
    if (this.bufferLoadingPromises.has(assetId)) {
      return this.bufferLoadingPromises.get(assetId)!;
    }

    const asset = ASSET_MAP[assetId];
    if (!asset) return null;

    const promise = (async () => {
      try {
        const ctx = this.ensureAudioContext();
        const res = await fetch(asset.localPath);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${asset.localPath}`);
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
    this.stopAll(0.3);
    this.notify();
  }

  public toggleAudio(fallbackSceneId?: string, fallbackAmbienceId = 'aud-forest-wind') {
    if (this.enabled) {
      this.disableAudio();
    } else {
      this.enableAudio(fallbackSceneId, fallbackAmbienceId);
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

  private syncMasterGain(rampTimeSec = 0.05) {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const target = this.enabled && !this.muted ? this.masterVolume : 0;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(target, now, rampTimeSec);
  }

  // ===========================================================================
  // SCENE OWNERSHIP & CONTEXT-AWARE AMBIENCE MANAGEMENT
  // ===========================================================================

  /**
   * Called when a section or scene becomes active in the viewport.
   * If user scrolls out or into a silent scene, ambience is faded out.
   */
  public enterScene(sceneId: string, ambienceId: string) {
    if (this.currentSceneId === sceneId && this.currentAmbienceId === ambienceId) {
      return;
    }
    this.currentSceneId = sceneId;

    if (!this.enabled) {
      this.currentAmbienceId = ambienceId;
      this.notify();
      return;
    }

    // Debounce rapid scroll triggers by 120ms to prevent buffer thrashing
    if (this.transitionTimeout !== null) {
      window.clearTimeout(this.transitionTimeout);
    }

    this.pendingAmbienceId = ambienceId;
    this.transitionTimeout = window.setTimeout(() => {
      this.transitionTimeout = null;
      if (this.pendingAmbienceId) {
        this.crossfadeAmbience(this.pendingAmbienceId);
        this.pendingAmbienceId = null;
      }
    }, 120);

    this.notify();
  }

  /**
   * Called when a section or scene leaves the viewport.
   * Crucial requirement: if the scene that is leaving is the active owner,
   * we fade out its ambience to silence rather than continuing indefinitely!
   */
  public leaveScene(sceneId: string) {
    if (this.currentSceneId === sceneId) {
      this.currentSceneId = null;

      // Stop any active cue associated with this leaving section
      if (this.activeCueSource) {
        this.stopActiveCue(0.3);
      }

      // Smoothly fade ambience out over 1.4s
      this.crossfadeAmbience('NONE', 1.4);
      this.notify();
    }
  }

  /**
   * Seamless crossfade between ambient tracks using Web Audio API buffer sources
   */
  private async crossfadeAmbience(targetAmbienceId: string, fadeDurationSec = 1.6) {
    if (targetAmbienceId === this.currentAmbienceId) {
      return;
    }

    const ctx = this.ensureAudioContext();
    const now = ctx.currentTime;
    const oldSource = this.currentSource;

    // Fade out current source if playing
    if (oldSource && this.ambienceGain) {
      this.ambienceGain.gain.cancelScheduledValues(now);
      this.ambienceGain.gain.setValueAtTime(this.ambienceGain.gain.value, now);
      this.ambienceGain.gain.linearRampToValueAtTime(0, now + fadeDurationSec);

      setTimeout(() => {
        try {
          oldSource.stop();
          oldSource.disconnect();
        } catch {}
      }, fadeDurationSec * 1000 + 80);
      this.currentSource = null;
    }

    this.currentAmbienceId = targetAmbienceId;

    if (targetAmbienceId === 'NONE' || !this.enabled) {
      this.notify();
      return;
    }

    // Load new buffer
    const buffer = await this.loadBuffer(targetAmbienceId);
    if (!buffer || !this.enabled || this.currentAmbienceId !== targetAmbienceId) {
      return;
    }

    // Create frame-accurate looping buffer source
    const newSource = ctx.createBufferSource();
    newSource.buffer = buffer;
    newSource.loop = true;
    newSource.loopStart = 0;
    newSource.loopEnd = buffer.duration;

    newSource.connect(this.ambienceGain!);

    const startNow = ctx.currentTime;
    this.ambienceGain!.gain.cancelScheduledValues(startNow);
    this.ambienceGain!.gain.setValueAtTime(0, startNow);
    this.ambienceGain!.gain.linearRampToValueAtTime(0.75, startNow + fadeDurationSec);

    newSource.start(startNow);
    this.currentSource = newSource;
    this.notify();
  }

  // ===========================================================================
  // ONE-SHOT CUE MANAGEMENT WITH DEDUPLICATION & COOLDOWN
  // ===========================================================================

  public async triggerCue(cueAssetId: string, cooldownMs = 1200) {
    const nowMs = Date.now();
    const lastTrigger = this.cueCooldowns.get(cueAssetId) || 0;
    if (nowMs - lastTrigger < cooldownMs) {
      return; // Deduplicate
    }
    this.cueCooldowns.set(cueAssetId, nowMs);

    // If audio is not enabled, enable it on user gesture
    if (!this.enabled) {
      this.enableAudio(undefined, this.currentAmbienceId !== 'NONE' ? this.currentAmbienceId : 'aud-forest-wind');
    }

    // If this cue is already playing, stop it (toggle off)
    if (this.activeCueId === cueAssetId && this.activeCueSource) {
      this.stopActiveCue(0.2);
      this.notify();
      return;
    }

    this.stopActiveCue(0.15);

    const ctx = this.ensureAudioContext();
    const buffer = await this.loadBuffer(cueAssetId);
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = false; // Strictly non-looping for one-shot cues!
    source.connect(this.cueGain!);

    const startNow = ctx.currentTime;
    source.start(startNow);

    this.activeCueSource = source;
    this.activeCueId = cueAssetId;
    this.notify();

    source.onended = () => {
      if (this.activeCueSource === source) {
        this.activeCueSource = null;
        this.activeCueId = null;
        this.notify();
      }
    };
  }

  public stopActiveCue(fadeTimeSec = 0.2) {
    if (!this.activeCueSource || !this.ctx) return;
    const now = this.ctx.currentTime;
    const src = this.activeCueSource;
    this.activeCueSource = null;
    this.activeCueId = null;

    if (this.cueGain) {
      this.cueGain.gain.cancelScheduledValues(now);
      this.cueGain.gain.setValueAtTime(this.cueGain.gain.value, now);
      this.cueGain.gain.linearRampToValueAtTime(0, now + fadeTimeSec);
      setTimeout(() => {
        try {
          src.stop();
          src.disconnect();
          if (this.cueGain && this.ctx) {
            this.cueGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
          }
        } catch {}
      }, fadeTimeSec * 1000 + 50);
    } else {
      try { src.stop(); src.disconnect(); } catch {}
    }
  }

  public stopAll(fadeTimeSec = 0.3) {
    if (this.transitionTimeout !== null) {
      window.clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
    this.stopActiveCue(fadeTimeSec);

    if (this.currentSource && this.ambienceGain && this.ctx) {
      const now = this.ctx.currentTime;
      const src = this.currentSource;
      this.currentSource = null;
      this.currentAmbienceId = 'NONE';
      this.ambienceGain.gain.cancelScheduledValues(now);
      this.ambienceGain.gain.linearRampToValueAtTime(0, now + fadeTimeSec);
      setTimeout(() => {
        try {
          src.stop();
          src.disconnect();
        } catch {}
      }, fadeTimeSec * 1000 + 50);
    }
  }

  public dispose() {
    this.stopAll(0.1);
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.subscribers.clear();
    this.audioBufferCache.clear();
  }
}

export const audioManager = new EnigmaAudioManager();

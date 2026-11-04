import { ASSET_MAP } from '../data/blairWitchAssets';

class EnigmaAudioEngine {
  private enabled = false;
  private muted = false;
  private masterVolume = 0.55;
  private currentAmbientId: string = 'NONE';
  private ambientElements: Map<string, HTMLAudioElement> = new Map();
  private activeCueElement: HTMLAudioElement | null = null;
  private activeCueId: string | null = null;
  private fadeTimer: number | null = null;
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState() {
    return {
      enabled: this.enabled,
      muted: this.muted,
      volume: this.masterVolume,
      currentAmbientId: this.currentAmbientId,
      activeCueId: this.activeCueId,
    };
  }

  public enableAudio(initialAmbientId = 'aud-forest-wind') {
    this.enabled = true;
    this.muted = false;
    this.setAmbientTrack(initialAmbientId);
    this.notify();
  }

  public disableAudio() {
    this.enabled = false;
    this.stopAll();
    this.notify();
  }

  public toggleAudio(fallbackAmbientId = 'aud-forest-wind') {
    if (this.enabled) {
      this.disableAudio();
    } else {
      this.enableAudio(
        this.currentAmbientId !== 'NONE' ? this.currentAmbientId : fallbackAmbientId
      );
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    this.syncVolumes();
    this.notify();
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    this.syncVolumes();
    this.notify();
  }

  private syncVolumes() {
    const effective = this.enabled && !this.muted ? this.masterVolume : 0;
    for (const [id, el] of this.ambientElements.entries()) {
      if (id === this.currentAmbientId && this.enabled && !this.muted) {
        el.volume = effective * 0.65;
      } else {
        el.volume = 0;
      }
    }
    if (this.activeCueElement) {
      this.activeCueElement.volume = Math.min(1, effective * 0.95);
    }
  }

  public setAmbientTrack(ambientId: string) {
    if (this.currentAmbientId === ambientId && this.enabled) {
      this.syncVolumes();
      return;
    }
    this.currentAmbientId = ambientId;

    if (!this.enabled) {
      this.notify();
      return;
    }

    // Pause non-active tracks smoothly
    for (const [id, el] of this.ambientElements.entries()) {
      if (id !== ambientId) {
        el.volume = 0;
        el.pause();
      }
    }

    if (ambientId === 'NONE') {
      this.notify();
      return;
    }

    const asset = ASSET_MAP[ambientId];
    if (!asset) {
      this.notify();
      return;
    }

    let audio = this.ambientElements.get(ambientId);
    if (!audio) {
      audio = new Audio(asset.localPath);
      audio.loop = true;
      audio.preload = 'auto';
      this.ambientElements.set(ambientId, audio);
    }

    const targetVol = this.muted ? 0 : this.masterVolume * 0.65;
    audio.volume = 0;
    audio.play().catch(() => {
      // Browser prevented playback until next gesture
    });

    if (this.fadeTimer) {
      window.clearInterval(this.fadeTimer);
    }

    let step = 0;
    this.fadeTimer = window.setInterval(() => {
      step += 1;
      if (!audio || !this.enabled || this.currentAmbientId !== ambientId) {
        if (this.fadeTimer) window.clearInterval(this.fadeTimer);
        return;
      }
      const progress = Math.min(1, step / 12);
      audio.volume = (this.muted ? 0 : targetVol) * progress;
      if (progress >= 1 && this.fadeTimer) {
        window.clearInterval(this.fadeTimer);
      }
    }, 60);

    this.notify();
  }

  public triggerCue(cueAssetId: string) {
    const asset = ASSET_MAP[cueAssetId];
    if (!asset) return;

    if (!this.enabled) {
      this.enabled = true;
      this.muted = false;
    }

    if (this.activeCueElement) {
      this.activeCueElement.pause();
      this.activeCueElement.currentTime = 0;
      this.activeCueElement = null;
    }

    if (this.activeCueId === cueAssetId) {
      this.activeCueId = null;
      this.notify();
      return;
    }

    const cue = new Audio(asset.localPath);
    cue.volume = this.muted ? 0 : Math.min(1, this.masterVolume * 0.95);
    this.activeCueElement = cue;
    this.activeCueId = cueAssetId;
    this.notify();

    cue.onended = () => {
      if (this.activeCueId === cueAssetId) {
        this.activeCueId = null;
        this.activeCueElement = null;
        this.notify();
      }
    };

    cue.play().catch(() => {
      this.activeCueId = null;
      this.activeCueElement = null;
      this.notify();
    });
  }

  public stopAll() {
    if (this.fadeTimer) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
    for (const el of this.ambientElements.values()) {
      el.pause();
      el.currentTime = 0;
    }
    if (this.activeCueElement) {
      this.activeCueElement.pause();
      this.activeCueElement = null;
      this.activeCueId = null;
    }
  }
}

export const audioEngine = new EnigmaAudioEngine();

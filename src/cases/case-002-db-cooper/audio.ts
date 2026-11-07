import type { DbcAudioScene } from './content';
import { SCENES } from './content';
import { DBC_MUSIC_MAP, MUSIC_CUES, type DbcMusicCue, type DbcMusicTrack } from './music';

export interface DbcAudioSnapshot {
  enabled: boolean;
  muted: boolean;
  scene: DbcAudioScene;
  masterVolume: number;
  scoreVolume: number;
  ambienceVolume: number;
  trackId: string | null;
  trackTitle: string | null;
  trackArtist: string | null;
}

interface SceneProfile {
  root: number;
  partials: number[];
  noise: number;
  cutoff: number;
  pulse: number;
  wave: OscillatorType;
}

interface MusicDeck {
  el: HTMLAudioElement;
  gain: GainNode;
  trackId: string | null;
  stopTimer: number | null;
}

/**
 * Procedural textures remain underneath the licensed score: a low drone,
 * filtered noise, and small mechanical events. The music decks are real files,
 * crossfaded on scene changes; the synthesised bed fills silence and gives the
 * jump its wind without turning the film into a trailer.
 */
const PROFILES: Record<DbcAudioScene, SceneProfile> = {
  prologue: { root: 55, partials: [1, 1.5, 2.004, 3.01], noise: 0.055, cutoff: 420, pulse: 0, wave: 'sine' },
  man: { root: 61.5, partials: [1, 1.498, 2.01, 2.997], noise: 0.022, cutoff: 680, pulse: 0, wave: 'sine' },
  flight: { root: 48, partials: [1, 1.5, 2, 3.0], noise: 0.04, cutoff: 760, pulse: 2.6, wave: 'triangle' },
  note: { root: 58, partials: [1, 1.335, 1.5, 2.01], noise: 0.018, cutoff: 1700, pulse: 0, wave: 'sine' },
  ground: { root: 52, partials: [1, 1.2, 1.5, 2.99], noise: 0.058, cutoff: 980, pulse: 1.7, wave: 'triangle' },
  'second-flight': { root: 44, partials: [1, 1.5, 2.005, 3.0], noise: 0.052, cutoff: 560, pulse: 1.15, wave: 'triangle' },
  jump: { root: 38.5, partials: [1, 1.5, 2.006, 2.99], noise: 0.14, cutoff: 520, pulse: 0, wave: 'sine' },
  silence: { root: 38.5, partials: [1], noise: 0.0, cutoff: 220, pulse: 0, wave: 'sine' },
  search: { root: 49, partials: [1, 1.414, 1.997, 3.0], noise: 0.05, cutoff: 900, pulse: 0, wave: 'sine' },
  money: { root: 65.4, partials: [1, 1.5, 2.0, 2.514], noise: 0.035, cutoff: 1500, pulse: 0, wave: 'sine' },
  evidence: { root: 57, partials: [1, 1.498, 2.006, 2.997], noise: 0.02, cutoff: 1200, pulse: 0, wave: 'sine' },
  archive: { root: 46, partials: [1, 1.189, 1.498, 2.0], noise: 0.036, cutoff: 620, pulse: 0, wave: 'triangle' },
  suspects: { root: 54, partials: [1, 1.414, 1.732, 2.99], noise: 0.022, cutoff: 700, pulse: 0, wave: 'sine' },
  theories: { root: 43, partials: [1, 1.335, 2.0, 2.67], noise: 0.028, cutoff: 540, pulse: 0, wave: 'sine' },
  landscape: { root: 50, partials: [1, 1.5, 1.997, 3.0], noise: 0.07, cutoff: 1100, pulse: 0, wave: 'sine' },
  unknowns: { root: 41, partials: [1, 1.5, 2.0, 3.0], noise: 0.012, cutoff: 380, pulse: 0, wave: 'sine' },
  epilogue: { root: 46.2, partials: [1, 1.25, 1.498, 2.0], noise: 0.024, cutoff: 500, pulse: 0, wave: 'sine' },
  sources: { root: 58, partials: [1, 1.5, 2.0, 3.0], noise: 0.015, cutoff: 900, pulse: 0, wave: 'sine' },
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

class DbcAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private score: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private musicDuck: GainNode | null = null;
  private ambience: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private voices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private noise: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private pulseTimer: number | null = null;
  private decks: MusicDeck[] = [];
  private activeDeck = 0;
  private currentTrack: string | null = null;
  private preloads = new Map<string, HTMLAudioElement>();
  private visibilityBound = false;
  private subscribers = new Set<(state: DbcAudioSnapshot) => void>();

  private state: DbcAudioSnapshot = {
    enabled: false,
    muted: false,
    scene: 'prologue',
    masterVolume: 0.62,
    scoreVolume: 0.62,
    ambienceVolume: 0.5,
    trackId: null,
    trackTitle: null,
    trackArtist: null,
  };

  subscribe(callback: (state: DbcAudioSnapshot) => void) {
    this.subscribers.add(callback);
    callback(this.getSnapshot());
    return () => this.subscribers.delete(callback);
  }

  getSnapshot(): DbcAudioSnapshot {
    return { ...this.state };
  }

  private notify() {
    const snapshot = this.getSnapshot();
    this.subscribers.forEach((callback) => callback(snapshot));
  }

  private ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    }
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.connect(ctx.destination);

    this.score = ctx.createGain();
    this.score.gain.value = 0.34;
    this.score.connect(this.master);

    this.ambience = ctx.createGain();
    this.ambience.gain.value = this.state.ambienceVolume;
    this.ambience.connect(this.master);

    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = 0.8;
    this.sfxBus.connect(this.master);

    this.musicDuck = ctx.createGain();
    this.musicDuck.gain.value = 1;
    this.musicDuck.connect(this.master);

    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = this.state.scoreVolume;
    this.musicBus.connect(this.musicDuck);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 700;
    this.filter.Q.value = 0.6;
    this.filter.connect(this.score);

    for (let index = 0; index < 4; index += 1) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.value = 55 * (1 + index * 0.5);
      gain.gain.value = index === 0 ? 0.1 : 0.022;
      osc.connect(gain);
      gain.connect(this.filter);
      osc.start();
      this.voices.push({ osc, gain });
    }

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const channel = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < channel.length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      channel[i] = last * 3.2;
    }
    this.noise = ctx.createBufferSource();
    this.noise.buffer = buffer;
    this.noise.loop = true;
    this.noiseFilter = ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.value = 460;
    this.noiseFilter.Q.value = 0.45;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0.0001;
    this.noise.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.ambience);
    this.noise.start();

    for (let index = 0; index < 2; index += 1) {
      const el = new Audio();
      el.loop = true;
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      const gain = ctx.createGain();
      gain.gain.value = 0.0001;
      const source = ctx.createMediaElementSource(el);
      source.connect(gain);
      gain.connect(this.musicBus);
      this.decks.push({ el, gain, trackId: null, stopTimer: null });
    }

    this.bindVisibility();
    return ctx;
  }

  private bindVisibility() {
    if (this.visibilityBound) return;
    this.visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) {
        this.decks.forEach((deck) => deck.el.pause());
        void this.ctx.suspend();
        return;
      }
      if (!this.state.enabled) return;
      void this.ctx.resume();
      const deck = this.decks[this.activeDeck];
      if (this.currentTrack && deck?.el.paused) void deck.el.play().catch(() => undefined);
    });
  }

  private absolute(file: string) {
    return new URL(file, window.location.href).href;
  }

  private preloadTrack(trackId: string | null) {
    if (!trackId || this.preloads.has(trackId)) return;
    const track = DBC_MUSIC_MAP[trackId];
    if (!track) return;
    if (this.preloads.size >= 3) {
      const oldest = this.preloads.keys().next().value;
      if (oldest) {
        const element = this.preloads.get(oldest);
        if (element) element.src = '';
        this.preloads.delete(oldest);
      }
    }
    const element = new Audio();
    element.preload = 'auto';
    element.src = track.file;
    element.load();
    this.preloads.set(trackId, element);
  }

  private preloadNext(scene: DbcAudioScene) {
    const index = SCENES.findIndex((entry) => entry.audio === scene);
    const next = SCENES[index + 1];
    if (!next) return;
    this.preloadTrack(MUSIC_CUES[next.audio]?.track ?? null);
  }

  private setDeckTrack(deck: MusicDeck, track: DbcMusicTrack, cue: DbcMusicCue) {
    const url = this.absolute(track.file);
    if (deck.el.src !== url) {
      deck.el.src = track.file;
      deck.el.load();
      deck.trackId = track.id;
    }
    deck.el.loop = cue.loop;
    if (cue.startAt && deck.el.readyState >= 1) {
      try {
        deck.el.currentTime = cue.startAt;
      } catch {
        // The browser may still be resolving metadata; start at zero instead.
      }
    }
  }

  private clearStop(deck: MusicDeck) {
    if (deck.stopTimer) {
      window.clearTimeout(deck.stopTimer);
      deck.stopTimer = null;
    }
  }

  private rampDeck(deck: MusicDeck, target: number, fade: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const gain = deck.gain.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(Math.max(gain.value, 0.0001), now);
    gain.linearRampToValueAtTime(Math.max(target, 0.0001), now + Math.max(0.2, fade));
  }

  private fadeOutDeck(deck: MusicDeck | undefined, fade: number) {
    if (!deck || !this.ctx || deck.el.paused) return;
    this.clearStop(deck);
    const now = this.ctx.currentTime;
    deck.gain.gain.cancelScheduledValues(now);
    deck.gain.gain.setValueAtTime(Math.max(deck.gain.gain.value, 0.0001), now);
    deck.gain.gain.linearRampToValueAtTime(0.0001, now + Math.max(0.15, fade));
    deck.stopTimer = window.setTimeout(() => {
      deck.el.pause();
      deck.el.currentTime = 0;
      deck.stopTimer = null;
    }, Math.max(0.15, fade) * 1000 + 140);
  }

  private applyMusicCue(cue: DbcMusicCue, overrideFade?: number) {
    if (!this.ctx || !this.state.enabled) return;
    const fadeIn = overrideFade ?? cue.fadeIn;
    const fadeOut = overrideFade ?? cue.fadeOut;

    if (!cue.track) {
      this.fadeOutDeck(this.decks[this.activeDeck], fadeOut);
      this.currentTrack = null;
      return;
    }

    if (this.currentTrack === cue.track) {
      const deck = this.decks[this.activeDeck];
      if (!deck) return;
      this.clearStop(deck);
      if (deck.el.paused) void deck.el.play().catch(() => undefined);
      this.rampDeck(deck, cue.gain, Math.min(fadeIn, 2.5));
      return;
    }

    const track = DBC_MUSIC_MAP[cue.track];
    if (!track) return;
    const oldDeck = this.decks[this.activeDeck];
    const nextIndex = this.activeDeck === 0 ? 1 : 0;
    const nextDeck = this.decks[nextIndex];
    if (!nextDeck) return;

    this.clearStop(nextDeck);
    this.setDeckTrack(nextDeck, track, cue);
    nextDeck.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    nextDeck.gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    void nextDeck.el.play().catch(() => undefined);
    this.rampDeck(nextDeck, cue.gain, fadeIn);

    if (oldDeck && oldDeck !== nextDeck) this.fadeOutDeck(oldDeck, fadeOut);

    this.activeDeck = nextIndex;
    this.currentTrack = cue.track;
  }

  private updateProcedural(scene: DbcAudioScene, fade: number) {
    if (!this.ctx || !this.filter) return;
    const profile = PROFILES[scene];
    const now = this.ctx.currentTime;
    const silent = scene === 'silence';
    const musicActive = Boolean(MUSIC_CUES[scene]?.track);

    this.voices.forEach((voice, index) => {
      const ratio = profile.partials[index % profile.partials.length] ?? 1;
      voice.osc.type = profile.wave;
      voice.osc.frequency.cancelScheduledValues(now);
      voice.osc.frequency.setTargetAtTime(profile.root * ratio * (index === 3 ? 2 : 1), now, fade / 2.5);
      const level = index === 0
        ? (musicActive ? 0.038 : 0.11)
        : (musicActive ? 0.008 : 0.026);
      voice.gain.gain.setTargetAtTime(silent ? 0.0001 : level, now, fade / 2);
    });

    this.filter.frequency.setTargetAtTime(profile.cutoff, now, fade / 2);
    this.noiseGain?.gain.setTargetAtTime(
      silent ? 0.0001 : profile.noise * (musicActive ? 0.6 : 1),
      now,
      fade / 2,
    );
    this.noiseFilter?.frequency.setTargetAtTime(scene === 'jump' ? 620 : 460, now, fade / 2);

    this.stopPulse();
    if (profile.pulse > 0 && !silent && !musicActive) this.startPulse(profile.pulse);
  }

  enable(scene: DbcAudioScene = 'prologue') {
    const ctx = this.ensureContext();
    this.state.enabled = true;
    this.state.muted = false;
    this.master?.gain.cancelScheduledValues(ctx.currentTime);
    this.master?.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), ctx.currentTime);
    this.master?.gain.linearRampToValueAtTime(this.state.masterVolume, ctx.currentTime + 1.4);
    this.setScene(scene, 5);
    this.preloadTrack(MUSIC_CUES[scene]?.track ?? null);
    this.preloadNext(scene);
    this.notify();
  }

  /** Stop playback when leaving the documentary; the context is reused on return. */
  stop() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.state.enabled = false;
    this.currentTrack = null;
    this.state.trackId = null;
    this.state.trackTitle = null;
    this.state.trackArtist = null;
    this.master?.gain.cancelScheduledValues(now);
    this.master?.gain.setTargetAtTime(0.0001, now, 0.18);
    this.decks.forEach((deck) => {
      this.clearStop(deck);
      deck.gain.gain.cancelScheduledValues(now);
      deck.gain.gain.setTargetAtTime(0.0001, now, 0.12);
      deck.el.pause();
      deck.el.currentTime = 0;
      deck.trackId = null;
    });
    this.stopPulse();
    this.notify();
  }

  setMuted(muted: boolean) {
    this.state.muted = muted;
    if (this.ctx && this.master) {
      const target = muted || !this.state.enabled ? 0.0001 : this.state.masterVolume;
      this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.12);
    }
    this.notify();
  }

  setMasterVolume(value: number) {
    this.state.masterVolume = clamp(value);
    if (this.ctx && this.master && this.state.enabled && !this.state.muted) {
      this.master.gain.setTargetAtTime(this.state.masterVolume, this.ctx.currentTime, 0.08);
    }
    this.notify();
  }

  setScoreVolume(value: number) {
    this.state.scoreVolume = clamp(value);
    if (this.ctx && this.musicBus) {
      this.musicBus.gain.setTargetAtTime(this.state.scoreVolume, this.ctx.currentTime, 0.08);
    }
    this.notify();
  }

  setAmbienceVolume(value: number) {
    this.state.ambienceVolume = clamp(value);
    if (this.ctx && this.ambience) {
      this.ambience.gain.setTargetAtTime(this.state.ambienceVolume, this.ctx.currentTime, 0.08);
    }
    this.notify();
  }

  setScene(scene: DbcAudioScene, fade?: number) {
    const changed = this.state.scene !== scene;
    const cue = MUSIC_CUES[scene];
    const track = cue?.track ? DBC_MUSIC_MAP[cue.track] : null;

    this.state.scene = scene;
    this.state.trackId = track?.id ?? null;
    this.state.trackTitle = track?.title ?? null;
    this.state.trackArtist = track?.artist ?? null;

    if (this.ctx && this.state.enabled && cue) {
      this.updateProcedural(scene, fade ?? 4);
      this.applyMusicCue(cue, fade);
      this.preloadNext(scene);
    }

    if (changed) this.notify();
  }

  /**
   * Scroll-linked continuous modulation of the procedural drone and wind filter
   * for active scenes (`flight`, `second-flight`, and `jump` -> `silence` drop).
   */
  modulateSceneProgress(scene: DbcAudioScene, rawProgress: number) {
    if (!this.ctx || !this.state.enabled || this.state.muted) return;
    if (this.state.scene !== scene && !(scene === 'jump' && this.state.scene === 'silence')) return;

    const progress = clamp(rawProgress, 0, 1);
    const now = this.ctx.currentTime;

    if (scene === 'jump') {
      if (progress >= 0.68) {
        this.filter?.frequency.setTargetAtTime(180, now, 0.25);
        this.noiseGain?.gain.setTargetAtTime(0.0001, now, 0.22);
        this.voices.forEach((voice) => {
          voice.gain.gain.setTargetAtTime(0.0001, now, 0.25);
        });
        return;
      }
      const norm = clamp(progress / 0.68, 0, 1);
      const windCutoff = 420 + norm * 1030; // 420 Hz -> 1450 Hz as aft stairs open
      const windGain = 0.065 + norm * 0.145;
      this.noiseFilter?.frequency.setTargetAtTime(windCutoff, now, 0.08);
      this.noiseGain?.gain.setTargetAtTime(windGain, now, 0.08);
      this.filter?.frequency.setTargetAtTime(480 + norm * 420, now, 0.08);
      this.voices.forEach((voice, index) => {
        const level = index === 0 ? 0.09 + norm * 0.04 : 0.02 + norm * 0.015;
        voice.gain.gain.setTargetAtTime(level, now, 0.1);
      });
      return;
    }

    if (scene === 'second-flight') {
      this.noiseFilter?.frequency.setTargetAtTime(460 + progress * 420, now, 0.1);
      this.filter?.frequency.setTargetAtTime(560 + progress * 360, now, 0.1);
      return;
    }

    if (scene === 'flight') {
      this.filter?.frequency.setTargetAtTime(680 + progress * 280, now, 0.12);
    }
  }

  private startPulse(interval: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    this.pulseTimer = window.setInterval(() => {
      if (!this.state.enabled || this.state.muted) return;
      this.thump(0.045);
    }, interval * 1000);
  }

  private stopPulse() {
    if (this.pulseTimer) {
      window.clearInterval(this.pulseTimer);
      this.pulseTimer = null;
    }
  }

  private duckMusic(depth = 0.65, hold = 0.55) {
    if (!this.ctx || !this.musicDuck) return;
    const now = this.ctx.currentTime;
    const gain = this.musicDuck.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(Math.max(gain.value, 0.0001), now);
    gain.linearRampToValueAtTime(depth, now + 0.1);
    gain.linearRampToValueAtTime(1, now + hold);
  }

  private thump(level = 0.08) {
    const ctx = this.ctx;
    if (!ctx || !this.sfxBus) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(72, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(34, ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(level, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.sfxBus);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  }

  private noiseBurst(duration: number, frequency: number, level: number, type: BiquadFilterType = 'bandpass') {
    const ctx = this.ctx;
    if (!ctx || !this.sfxBus) return;
    const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxBus);
    source.start();
  }

  playSfx(name: 'tick' | 'paper' | 'radio' | 'chute' | 'thud') {
    if (!this.state.enabled || this.state.muted) return;
    const ctx = this.ensureContext();
    if (name === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 1250;
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.sfxBus!);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (name === 'paper') {
      this.duckMusic(0.84, 0.4);
      this.noiseBurst(0.22, 2400, 0.09);
    } else if (name === 'radio') {
      this.duckMusic(0.58, 0.7);
      this.noiseBurst(0.5, 1500, 0.06);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 320;
      gain.gain.setValueAtTime(0.018, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxBus!);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } else if (name === 'chute') {
      this.duckMusic(0.42, 1.4);
      this.noiseBurst(1.6, 260, 0.12, 'lowpass');
    } else {
      this.duckMusic(0.5, 1.1);
      this.thump(0.14);
    }
  }
}

export const dbcAudio = new DbcAudioEngine();

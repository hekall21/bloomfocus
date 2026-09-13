// BloomFocus Web Audio Synthesizer & Ambient Sound Engine
// Zero-latency, zero-external-dependency, 100% browser-native

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientType: string | null = null;
  private ambientSourceNodes: (AudioNode | number)[] = [];
  private isMuted: boolean = false;
  private ambientVolume: number = 0.5;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play delicate chime effects for timer transitions
  playChime(type: "start" | "finish" | "click" | "boba" | "freeze") {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;

    if (type === "start") {
      // Warm marimba/zen chime
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } else if (type === "finish") {
      // Harmonious crystal bells celebration chime
      [528, 660, 792, 1056].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 3.0);
      });
    } else if (type === "boba") {
      // Cute bubble pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === "freeze") {
      // Icy sparkle chime
      [1200, 1500, 1800, 2200].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.7);
      });
    } else {
      // Soft click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  }

  // Start continuous ambient procedural sound (Rain, Cafe, Lo-Fi)
  startAmbient(type: "rain" | "cafe" | "lofi") {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopAmbient();
    this.currentAmbientType = type;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume * 0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.ambientGain = masterGain;

    if (type === "rain") {
      this.generateRainAcoustics(ctx, masterGain);
    } else if (type === "cafe") {
      this.generateCafeAcoustics(ctx, masterGain);
    } else if (type === "lofi") {
      this.generateLoFiAcoustics(ctx, masterGain);
    }
  }

  private generateRainAcoustics(ctx: AudioContext, destination: AudioNode) {
    // Generate pink/brownian noise for continuous cozy rainfall
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops hitting window glass
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start();

    this.ambientSourceNodes.push(whiteNoise);
  }

  private generateCafeAcoustics(ctx: AudioContext, destination: AudioNode) {
    // Warm low murmur + gentle coffee shop rumble
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(320, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

    noise.connect(bandpass);
    bandpass.connect(destination);
    noise.start();

    this.ambientSourceNodes.push(noise);
  }

  private generateLoFiAcoustics(ctx: AudioContext, destination: AudioNode) {
    // Warm continuous ambient binaural harmonic chords (F major 7th / D minor 9th soothing tone)
    const chordFrequencies = [174.61, 220.0, 261.63, 329.63]; // F3, A3, C4, E4
    chordFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Add gentle detune modulation for lush tape-warble effect
      osc.detune.setValueAtTime((idx % 2 === 0 ? 3 : -3), ctx.currentTime);

      gain.gain.setValueAtTime(0.08 / chordFrequencies.length, ctx.currentTime);

      osc.connect(gain);
      gain.connect(destination);
      osc.start();

      this.ambientSourceNodes.push(osc);
    });
  }

  stopAmbient() {
    this.ambientSourceNodes.forEach((node) => {
      if (typeof node === "object" && "stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
        try {
          (node as AudioScheduledSourceNode).stop();
          (node as AudioScheduledSourceNode).disconnect();
        } catch {
          // ignore already stopped
        }
      }
    });
    this.ambientSourceNodes = [];
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {
        // ignore
      }
      this.ambientGain = null;
    }
    this.currentAmbientType = null;
  }

  setVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    if (this.ambientGain && !this.isMuted && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume * 0.3, this.ctx.currentTime);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambientVolume * 0.3, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  getVolume() {
    return this.ambientVolume;
  }

  getIsMuted() {
    return this.isMuted;
  }

  getCurrentType() {
    return this.currentAmbientType;
  }
}

export const soundEngine = new SoundEngine();

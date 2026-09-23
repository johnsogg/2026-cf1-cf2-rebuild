// Hand-written declarations for p5.sound 0.4.1, which ships no types of its
// own. Only used by Monaco (see P5Exercise's beforeMount), where it's mounted
// at node_modules/p5/types/ next to p5's own declarations so "./p5" resolves.
// Excluded from immerse's tsconfig for the same reason.
//
// Covers the public API of the non-deprecated classes. Descriptions are
// condensed from the JSDoc in p5.sound's dist build.

declare module "./p5" {
  /** Base class for every p5.sound object. */
  export class p5soundNode {
    /**
     * Sets the volume, from 0 to 1, ramping over `rampTime` seconds
     * (default 0.1). Or pass another sound object (e.g. an oscillator)
     * to modulate the volume with its signal.
     */
    amp(volume: number | p5soundNode, rampTime?: number): void
    /** Sends this node's output into another node, such as an effect. */
    connect(destination: p5soundNode): void
    /** Disconnects this node from the main output (the speakers). */
    disconnect(): void
    /** Sets the input of an effect node. */
    setInput(source: p5soundNode): void
  }

  /** Base class for p5.sound objects that make sound. */
  export class p5soundSource extends p5soundNode {
    start(): void
    stop(): void
  }

  /** Base class for effects that mix the original and effected signal. */
  export class p5soundMixEffect extends p5soundNode {
    /** Balance between the original (0, "dry") and effected (1, "wet") signal. */
    wet(amount: number): void
  }

  export type OscillatorType = "sine" | "triangle" | "sawtooth" | "square"

  /** A tone generator. Call `start()` to hear it. */
  export class Oscillator extends p5soundSource {
    /**
     * @param frequency pitch in Hz (default 440)
     * @param type waveform (default "sine")
     */
    constructor(frequency?: number, type?: OscillatorType)
    constructor(type: OscillatorType, frequency?: number)
    /**
     * Sets the pitch in Hz, or as a note name like "C4" or "F#3", ramping
     * over `rampTime` seconds (default 0).
     */
    freq(frequency: number | string, rampTime?: number): void
    /** Sets the starting point of the waveform, in degrees (0–360). */
    phase(degrees: number): void
    setType(type: OscillatorType): void
  }
  export class SinOsc extends Oscillator {
    constructor(frequency?: number)
  }
  export class TriOsc extends Oscillator {
    constructor(frequency?: number)
  }
  export class SawOsc extends Oscillator {
    constructor(frequency?: number)
  }
  export class SqrOsc extends Oscillator {
    constructor(frequency?: number)
  }

  /** Generates static noise. */
  export class Noise extends p5soundSource {
    constructor(type?: "white" | "pink" | "brown")
    type(type: "white" | "pink" | "brown"): void
  }

  /** A sound loaded from a file. Create one with `loadSound()`. */
  export class SoundFile extends p5soundSource {
    playing: boolean
    paused: boolean
    /** Same as `start()`. */
    play(): void
    pause(): void
    /** Turns looping on or off (default on). */
    loop(loop?: boolean): void
    /** Sets the region to loop, in seconds. Only applies while looping. */
    loopPoints(startTime?: number, duration?: number): void
    isPlaying(): boolean
    isLooping(): boolean
    /**
     * Moves the playhead to `time` seconds. Only works while the sound is
     * already playing.
     */
    jump(time: number): void
    /** Playback speed: 1 is normal, 2 is double, negative plays backwards. */
    rate(rate?: number): void
    /** Length of the sound in seconds. */
    duration(): number
    sampleRate(): number
    /** Number of samples in the sound. */
    frames(): number
    channels(): number
    /** Calls `callback` when the sound finishes playing. */
    onended(callback: () => void): void
    /** Loads a different file into this SoundFile. */
    setPath(path: string, successCallback?: () => void): void
  }

  /** Microphone input. */
  export class AudioIn extends p5soundSource {}

  /**
   * Shapes a sound's volume over time: attack, decay, sustain, release.
   * `connect()` a source to it, then `play()` it.
   */
  export class Envelope extends p5soundNode {
    constructor(attack?: number, decay?: number, sustain?: number, release?: number)
    /** Runs the whole envelope: attack, decay, sustain, then release. */
    play(): void
    /** Starts the attack and decay, like pressing a key. */
    triggerAttack(): void
    /** Starts the release, like letting go of a key. */
    triggerRelease(): void
    setADSR(attack: number, decay: number, sustain: number, release: number): void
    attackTime(seconds: number): void
    releaseTime(seconds: number): void
  }

  /** An echo effect. */
  export class Delay extends p5soundMixEffect {
    /**
     * @param delayTime seconds between 0 and 1 (default 0.25)
     * @param feedback amount between 0 and 1 (default 0.2)
     */
    constructor(delayTime?: number, feedback?: number)
    delayTime(seconds: number, rampTime?: number): void
    /** How much of the echo repeats, from 0 to 0.99. */
    feedback(amount: number): void
    process(source: p5soundNode, delayTime?: number, feedback?: number): void
  }

  /** A reverb ("big room") effect. */
  export class Reverb extends p5soundMixEffect {
    constructor(decayTime?: number)
    /** Sets the decay time in seconds; longer sounds more cavernous. */
    set(decayTime: number): void
  }

  export type BiquadType =
    | "lowpass"
    | "highpass"
    | "bandpass"
    | "lowshelf"
    | "highshelf"
    | "notch"
    | "allpass"
    | "peaking"

  /** A filter that cuts or boosts frequencies. */
  export class Biquad extends p5soundNode {
    /**
     * @param cutoff frequency in Hz, 0–24000 (default 800)
     * @param type default "lowpass"
     */
    constructor(cutoff?: number, type?: BiquadType)
    freq(cutoff: number): void
    /** Resonance (or bandpass width), 0–100. High values get loud! */
    res(resonance: number): void
    /** Gain in dB; only used by lowshelf, highshelf, and peaking. */
    gain(dB: number): void
    setType(type: BiquadType): void
  }
  export class LowPass extends Biquad {
    constructor(cutoff?: number)
  }
  export class HighPass extends Biquad {
    constructor(cutoff?: number)
  }
  export class BandPass extends Biquad {
    constructor(cutoff?: number)
  }

  export class PitchShifter extends p5soundNode {
    constructor(semitones?: number)
    shift(semitones: number): void
  }

  /** A volume control, for mixing several sources together. */
  export class Gain extends p5soundNode {
    constructor(volume?: number)
  }

  /** Pans a sound between the left and right speakers. */
  export class Panner extends p5soundNode {
    /** @param pan -1 (left) to 1 (right), default 0 */
    constructor(pan?: number)
    pan(pan: number | p5soundNode): void
  }

  /** Positions a sound in 3D space. */
  export class Panner3D extends p5soundNode {
    process(source: p5soundNode): void
    set(x: number, y: number, z: number): void
    positionX(x: number): void
    positionY(y: number): void
    positionZ(z: number): void
    setFalloff(rolloffFactor: number, maxDistance: number): void
    maxDist(distance: number): void
    rolloff(rolloffFactor: number): void
  }

  /** Measures how loud a sound is. */
  export class Amplitude extends p5soundNode {
    constructor(smoothing?: number)
    /** Current volume, from 0 to 1. */
    getLevel(): number
    smooth(smoothing: number): void
  }

  /** Measures a sound's frequencies. */
  export class FFT extends p5soundNode {
    /** @param size power of two from 16 to 1024 (default 32) */
    constructor(size?: number)
    /** Volume of each frequency band, from 0 to 1. */
    analyze(): number[]
    /** The raw waveform samples, from -1 to 1. */
    waveform(): number[]
  }
}

declare global {
  /**
   * Loads a sound file. Use it with `await` inside `async function setup()`:
   *
   * `mySound = await loadSound("path/to/file.mp3")`
   */
  function loadSound(path: string): Promise<import("./p5").SoundFile>
  function getAudioContext(): AudioContext
  function setAudioContext(context: AudioContext): void
  /**
   * Starts audio. Browsers only allow sound after the user interacts with
   * the page, so call this from something like `mousePressed()`.
   */
  function userStartAudio(): void
  function userStopAudio(): void
}

export {}

import { Howl } from "howler";
import { howlFactory } from "./howl-factory";
import { EventEmitter } from "events";
import { SongManifest } from "../../types";

export class Playback {
  #howls: Howl[];
  #manifest: SongManifest;
  #rockableIndices: number[] = [];
  #mode: "band" | "free";
  #freeModeSample: string;
  #fadeInterval: NodeJS.Timer;
  public eventEmitter: EventEmitter = new EventEmitter();

  constructor(private path: string) {}

  async init(mode: "band" | "free") {
    const { howls, manifest } = await howlFactory(this.path, mode);
    this.#howls = howls;
    this.#manifest = manifest;
    this.#mode = mode;

    if (mode === "band") {
      this.#rockableIndices = [];
      this.#manifest.modes["band"]!.tracks.forEach((track) => {
        const howIndex = Object.keys(this.#manifest.tracks).indexOf(track);
        this.#howls[howIndex].volume(0);
        this.#rockableIndices.push(howIndex);
      });
    }
  }

  play() {
    this.#howls.forEach((h) => h.play());
  }

  pause() {
    this.#howls.forEach((h) => h.pause());
  }

  stop() {
    this.#howls.forEach((h) => {
      h.stop();
      h.seek(0);
    });
  }

  setSample(sampleName: string) {
    if (this.#mode === "free") {
      this.#freeModeSample = sampleName;

      this.#howls.forEach((_, i) => this.volume(i, 0));

      this.#rockableIndices = [];
      this.#manifest.modes["free"][sampleName].tracks.forEach((track) => {
        const howIndex = Object.keys(this.#manifest.tracks).indexOf(track);
        this.volume(howIndex, 1);
        this.#rockableIndices.push(howIndex);
      });
    }
  }

  rock(pressed: string[]) {
    console.log(pressed);

    if (this.#mode === "band") {
      const duration = 800;
      this.#rockableTrackVolume = 1;

      if (!this.#fadeInterval) {
        this.#fadeInterval = setInterval(() => {
          if (this.#rockableTrackVolume > 0.1) {
            this.#rockableTrackVolume = this.#rockableTrackVolume - 0.1;
          } else {
            clearInterval(this.#fadeInterval);
            this.#fadeInterval = null;
            this.#rockableTrackVolume = 0;
          }
        }, duration / 10);
      }
    }

    if (this.#mode === "free") {
      this.#howls.forEach((howl, i) => {
        if (this.#rockableIndices.includes(i)) {
          howl.play(`${this.#freeModeSample}:${pressed[0]}`);
        }
      });
    }
  }

  seek(offset: number) {
    this.#howls.forEach((h) => h.seek(offset));
  }

  get #rockableTrackVolume() {
    return this.#howls[this.#rockableIndices[0]].volume();
  }

  set #rockableTrackVolume(vol: number) {
    this.#howls.forEach((_, i) => {
      if (this.#rockableIndices.includes(i)) {
        this.volume(i, vol);
      }
    });
  }

  volume(index: number, volume: number) {
    this.#howls[index].volume(volume);
  }

  get elapsed() {
    if (!this.#howls?.length) return 0;
    return this.#howls[0].seek();
  }

  get duration() {
    if (!this.#howls?.length) return 0;
    return this.#howls[0].duration();
  }

  hasMode(mode: "band" | "free"): boolean {
    if (mode === "band") {
      return this.#manifest.modes.band !== undefined;
    }

    if (mode === "free") {
      return this.#manifest.modes.free !== undefined;
    }
  }

  getFreeModeSamples() {
    if (this.#manifest.modes.free) {
      return Object.keys(this.#manifest.modes.free);
    }
  }
}

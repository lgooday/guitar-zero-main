import { Howl } from "howler";
import { howlFactory } from "./howl-factory";
import { EventEmitter } from "events";
import { SongManifest } from "../../types";

export class Playback {
  #howls: Howl[];
  #manifest: SongManifest;
  #rockableIndices: number[] = [];
  #fadeInterval: NodeJS.Timer;
  public eventEmitter: EventEmitter = new EventEmitter();

  constructor(private path: string) {}

  async init() {
    const { howls, manifest } = await howlFactory(this.path);
    this.#howls = howls;
    this.#manifest = manifest;
  }

  playSample(sample: string) {
    this.stop();

    this.#howls[0].play("mi2theme:YELLOW");
  }

  play() {
    this.#howls.forEach((h) => h.play("full"));
    this.#rockableIndices = [];
    this.#manifest.modes["band"]!.tracks.forEach((track) => {
      const howIndex = Object.keys(this.#manifest.tracks).indexOf(track);
      this.#howls[howIndex].volume(0);
      this.#rockableIndices.push(howIndex);
    });
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

  rock(pressed: string[]) {
    console.log(pressed);

    // const duration = 800;

    // this.#rockableTrackVolume = 1;

    // if (!this.#fadeInterval) {
    //   this.#fadeInterval = setInterval(() => {
    //     if (this.#rockableTrackVolume > 0.1) {
    //       this.#rockableTrackVolume = this.#rockableTrackVolume - 0.1;
    //     } else {
    //       clearInterval(this.#fadeInterval);
    //       this.#fadeInterval = null;
    //       this.#rockableTrackVolume = 0;
    //     }
    //   }, duration / 10);
    // }
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
        this.volume(i, vol, true);
      }
    });
  }

  volume(index: number, volume: number, emit: boolean = false) {
    this.#howls[index].volume(volume);
    if (emit) {
      this.eventEmitter.emit("volume:change", { val: volume * 100, index });
    }
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

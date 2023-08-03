import { Howl } from "howler";
import { howlFactory } from "./howl-factory";
import { EventEmitter } from "events";

export class Playback {
  #howls: Howl[];
  #trackInfo: { key: string; rockable: boolean }[];
  #rockableIndices: number[] = [];
  #playing: boolean = false;
  #fadeInterval: NodeJS.Timer;
  public eventEmitter: EventEmitter = new EventEmitter();

  constructor(private path: string) {}

  async init() {
    const factory = await howlFactory(this.path);
    this.#howls = factory.howls;
    this.#trackInfo = factory.tracks;

    this.#rockableIndices = this.#trackInfo.reduce((acc, ti, i) => {
      if (ti.rockable) {
        acc.push(i);
      }
      return acc;
    }, []);

    return this.#trackInfo;
  }

  play() {
    if (!this.#playing) {
      this.#howls.forEach((h) => h.play());
      this.#playing = true;
    } else {
      this.pause();
    }
  }

  pause() {
    this.#howls.forEach((h) => h.pause());
    this.#playing = false;
  }

  stop() {
    this.#howls.forEach((h) => {
      h.stop();
      h.seek(0);
    });
    this.#playing = false;
  }

  rock() {
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

  // fadeOut(index: number, duration: number) {
  //   if (!this.#fadeInterval) {
  //     this.#fadeInterval = setInterval(() => {
  //       if (this.#howls[index].volume() > 0.1) {
  //         this.#howls[index].volume(this.#howls[index].volume() - 0.1);
  //         console.log(this.#howls[index].volume());
  //       } else {
  //         console.log("cleared");
  //         clearInterval(this.#fadeInterval);
  //         this.#fadeInterval = null;
  //         this.#howls[index].volume(0);
  //       }
  //     }, duration / 10);
  //   } else {
  //     this.#howls[index].volume(1);
  //   }
  // }

  timings() {
    return `${this.#howls[0].seek()} / ${this.#howls[0].duration()}`;
  }
}

import { Howl } from "howler";
import { songService } from "../songs";

export async function howlFactory(folder: string, mode: "band" | "free") {
  try {
    const manifest = await songService.getManifest(folder);

    const howls: Howl[] = [];

    const loaded: Promise<void>[] = [];

    for (const [trackName, value] of Object.entries(manifest.tracks)) {
      const notesInTrack: any = {};

      if (mode === "free") {
        for (const [sampleName, sampleInfo] of Object.entries(
          manifest.modes.free
        )) {
          if (sampleInfo.tracks.includes(trackName)) {
            for (const [notesOfSample, sprite] of Object.entries(
              sampleInfo.notes
            )) {
              notesInTrack[`${sampleName}:${notesOfSample}`] = sprite;
            }
          }
        }
      }

      loaded.push(
        new Promise((res, rej) => {
          howls.push(
            new Howl({
              src: songService.getTrackUri(folder, value.file),
              volume: 1,
              onload: () => res(),
              onloaderror: rej,
              sprite: Object.keys(notesInTrack).length
                ? notesInTrack
                : undefined,
            })
          );
        })
      );
    }

    await Promise.allSettled(loaded);

    return { howls, manifest };
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

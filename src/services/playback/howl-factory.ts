import { Howl, Howler } from "howler";
// import got from "got";

const host = "http://192.168.1.28:8080";

interface Manifest {
  version: number;
  band: string;
  title: string;
  art: string;
  tracks: Tracks;
  debug?: Debug;
}

interface Tracks {
  guitar: Track;
  bass: Track;
  drums: Track;
  vocals: Track;
}

interface Debug {
  startOffset?: number;
}

export interface Track {
  file: string;
  isGame?: true;
}

export async function howlFactory(folder: string) {
  try {
    const manifestCall = await fetch(`${host}/${folder}/manifest.json`, {
      cache: "no-store",
    });
    const manifest = (await manifestCall.json()) as Manifest;

    const howls = [];
    const tracks = [];

    for (const [key, value] of Object.entries(manifest.tracks)) {
      howls.push(
        new Howl({
          src: `${host}/${folder}/${value.file}`,
          volume: value.isGame ? 0 : 1,
        })
      );

      tracks.push({ key, rockable: value.isGame });
    }

    return { howls, tracks };
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

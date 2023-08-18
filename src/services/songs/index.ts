import { envService } from "../env/env";
import { Catalog, SongManifest } from "../../types";

class SongService {
  async getCatalog(): Promise<Catalog> {
    const catalogCall = await fetch(envService.get("songs").server, {
      cache: "no-store",
    });
    const catalog = (await catalogCall.json()) as Catalog;

    return catalog;
  }

  async getManifest(folder: string): Promise<SongManifest> {
    const manifestCall = await fetch(
      `${envService.get("songs").server}/song/${folder}`,
      {
        cache: "no-store",
      }
    );
    const catalog = (await manifestCall.json()) as SongManifest;

    return catalog;
  }

  getArtUri(folder: string): string {
    return `${envService.get("songs").server}/song/${folder}/art`;
  }

  getTrackUri(folder: string, track: string): string {
    return `${envService.get("songs").server}/song/${folder}/${track}`;
  }
}

export const songService = new SongService();

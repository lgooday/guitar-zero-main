import { Song } from "../../types";

class SongService {
  async getAll(): Promise<Song[]> {
    return [
      { folder: "goodstories" },
      { folder: "tala" },
      { folder: "parasitedemix" },
      { folder: "parasitesite" },
      { folder: "entersandman" },
      { folder: "slts" },
    ];
  }
}

export const songService = new SongService();

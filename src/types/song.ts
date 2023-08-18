export interface SongManifest {
  version: number;
  band: string;
  title: string;
  tracks: {
    [track: string]: {
      file: string;
    };
  };
  modes: { band?: ModeBand; free?: ModeFree };
}

export interface ModeBand {
  tracks: string[];
}

export interface ModeFree {
  [sampleName: string]: {
    tracks: string[];
    // notes: { [note: string]: number };
    notes: {
      GREEN?: number;
      RED?: number;
      YELLOW?: number;
      BLUE?: number;
      ORANGE?: number;
    };
  };
}

export type CatalogItem = Pick<SongManifest, "band" | "title">;

export type Catalog = {
  [folder: string]: CatalogItem;
};

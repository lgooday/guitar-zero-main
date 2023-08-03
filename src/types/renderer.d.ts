// import type { Howl as _Howl } from "howler";

export interface IElectronAPI {
  myAPI: {
    desktop: string;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
  const ipcRenderer: any;
  const MAIN_WINDOW_WEBPACK_ENTRY: string;
  const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
  // const Howl: typeof _Howl;
}

// declare global const MAIN_WINDOW_WEBPACK_ENTRY: string;
// declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

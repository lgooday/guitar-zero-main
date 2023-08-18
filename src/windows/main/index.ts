import { app, BrowserWindow } from "electron";
import { server } from "../../services/udp";

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // nodeIntegration: true,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

server.init();

server.eventEmitter.on("remote-input", (data) => {
  mainWindow.webContents.send("playback:note", data);
});

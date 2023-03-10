import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { isProduction } from "../environment";

/**
 * Generate a first run setup window which load the first-run.html file
 *
 * @returns a window that generated
 */
export function createFirstRunSetupWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist", "electron", "preload.js"),
    },
    frame: false,
    width: 400,
    height: 600,
    show: false,
  });
  // Open DevTools when is not on production mode
  if (!isProduction()) {
    window.webContents.openDevTools({ mode: "detach", activate: true });
  }

  // Load the loading.html file
  window.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `FirstRun`, `first-run.html`)
  );

  window.webContents.on("did-finish-load", () => {
    window.show();
  });

  ipcMain.on('firstRun:launch', () => {
    
  })
  return window;
}

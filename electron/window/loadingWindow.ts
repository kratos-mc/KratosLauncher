import { app } from "electron";
import { BrowserWindow } from "electron";
import path from "path";
import { isProduction } from "../environment";

export async function createLoadingWindow() {
  const render = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist", "electron", "preload.js"),
      contextIsolation: true,
    },
    show: true,
    frame: false,
    width: 300,
    height: 490,
    alwaysOnTop: true,
  });

  // Open DevTools when is not on production mode
  if (!isProduction()) {
    render.webContents.openDevTools({ mode: "detach", activate: true });
  }

  // Load the loading.html file
  render.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `loading`, `loading.html`)
  );

  return render;
}

import { app } from "electron";
import { BrowserWindow } from "electron";
import path from "path";
import { isProduction } from "../environment";

export async function createLoadingWindow() {
  const render = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist", "electron", "preload.js"),
    },
    show: false,
    frame: false,
    width: 300,
    height: 520,
    alwaysOnTop: true,
  });

  // Load the loading.html file
  render.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `loading`, `loading.html`)
  );
  render.setResizable(false);
  // TODO: fix the zoom (disable the zoom factor)
  // render.webContents.on("did-finish-load", () => {
  //   render.webContents.setZoomFactor(1);
  //   render.webContents.setVisualZoomLevelLimits(1, 1);
  // });
  return render;
}

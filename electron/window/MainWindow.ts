import {app, BrowserWindow} from "electron";
import path from "path";
import {isProduction} from "../environment";

export async function createMainWindow() {
  const render = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist", "electron", "preload.js"),

    },
    trafficLightPosition: {
      y: 8,
      x: 16
    },
    titleBarStyle: "hiddenInset",
    show: true,
    frame: false,
    width: 800,
    height: 600,
  });

  // Open DevTools when is not on production mode
  if (!isProduction()) {
    render.webContents.openDevTools({mode: "detach", activate: true});
  }

  // Load the loading.html file
  await render.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `Main`, `Main.html`)
  );

  return render;
}
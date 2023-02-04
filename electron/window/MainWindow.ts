import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isProduction, isTesting } from "../environment";

export async function createMainWindow() {
  const render = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist", "electron", "preload.js"),
    },
    trafficLightPosition: {
      y: 8,
      x: 8,
    },
    titleBarStyle: "hiddenInset",
    show: false,
    frame: false,
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 350,
  });

  // Open DevTools when is not on production mode
  if (!isProduction() || !isTesting()) {
    render.webContents.openDevTools({ mode: "detach", activate: true });
  }

  // Load the loading.html file
  render.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `Main`, `Main.html`)
  );

  ipcMain.on("launcher:toggle-maximize-window", () => {
    render.isMaximized() ? render.unmaximize() : render.maximize();
  });

  return render;
}

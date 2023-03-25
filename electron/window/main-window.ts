import log from "electron-log";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getGlobalProfileStorage } from "../launcher/profile";

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

  // Load the loading.html file
  render.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `Main`, `Main.html`)
  );

  ipcMain.on("launcher:toggle-maximize-window", () => {
    log.info(`Requesting toggle the maximize from main window`);
    render.isMaximized() ? render.unmaximize() : render.maximize();
  });

  ipcMain.handle("launcher:get-profiles", () => {
    const allProfileItems = getGlobalProfileStorage()?.getAllProfileItems();
    log.log("IPC: launcher:get-profiles ", allProfileItems);
    return allProfileItems;
  });

  ipcMain.on("launcher:launch-game", (_event, { profileId }) => {
    log.info(`Trying to launch game with the profile: ${profileId}`);
    const globalProfileStorage = getGlobalProfileStorage();
    if (!globalProfileStorage) {
      throw new Error("Unable to get global profile storage");
    }

    const currentProfileFromUid =
      globalProfileStorage.getProfileFromUid(profileId);
    log.info(currentProfileFromUid);

    if (!currentProfileFromUid) {
      throw new Error(`Not found profile with uid ${profileId}`);
    }

    // Resolve runtime application
    log.info(
      `Resolving game data for version ${currentProfileFromUid?.minecraftVersion}`
    );
    // globalProfileStorage.createProfileItem()
  });

  return render;
}

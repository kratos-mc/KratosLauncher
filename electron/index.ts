import { app, BrowserWindow } from "electron";

import { getLauncherAppPath, setupUserDataPath } from "./launcher/file";
import { resolveManifest } from "./launcher/manifest";
import {
  loadGlobalProfileStorage,
  ProfileManager,
  ProfileStorage,
} from "./launcher/profile";
import {
  getSettingsConfiguration,
  hasSettingsFile,
  setupSettingPath,
} from "./launcher/settings";
import { hasVersionsPath, setupVersionsPath } from "./launcher/versions";
import { createFirstRunSetupWindow } from "./window/FirstRunWindow";
import { beforeRunApplication, whenAppReady } from "./application";

(async () => {
  await beforeRunApplication();

  await app.whenReady();
  await whenAppReady();
})();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
// (async () => {
//   await beforeRunApplication();
//   await app.whenReady();
//   const loadingWindow = await createLoadingWindow();

//   // Wait for it to finish load the content
//   const loadingWindowFinishLoadPromise = new Promise<void>((resolve) => {
//     loadingWindow.webContents.on("did-finish-load", () => {
//       resolve();
//     });
//   });

//   // Wait for the loading window to finish loaded DOM stage
//   await loadingWindowFinishLoadPromise;

//   // Starting to load the directory
//   loadingWindow.webContents.send("loading:message", {
//     message: "loading launcher directory",
//   });

//   // Create if userData is not existed
//   setupUserDataPath();

//   // Setup the settings
//   setupSettingPath();

//   // Set up the versions path
//   setupVersionsPath();

//   // Then resolve the manifest file
//   loadingWindow.webContents.send("loading:message", {
//     message: "resolving version manifest",
//   });

//   const searchEngine = await resolveManifest();
//   console.log(
//     `Latest release minecraft version now is ${searchEngine.getLatestRelease()}`
//   );
//   loadingWindow.webContents.send("loading:message", {
//     message: "loading profiles",
//   });

//   // Load profile if not exists
//   ProfileManager.setupDefaultProfile()
//   loadGlobalProfileStorage()

//   loadingWindow.webContents.send("loading:message", {
//     message: "loading launcher configuration",
//   });

//   setTimeout(() => {
//     // Close the loading window
//     loadingWindow.hide();

//     // Close the devTools
//     if (loadingWindow.webContents.isDevToolsOpened()) {
//       loadingWindow.webContents.closeDevTools();
//     }

//     if (hasSettingsFile()) {
//       // Load the main window
//       createMainWindow();
//     } else {
//       // Open first run setup if the user has never run an application before
//       const firstRunSetup = createFirstRunSetupWindow();
//       // getSettingsConfiguration().save();
//     }
//   }, 3000);
// })().catch(console.error);

// Promise.resolve()
//   .then(() => beforeRunApplication())
//   .then(() => app.whenReady())
//   .then(() => createLoadingWindow())
//   .then((loadingWindow) => {})
//   .then(() => {
//     // throw new Error("nothing special");
//   })
//   .catch((err) => {
//     // TODO: add a window that display error
//     console.error(err);
//   });

if (require("electron-squirrel-startup")) app.quit();

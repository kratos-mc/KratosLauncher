import fse from "fs-extra";
import log from "electron-log";
import { app, BrowserWindow } from "electron";
import path from "path";
import { isProduction } from "./environment";
import chalk from "chalk";
import {
  getLauncherAppPath,
  setupUserDataPath,
  getSettingPath,
} from "./launcher/file";
import { createLoadingWindow } from "./window/loading-window";
import { createMainWindow } from "./window/main-window";
import { getVersionsPath, setupVersionsPath } from "./launcher/versions";
import { setupSettingPath } from "./launcher/settings";
import { resolveManifest } from "./launcher/manifest";
import {
  getGlobalProfileStorage,
  loadGlobalProfileStorage,
  ProfileManager,
} from "./launcher/profile";

export async function beforeRunApplication() {
  /**
   * Loading everything before the app was ready
   */

  // Set application data
  app.setPath(
    "userData",
    path.join(app.getPath("appData"), app.name, "web-cache")
  );

  // Setting up logs
  const loggingFileName = path.join(
    getLauncherAppPath(),
    path.join("logs", "main.log")
  );
  // Clear if the log exist
  if (fse.existsSync(loggingFileName)) {
    fse.rmSync(loggingFileName, { force: true, recursive: true });
  }
  // Then set the logging path for `electron-log`
  log.transports.file.resolvePathFn = () => loggingFileName;
  log.initialize({ preload: true });
  loggingStuff();

  log.warn("---------------- [ Application Logging  ] ----------------");
  // Setup directories
  log.info(`Setting up the user data at ${getLauncherAppPath()}`);
  setupUserDataPath();
  log.info(`Setting up the versions path at ${getVersionsPath()}`);
  setupVersionsPath();
  log.info(`Setting up the settings path at ${getSettingPath()}`);
  setupSettingPath();
}

export async function whenAppReady() {
  log.info("Loading splash screen");
  const loadingWindow = await createLoadingWindow();

  log.info("Loading main window ");
  const mainWindow = await createMainWindow();

  // Wait for the splash screen finish load content, then visible it
  await waitForDidFinishLoadWebContent(loadingWindow);
  loadingWindow.show();

  // Load the version manifest
  loadingWindow.webContents.send("loading:message", {
    message: "resolving version manifest ",
  });
  await resolveManifest();

  // Loading the launcher profile
  loadingWindow.webContents.send("loading:message", {
    message: "loading profiles",
  });

  log.info("Setting up launcher profile ");
  ProfileManager.setupDefaultProfile();
  // Load the profile into storage
  loadGlobalProfileStorage();

  // Wait for main window to finish process
  await waitForDidFinishLoadWebContent(mainWindow);
  mainWindow.show();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
}

app.on("quit", () => {
  log.log("Saving cache into files");

  // Store global profile if it is exist
  const globalProfile = getGlobalProfileStorage();
  if (globalProfile) {
    log.info("Storing profiles");
    ProfileManager.storeProfile(globalProfile.toLauncherProfile());
  }
});

function loggingStuff() {
  if (!isProduction()) {
    log.log(chalk.gray(`[~] ${chalk.green(`cwd: `)} ${process.cwd()}`));
    log.log(chalk.gray(`[~] ${chalk.green(`__dirname: `)} ${__dirname}`));
    log.log(
      chalk.gray(`[~] ${chalk.green(`app.getAppPath(): `)} ${app.getAppPath()}`)
    );
    log.log(
      chalk.gray(
        `[~] ${chalk.green(`app.getPath("appData"): `)} ${app.getPath(
          "appData"
        )}`
      )
    );
    log.log(
      chalk.gray(
        `[~] ${chalk.green(`Launcher app path: `)} ${getLauncherAppPath()}`
      )
    );
  }

  log.log(chalk.gray(`[~] ${chalk.green(`App Name: `)} ${app.name}`));
  log.log(
    chalk.gray(`[~] ${chalk.green(`App version: `)} ${app.getVersion()}`)
  );
  log.log(chalk.gray(`[~] ${chalk.green(`isPacked: `)} ${app.isPackaged}`));
}

function waitForDidFinishLoadWebContent(window: BrowserWindow): Promise<void> {
  return new Promise((resolve) => {
    window.webContents.on("did-finish-load", () => {
      resolve();
    });
  });
}

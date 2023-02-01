import chalk from "chalk";
import { app, BrowserWindow } from "electron";
import path from "path";
import { isProduction } from "./environment";
import { getLauncherAppPath, setupUserDataPath } from "./launcher/file";
import {
  getSettingsConfiguration,
  hasSettingsFile,
  setupSettingPath,
} from "./launcher/settings";
import { createFirstRunSetupWindow } from "./window/FirstRunWindow";
import { createLoadingWindow } from "./window/loadingWindow";

async function beforeRunApplication() {
  /**
   * Loading everything before the app was ready
   */
  if (!isProduction()) {
    console.log(chalk.gray(`[~] ${chalk.green(`cwd: `)} ${process.cwd()}`));
    console.log(chalk.gray(`[~] ${chalk.green(`__dirname: `)} ${__dirname}`));
    console.log(
      chalk.gray(`[~] ${chalk.green(`app.getAppPath(): `)} ${app.getAppPath()}`)
    );
    console.log(
      chalk.gray(
        `[~] ${chalk.green(`app.getPath("appData"): `)} ${app.getPath(
          "appData"
        )}`
      )
    );
    console.log(
      chalk.gray(
        `[~] ${chalk.green(`Launcher app path: `)} ${getLauncherAppPath()}`
      )
    );
  }
  // Set application data
  app.setPath(
    "userData",
    path.join(app.getPath("appData"), app.name, "web-cache")
  );

  console.log(chalk.gray(`[~] ${chalk.green(`App Name: `)} ${app.name}`));
  console.log(
    chalk.gray(`[~] ${chalk.green(`App version: `)} ${app.getVersion()}`)
  );
  console.log(chalk.gray(`[~] ${chalk.green(`isPacked: `)} ${app.isPackaged}`));
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

Promise.resolve()
  .then(() => beforeRunApplication())
  .then(() => app.whenReady())
  .then(() => createLoadingWindow())
  .then((loadingWindow) => {
    // Wait for it to finish load the content
    loadingWindow.webContents.on("did-finish-load", () => {
      // Starting to load the directory
      loadingWindow.webContents.send("loading:message", {
        message: "loading launcher directory",
      });

      // Create if userData is not existed
      setupUserDataPath();

      // Setup the settings
      setupSettingPath();

      loadingWindow.webContents.send("loading:message", {
        message: "loading launcher configuration",
      });

      setTimeout(() => {
        loadingWindow.hide();
        // Close the devTools
        if (loadingWindow.webContents.isDevToolsOpened()) {
          loadingWindow.webContents.closeDevTools();
        }

        if (hasSettingsFile()) {
          // TODO: render main launcher
        } else {
          // Open first run setup if the user has never run an application before
          const firstRunSetup = createFirstRunSetupWindow();
          // getSettingsConfiguration().save();
        }
      }, 3000);
    });
  })
  .then(() => {
    // throw new Error("nothing special");
  })
  .catch((err) => {
    // TODO: add a window that display error
    console.error(err);
  });

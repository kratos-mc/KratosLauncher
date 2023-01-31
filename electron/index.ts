import chalk from "chalk";
import { app, BrowserWindow } from "electron";
import path from "path";
import { isProduction } from "./environment";

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
  }

  console.log(chalk.gray(`[~] ${chalk.green(`App Name: `)} ${app.name}`));
  console.log(
    chalk.gray(`[~] ${chalk.green(`App version: `)} ${app.getVersion()}`)
  );
  console.log(chalk.gray(`[~] ${chalk.green(`isPacked: `)} ${app.isPackaged}`));
}

async function createLoadingWindow() {
  const render = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
    show: true,
    frame: false,
    width: 300,
    height: 400,
    alwaysOnTop: true,
  });

  // Open DevTools when is not on production mode
  if (!isProduction()) {
    render.webContents.openDevTools({ mode: "detach", activate: true });
  }

  render.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `loading`, `loading.html`)
  );

  return render;
}

Promise.resolve()
  .then(() => beforeRunApplication())
  .then(() => app.whenReady())
  .then(() => createLoadingWindow())
  .then((loadingWindow) => {
    // Wait for it to finish load the content
    loadingWindow.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        // Starting to load the directory
        loadingWindow.webContents.send("loading:message", {
          message: "loading launcher directory",
        });

        setTimeout(() => {
          // Fetching new game version manifest
          loadingWindow.webContents.send("loading:message", {
            message: "updating game versions",
          });

          //  When done. close
          setTimeout(() => {
            loadingWindow.close();
          }, 3000);
        }, 2000);
      }, 2000);
    });
  })
  .then(() =>
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") app.quit();
    })
  );

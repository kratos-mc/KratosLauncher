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

function renderLoadingWindow() {
  const render = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    show: true,
    frame: false,
    width: 300,
    height: 400,
  });
  render.loadFile(
    path.join(app.getAppPath(), `dist`, `render`, `loading.html`)
  );
}

beforeRunApplication().then(() => {
  app.whenReady().then(() => {
    renderLoadingWindow();
  });
});

import log from "electron-log";
import { app } from "electron";
import { beforeRunApplication, whenAppReady } from "./application";

beforeRunApplication()
  .then(async () => {
    await app.whenReady();
    await whenAppReady();
  })
  .catch((error) => {
    log.error(error);
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

if (require("electron-squirrel-startup")) app.quit();

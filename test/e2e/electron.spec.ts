import chalk from "chalk";
import fse from "fs-extra";
import { test, expect } from "@playwright/test";
import { ElectronApplication, Page, _electron as electron } from "playwright";

const launchApp = electron.launch({ args: ["."] });

test("should launch application", async () => {
  /**
   * Run application
   */
  const app = await launchApp;
  const isPackaged = await app.evaluate(({ app }) => {
    console.log(`isReady: ${app.isReady()}`);
    return app.isPackaged;
  });

  expect(app).not.toBeUndefined();
  expect(isPackaged).toBe(false);
  /**
   * Then close it
   */
  await app.close();
});

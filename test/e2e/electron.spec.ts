import chalk from "chalk";
import fse from "fs-extra";
import { test, expect } from "@playwright/test";
import { ElectronApplication, Page, _electron as electron } from "playwright";

let electronApp: ElectronApplication;

/**
 * Before test, check for build
 */
test.beforeAll(async () => {
  console.log(chalk.green(` ${chalk.gray(`[-]`)} cwd: ${process.cwd()}`));

  console.log(chalk.green(` ${chalk.gray(`[-]`)} __dirname: ${__dirname}`));

  process.env.CI = "e2e";
  electronApp = await electron.launch({
    args: ["."],
    env: { ...process.env, NODE_ENV: "development" },
  });

  const appPath = await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath();
  });
  console.log(`appPath: ${appPath}`);
  const electronProcess = await electronApp.process();

  electronProcess.stdout?.on("data", (c) => {
    console.log(chalk.gray(`[process::stdout] ${c.toString()}`));
  });

  electronProcess.stderr?.on("data", (c) => {
    console.log(chalk.yellow(`[process::stderr] ${c.toString()}`));
  });

  electronApp.on("window", async (page) => {
    const filename = page.url()?.split("/").pop();
    console.log(`Window opened: ${filename}`);
    // capture errors
    page.on("pageerror", (error) => {
      console.error(error);
    });
    // capture console messages
    page.on("console", (msg) => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  console.log(`Closing electron application`);
  await electronApp.close();
});

test.describe(`General context render `, () => {
  test("should run application with Kratos name", async () => {
    const appInformation = await electronApp.evaluate(async ({ app }) => {
      // This runs in the main Electron process, parameter here is always
      // the result of the require('electron') in the main app script.
      return { name: app.getName(), version: app.getVersion() };
    });

    expect(appInformation.name).toBe("Kratos");
  });
});

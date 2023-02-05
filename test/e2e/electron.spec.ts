import { test, expect } from "@playwright/test";
import { _electron as electron } from "playwright";

const launchApp = electron.launch({
  args: ["."],
  env: { ...process.env, NODE_ENV: "testing" },
  cwd: process.cwd(),
});

test("should successfully launch application", async () => {
  /**
   * Run application
   */
  const app = await launchApp;
  // Expect the app to have a name Kratos
  const appName = await app.evaluate(({ app }) => {
    return app.getName();
  });

  expect(appName).toBe("Kratos");
  /**
   * Then close it
   */
  await app.close();
});

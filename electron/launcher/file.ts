import path from "path";
import { app } from "electron";
import fse from "fs-extra";

/**
 * An absolute app user data path.
 *
 * @returns the appData which electron provided or path.join(process.cwd(), process.env.TEST_OUTPUT || ".test_output") for test
 */
export function getLauncherAppPath() {
  return process.env.NODE_ENV === "test"
    ? path.join(process.cwd(), process.env.TEST_OUTPUT || ".test_output")
    : path.join(path.join(app.getPath("appData"), app.name));
}

export function setupUserDataPath() {
  if (!fse.existsSync(getLauncherAppPath())) {
    fse.mkdirSync(getLauncherAppPath(), { recursive: true });
  }
}

/**
 * Get setting directory path name
 * @returns a setting directory path name
 */
export function getSettingPath() {
  return path.join(getLauncherAppPath(), "settings");
}

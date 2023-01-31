import path from "path";
import { app } from "electron";

/**
 * An absolute app data path.
 *
 * @returns the appData which electron provided or path.join(process.cwd(), process.env.TEST_OUTPUT || ".test_output") for test
 */
export function getAppDataPath() {
  return process.env.NODE === "test"
    ? path.join(process.cwd(), process.env.TEST_OUTPUT || ".test_output")
    : app.getPath("appData");
}

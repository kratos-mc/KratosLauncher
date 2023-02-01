import path from "path";
import { app } from "electron";

/**
 * An absolute app user data path.
 *
 * @returns the appData which electron provided or path.join(process.cwd(), process.env.TEST_OUTPUT || ".test_output") for test
 */
export function getUserDataPath() {
  return process.env.NODE_ENV === "test"
    ? path.join(process.cwd(), process.env.TEST_OUTPUT || ".test_output")
    : app.getPath("userData");
}

import { expect } from "chai";
import { getUserDataPath } from "../file";
import { isMacos, isWindows } from "../platform";

describe("launcher file", () => {
  it("should response an app user data ", () => {
    // expect(getAppDataPath()).to.includes(isMacos() ? "Application Support" : isWindows() ? "");
    expect(getUserDataPath()).to.not.be.undefined;
  });
});

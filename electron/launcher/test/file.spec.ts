import fse from "fs-extra";
import { expect } from "chai";
import { getUserDataPath, setupUserDataPath } from "../file";
import { isMacos, isWindows } from "../platform";

describe("launcher file", () => {
  it("should response an app user data ", () => {
    // expect(getAppDataPath()).to.includes(isMacos() ? "Application Support" : isWindows() ? "");
    expect(getUserDataPath()).to.not.be.undefined;
  });

  it("should setup user app data works", () => {
    expect(() => {
      setupUserDataPath();
    }).not.to.throws();
    expect(fse.existsSync(getUserDataPath())).to.be.true;
  });
});

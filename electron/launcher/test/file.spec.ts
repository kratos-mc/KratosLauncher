import fse from "fs-extra";
import { expect } from "chai";
import { getLauncherAppPath, getSettingPath, setupUserDataPath } from "../file";

describe("launcher file", () => {
  it("should response an app user data ", () => {
    // expect(getAppDataPath()).to.includes(isMacos() ? "Application Support" : isWindows() ? "");
    expect(getLauncherAppPath()).to.not.be.undefined;
  });

  it("should setup user app data works", () => {
    expect(() => {
      setupUserDataPath();
    }).not.to.throws();
    expect(fse.existsSync(getLauncherAppPath())).to.be.true;
  });

  it(`should includes settings in setting directory`, () => {
    expect(getSettingPath()).to.include("settings");
  });
});

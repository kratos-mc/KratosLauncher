import { expect } from "chai";
import { getSettingsFileName, hasSettingsFile } from "../settings";

describe(`Settings`, () => {
  it(`should includes settings.json inside path`, () => {
    expect(getSettingsFileName()).to.includes("settings.json");
  });

  it(`should hasSettingsFile return false`, () => {
    expect(hasSettingsFile()).to.be.false;
  });
});

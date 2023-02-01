import { JsonConfiguration } from "./../JsonConfiguration";
import { expect } from "chai";
import { createDuplexFromFileName } from "../JsonDuplex";
import path from "path";
import { getLauncherAppPath } from "../../launcher/file";
import fse from "fs-extra";

interface SettingsConfiguration {
  versions: number;
}

const defaultSettingConfiguration: SettingsConfiguration = {
  versions: 1,
};

describe("JsonConfiguration", () => {
  it(`should generate configuration object`, () => {
    const configurationPath = path.join(getLauncherAppPath(), "settings.json");

    const configuration = new JsonConfiguration(
      createDuplexFromFileName(configurationPath),
      defaultSettingConfiguration
    );

    expect(configuration).not.to.be.undefined;
    expect(configuration.configuration).to.not.be.undefined;
    expect(configuration.configuration.get("versions")).to.eq(1);

    // Assign the memory configuration
    configuration.set("versions", 5);
    expect(configuration.configuration.get("versions")).to.eq(5);

    configuration.set("versions", "string");
    expect(configuration.configuration.get("versions")).to.eq("string");
    expect(configuration.getConfigurationMap().get("versions")).to.be.eq(
      "string"
    );
    expect(configuration.get("versions")).to.be.eq("string");

    // console.log(configuration.configuration);
  });

  it("should throws exception", () => {
    const configurationPath = path.join(getLauncherAppPath(), "__.json");
    expect(() => {
      const _ = new JsonConfiguration(
        createDuplexFromFileName(configurationPath),
        undefined
      );
    }).to.throws(/The file has not exist and/);
  });

  it("should coverage double load (first load store data)", () => {
    const configurationPath = path.join(getLauncherAppPath(), "___.json");
    const config1 = new JsonConfiguration(
      createDuplexFromFileName(configurationPath),
      defaultSettingConfiguration
    );

    expect(config1).not.to.be.undefined;

    const config2 = new JsonConfiguration(
      createDuplexFromFileName(configurationPath),
      defaultSettingConfiguration
    );

    expect(config2).not.to.be.undefined;
    expect(config2.configuration).not.to.be.undefined;
    expect(fse.existsSync(configurationPath)).to.be.true;
  });
});

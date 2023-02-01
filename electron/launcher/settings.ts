import { JsonConfiguration } from "./../file/JsonConfiguration";
import fse from "fs-extra";

import path from "path";
import { getSettingPath } from "./file";
import { createDuplexFromFileName } from "../file/JsonDuplex";

/**
 * A setting file name which is a combination from
 *  a setting path and `settings.json`
 * @returns a setting file name
 */
export function getSettingsFileName(): fse.PathLike {
  return path.join(getSettingPath(), `settings.json`);
}

export function hasSettingsFile(): boolean {
  return fse.existsSync(getSettingsFileName());
}

export function readSettingsFile() {
  return fse.readJsonSync(getSettingsFileName(), { encoding: "utf-8" });
}

export function setupSettingPath() {
  if (!fse.existsSync(getSettingPath())) {
    fse.mkdirSync(getSettingPath(), { recursive: true });
  }
}

const DefaultSettings = {
  autoUpdate: true,
};

export class SettingsJsonConfiguration extends JsonConfiguration {
  constructor() {
    super(createDuplexFromFileName(getSettingsFileName()), DefaultSettings);
  }
}

let settingsConfiguration: SettingsJsonConfiguration | undefined;

export function getSettingsConfiguration() {
  if (settingsConfiguration === undefined) {
    settingsConfiguration = new SettingsJsonConfiguration();
  }
  return settingsConfiguration;
}

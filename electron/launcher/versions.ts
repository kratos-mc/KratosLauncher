import path from "path";
import { getLauncherAppPath } from "./file";
import fse from "fs-extra";

export function getVersionsPath() {
  return path.join(getLauncherAppPath(), "versions");
}

export function hasVersionsPath() {
  return fse.existsSync(getVersionsPath());
}

export function setupVersionsPath() {
  if (!fse.existsSync(getVersionsPath())) {
    fse.mkdirSync(getVersionsPath(), { recursive: true });
  }
}

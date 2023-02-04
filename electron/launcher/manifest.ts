import fse from "fs-extra";
import needle from "needle";
import path from "path";
import { getVersionsPath } from "./versions";
import log from "electron-log";

export type MinecraftSemver = string | "latest" | "latest_snapshot";

export interface ManifestLatest {
  release: MinecraftSemver;
  snapshot: MinecraftSemver;
}

export interface ManifestGameVersion {
  id: MinecraftSemver;
  type: "old_alpha" | "old_beta" | "release" | "snapshot";
  url: string;
  time: Date;
  releaseTime: Date;
  sha1: string;
  complianceLevel: number;
}

export interface ManifestResponse {
  latest: ManifestLatest;
  versions: ManifestGameVersion[];
}

export class ManifestSearchEngine {
  private gameVersionMap: Map<MinecraftSemver, ManifestGameVersion> = new Map();
  private latestRelease: MinecraftSemver;
  private latestSnapshot: MinecraftSemver;

  constructor(response: ManifestResponse) {
    const listOfVersions = response.versions;
    for (const version of listOfVersions) {
      this.gameVersionMap.set(version.id, version);
    }

    this.latestRelease = response.latest.release;
    this.latestSnapshot = response.latest.snapshot;
  }

  public get(versionId: MinecraftSemver) {
    return this.gameVersionMap.get(versionId);
  }

  public has(versionId: MinecraftSemver) {
    return this.gameVersionMap.has(versionId);
  }

  public getLatestRelease() {
    return this.latestRelease;
  }

  public getLatestSnapshot() {
    return this.latestSnapshot;
  }
}

async function fetchManifestFromServer() {
  return (
    await needle(
      "get",
      "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"
    )
  ).body as ManifestResponse;
}

// export function hasGameVersionManifestFile(): boolean {
//   return fse.existsSync()
// }

export function getManifestFileName() {
  return path.join(getVersionsPath(), `version_manifest_v2.json`);
}

let globalManifestSearchEngine: ManifestSearchEngine | undefined = undefined;

export async function resolveManifest() {
  if (globalManifestSearchEngine) {
    log.log(`Manifest has already cached, using from memory`);
    return globalManifestSearchEngine;
  }
  // If the version dir is not exists
  if (!fse.pathExistsSync(getVersionsPath())) {
    throw new Error(`Unable to load parent directory ${getVersionsPath()}`);
  }

  let manifestResponse: ManifestResponse;
  try {
    // const response
    manifestResponse = await fetchManifestFromServer();
    log.log(
      `Successfully get mc version manifest from server, jat down to ${getManifestFileName()}`
    );
    fse.writeJSONSync(getManifestFileName(), manifestResponse);
  } catch (err) {
    log.log(`Found error when fetching version manifest from server`);
    log.error(err);
    log.log(`Trying to use local manifest file if possible`);

    if (!fse.existsSync(getManifestFileName())) {
      throw new Error(
        "Unable to get manifest file from both server and local."
      );
    }
    manifestResponse = fse.readJsonSync(getManifestFileName());
  }
  // Cache into memory for next use
  log.log(`Caching the manifest search engine into memory`);
  globalManifestSearchEngine = new ManifestSearchEngine(manifestResponse);

  return globalManifestSearchEngine;
}

export function getGlobalManifest() {
  return globalManifestSearchEngine;
}

export async function resetManifestCache() {
  globalManifestSearchEngine = undefined;
}

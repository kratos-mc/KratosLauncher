import { v4 } from "uuid";
import { JsonDuplex } from "./../file/JsonDuplex";
import fse from "fs-extra";
import {
  getGlobalManifest,
  ManifestSearchEngine,
  MinecraftSemver,
} from "./manifest";
import path from "path";
import { getLauncherAppPath } from "./file";

/**
 * Get a profile file name.
 *
 * @returns a profile file name
 */
export function getProfileFileName() {
  return path.join(getLauncherAppPath(), "profiles.json");
}

export interface ProfileItem {
  /**
   * A unique id (UUID) of the items
   */
  uid: string;
  name: string;
  minecraftVersion: MinecraftSemver;
}

export interface LauncherProfile {
  items: ProfileItem[];
}

export function hasProfileFile() {
  return fse.existsSync(getProfileFileName());
}

export class ProfileManager {
  private static duplex: JsonDuplex<LauncherProfile> = new JsonDuplex(
    getProfileFileName()
  );

  constructor() {}

  /**
   * Test whether or not the duplex file (profile file name) is existed.
   * @returns true if the profile file was created, false otherwise.
   */
  public static isExistProfileFile() {
    return this.duplex.hasFile();
  }

  /**
   * Create a profile as default settings if the file is not existed.
   *
   * Silently do nothing if the file was existed.
   */
  public static setupDefaultProfile() {
    // Make a file as default file if the file was not existed
    if (!this.isExistProfileFile()) {
      const profile: LauncherProfile = {
        items: [
          {
            uid: v4(),
            name: "Latest",
            minecraftVersion: "latest",
          },
        ],
      };

      console.log(`Writing default profile version `);
      // Store the object above onto disk as json file
      fse.writeJsonSync(getProfileFileName(), profile);
    }
  }

  /**
   * Get the launcher profile which stored from file.
   *
   * @returns a launcher profile from stored file
   * @throws if the profile file is not existed
   */
  public static getProfileFromFile() {
    if (!this.isExistProfileFile()) {
      throw new Error(
        "The profile file is not existed, should run setupDefaultProfile to generate a default profile."
      );
    }
    return fse.readJsonSync(getProfileFileName()) as LauncherProfile;
  }

  /**
   * Write a launcher profile into disk.
   *
   * @param launcherProfile a launcher profile to store into a file
   */
  public static storeProfile(launcherProfile: LauncherProfile) {
    fse.writeJsonSync(getProfileFileName(), launcherProfile);
  }
}

export class ProfileStorage {
  private profileMap: Map<string, ProfileItem> = new Map();
  private globalManifest: ManifestSearchEngine;
  constructor(profile: LauncherProfile) {
    const _globManifest = getGlobalManifest();
    if (!_globManifest) {
      throw new Error(
        `Global manifest has not loaded. Should call resolveManifest before load profile storage.`
      );
    }

    this.globalManifest = _globManifest;

    if (!profile) {
      throw new Error("Profile cannot be undefined.");
    }

    for (const profileItem of profile.items) {
      const profileItemParsed = {
        ...profileItem,
        minecraftVersion:
          profileItem.minecraftVersion === "latest"
            ? // If the minecraftVersion field was latest, get latest release from manifest
              this.globalManifest?.getLatestRelease()
            : //Otherwise, if the minecraftVersion was latest snapshot, get latest snapshot from manifest
            profileItem.minecraftVersion === "latest_snapshot"
            ? this.globalManifest?.getLatestSnapshot()
            : // Or using the minecraftVersion from data
              profileItem.minecraftVersion,
      };

      //  Test the minecraft version id
      this.assertMinecraftVersion(profileItemParsed.minecraftVersion);

      this.profileMap.set(profileItem.uid, profileItemParsed);
    }
  }

  private assertMinecraftVersion(version: MinecraftSemver, message?: string) {
    if (!this.globalManifest.has(version)) {
      throw new Error(message || `Invalid minecraft version ${version}`);
    }
  }

  /**
   * Get all profile items contains inside profile map.
   *
   * @returns a new array from profile map value entries
   */
  public getAllProfileItems(): ProfileItem[] {
    return Array.from(this.profileMap.values());
  }

  /**
   * Get a profile from it uid, the profile could be undefined.
   *
   * @param uid a profile uid to get
   * @returns a profile item if exists, undefined otherwise.
   */
  public getProfileFromUid(uid: string): ProfileItem | undefined {
    return this.profileMap.get(uid);
  }

  /**
   * Get a list of profile what match with the provided minecraft version parameter.
   * Using the linear search algorithm to iterate all over the profile map value entries.
   *
   * @param minecraftVersion a minecraft version to search
   * @returns a list of ProfileItem, which match with the minecraftVersion
   */
  public getProfileFromMinecraftVersion(
    minecraftVersion: MinecraftSemver
  ): ProfileItem[] {
    const response = [];
    for (const item of this.profileMap.values()) {
      if (item.minecraftVersion === minecraftVersion) {
        response.push(item);
      }
    }
    return response;
  }

  /**
   * Add profile item into storage map. If a provided item
   * contains non-existed minecraft version which assert from
   * version manifest, throws an Error.
   *
   * @param item a profile item to add into storage
   */
  public createProfileItem(item: ProfileItem) {
    this.assertMinecraftVersion(item.minecraftVersion);
    if (item.name === undefined) {
      throw new Error(`Profile name cannot be undefined`);
    }

    if (item.uid === undefined) {
      throw new Error(`Profile uid cannot be undefined`);
    }

    if (this.getProfileFromUid(item.uid) !== undefined) {
      throw new Error(`Uid conflict ${item.uid}`);
    }

    this.profileMap.set(item.uid, item);
  }

  /**
   * Remove a profile with uid out of storage map.
   * If the uid has not existed, throws an Error.
   *
   * @param uid a profile uid to remove
   */
  public removeProfileItem(uid: string) {
    if (!this.getProfileFromUid(uid)) {
      throw new Error(`Profile with uid ${uid} not found.`);
    }

    this.profileMap.delete(uid);
  }

  /**
   * Turns a profile map into launcher profile object by iterating
   * over the profile value and construct an item array, then return
   * with a LauncherProfile interface.
   *
   * NOTE: return an object, not a json string.
   *
   * @returns a launcher profile contains all items from profile map
   */
  public toLauncherProfile(): LauncherProfile {
    const items = [];
    for (const item of this.profileMap.values()) {
      items.push(item);
    }

    return { items };
  }
}

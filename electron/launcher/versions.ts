import path from "path";
import { getLauncherAppPath } from "./file";
import fse from "fs-extra";
import { isMacos, isLinux, isWindows } from "./platform";
import arch from "arch";
import os from "os";

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

export type GameVersionAction = "allow" | "disallow";

export interface GameVersionGameArguments {
  rules: [
    {
      action: GameVersionAction;
      features: { has_custom_resolution: boolean } | { is_demo_user: boolean };
    }
  ];
  value: string | [string];
}

export interface GameBundleInfo {
  sha1: string;
  size: number;
  url: string;
}

export interface GameVersionJvmArguments {
  rules: [
    {
      action: GameVersionAction;
      os: GameVersionOperatingSystem;
    }
  ];
  value: string | [string];
}

export interface GameVersionLibrary {
  downloads?: GameVersionLibraryDownloads;
  name?: string;
  rules?: GameVersionLibraryRule[];
}

export interface GameVersionLibraryDownloads {
  artifact: GameVersionLibraryArtifact;
}

export interface GameVersionLibraryArtifact {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface GameVersionLibraryRule {
  action: GameVersionAction;
  os?: GameVersionOperatingSystem;
}

export type GameVersionOperatingSystemName = "osx" | "linux" | "windows";
export type GameVersionOperatingSystemArch = "x64" | "x86";
export interface GameVersionOperatingSystem {
  name?: GameVersionOperatingSystemName;
  version?: RegExp | string;
  arch?: GameVersionOperatingSystemArch;
}

export interface GameVersionResponse {
  arguments: {
    game: [string | GameVersionGameArguments];
    jvm: [string | GameVersionJvmArguments];
  };

  assetIndex: {
    id: string;
    sha1: string;
    size: number;
    totalSize: number;
    url: string;
  };

  assets: string | number;
  complianceLevel: string;

  downloads: {
    client: GameBundleInfo;
    client_mappings: GameBundleInfo;
    server: GameBundleInfo;
    server_mappings: GameBundleInfo;
  };

  id: string;
  javaVersion: {
    component: string;
    majorVersion: number;
  };

  libraries: GameVersionLibrary[];
  logging: {
    client: {
      argument: string;
      file: {
        id: string;
        sha1: string;
        size: number;
        url: string;
      };
      type: string | "log4j2-xml";
    };
  };

  mainClass: string;
  minimumLauncherVersion: number;
  releaseTime: Date;
  time: Date;
  type: "release" | "snapshot" | "old_alpha";
}

/**
 * The library rules are only contains operation system information
 * to classify the library. Since need to filter the
 * operating system and its' action.
 */
export class GameVersionLibraryRuleFilter {
  public static accept(
    rule: GameVersionLibraryRule,
    osName: GameVersionOperatingSystemName,
    archName: GameVersionOperatingSystemArch
  ): boolean {
    // Determine operating system that affect on the rule
    let isAcceptRuleOperatingSystem: boolean = false;
    if (rule.os) {
      // Accept the platform name first
      let isExactPlatform = !rule.os.name
        ? // If the rule has not assign to any operating system, then return true
          true
        : // Determine the current operating system
          rule.os.name === osName;

      // Validate operating system version
      let isVersionMatch = !rule.os.version
        ? true
        : testWithRegExp(rule.os.version, os.platform());

      // Validate architecture
      let isValidateArch = !rule.os.arch ? true : archName === rule.os.arch;

      // F(a, b, c) = a.b.c: due to my Boolean Algebra class :)
      isAcceptRuleOperatingSystem =
        isExactPlatform && isVersionMatch && isValidateArch;
    }

    return isAcceptRuleOperatingSystem && rule.action === "allow";
  }
}

export class GameVersionParser {
  private response: GameVersionResponse;
  private osName: GameVersionOperatingSystemName;
  private archName: GameVersionOperatingSystemArch;
  constructor(
    response: GameVersionResponse,
    osName: GameVersionOperatingSystemName,
    archName: GameVersionOperatingSystemArch
  ) {
    this.response = response;
    this.osName = osName;
    this.archName = archName;
  }

  public getAcceptedLibraries() {
    const acceptedLibraries = [];
    for (let i = 0; i < this.response.libraries.length; i++) {
      const library = this.response.libraries[i];

      // Non-conditional case
      if (!library.rules) {
        acceptedLibraries.push(library);
        continue;
      }

      // Accept all rules, mean the library is allow to use
      if (
        library.rules.every((rule) =>
          GameVersionLibraryRuleFilter.accept(rule, this.osName, this.archName)
        )
      ) {
        acceptedLibraries.push(library);
      }
    }

    return acceptedLibraries;
  }
}

/**
 * Test a string by using RegExp pattern. Using RegExp.test to test with.
 *
 * @param regexpPattern a RegExp pattern , can take string or JavaScript RegExp value
 * @param string a string to test against
 * @returns true if the string is match to pattern, false otherwise
 */
export function testWithRegExp(
  regexpPattern: string | RegExp,
  string: string
): boolean {
  const _reg = new RegExp(regexpPattern);
  return _reg.test(string);
}

export function fromNodePlatformToPlatform(
  nodePlatform: NodeJS.Platform
): GameVersionOperatingSystemName {
  switch (nodePlatform) {
    case "darwin": {
      return "osx";
    }
    case "linux": {
      return "linux";
    }
    case "win32": {
      return "windows";
    }
    default:
      throw new Error("Unsupported platform " + nodePlatform + ".");
  }
}

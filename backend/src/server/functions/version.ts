import { readFileSync } from "fs";

class Helper {
  private static versionCache = JSON.parse(
    readFileSync(__dirname + "/../../../package.json", "utf8")
  ).version;

  static get version(): string {
    return Helper.versionCache;
  }

  static get versionString(): string {
    return "Version " + version;
  }
}

export const version = Helper.version;
export const versionString = Helper.versionString;

export const version = "0.13.4";

class Helper {
  static get versionString(): string {
    return "Version " + version;
  }
}

export const versionString = Helper.versionString;

export const version = "0.3.0";

class Helper {
  static get versionString(): string {
    return "Version " + version;
  }
}

export const versionString = Helper.versionString;

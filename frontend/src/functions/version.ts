export const version = "0.2.2";

class Helper {
  static get versionString(): string {
    return "Version " + version;
  }
}

export const versionString = Helper.versionString;

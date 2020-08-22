export { version } from "../../package.json";
import { version } from "../../package.json";

class Helper {
  static get versionString(): string {
    return `Version ${version}`;
  }

  static get shortVersionString(): string {
    return `v${version}`;
  }
}

export const versionString = Helper.versionString;
export const shortVersionString = Helper.shortVersionString;

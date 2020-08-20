export { version } from "../../package.json";
import { version } from "../../package.json";

class Helper {
  static get versionString(): string {
    return `Version ${version}`;
  }
}

export const versionString = Helper.versionString;

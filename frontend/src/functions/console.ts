import { isDevMode } from "@angular/core";
class _helper {
  static get log() {
    return isDevMode() ? console.log : (...nothing) => { };
  }
}
export const log = _helper.log;

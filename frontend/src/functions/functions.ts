import { isDevMode } from "@angular/core";

/**
 * Excludes the object representations of
 * the data from entering the stringified JSON
 */
export function fieldHider<T>(key: string, value: T): T | undefined {
  return key === "objects" ? undefined : value;
}

/**
 * Uses console.log to log a message, but only in development mode
 *
 * @param message The message to be logged
 * @param args Arguments to be passed
 */
function oldLog(message: any, ...args: any): void {
  if (isDevMode()) {
    console.groupCollapsed(message, ...args);

    // tslint:disable-next-line: no-console
    console.trace();

    console.groupEnd();
  }
}

class _helper {
  static get log() {
    return isDevMode() ? console.log : (...nothing) => {};
  }
}

export const log = _helper.log;

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
export function log(message: any, ...args: any): void {
  if (isDevMode()) {
    console.log(message, ...args);
  }
}

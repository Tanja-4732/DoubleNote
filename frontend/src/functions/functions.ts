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
    console.groupCollapsed(message, ...args);

    // tslint:disable-next-line: no-console
    console.trace();

    console.groupEnd();
  }
}

// log = function() {
//     var context = "My Descriptive Logger Prefix:";

//     return Function.prototype.bind.call(console.log, console, context);
// }();

// log("This is a test...");

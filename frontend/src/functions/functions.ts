import { sha256 } from "js-sha256";

/**
 * Excludes the object representations of
 * the data from entering the stringified JSON
 */
export function fieldHider<T>(key: string, value: T): T | undefined {
  return key === "objects" ? undefined : value;
}

export const hash = (value: any) => sha256(JSON.stringify(value, fieldHider));

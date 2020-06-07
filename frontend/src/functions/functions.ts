/**
 * Excludes the object representations of
 * the data from entering the stringified JSON
 */
export function fieldHider<T>(key: string, value: T): T | undefined {
  return key === "objects" ? undefined : value;
}

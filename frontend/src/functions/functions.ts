import { sha256 } from "js-sha256";

/**
 * Excludes the object representations of
 * the data from entering the stringified JSON
 */
export function fieldHider<T>(key: string, value: T): T | undefined {
  return key === "objects" ? undefined : value;
}

export const hash = (value: any) => sha256(JSON.stringify(value, fieldHider));

export function deleteAll(): void {
  window.localStorage.removeItem("dn.bcp.notebooks");
  window.localStorage.removeItem("dn.bcp.commits");
  window.localStorage.removeItem("dn.bcp.trees");
  window.localStorage.removeItem("dn.bcp.pages");
  window.localStorage.removeItem("dn.bcp.boxes");
  window.location.reload();
}

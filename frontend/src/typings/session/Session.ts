import { LocalSession } from "./LocalSession";
import { RemoteSession } from "./RemoteSession";

export type Session = LocalSession | RemoteSession;

export interface BaseSession {
  /**
   * The type of session
   */
  type: "local" | "remote";
}

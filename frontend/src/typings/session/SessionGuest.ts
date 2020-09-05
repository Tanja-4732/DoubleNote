import { SessionMember } from "./SessionMember";

export interface SessionGuest extends SessionMember {
  /**
   * A one-time password to join the session
   */
  joinCode: string;

  /**
   * If the peer has authorized themselves yet
   */
  authorized: boolean;
}

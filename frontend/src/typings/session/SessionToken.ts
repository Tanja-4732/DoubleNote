export interface SessionToken {
  /**
   * The UUID of the peer being invited
   */
  guestUuid: string;

  /**
   * A one-time password to join the session
   */
  joinCode: string;

  /**
   * If the peer has authorized themselves yet
   */
  authorized: boolean;
}

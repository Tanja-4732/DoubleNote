export interface SessionToken {
  /**
   * The UUID of the peer being invited
   */
  guestUuid: string;

  /**
   * A one-time password to join the session
   */
  joinCode: string;
}

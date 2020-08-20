/**
 * A connection opportunity to another peer
 *
 * Every contact with a currently
 * established connection is considered a peer
 */
export interface Contact {
  /**
   * The UUID of the contact
   */
  uuid: string;

  /**
   * The chosen name for the contact
   */
  name: string;
}

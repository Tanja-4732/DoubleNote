import { Contact } from "../core/Contact";

export interface SessionMember {
  /**
   * The contact representation of the peer to which to connect to
   */
  contact: Contact;

  /**
   * The connection with the peer
   */
  connection: {
    /**
     * The state of this connection
     *
     * |Value|Description|
     * |:-|:-|
     * |`disconnected`|No connection is (being) established|
     * |`connecting`|Attempting to establish a connection|
     * |`connected`|A connection is established|
     */
    state: "disconnected" | "connecting" | "connected";

    /**
     * A promise which resolves when a connection is established
     */
    connectPromise: Promise<void>;

    /**
     * The `connectPromise` resolve callback
     */
    resolver: ((_?: unknown) => void) | null;
  };
}

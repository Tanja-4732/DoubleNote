import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";

/**
 * # MessageBusService
 *
 * This service allows the application to operate in real-time with peers.
 * It allows for dispatching messages, and observing incoming ones.
 *
 * ## Goals
 *
 * - Represent the user as a peer
 * - Connect to other peers
 * - Accept incoming messages from anywhere within the application
 * - Forward messages to all connected peers
 * - Accept incoming messages from all connected peers
 * - Deliver messages the parts of the application which need them
 */
@Injectable({
  providedIn: "root"
})
export class MessageBusService {
  /**
   * This PeerJS peer represents the current user
   *
   * It is the "me" in the peer to peer network
   */
  private static myself: Peer;

  /**
   * This is the primary subject for dispatching messages
   *
   * When a event occurs, it should be dispatched using this subject.
   */
  private static dispatchSubject = new ReplaySubject();

  /**
   * A list of all open connections to other peers
   */
  private static peerConnections: { [uuid: string]: DataConnection } = {};

  constructor() {
    if (MessageBusService.myself == null) {
      // Create a peer representing myself
      MessageBusService.myself = new Peer(v4());

      // Handle disconnects by attempting to reconnect
      MessageBusService.myself.on("disconnected", () =>
        // Reconnect to the signaling server
        MessageBusService.myself.reconnect()
      );

      // Handle incoming connections
      MessageBusService.myself.on("connection", connection =>
        MessageBusService.handleIncomingConnection(connection)
      );
    }
  }

  private static handleIncomingConnection(connection: DataConnection) {
    // TODO implement this method

    // Wait for the connection to be established
    connection.on("open", () =>
      // Prepare the new connection
      MessageBusService.prepareNewConnection(connection)
    );
  }

  private static prepareNewConnection(connection: DataConnection) {
    // TODO implement this method

    // Add the connection to the list of connections
    MessageBusService.peerConnections[connection.peer] = connection;

    // Handle incoming messages
    connection.on("data", message =>
      MessageBusService.handleIncomingMessage(message)
    );
  }

  private static handleIncomingMessage(message: Message) {
    // TODO Implement this method
  }

  public connectToPeer(uuid: string) {
    // Check if we are already connected to the peer
    if (MessageBusService.peerConnections.hasOwnProperty(uuid)) {
      // Don't connect
      return;

      // TODO Maybe throw an error instead
    }

    /**
     * The peer to which we have connected to
     */
    const connection = MessageBusService.myself.connect(uuid, {
      reliable: true,
      label: uuid
    });

    // Wait for the connection to be established
    connection.on("open", () =>
      // Prepare the new connection
      MessageBusService.prepareNewConnection(connection)
    );
  }

  public dispatchMessage(message: Message) {
    MessageBusService.dispatchSubject.next(message);
  }
}

/**
 * A message is the smallest unit of information which can be sent to other peers
 *
 * Any event modifying the shared state of the application or its data needs to be treated as a message.
 * Some UI-events might not need to be treated as messages, such as opening or closing the sidenav.
 */
export interface Message {
  // TODO Implement this interface
}

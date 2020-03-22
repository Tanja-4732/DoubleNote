import { Injectable } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";
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
   * The messages in this subject are either incoming ones or have been broadcast already.
   */
  private static readonly messageSubject = new ReplaySubject<Message>();

  /**
   * The observable containing all messages
   */
  private static readonly messageObservable = MessageBusService.messageSubject.asObservable();

  /**
   * A list of all open connections to other peers
   */
  private static readonly peerConnections: DataConnection[] = [];

  /**
   * The UUID my this client used to connect to other peers
   */
  public get myUuid(): string {
    return MessageBusService.myself.id;
  }

  /**
   * The observable containing all messages
   */
  public get messageStream(): Observable<Message> {
    return MessageBusService.messageObservable;
  }

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

  /**
   * This method handles incoming connections.\
   * It's the callback for the on "connection" event
   */
  private static handleIncomingConnection(connection: DataConnection) {
    // Wait for the connection to be established
    connection.on("open", () =>
      // Prepare the new connection
      MessageBusService.prepareNewConnection(connection)
    );
  }

  /**
   * Prepares new connections:
   *
   * - Register an event handler for incoming data
   * - Add to the list of connections
   */
  private static prepareNewConnection(connection: DataConnection) {
    // Add the connection to the list of connections
    MessageBusService.peerConnections.push(connection);

    // Handle incoming messages
    connection.on("data", message =>
      MessageBusService.handleIncomingMessage(message)
    );
  }

  /**
   * Handles incoming messages, without sending them to others
   */
  private static handleIncomingMessage(message: Message) {
    // Send the message to the parts of the application which need it
    MessageBusService.messageSubject.next(message);
  }

  /**
   * Sends a message to all connected peers
   */
  private static broadcastMessage(message: Message) {
    for (const connection of MessageBusService.peerConnections) {
      connection.send(message);
    }
  }

  /**
   * Establishes a connection to a peer
   *
   * @param uuid The UUID of the peer to connect to
   */
  public connectToPeer(uuid: string) {
    // Check if we are already connected to the peer
    if (MessageBusService.peerConnections.some(c => c.peer === uuid)) {
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

  /**
   * The entry point for messages into the MessageBus
   *
   * @param message The message to be handled
   */
  public dispatchMessage(message: Message) {
    // Send the message to all connected peers
    MessageBusService.broadcastMessage(message);

    // Send the message to the parts of the application which need it
    MessageBusService.messageSubject.next(message);
  }
}

/**
 * A message is the smallest unit of information which can be sent to other peers
 *
 * Any event modifying the shared state of the application or its data needs to be treated as a message.
 * Some UI-events might not need to be treated as messages, such as opening or closing the sidenav.
 */
export interface Message {
  /**
   * The UUID of the peer who is responsible for this message
   */
  authorUuid: string;

  /**
   * An ISO date representing the  moment in time of this message's creation
   */
  creationDate: string;
}

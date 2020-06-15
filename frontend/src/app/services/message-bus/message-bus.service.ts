import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";
import { Message } from "../../../typings/core/Message";
import { SettingsService } from "../settings/settings.service";
import { Contact } from "src/typings/core/contact";
import { log } from "src/functions/console";

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
  providedIn: "root",
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
  private static readonly messageSubject = new Subject<Message>();

  /**
   * The observable containing all messages
   */
  private static readonly messageObservable = MessageBusService.messageSubject.asObservable();

  /**
   * A list of all open connections to other peers
   */
  private static readonly peerConnections: DataConnection[] = [];

  /**
   * My own contact
   *
   * This represents the contact of the user
   */
  private readonly me = MessageBusService.prepareMe();

  public get myName(): string {
    return this.me.name;
  }

  public set myName(name: string) {
    this.me.name = name;
    localStorage.setItem("dn.contacts.me", JSON.stringify(this.me));
  }

  public get myUuid(): string {
    return this.me.uuid;
  }

  private readonly offlineModeSubscription;

  /**
   * A list of all known contacts
   */
  public contacts: Contact[] =
    JSON.parse(localStorage.getItem("dn.contacts.others")) ?? [];

  private static prepareMe(): Contact {
    let me: Contact = JSON.parse(localStorage.getItem("dn.contacts.me"));

    if (me === null) {
      me = { uuid: v4(), name: "" };
      localStorage.setItem("dn.contacts.me", JSON.stringify(me));
    }

    return me;
  }

  /**
   * The observable containing all messages
   */
  public get messageStream(): Observable<Message> {
    return MessageBusService.messageObservable;
  }

  constructor(private settings: SettingsService) {
    // if (!this.settings.offlineMode && MessageBusService.myself == null) { }

    this.offlineModeSubscription = this.settings.observable.subscribe(
      (offline) =>
        offline ? this.enableOfflineMode() : this.disableOfflineMode()
    );
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
    connection.on("data", (message) =>
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

  private enableOfflineMode() {
    log("Enabling offline mode");

    MessageBusService.myself?.destroy();
    MessageBusService.myself = null;
  }

  private disableOfflineMode() {
    log("Disabling offline mode");

    // Create a peer representing myself
    MessageBusService.myself = new Peer(this.me.uuid);

    // Handle disconnects by attempting to reconnect
    MessageBusService.myself.on("disconnected", () =>
      // Reconnect to the signaling server
      MessageBusService.myself.reconnect()
    );

    // Handle incoming connections
    MessageBusService.myself.on("connection", (connection) =>
      MessageBusService.handleIncomingConnection(connection)
    );

    log("Offline mode disabled");
  }

  public persistContacts(): void {
    localStorage.setItem("dn.contacts.others", JSON.stringify(this.contacts));
  }

  /**
   * Establishes a connection to a peer
   *
   * @param uuid The UUID of the peer to connect to
   */
  public connectToPeer(uuid: string) {
    // Check if the application is running in offline mode
    if (this.settings.offlineMode) {
      throw new Error("Operation not available in offline mode");
    }

    // Check if we are already connected to the peer
    if (MessageBusService.peerConnections.some((c) => c.peer === uuid)) {
      // Don't connect
      return;

      // TODO Maybe throw an error instead
    }

    /**
     * The peer to which we have connected to
     */
    const connection = MessageBusService.myself.connect(uuid, {
      reliable: true,
      label: uuid,
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
    // Send the message to the parts of the application which need it
    MessageBusService.messageSubject.next(message);

    // Check if the application is running in offline mode
    if (!this.settings.offlineMode) {
      // Send the message to all connected peers
      MessageBusService.broadcastMessage(message);
    }
  }

  /**
   * Checks, if a connection to a given UUID is established
   *
   * @param uuid The UUID to check
   */
  public isConnected(uuid: string): boolean {
    return MessageBusService.peerConnections.some((c) => c.label === uuid);
  }
}

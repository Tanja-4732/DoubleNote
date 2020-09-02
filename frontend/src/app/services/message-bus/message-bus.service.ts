import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import Peer, { DataConnection } from "peerjs";
import { v4 } from "uuid";
import {
  Message,
  SessionRequestType,
  SessionMessage,
} from "../../../typings/core/Message";
import { SettingsService } from "../settings/settings.service";
import { Contact } from "src/typings/core/Contact";
import { log } from "src/functions/console";
import { SessionService } from "../session/session.service";
import { SessionToken } from "src/typings/session/SessionToken";

/**
 * # MessageBusService
 *
 * This service allows the application to operate in real-time with peers.
 * It allows for dispatching messages, and observing incoming ones, as well as
 * joining the sessions of other peers and inviting them to join the local one.
 *
 * ## Goals
 *
 * - Represent the user as a peer
 * - Connect to other peers
 * - Accept incoming messages from anywhere within the application
 * - Forward messages to all connected peers
 * - Accept incoming messages from all connected peers
 * - Deliver messages the parts of the application which need them
 * - Manage connections using contacts
 *   - Joining remote sessions provided an invitation
 *   - Inviting others to collaboration in the local session
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

  /**
   * A list of all known contacts
   */
  public contacts: Contact[] =
    JSON.parse(localStorage.getItem("dn.contacts.others")) ?? [];

  private static prepareMe(): Contact {
    let me: Contact = JSON.parse(localStorage.getItem("dn.contacts.me"));

    if (me === null) {
      me = { uuid: v4(), name: "Myself" };
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
  }

  /**
   * This method handles incoming connections.\
   * It's the callback for the on "connection" event
   */
  private static handleIncomingConnection(connection: DataConnection) {
    // Check for a invitation for the incoming connection
    const invitation = SessionService.invitations.find(
      (invite) => invite.guestUuid === connection.peer
    );

    if (invitation !== undefined) {
      // Wait for the connection to be established
      connection.on("open", () =>
        // Prepare the new connection
        MessageBusService.prepareNewConnection(connection, invitation)
      );
    }
  }

  /**
   * Prepares new connections:
   *
   * - Register an event handler for incoming data
   * - Add to the list of connections
   */
  private static prepareNewConnection(
    connection: DataConnection,
    invitation: SessionToken
  ) {
    /**
     * The event handler for incoming messages from PeerJS
     *
     * Checks if the incoming message is authorized, and passes it to the
     * internal message handler if it is, otherwise it will attempt authorization
     * with the provided join code (if any), and allow future messages to be handled
     * by the internal message handler (in case of successful authorization).
     *
     * @param message The message to be handled
     */
    const handleMessageIfAuthorized = (message: Message) => {
      // Handle authorized messages
      if (invitation.authorized) {
        // TODO check if the message comes from who it claims to be from
        MessageBusService.handleIncomingMessage(message);
      } else if (
        message.messageType === "SessionMessage" &&
        message.requestType === SessionRequestType.JoinRemote
      ) {
        if (message.joinCode === invitation.joinCode) {
          MessageBusService.authorizePeer(connection, message.authorUuid);
          for (let i = 0; i < 10000; i = i + 1) {
            connection.send({
              messageType: "SessionMessage",
              authorUuid: this.myself.id,
              creationDate: new Date().toISOString(),

              requestType: SessionRequestType.JoinConfirmation,
            } as SessionMessage);
            log("Acknowledged join to guest peer");
          }
        } else {
          log("Rejected unauthorized join request from " + message.authorUuid);
        }
      } else {
        log("Rejected invalid join request from " + message.authorUuid);
      }
    };

    // Handle incoming messages
    connection.on("data", (message) => handleMessageIfAuthorized(message));
  }

  /**
   * Establishes an authorized connection with the peer
   */
  private static authorizePeer(
    connection: Peer.DataConnection,
    peerUuid: string
  ) {
    // Add the connection to the list of connections
    MessageBusService.peerConnections.push(connection);

    log("Accepted join request from " + peerUuid);
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

  public enableOfflineMode() {
    log("Enabling offline mode");

    MessageBusService.myself?.destroy();
    MessageBusService.myself = null;
  }

  public disableOfflineMode(): Promise<void> {
    log("Connecting to the peer server...");

    // Create a peer representing myself
    MessageBusService.myself = new Peer(this.me.uuid, {
      host: "peerjs-server.herokuapp.com",
      secure: true,
      port: 443,
    });

    return new Promise((resolve, reject) => {
      MessageBusService.myself.on("open", () => {
        log("Connected to the peer server");

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
        resolve();
      });
    });
  }

  public persistContacts(): void {
    localStorage.setItem("dn.contacts.others", JSON.stringify(this.contacts));
  }

  /**
   * Establishes a connection to a peer
   *
   * @param uuid The UUID of the peer to connect to
   */
  public connectToPeer(uuid: string): Promise<boolean> {
    // Check if the application is running in offline mode
    if (this.settings.offlineMode) {
      throw new Error("Operation not available in offline mode");
    }

    // Check if we are already connected to the peer
    if (MessageBusService.peerConnections.some((c) => c.peer === uuid)) {
      // Don't connect
      return;

      // TODO maybe throw an error instead
    }

    /**
     * The peer to which we have connected to
     */
    const connection = MessageBusService.myself.connect(uuid, {
      reliable: true,
      label: uuid,
    });

    return new Promise((resolve, reject) => {
      // Wait for the connection to be established
      connection.on("open", async () => {
        // Prepare the new connection
        MessageBusService.authorizePeer(connection, uuid);

        log("Connected now (2)");
        resolve(true);
      });
    });
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

  /**
   * Disconnects from a peer with a specified UUID
   *
   * @param uuid The UUID of the peer from which to disconnect from
   * @return True if the peer was disconnected from successfully, false otherwise
   */
  public disconnectByUuid(uuid: string): boolean {
    const i = MessageBusService.peerConnections.findIndex(
      (c) => c.peer === uuid
    );

    if (i === -1) {
      // Indicate a failed disconnection
      return false;
    } else {
      // Close the connection to the peer
      MessageBusService.peerConnections[i].close();

      // Remove the peer from the list of connected peers
      MessageBusService.peerConnections.splice(i, 1);

      // Indicate a successful disconnect
      return true;
    }
  }
}

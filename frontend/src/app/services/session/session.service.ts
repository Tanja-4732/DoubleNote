import { Injectable } from "@angular/core";
import { SettingsService } from "../settings/settings.service";
import { MessageBusService } from "../message-bus/message-bus.service";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  Message,
  SessionMessage,
  SessionRequestType,
} from "src/typings/core/Message";
import { log } from "src/functions/console";
import { BcpVcsService } from "../bcp-vcs/bcp-vcs.service";
import { Session } from "src/typings/session/Session";
import { SessionGuest } from "src/typings/session/SessionGuest";
import { Contact } from "src/typings/core/Contact";
import { Resolver } from "src/typings/session/Resolver";

export const INVITE_REQUIRES_LOCAL_SESSION =
  "Issuing invites requires a local session";

export const REVOKE_REQUIRES_LOCAL_SESSION =
  "Revoking invites requires a local session";

export const NO_SUCH_PEER = "The specified peer was not found";

/**
 * # Session Service
 *
 * Used to manage sessions and their states
 *
 * ## Goals
 *
 * - Provide an interface for listing, storing and retrieving all notebooks
 *   - Refactor the application to use the session service instead of calling the VCS services directly
 *   - Implement APIs for both BCP and SBP components and services
 *   - Listen for save messages from the MessageBus
 *   - Download and upload notebooks to and from peers to establish shared sessions
 * - Outside code should be mostly agnostic to the session owner
 *   - Allow the pre-existing code to interface with local and remote notebooks
 * - Manage permissions
 *   - Read/Write control
 *   - Shared notebooks
 *   - Scoped access (sub-notebook)
 */
@Injectable({
  providedIn: "root",
})
export class SessionService {
  private sessionStatePrivate: Session = {
    type: "local",
    shares: [],
    guests: [],
  };

  public get sessionState() {
    return this.sessionStatePrivate;
  }

  private messageStreamSub: Subscription;

  constructor(
    private bcpVcs: BcpVcsService,
    private settings: SettingsService,
    private mbs: MessageBusService
  ) {
    this.messageStreamSub = this.mbs.messageStream
      .pipe(filter((m: Message) => m.messageType === "SessionMessage"))
      .subscribe((message) => this.handleMessage(message as SessionMessage));
  }

  /**
   * Allows a peer to join the local session
   *
   * Creates and returns a session token, which will be then added to the allowed
   * tokens list. This method will not start listening for incoming connections.
   *
   * @param uuid The UUID of the peer to invite to the local session
   * @return The generated, now authorized session token
   */
  public async autorizeInvite(contact: Contact): Promise<SessionGuest> {
    // Only invite peers in a local session
    if (this.sessionStatePrivate.type !== "local") {
      throw new Error(INVITE_REQUIRES_LOCAL_SESSION);
    }

    // Prepare the connection promise
    const { connectPromise, resolver } = this.makePromise();

    /**
     * The new token
     */
    const guest: SessionGuest = {
      contact,
      connection: {
        state: "disconnected",
        connectPromise,
        resolver,
      },
      joinCode: this.makeJoinCode(9),
      authorized: false,
    };

    // Append the token to the lists
    this.sessionStatePrivate.guests.push(guest);

    // Disable the offline mode if required
    await this.updateOfflineMode();

    // Allow the guest to connect
    MessageBusService.addAllowedGuest(guest);

    // Return the generated token
    return guest;
  }

  /**
   * Revokes the invitation of a peer from the local session (if any)
   *
   * @param uuid The UUID of the peer to be revoked access to the local session
   * @return True, if the peer access was revoked, false if there was no such peer
   */
  public revokeInvite(contact: Contact): boolean {
    // Only revoke invites in a local session
    if (this.sessionStatePrivate.type !== "local") {
      throw new Error(INVITE_REQUIRES_LOCAL_SESSION);
    }

    // Find the authorization, if any
    const i = this.sessionStatePrivate.guests.findIndex(
      (guest) => guest.contact.uuid === contact.uuid
    );

    // Check if the authorization exists
    if (i === -1) {
      // Return false if not
      return false;
    }

    // Remove the authorization from the list
    const guest = this.sessionStatePrivate.guests.splice(i, 1);

    // Disallow the guest to connect
    MessageBusService.removeAllowedGuest(guest[0]);

    // Disconnect the MessageBusService from the peer
    this.mbs.disconnectByUuid(contact.uuid);

    // Enable the offline mode if required
    this.updateOfflineMode();

    // Return trues
    return true;
  }

  /**
   * Generates a pseudo-random join code with the length specified
   *
   * @param length The amount of digits to be generated
   * @return The generated pseudo-random join code
   */
  private makeJoinCode(length: number): string {
    let joinCode = "";

    for (let i = 0; i < length; i++) {
      joinCode += Math.floor(Math.random() * 9);
    }

    return joinCode;
  }

  /**
   * Update the offline mode
   */
  private async updateOfflineMode() {
    if (
      !this.settings.offlineMode &&
      (this.sessionState.type === "remote" ||
        (this.sessionState.type === "local" &&
          this.sessionState.guests.length > 0))
    ) {
      await this.mbs.disableOfflineMode();
    } else {
      this.mbs.enableOfflineMode();
    }
  }

  /**
   * Handles incoming session messages
   *
   * @param message The incoming SessionMessage
   */
  private handleMessage(message: SessionMessage): void {
    // Ignore self-authored messages
    if (message.authorUuid !== this.mbs.myUuid) {
      switch (message.requestType) {
        case SessionRequestType.JoinRemote:
          // no-op: This has been moved to the MessageBusService
          break;

        case SessionRequestType.LeaveRemote:
          // TODO handle other peers leaving the local session
          break;

        case SessionRequestType.RevokeInvite:
          // TODO handle other peers revoking access to remote sessions
          break;

        // When we are a guest and the host confirms
        case SessionRequestType.JoinConfirmation:
          // Make sure this is a remote session
          if (this.sessionStatePrivate.type !== "remote") {
            return;
          }

          log("Got the acceptance");

          this.sessionStatePrivate.host.connection.state = "connected";
          this.sessionStatePrivate.host.connection.resolver();

          // Tell the host that we are connected
          this.mbs.dispatchMessage({
            messageType: "SessionMessage",
            authorUuid: this.mbs.myUuid,
            creationDate: new Date().toISOString(),

            requestType: SessionRequestType.InviteAcceptConfirm,
          });

          break;

        // When we are the host and someone joins
        case SessionRequestType.InviteAcceptConfirm:
          // Make sure this is a local session
          if (this.sessionStatePrivate.type !== "local") {
            return;
          }

          const peer = this.sessionStatePrivate.guests.find(
            (g) => g.contact.uuid === message.authorUuid
          );

          if (peer === undefined) {
            throw new Error(NO_SUCH_PEER);
          }

          peer.connection.state = "connected";
          peer.connection.resolver();

          break;

        default:
          log("Could not handle session message:");
          log(message);
          break;
      }
    }
  }

  /**
   * Attempts to join a remote session given a peer UUID and a one-time code
   *
   * @param uuid The UUID of the peer owning the session to join
   * @param code The one-time code to join the remote session
   */
  public async attemptJoin(contact: Contact, code: string) {
    // Remove the two spaces, in case they were provided
    if (code.length === 11) {
      code = code.replace(" ", "").replace(" ", "");
    }

    // Log the join attempt
    log(`Joining peer ${contact.name} (${contact.uuid}) with code ${code}`);

    // Prevent the host from reading the local data
    this.bcpVcs.unloadData();

    // Prepare the connection promise
    const { connectPromise, resolver } = this.makePromise();

    // Set the state
    this.sessionStatePrivate = {
      type: "remote",
      host: {
        contact,
        connection: { state: "connecting", connectPromise, resolver },
      },
    };

    // Connect to the peer server (if required)
    await this.updateOfflineMode();

    // Establish a peer connection with the host
    await this.mbs.connectToPeer(contact.uuid);

    // Authenticate using the one-time code
    this.mbs.dispatchMessage({
      messageType: "SessionMessage",
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),

      requestType: SessionRequestType.JoinRemote,
      joinCode: code,
    });

    return this.sessionStatePrivate.host;
  }

  /**
   * Generates a new Promise and returns it together with its `resolve` method
   */
  private makePromise(): {
    connectPromise: Promise<void>;
    resolver: Resolver;
  } {
    let resolver!: Resolver;
    const connectPromise = new Promise<void>(
      (resolve, _) => (resolver = resolve)
    );

    return { connectPromise, resolver };
  }

  /**
   * Disconnects the user from a remote session
   */
  public async leaveRemoteSession() {
    if (
      this.sessionStatePrivate.type === "remote" &&
      this.mbs.disconnectByUuid(this.sessionStatePrivate.host.contact.uuid)
    ) {
      // Reset the session state
      this.sessionStatePrivate = {
        type: "local",
        shares: [],
        guests: [],
      };

      // Disconnect from the peer server if a connection is no longer required
      await this.updateOfflineMode();

      // Load the local data
      this.bcpVcs.loadDataFromLocalStorage();
    }
  }
}

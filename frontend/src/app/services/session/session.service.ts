import { Injectable } from "@angular/core";
import { SessionToken } from "src/typings/session/SessionToken";
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
import { promise } from "protractor";
import { BcpVcsService } from "../bcp-vcs/bcp-vcs.service";

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
  /**
   * The list of invited UUIDs in the form of session tokens
   */
  public static readonly invitations: SessionToken[] = [];

  /**
   * The state of the session management
   *
   * Can one of the following:
   * - Local (we are the host of our own session)
   * - Remote (we are a guest in the session of another peer)
   * - Joining (we are attempting to join another peers session)
   */
  private sessionState: "local" | "remote" | "joining" = "local";

  public get state() {
    return this.sessionState;
  }

  private messageStreamSub: Subscription;

  private joinRemotePromiseResolveCB;
  private acceptInvitePromiseResolveCB;

  constructor(
    private bcpVcs: BcpVcsService,
    private settings: SettingsService,
    private mbs: MessageBusService
  ) {
    this.messageStreamSub = this.mbs.messageStream
      .pipe(filter((m: Message) => m.messageType === "SessionMessage"))
      .subscribe((message: SessionMessage) => this.handleMessage(message));
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
  public async autorizeInviteByUuid(guestUuid: string): Promise<SessionToken> {
    /**
     * The new token
     */
    const sessionToken: SessionToken = {
      guestUuid,
      joinCode: this.makeJoinCode(9),
      authorized: false,
    };

    // Append the token to the lists
    SessionService.invitations.push(sessionToken);

    // Disable the offline mode if required
    await this.updateOfflineMode();

    // Return the generated token
    return sessionToken;
  }

  /**
   * Revokes the invitation of a peer from the local session (if any)
   *
   * @param uuid The UUID of the peer to be revoked access to the local session
   * @return True, if the peer access was revoked, false if there was no such peer
   */
  public revokeInviteByUuid(uuid: string): boolean {
    // Find the authorization, if any
    const i = SessionService.invitations.findIndex(
      (token) => token.guestUuid === uuid
    );

    // Check if the authorization exists
    if (i === -1) {
      // Return false if not
      return false;
    }

    // Remove the authorization from the list
    SessionService.invitations.splice(i, 1);

    // Disconnect the MessageBusService from the peer
    this.mbs.disconnectByUuid(uuid);

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
      (this.sessionState !== "local" || SessionService.invitations.length > 0)
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
  private handleMessage(message: SessionMessage) {
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

        case SessionRequestType.JoinConfirmation:
          log("Got the acceptance");

          this.sessionState = "remote";
          if (this.joinRemotePromiseResolveCB !== undefined) {
            this.joinRemotePromiseResolveCB();
            this.joinRemotePromiseResolveCB = undefined;
          }

          this.mbs.dispatchMessage({
            messageType: "SessionMessage",
            authorUuid: this.mbs.myUuid,
            creationDate: new Date().toISOString(),

            requestType: SessionRequestType.InviteAcceptConfirm,
          });

          break;

        case SessionRequestType.InviteAcceptConfirm:
          if (this.acceptInvitePromiseResolveCB !== undefined) {
            this.acceptInvitePromiseResolveCB();
            this.acceptInvitePromiseResolveCB = undefined;
          }
          break;

        default:
          log("Could not handle session message:");
          log(message);
          break;
      }
    }
  }

  /**
   * Handles incoming join messages from peers attempting to join the local session
   *
   * @deprecated // TODO remove this method in a later version
   */
  private handleIncomingJoinRequest(message: SessionMessage) {
    // Confirm the join
    this.mbs.dispatchMessage({
      messageType: "SessionMessage",
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),

      requestType: SessionRequestType.JoinConfirmation,
    });
  }

  /**
   * Attempts to join a remote session given a peer UUID and a one-time code
   *
   * @param uuid The UUID of the peer owning the session to join
   * @param code The one-time code to join the remote session
   */
  public async attemptJoinByUuid(uuid: string, code: string) {
    // Remove the two spaces, in case they were provided
    if (code.length === 11) {
      code = code.replace(" ", "").replace(" ", "");
    }

    // Log the join attempt
    log("Joining peer " + uuid + " with code " + code);

    // Prevent the host from reading the local data
    this.bcpVcs.unloadData();

    // Set the session state to joining
    this.sessionState = "joining";

    // Connect to the peer server (if required)
    await this.updateOfflineMode();

    // Establish a peer connection with the host
    await this.mbs.connectToPeer(uuid);

    // Authenticate using the one-time code
    this.mbs.dispatchMessage({
      messageType: "SessionMessage",
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),

      requestType: SessionRequestType.JoinRemote,
      joinCode: code,
    });
  }

  public waitForRemoteJoinConfirmation() {
    return new Promise((resolve, reject) => {
      this.joinRemotePromiseResolveCB = resolve;
    });
  }

  public waitForInviteAcceptConfirmation() {
    return new Promise((resolve, reject) => {
      this.acceptInvitePromiseResolveCB = resolve;
    });
  }
}

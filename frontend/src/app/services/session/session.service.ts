import { Injectable } from "@angular/core";
import { SessionToken } from "src/typings/session/SessionToken";
import { SettingsService } from "../settings/settings.service";
import { MessageBusService } from "../message-bus/message-bus.service";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { Message, SessionMessage } from "src/typings/core/Message";

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
  private readonly invitations: SessionToken[] = [];

  /**
   * The subscription to the offline mode observable from the SettingsService
   */
  private readonly offlineModeSubscription;

  /**
   * If the user has joined a remote session
   *
   * @deprecated // TODO change this in the future
   */
  private joinedRemoteSession = false;

  private messageStreamSub: Subscription;

  constructor(
    private settings: SettingsService,
    private mbs: MessageBusService
  ) {
    // this.offlineModeSubscription = this.settings.offlineModeObservable.subscribe(
    //   (offline) =>
    //     offline ? mbs.enableOfflineMode() : mbs.disableOfflineMode()
    // );
    this.offlineModeSubscription = this.settings.offlineModeObservable.subscribe(
      () => this.updateOfflineMode()
    );

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
  public autorizeInviteByUuid(guestUuid: string): SessionToken {
    /**
     * The new token
     */
    const sessionToken: SessionToken = {
      guestUuid,
      joinCode: this.makeJoinCode(9),
    };

    // Append the token to the lists
    this.invitations.push(sessionToken);

    // Disable the offline mode if required
    this.updateOfflineMode();

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
    const i = this.invitations.findIndex((token) => token.guestUuid === uuid);

    // Check if the authorization exists
    if (i === -1) {
      // Return false if not
      return false;
    }

    // Remove the authorization from the list
    this.invitations.splice(i, 1);

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
  private updateOfflineMode() {
    if (
      !this.settings.offlineMode &&
      (this.joinedRemoteSession || this.invitations.length > 0)
    ) {
      this.mbs.disableOfflineMode();
    } else {
      this.mbs.enableOfflineMode();
    }
  }

  private handleMessage(message: SessionMessage) {}
}

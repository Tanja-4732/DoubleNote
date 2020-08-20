import { Injectable } from "@angular/core";

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
 * - Outside code should be mostly agnostic to the session owner
 *   - Allow the pre-existing code to interface with local and remote notebooks
 * - Manage connections using contacts
 *   - Joining remote sessions provided an invitation
 *   - Inviting others to collaboration in the local session
 * - The MessageBusService
 *   - Move the contacts here from the MessageBusService
 *   - Move establishing connections here from the MessageBusService
 *   - Maybe keep the dispatch of messages in the MessageBusService...
 *   - ...or maybe remove the MessageBusService (and use this instead)
 */
@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor() {}
}

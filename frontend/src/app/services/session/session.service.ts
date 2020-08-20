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
 */
@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor() {}
}

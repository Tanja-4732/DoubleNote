import { Router } from "express";
import { API } from "./api/api";
import { Files } from "./files";

/**
 * The routes of the application
 */
export class Routes {
  /**
   * The main router of the application
   */
  public router = Router();

  /**
   * The main API router of the application
   */
  private api = new API();

  /**
   * The file serving router of the application
   */
  private files = new Files();

  /**
   * Configures the main router
   */
  constructor() {
    // Mount the API
    this.router.use("/api", this.api.router);

    // Everything else should be served from the file system
    this.router.use(this.files.router);
  }
}

import { Request, Response, Router } from "express";
import { AuthInfo } from "../../../../typings/AuthInfo";

export class Auth {
  /**
   * The AuthV1 API router of the application
   */
  public router = Router();

  /**
   * Configures the Auth v1 API router
   */
  constructor() {
    // Mount the auth info endpoint
    this.router.get("/info", (req, res) => this.authInfo(req, res));
  }

  private authInfo = (req: Request, res: Response) => {
    /**
     * The information on the available authentication methods
     */
    const info: AuthInfo = { supportedStrategies: [] };

    res.json(info);
  };
}

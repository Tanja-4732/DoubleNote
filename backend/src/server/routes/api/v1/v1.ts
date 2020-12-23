import { Router, Request, Response } from "express";
import { version } from "../../../functions/version";
import { Auth } from "./Auth";

export class V1 {
  /**
   * The V1 API router of the application
   */
  public router = Router();

  /**
   * The v1 auth API
   */
  private auth = new Auth();

  /**
   * Configures the V1 API router
   */
  constructor() {
    // Mount the greeting endpoint
    this.router.use("/", (req, res) => this.greeting(req, res));

    // Mount the auth API
    this.router.use("/auth", this.auth.router);
  }

  private greeting = (req: Request, res: Response) => {
    res.json({
      serverVersion: version,
      date: new Date().toISOString(),
      message: "DoubleNote API v1",
    });
  };
}

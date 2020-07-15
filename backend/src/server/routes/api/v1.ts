import { Router, Request, Response } from "express";
import { version } from "../../functions/version";

export class V1 {
  /**
   * The V1 API router of the application
   */
  public router = Router();

  /**
   * Configures the V1 API router
   */
  constructor() {
    // Mount the greeting endpoint
    this.router.use("/", (req, res) => this.greeting(req, res));
  }

  private greeting = (req: Request, res: Response) => {
    res.json({
      serverVersion: version,
      date: new Date().toISOString(),
      message: "DoubleNote API v1",
    });
  };
}

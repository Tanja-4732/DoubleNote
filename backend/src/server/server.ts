import Express from "express";
import { Routes } from "./routes/routes";
import { log } from "console";

export class Server {
  /**
   * The internal Express server
   */
  private server = Express();

  /**
   * Creates a new server instance for the application
   *
   * @param config The config for the server
   */
  constructor(
    private config: ServerConfig = {
      mode: ServerModes.http_only,
      ports: { http: 80, https: 443 }
    }
  ) {
    // Configure the routes
    this.server.use(new Routes().router);
  }

  /**
   * Start the server according to its config
   */
  start = () => {
    switch (this.config.mode) {
      case ServerModes.http_only:
        this.startHttpServer();
        break;

      case ServerModes.https_only:
        this.startHttpsServer();
        break;

      case ServerModes.both:
        this.startHttpServer();
        this.startHttpsServer();
        break;

      case ServerModes.redirect:
        this.startHttpsServer();
        this.startRedirectServer();
        break;
    }
  };

  /**
   * Starts the HTTP server
   */
  private startHttpServer = () => {
    this.server.listen(this.config.ports.http);
    log(`HTTP server listening on port ${this.config.ports.http}`);
  };

  /**
   * Starts the HTTPS server
   */
  private startHttpsServer = () => {
    // TODO implement the HTTPS server
  };

  /**
   * Starts the HTTP redirect server
   */
  private startRedirectServer = () => {
    // TODO implement the redirect server
  };
}

/**
 * The config for the server
 */
export interface ServerConfig {
  ports: {
    http: number;
    https: number;
  };

  mode: ServerModes;
}

/**
 * The modes the server can operate in
 */
export enum ServerModes {
  /**
   * Only provide access via HTTP
   */
  "http_only",

  /**
   * Only provide access via HTTPS
   */
  "https_only",

  /**
   * Provide access via HTTP and HTTPS
   */
  "both",

  /**
   * Provide access via HTTPS and redirect HTTP to HTTPS
   */
  "redirect"
}

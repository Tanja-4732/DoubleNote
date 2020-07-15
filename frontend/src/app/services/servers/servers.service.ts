import { Injectable } from "@angular/core";
import { Server } from "src/typings/core/Server";
import { HttpClient } from "@angular/common/http";
import { log } from "src/functions/console";
import { LocationStrategy } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class ServersService {
  public servers: Server[] =
    JSON.parse(localStorage.getItem("dn.servers")) ?? [];

  public persistServers(): void {
    localStorage.setItem("dn.servers", JSON.stringify(this.servers));
  }

  constructor(
    private http: HttpClient,
    private locationStrategy: LocationStrategy
  ) {}

  public async probeServer(url: string): Promise<boolean> {
    let response;

    try {
      response = await this.http.get(url).toPromise();
    } catch (error) {
      return false;
    }

    return !!(response?.apiVersions?.length > 0);
  }

  /**
   * Attempts to add the server serving the application
   */
  public async tryAddOrigin(): Promise<"added" | "exists" | "unavailable"> {
    /**
     * The URL of the server which will be added
     */
    const apiUrl = this.getApiUrl();

    // Check, if the server is already added
    if (this.servers.some((server) => server.apiUrl === apiUrl)) {
      return "exists";
    }

    const result = await this.probeServer(apiUrl);

    if (!result) {
      return "unavailable";
    } else {
      this.servers.push({
        name: window.origin,
        addedOn: new Date().toISOString(),
        apiUrl,
      });

      this.persistServers();

      return "added";
    }
  }

  /**
   * Generates and returns the API URL for the current host.
   *
   * This does not guarantee that the server provides an API.
   */
  public getApiUrl(): string {
    const baseHref = this.locationStrategy.getBaseHref();

    return (
      window.origin +
      baseHref +
      (baseHref.charAt(baseHref.length - 1) === "/" ? "" : "/") +
      "api"
    );
  }
}

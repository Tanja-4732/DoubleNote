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

  get baseHref(): string {
    return this.locationStrategy.getBaseHref();
  }

  constructor(
    private http: HttpClient,
    private locationStrategy: LocationStrategy
  ) {}

  /**
   * Checks if a URL is a valid DoubleNote API-providing server
   *
   * @param url The API URL to be probed
   */
  public async probeServer(url: string): Promise<boolean> {
    try {
      return (
        (await this.http.get<any>(url).toPromise())?.apiVersions?.length > 0
      );
    } catch (error) {
      return false;
    }
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
    return (
      window.origin +
      this.baseHref +
      (this.baseHref.charAt(this.baseHref.length - 1) === "/" ? "" : "/") +
      "api"
    );
  }
}

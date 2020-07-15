import { Component, OnInit } from "@angular/core";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";
import { ServersService } from "src/app/services/servers/servers.service";
import { Server } from "src/typings/core/Server";
import { log } from "src/functions/console";

@Component({
  selector: "app-servers",
  templateUrl: "./servers.component.html",
  styleUrls: ["./servers.component.scss"],
})
export class ServersComponent implements OnInit {
  get servers(): Server[] {
    return this.serversService.servers;
  }

  public originServerStatus: "added" | "exists" | "unavailable" | "working" =
    "working";

  constructor(private serversService: ServersService) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        title: "Servers",
        icon: Icons.Server,
      },
    ];

    this.serversService
      .tryAddOrigin()
      .then((result) => (this.originServerStatus = result));
  }
}

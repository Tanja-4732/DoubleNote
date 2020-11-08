import { Component, OnInit } from "@angular/core";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";
import { ServersService } from "src/app/services/servers/servers.service";
import { Server } from "src/typings/core/Server";
import { log } from "src/functions/console";
import {
  ConfirmDialogInput,
  ConfirmDialogOutput,
  ConfirmDialogComponent,
} from "src/app/box-canvas-page/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";

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

  constructor(
    private dialog: MatDialog,
    private serversService: ServersService
  ) {}

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

  deleteServer(server: Server) {
    const data: ConfirmDialogInput = {
      heading: "Remove server?",
      body:
        `Do you want to remove the server "${server.name}"?\n` +
        `There won't be an undo button.\n\nAre you sure you want to continue?`,
      cancel: {
        color: "primary",
        text: "Cancel",
      },
      confirm: {
        color: "warn",
        text: "Remove",
      },
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: ConfirmDialogOutput) => {
      if (result?.result) {
        this.serversService.removeServer(server);
      }
    });
  }

  openEditServerDialog(server: Server) {
    // TODO implement openEditServerDialog
  }

  openPushDialog(server: Server) {
    // TODO implement openPushDialog
  }

  openPullDialog(server: Server) {
    // TODO implement openPullDialog
  }
}

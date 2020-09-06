import { Component, OnInit, Input } from "@angular/core";
import { Notebook } from "src/typings/core/Notebook";
import { MatDialog } from "@angular/material/dialog";
import {
  NotebookDialogInput,
  NotebookDialogOutput,
  NotebookDialogComponent,
} from "../notebook-dialog/notebook-dialog.component";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { SbpVcsService } from "src/app/services/sbp-vcs/sbp-vcs.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ExportDialogComponent,
  ExportDialogInput,
  ExportDialogOutput,
} from "../export-dialog/export-dialog.component";
import { log } from "src/functions/console";
import { SessionService } from "src/app/services/session/session.service";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { SessionRequestType } from "src/typings/core/Message";
import { NotebookWrapper } from "src/typings/core/NotebookWrapper";

export const NOTEBOOK_OWNERSHIP_REQUIRED =
  "This operation requires owning the notebook";

export const CANNOT_REQUEST_LOCAL_NOTEBOOK =
  "Local notebooks cannot be requested";

@Component({
  selector: "app-notebook-card",
  templateUrl: "./notebook-card.component.html",
  styleUrls: ["./notebook-card.component.scss"],
})
export class NotebookCardComponent implements OnInit {
  @Input()
  notebook!: NotebookWrapper;

  public isRealNotebook!: boolean;

  public fetching = false;

  constructor(
    private mbs: MessageBusService,
    private session: SessionService,
    private bcpVcs: BcpVcsService,
    private sbpVcs: SbpVcsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isRealNotebook = !("writable" in this.notebook);
  }

  get typeString(): string {
    switch (this.notebook.type) {
      case "BCP":
        return "Box canvas page";

      case "SBP":
        return "Sequential block page";

      default:
        throw new Error("No such type");
    }
  }

  onEdit(): void {
    const data: NotebookDialogInput = {
      operation: "update",
      name: this.notebook.name,
    };

    const dialogRef = this.dialog.open(NotebookDialogComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result) => this.handleUpdate(result));
  }

  private handleUpdate(result: NotebookDialogOutput) {
    if ("writable" in this.notebook) {
      throw new Error(NOTEBOOK_OWNERSHIP_REQUIRED);
    }

    if (result?.confirmed && result.name) {
      switch (this.notebook.type) {
        case "BCP":
          this.bcpVcs.renameNotebook(this.notebook, result.name);
          break;

        case "SBP":
          throw new Error("Not implemented yet");

        case undefined:
          throw new Error("Something went wrong");
      }
    }
  }

  async onExport() {
    if ("writable" in this.notebook) {
      throw new Error(NOTEBOOK_OWNERSHIP_REQUIRED);
    }

    switch (this.notebook.type) {
      case "BCP":
        const data: ExportDialogInput = {
          jsonText: this.bcpVcs.exportNotebookFlat(this.notebook, false),
        };

        const dialogRef = this.dialog.open(ExportDialogComponent, {
          width: "350px",
          data,
        });

        const result: ExportDialogOutput | null = await dialogRef
          .afterClosed()
          .toPromise();

        if (result?.confirmed) {
          const newTab = window.open(result.url);

          // Null check
          if (newTab == null) {
            throw new Error("newTab is nullish");
          }

          window.addEventListener(
            "message",
            () => newTab.postMessage(this.notebook, newTab.origin),
            { once: true }
          );
        }

        break;

      case "SBP":
        throw new Error("Not implemented yet");

      case undefined:
        throw new Error("Something went wrong");
    }
  }

  public get shareNotebook() {
    if (this.session.sessionState.type !== "local") {
      return false;
    }

    return (
      this.session.sessionState.shares.find(
        (share) => share.uuid === this.notebook.uuid
      ) !== undefined
    );
  }

  public set shareNotebook(shareDesired) {
    if ("writable" in this.notebook) {
      throw new Error(NOTEBOOK_OWNERSHIP_REQUIRED);
    }

    if (this.session.sessionState.type !== "local") {
      return;
    }

    const i = this.session.sessionState.shares.findIndex(
      (s) => s.uuid === this.notebook.uuid
    );

    if ((i === -1) === shareDesired) {
      if (shareDesired) {
        // Mark the notebook as shared
        this.session.sessionState.shares.push({
          type: this.notebook.type,
          uuid: this.notebook.uuid,
          writable: true,
          name: this.notebook.name,
        });
      } else {
        // Mark the notebook as no longer shared
        this.session.sessionState.shares.splice(i, 1);
      }

      // Notify other peers about the change in availability
      this.mbs.dispatchMessage({
        messageType: "SessionMessage",
        authorUuid: this.mbs.myUuid,
        creationDate: new Date().toISOString(),

        requestType: SessionRequestType.SharesListing,
        shares: this.session.sessionState.shares,
      });
    }
  }

  get canShare() {
    return (
      this.session.sessionState.type === "local" &&
      this.session.sessionState.guests.length > 0
    );
  }

  public onRequestSharedNotebook() {
    if (!("writable" in this.notebook)) {
      throw new Error(CANNOT_REQUEST_LOCAL_NOTEBOOK);
    }

    log("Requesting notebook");

    // Notify other peers about the change in availability
    this.mbs.dispatchMessage({
      messageType: "SessionMessage",
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),

      requestType: SessionRequestType.NotebookRequest,
      uuidOfRequestedNotebook: this.notebook.uuid,
    });

    this.fetching = true;
  }
}

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
} from "../export-dialog/export-dialog.component";
import { log } from "src/functions/console";

@Component({
  selector: "app-notebook-card",
  templateUrl: "./notebook-card.component.html",
  styleUrls: ["./notebook-card.component.scss"],
})
export class NotebookCardComponent implements OnInit {
  @Input()
  notebook: Notebook;

  constructor(
    private bcpVcs: BcpVcsService,
    private sbpVcs: SbpVcsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

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

  onExport() {
    switch (this.notebook.type) {
      case "BCP":
        const data: ExportDialogInput = {
          jsonText: this.bcpVcs.exportNotebook(this.notebook),
        };

        const dialogRef = this.dialog.open(ExportDialogComponent, {
          width: "350px",
          data,
        });

        dialogRef.afterClosed().subscribe((result) => log(result));
        break;

      case "SBP":
        throw new Error("Not implemented yet");

      case undefined:
        throw new Error("Something went wrong");
    }
  }
}

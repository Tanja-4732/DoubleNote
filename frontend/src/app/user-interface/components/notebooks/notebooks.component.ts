import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  CrumbTrailComponent,
  Icon,
} from "../crumb-trail/crumb-trail.component";
import {
  NotebookDialogComponent,
  NotebookDialogOutput,
  NotebookDialogInput,
} from "../notebook-dialog/notebook-dialog.component";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { SbpVcsService } from "src/app/services/sbp-vcs/sbp-vcs.service";
import { Notebook } from "src/typings/core/Notebook";

@Component({
  selector: "app-notebooks",
  templateUrl: "./notebooks.component.html",
  styleUrls: ["./notebooks.component.scss"],
})
export class NotebooksComponent implements OnInit {
  constructor(
    private bcpVcs: BcpVcsService,
    private sbpVcs: SbpVcsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Notebooks,
        title: "Notebooks",
      },
    ];
  }

  get notebooks(): Notebook[] {
    return this.bcpVcs.notebooks.concat(this.sbpVcs.getNotebooks());
  }

  private handleCreate(result: NotebookDialogOutput) {
    if (result?.confirmed && result.name) {
      switch (result?.type) {
        case "BCP":
          this.bcpVcs.createNotebook(result.name);
          break;

        case "SBP":
          throw new Error("Not implemented yet");

        case undefined:
          throw new Error("Something went wrong");
      }
    }
  }

  openDialog(type: string): void {
    const data: NotebookDialogInput = { type, operation: "create" };

    const dialogRef = this.dialog.open(NotebookDialogComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result) => this.handleCreate(result));
  }
}

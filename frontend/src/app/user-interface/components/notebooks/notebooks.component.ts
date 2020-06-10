import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  CrumbTrailComponent,
  Icon,
} from "../crumb-trail/crumb-trail.component";
import {
  CreateNotebookComponent,
  DialogResult,
} from "../create-notebook/create-notebook.component";
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

  private handleResult(result: DialogResult) {
    if (result?.create && result.name) {
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
    const dialogRef = this.dialog.open(CreateNotebookComponent, {
      width: "350px",

      data: { type },
    });

    dialogRef.afterClosed().subscribe((result) => this.handleResult(result));
  }
}

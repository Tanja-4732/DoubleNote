import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NotebookService } from "src/app/services/notebook/notebook.service";
import {
  CrumbTrailComponent,
  Icon,
} from "../crumb-trail/crumb-trail.component";
import {
  CreateNotebookComponent,
  DialogResult,
} from "../create-notebook/create-notebook.component";
import { v4 } from "uuid";

@Component({
  selector: "app-notebooks",
  templateUrl: "./notebooks.component.html",
  styleUrls: ["./notebooks.component.scss"],
})
export class NotebooksComponent implements OnInit {
  constructor(public nbs: NotebookService, public dialog: MatDialog) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Notebook,
        title: "Notebooks",
      },
    ];
  }

  private handleResult(result: DialogResult) {
    if (result?.create && result.name) {
      this.nbs.notebooks.push({
        uuid: v4(),
        title: result.name,
        pages: [],
        type: result.type,
      });

      this.nbs.persist();
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

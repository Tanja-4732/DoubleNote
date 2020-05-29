import { Component, OnInit } from "@angular/core";
import { NotebookService } from "src/app/services/notebook/notebook.service";
import {
  CrumbTrailComponent,
  Icon,
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-notebooks",
  templateUrl: "./notebooks.component.html",
  styleUrls: ["./notebooks.component.scss"],
})
export class NotebooksComponent implements OnInit {
  constructor(public nbs: NotebookService) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Notebook,
        title: "Notebooks",
      },
    ];
  }
}

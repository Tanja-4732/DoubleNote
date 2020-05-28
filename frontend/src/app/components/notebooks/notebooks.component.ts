import { Component, OnInit } from "@angular/core";
import { NotebookService } from "src/app/services/notebook/notebook.service";

@Component({
  selector: "app-notebooks",
  templateUrl: "./notebooks.component.html",
  styleUrls: ["./notebooks.component.scss"],
})
export class NotebooksComponent implements OnInit {
  constructor(public nbs: NotebookService) {}

  ngOnInit(): void {}
}

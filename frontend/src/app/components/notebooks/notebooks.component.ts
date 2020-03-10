import { Component, OnInit } from "@angular/core";
import { NotebookService } from "src/app/services/notebook/notebook.service";
import { map } from "rxjs/operators";
import { interval } from "rxjs";

@Component({
  selector: "app-notebooks",
  templateUrl: "./notebooks.component.html",
  styleUrls: ["./notebooks.component.scss"]
})
export class NotebooksComponent implements OnInit {
  constructor(public nbs: NotebookService) {}

  notebooks$ = interval(1000);

  ngOnInit(): void {}
}

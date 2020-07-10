import { Component, OnInit } from "@angular/core";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-import",
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.scss"],
})
export class ImportComponent implements OnInit {
  public pastedJSON = "";

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        title: "Notebooks",
        icon: Icons.Notebooks,
        routerLink: "/notebooks",
      },
      {
        title: "Import notebook",
        icon: Icons.Import,
      },
    ];
  }

  public async pasteJSON() {
    this.pastedJSON = await navigator.clipboard.readText();
  }

  public get disableImport(): boolean {
    return this.pastedJSON === "";
  }

  public importNotebook() {
    if (this.disableImport) {
      throw new Error("Import not ready");
    }
  }
}

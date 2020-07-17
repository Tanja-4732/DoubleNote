import { Component, OnInit } from "@angular/core";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";
import { ActivatedRoute } from "@angular/router";
import { ServersService } from "src/app/services/servers/servers.service";
import { LocationStrategy } from "@angular/common";
import { log } from "src/functions/console";

@Component({
  selector: "app-import",
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.scss"],
})
export class ImportComponent implements OnInit {
  public pastedJSON: string;

  get baseHref(): string {
    return this.locationStrategy.getBaseHref();
  }

  get importUrl(): string {
    return (
      window.origin +
      this.baseHref +
      (this.baseHref.charAt(this.baseHref.length - 1) === "/" ? "" : "/") +
      "notebooks/import"
    );
  }

  constructor(
    private route: ActivatedRoute,
    private locationStrategy: LocationStrategy
  ) {
    this.pastedJSON = route.snapshot.params.notebookData ?? "";

    window.addEventListener("message", (event) => this.handleMessage(event));
    window.opener?.postMessage("ready", window.opener.origin);
  }

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

  private handleMessage(event: MessageEvent) {
    log(event);
  }
}

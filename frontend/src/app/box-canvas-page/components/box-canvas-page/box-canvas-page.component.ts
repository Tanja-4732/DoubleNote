import { Component, OnInit } from "@angular/core";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CrumbTrailComponent,
  Icon,
} from "src/app/user-interface/components/crumb-trail/crumb-trail.component";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { Notebook } from "src/typings/core/Notebook";
import { SbpVcsService } from "src/app/services/sbp-vcs/sbp-vcs.service";

@Component({
  selector: "app-box-canvas-page",
  templateUrl: "./box-canvas-page.component.html",
  styleUrls: ["./box-canvas-page.component.scss"],
})
export class BoxCanvasPageComponent implements OnInit {
  notebook: BcpNotebook;

  constructor(
    private bcpVcs: BcpVcsService,
    private sbpVcs: SbpVcsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const retrievedNotebook = this.notebooks.find(
      (notebook) => notebook.uuid === route.snapshot.params.notebookUuid
    );

    switch (retrievedNotebook?.type) {
      case "SBP":
        this.router.navigateByUrl("/notebooks/sbp/" + retrievedNotebook.uuid);
        break;
      case "BCP":
        this.notebook = retrievedNotebook;
        break;
      case undefined:
        this.router.navigateByUrl("/notebooks");
        return;
    }
  }

  get notebooks(): Notebook[] {
    return this.bcpVcs.notebooks.concat(this.sbpVcs.getNotebooks());
  }

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Notebooks,
        title: "Notebooks",
        routerLink: "/notebooks",
      },
      {
        icon: Icon.Notebook,
        title: this.notebook.name + " (BCP)",
      },
    ];
  }
}

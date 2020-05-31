import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import {
  CrumbTrailComponent,
  Icon,
} from "src/app/user-interface/components/crumb-trail/crumb-trail.component";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { Notebook } from "src/typings/core/Notebook";
import { SbpVcsService } from "src/app/services/sbp-vcs/sbp-vcs.service";

@Component({
  selector: "app-bcp-notebook",
  templateUrl: "./bcp-notebook.component.html",
  styleUrls: ["./bcp-notebook.component.scss"],
})
export class BcpNotebookComponent implements OnInit {
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
        icon: Icon.Notebook,
        title: "Notebooks",
        routerLink: "/notebooks",
      },
      {
        title: this.notebook.name + " (BCP)",
      },
    ];
  }
}

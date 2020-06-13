import { Component, OnInit } from "@angular/core";
import { SbpNotebook } from "src/typings/sbp/SbpNotebook";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CrumbTrailComponent,
  Icons,
} from "src/app/user-interface/components/crumb-trail/crumb-trail.component";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { SbpVcsService } from "src/app/services/sbp-vcs/sbp-vcs.service";
import { Notebook } from "src/typings/core/Notebook";

@Component({
  selector: "app-sbp-notebook",
  templateUrl: "./sbp-notebook.component.html",
  styleUrls: ["./sbp-notebook.component.scss"],
})
export class SbpNotebookComponent implements OnInit {
  // This will get implemented after BCP

  notebook: SbpNotebook;

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
      case "BCP":
        this.router.navigateByUrl("/notebooks/bcp/" + retrievedNotebook.uuid);
        break;
      case "SBP":
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
        icon: Icons.Notebook,
        title: "Notebooks",
        routerLink: "/notebooks",
      },
      {
        title: this.notebook.name + " (SBP)",
      },
    ];
  }
}

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
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import { CategoryTree } from "src/typings/bcp/CategoryTree";
import { log } from "src/functions/console";

@Component({
  selector: "app-box-canvas-page",
  templateUrl: "./box-canvas-page.component.html",
  styleUrls: ["./box-canvas-page.component.scss"],
})
export class BoxCanvasPageComponent implements OnInit {
  notebook: BcpNotebook;
  page: BoxCanvasPage;

  workingTitle: string;

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

    const retrievedPage = this.getPageByUuid(
      route.snapshot.params.pageUuid,
      this.notebook.objects.workingTree
    );

    if (retrievedPage === undefined) {
      this.router.navigateByUrl("/notebooks/sbp/" + this.notebook.uuid);
    } else {
      this.page = retrievedPage;
    }

    this.workingTitle = this.page.title;

    log(this.page);
  }

  // #region Setup
  /**
   * Recursively searches for a page
   * with a specified UUID in a given tree
   *
   * @param uuid The UUID to search for
   * @param tree The tree to search in
   */
  private getPageByUuid(
    uuid: string,
    tree: CategoryTree
  ): BoxCanvasPage | undefined {
    // Try all local pages
    for (const page of tree.objects.pages) {
      // Check for a match
      if (page.uuid === uuid) {
        return page;
      }
    }

    // Try all children recursively
    for (const child of tree.objects.children) {
      return this.getPageByUuid(uuid, child);
    }

    // If nothing was found, return undefined
    return undefined;
  }

  get notebooks(): Notebook[] {
    return this.bcpVcs.notebooks.concat(this.sbpVcs.getNotebooks());
  }
  // #endregion

  // #region Commit
  get disableCommit(): boolean {
    return (
      this.notebook.objects.head.strings.rootCategory ===
      this.notebook.strings.workingTree
    );
  }

  get commitText(): string {
    return this.disableCommit
      ? "Nothing to commit"
      : "Commit to " + this.notebook.strings.selectedBranch;
  }
  // #endregion

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
        routerLink: "/notebooks/bcp/" + this.notebook.uuid,
      },
      { icon: Icon.Page, title: this.page.title },
    ];
  }

  onSaveChanges(): void {
    log("Saving changes");
    this.page.title = this.workingTitle;
    this.bcpVcs.persistWorkingTree(this.notebook);
    this.ngOnInit();
  }

  onCommit(): void {
    this.bcpVcs.commitNotebook(this.notebook);
  }

  createNewBox(event: any): void {
    log("Creating new box");
    log(event);
  }
}

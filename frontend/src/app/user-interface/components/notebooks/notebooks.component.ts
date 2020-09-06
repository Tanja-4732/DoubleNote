import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";
import {
  NotebookDialogComponent,
  NotebookDialogOutput,
  NotebookDialogInput,
} from "../notebook-dialog/notebook-dialog.component";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { SbpVcsService } from "src/app/services/sbp-vcs/sbp-vcs.service";
import { Notebook } from "src/typings/core/Notebook";
import { SessionService } from "src/app/services/session/session.service";
import { Subscription } from "rxjs";
import { NotebookShare } from "src/typings/session/NotebookShare";
import { NotebookWrapper } from "src/typings/core/NotebookWrapper";

@Component({
  selector: "app-notebooks",
  templateUrl: "./notebooks.component.html",
  styleUrls: ["./notebooks.component.scss"],
})
export class NotebooksComponent implements OnInit, OnDestroy {
  private sharedNotebooksSubscription!: Subscription;

  public notebooks: NotebookWrapper[] = [];
  private sharesCache: NotebookShare[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private session: SessionService,
    private bcpVcs: BcpVcsService,
    private sbpVcs: SbpVcsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icons.Notebooks,
        title: "Notebooks",
      },
    ];

    this.sharedNotebooksSubscription = this.session.sharedNotebooksObservable.subscribe(
      (shares) => this.handleSharesUpdate(shares)
    );
  }

  ngOnDestroy(): void {
    this.sharedNotebooksSubscription.unsubscribe();
  }

  private handleSharesUpdate(shares?: NotebookShare[]) {
    if (shares === undefined) {
      shares = this.sharesCache;
    } else {
      this.sharesCache = shares;
    }

    const realNotebooks = this.bcpVcs.notebooks.concat(
      this.sbpVcs.getNotebooks()
    );

    const filteredShares = shares.filter(
      (share) => !realNotebooks.some((nb) => nb.uuid === share.uuid)
    );

    this.notebooks = realNotebooks.concat(filteredShares as any);

    this.cdr.detectChanges();
  }

  private handleCreate(result: NotebookDialogOutput) {
    if (result?.confirmed && result.name) {
      switch (result?.type) {
        case "BCP":
          this.bcpVcs.createNotebook(result.name);
          break;

        case "SBP":
          throw new Error("Not implemented yet");

        case undefined:
          throw new Error("Something went wrong");
      }
    }

    this.handleSharesUpdate();
  }

  openDialog(type: string): void {
    const data: NotebookDialogInput = { type, operation: "create" };

    const dialogRef = this.dialog.open(NotebookDialogComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result) => this.handleCreate(result));
  }
}

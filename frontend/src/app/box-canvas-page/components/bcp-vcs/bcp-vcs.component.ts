import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  BcpVcsService,
  WORKING_TREE_DIRTY,
} from "src/app/services/bcp-vcs/bcp-vcs.service";
import { environment } from "src/environments/environment";
import { log, error } from "src/functions/console";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import {
  CreateBranchComponent,
  DialogData,
  DialogResult,
} from "../create-branch/create-branch.component";
import { hash } from "src/functions/functions";
import { BcpTreeComponent } from "../bcp-tree/bcp-tree.component";
import { map, shareReplay } from "rxjs/operators";
import {
  ConfirmDialogOutput,
  ConfirmDialogInput,
  ConfirmDialogComponent,
} from "../confirm-dialog/confirm-dialog.component";
import { BranchHead } from "src/typings/core/Head";
import { SettingsService } from "src/app/services/settings/settings.service";
import { TabBehaviour } from "src/typings/settings/TabBehaviour";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { combineLatest, Observable } from "rxjs";

@Component({
  selector: "app-bcp-vcs",
  templateUrl: "./bcp-vcs.component.html",
  styleUrls: ["./bcp-vcs.component.scss"],
})
export class BcpVcsComponent implements OnInit {
  @Input()
  notebook!: BcpNotebook;

  private isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  get isDevMode(): boolean {
    return !environment.production;
  }

  /**
   * Determine if a tabbed layout should be used
   *
   * If never is specified, then cards will be used;
   * If always is specified, tabs will be used;
   * If responsive is specified, the screen width
   * will be used to determine the layout
   */
  get useTabbed$(): Observable<boolean> {
    return combineLatest([
      this.isHandset$,
      this.settings.tabBehaviourObservable,
    ]).pipe(
      map(([isHandset, preference]) =>
        preference === TabBehaviour.Responsive
          ? isHandset
          : preference === TabBehaviour.AlwaysUseTabs
      )
    );
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    public settings: SettingsService,
    public vcs: BcpVcsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  get disableCommit(): boolean {
    return (
      this.notebook.objects?.head.commit.strings.rootCategory ===
      this.notebook.strings.workingTree
    );
  }

  get disableCheckout(): boolean {
    return Object.keys(this.notebook.strings.branches).length <= 1;
  }

  get commitText(): string {
    return this.disableCommit ? "Nothing to commit" : "Commit changes";
  }

  get branchText(): string {
    return (this.notebook.objects?.head as BranchHead).name || "Detached";
  }

  calcDisableBranchButton(name: string): boolean {
    return (this.notebook.objects?.head as BranchHead).name !== name;
  }

  onCheckoutBranch(name: string): void {
    try {
      this.vcs.checkoutBranch(this.notebook, name);
      BcpTreeComponent.setDataSub.next();
    } catch (err) {
      if ((err as Error).message === WORKING_TREE_DIRTY) {
        const data: ConfirmDialogInput = {
          heading: "Force checkout?",
          body:
            "There are uncommitted changes in the working tree.\nA checkout to " +
            name +
            " would lead to the loss of this data.\n\nAre you sure you want to continue?",
          cancel: {
            color: "primary",
            text: "Cancel",
          },
          confirm: {
            color: "warn",
            text: "Force checkout",
          },
        };

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: "350px",
          data,
        });

        dialogRef.afterClosed().subscribe((result: ConfirmDialogOutput) => {
          if (result?.result) {
            this.vcs.checkoutBranch(this.notebook, name, true);
            BcpTreeComponent.setDataSub.next();
          }
        });
      } else {
        error(err);
      }
    }
  }

  onCreateBranch(): void {
    const data: DialogData = {
      currentCommit: this.notebook.strings.head,
      takenNames: Object.keys(this.notebook.strings.branches),
      notebookName: this.notebook.name,
    };

    const dialogRef = this.dialog.open(CreateBranchComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result) => this.handleResult(result));
  }

  onPush(): void {
    // TODO implement onPush
  }

  onPull(): void {
    // TODO implement onPull
  }

  onCreateTag(): void {
    const data: DialogData = {
      currentCommit: this.notebook.strings.head,
      takenNames: Object.keys(this.notebook.strings.branches),
      notebookName: this.notebook.name,
    };

    const dialogRef = this.dialog.open(CreateBranchComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result) => this.handleResult(result));
  }

  private handleResult(result: DialogResult) {
    if (result?.create && result.name) {
      this.vcs.createBranch(
        this.notebook,
        result.name,
        this.vcs.resolveHead(this.notebook.strings.head, this.notebook),
        true
      );
    }
  }

  onCommit(): void {
    this.vcs.commitNotebook(this.notebook);
  }

  resolveHead(head: string): string {
    return this.vcs.resolveHead(head, this.notebook);
  }

  debug(): void {
    log("Root tree at head commit");
    log(hash(this.notebook.objects?.head.commit.objects?.rootCategory));
    log(this.notebook.objects?.head.commit.objects?.rootCategory);
    log("");

    log("Working tree");
    log(hash(this.notebook.objects?.workingTree));
    log(this.notebook.objects?.workingTree);
    log("");

    // log("Root tree == working tree");
    // log(
    //   this.notebook.objects.head.objects.rootCategory ==
    //     this.notebook.objects.workingTree
    // );
    // log("");

    // log("Root tree === working tree");
    // log(
    //   this.notebook.objects.head.objects.rootCategory ===
    //     this.notebook.objects.workingTree
    // );
    // log("");

    // log("Disable the commit button?");
    // log(this.disableCommit);
  }
}

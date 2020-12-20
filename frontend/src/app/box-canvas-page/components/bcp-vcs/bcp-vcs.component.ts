import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { combineLatest, Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import {
  BcpVcsService,
  WORKING_TREE_DIRTY,
} from "src/app/services/bcp-vcs/bcp-vcs.service";
import { SettingsService } from "src/app/services/settings/settings.service";
import { environment } from "src/environments/environment";
import { error, log } from "src/functions/console";
import { hash } from "src/functions/functions";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { BcpTag } from "src/typings/bcp/BcpTag";
import { BranchHead } from "src/typings/core/Head";
import { TabBehaviour } from "src/typings/settings/TabBehaviour";
import { BcpTreeComponent } from "../bcp-tree/bcp-tree.component";
import {
  ConfirmDialogComponent,
  ConfirmDialogInput,
  ConfirmDialogOutput,
} from "../confirm-dialog/confirm-dialog.component";
import {
  CreateBranchComponent,
  DialogData,
  DialogResult,
} from "../create-branch/create-branch.component";
import {
  CreateTagComponent,
  CreateTagInput,
  CreateTagOutput,
} from "../create-tag/create-tag.component";

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
    return this.notebook.objects?.head.detached
      ? "Detached"
      : (this.notebook.objects?.head as BranchHead).name;
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

    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: DialogResult) => {
        if (result?.create && result.name) {
          this.vcs.createBranch(
            this.notebook,
            result.name,
            this.vcs.resolveHead(this.notebook.strings.head, this.notebook),
            true
          );
        }
        subscription.unsubscribe();
      });
  }

  onCheckoutTag(tag: BcpTag): void {
    try {
      this.vcs.checkoutTag(this.notebook, tag);
      BcpTreeComponent.setDataSub.next();
    } catch (err) {
      if ((err as Error).message === WORKING_TREE_DIRTY) {
        const data: ConfirmDialogInput = {
          heading: "Force checkout?",
          body:
            "There are uncommitted changes in the working tree.\nA checkout to " +
            tag.name +
            (tag.description !== "" ? ` (${tag.description})` : "") +
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
            this.vcs.checkoutTag(this.notebook, tag, true);
            BcpTreeComponent.setDataSub.next();
          }
        });
      } else {
        error(err);
      }
    }
  }

  onCreateTag(): void {
    const data: CreateTagInput = {
      currentCommit: this.notebook.strings.head,
      takenNames: Object.keys(this.notebook.strings.tags),
      notebookName: this.notebook.name,
    };

    const dialogRef = this.dialog.open(CreateTagComponent, {
      width: "350px",
      data,
    });

    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: CreateTagOutput) => {
        if (result?.create && result.name) {
          this.vcs.createTag(
            this.notebook,
            result.name,
            result.description,
            this.vcs.resolveHead(this.notebook.strings.head, this.notebook),
            false
          );
        }
        subscription.unsubscribe();
      });
  }

  onPush(): void {
    // TODO implement onPush
  }

  onPull(): void {
    // TODO implement onPull
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

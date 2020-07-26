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
import { filter } from "rxjs/operators";
import {
  ConfirmDialogOutput,
  ConfirmDialogInput,
  ConfirmDialogComponent,
} from "../confirm-dialog/confirm-dialog.component";
import { BranchHead } from "src/typings/core/Head";

@Component({
  selector: "app-bcp-vcs",
  templateUrl: "./bcp-vcs.component.html",
  styleUrls: ["./bcp-vcs.component.scss"],
})
export class BcpVcsComponent implements OnInit {
  @Input()
  notebook: BcpNotebook;

  get isDevMode(): boolean {
    return !environment.production;
  }

  constructor(public vcs: BcpVcsService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  get disableCommit(): boolean {
    return (
      this.notebook.objects.head.commit.strings.rootCategory ===
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
    return (this.notebook.objects.head as BranchHead).name || "Detached";
  }

  calcDisableBranchButton(name: string): boolean {
    return (this.notebook.objects.head as BranchHead).name !== name;
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

  private handleResult(result: DialogResult) {
    if (result?.create && result.name) {
      this.vcs.createBranch(
        this.notebook,
        result.name,
        this.vcs.resolveHead(this.notebook.strings.head, this.notebook),
        true
      );

      this.vcs.checkoutBranch(this.notebook, result.name);
    }
  }

  onCommit(): void {
    this.vcs.commitNotebook(this.notebook);
  }

  debug(): void {
    log("Root tree at head commit");
    log(hash(this.notebook.objects.head.commit.objects.rootCategory));
    log(this.notebook.objects.head.commit.objects.rootCategory);
    log("");

    log("Working tree");
    log(hash(this.notebook.objects.workingTree));
    log(this.notebook.objects.workingTree);
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

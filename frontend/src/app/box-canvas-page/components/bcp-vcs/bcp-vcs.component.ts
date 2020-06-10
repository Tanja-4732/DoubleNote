import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { environment } from "src/environments/environment";
import { log } from "src/functions/console";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import {
  CreateBranchComponent,
  DialogData,
  DialogResult,
} from "../create-branch/create-branch.component";
import { hash } from "src/functions/functions";
import { BcpTreeComponent } from "../bcp-tree/bcp-tree.component";

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
      this.notebook.objects.head.strings.rootCategory ===
      this.notebook.strings.workingTree
    );
  }

  get disableCheckout(): boolean {
    return Object.keys(this.notebook.strings.branches).length <= 1;
  }

  get commitText(): string {
    return this.disableCommit ? "Nothing to commit" : "Commit changes";
  }

  onCheckoutBranch(name: string): void {
    this.vcs.checkoutBranch(this.notebook, name);
    BcpTreeComponent.setDataObs.next();
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
        this.notebook.strings.head
      );
    }
  }

  onCommit(): void {
    this.vcs.commitNotebook(this.notebook);
  }

  debug(): void {
    log("Root tree at head commit");
    log(hash(this.notebook.objects.head.objects.rootCategory));
    log(this.notebook.objects.head.objects.rootCategory);
    log("");

    log("Working tree");
    log(hash(this.notebook.objects.workingTree));
    log(this.notebook.objects.workingTree);
    log("");

    log("Root tree == working tree");
    log(
      this.notebook.objects.head.objects.rootCategory ==
        this.notebook.objects.workingTree
    );
    log("");

    log("Root tree === working tree");
    log(
      this.notebook.objects.head.objects.rootCategory ===
        this.notebook.objects.workingTree
    );
    log("");

    log("Disable the commit button?");
    log(this.disableCommit);
  }
}

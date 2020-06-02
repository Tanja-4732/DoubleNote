import { Component, OnInit, Input } from "@angular/core";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { MatDialog } from "@angular/material/dialog";
import {
  CreateBranchComponent,
  DialogData,
  DialogResult,
} from "../create-branch/create-branch.component";

@Component({
  selector: "app-bcp-vcs",
  templateUrl: "./bcp-vcs.component.html",
  styleUrls: ["./bcp-vcs.component.scss"],
})
export class BcpVcsComponent implements OnInit {
  @Input()
  notebook: BcpNotebook;

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

  onCommit(): void {}

  debug(): string {
    const text = JSON.stringify(this.notebook, null, 2);
    console.log(this.notebook);
    return text;
  }
}

import { Component, OnInit, Input } from "@angular/core";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";

@Component({
  selector: "app-bcp-vcs",
  templateUrl: "./bcp-vcs.component.html",
  styleUrls: ["./bcp-vcs.component.scss"],
})
export class BcpVcsComponent implements OnInit {
  @Input()
  notebook: BcpNotebook;

  constructor(public vcs: BcpVcsService) {}

  ngOnInit(): void {}

  onCreateBranch(): void {}

  get disableCommit(): boolean {
    return (
      this.notebook.objects.head.strings.rootCategory ===
      this.notebook.strings.workingTree
    );
  }

  get commitText(): string {
    return this.disableCommit ? "Nothing to commit" : "Commit changes";
  }
}

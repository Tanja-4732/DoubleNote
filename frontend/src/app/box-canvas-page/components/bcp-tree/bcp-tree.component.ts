import { Component, OnInit, Input } from "@angular/core";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { NestedTreeControl, FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeNestedDataSource,
  MatTreeFlatDataSource,
} from "@angular/material/tree";
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import {
  CategoryDialogComponent,
  CategoryDialogInput,
  CategoryDialogOutput,
} from "../category-dialog/category-dialog.component";
import { TreeNode } from "src/typings/bcp/TreeNode";
import { CategoryTree } from "src/typings/bcp/CategoryTree";

@Component({
  selector: "app-bcp-tree",
  templateUrl: "./bcp-tree.component.html",
  styleUrls: ["./bcp-tree.component.scss"],
})
export class BcpTreeComponent implements OnInit {
  @Input()
  notebook: BcpNotebook;

  treeControl = new NestedTreeControl<TreeNode>((node) =>
    "name" in node ? node.objects.children : null
  );

  dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(
    private vcs: BcpVcsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  hasChild = (_: number, node: TreeNode) =>
    "name" in node && node.objects.children.length > 0;

  ngOnInit() {
    this.setData();
  }

  private setData() {
    // Reset the data (workaround for an Angular bug)
    this.dataSource.data = null;

    // Set the data of the data source to the categories projection
    this.dataSource.data = this.notebook.objects.workingTree.objects.children.concat(
      this.notebook.objects.workingTree.objects.pages as any
    );
  }

  /**
   * Opens a dialog to create a new category given a parent category
   *
   * @param target The parent of the node to be created
   */
  openCreateDialog(target?: CategoryTree): void {
    // When creating a new root category ...
    if (target === null) {
      // ... provide the root category
      target = this.notebook.objects.workingTree;
    }

    const data: CategoryDialogInput = {
      target,
      opcode: "Create",
      takenNames: target.objects.children.map((child) => child.name),
    };

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      // width: "250px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: CategoryDialogOutput) => {
      if (result !== undefined && result.confirmed) {
        if (result.takenNames.includes(result.name)) {
          throw new Error("Category name already taken");
        } else {
          const category: CategoryTree = {
            name: result.name,
            objects: { pages: [], children: [] },
          };

          result.target.objects.children.push(category);

          this.vcs.persistWorkingTree(this.notebook);
          this.setData();
        }
      }
    });
  }

  openEditDialog(target: CategoryTree): void {
    // When creating a new root category ...
    if (target === this.notebook.objects.workingTree) {
      // ... throw an error
      throw new Error("Cannot update the root category");
    }

    const data: CategoryDialogInput = {
      target,
      opcode: "Update",
      takenNames: [], // TODO Provide a list of taken names
    };

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      // width: "250px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: CategoryDialogOutput) => {
      if (result !== undefined && result.confirmed) {
        target.name = result.name;

        this.vcs.persistWorkingTree(this.notebook);
        this.setData();
      }
    });
  }
}

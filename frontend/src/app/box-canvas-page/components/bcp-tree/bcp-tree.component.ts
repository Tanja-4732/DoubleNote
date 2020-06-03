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
import { CategoryTree } from "src/typings/bcp/CategoryTree";
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import { CategoryDialogComponent } from "../category-dialog/category-dialog.component";

@Component({
  selector: "app-bcp-tree",
  templateUrl: "./bcp-tree.component.html",
  styleUrls: ["./bcp-tree.component.scss"],
})
export class BcpTreeComponent implements OnInit {
  @Input()
  notebook: BcpNotebook;

  treeControl = new NestedTreeControl<CategoryTree>(
    (node) => node.objects.children
  );

  dataSource = new MatTreeNestedDataSource<CategoryTree>();

  constructor(
    private cvs: BcpVcsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  hasChild = (_: number, node: CategoryTree) =>
    !!node.objects.children && node.objects.children.length > 0;

  async ngOnInit() {
    this.setData();
  }

  private setData() {
    // Reset the data (workaround for an Angular bug)
    this.dataSource.data = null;

    // Set the data of the data source to the categories projection
    this.dataSource.data = this.notebook.objects.workingTree.objects.children;
  }

  openCreateDialog(node?: CategoryTree): void {
    // When creating a new root category ...
    if (node === null) {
      // ... provide the root category
      node = this.notebook.objects.workingTree;
    }

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      // width: "250px",
      data: node,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Only create a category when a name was provided
      if (result !== undefined) {
        const category: CategoryTree = {
          name: result.name,
          objects: { pages: [], children: [] },
        };

        result.target.objects.push(category);

        this.cvs.persistWorkingTree(this.notebook);
        this.setData();
      }
    });
  }

  openEditDialog(node: CategoryTree): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      // width: "250px",
      data: node,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      // Ignore cancel
      if (result !== undefined) {
        await this.cs.ready;

        if (result.wantsToDelete) {
          await this.cs.deleteCategory(node, this.inventoryUuid);
        } else {
          node.name = result.childName;
          await this.cs.updateCategory(node, this.inventoryUuid);
        }

        this.setData();
      }
    });
  }
}

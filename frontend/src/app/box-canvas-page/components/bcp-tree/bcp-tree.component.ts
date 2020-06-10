import { Component, OnInit, Input, OnDestroy } from "@angular/core";
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
import { log } from "src/functions/console";
import { Subject, Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import {
  PageDialogComponent,
  PageDialogInput,
  PageDialogOutput,
} from "../page-dialog/page-dialog.component";
import { v4 } from "uuid";

@Component({
  selector: "app-bcp-tree",
  templateUrl: "./bcp-tree.component.html",
  styleUrls: ["./bcp-tree.component.scss"],
})
export class BcpTreeComponent implements OnInit, OnDestroy {
  /**
   * Used to notify the component that the data needs to be refreshed
   *
   * Call the `next()` method on this Subject to notify the component.
   */
  public static setDataSub = new Subject<void>();

  /**
   * The subscription to the `setDataSUb` Subject
   */
  private sub: Subscription;

  /**
   * The notebook to be displayed as a tree
   */
  @Input()
  notebook: BcpNotebook;

  treeControl = new NestedTreeControl<TreeNode>((node) =>
    "name" in node
      ? node.objects.children.concat(node.objects.pages as any)
      : []
  );

  dataSource = new MatTreeNestedDataSource<TreeNode>();

  get isDevMode(): boolean {
    return !environment.production;
  }

  constructor(
    private vcs: BcpVcsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  hasChild = (_: number, node: TreeNode) =>
    "name" in node &&
    (node.objects.children.length > 0 || node.objects.pages.length > 0);

  isCategory(node: TreeNode) {
    return "name" in node;
  }

  ngOnInit() {
    this.setData();
    this.sub = BcpTreeComponent.setDataSub.subscribe(() => this.setData());
  }

  ngOnDestroy() {
    try {
      this.sub.unsubscribe();
    } catch (err) {}
  }

  private setData() {
    // log(this.notebook.objects.workingTree);

    // Reset the data (workaround for an Angular bug)
    this.dataSource.data = null;

    const nodes = this.notebook.objects.workingTree.objects.children.concat(
      this.notebook.objects.workingTree.objects.pages as any
    );

    // Set the data of the data source to the categories projection
    this.dataSource.data = nodes;
    this.treeControl.dataNodes = nodes;

    // Expand everything
    this.treeControl.expandAll();
  }

  debug() {}

  /**
   * Opens a dialog to create a new category given a parent category
   *
   * @param target The parent of the node to be created
   */
  openCreateCategoryDialog(target?: CategoryTree): void {
    log("Create category dialog");

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

  openEditCategoryDialog(target: CategoryTree): void {
    log("Edit category dialog");
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

  /**
   * Opens a dialog to create a new page given a parent category
   *
   * @param target The parent of the page to be created
   */
  openCreatePageDialog(target?: CategoryTree): void {
    log("Create page dialog");
    // When creating a new root category ...
    if (target === null) {
      // ... provide the root category
      target = this.notebook.objects.workingTree;
    }

    // TODO
    const data: PageDialogInput = {
      target,
      opcode: "Create",
      takenTitles: target.objects.pages.map((page) => page.title),
    };

    const dialogRef = this.dialog.open(PageDialogComponent, {
      // width: "250px",
      data,
    });

    // TODO
    dialogRef.afterClosed().subscribe((result: PageDialogOutput) => {
      if (result !== undefined && result.confirmed) {
        if (result.takenNames.includes(result.title)) {
          throw new Error("Category name already taken");
        } else {
          const page: BoxCanvasPage = {
            title: result.title,
            uuid: v4(),
            objects: { boxes: [] },
          };

          result.target.objects.pages.push(page);

          this.vcs.persistWorkingTree(this.notebook);
          this.setData();
        }
      }
    });
  }
}

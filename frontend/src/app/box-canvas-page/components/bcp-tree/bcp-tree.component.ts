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
import { Icons } from "../../../user-interface/components/crumb-trail/crumb-trail.component";

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
  notebook!: BcpNotebook;

  treeControl = new NestedTreeControl<TreeNode>((node) => {
    if (node.objects == null) {
      throw new Error("node.objects is nullish");
    }

    return "name" in node
      ? node.objects.children.concat(node.objects.pages as any)
      : [];
  });

  dataSource = new MatTreeNestedDataSource<TreeNode>();

  get isDevMode(): boolean {
    return !environment.production;
  }

  get icons() {
    return Icons;
  }

  constructor(
    private vcs: BcpVcsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.sub = BcpTreeComponent.setDataSub.subscribe(() => this.setData());
  }

  hasChild(_: number, node: TreeNode) {
    if (node.objects == null) {
      throw new Error("node.objects is nullish");
    }

    return (
      "name" in node &&
      (node.objects.children.length > 0 || node.objects.pages.length > 0)
    );
  }

  isCategory(node: TreeNode) {
    return "name" in node;
  }

  ngOnInit() {
    this.setData();
  }

  ngOnDestroy() {
    try {
      this.sub.unsubscribe();
    } catch (err) {}
  }

  private setData() {
    if (this.notebook.objects == null) {
      throw new Error("this.notebook.objects is nullish");
    }

    // Reset the data (workaround for an Angular bug (or probably just triggering CD))
    // TODO check if the [] value works the same way as the previous null value
    this.dataSource.data = [];

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
   * If no target is specified, the root category will be used.
   *
   * @param target The parent of the node to be created
   */
  openCreateCategoryDialog(target = this.notebook.objects?.workingTree): void {
    log("Create category dialog");

    // Null check
    if (this.notebook.objects?.workingTree == null) {
      throw new Error("this.notebook.objects?.workingTree is nullish");
    }

    const data: CategoryDialogInput = {
      target,
      opcode: "Create",
      takenNames: target.objects.children.map(
        (child: CategoryTree) => child.name
      ),
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
          const category: any = {
            name: result.name,
            objects: { pages: [], children: [] },
          };

          result.target.objects?.children.push(category);

          this.vcs.persistWorkingTree(this.notebook);
          this.setData();
        }
      }
    });
  }

  openEditCategoryDialog(target: CategoryTree): void {
    log("Edit category dialog");

    // Null check
    if (this.notebook.objects == null) {
      throw new Error("this.notebook.objects is nullish");
    }

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
  openCreatePageDialog(target = this.notebook.objects?.workingTree): void {
    log("Create page dialog");

    // Null check
    if (this.notebook.objects == null) {
      throw new Error("this.notebook.objects is nullish");
    }

    // When creating a new root category ...
    if (target === null) {
      // ... provide the root category
      target = this.notebook.objects.workingTree;
    }

    // TODO
    const data: PageDialogInput = {
      target,
      opcode: "Create",
      takenTitles: target.objects.pages.map(
        (page: BoxCanvasPage) => page.title
      ),
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
          const page: any = {
            title: result.title,
            uuid: v4(),
            objects: { boxes: [] },
          };

          result.target.objects?.pages.push(page);

          this.vcs.persistWorkingTree(this.notebook);
          this.setData();
        }
      }
    });
  }
}

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CrumbTrailComponent,
  Icons,
} from "src/app/user-interface/components/crumb-trail/crumb-trail.component";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { Notebook } from "src/typings/core/Notebook";
import { SbpVcsService } from "src/app/services/sbp-vcs/sbp-vcs.service";
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import { CategoryTree } from "src/typings/bcp/CategoryTree";
import { log } from "src/functions/console";
import { TextBox } from "src/typings/bcp/TextBox";
import { v4 } from "uuid";
import { environment } from "src/environments/environment";
import { Subscription, Subject } from "rxjs";
import { Message, BcpMessage } from "src/typings/core/Message";
import { filter } from "rxjs/operators";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { BranchHead } from "src/typings/core/Head";
import { BOX_CONTENT_EMPTY } from "../pm-box/pm-box.component";

@Component({
  selector: "app-box-canvas-page",
  templateUrl: "./box-canvas-page.component.html",
  styleUrls: ["./box-canvas-page.component.scss"],
})
export class BoxCanvasPageComponent implements OnInit, OnDestroy {
  notebook!: BcpNotebook;
  page!: BoxCanvasPage;
  boxes!: TextBox[];

  private subscription!: Subscription;

  foreignBoxMove = new Subject<void>();

  saveInstruction = new Subject<void>();

  workingTitle!: string;

  constructor(
    private bcpVcs: BcpVcsService,
    private sbpVcs: SbpVcsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private mbs: MessageBusService
  ) {
    const retrievedNotebook = this.notebooks.find(
      (notebook) => notebook.uuid === route.snapshot.params.notebookUuid
    );

    switch (retrievedNotebook?.type) {
      case "SBP":
        this.router.navigateByUrl("/notebooks/sbp/" + retrievedNotebook.uuid);
        break;
      case "BCP":
        this.notebook = retrievedNotebook;
        break;
      case undefined:
        this.router.navigateByUrl("/notebooks");
        return;
    }

    // Null check
    if (this.notebook.objects == null) {
      throw new Error("this.notebook.objects is nullish");
    }

    const retrievedPage = this.getPageByUuid(
      route.snapshot.params.pageUuid,
      this.notebook.objects.workingTree
    );

    if (retrievedPage === undefined) {
      this.router.navigateByUrl("/notebooks/sbp/" + this.notebook.uuid);
    } else {
      this.page = retrievedPage;
    }

    // Null check
    if (this.page.objects == null) {
      throw new Error("this.page.objects is nullish");
    }

    this.workingTitle = this.page.title;
    this.boxes = this.page.objects.boxes;

    this.subscription = this.mbs.messageStream
      .pipe(
        filter(
          (m: Message) => m.messageType === "BcpMessage" // && m.uuid === this.page.uuid
        )
      )
      .subscribe((message) => this.handleMessage(message as BcpMessage));
  }

  // #region Setup

  ngOnInit(): void {
    this.setCrumbTrail();

    // Register the control+s key
    window.addEventListener("keydown", this.handleCtrlS);
  }

  ngOnDestroy(): void {
    try {
      this.subscription.unsubscribe();
    } catch (_) {}

    // Unregister the control+s key
    window.removeEventListener("keydown", this.handleCtrlS);
  }

  private handleCtrlS = (event: KeyboardEvent): void => {
    if (event.key === "s" && event.ctrlKey) {
      event.preventDefault();
      this.onSaveChanges();
    }
  };

  /**
   * Recursively searches for a page
   * with a specified UUID in a given tree
   *
   * @param uuid The UUID to search for
   * @param tree The tree to search in
   */
  private getPageByUuid(
    uuid: string,
    tree: CategoryTree
  ): BoxCanvasPage | undefined {
    // Null check
    if (tree.objects == null) {
      throw new Error("tree.objects is nullish");
    }

    // Try all local pages
    for (const page of tree.objects.pages) {
      // Check for a match
      if (page.uuid === uuid) {
        return page;
      }
    }

    // Try all children recursively
    for (const child of tree.objects.children) {
      const value = this.getPageByUuid(uuid, child);

      if (value !== undefined) {
        return value;
      }
    }

    // If nothing was found, return undefined
    return undefined;
  }

  get notebooks(): Notebook[] {
    return this.bcpVcs.notebooks.concat(this.sbpVcs.getNotebooks());
  }
  // #endregion

  // #region Commit
  get disableCommit(): boolean {
    // Null check
    if (this.notebook.objects == null) {
      throw new Error("this.notebook.objects is nullish");
    }

    return (
      this.notebook.objects.head.detached ||
      this.notebook.objects.head.commit.strings.rootCategory ===
        this.notebook.strings.workingTree
    );
  }

  get commitText(): string {
    // Null check
    if (this.notebook.objects == null) {
      throw new Error("this.notebook.objects is nullish");
    }

    return this.notebook.objects.head.detached
      ? "HEAD detached"
      : this.disableCommit
      ? "Nothing to commit"
      : "Commit to " + (this.notebook.objects.head as BranchHead).name;
  }
  // #endregion

  private setCrumbTrail() {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icons.Notebooks,
        title: "Notebooks",
        routerLink: "/notebooks",
      },
      {
        icon: Icons.Notebook,
        title: this.notebook.name + " (BCP)",
        routerLink: "/notebooks/bcp/" + this.notebook.uuid,
      },
      { icon: Icons.Page, title: this.page.title },
    ];
  }

  private handleMessage(message: BcpMessage) {
    log(message);

    // Make sure this message applies to the current page
    if (message.uuid !== this.page.uuid) {
      return;
    }

    const index = this.boxes.findIndex((b) => b.uuid === message.box.uuid);

    switch (message.operation) {
      case "create":
        this.boxes.push({
          uuid: message.box.uuid,
          state: message.box.state ?? "wysiwyg",
          x: message.box.x ?? 0,
          y: message.box.y ?? 0,
          width: message.box.width ?? 100,
          height: message.box.height ?? 350,
          pmDoc: BOX_CONTENT_EMPTY,
        });
        break;

      case "update":
        delete message.box.mdom;
        Object.assign(this.boxes[index], message.box);
        this.foreignBoxMove.next();
        break;

      case "delete":
        this.boxes.splice(index, 1);
        break;
    }

    this.cdr.detectChanges();
  }

  debug() {
    log(this.page);
  }

  get isDevMode(): boolean {
    return !environment.production;
  }

  onSaveChanges(): void {
    log("Saving changes");
    this.page.title = this.workingTitle;
    this.saveInstruction.next();
    this.bcpVcs.persistWorkingTree(this.notebook);
    this.setCrumbTrail();
  }

  onCommit(): void {
    this.bcpVcs.commitNotebook(this.notebook);
  }

  onBoxStateChanged(box: TextBox): void {
    this.mbs.dispatchMessage({
      messageType: "BcpMessage",
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),

      uuid: this.page.uuid,
      operation: "update",
      box: {
        uuid: box.uuid,
        state: box.state,
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        mdom: undefined,
      },
    });
  }

  onBoxDeleted(box: TextBox): void {
    this.mbs.dispatchMessage({
      messageType: "BcpMessage",
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),

      uuid: this.page.uuid,
      operation: "delete",
      box: {
        uuid: box.uuid,
        mdom: undefined,
      },
    });
  }

  trackByBox = (_: number, box: TextBox) => box.uuid;

  createNewBox(event: any): void {
    log("Creating new box");
    log(event);

    this.mbs.dispatchMessage({
      messageType: "BcpMessage",
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),

      uuid: this.page.uuid,
      operation: "create",
      box: {
        uuid: v4(),
        state: "wysiwyg",
        x: event.offsetX,
        y: event.offsetY,
        width: 500,
        height: 300,
        mdom: undefined,
      },
    });
  }
}

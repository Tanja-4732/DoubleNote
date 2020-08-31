import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { Message } from "src/typings/core/Message";
import { filter } from "rxjs/operators";
import { Subscription } from "rxjs";
import { DemoTextMessage } from "../../../../typings/core/Message";
import { SettingsService } from "src/app/services/settings/settings.service";
import {
  CrumbTrailComponent,
  Icons,
} from "src/app/user-interface/components/crumb-trail/crumb-trail.component";
import { log } from "src/functions/console";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { BcpCommit } from "src/typings/bcp/BcpCommit";
import { CategoryTree } from "src/typings/bcp/CategoryTree";
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import { TextBox } from "src/typings/bcp/TextBox";
import { BcpTag } from "src/typings/bcp/BcpTag";

@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.scss"],
})
export class DemoComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private otherPeerMessage = "";
  public peerId: string;

  get peerMessage(): string {
    return this.otherPeerMessage;
  }

  set peerMessage(message: string) {
    this.mbs.dispatchMessage(this.makeMessage(message));
  }

  public pastedJSON: string;

  constructor(
    private vcs: BcpVcsService,
    public settings: SettingsService,
    public mbs: MessageBusService,
    private cdr: ChangeDetectorRef
  ) {}

  height = 100;
  width = 200;

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icons.Demo,
        title: "Demo",
      },
    ];

    this.subscription = this.mbs.messageStream
      .pipe(filter((m: Message) => m.messageType === "DemoTextMessage"))
      .subscribe((message: DemoTextMessage) => {
        log(message);

        this.otherPeerMessage = message.text;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private makeMessage(text: string): DemoTextMessage {
    return {
      text,
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),
      messageType: "DemoTextMessage",
    };
  }

  connectToPeer() {
    this.mbs.connectToPeer(this.peerId);
  }

  get allIcons() {
    return Icons;
  }

  public async pasteJSON() {
    this.pastedJSON = await navigator.clipboard.readText();
  }

  onLoadExternalData() {
    const data: {
      metadata: {
        version: string;
        exportType: string;
        exportVersion: number;
        date: string;
      };

      content: {
        notebook: BcpNotebook;
        commits: { [hash: string]: BcpCommit };
        trees: { [hash: string]: CategoryTree };
        pages: { [hash: string]: BoxCanvasPage };
        boxes: { [hash: string]: TextBox };
        tags: { [hash: string]: BcpTag };
      };
    } = JSON.parse(this.pastedJSON);

    this.vcs.loadExternalData(
      [data.content.notebook],
      data.content.commits,
      data.content.trees,
      data.content.pages,
      data.content.boxes,
      data.content.tags
    );
  }
}

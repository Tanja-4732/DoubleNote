import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { Message } from "src/typings/core/Message";
import { filter } from "rxjs/operators";
import { Subscription } from "rxjs";
import { DemoTextMessage } from "../../../../typings/core/Message";
import { SettingsService } from "src/app/services/settings/settings.service";
import {
  CrumbTrailComponent,
  Icon,
} from "src/app/user-interface/components/crumb-trail/crumb-trail.component";
import { log } from "src/functions/console";

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

  constructor(
    public settings: SettingsService,
    public mbs: MessageBusService,
    private cdr: ChangeDetectorRef
  ) {}

  height = 100;
  width = 200;

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Demo,
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
}

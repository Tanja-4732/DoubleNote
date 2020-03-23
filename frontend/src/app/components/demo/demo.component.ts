import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  MessageBusService,
  Message
} from "src/app/services/message-bus/message-bus.service";

@Component({
  selector: "app-demo",
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.scss"]
})
export class DemoComponent implements OnInit {
  private subscription;
  private otherPeerMessage = "";
  public peerId: string;

  get peerMessage(): string {
    return this.otherPeerMessage;
  }

  set peerMessage(message: string) {
    this.mbs.dispatchMessage(this.makeMessage(message));
  }

  constructor(public mbs: MessageBusService, private cdr: ChangeDetectorRef) {}

  height = 100;
  width = 200;

  ngOnInit(): void {
    this.subscription = this.mbs.messageStream.subscribe(
      (message: DemoTextMessage) => {
        console.log(message);

        if (message.hasOwnProperty("text")) {
          this.otherPeerMessage = message.text;
          this.cdr.detectChanges();
        }
      }
    );
  }

  private makeMessage(text: string): DemoTextMessage {
    return {
      text,
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString()
    };
  }

  connectToPeer() {
    this.mbs.connectToPeer(this.peerId);
  }
}

interface DemoTextMessage extends Message {
  text: string;
}

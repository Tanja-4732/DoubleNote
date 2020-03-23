import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import {
  Message,
  MessageBusService
} from "src/app/services/message-bus/message-bus.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-text-box",
  templateUrl: "./text-box.component.html",
  styleUrls: ["./text-box.component.scss"]
})
export class TextBoxComponent implements OnInit {
  @ViewChild("wysiwyg")
  wysiwygEditor: Element;

  @ViewChild("markdown")
  markdownEditor: Element;

  state: "both" | "markdown" | "wysiwyg" = "both";

  markdownText = "Markdown editor";

  subscription: Subscription;

  constructor(public mbs: MessageBusService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription = this.mbs.messageStream
      .pipe(filter((m: Message) => m.messageType === "TextBoxMessage"))
      .subscribe((message: TextBoxMessage) => {
        console.log(message);

        this.markdownText = message.markdownText;
        this.cdr.detectChanges();
      });
  }

  cycleModes() {
    switch (this.state) {
      case "both":
        this.state = "markdown";
        break;
      case "markdown":
        this.state = "wysiwyg";
        break;
      case "wysiwyg":
        this.state = "both";
        break;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    this.mbs.dispatchMessage({
      authorUuid: this.mbs.myUuid,
      creationDate: new Date().toISOString(),
      messageType: "TextBoxMessage",
      markdownText: this.markdownEditor.textContent
    } as TextBoxMessage);
  }
}

interface TextBoxMessage extends Message {
  markdownText: string;
}

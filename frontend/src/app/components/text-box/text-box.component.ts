import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  Message,
  MessageBusService
} from "src/app/services/message-bus/message-bus.service";

@Component({
  selector: "app-text-box",
  templateUrl: "./text-box.component.html",
  styleUrls: ["./text-box.component.scss"]
})
export class TextBoxComponent implements OnInit {
  @ViewChild("wysiwyg")
  wysiwygEditor: ElementRef;

  @ViewChild("markdown")
  markdownEditor: ElementRef;

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
      markdownText: this.markdownEditor.nativeElement.innerText
    } as TextBoxMessage);
  }
}

interface TextBoxMessage extends Message {
  markdownText: string;
}

/*
Use @ViewContainer

https://youtu.be/qWmqiYDrnDc?t=1692
"use custom directives to implement DOM manipulation logic"

https://stackoverflow.com/a/48557247/5954839

Create a virtual DOM for Markdown
Call it MDDOM
-> We need a syntax tree
*/

interface MDDOM {
  nodes: MddomNode[];
}

interface MddomNode {}

interface MddomTextNode extends MddomNode {}

interface MddomTableNode extends MddomNode {}

interface MddomImageNode extends MddomNode {}

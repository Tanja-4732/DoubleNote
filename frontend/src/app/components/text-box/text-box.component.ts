import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { Message } from "src/app/typings/Message";
import { TextBoxMessage } from "../../typings/Message";

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

/*
Use @ViewContainer

https://youtu.be/qWmqiYDrnDc?t=1692
"use custom directives to implement DOM manipulation logic"

https://stackoverflow.com/a/48557247/5954839

Create a virtual DOM for Markdown
Call it MDOM (=MarkDown Object Model)
-> We need a syntax tree



Use advanced types
Probably use "type predicates"
-> see https://www.typescriptlang.org/docs/handbook/advanced-types.html

Use Discriminated Unions
-> see https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
-> see https://github.com/Microsoft/TypeScript/issues/14166#issuecomment-280875355

*/

/**
 * MarkDown Object Model
 *
 * A syntax tree representation of a markdown document
 */
interface MdomNode {
  type: MdomNodeType;
}

interface MdomTextNode extends MdomNode {}

interface MdomTableNode extends MdomNode {}

interface MdomImageNode extends MdomNode {}

enum MdomNodeType {
  "text",
  "heading",
  "hr"
}

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { MarkdownEngineService } from "src/app/services/markdown-engine/markdown-engine.service";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { MdomNode } from "src/app/typings/MDOM";
import { Message } from "src/app/typings/Message";
import { v4 } from "uuid";
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

  /**
   * Which editor(s) to display in the text box
   */
  state: "both" | "markdown" | "wysiwyg" = "markdown";

  /**
   * The MarkDown Object Model representation of the content of this text box
   */
  mdom: MdomNode[];

  subscription: Subscription;

  /**
   * The UUID of the text box
   *
   * Used to separate messages from multiple text boxes
   */
  uuid = v4();

  constructor(
    public mb: MessageBusService,
    private me: MarkdownEngineService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Cycles the editor(s) displayed in the text box
   */
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

  ngOnInit(): void {
    // Get the message bus observable
    // Subscribe to the message bus
    this.subscription = this.mb.messageStream

      .pipe(
        // Filter for TextBoxMessages only
        filter((m: Message) => m.messageType === "TextBoxMessage"),

        // Filter for messages about this TextBox only
        filter((m: TextBoxMessage) => m.uuid === this.uuid)
      )
      // Handle incoming messages
      .subscribe((message: TextBoxMessage) =>
        this.handleIncomingMessage(message)
      );
  }

  private handleIncomingMessage(message: TextBoxMessage) {
    console.log(message);

    this.mdom = message.mdom;

    this.cdr.detectChanges();
  }

  onKeyUp(event: KeyboardEvent) {
    this.mb.dispatchMessage({
      messageType: "TextBoxMessage",
      authorUuid: this.mb.myUuid,
      creationDate: new Date().toISOString(),
      mdom: this.me.parseMarkdown(this.markdownEditor.nativeElement.innerText),
      uuid: this.uuid
    });
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

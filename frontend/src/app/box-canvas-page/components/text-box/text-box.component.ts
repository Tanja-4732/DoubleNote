import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
} from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { MarkdownEngineService } from "src/app/services/markdown-engine/markdown-engine.service";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { MdomNode } from "src/typings/markdown/MDOM";
import { Message } from "src/typings/core/Message";
import { v4 } from "uuid";
import { TextBoxMessage } from "../../../../typings/core/Message";
import { log } from "src/functions/console";
import { TextBox } from "src/typings/bcp/TextBox";

@Component({
  selector: "app-text-box",
  templateUrl: "./text-box.component.html",
  styleUrls: ["./text-box.component.scss"],
})
export class TextBoxComponent implements OnInit {
  @Input() box: TextBox;

  @ViewChild("wysiwyg")
  wysiwygEditor: ElementRef;

  @ViewChild("markdown")
  markdownEditor: ElementRef;

  subscription: Subscription;

  constructor(
    public mb: MessageBusService,
    private me: MarkdownEngineService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Cycles the editor(s) displayed in the text box
   */
  cycleModes() {
    switch (this.box.state) {
      case "both":
        this.box.state = "markdown";
        break;
      case "markdown":
        this.box.state = "wysiwyg";
        break;
      case "wysiwyg":
        this.box.state = "both";
        break;
    }
  }

  get dragPosition() {
    return {
      x: this.box.x,
      y: this.box.y,
    };
  }

  set dragPosition(position: { x: number; y: number }) {
    this.box.x = position.x;
    this.box.y = position.y;
  }

  ngOnInit(): void {
    // Get the message bus observable
    // Subscribe to the message bus
    this.subscription = this.mb.messageStream

      .pipe(
        // Filter for TextBoxMessages only
        filter((m: Message) => m.messageType === "TextBoxMessage"),

        // Filter for messages about this TextBox only
        filter((m: TextBoxMessage) => m.uuid === this.box.uuid)
      )
      // Handle incoming messages
      .subscribe((message: TextBoxMessage) =>
        this.handleIncomingMessage(message)
      );
  }

  private handleIncomingMessage(message: TextBoxMessage) {
    // Log the incoming message
    log(message.mdom);

    // Update the markdown object model
    this.box.mdom = message.mdom;

    // Get Angular to re-render the view
    this.cdr.detectChanges();
  }

  onKeyUp(event: KeyboardEvent) {
    const mdom = this.me.parseMarkdown(
      this.markdownEditor.nativeElement.innerText
    );

    this.mb.dispatchMessage({
      messageType: "TextBoxMessage",
      authorUuid: this.mb.myUuid,
      creationDate: new Date().toISOString(),
      mdom,
      uuid: this.box.uuid,
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

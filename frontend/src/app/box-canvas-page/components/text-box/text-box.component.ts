import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { MarkdownEngineService } from "src/app/services/markdown-engine/markdown-engine.service";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { MdomNode } from "src/typings/markdown/MDOM";
import { Message } from "src/typings/core/Message";
import { v4 } from "uuid";
import { TextBoxMessage } from "../../../../typings/core/Message";
import { log } from "src/functions/console";
import { TextBox } from "src/typings/bcp/TextBox";
import { CdkDragEnd } from "@angular/cdk/drag-drop";
import { environment } from "src/environments/environment";

export interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: "app-text-box",
  templateUrl: "./text-box.component.html",
  styleUrls: ["./text-box.component.scss"],
})
export class TextBoxComponent implements OnInit, OnDestroy {
  @Input()
  readonly box: TextBox;

  @Input()
  foreignBoxMove: Observable<void>;
  private fbmSub: Subscription;

  subscription: Subscription;

  public dragPosition: Coordinates = { x: 0, y: 0 };

  @Output()
  boxState = new EventEmitter<void>();

  @Output()
  boxDeleted = new EventEmitter<void>();

  markdownText = "hello\nworld";

  constructor(
    public mb: MessageBusService,
    private engine: MarkdownEngineService,
    private cdr: ChangeDetectorRef
  ) {}

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

    this.cdr.detectChanges();
    this.setBoxPosition();

    this.fbmSub = this.foreignBoxMove.subscribe(() => this.setBoxPosition());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.fbmSub.unsubscribe();
  }

  get stateText(): string {
    switch (this.box.state) {
      case "both":
        return "Hybrid";

      case "markdown":
        return "Markdown";

      case "wysiwyg":
        return "WYSIWYG";
    }
  }

  get isDevMode(): boolean {
    return !environment.production;
  }

  private setBoxPosition() {
    this.dragPosition = {
      x: this.box.x,
      y: this.box.y,
    };
  }

  public onDragEnded(event: CdkDragEnd): void {
    const position = event.source.getFreeDragPosition();

    this.box.x = position.x;
    this.box.y = position.y;

    this.setBoxPosition();
    this.boxState.emit();
  }

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

  deleteBox() {
    this.boxDeleted.emit();
  }

  private handleIncomingMessage(message: TextBoxMessage) {
    // Log the incoming message
    log(message.mdom);

    // Update the markdown object model
    this.box.mdom = message.mdom;

    // Refresh the Markdown string
    this.markdownText = this.engine.generateMarkdown(this.box.mdom);

    // Get Angular to re-render the view
    this.cdr.detectChanges();
  }

  /**
   * Handles input events in the Markdown box.
   *
   * 1. Receive the event (the default has already been prevented)
   * 2. ???
   * 3. Get the string representation of the Markdown (including liniebreaks)
   * 4. Parse the string representation using the MarkdownEngineService
   * 5. Send the new tree to the MessageBusService
   */
  onMdKeyEvent(event: KeyboardEvent) {
    log(event);

    /* // 1. Receive the event (the default has already been prevented)
    log(event);

    // 2. ???
    const markdownText =
      this.markdownText + (event.key === "Enter" ? "\n" : event.key);

    // 3. Get the string representation of the Markdown (including liniebreaks)

    // 4. Parse the string representation using the MarkdownEngineService
    const mdom = this.engine.parseMarkdown(markdownText);

    // 5. Send the new tree to the MessageBusService
    this.mb.dispatchMessage({
      messageType: "TextBoxMessage",
      authorUuid: this.mb.myUuid,
      creationDate: new Date().toISOString(),
      mdom,
      uuid: this.box.uuid,
    }); */
  }
}

/*

# Strategic shift

Instead of trying to build a Markdown parser, I'll try to build the WYSIWYG editor itself, followed
by implementing the Markdown generation algorithm, and implement the Markdown editor and its
parsing as the last step.

1. Implement the WYSIWYG editor
2. Implement the Markdown generator
3. Confirm working real-time collaboration in WYSIWYG
4. Implement the Markdown editor
5. Implement the Markdown parser
6. Think about a redo-undo stack

We might be able to use the Markdown generator in combination with the parser as a formatter.


## Further reading

> Swipe-to-type will insert entire words in one go, instead of using keys.
https://github.com/ianstormtaylor/slate/issues/2062

*/

/*

# Thoughts on how to implement the WYSIWYG editor

Searching the internet for articles and videos about the topic, ProseMirror came up quite a lot.
Perhaps it's possible to gain some inspiration and insight on what events to listen for and on how
to handle them.

The goal is to use the browsers integrated cursor handling functionality and leverage its rendering
capabilities, while remaining in control over the DOM at all times. I plan on achieving this using
event handlers and preventDefault wherever I can. The ProseMirror talk at some JS conference (YT)
introduced me to the concept of using contentEditable in combination with preventDefault.

Instead of allowing the browser to insert any DOM nodes it wants, we manage the state of the
Documents (MDOM for WYSIWYG, and a simple array of line for the Markdown code) ourselves.

Since the input event cannot be canceled and the keyDown event doesn't work on mobile, we have to
get somewhat creative with our approach.

## Implementation strategy

This means that we have to do the following things:

- Keep track of the cursor position
  - On both desktop & mobile
  - Use selectionchange to listen to all kinds of selection changes
- Keep track of the DOM changes
  - Maybe use DOMCharacterDataModified like ProseMirror?
  - MDN recommends using a MutationObserver instead

*/

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

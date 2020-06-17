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
    // 1. Receive the event (the default has already been prevented)
    log(event);

    // 2. ???
    this.markdownText += event.key === "Enter" ? "\n" : event.key;

    // 3. Get the string representation of the Markdown (including liniebreaks)

    // 4. Parse the string representation using the MarkdownEngineService
    const mdom = this.engine.parseMarkdown(this.markdownText);

    // 5. Send the new tree to the MessageBusService
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

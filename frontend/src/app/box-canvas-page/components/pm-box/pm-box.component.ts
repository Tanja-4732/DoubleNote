import { CdkDragEnd } from "@angular/cdk/drag-drop";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  NgZone,
} from "@angular/core";
import { exampleSetup } from "prosemirror-example-setup";
import { DOMParser, Schema, MarkType } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Observable, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { MarkdownEngineService } from "src/app/services/markdown-engine/markdown-engine.service";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import { environment } from "src/environments/environment";
import { log } from "src/functions/console";
import { Coordinates } from "src/typings/bcp/Coordinates";
import { TextBox } from "src/typings/bcp/TextBox";
import { Message, TextBoxMessage } from "src/typings/core/Message";
import { undo, redo } from "prosemirror-history";
import { toggleMark } from "prosemirror-commands";

@Component({
  selector: "app-pm-box",
  templateUrl: "./pm-box.component.html",
  styleUrls: ["./pm-box.component.scss"],
})
export class PmBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  // #region Fields
  /**
   * An input which represents the state of the box.
   */
  @Input()
  readonly box: TextBox;

  /**
   * The subscription to the MessageBus
   */
  private mbSub: Subscription;

  /**
   * An input to this component, notifying it when it needs to be moved
   *
   * When the application logic outside of this component decides to move this box,
   * this observable will fire an event, which does not contain the target coordinates.
   */
  @Input()
  foreignBoxMove: Observable<void>;

  /**
   * The subscription to the foreignBoxMove observable
   */
  private fbmSub: Subscription;

  /**
   * An output which fires when the state of the box has changed
   */
  @Output()
  boxStateChanged = new EventEmitter<void>();

  /**
   * This output fires when the box has been deleted
   *
   * This occurs when the user clicks the "close" button.
   */
  @Output()
  boxDeleted = new EventEmitter<void>();

  /**
   * The current position of this box relative to its Box Canvas Page
   */
  public dragPosition: Coordinates = { x: 0, y: 0 };

  /**
   * A reference to the WYSIWYG editor (ProseMirror) of this component
   */
  @ViewChild("pmEditorRef")
  pmEditorRef: ElementRef;

  private view: EditorView;
  private mySchema: Schema<
    | "get"
    | "update"
    | "remove"
    | "addToStart"
    | "addToEnd"
    | "addBefore"
    | "forEach"
    | "prepend"
    | "append"
    | "subtract"
    | "size",
    "link" | "em" | "strong" | "code"
  >;
  // #endregion

  constructor(
    public mb: MessageBusService,
    private engine: MarkdownEngineService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  // #region Angular life cycle hooks
  ngOnInit(): void {
    // Get the message bus observable
    this.mbSub = this.mb.messageStream
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

    // Detect changes once, manually
    this.cdr.detectChanges();

    // Update the position of the box on the page, once, manually
    this.setBoxPosition();

    // Register to the observable to be notified when the box gets moved
    this.fbmSub = this.foreignBoxMove.subscribe(() => this.setBoxPosition());

    // TODO Refresh the Markdown string
    // this.markdownText = this.engine.generateMarkdown(this.box.mdom);
  }

  ngAfterViewInit(): void {
    this.initProseMirror();
  }

  ngOnDestroy(): void {
    this.mbSub.unsubscribe();
    this.fbmSub.unsubscribe();
  }
  // #endregion

  // #region MessageBus
  private handleIncomingMessage(message: TextBoxMessage) {
    // Log the incoming message
    log(message);

    // Update the markdown object model
    this.box.mdom = message.mdom;

    // TODO Refresh the Markdown string
    // this.markdownText = this.engine.generateMarkdown(this.box.mdom);

    // Get Angular to re-render the view
    this.cdr.detectChanges();
  }
  // #endregion

  /**
   * Initializes ProseMirror
   */
  private initProseMirror() {
    log(this.pmEditorRef.nativeElement);
    log("pm init");

    this.mySchema = new Schema({
      nodes: addListNodes(
        (schema.spec.nodes as unknown) as any,
        "paragraph block*",
        "block"
      ),
      marks: schema.spec.marks,
    });

    const docFromLS = JSON.parse(
      window.localStorage.getItem("dn.bcp.debug.pm-box-test")
    );

    this.view = new EditorView(this.pmEditorRef.nativeElement, {
      state: EditorState.create({
        doc:
          docFromLS != null
            ? docFromLS
            : DOMParser.fromSchema(this.mySchema).parse(
                this.pmEditorRef.nativeElement
              ),

        plugins: [].concat(
          exampleSetup({ schema: this.mySchema, menuBar: false })
        ),
      }),
    });
  }

  // #region event handlers
  /**
   * Cycles the editor(s) displayed in the text box
   */
  onCycleModes() {
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

  onDeleteBox() {
    this.boxDeleted.emit();
  }

  onDebug(): void {
    const doc = this.view.state.doc;

    log(doc);

    window.localStorage.setItem(
      "dn.bcp.debug.pm-box-test",
      JSON.stringify(doc)
    );
  }

  onBold(): void {
    log("onBold");

    if (this.view.dispatch) {
      const command = toggleMark(schema.marks.strong);

      command(this.view.state, this.view.dispatch);
    }
  }

  onItalic(): void {
    log("onItalic");

    if (this.view.dispatch) {
      const command = toggleMark(schema.marks.em);

      command(this.view.state, this.view.dispatch);
    }
  }

  onCode(): void {
    log("onCode");

    if (this.view.dispatch) {
      const command = toggleMark(schema.marks.code);

      command(this.view.state, this.view.dispatch);
    }
  }

  onLink(): void {
    log("onLink");
  }

  onPicture(): void {
    log("onPicture");
  }

  onHr(): void {
    log("onHr");

    log(this.mySchema.nodes);

    const state = this.view.state;
    const dispatch = this.view.dispatch;

    if (dispatch) {
      dispatch(
        state.tr.insert(
          this.view.state.selection.from,
          this.mySchema.node("horizontal_rule")
        )
      );
    }
  }

  onType(styleType: string): void {
    log("onType: " + styleType);

    switch (styleType) {
      case "plain":
        break;

      case "code":
        break;

      case "h1":
        break;

      case "h2":
        break;

      case "h3":
        break;

      case "h4":
        break;

      case "h5":
        break;

      case "h6":
        break;
    }
  }

  onUndo(): void {
    log("onUndo");

    if (this.view.dispatch) {
      const command = undo;

      command(this.view.state, this.view.dispatch);
    }
  }

  onRedo(): void {
    log("onRedo");

    if (this.view.dispatch) {
      const command = redo;

      command(this.view.state, this.view.dispatch);
    }
  }

  onBulletList(): void {
    log("onBulletList");
  }

  onNumberList(): void {
    log("onNumberList");
  }

  onQuote(): void {
    log("onQuote");
  }

  onSelectParentNode(): void {
    log("onSelectParentNode");
  }
  // #endregion

  // #region getters
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
  // #endregion

  // #region CDK drag-and-drop
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
    this.boxStateChanged.emit();
  }
  // #endregion
}

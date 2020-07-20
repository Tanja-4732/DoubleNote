import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { exampleSetup } from "prosemirror-example-setup";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { DOMParser, Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

@Component({
  selector: "app-pm-box",
  templateUrl: "./pm-box.component.html",
  styleUrls: ["./pm-box.component.scss"],
})
export class PmBoxComponent implements OnInit, AfterViewInit {
  @ViewChild("pmEditorRef")
  pmEditorRef: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initProseMirror();
  }

  /**
   * Initializes ProseMirror
   */
  private initProseMirror() {
    const state = EditorState.create({
      schema,
      plugins: [history(), keymap({ "Mod-z": undo, "Mod-y": redo })],
    });

    const view = new EditorView(this.pmEditorRef.nativeElement, { state });
  }
}

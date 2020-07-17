import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { schema } from "prosemirror-schema-basic";
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
    let state = EditorState.create({ schema });
    let view = new EditorView(this.pmEditorRef.nativeElement, { state });
  }
}

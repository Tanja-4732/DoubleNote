import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-text-box",
  templateUrl: "./text-box.component.html",
  styleUrls: ["./text-box.component.scss"]
})
export class TextBoxComponent implements OnInit {
  // @ViewChild("wysiwyg")
  // wysiwyg: Element;

  state: "both" | "markdown" | "wysiwyg" = "both";

  constructor() {}

  ngOnInit(): void {
    // this.wysiwyg.contentEditable = true;
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
}

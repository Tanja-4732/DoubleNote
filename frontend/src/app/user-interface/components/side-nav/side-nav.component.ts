import { Component, OnInit } from "@angular/core";
import { Icon } from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
})
export class SideNavComponent implements OnInit {
  get icons() {
    return Icon;
  }

  constructor() {}

  ngOnInit(): void {}
}

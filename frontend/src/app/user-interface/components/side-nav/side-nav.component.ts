import { Component, OnInit } from "@angular/core";
import { Icons } from "../crumb-trail/crumb-trail.component";
import { versionString } from "src/functions/version";

@Component({
  selector: "app-side-nav",
  templateUrl: "./side-nav.component.html",
  styleUrls: ["./side-nav.component.scss"],
})
export class SideNavComponent implements OnInit {
  get icons() {
    return Icons;
  }

  get version() {
    return versionString;
  }

  constructor() {}

  ngOnInit(): void {}
}

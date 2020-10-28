import { Component, OnInit } from "@angular/core";
import { licenseNotice } from "src/functions/license";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  constructor() {}

  get licenseNotice() {
    return licenseNotice;
  }

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icons.Welcome,
        title: "Welcome",
      },
    ];
  }
}

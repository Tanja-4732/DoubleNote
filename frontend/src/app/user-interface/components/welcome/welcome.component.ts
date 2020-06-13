import { Component, OnInit } from "@angular/core";
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

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icons.Welcome,
        title: "Welcome",
      },
    ];
  }
}

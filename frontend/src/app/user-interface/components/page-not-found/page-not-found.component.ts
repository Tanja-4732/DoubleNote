import { Component, OnInit } from "@angular/core";
import {
  CrumbTrailComponent,
  Icon,
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Welcome,
        title: "Welcome",
        routerLink: "/welcome",
      },
      {
        icon: Icon.Error,
        title: "Page not found",
      },
    ];
  }

  get href(): string {
    return window.location.href;
  }
}

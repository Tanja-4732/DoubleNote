import { Component, OnInit } from "@angular/core";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-servers",
  templateUrl: "./servers.component.html",
  styleUrls: ["./servers.component.scss"],
})
export class ServersComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        title: "Servers",
        icon: Icons.Server,
      },
    ];
  }
}

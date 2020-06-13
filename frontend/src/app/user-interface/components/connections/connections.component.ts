import { Component, OnInit } from "@angular/core";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-connections",
  templateUrl: "./connections.component.html",
  styleUrls: ["./connections.component.scss"],
})
export class ConnectionsComponent implements OnInit {
  name = "";
  uuid = "";
  myName: string;

  constructor(public mbs: MessageBusService) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        title: "Connections",
        icon: Icons.MultiUser,
      },
    ];

    this.myName = this.mbs.myName;
  }

  get myUuid(): string {
    return this.mbs.myUuid;
  }

  get contacts() {
    return this.mbs.contacts;
  }

  connectToPeer = (uuid: string) => this.mbs.connectToPeer(uuid);

  persistMyName = () => (this.mbs.myName = this.myName);

  createContact() {
    this.mbs.contacts.push({ uuid: this.uuid, name: this.name });
    this.mbs.persistContacts();

    this.name = this.uuid = "";
  }
}

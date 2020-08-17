import { Component, OnInit } from "@angular/core";
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";
import { SettingsService } from "src/app/services/settings/settings.service";
import {
  ConfirmDialogInput,
  ConfirmDialogComponent,
  ConfirmDialogOutput,
} from "src/app/box-canvas-page/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Contact } from "src/typings/core/contact";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-collaboration",
  templateUrl: "./collaboration.component.html",
  styleUrls: ["./collaboration.component.scss"],
})
export class CollaborationComponent implements OnInit {
  name = "";
  uuid = "";
  myName: string;

  constructor(
    public mbs: MessageBusService,
    public settings: SettingsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        title: "Collaboration",
        icon: Icons.MultiUser6,
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

  copyMyUuid(): void {
    navigator.clipboard.writeText(this.myUuid);

    this.snackBar.open("UUID copied to clipboard", "Close", {
      duration: 3000,
    });
  }

  deleteContact(contact: Contact): void {
    const data: ConfirmDialogInput = {
      heading: `Delete contact "${contact.name}"?`,
      body:
        "The contact will be removed. You can add it again later.\n" +
        "This operation cannot be (automatically) undone.",
      cancel: {
        color: "primary",
        text: "Cancel",
      },
      confirm: {
        color: "warn",
        text: "Delete contact",
      },
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: ConfirmDialogOutput) => {
      if (result?.result) {
        const i = this.mbs.contacts.findIndex((c) => c.uuid === contact.uuid);
        this.mbs.contacts.splice(i, 1);
        this.mbs.persistContacts();
      }
    });
  }
}

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
import { Contact } from "src/typings/core/Contact";
import { MatSnackBar } from "@angular/material/snack-bar";
import { log } from "src/functions/console";
import {
  ContactDialogComponent,
  ContactDialogInput,
  ContactDialogOutput,
  ContactDialogOpcode,
} from "../contact-dialog/contact-dialog.component";

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
  ) {
    this.myName = this.mbs.myName;
  }

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        title: "Collaboration",
        icon: Icons.MultiUser6,
      },
    ];
  }

  get myUuid(): string {
    return this.mbs.myUuid;
  }

  get contacts() {
    return this.mbs.contacts;
  }

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

  openEditContactDialog(contact: Contact): void {
    const data: ContactDialogInput = {
      contact,
      opcode: ContactDialogOpcode.update,
      takenTitles: this.contacts.map((c) => c.name),
    };

    const dialogRef = this.dialog.open(ContactDialogComponent, {
      // width: "250px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: ContactDialogOutput) => {
      if (result !== undefined && result.confirmed) {
        contact.name = result.name;
        this.mbs.persistContacts();
      }
    });
  }

  openJoinContactDialog(contact: Contact): void {
    const data: ContactDialogInput = {
      contact,
      opcode: ContactDialogOpcode.join,
      takenTitles: this.contacts.map((c) => c.name),
    };

    const dialogRef = this.dialog.open(ContactDialogComponent, {
      // width: "250px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: ContactDialogOutput) => {
      if (result !== undefined && result.confirmed) {
        this.mbs.connectToPeer(result.contact.uuid);
      }
    });
  }

  openInviteContactDialog(contact: Contact): void {
    const data: ContactDialogInput = {
      contact,
      opcode: ContactDialogOpcode.invite,
      takenTitles: this.contacts.map((c) => c.name),
    };

    const dialogRef = this.dialog.open(ContactDialogComponent, {
      // width: "250px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: ContactDialogOutput) => {
      if (result !== undefined && result.confirmed) {
        this.mbs.connectToPeer(result.contact.uuid);
      }
    });
  }
}

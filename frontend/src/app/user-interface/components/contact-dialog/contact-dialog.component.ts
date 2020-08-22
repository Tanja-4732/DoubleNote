import { Component, OnInit, Inject } from "@angular/core";
import { Contact } from "src/typings/core/Contact";
import { log } from "src/functions/console";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { SessionService } from "src/app/services/session/session.service";
import { SessionToken } from "src/typings/session/SessionToken";
import { registerLocaleData } from "@angular/common";
import localeImport from "@angular/common/locales/de-AT";

@Component({
  selector: "app-contact-dialog",
  templateUrl: "./contact-dialog.component.html",
  styleUrls: ["./contact-dialog.component.scss"],
})
export class ContactDialogComponent implements OnInit {
  status:
    | "awaiting input"
    | "invite pending"
    | "invite accepted"
    | "join pending" = "awaiting input";

  readonly joinCode: string = "";

  token: SessionToken;

  formGroup: FormGroup;

  readonly locale = "de-AT";

  constructor(
    public session: SessionService,
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public input: ContactDialogInput
  ) {
    registerLocaleData(localeImport, this.locale);
    this.formGroup = formBuilder.group({
      title: [
        "",
        [
          Validators.required,
          ((takenTitles: string[]) => {
            return (
              control: AbstractControl
            ): { [key: string]: any } | null => {
              const error = takenTitles.some(
                (title) => title === control.value
              );
              return error ? { takenName: { value: control.value } } : null;
            };
          })(this.input.takenTitles),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ confirmed: false } as ContactDialogOutput);
  }

  onSubmit(): void {
    this.dialogRef.close({
      // Prodded with creation
      confirmed: true,

      // The chosen title
      name: this.formGroup.value.title,

      // Pass through the data
      takenNames: this.input.takenTitles,
      contact: this.input.contact,
    } as ContactDialogOutput);
  }

  onAuthorizeInvite() {
    this.token = this.session.autorizeInviteByUuid(this.input.contact.uuid);
    log(this.token);
    this.status = "invite pending";
  }

  onRevokeInvite() {}

  onJoin() {
    this.status = "join pending";
  }
}

export interface ContactDialogInput {
  /**
   * A list of unavailable names
   */
  takenTitles: string[];

  /**
   * The contact to use in this dialog
   */
  contact: Contact;

  /**
   * The operation to perform
   */
  opcode: "Create" | "Update" | "Invite" | "Join";
}

export interface ContactDialogOutput {
  confirmed: boolean;

  /**
   * The chosen title
   */
  name: string;

  /**
   * The contact to use in this dialog
   */
  contact: Contact;

  /**
   * A list of unavailable names
   */
  takenNames: string[];
}

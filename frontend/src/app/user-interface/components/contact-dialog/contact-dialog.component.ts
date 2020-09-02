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
import { MessageBusService } from "src/app/services/message-bus/message-bus.service";

@Component({
  selector: "app-contact-dialog",
  templateUrl: "./contact-dialog.component.html",
  styleUrls: ["./contact-dialog.component.scss"],
})
export class ContactDialogComponent implements OnInit {
  public dialogState = Status.awaiting_input;

  readonly joinCode: string = "";

  token: SessionToken;

  formGroup: FormGroup;

  readonly locale = "de-AT";

  constructor(
    private mbs: MessageBusService,
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

  get Status() {
    return Status;
  }

  get OpCode() {
    return ContactDialogOpcode;
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
    this.dialogState = Status.pending;
  }

  onRevokeInvite() {
    this.session.revokeInviteByUuid(this.input.contact.uuid);
    this.dialogRef.close({ confirmed: false } as ContactDialogOutput);
  }

  async onJoin() {
    this.dialogState = Status.pending;

    await this.session.attemptJoinByUuid(
      this.input.contact.uuid,
      this.formGroup.value.title
    );

    log("Await acceptance");
    await this.session.waitForRemoteJoinConfirmation();
    log("Awaited acceptance");
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
  opcode: ContactDialogOpcode;
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

enum Status {
  awaiting_input,
  pending,
  accepted,
}

export enum ContactDialogOpcode {
  invite,
  join,
  update,
}

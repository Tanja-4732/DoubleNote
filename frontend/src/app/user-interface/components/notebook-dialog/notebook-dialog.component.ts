import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from "@angular/forms";

@Component({
  selector: "app-notebook-dialog",
  templateUrl: "./notebook-dialog.component.html",
  styleUrls: ["./notebook-dialog.component.scss"],
})
export class NotebookDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NotebookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public input: NotebookDialogInput
  ) {
    this.formGroup = formBuilder.group({
      name: ["", Validators.required],
      type: ["BCP"],
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ confirmed: false } as NotebookDialogOutput);
  }

  onSubmit(): void {
    this.dialogRef.close({
      confirmed: true,
      name: this.formGroup.value.name,
      type: this.formGroup.value.type,
    } as NotebookDialogOutput);
  }
}

export interface NotebookDialogInput {
  type?: string;
  name?: string;

  operation: "create" | "update";
}

export interface NotebookDialogOutput {
  confirmed: boolean;
  name: string;
  type?: "SBP" | "BCP";
}

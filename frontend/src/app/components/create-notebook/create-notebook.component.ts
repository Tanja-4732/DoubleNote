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
  selector: "app-create-notebook",
  templateUrl: "./create-notebook.component.html",
  styleUrls: ["./create-notebook.component.scss"],
})
export class CreateNotebookComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateNotebookComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.formGroup = formBuilder.group({
      name: ["", Validators.required],
      type: ["BCP"],
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ create: false } as DialogResult);
  }

  onSubmit(): void {
    this.dialogRef.close({
      create: true,
      name: this.formGroup.value.name,
      type: this.formGroup.value.type,
    } as DialogResult);
  }
}

export interface DialogData {
  type: string;
  name: string;
}

export interface DialogResult {
  create: boolean;
  name: string;
  type: "SBP" | "BCP";
}

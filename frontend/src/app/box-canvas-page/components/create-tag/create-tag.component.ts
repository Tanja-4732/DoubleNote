import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-create-tag",
  templateUrl: "./create-tag.component.html",
  styleUrls: ["./create-tag.component.scss"],
})
export class CreateTagComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateTagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTagInput
  ) {
    this.formGroup = formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          ((takenNames: string[]) => {
            return (
              control: AbstractControl
            ): { [key: string]: any } | null => {
              const error = takenNames.some((name) => name === control.value);
              return error ? { takenName: { value: control.value } } : null;
            };
          })(this.data.takenNames),
        ],
      ],
      description: [""],
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ create: false } as CreateTagOutput);
  }

  onSubmit(): void {
    this.dialogRef.close({
      create: true,
      name: this.formGroup.value.name,
      description: this.formGroup.value.description,
    } as CreateTagOutput);
  }
}

export interface CreateTagInput {
  takenNames: string[];
  currentCommit: string;
  notebookName: string;
}

export interface CreateTagOutput {
  create: boolean;
  name: string;
  description: string;
}

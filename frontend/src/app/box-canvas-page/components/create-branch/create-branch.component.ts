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
  AbstractControl,
} from "@angular/forms";

@Component({
  selector: "app-create-branch",
  templateUrl: "./create-branch.component.html",
  styleUrls: ["./create-branch.component.scss"],
})
export class CreateBranchComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
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
  takenNames: string[];
  currentCommit: string;
  notebookName: string;
}

export interface DialogResult {
  create: boolean;
  name: string;
}

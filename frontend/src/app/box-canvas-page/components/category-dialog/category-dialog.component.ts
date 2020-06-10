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
import { CategoryTree } from "src/typings/bcp/CategoryTree";

@Component({
  selector: "app-category-dialog",
  templateUrl: "./category-dialog.component.html",
  styleUrls: ["./category-dialog.component.scss"],
})
export class CategoryDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public input: CategoryDialogInput
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
          })(this.input.takenNames),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ confirmed: false } as CategoryDialogOutput);
  }

  onSubmit(): void {
    this.dialogRef.close({
      // Prodded with creation
      confirmed: true,

      // The chosen name
      name: this.formGroup.value.name,

      // Pass through the data
      takenNames: this.input.takenNames,
      target: this.input.target,
    } as CategoryDialogOutput);
  }
}

export interface CategoryDialogInput {
  /**
   * A list of unavailable names
   */
  takenNames: string[];

  /**
   * The target under which to insert
   */
  target: CategoryTree;

  /**
   * The operation to perform
   */
  opcode: "Create" | "Update";
}

export interface CategoryDialogOutput {
  confirmed: boolean;

  /**
   * The chosen name
   */
  name: string;

  /**
   * The target under which to insert
   */
  target: CategoryTree;

  /**
   * A list of unavailable names
   */
  takenNames: string[];
}

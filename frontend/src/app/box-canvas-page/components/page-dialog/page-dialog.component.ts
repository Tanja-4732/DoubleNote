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
  selector: "app-page-dialog",
  templateUrl: "./page-dialog.component.html",
  styleUrls: ["./page-dialog.component.scss"],
})
export class PageDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public input: PageDialogInput
  ) {
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
    this.dialogRef.close({ confirmed: false } as PageDialogOutput);
  }

  onSubmit(): void {
    this.dialogRef.close({
      // Prodded with creation
      confirmed: true,

      // The chosen title
      title: this.formGroup.value.title,

      // Pass through the data
      takenNames: this.input.takenTitles,
      target: this.input.target,
    } as PageDialogOutput);
  }
}

export interface PageDialogInput {
  /**
   * A list of unavailable names
   */
  takenTitles: string[];

  /**
   * The target under which to insert
   */
  target: CategoryTree;

  /**
   * The operation to perform
   */
  opcode: "Create" | "Update";
}

export interface PageDialogOutput {
  confirmed: boolean;

  /**
   * The chosen title
   */
  title: string;

  /**
   * The target under which to insert
   */
  target: CategoryTree;

  /**
   * A list of unavailable names
   */
  takenNames: string[];
}

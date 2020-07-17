import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { log } from "src/functions/console";

@Component({
  selector: "app-export-dialog",
  templateUrl: "./export-dialog.component.html",
  styleUrls: ["./export-dialog.component.scss"],
})
export class ExportDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public input: ExportDialogInput
  ) {
    this.formGroup = formBuilder.group({
      url: ["", Validators.required],
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ confirmed: false } as ExportDialogOutput);
  }

  onSubmit(): void {
    this.dialogRef.close({
      confirmed: true,
      url: this.formGroup.value.url,
    } as ExportDialogOutput);
  }

  onCopyJson(): void {
    navigator.clipboard.writeText(this.input.jsonText);

    this.snackBar.open("JSON copied to clipboard", "Close", {
      duration: 3000,
    });

    this.dialogRef.close({ confirmed: false } as ExportDialogOutput);
  }
}

export interface ExportDialogInput {
  /**
   * The JSON representation of the notebook
   */
  jsonText: string;
}

export interface ExportDialogOutput {
  confirmed: boolean;
  url: string;
}

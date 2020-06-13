import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public input: ConfirmDialogInput
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ result: false } as ConfirmDialogOutput);
  }

  onSubmit(): void {
    this.dialogRef.close({ result: true } as ConfirmDialogOutput);
  }
}

export interface ConfirmDialogInput {
  /**
   * The text to display in the heading
   */
  heading: string;

  /**
   * The text to display in the body
   */
  body?: string;

  /**
   * Configuration for the confirm button
   */
  confirm: {
    /**
     * The text to display in the confirm button
     */
    text: string;

    /**
     * The color of the confirm button
     */
    color: "basic" | "primary" | "accent" | "warn";
  };

  /**
   * Configuration for the cancel button
   */
  cancel: {
    /**
     * The text to display in the cancel button
     */
    text: string;

    /**
     * The color of the cancel button
     */
    color: "basic" | "primary" | "accent" | "warn";
  };
}

export interface ConfirmDialogOutput {
  /**
   * The choice of the user
   */
  result: boolean;
}

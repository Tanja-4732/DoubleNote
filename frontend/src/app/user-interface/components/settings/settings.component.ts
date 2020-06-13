import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService } from "src/app/services/settings/settings.service";
import { Subscription } from "rxjs";
import {
  CrumbTrailComponent,
  Icons,
} from "../crumb-trail/crumb-trail.component";
import { deleteAll } from "src/functions/functions";
import {
  ConfirmDialogInput,
  ConfirmDialogComponent,
  ConfirmDialogOutput,
} from "src/app/box-canvas-page/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  private sub: Subscription;

  constructor(
    private settings: SettingsService,
    formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.formGroup = formBuilder.group({
      enableOfflineMode: true,
    });

    this.formGroup.setValue(
      { enableOfflineMode: this.settings.offlineMode },
      { emitEvent: false }
    );
  }

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icons.Settings,
        title: "Settings",
      },
    ];

    this.sub = this.formGroup.valueChanges.subscribe(
      (value) => (this.settings.offlineMode = value.enableOfflineMode)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  deleteAll = () => this.onDeleteAll();

  onDeleteAll(): void {
    const data: ConfirmDialogInput = {
      heading: "Delete all data?",
      body:
        "This operation will permanently delete all data stored in this application.\n" +
        "Every notebook will be deleted. This operation cannot be undone.",
      cancel: {
        color: "primary",
        text: "Cancel",
      },
      confirm: {
        color: "warn",
        text: "Delete everything",
      },
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data,
    });

    dialogRef.afterClosed().subscribe((result: ConfirmDialogOutput) => {
      if (result?.result) {
        deleteAll();
      }
    });
  }
}

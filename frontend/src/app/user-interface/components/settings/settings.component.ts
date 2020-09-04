import { Component, OnInit, OnDestroy, ApplicationRef } from "@angular/core";
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
import { version } from "src/functions/version";
import { SwUpdate } from "@angular/service-worker";
import { BcpVcsService } from "src/app/services/bcp-vcs/bcp-vcs.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  public exportText = "";

  formGroup: FormGroup;
  private sub: Subscription;

  get version(): string {
    return version;
  }

  public updateText =
    "New updates may be available. Click the button below to check for updates.";

  constructor(
    private bcpVcs: BcpVcsService,
    private settings: SettingsService,
    formBuilder: FormBuilder,
    public dialog: MatDialog,
    private updates: SwUpdate
  ) {
    this.formGroup = formBuilder.group({
      enableOfflineMode: true,
      displayFormatBars: true,
    });

    this.formGroup.setValue(
      {
        enableOfflineMode: this.settings.offlineMode,
        displayFormatBars: this.settings.formatBars,
      },
      { emitEvent: false }
    );

    this.sub = this.formGroup.valueChanges.subscribe((value) => {
      this.settings.offlineMode = value.enableOfflineMode;
      this.settings.formatBars = value.displayFormatBars;
    });
  }

  ngOnInit(): void {
    CrumbTrailComponent.crumbs = [
      {
        icon: Icons.Settings,
        title: "Settings",
      },
    ];
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

  async onCheckForUpdate(): Promise<void> {
    this.updateText = "Checking for updates...";
    await this.updates.checkForUpdate();
    this.updateText = "Checked for updates.";
  }

  public exportEverything(): void {
    this.exportText = this.bcpVcs.exportEverything();
  }
}

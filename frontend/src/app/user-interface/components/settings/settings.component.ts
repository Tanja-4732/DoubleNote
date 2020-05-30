import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsService } from "src/app/user-interface/services/settings/settings.service";
import { Subscription } from "rxjs";
import {
  CrumbTrailComponent,
  Icon,
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  private sub: Subscription;

  constructor(private settings: SettingsService, formBuilder: FormBuilder) {
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
        icon: Icon.Settings,
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
}

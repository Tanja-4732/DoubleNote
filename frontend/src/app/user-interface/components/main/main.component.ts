import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { SettingsService } from "src/app/services/settings/settings.service";
import { environment } from "src/environments/environment";
import { Icons } from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  get isDevMode(): boolean {
    return !environment.production;
  }

  get icons() {
    return Icons;
  }

  constructor(
    public settings: SettingsService,
    private breakpointObserver: BreakpointObserver
  ) {}

  deleteAll(): void {
    window.localStorage.removeItem("dn.bcp.notebooks");
    window.localStorage.removeItem("dn.bcp.commits");
    window.localStorage.removeItem("dn.bcp.trees");
    window.localStorage.removeItem("dn.bcp.pages");
    window.localStorage.removeItem("dn.bcp.boxes");
    window.location.reload();
  }
}

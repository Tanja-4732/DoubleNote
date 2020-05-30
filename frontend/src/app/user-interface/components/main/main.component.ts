import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  get sideNavOpened(): boolean {
    switch (window.localStorage.getItem("sideNavOpened")) {
      case "true":
        return true;
      case "false":
        return false;
      case null:
        this.sideNavOpened = true;
        return true;
    }
  }

  set sideNavOpened(value: boolean) {
    window.localStorage.setItem("sideNavOpened", value + "");
  }
}

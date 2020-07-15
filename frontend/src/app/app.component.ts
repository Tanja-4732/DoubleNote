import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  SwUpdate,
  UpdateAvailableEvent,
  UpdateActivatedEvent,
} from "@angular/service-worker";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "DoubleNote";

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    updates: SwUpdate
  ) {
    updates.available.subscribe((event) => this.onNewVersionAvailable(event));
    updates.activated.subscribe((event) => this.onNewVersionActivated(event));
  }

  ngOnInit() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        this.router.navigateByUrl("/welcome");
      }
    });
  }

  onNewVersionAvailable(event: UpdateAvailableEvent): void {
    this.snackBar
      .open("A new version is available", "Reload")
      .onAction()
      .subscribe(() => window.location.reload());
  }

  onNewVersionActivated(event: UpdateActivatedEvent): void {
    this.snackBar.open("New version loaded", "Close", {
      duration: 3000,
    });
  }
}

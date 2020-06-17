import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "DoubleNote";

  constructor(private router: Router) {}

  ngOnInit() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "F1") {
        event.preventDefault();
        this.router.navigateByUrl("/welcome");
      }
    });
  }
}

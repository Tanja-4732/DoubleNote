import { NgModule } from "@angular/core";
import { environment } from "../environments/environment";
import { LayoutModule } from "@angular/cdk/layout";
import { BrowserModule } from "@angular/platform-browser";
import { ServiceWorkerModule } from "@angular/service-worker";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";

import { AppRoutingModule } from "./routes/app-routing.module";
import { UserInterfaceModule } from "./user-interface/user-interface.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    UserInterfaceModule,

    BrowserAnimationsModule,
    LayoutModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

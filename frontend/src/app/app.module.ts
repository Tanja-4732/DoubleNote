import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { MainComponent } from "./components/main/main.component";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { NotebooksComponent } from "./components/notebooks/notebooks.component";
import { DrawComponent } from "./components/draw/draw.component";
import { DemoComponent } from "./components/demo/demo.component";
import { FormsModule } from "@angular/forms";
import { TextBoxComponent } from "./components/text-box/text-box.component";
import { PageComponent } from "./components/page/page.component";
import { MarkdownBoxDirective } from './directives/MarkdownBox/markdown-box.directive';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    WelcomeComponent,
    SettingsComponent,
    NotebooksComponent,
    DrawComponent,
    DemoComponent,
    TextBoxComponent,
    PageComponent,
    MarkdownBoxDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

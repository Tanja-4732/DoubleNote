import { DragDropModule } from "@angular/cdk/drag-drop";
import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { CreateNotebookComponent } from "./user-interface/components/create-notebook/create-notebook.component";
import { CrumbTrailComponent } from "./user-interface/components/crumb-trail/crumb-trail.component";
import { DemoComponent } from "./user-interface/components/demo/demo.component";
import { DrawComponent } from "./box-canvas-page/components/draw/draw.component";
import { NotebookCardComponent } from "./user-interface/components/notebook-card/notebook-card.component";
import { NotebooksComponent } from "./user-interface/components/notebooks/notebooks.component";
import { TextBoxComponent } from "./box-canvas-page/components/text-box/text-box.component";
import { AppRoutingModule } from "./routes/app-routing.module";
import { MainComponent } from "./user-interface/components/main/main.component";
import { SettingsComponent } from "./user-interface/components/settings/settings.component";
import { SideNavComponent } from "./user-interface/components/side-nav/side-nav.component";
import { WelcomeComponent } from "./user-interface/components/welcome/welcome.component";

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
    CrumbTrailComponent,
    CreateNotebookComponent,
    NotebookCardComponent,
    SideNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

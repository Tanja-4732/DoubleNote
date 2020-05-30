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
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CreateNotebookComponent } from "./components/create-notebook/create-notebook.component";
import { CrumbTrailComponent } from "./components/crumb-trail/crumb-trail.component";
import { DemoComponent } from "./components/demo/demo.component";
import { DrawComponent } from "./components/draw/draw.component";
import { MainComponent } from "./components/main/main.component";
import { NotebookCardComponent } from "./components/notebook-card/notebook-card.component";
import { NotebooksComponent } from "./components/notebooks/notebooks.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { TextBoxComponent } from "./components/text-box/text-box.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { MarkdownBoxDirective } from "./directives/MarkdownBox/markdown-box.directive";
import { SideNavComponent } from './components/side-nav/side-nav.component';

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
    MarkdownBoxDirective,
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

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./components/main/main.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { NotebooksComponent } from "./components/notebooks/notebooks.component";
import { CrumbTrailComponent } from "./components/crumb-trail/crumb-trail.component";
import { CreateNotebookComponent } from "./components/create-notebook/create-notebook.component";
import { NotebookCardComponent } from "./components/notebook-card/notebook-card.component";
import { SideNavComponent } from "./components/side-nav/side-nav.component";
import { AppRoutingModule } from "../routes/app-routing.module";

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
import { DragDropModule } from "@angular/cdk/drag-drop";
import { BoxCanvasPageModule } from "../box-canvas-page/box-canvas-page.module";
import { SequentialBlockPageModule } from "../sequential-block-page/sequential-block-page.module";
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    MainComponent,
    WelcomeComponent,
    SettingsComponent,
    NotebooksComponent,
    CrumbTrailComponent,
    CreateNotebookComponent,
    NotebookCardComponent,
    SideNavComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,

    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatCardModule,
  ],
  exports: [MainComponent, BoxCanvasPageModule, SequentialBlockPageModule],
})
export class UserInterfaceModule {}

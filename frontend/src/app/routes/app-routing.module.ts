import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WelcomeComponent } from "../user-interface/components/welcome/welcome.component";
import { SettingsComponent } from "../user-interface/components/settings/settings.component";
import { NotebooksComponent } from "../user-interface/components/notebooks/notebooks.component";
import { DemoComponent } from "../box-canvas-page/components/demo/demo.component";

const routes: Routes = [
  // Welcome component
  { path: "welcome", pathMatch: "full", component: WelcomeComponent },

  // Settings component
  { path: "settings", component: SettingsComponent },

  // Notebooks component
  { path: "notebooks", component: NotebooksComponent },

  // Demo component
  { path: "demo", component: DemoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

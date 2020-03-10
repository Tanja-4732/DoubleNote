import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { SettingsComponent } from "./components/settings/settings.component";

const routes: Routes = [
  // Welcome component
  { path: "welcome", pathMatch: "full", component: WelcomeComponent },

  // Settings component
  { path: "settings", component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

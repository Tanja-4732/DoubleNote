import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WelcomeComponent } from "../user-interface/components/welcome/welcome.component";
import { SettingsComponent } from "../user-interface/components/settings/settings.component";
import { NotebooksComponent } from "../user-interface/components/notebooks/notebooks.component";
import { DemoComponent } from "../box-canvas-page/components/demo/demo.component";
import { SbpNotebookComponent } from "../sequential-block-page/components/sbp-notebook/sbp-notebook.component";
import { BcpNotebookComponent } from "../box-canvas-page/components/bcp-notebook/bcp-notebook.component";
import { PageNotFoundComponent } from "../user-interface/components/page-not-found/page-not-found.component";
import { BoxCanvasPageComponent } from "../box-canvas-page/components/box-canvas-page/box-canvas-page.component";
import { ConnectionsComponent } from "../user-interface/components/connections/connections.component";

const routes: Routes = [
  // Welcome component
  { path: "welcome", pathMatch: "full", component: WelcomeComponent },

  // Settings component
  { path: "settings", component: SettingsComponent },

  {
    path: "connections",
    children: [
      { path: "", component: ConnectionsComponent },
      { path: "new/:remoteUuid", component: ConnectionsComponent },
    ],
  },

  // Notebooks component
  {
    path: "notebooks",
    children: [
      { path: "", component: NotebooksComponent },
      {
        path: "bcp/:notebookUuid",
        children: [
          { path: "", component: BcpNotebookComponent },
          { path: "pages/:pageUuid", component: BoxCanvasPageComponent },
        ],
      },
      { path: "sbp/:notebookUuid", component: SbpNotebookComponent },
    ],
  },

  // Demo component
  { path: "demo", component: DemoComponent },

  // Redirect to welcome
  { path: "", pathMatch: "full", redirectTo: "/welcome" },

  // 404 component
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

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
import { CollaborationComponent } from "../user-interface/components/collaboration/collaboration.component";
import { ImportComponent } from "../user-interface/components/import/import.component";
import { ServersComponent } from "../user-interface/components/servers/servers.component";

const routes: Routes = [
  // Welcome component
  { path: "welcome", pathMatch: "full", component: WelcomeComponent },

  // Settings component
  { path: "settings", component: SettingsComponent },

  // Collaboration management
  {
    path: "collaboration",
    children: [
      { path: "", component: CollaborationComponent },
      { path: "add/:remoteUuid", component: CollaborationComponent },
    ],
  },

  // Servers management
  {
    path: "servers",
    children: [
      { path: "", component: ServersComponent },
      { path: "new/:serverUrl", component: ServersComponent },
    ],
  },

  // Notebooks component
  {
    path: "notebooks",
    children: [
      { path: "", component: NotebooksComponent },
      {
        path: "import",
        children: [
          { path: "", component: ImportComponent },
          { path: ":notebookData", component: ImportComponent },
        ],
      },
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

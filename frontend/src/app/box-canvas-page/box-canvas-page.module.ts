import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxComponent } from "./components/text-box/text-box.component";
import { DrawComponent } from "./components/draw/draw.component";
import { DemoComponent } from "./components/demo/demo.component";
import { FormsModule } from "@angular/forms";
import { BcpNotebookComponent } from "./components/bcp-notebook/bcp-notebook.component";
import { BcpVcsComponent } from "./components/bcp-vcs/bcp-vcs.component";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { PipesModule } from "../pipes/pipes.module";
import { CreateBranchComponent } from "./components/create-branch/create-branch.component";
import { BcpTreeComponent } from "./components/bcp-tree/bcp-tree.component";
import { CategoryDialogComponent } from "./components/category-dialog/category-dialog.component";
import { PageDialogComponent } from "./components/page-dialog/page-dialog.component";
import { BoxCanvasPageComponent } from "./components/box-canvas-page/box-canvas-page.component";
import { RouterModule } from "@angular/router";
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    DemoComponent,
    TextBoxComponent,
    DrawComponent,
    BcpNotebookComponent,
    BcpVcsComponent,
    CreateBranchComponent,
    BcpTreeComponent,
    CategoryDialogComponent,
    PageDialogComponent,
    BoxCanvasPageComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    PipesModule,
    RouterModule,
  ],
})
export class BoxCanvasPageModule {}

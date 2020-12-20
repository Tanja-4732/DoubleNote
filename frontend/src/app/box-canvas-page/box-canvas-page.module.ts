import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { MarkdownDirective } from "./directives/markdown/markdown.directive";
import { ContentEditableDirective } from "./directives/content-editable/content-editable.directive";
import { PmBoxComponent } from "./components/pm-box/pm-box.component";
import { CreateTagComponent } from './components/create-tag/create-tag.component';

@NgModule({
  declarations: [
    DemoComponent,
    DrawComponent,
    BcpNotebookComponent,
    BcpVcsComponent,
    CreateBranchComponent,
    BcpTreeComponent,
    CategoryDialogComponent,
    PageDialogComponent,
    BoxCanvasPageComponent,
    ConfirmDialogComponent,
    MarkdownDirective,
    ContentEditableDirective,
    PmBoxComponent,
    CreateTagComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    PipesModule,
    RouterModule,
  ],
  exports: [ConfirmDialogComponent],
})
export class BoxCanvasPageModule {}

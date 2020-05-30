import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextBoxComponent } from "./components/text-box/text-box.component";
import { DrawComponent } from "./components/draw/draw.component";
import { DemoComponent } from "./components/demo/demo.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [DemoComponent, TextBoxComponent, DrawComponent],
  imports: [CommonModule, FormsModule],
})
export class BoxCanvasPageModule {}

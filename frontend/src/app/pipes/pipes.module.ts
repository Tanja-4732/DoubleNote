import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HashPipe } from "./hash/hash.pipe";

@NgModule({
  declarations: [HashPipe],
  imports: [CommonModule],
  exports: [HashPipe],
})
export class PipesModule {}

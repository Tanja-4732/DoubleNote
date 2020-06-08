import { Pipe, PipeTransform } from "@angular/core";
import { hash } from "src/functions/functions";

@Pipe({
  name: "hash",
})
export class HashPipe implements PipeTransform {
  transform(value: any): string {
    return hash(value);
  }
}

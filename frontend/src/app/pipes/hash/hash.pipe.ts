import { Pipe, PipeTransform } from "@angular/core";
import { sha256 } from "js-sha256";
import { fieldHider } from "src/functions/functions";

@Pipe({
  name: "hash",
})
export class HashPipe implements PipeTransform {
  transform(value: any): string {
    return sha256(JSON.stringify(value, fieldHider));
  }
}

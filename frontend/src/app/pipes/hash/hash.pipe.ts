import { Pipe, PipeTransform } from "@angular/core";
import { sha256 } from "js-sha256";

@Pipe({
  name: "hash",
})
export class HashPipe implements PipeTransform {
  transform(value: any): string {
    return sha256(JSON.stringify(value, this.fieldHider));
  }

  private fieldHider = <T>(key: string, value: T): T | undefined =>
    key === "objects" ? undefined : value;
}

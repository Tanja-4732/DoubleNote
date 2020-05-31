import { Injectable } from "@angular/core";
import { sha256 } from "js-sha256";
import { v4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class BcpVcsService {
  constructor() {}

  test() {
    console.log(sha256("Hello World"));
    console.log(sha256(v4()));
  }
}

import { Injectable } from "@angular/core";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";

@Injectable({
  providedIn: "root",
})
export class SbpVcsService {
  constructor() {}

  getNotebooks(): BcpNotebook[] {
    // throw new Error("Method not implemented.");
    return [];
  }
}

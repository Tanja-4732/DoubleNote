import { Injectable } from "@angular/core";
import { sha256 } from "js-sha256";
import { v4 } from "uuid";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import { CategoryTree } from "src/typings/bcp/CategoryTree";

@Injectable({
  providedIn: "root",
})
export class BcpVcsService {
  private notebooks: BcpNotebook[];
  private trees: CategoryTree[];
  private pages: BoxCanvasPage[];

  constructor() {}

  test() {
    console.log(sha256("Hello World"));
    console.log(sha256(v4()));
  }

  createNotebook(name: string): BcpNotebook {}

  commitNotebook(notebook: BcpNotebook) {}

  getNotebooks(): BcpNotebook[] {}

  private getPage(hash: string): BoxCanvasPage {}
  private getCategory(hash: string): CategoryTree {}
  private getRootCategory(notebook: BcpNotebook): CategoryTree {}
}

import { Injectable } from "@angular/core";
import { MdomNode } from "src/app/typings/MDOM";

@Injectable({
  providedIn: "root"
})
export class MarkdownEngineService {
  constructor() {}

  /**
   * Parses a markdown document in string form
   */
  parseMarkdown(text: string): MdomNode[] {
    const result: MdomNode[] = [];
    result.push({ nodeType: "text", text, children: [] });
    return result;
  }
}

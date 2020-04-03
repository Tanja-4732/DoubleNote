import { Injectable } from "@angular/core";
import { MdomNode } from "src/app/typings/MDOM";

@Injectable({
  providedIn: "root"
})
export class MarkdownEngineService {
  constructor() {}

  /**
   * Parses a markdown document in string form
   *
   * This is a recursive function, meaning that it calls itself with slightly
   * altered parameters: A part of the text is parsed, and the rest is sent
   * back into the parser. The line number is sent along as a way for the
   * parser to know which part of the input text correspond to a node in the
   * MDOM tree. This is useful when partial updates are required, as only the
   * affected markdown has to be replaced, and errors can be linted.
   *
   * @param text The (remaining) text to be parsed
   * @param lineNumber The number of the first line inputted from the text
   */
  parseMarkdown(text: string, lineNumber = 0): MdomNode[] {
    const result: MdomNode[] = [];
    result.push({ nodeType: "text", text, children: [] });
    return result;
  }
}

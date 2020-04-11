import { Injectable } from "@angular/core";
import { MdomNode } from "src/app/typings/MDOM";

@Injectable({
  providedIn: "root",
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
    /*
      # Objectives

      - Producing markdown from one MDOM tree should always produce the same markdown
      - Only update the nodes in an existing tree which need to be updated
      - Mark where in the text those nodes belong
        - A node might be
          - created
          - updated
          - removed
      - Support parsing a markdown document from scratch
      - Support partial updates to existing trees

      # Strategy

      See <https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md>

      - Normalize the input
      - Divide the text into block elements
        - Keep track of the line numbers (start & end)
      - Parse inline elements within the block elements
    */

    // TODO think about the parser implementation more thoroughly

    const result: MdomNode[] = [];

    // Normalize newlines
    text = text.replace(/\r\n?|\n/g, "\n");

    // Replace NULL characters
    text = text.replace(/\0/g, "\uFFFD");

    return result;
  }
}

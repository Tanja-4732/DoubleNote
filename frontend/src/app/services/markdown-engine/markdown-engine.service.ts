import { Injectable } from "@angular/core";
import { MdomNode } from "src/typings/markdown/MDOM";

@Injectable({
  providedIn: "root",
})
export class MarkdownEngineService {
  constructor() {}

  /**
   * Generates a string representation of MDOM tree.
   *
   * Parsing the returned string will yield the specified MDOM nodes.
   * This is essentially a reverse-parsing operation.
   *
   * @param mdom The MDOM tree to convert to text
   */
  generateMarkdown(mdom: MdomNode[]): string {
    let temp = "";

    for (const node of mdom) {
      if (node.nodeType === "text") {
        temp += node.text;
        temp += "\n";
      }

      temp += this.generateMarkdown(node.children);
    }

    return temp;
  }

  // TODO (re)move "this is a recursive function" in the following JSDoc

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

      - Normalize the input (see markdown-it)
      - Put the input in a text node
      - Divide the text into block elements
        - Keep track of the line numbers (start & end)
      - Parse inline elements within the block elements
    */

    // TODO think about the parser implementation more thoroughly

    const mdom: MdomNode[] = [];

    // Normalize the input
    text = this.normalizeText(text);

    // Put the input in a text node
    mdom.push({ nodeType: "text", text, children: [] });

    // Block Elements
    this.parseBlockElements(mdom, lineNumber);

    // Inline Elements
    this.parseInlineElements(mdom, lineNumber);

    return mdom;
  }

  /**
   * Normalizes text
   *
   * - Normalize line breaks
   * - Normalize null characters
   */
  private normalizeText(text: string): string {
    return text.replace(/\r\n?|\n/g, "\n").replace(/\0/g, "\uFFFD");
  }

  /**
   * Parses all block elements of a markdown document by mutating an MdomNode array
   *
   * @param mdom The MDOM to be parsed
   * @param lineNumber The line number of the first line (usually zero)
   */
  private parseBlockElements(mdom: MdomNode[], lineNumber: number): void {
    /*

      # Objectives

      Parse blocks in this order (see markdown-it):
      - Table
      - Indented code
      - Block code
      - Hr
      - List
      - Reference // TODO this is not yet defined
      - Heading
      - LHeading // TODO figure out what this is (see <https://github.com/markdown-it/markdown-it/blob/master/lib/parser_block.js#L23>)
      - Paragraph

      The HTML block should be avoided

      # Strategy

      - Parse every element in the received MDOM
        - Remove a text node after it has been parsed
      - Add every created MDOM node to the parseAgain array, which requires additional parsing
      - Call this method recursively for every element in the parseAgain array

      If a text node is encountered, it's safe to assume that it hasn't been parsed yet
    */

    /**
     * A list of MDOM nodes of which the children needs to be again
     */
    const parseAgain: MdomNode[] = [];

    // Avoids parsing nodes created by the method itself
    const originalLength = mdom.length;

    // Parse the blocks
    for (let i = 0; i < originalLength; i++) {
      const node = mdom[i];

      // Handle different kinds of nodes
      switch (node.nodeType) {
        // Handle text nodes
        case "text":
          // Iterate over all lines
          for (const line of node.text.split("\n")) {
            // Parse headings
            if (line.charAt(0) === "#") {
              // Handle headings
              let level = 1;
              let pos = 1;
              let ch = line.charAt(pos);

              while (ch === "#" && level <= 6 && pos < line.length) {
                level++;
                ch = line.charAt(++pos);
              }

              mdom.push({
                nodeType: "heading",
                level,
                children: [
                  {
                    nodeType: "text",
                    children: [],

                    // TODO handle whitespace
                    text: line.substring(pos, line.length + 1),
                  },
                ],
              });
            } else {
              // Handle non-headings
              mdom.push({ nodeType: "text", children: [], text: line });
            }
          }

          // Remove the text node from the MDOM
          mdom.splice(i, 1);
          break;
      }
    }

    // Recursively iterate over all parseAgain elements
    parseAgain.forEach((node) =>
      this.parseBlockElements(node.children, lineNumber)
    );
  }

  /**
   * Parses all inline elements of a markdown document by mutating an MdomNode array
   *
   * @param mdom The MDOM to be parsed
   * @param lineNumber The line number of the first line (usually zero)
   */
  private parseInlineElements(mdom: MdomNode[], lineNumber: number): void {}
}

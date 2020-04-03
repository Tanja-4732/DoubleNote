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
    /*
      # Objectives

      - Producing markdown from one MDOM tree should always produce the same markdown
      - Only update the nodes in an existing tree which need to be updated
      - Mark where in the tree those nodes belong
        - A node might be
          - new
          - updated
          - removed

      # Strategy

      - Support parsing a markdown document from scratch
      - Support partial updates to existing trees

      ## Implementation

      - Check if line is empty
        - Increment line number
        - Cut off the empty line
        - Rerun the parser
      - Use several regexes on one line
      - Search for the first special character
        - Check if it has a backslash in front of it
        - Act based on what it is
    */

    // TODO decide if I want to discard all progress so far and think about the parser implementation more thoroughly

    const result: MdomNode[] = [];

    /**
     * Escape flag
     *
     * Indicates, if the previous character was a backslash
     */
    let escape = false;

    /**
     * Whether the parser is inside a code block
     */
    let codeBlock: "none" | "backticks" | "spaces" = "none";

    /**
     * The level of the heading at the parser location
     */
    let headingLevel = 0;

    /**
     * Whether the parser is inside a comment
     */
    let comment = false;

    /**
     * How many backticks are used in the current inline code segment.
     * If no inline code element is present at the parser location,
     * the value is 0
     */
    let inlineCode = 0;

    /**
     * The column the parser is currently is currently at in a line
     */
    let columnNumber = 0;

    /**
     * How many whitespace characters have been encountered in the current
     * line, but only at its beginning. Null if non-whitespace characters
     * have been encountered in the current line.
     */
    let startingWWhitespace = 0;

    // TODO handle tables
    // TODO handle hr
    // TODO handle images
    // TODO handle quotes
    // TODO handle links
    // TODO handle italics
    // TODO handle bold
    // TODO handle math blocks
    // TODO handle inline math

    // TODO handle tabs

    /**
     * The text the parser is currently working with
     */
    let stack = "";

    // loop
    parserLoop: for (const [i, c] of Array.from(text).entries()) {
      // loop > handle line breaks
      if (c === "\n") {
        lineNumber++;
        columnNumber = -1;
        startingWWhitespace = 0;
        continue parserLoop;
      } else {
        columnNumber++;
      }

      if (
        // loop > normal conditions
        !escape &&
        codeBlock === "none" &&
        headingLevel === 0 &&
        !comment &&
        inlineCode === 0
      ) {
        if (
          // loop > normal conditions > handle heading starts
          startingWWhitespace !== null &&
          startingWWhitespace < 4
        ) {
          switch (c) {
            case " ":
              startingWWhitespace++;
              continue parserLoop;
            case "#":
              headingLevel = 1;
              continue parserLoop;
            default:
              startingWWhitespace = null;
          }
        }

        switch (c) {
          // loop > normal conditions > handle others
          case "\\":
            escape = true;
            break;
          default:
            stack += c;
          // TODO
        }
      } else if (
        // Heading
        headingLevel > 0 &&
        !escape &&
        codeBlock === "none" &&
        !comment &&
        inlineCode === 0
      ) {
      }
    }

    return result;
  }
}

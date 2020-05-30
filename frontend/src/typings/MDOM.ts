/**
 * MarkDown Object Model
 *
 * A syntax tree representing a markdown document
 */
export type MdomNode =
  // Block nodes
  | ParagraphNode
  | HeadingNode
  | ImageNode
  | TableNode
  | HrNode
  | BlockMathNode
  | BlockCodeNode
  | CommentNode
  | BlockQuoteNode
  | IndentedCodeNode

  // Inline nodes
  | TextNode
  | BoldNode
  | ItalicsNode
  | TableCellNode
  | InlineMathNode
  | InlineCodeNode;

interface MdomBaseNode {
  /**
   * The type of the node
   */
  nodeType: // Block nodes
  | "paragraph"
    | "heading"
    | "image"
    | "table"
    | "hr"
    | "blockMath"
    | "blockCode"
    | "comment"
    | "blockQuote"
    | "indentedCode"

    // Inline nodes
    | "text"
    | "bold"
    | "italics"
    | "tableCell"
    | "inlineMath"
    | "inlineCode";

  /**
   * The child-nodes of this node
   */
  children: MdomNode[];
}

/**
 * The atomic text node
 *
 * - Cannot be broken up further
 * - Contains no formatting
 */
export interface TextNode extends MdomBaseNode {
  nodeType: "text";

  /**
   * The text content of the node
   */
  text: string;
}

/**
 * A node representing a table
 *
 * The `columns` property defines the columns of the table,
 * both in how each of them is aligned and how many of them there are.
 *
 * The children represent the cells of the table: left to right,
 * top to bottom (including the header).
 */
export interface TableNode extends MdomBaseNode {
  nodeType: "table";

  /**
   * The columns of the table
   */
  columns: { alignment: "default" | "left" | "center" | "right" }[];
}

/**
 * Wraps the content of a table cell
 *
 * This is required, when several nodes need to be placed inside
 * the same cell of a table, for example when a cell should contain
 * text of which only some portion is supposed to be bold text.
 *
 * This node also contains two boolean values, which represent whether
 * this cell spans up and/or to the right.
 *
 * If either rowSpan OR colSpan are true, the node may not have any children.
 */
export interface TableCellNode extends MdomBaseNode {
  nodeType: "tableCell";

  /**
   * Indicates whether the cell spans up
   */
  rowSpan: boolean;

  /**
   * Indicates whether the cell spans to the right
   */
  colSpan: boolean;
}

export interface BoldNode extends MdomBaseNode {
  nodeType: "bold";
}

export interface ItalicsNode extends MdomBaseNode {
  nodeType: "italics";
}

export interface ImageNode extends MdomBaseNode {
  nodeType: "image";

  /**
   * The source of the image
   */
  source: string;
}

export interface HrNode extends MdomBaseNode {
  nodeType: "hr";

  /**
   * An hr element cannot have children
   */
  children: null;
}

export interface HeadingNode extends MdomBaseNode {
  nodeType: "heading";

  /**
   * The level of the heading
   */
  level: number;

  // TODO revert to the line below
  // level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface InlineMathNode extends MdomBaseNode {
  nodeType: "inlineMath";
}

export interface BlockMathNode extends MdomBaseNode {
  nodeType: "blockMath";
}

export interface InlineCodeNode extends MdomBaseNode {
  nodeType: "inlineCode";
}

export interface BlockCodeNode extends MdomBaseNode {
  nodeType: "blockCode";

  /**
   * The language to be used this code block
   */
  language: string;

  // TODO add support for special language settings such as diagram configs
}

export interface BlockQuoteNode extends MdomBaseNode {
  nodeType: "blockQuote";
}

export interface CommentNode extends MdomBaseNode {
  nodeType: "comment";

  // TODO add support for special comments such as next-slide
}

export interface ParagraphNode extends MdomBaseNode {
  nodeType: "paragraph";
}

export interface IndentedCodeNode extends MdomBaseNode {
  nodeType: "indentedCode";
}

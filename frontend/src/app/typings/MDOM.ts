/**
 * MarkDown Object Model
 *
 * A syntax tree representing a markdown document
 */
export type MdomNode =
  | TextNode
  | HeadingNode
  | ImageNode
  | TableNode
  | HrNode

  // Inline formatting
  | BoldNode
  | ItalicsNode
  | UnderlineNode
  | TableRowNode
  | InlineMathNode
  | BlockMathNode
  | InlineCodeNode
  | BlockCodeNode
  | CommentNode;

interface MdomBaseNode {
  /**
   * The type of the node
   */
  nodeType:
    | "text"
    | "heading"
    | "image"
    | "hr"
    | "comment"

    // Inline formatting
    | "bold"
    | "italics"
    | "underline"

    // Table
    | "table"
    | "tableRow"

    // Math
    | "inlineMath"
    | "blockMath"

    // Code
    | "inlineCode"
    | "blockCode";

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

export interface TableNode extends MdomBaseNode {
  nodeType: "table";

  /**
   * The header row of the table
   */
  header: MdomNode[];

  /**
   * The rows of the table
   */
  children: TableRowNode[];
}

export interface TableRowNode extends MdomBaseNode {
  nodeType: "tableRow";

  /**
   * The cells of the columns of this row
   */
  children: MdomNode[];
}

export interface BoldNode extends MdomBaseNode {
  nodeType: "bold";
}

export interface ItalicsNode extends MdomBaseNode {
  nodeType: "italics";
}

export interface UnderlineNode extends MdomBaseNode {
  nodeType: "underline";
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
  level: 1 | 2 | 3 | 4 | 5 | 6;
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
}

export interface CommentNode extends MdomBaseNode {
  nodeType: "comment";

  //  TODO add support for special comments such as next-slide
}

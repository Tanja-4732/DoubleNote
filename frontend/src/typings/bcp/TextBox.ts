import { MdomNode } from "../markdown/MDOM";

export interface TextBox {
  /**
   * The UUID of the text box
   */
  uuid: string;

  /**
   * Which editor(s) to display in the text box
   */
  state: "both" | "markdown" | "wysiwyg";

  // /**
  //  * The MarkDown Object Model representation of the content of this text box
  //  */
  // mdom: MdomNode[];

  /**
   * The ProseMirror document contained in this box
   */
  pmDoc: string;

  /**
   * The x position of the text box
   */
  x: number;

  /**
   * The y position of the text box
   */
  y: number;

  /**
   * The width of the text box
   */
  width: number;

  /**
   * The height of the text box
   */
  height: number;
}

import { TextBox } from "./TextBox";

export interface BoxCanvasPage {
  /**
   * The UUID of this page
   */
  uuid: string;

  /**
   * The boxes of this page
   */
  boxes: TextBox[];

  /**
   * The title of this page
   */
  title: string;

  // TODO implement drawing support
}

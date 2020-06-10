import { TextBox } from "./TextBox";

export interface BoxCanvasPage {
  /**
   * The title of this page
   */
  title: string;

  /**
   * The UUID of this page which
   * stays the same between edits
   */
  uuid: string;

  strings?: {
    /**
     * The hashes of the boxes of this page
     */
    boxes: string[];
  };

  objects?: {
    /**
     * The boxes of this page
     */
    boxes: TextBox[];
  };

  // TODO implement drawing support
}

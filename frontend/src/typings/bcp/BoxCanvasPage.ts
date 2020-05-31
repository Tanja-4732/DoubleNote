import { TextBox } from "./TextBox";

export interface BoxCanvasPage {
  /**
   * The title of this page
   */
  title: string;

  strings: {
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

import { BoxCanvasPage } from "./BoxCanvasPage";

export interface CategoryTree {
  /**
   * The name of this category
   */
  name: string;

  /**
   * String-based references to the objects of this tree
   */
  strings?: {
    /**
     * The hashes of the child trees
     */
    children: string[];

    /**
     * The hashes of the direct pages of this category
     */
    pages: string[];
  };

  /**
   * The objects of this tree
   */
  objects?: {
    /**
     * The child trees
     */
    children: CategoryTree[];

    /**
     * The direct pages of this category
     */
    pages: BoxCanvasPage[];
  };
}

import { Commit } from "./Commit";
import { BcpTag } from "../bcp/BcpTag";

export type Tag = BcpTag;

export interface BaseTag {
  type: "BCP" | "SBP";

  /**
   * The `new Date().toISOString()` of the tag
   */
  timestamp: string;

  /**
   * The name of the tag
   */
  name: string;

  /**
   * The description of the tag
   */
  description: string;

  /**
   * String-based references to the objects of this tag
   */
  strings: {
    /**
     * The hash of the commit this tag points to
     */
    target: string;
  };

  /**
   * The objects of this tag
   */
  objects?: {
    /**
     * The commit this tag points to
     */
    target: Commit;
  };
}

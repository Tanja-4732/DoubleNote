import { BcpCommit } from "../bcp/BcpCommit";
import { Notebook } from "./Notebook";
import { Commit } from "./Commit";

export type Tag = BcpCommit;

export interface BaseTag {
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

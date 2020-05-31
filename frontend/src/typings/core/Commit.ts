import { BcpCommit } from "../bcp/BcpCommit";
import { Notebook } from "./Notebook";

export type Commit = BcpCommit;

export interface BaseCommit {
  /**
   * The `new Date().toISOString()` of the commit
   */
  timestamp: string;

  /**
   * String-based references to the objects of this commit
   */
  strings: {
    /**
     * The hash of the previous commit
     */
    previous: string;
  };

  /**
   * The objects of this commit
   */
  objects?: {
    /**
     * The previous commit
     */
    previous: Commit;
  };
}

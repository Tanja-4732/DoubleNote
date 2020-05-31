import { BcpCommit } from "../bcp/BcpCommit";
import { Notebook } from "./Notebook";

export type Commit = BcpCommit;

export interface BaseCommit {
  type: "SBP" | "BCP";

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

    /**
     * The UUID of the notebook this commit belongs to
     */
    notebook: string;
  };

  /**
   * The objects of this commit
   */
  objects?: {
    /**
     * The previous commit
     */
    previous: Commit;

    /**
     * The notebook this commit belongs to
     */
    notebook: Notebook;
  };
}

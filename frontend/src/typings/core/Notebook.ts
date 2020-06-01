import { SbpNotebook } from "../sbp/SbpNotebook";
import { BcpNotebook } from "../bcp/BcpNotebook";
import { Commit } from "./Commit";
import { CategoryTree } from "../bcp/CategoryTree";

export type Notebook = SbpNotebook | BcpNotebook;

export interface BaseNotebook {
  name: string;
  type: "SBP" | "BCP";
  uuid: string;

  strings: {
    /**
     * The branches of this notebook
     */
    branches: {
      [
        /**
         * The name of the branch
         */
        name: string
      ]: string;
    };

    /**
     * The hash of the currently selected commit
     */
    head: string;

    /**
     * The hash of the working tree
     *
     * This is the hash root tree node of the working tree
     */
    workingTree: string;
  };

  objects?: {
    /**
     * The branches of this notebook
     */
    branches: {
      [
        /**
         * The name of the branch
         */
        name: string
      ]: Commit;
    };

    /**
     * The currently selected commit
     */
    head: Commit;

    /**
     * The working tree
     *
     * This is the root tree node of the working tree
    // TODO create a universal tree node
     */
    workingTree: any;
  };
}

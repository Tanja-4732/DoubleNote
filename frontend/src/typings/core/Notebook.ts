import { SbpNotebook } from "../sbp/SbpNotebook";
import { BcpNotebook } from "../bcp/BcpNotebook";
import { Commit } from "./Commit";
import { CategoryTree } from "../bcp/CategoryTree";
import { Tag } from "./Tag";
import { Head } from "./Head";

export type Notebook = SbpNotebook | BcpNotebook;

export interface BaseNotebook {
  name: string;
  type: "SBP" | "BCP";
  uuid: string;

  strings: {
    /**
     * The branches of this notebook
     *
     * Every string is a branch name and points to a commit hash
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
     * The hashes of the tags of this notebook
     */
    tags: string[];

    /**
     * The currently selected object
     *
     * This can be:
     *
     * 1. A branch name
     * 2. A tag name
     * 3. A commit hash
     *
     * They will be checked in this order.
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
     * The tags of this notebook
     */
    tags: Tag[];

    /**
     * The commit or branch to which the HEAD points to
     */
    head: Head;

    /**
     * The working tree
     *
     * This is the root tree node of the working tree
    // TODO create a universal tree node
     */
    workingTree: any;
  };
}

import { BoxCanvasPage } from "./BoxCanvasPage";
import { BaseNotebook } from "../core/Notebook";
import { BcpCommit } from "./BcpCommit";
import { CategoryTree } from "./CategoryTree";
/**
 * A notebook on the box canvas page model
 */
export interface BcpNotebook extends BaseNotebook {
  type: "BCP";

  objects?: {
    branches: {
      [name: string]: BcpCommit;
    };

    head: BcpCommit; // TODO

    /**
     * The working tree
     *
     * This is the root tree node of the working tree
     */
    workingTree: CategoryTree;
  };
}

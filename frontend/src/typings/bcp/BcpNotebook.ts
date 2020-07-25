import { BaseNotebook } from "../core/Notebook";
import { BcpCommit } from "./BcpCommit";
import { BcpTag } from "./BcpTag";
import { CategoryTree } from "./CategoryTree";
/**
 * A notebook on the box canvas page model
 */
export interface BcpNotebook extends BaseNotebook {
  type: "BCP";

  objects?: BaseNotebook["objects"] & {
    branches: {
      [name: string]: BcpCommit;
    };

    /**
     * The working tree
     *
     * This is the root tree node of the working tree
     */
    workingTree: CategoryTree;

    tags: BcpTag[];
  };
}

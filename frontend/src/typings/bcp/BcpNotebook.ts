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
    /**
     * The branches of this notebook
     */
    branches: {
      [
        /**
         * The name of the branch
         */
        name: string
      ]: BcpCommit;
    };
  };
}

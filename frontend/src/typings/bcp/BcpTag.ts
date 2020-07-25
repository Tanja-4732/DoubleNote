import { BaseTag } from "../core/Tag";
import { BcpCommit } from "./BcpCommit";

export interface BcpTag extends BaseTag {
  type: "BCP";

  objects?: {
    target: BcpCommit;
  };
}

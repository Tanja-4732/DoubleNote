import { BaseTag } from "../core/Tag";
import { BcpCommit } from "./BcpCommit";

export interface BcpTag extends BaseTag {
  objects?: {
    target: BcpCommit;
  };
}

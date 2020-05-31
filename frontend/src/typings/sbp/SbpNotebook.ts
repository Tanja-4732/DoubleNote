import { SequentialBlockPage } from "./SequentialBlockPage";
import { BaseNotebook } from "../core/Notebook";
/**
 * A notebook baded on the sequential block page model
 */
export interface SbpNotebook extends BaseNotebook {
  type: "SBP";
  pages: SequentialBlockPage[];
}

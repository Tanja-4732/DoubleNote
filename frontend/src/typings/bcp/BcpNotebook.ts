import { BoxCanvasPage } from "./BoxCanvasPage";
import { BaseNotebook } from "../core/Notebook";
/**
 * A notebook on the box canvas page model
 */
export interface BcpNotebook extends BaseNotebook {
  type: "BCP";
  pages: BoxCanvasPage[];
}

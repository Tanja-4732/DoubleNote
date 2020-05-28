import { BoxCanvasPage } from "./BoxCanvasPage";
import { SequentialBlockPage } from "./SequentialBlockPage";

export type Notebook = SbpNotebook | BcpNotebook;

interface BaseNotebook {
  title: string;
  type: "SBP" | "BCP";
}

/**
 * A notebook baded on the sequential block page model
 */
export interface SbpNotebook extends BaseNotebook {
  type: "SBP";

  pages: SequentialBlockPage[];
}

/**
 * A notebook on the box canvas page model
 */
export interface BcpNotebook extends BaseNotebook {
  type: "BCP";

  pages: BoxCanvasPage[];
}

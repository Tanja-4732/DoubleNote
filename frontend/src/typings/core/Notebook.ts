import { SbpNotebook } from "../sbp/SbpNotebook";
import { BcpNotebook } from "../bcp/BcpNotebook";

export type Notebook = SbpNotebook | BcpNotebook;

export interface BaseNotebook {
  title: string;
  type: "SBP" | "BCP";
  uuid: string;
}

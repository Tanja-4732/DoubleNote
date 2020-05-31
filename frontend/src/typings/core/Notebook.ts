import { SbpNotebook } from "../sbp/SbpNotebook";
import { BcpNotebook } from "../bcp/BcpNotebook";
import { Commit } from "./Commit";

export type Notebook = SbpNotebook | BcpNotebook;

export interface BaseNotebook {
  name: string;
  type: "SBP" | "BCP";
  uuid: string;

  commits: Commit[];
}

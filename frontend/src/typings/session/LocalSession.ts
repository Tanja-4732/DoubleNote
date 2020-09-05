import { NotebookShare } from "./NotebookShare";
import { BaseSession } from "./Session";
import { SessionGuest } from "./SessionGuest";

export interface LocalSession extends BaseSession {
  type: "local";

  /**
   * The notebooks to share
   */
  shares: NotebookShare[];

  /**
   * The members of this session
   */
  guests: SessionGuest[];
}

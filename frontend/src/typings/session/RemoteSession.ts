import { NotebookShare } from "./NotebookShare";
import { BaseSession } from "./Session";
import { SessionHost } from "./SessionHost";

export interface RemoteSession extends BaseSession {
  type: "remote";

  /**
   * The members of this session
   */
  host: SessionHost;
}

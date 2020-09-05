import { NotebookShare } from "./NotebookShare";
import { BaseSession } from "./Session";
import { SessionHost } from "./SessionHost";

export interface RemoteSession extends BaseSession {
  type: "remote";

  /**
   * The UUID of the session host/owner
   *
   * Used to determine whether this is a local session or a remote session
   */
  hostUuid: string;

  /**
   * The notebooks to share
   */
  shares: NotebookShare[];

  /**
   * The members of this session
   */
  host: SessionHost;
}

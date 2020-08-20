export interface Session {
  /**
   * The UUID of the session host/owner
   */
  hostUuid: string;

  /**
   * If the user is the host of the session
   */
  amHost: boolean;

  /**
   * The notebooks to share
   */
  shares: NotebookShare[];
}

export interface NotebookShare {
  /**
   * The type of the shared notebook
   */
  type: "BCP" | "SBP";

  /**
   * The UUID of the shared notebook
   */
  uuid: string;

  /**
   * If write access is enabled
   */
  writable: boolean;
}

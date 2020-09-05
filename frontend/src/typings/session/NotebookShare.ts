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

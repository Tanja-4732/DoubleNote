import { Commit } from "./Commit";

export type Head = CommitHead | BranchHead;

interface BaseHead {
  type: "commit" | "branch";

  /**
   * Whether the HEAD is in a detached state
   *
   * This is the case if the HEAD doesn't directly point to a branch.
   */
  detached: boolean;
}

export interface CommitHead extends BaseHead {
  type: "commit";

  detached: true;

  /**
   * The commit to which the detached HEAD points to
   */
  commit: Commit;
}

export interface BranchHead extends BaseHead {
  type: "branch";

  detached: false;

  /**
   * The name of the branch to which the HEAD points to
   */
  name: string;

  /**
   * The commit behind the selected branch
   */
  commit: Commit;
}

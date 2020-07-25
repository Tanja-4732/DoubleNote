import { Commit } from "./Commit";

export type Head = DetachedHead | BranchHead;

interface BaseHead {
  /**
   * Whether the HEAD is in a detached state
   *
   * This is the case if the HEAD doesn't directly point to a branch.
   */
  detached: true | false;
}

export interface DetachedHead extends BaseHead {
  detached: true;

  /**
   * The commit to which the detached HEAD points to
   */
  commit: Commit;
}

export interface BranchHead extends BaseHead {
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

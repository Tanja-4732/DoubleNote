import { Commit } from "./Commit";

export type Head = CommitHead | BranchHead | TagHead;

interface BaseHead {
  type: "commit" | "branch" | "tag";
}

export interface CommitHead extends BaseHead {
  type: "commit";
  commit: Commit;
}

export interface BranchHead extends BaseHead {
  tag: "branch";
}

export interface TagHead extends BaseHead {
  type: "tag";
}

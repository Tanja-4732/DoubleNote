import { Injectable } from "@angular/core";
import { sha256 } from "js-sha256";
import { v4 } from "uuid";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import { CategoryTree } from "src/typings/bcp/CategoryTree";
import { BcpCommit } from "src/typings/bcp/BcpCommit";
import { TextBox } from "src/typings/bcp/TextBox";
import { cloneDeep } from "lodash";
import { fieldHider } from "src/functions/functions";

@Injectable({
  providedIn: "root",
})
export class BcpVcsService {
  public readonly notebooks: BcpNotebook[] =
    JSON.parse(window.localStorage.getItem("dn.bcp.notebooks")) ?? [];

  private readonly commits: { [hash: string]: BcpCommit } =
    JSON.parse(window.localStorage.getItem("dn.bcp.commits")) ?? {};

  private readonly trees: { [hash: string]: CategoryTree } =
    JSON.parse(window.localStorage.getItem("dn.bcp.trees")) ?? {};

  private readonly pages: { [hash: string]: BoxCanvasPage } =
    JSON.parse(window.localStorage.getItem("dn.bcp.pages")) ?? {};

  private readonly boxes: { [hash: string]: TextBox } =
    JSON.parse(window.localStorage.getItem("dn.bcp.boxes")) ?? {};

  /**
   * ## Box Canvas Page version control system
   *
   * A utility class managing the state of BCP notebooks
   *
   * ### Goals
   *
   * - Create new BCP notebooks
   * - Save the state of a BCP notebook as a commit
   * - De-duplicate all data
   * - Read data from localStorage
   * - Persist data to localStorage
   */
  constructor() {
    this.notebooks.forEach((n) => this.prepareNotebook(n));
  }

  /**
   * Creates a commit of the specified BCP notebook on its HEAD branch
   * copying its object-representation working tree into the commit to be
   * used as its root tree.
   *
   * This method will persist the working tree before
   * committing unless the opposite is specified.
   *
   * @param notebook The notebook to be committed
   */
  commitNotebook(notebook: BcpNotebook, persistWorkingTree = true): void {
    if (persistWorkingTree) {
      this.persistWorkingTree(notebook);
    }

    const commit: BcpCommit = {
      timestamp: new Date().toISOString(),
      strings: {
        previous: notebook.strings.head,
        rootCategory: notebook.strings.workingTree,
      },
      objects: {
        previous: notebook.objects.head,
        rootCategory: notebook.objects.workingTree,
      },
    };

    // Calculate the hash of the commit
    const commitHash = sha256(JSON.stringify(commit, fieldHider));

    // Save the commit
    this.commits[commitHash] = commit;

    // Update the
    notebook.strings.selectedBranch = name;

    // Update the active branch
    const selectedBranch = notebook.strings.selectedBranch;
    notebook.strings.branches[selectedBranch] = notebook.strings.head;
    notebook.objects.branches[selectedBranch] = notebook.objects.head;

    // Persist everything
    this.persistNotebooks();
    this.persistCommits();

    // Get the working tree ready
    this.replaceWorkingTreeWithHeadCopy(notebook);
  }

  /**
   * Creates a new branch with a specified name
   * for a BCP notebook, based on the specified commit.
   *
   * This process does not create a new commit. Instead, the new branch
   * will point to the specified commit hash directly.
   *
   * The new branch will be checked out automatically.
   *
   * @param notebook The notebook for which a branch should be created
   * @param name The name of the branch to be created (may not exist already)
   * @param source The hash of the parent commit on which the branch should be based on
   */
  createBranch(notebook: BcpNotebook, name: string, source: string): void {
    // Check if the branch exists already
    if (notebook.strings.branches.hasOwnProperty(name)) {
      throw new Error("Branch exists already");
    }

    // Get the source commit
    const commit = this.commits[source];

    // Make sure the specified commit exists
    if (commit == null) {
      throw new Error("The specified commit does not exist");
    }

    // Create the new branch
    notebook.strings.branches[name] = source;
    notebook.objects.branches[name] = commit;

    // Set the active branch
    notebook.strings.selectedBranch = name;

    // Persist the new branch
    this.persistNotebooks();
  }

  /**
   * Checks out a specified branch in a specified notebook
   *
   * This moves the HEAD to the specified branch.
   * The branch must exist in the notebook.
   *
   * If the working tree contains uncommitted changes,
   * the checkout will fail with an error, expect for when
   * the force flag is set, which may lead to data loss.
   *
   * @param notebook The notebook to be updated
   * @param branch The name of the branch to be checked out
   * @param force Whether to force the checkout process (may result in data loss)
   */
  checkoutBranch(notebook: BcpNotebook, branch: string, force = false): void {
    // Check if the branch exists
    if (!notebook.strings.branches.hasOwnProperty(branch)) {
      throw new Error("The specified branch does not exist");
    }

    // Prevent unwanted data loss
    if (
      !force &&
      this.commits[notebook.strings.head].strings.rootCategory !==
        notebook.strings.workingTree
    ) {
      throw new Error(
        "The working tree contains uncommitted changes and the force flag was not set"
      );
    }

    // Move the HEAD to the specified branch
    notebook.strings.head = notebook.strings.branches[branch];
    notebook.objects.head = notebook.objects.branches[branch];

    // Set the active branch
    notebook.strings.selectedBranch = branch;

    // Copy the working tree
    this.replaceWorkingTreeWithHeadCopy(notebook);
  }

  /**
   * Saves the uncommitted changes without committing them
   *
   * You must call this method before creating a commit.
   *
   * @param notebook The notebook of which to save the working tree
   */
  persistWorkingTree(notebook: BcpNotebook): void {
    const hash = this.saveTree(notebook.objects.workingTree);
    notebook.strings.workingTree = hash;

    // Persist everything
    // Saving the working tree does not produce a commit
    this.persistBoxes();
    this.persistPages();
    this.persistTrees();
    this.persistNotebooks();
  }

  /**
   * Creates a new notebook and commits it
   *
   * @param name The name of the notebook to be created
   */
  createNotebook(name: string): BcpNotebook {
    // Create a tree to be used as root
    const tree: CategoryTree = {
      name: "root",
      strings: {
        pages: [],
        children: [],
      },
    };

    // Calculate the hash of the tree
    const treeHash: string = sha256(JSON.stringify(tree, fieldHider));

    // Create a new commit
    const commit: BcpCommit = {
      timestamp: new Date().toISOString(),
      strings: {
        previous: "root",
        rootCategory: treeHash,
      },
    };

    // Calculate the hash of the commit
    const commitHash: string = sha256(JSON.stringify(commit, fieldHider));

    // Create a new notebook
    const notebook: BcpNotebook = {
      name,
      uuid: v4(),
      type: "BCP",
      strings: {
        branches: {
          master: commitHash,
        },
        head: commitHash,
        workingTree: treeHash,
        selectedBranch: "master",
      },
    };

    // Insert everything into memory
    this.trees[treeHash] = tree;
    this.commits[commitHash] = commit;
    this.notebooks.push(notebook);

    // Initialize the notebook
    this.prepareNotebook(notebook);

    // Prepare the working tree
    this.replaceWorkingTreeWithHeadCopy(notebook);

    // Persist everything
    this.persistTrees();
    this.persistCommits();
    this.persistNotebooks();

    // Return the new notebook
    return notebook;
  }

  /**
   * Replaces the working tree object-representation
   * with a copy of the HEAD root tree
   *
   * This method automatically persists the new working tree.
   *
   * @param notebook The notebook of which to replace the working tree
   */
  private replaceWorkingTreeWithHeadCopy(notebook: BcpNotebook): void {
    // Make a deep clone of the HEAD's root tree
    notebook.objects.workingTree = cloneDeep(
      notebook.objects.head.objects.rootCategory
    );

    // Since the tree didn't change, its hash stays the same as well
    notebook.strings.workingTree = notebook.objects.head.strings.rootCategory;

    // Persist the new working tree
    this.persistWorkingTree(notebook);
  }

  /**
   * Prepares a notebook's object representation
   *
   * This method loads data from the string-representation
   * into the object-representation of the specified notebook.
   *
   * This procedure also updates the working tree of the notebook.
   *
   * @param notebook The notebook to prepare
   */
  private prepareNotebook(notebook: BcpNotebook) {
    // Prepare the target data structure
    notebook.objects = {
      branches: {},
      head: null,
      workingTree: null,
    };

    // Initialize every branch
    for (const [branchName, latestCommitHash] of Object.entries(
      notebook.strings.branches
    )) {
      // Get the last commit
      notebook.objects.branches[branchName] = this.commits[latestCommitHash];

      // Prepare the target data structure
      notebook.objects.branches[branchName].objects = {
        previous: null,
        rootCategory: null,
      };

      // Set the root category
      notebook.objects.branches[branchName].objects.rootCategory = this.trees[
        notebook.objects.branches[branchName].strings.rootCategory
      ];

      // Load the branch tree
      this.loadTree(notebook.objects.branches[branchName].objects.rootCategory);
    }

    // Set the head
    notebook.objects.head = this.commits[notebook.strings.head];

    // Get the working tree ready
    notebook.objects.workingTree = cloneDeep(
      this.trees[notebook.strings.workingTree]
    );
    this.loadWorkingTree(notebook.objects.workingTree);
  }

  /**
   * Initializes a category; ie it recursively loads its data into memory
   * by creating copies of existing data in memory, thus avoiding mutations
   *
   * @param category The category to be initialized
   */
  private loadWorkingTree(category: CategoryTree): void {
    // Prepare the target data structure
    category.objects = { pages: [], children: [] };

    // Load the pages
    for (const pageHash of category.strings.pages) {
      const page = cloneDeep(this.pages[pageHash]);
      category.objects.pages.push(page);

      // Prepare the target data structure
      page.objects = { boxes: [] };

      // Initialize the page
      for (const boxHash of page.strings.boxes) {
        const box = cloneDeep(this.boxes[boxHash]);
        page.objects.boxes.push(box);
      }
    }

    // Recursively initialize all child categories
    for (const treeHash of category.strings.children) {
      // This operation is not very expensive, as the
      // object-representations in the children aren't loaded yet
      const child = cloneDeep(this.trees[treeHash]);
      category.objects.children.push(child);
      this.loadWorkingTree(child);
    }
  }

  /**
   * Initializes a category; ie it recursively loads its data into memory
   * by referencing existing data in memory, possibly leading to mutations
   *
   * @param category The category to be initialized
   */
  private loadTree(category: CategoryTree): void {
    // Prepare the target data structure
    category.objects = { pages: [], children: [] };

    // Load the pages
    for (const pageHash of category.strings.pages) {
      const page = this.pages[pageHash];
      category.objects.pages.push(page);

      // Prepare the target data structure
      page.objects = { boxes: [] };

      // Initialize the page
      for (const boxHash of page.strings.boxes) {
        const box = this.boxes[boxHash];
        page.objects.boxes.push(box);
      }
    }

    // Recursively initialize all child categories
    for (const treeHash of category.strings.children) {
      const child = this.trees[treeHash];
      category.objects.children.push(child);
      this.loadTree(child);
    }
  }

  /**
   * Persists a category recursively to memory
   *
   * @param category The category to be persisted
   * @return The hash of this category
   */
  private saveTree(category: CategoryTree): string {
    // Prepare the target data structure
    category.strings = { pages: [], children: [] };

    // Iterate over all pages of the category
    for (const page of category.objects.pages) {
      // Prepare the target data structure
      page.strings = { boxes: [] };

      // Iterate over all boxes of the page
      for (const box of page.objects.boxes) {
        const boxHash = sha256(JSON.stringify(box, fieldHider));
        this.boxes[boxHash] = box;
        page.strings.boxes.push(boxHash);
      }

      const pageHash = sha256(JSON.stringify(page, fieldHider));
      this.pages[pageHash] = page;
      category.strings.pages.push(pageHash);
    }

    for (const tree of category.objects.children) {
      category.strings.children.push(this.saveTree(tree));
    }

    const hash = sha256(JSON.stringify(category, fieldHider));
    this.trees[hash] = category;
    return hash;
  }

  /**
   * Persists the notebooks to localStorage
   */
  private persistNotebooks(): void {
    window.localStorage.setItem(
      "dn.bcp.notebooks",
      JSON.stringify(this.notebooks, fieldHider)
    );
  }

  /**
   * Persists the commits to localStorage
   */
  private persistCommits(): void {
    window.localStorage.setItem(
      "dn.bcp.commits",
      JSON.stringify(this.commits, fieldHider)
    );
  }

  /**
   * Persists the trees to localStorage
   */
  private persistTrees(): void {
    window.localStorage.setItem(
      "dn.bcp.trees",
      JSON.stringify(this.trees, fieldHider)
    );
  }

  /**
   * Persists the pages to localStorage
   */
  private persistPages(): void {
    window.localStorage.setItem(
      "dn.bcp.pages",
      JSON.stringify(this.pages, fieldHider)
    );
  }

  /**
   * Persists the boxes to localStorage
   */
  private persistBoxes(): void {
    window.localStorage.setItem(
      "dn.bcp.boxes",
      JSON.stringify(this.boxes, fieldHider)
    );
  }
}

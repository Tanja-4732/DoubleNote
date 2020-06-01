import { Injectable } from "@angular/core";
import { sha256 } from "js-sha256";
import { v4 } from "uuid";
import { BcpNotebook } from "src/typings/bcp/BcpNotebook";
import { BoxCanvasPage } from "src/typings/bcp/BoxCanvasPage";
import { CategoryTree } from "src/typings/bcp/CategoryTree";
import { BcpCommit } from "src/typings/bcp/BcpCommit";
import { TextBox } from "src/typings/bcp/TextBox";

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
    this.initNotebooks();
  }

  commitNotebook(notebook: BcpNotebook) {
    // TODO implement
    throw new Error("Not implemented");
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
      strings: { pages: [], children: [] },
    };

    // Calculate the hash of the tree
    const treeHash: string = sha256(JSON.stringify(tree));

    // Create a new commit
    const commit: BcpCommit = {
      timestamp: new Date().toISOString(),
      strings: { previous: "root", rootCategory: treeHash },
    };

    // Calculate the hash of the commit
    const commitHash: string = sha256(JSON.stringify(commit));

    // Create a new notebook
    const notebook: BcpNotebook = {
      name,
      uuid: v4(),
      type: "BCP",
      strings: { branches: { master: commitHash } },
    };

    // Insert everything into memory
    this.trees[treeHash] = tree;
    this.commits[commitHash] = commit;
    this.notebooks.push(notebook);

    // Persist everything
    this.persistTrees();
    this.persistCommits();
    this.persistNotebooks();

    // Return the new notebook
    return notebook;
  }

  private initNotebooks(): void {
    // For every notebook
    for (const notebook of this.notebooks) {
      // Prepare the target data structure
      notebook.objects = { branches: {} };

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
        this.initCategory(
          notebook.objects.branches[branchName].objects.rootCategory
        );
      }
    }
  }

  /**
   * Initializes a category; ie it recursively loads its data into memory
   *
   * @param category The category to be initialized
   */
  private initCategory(category: CategoryTree): void {
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
        page.objects.boxes.push(this.boxes[boxHash]);
      }
    }

    // Recursively initialize all child categories
    for (const treeHash of category.strings.children) {
      category.objects.children.push(this.trees[treeHash]);
      this.initCategory(this.trees[treeHash]);
    }
  }

  /**
   * Persists the notebooks to localStorage
   */
  private persistNotebooks(): void {
    window.localStorage.setItem(
      "dn.bcp.notebooks",
      JSON.stringify(this.notebooks)
    );
  }

  /**
   * Persists the commits to localStorage
   */
  private persistCommits(): void {
    window.localStorage.setItem("dn.bcp.commits", JSON.stringify(this.commits));
  }

  /**
   * Persists the trees to localStorage
   */
  private persistTrees(): void {
    window.localStorage.setItem("dn.bcp.trees", JSON.stringify(this.trees));
  }

  /**
   * Persists the pages to localStorage
   */
  private persistPages(): void {
    window.localStorage.setItem("dn.bcp.pages", JSON.stringify(this.pages));
  }

  /**
   * Persists the boxes to localStorage
   */
  private persistBoxes(): void {
    window.localStorage.setItem("dn.bcp.boxes", JSON.stringify(this.boxes));
  }
}

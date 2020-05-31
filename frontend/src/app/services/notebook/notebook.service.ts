import { Injectable } from "@angular/core";
import { Notebook } from "src/typings/core/Notebook";

@Injectable({
  providedIn: "root",
})
/**
 * @deprecated
 *
 */
export class NotebookService {
  /**
   * @deprecated
   */
  constructor() {
    this.load();
  }

  /**
   * @deprecated
   */
  notebooks: Notebook[];

  /**
   * @deprecated
   *
   * Reads the notebooks from localStorage
   */
  private load() {
    this.notebooks = JSON.parse(localStorage.getItem("notebooks")) ?? [];
  }

  /**
   * @deprecated
   *
   * Persist the notebooks to localStorage
   */
  public persist() {
    localStorage.setItem("notebooks", JSON.stringify(this.notebooks));
  }
}

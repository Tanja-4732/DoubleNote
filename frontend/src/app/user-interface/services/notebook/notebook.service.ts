import { Injectable } from "@angular/core";
import { Notebook } from "src/typings/Notebook";

@Injectable({
  providedIn: "root",
})
export class NotebookService {
  constructor() {
    this.load();
  }

  private privateNotebooks: Notebook[];

  public get notebooks(): Notebook[] {
    return this.privateNotebooks;
  }

  public set notebooks(value: Notebook[]) {
    this.privateNotebooks = value;
    this.persist();
  }

  /**
   * Reads the notebooks from localStorage
   */
  private load() {
    this.notebooks = JSON.parse(localStorage.getItem("notebooks")) ?? [];
  }

  /**
   * Persist the notebooks to localStorage
   */
  public persist() {
    localStorage.setItem("notebooks", JSON.stringify(this.notebooks));
  }
}

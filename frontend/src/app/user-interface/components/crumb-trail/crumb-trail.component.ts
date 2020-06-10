import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-crumb-trail",
  templateUrl: "./crumb-trail.component.html",
  styleUrls: ["./crumb-trail.component.scss"],
})
export class CrumbTrailComponent implements OnInit {
  constructor() {}

  /**
   * An accessor to make the static variable available in the template
   */
  get crumbs(): Crumb[] {
    return CrumbTrailComponent.crumbs;
  }

  /**
   * A list of crumbs to be displayed
   */
  public static crumbs: Crumb[] = [];

  ngOnInit() {}
}

/**
 * The icons of the application
 */
export enum Icon {
  Auth = "vpn_key",
  Scan = "camera",
  Add = "add",
  Welcome = "home",
  Category = "local_offer",
  Notebook = "book",
  Settings = "settings",
  Demo = "bug_report",
  Error = "error",
  Notebooks = "collections_bookmark",
  OpenInNewTab = "open_in_new",
  SourceCode = "code",
  License = "gavel",
  Page = "insert_drive_file",
  OpenPage = "open_in_browser",
  CreatePage = "note_add",
  CreateCategory = "create_new_folder",
  Edit = "edit",
}

/**
 * An item in the CrumbTrail
 */
export interface Crumb {
  /**
   * Determines the icon to be used
   */
  icon?: Icon;

  /**
   * The title of the crumb
   */
  title: string;

  /**
   * Where this crumb should link to
   */
  routerLink?: string;
}

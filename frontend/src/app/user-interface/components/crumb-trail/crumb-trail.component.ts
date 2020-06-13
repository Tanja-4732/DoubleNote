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
export enum Icons {
  Menu = "menu",
  MenuOpen = "menu_open",
  Auth = "vpn_key",
  Scan = "camera",
  Add = "add",
  Welcome = "home",
  Category = "local_offer",
  Notebook = "book",
  Settings = "settings",
  // Settings = "miscellaneous_services",
  Demo = "bug_report",
  Error = "error",
  Notebooks = "collections_bookmark",
  OpenInNewTab = "open_in_new",
  SourceCode = "code",
  License = "gavel",
  Page = "insert_drive_file",
  OpenPage = "read_more",
  OpenPage2 = "open_in_browser",
  OpenPage3 = "text_snippet",
  CreatePage = "note_add",
  CreateCategory = "create_new_folder",
  Edit = "edit",
  MultiUser = "record_voice_over",
  MultiUser2 = "leak_add",
  MultiUser3 = "rss_feed",
  MultiUser4 = "alt_route",
  MultiUser5 = "multiple_stop",
  NoMultiUser = "voice_over_off",
  NoMultiUser2 = "leak_remove",
}

/**
 * An item in the CrumbTrail
 */
export interface Crumb {
  /**
   * Determines the icon to be used
   */
  icon?: Icons;

  /**
   * The title of the crumb
   */
  title: string;

  /**
   * Where this crumb should link to
   */
  routerLink?: string;
}

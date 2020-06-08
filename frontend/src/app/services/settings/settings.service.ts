import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})

/**
 * This is the central settings management of the application
 *
 * Set and get accessors provide default values and persist the users choices automatically
 */
export class SettingsService {
  constructor() {
    this.loadSettings();
  }

  /**
   * The cached settings
   */
  private settings: Settings;

  /**
   * Reads the settings from localStorage
   */
  private loadSettings() {
    this.settings = JSON.parse(localStorage.getItem("dn.settings")) ?? {};
  }

  /**
   * Persist the settings to localStorage
   */
  private saveData() {
    localStorage.setItem("dn.settings", JSON.stringify(this.settings));
  }

  get offlineMode(): boolean {
    return this.settings.enableOfflineMode ?? true;
  }

  set offlineMode(value: boolean) {
    this.settings.enableOfflineMode = value;
    this.saveData();
  }

  get sideNavOpened(): boolean {
    return this.settings.sideNavOpened ?? true;
  }

  set sideNavOpened(value: boolean) {
    this.settings.sideNavOpened = value;
    this.saveData();
  }
}

/**
 * The settings object for the application
 */
interface Settings {
  enableOfflineMode: boolean;
  sideNavOpened: boolean;
}

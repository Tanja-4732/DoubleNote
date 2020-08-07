import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

/**
 * This is the central settings management of the application
 *
 * Set and get accessors provide default values and persist the users choices automatically
 */
export class SettingsService {
  /**
   * A subject of the offline mode
   */
  private readonly subject: BehaviorSubject<boolean>;

  /**
   * An observable of the offline mode
   */
  public readonly observable: Observable<boolean>;

  constructor() {
    this.loadSettings();
    this.subject = new BehaviorSubject(this.offlineMode);
    this.observable = this.subject.asObservable();
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
    this.subject.next(value);
  }

  get formatBars(): boolean {
    return this.settings.enableFormatBars ?? true;
  }

  set formatBars(value: boolean) {
    this.settings.enableFormatBars = value;
    this.saveData();
    this.subject.next(value);
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
  enableFormatBars: boolean;
  sideNavOpened: boolean;
}

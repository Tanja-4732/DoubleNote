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
  private readonly offlineModeSubject: BehaviorSubject<boolean>;

  /**
   * An observable of the offline mode
   */
  public readonly offlineModeObservable: Observable<boolean>;

  /**
   * A subject of the format bars
   */
  private readonly formatBarsSubject: BehaviorSubject<boolean>;

  /**
   * An observable of the format bars
   */
  public readonly formatBarsObservable: Observable<boolean>;

  constructor() {
    // Read the settings from localStorage
    this.settings = JSON.parse(localStorage.getItem("dn.settings") ?? "{}");

    // Offline mode
    this.offlineModeSubject = new BehaviorSubject(this.offlineMode);
    this.offlineModeObservable = this.offlineModeSubject.asObservable();

    // Format bars
    this.formatBarsSubject = new BehaviorSubject(this.formatBars);
    this.formatBarsObservable = this.formatBarsSubject.asObservable();
  }

  /**
   * The cached settings
   */
  private settings: Settings;

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
    this.offlineModeSubject.next(value);
  }

  get formatBars(): boolean {
    return this.settings.enableFormatBars ?? true;
  }

  set formatBars(value: boolean) {
    this.settings.enableFormatBars = value;
    this.saveData();
    this.formatBarsSubject.next(value);
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

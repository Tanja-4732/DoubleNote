/**
 * Defines the behavior of the VCS UI
 */
export enum TabBehaviour {
  /**
   * Always display all content in a card-grid
   */
  OnlyUseCards = "OnlyUseCards",

  /**
   * Switch between a card-grid and a tab-based
   * approach based on the current screen width
   */
  Responsive = "Responsive",

  /**
   * Always separate content into multiple tabs
   */
  AlwaysUseTabs = "AlwaysUseTabs",
}

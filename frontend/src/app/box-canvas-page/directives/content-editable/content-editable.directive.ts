import { Directive, HostListener, Output, EventEmitter } from "@angular/core";

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: "[keyEvent]",
})
export class ContentEditableDirective {
  @Output()
  keyEvent = new EventEmitter<any>();

  private readonly exempt = [
    // Arrow keys
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",

    // Home & End keys
    "Home",
    "End",

    // Page up and down keys
    "PageUp",
    "PageDown",

    // Modifier keys
    "Control",
    "Shift",
    "Alt",
    "Meta",
    "AltGraph",

    // Some F keys
    "F1",
    "F5",
    "F12",
  ];

  private readonly ctrlExempt = ["a"];

  constructor() {}

  @HostListener("keydown", ["$event"])
  onKeydown(event: KeyboardEvent) {
    // Ignore exempt keys
    if ((event.ctrlKey ? this.ctrlExempt : this.exempt).includes(event.key)) {
      return;
    }

    // Prevent the contentEditable form being edited directly
    event.preventDefault();

    this.keyEvent.next(event);
  }
}

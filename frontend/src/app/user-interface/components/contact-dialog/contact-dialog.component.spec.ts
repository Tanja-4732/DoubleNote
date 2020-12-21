import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ContactDialogComponent } from "./contact-dialog.component";

describe("ContactDialogComponent", () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContactDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

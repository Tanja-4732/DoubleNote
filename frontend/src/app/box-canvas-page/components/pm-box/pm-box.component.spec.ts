import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PmBoxComponent } from "./pm-box.component";

describe("PmBoxComponent", () => {
  let component: PmBoxComponent;
  let fixture: ComponentFixture<PmBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PmBoxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

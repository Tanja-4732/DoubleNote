import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PeersComponent } from "./connections.component";

describe("ConnectionsComponent", () => {
  let component: PeersComponent;
  let fixture: ComponentFixture<PeersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PeersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

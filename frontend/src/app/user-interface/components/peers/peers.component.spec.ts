import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PeersComponent } from "./connections.component";

describe("ConnectionsComponent", () => {
  let component: PeersComponent;
  let fixture: ComponentFixture<PeersComponent>;

  beforeEach(async(() => {
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

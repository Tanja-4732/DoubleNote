import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoxCanvasPageComponent } from './box-canvas-page.component';

describe('BoxCanvasPageComponent', () => {
  let component: BoxCanvasPageComponent;
  let fixture: ComponentFixture<BoxCanvasPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxCanvasPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxCanvasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

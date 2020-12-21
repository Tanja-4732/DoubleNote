import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrumbTrailComponent } from './crumb-trail.component';

describe('CrumbTrailComponent', () => {
  let component: CrumbTrailComponent;
  let fixture: ComponentFixture<CrumbTrailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrumbTrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrumbTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

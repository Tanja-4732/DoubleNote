import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateBranchComponent } from './create-branch.component';

describe('CreateBranchComponent', () => {
  let component: CreateBranchComponent;
  let fixture: ComponentFixture<CreateBranchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

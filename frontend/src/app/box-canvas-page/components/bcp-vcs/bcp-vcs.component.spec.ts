import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BcpVcsComponent } from './bcp-vcs.component';

describe('BcpVcsComponent', () => {
  let component: BcpVcsComponent;
  let fixture: ComponentFixture<BcpVcsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BcpVcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpVcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

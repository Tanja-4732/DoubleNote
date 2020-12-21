import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BcpTreeComponent } from './bcp-tree.component';

describe('BcpTreeComponent', () => {
  let component: BcpTreeComponent;
  let fixture: ComponentFixture<BcpTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BcpTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

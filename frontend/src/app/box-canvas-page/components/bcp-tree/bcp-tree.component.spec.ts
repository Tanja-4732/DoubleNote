import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpTreeComponent } from './bcp-tree.component';

describe('BcpTreeComponent', () => {
  let component: BcpTreeComponent;
  let fixture: ComponentFixture<BcpTreeComponent>;

  beforeEach(async(() => {
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

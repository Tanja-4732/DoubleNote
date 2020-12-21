import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BcpNotebookComponent } from './bcp-notebook.component';

describe('BcpNotebookComponent', () => {
  let component: BcpNotebookComponent;
  let fixture: ComponentFixture<BcpNotebookComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BcpNotebookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
